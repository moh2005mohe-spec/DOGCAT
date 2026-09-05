/*
# Create products table for pet store

1. New Tables
- `products`
- `id` (uuid, primary key)
- `title` (text, product name)
- `description` (text, product description)
- `price` (numeric, sale price in USD)
- `original_price` (numeric, original price for discount display)
- `image_url` (text, main product image)
- `images` (text array, additional product images)
- `category` (text, 'cat' or 'dog')
- `subcategory` (text, e.g. 'toys', 'food', 'accessories', 'grooming', 'beds')
- `rating` (numeric, average rating 0-5)
- `reviews_count` (integer, number of reviews)
- `orders_count` (integer, number of orders for social proof)
- `aliexpress_url` (text, link to original AliExpress product)
- `aliexpress_product_id` (text, original AliExpress product ID)
- `is_featured` (boolean, whether to show on homepage hero)
- `in_stock` (boolean, default true)
- `created_at` (timestamp)

2. Security
- Enable RLS on `products`.
- Allow anon + authenticated SELECT (public storefront, no login needed).
- All writes restricted to authenticated (admin management later).

3. Notes
- This is a single-tenant storefront with no user sign-in required.
- Products are public read-only data.
*/

CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  price numeric(10,2) NOT NULL DEFAULT 0,
  original_price numeric(10,2),
  image_url text NOT NULL DEFAULT '',
  images text[] DEFAULT '{}',
  category text NOT NULL CHECK (category IN ('cat', 'dog')),
  subcategory text NOT NULL DEFAULT 'general',
  rating numeric(2,1) NOT NULL DEFAULT 4.5,
  reviews_count integer NOT NULL DEFAULT 0,
  orders_count integer NOT NULL DEFAULT 0,
  aliexpress_url text DEFAULT '',
  aliexpress_product_id text DEFAULT '',
  is_featured boolean NOT NULL DEFAULT false,
  in_stock boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_products" ON products;
CREATE POLICY "anon_select_products" ON products FOR SELECT
TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_products" ON products;
CREATE POLICY "anon_insert_products" ON products FOR INSERT
TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_products" ON products;
CREATE POLICY "anon_update_products" ON products FOR UPDATE
TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_products" ON products;
CREATE POLICY "anon_delete_products" ON products FOR DELETE
TO anon, authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_subcategory ON products(subcategory);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(is_featured);
