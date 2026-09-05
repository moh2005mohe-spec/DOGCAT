import { useState, useMemo } from 'react';
import { SlidersHorizontal, PackageX, RefreshCw } from 'lucide-react';
import type { Product, CategoryFilter, SubcategoryFilter } from '@/types';
import { ProductCard } from './ProductCard';

interface ProductGridProps {
  products: Product[];
  activeCategory: CategoryFilter;
  searchQuery: string;
  onSync?: () => void;
  syncing?: boolean;
}

const subcategoryLabels: Record<SubcategoryFilter, string> = {
  all: 'All Products',
  toys: 'Toys',
  beds: 'Beds',
  food: 'Food & Bowls',
  accessories: 'Accessories',
  grooming: 'Grooming',
  furniture: 'Furniture',
};

const subcategoryOrder: SubcategoryFilter[] = ['all', 'toys', 'beds', 'food', 'accessories', 'grooming', 'furniture'];

type SortOption = 'featured' | 'price-low' | 'price-high' | 'rating' | 'best-selling';

const sortLabels: Record<SortOption, string> = {
  featured: 'Featured',
  'price-low': 'Price: Low to High',
  'price-high': 'Price: High to Low',
  rating: 'Top Rated',
  'best-selling': 'Best Selling',
};

export function ProductGrid({ products, activeCategory, searchQuery, onSync, syncing }: ProductGridProps) {
  const [subcategory, setSubcategory] = useState<SubcategoryFilter>('all');
  const [sort, setSort] = useState<SortOption>('featured');

  const filtered = useMemo(() => {
    let result = [...products];

    if (activeCategory !== 'all') {
      result = result.filter(p => p.category === activeCategory);
    }

    if (subcategory !== 'all') {
      result = result.filter(p => p.subcategory === subcategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.subcategory.toLowerCase().includes(q)
      );
    }

    switch (sort) {
      case 'price-low':
        result.sort((a, b) => Number(a.price) - Number(b.price));
        break;
      case 'price-high':
        result.sort((a, b) => Number(b.price) - Number(a.price));
        break;
      case 'rating':
        result.sort((a, b) => Number(b.rating) - Number(a.rating));
        break;
      case 'best-selling':
        result.sort((a, b) => b.orders_count - a.orders_count);
        break;
      case 'featured':
      default:
        result.sort((a, b) => {
          if (a.is_featured && !b.is_featured) return -1;
          if (!a.is_featured && b.is_featured) return 1;
          return b.orders_count - a.orders_count;
        });
    }

    return result;
  }, [products, activeCategory, subcategory, searchQuery, sort]);

  const availableSubcategories = useMemo(() => {
    const base = activeCategory === 'all' ? products : products.filter(p => p.category === activeCategory);
    const subs = new Set(base.map(p => p.subcategory));
    return subcategoryOrder.filter(s => s === 'all' || subs.has(s));
  }, [products, activeCategory]);

  return (
    <section id="products" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
      {/* Section header */}
      <div className="text-center mb-8">
        <h2 className="font-display text-3xl lg:text-4xl font-extrabold text-stone-900 mb-2">
          {activeCategory === 'cat' ? 'Cat Collection' : activeCategory === 'dog' ? 'Dog Collection' : 'All Products'}
        </h2>
        <p className="text-stone-500 text-sm lg:text-base">
          {filtered.length} {filtered.length === 1 ? 'product' : 'products'} found
          {searchQuery && ` for "${searchQuery}"`}
        </p>
      </div>

      {/* Filters bar */}
      <div className="flex flex-col lg:flex-row gap-4 mb-8">
        {/* Subcategory pills */}
        <div className="flex-1 flex items-center gap-2 overflow-x-auto scrollbar-hide pb-2 lg:pb-0">
          <SlidersHorizontal className="w-4 h-4 text-stone-400 shrink-0" />
          {availableSubcategories.map(sub => (
            <button
              key={sub}
              onClick={() => setSubcategory(sub)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-all ${
                subcategory === sub
                  ? 'bg-stone-900 text-white'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {subcategoryLabels[sub]}
            </button>
          ))}
        </div>

        {/* Sort dropdown */}
        <div className="shrink-0">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOption)}
            className="px-4 py-2.5 bg-white border border-stone-200 rounded-lg text-sm font-semibold text-stone-700 focus:outline-none focus:border-brand-400 cursor-pointer"
          >
            {(Object.keys(sortLabels) as SortOption[]).map(opt => (
              <option key={opt} value={opt}>{sortLabels[opt]}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Products grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
          {filtered.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-3xl border border-stone-200 p-8 shadow-sm">
          <div className="w-20 h-20 bg-stone-100 rounded-2xl flex items-center justify-center mb-4 text-stone-400">
            <PackageX className="w-10 h-10" />
          </div>
          <h3 className="font-display text-xl font-bold text-stone-900 mb-2">No AliExpress Products Found</h3>
          <p className="text-sm text-stone-500 max-w-md mb-6 leading-relaxed">
            {products.length === 0
              ? "There are currently no products in the database. Click the button below to sync live pet products directly from AliExpress."
              : "No products matched your selected category or search criteria."}
          </p>
          {onSync && (
            <button
              onClick={onSync}
              disabled={syncing}
              className="inline-flex items-center gap-2 px-6 py-3 bg-brand-600 text-white rounded-xl font-bold text-sm hover:bg-brand-700 transition-all shadow-md disabled:opacity-60"
            >
              <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
              {syncing ? 'Syncing AliExpress...' : 'Sync Products from AliExpress'}
            </button>
          )}
        </div>
      )}
    </section>
  );
}
