import { useState, useEffect, useCallback } from 'react';
import { ArrowUp, RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react';
import type { Product, CategoryFilter } from '@/types';
import { CartProvider } from '@/context/CartContext';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { CategorySection } from '@/components/CategorySection';
import { ProductGrid } from '@/components/ProductGrid';
import { CartDrawer } from '@/components/CartDrawer';
import { Footer } from '@/components/Footer';
import { supabase } from '@/lib/supabase';

function Store() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [syncMsg, setSyncMsg] = useState<{ text: string; ok: boolean } | null>(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: fnError } = await supabase.functions.invoke('aliexpress-proxy', {
        method: 'POST',
        body: { action: 'list' },
      });

      if (fnError) throw fnError;
      if (data?.error) throw new Error(data.error);
      setProducts(data?.products || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load products');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    const handler = () => setShowScrollTop(window.scrollY > 600);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const handleSync = async () => {
    setSyncing(true);
    setSyncMsg(null);
    try {
      const categories: ('cat' | 'dog')[] = ['cat', 'dog'];
      let totalSynced = 0;
      let syncError: string | null = null;

      for (const cat of categories) {
        const { data, error: fnError } = await supabase.functions.invoke('aliexpress-proxy', {
          method: 'POST',
          body: { action: 'sync', category: cat, keyword: 'pet' },
        });

        if (fnError) {
          syncError = fnError.message;
          continue;
        }
        if (data?.error) {
          syncError = data.error;
          continue;
        }
        if (data?.synced) totalSynced += data.synced;
      }

      if (syncError && totalSynced === 0) {
        setSyncMsg({ text: `Sync failed: ${syncError}`, ok: false });
      } else {
        setSyncMsg({ text: `Synced ${totalSynced} live products from AliExpress!`, ok: true });
        await fetchProducts();
      }
      setTimeout(() => setSyncMsg(null), 5000);
    } catch (err) {
      setSyncMsg({
        text: err instanceof Error ? err.message : 'Sync failed — check if AliExpress API credentials are configured.',
        ok: false,
      });
      setTimeout(() => setSyncMsg(null), 5000);
    } finally {
      setSyncing(false);
    }
  };

  const handleCategoryChange = (cat: CategoryFilter) => {
    setActiveCategory(cat);
    setSearchQuery('');
    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleShopNow = (category: 'cat' | 'dog' | 'all') => {
    setActiveCategory(category);
    setTimeout(() => {
      document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col">
      <Header
        onCartClick={() => setCartOpen(true)}
        onCategoryChange={handleCategoryChange}
        activeCategory={activeCategory}
        onSearch={setSearchQuery}
        searchQuery={searchQuery}
      />

      <main className="flex-1">
        <Hero onShopNow={handleShopNow} />
        <CategorySection onSelect={handleShopNow} />

        {/* Sync bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-4 mb-4">
          <div className="flex items-center justify-between bg-white rounded-2xl border border-stone-200 p-3 px-5">
            <div className="flex items-center gap-3">
              <div className={`w-2.5 h-2.5 rounded-full ${products.length > 0 ? 'bg-green-500' : 'bg-amber-400'} animate-pulse`} />
              <span className="text-sm text-stone-600 font-medium">
                {products.length > 0
                  ? `${products.length} live products from AliExpress`
                  : 'No products yet — sync from AliExpress to populate the store'}
              </span>
            </div>
            <button
              onClick={handleSync}
              disabled={syncing}
              className="flex items-center gap-2 px-4 py-2 bg-stone-900 text-white rounded-lg text-sm font-semibold hover:bg-brand-600 transition-colors disabled:opacity-60"
            >
              <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
              {syncing ? 'Syncing...' : 'Sync AliExpress'}
            </button>
          </div>
        </div>

        {/* Sync message toast */}
        {syncMsg && (
          <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 animate-slide-up">
            <div className={`flex items-center gap-2 px-5 py-3 rounded-xl shadow-xl text-sm font-semibold ${
              syncMsg.ok ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              {syncMsg.ok ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
              {syncMsg.text}
            </div>
          </div>
        )}

        {loading ? (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="text-center mb-8">
              <h2 className="font-display text-3xl font-extrabold text-stone-900 mb-2">Loading Products...</h2>
              <p className="text-stone-500">Fetching the best products from AliExpress.</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl border border-stone-200 overflow-hidden animate-pulse">
                  <div className="aspect-square bg-stone-200" />
                  <div className="p-4 space-y-2">
                    <div className="h-3 bg-stone-200 rounded w-1/3" />
                    <div className="h-4 bg-stone-200 rounded w-full" />
                    <div className="h-4 bg-stone-200 rounded w-2/3" />
                    <div className="h-6 bg-stone-200 rounded w-1/2 mt-3" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : error ? (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
            <h2 className="font-display text-2xl font-bold text-stone-900 mb-2">Something went wrong</h2>
            <p className="text-stone-500 mb-6">{error}</p>
            <button
              onClick={fetchProducts}
              className="px-6 py-3 bg-brand-600 text-white rounded-xl font-bold text-sm hover:bg-brand-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : (
          <ProductGrid products={products} activeCategory={activeCategory} searchQuery={searchQuery} />
        )}
      </main>

      <Footer />

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />

      {/* Scroll to top */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 w-11 h-11 bg-stone-900 text-white rounded-full shadow-xl flex items-center justify-center hover:bg-brand-600 transition-colors z-30 animate-scale-in"
          aria-label="Scroll to top"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}

export default function App() {
  return (
    <CartProvider>
      <Store />
    </CartProvider>
  );
}
