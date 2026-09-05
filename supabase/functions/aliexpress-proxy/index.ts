import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);

    // Read params from query string OR from request body
    let action = url.searchParams.get("action") || "list";
    let category = url.searchParams.get("category") || "";
    let keyword = url.searchParams.get("keyword") || "pet";
    let page = url.searchParams.get("page") || "1";

    // If there's a body, try to read params from it
    if (req.method === "POST" || req.body) {
      try {
        const body = await req.json();
        if (body.action) action = body.action;
        if (body.category) category = body.category;
        if (body.keyword) keyword = body.keyword;
        if (body.page) page = String(body.page);
      } catch {
        // Body wasn't JSON, that's fine — use query params
      }
    }

    if (action === "list") {
      let query = supabase
        .from("products")
        .select("*")
        .order("is_featured", { ascending: false })
        .order("orders_count", { ascending: false });

      if (category === "cat" || category === "dog") {
        query = query.eq("category", category);
      }

      const { data, error: dbError } = await query.limit(60);

      if (dbError) {
        return new Response(
          JSON.stringify({ products: [], source: "database", error: dbError.message }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({ products: data || [], source: "database" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (action === "sync") {
      const appKey = Deno.env.get("ALIEXPRESS_APP_KEY");
      const appSecret = Deno.env.get("ALIEXPRESS_APP_SECRET");

      if (!appKey || !appSecret) {
        return new Response(
          JSON.stringify({
            synced: 0,
            error: "AliExpress API credentials not configured. Set ALIEXPRESS_APP_KEY and ALIEXPRESS_APP_SECRET as edge function secrets in the Supabase dashboard.",
          }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const searchKeyword =
        category === "cat" ? `cat ${keyword}` :
        category === "dog" ? `dog ${keyword}` :
        keyword;

      // Build TOP SDK signature (MD5)
      const timestamp = new Date().toISOString().replace("T", " ").substring(0, 19);

      const apiParams: Record<string, string> = {
        app_key: appKey,
        method: "aliexpress.affiliate.product.query",
        format: "json",
        v: "2.0",
        sign_method: "md5",
        timestamp: timestamp,
        keywords: searchKeyword,
        page_size: "50",
        page_no: page,
        target_currency: "USD",
        target_language: "EN",
        tracking_id: "pawsome",
        sort: "ordersdesc",
      };

      // Generate MD5 signature: appSecret + sorted(key+value pairs) + appSecret
      const sortedKeys = Object.keys(apiParams).sort();
      let signString = appSecret;
      for (const key of sortedKeys) {
        signString += `${key}${apiParams[key]}`;
      }
      signString += appSecret;

      const msgBuffer = new TextEncoder().encode(signString);
      const hashBuffer = await crypto.subtle.digest("MD5", msgBuffer);
      const signature = Array.from(new Uint8Array(hashBuffer))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("")
        .toUpperCase();

      apiParams.sign = signature;

      // Build query string
      const queryString = Object.entries(apiParams)
        .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
        .join("&");

      const apiUrl = `https://api-sg.aliexpress.com/sync?${queryString}`;
      const response = await fetch(apiUrl);
      const data = await response.json();

      // Parse AliExpress response — handle multiple possible response shapes
      const productsRaw =
        data?.aliexpress_affiliate_product_query_response?.resp_result?.result?.products?.product ||
        data?.aliexpress_affiliate_product_query_response?.products?.product ||
        [];

      const productsArray = Array.isArray(productsRaw) ? productsRaw : [productsRaw].filter(Boolean);

      const productsToInsert = productsArray
        .map((p: any) => {
          const petCategory = category === "cat" || category === "dog" ? category : "cat";
          const title = p.product_title || p.title || "";
          const desc = p.product_title || p.title || "";
          const salePrice = parseFloat(p.target_sale_price || p.sale_price || "0");
          const originalPrice = parseFloat(p.target_original_price || p.original_price || "0");
          const imageUrl = p.product_main_image_url || p.image_url || "";
          const allImages = p.product_small_image_urls?.string || (imageUrl ? [imageUrl] : []);
          const ratingVal = parseFloat(p.evaluation_rating_star || p.rating || "4.5");
          const reviews = parseInt(String(p.evaluation_count || p.orders || "0"), 10) || 0;
          const orders = parseInt(String(p.orders || p.sale_count || "0"), 10) || 0;
          const itemId = String(p.product_id || p.item_id || "");
          const promoLink = p.promotion_link || p.product_url || `https://www.aliexpress.com/item/${itemId}.html`;

          return {
            title,
            description: desc,
            price: salePrice || 0,
            original_price: originalPrice > salePrice ? originalPrice : null,
            image_url: imageUrl,
            images: allImages,
            category: petCategory,
            subcategory: "general",
            rating: ratingVal || 4.5,
            reviews_count: reviews,
            orders_count: orders,
            aliexpress_url: promoLink,
            aliexpress_product_id: itemId,
            is_featured: orders > 1000,
            in_stock: true,
          };
        })
        .filter((p: any) => p.title && p.image_url && p.price > 0);

      if (productsToInsert.length > 0) {
        // Delete old products for this category, then insert new ones
        if (category === "cat" || category === "dog") {
          await supabase.from("products").delete().eq("category", category);
        } else {
          await supabase.from("products").delete().neq("id", "00000000-0000-0000-0000-000000000000");
        }

        const { error: insertError } = await supabase
          .from("products")
          .insert(productsToInsert);

        if (insertError) {
          throw new Error(`Failed to store products: ${insertError.message}`);
        }
      }

      return new Response(
        JSON.stringify({
          success: true,
          synced: productsToInsert.length,
          source: "aliexpress",
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ error: "Unknown action. Use action=list or action=sync" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err.message || "Unknown error", products: [] }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
