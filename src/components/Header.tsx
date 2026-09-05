import { Cat, Dog, ShoppingCart, Menu, X, Search, RefreshCw } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import type { CategoryFilter } from '@/types';

interface HeaderProps {
  onCartClick: () => void;
  onCategoryChange: (cat: CategoryFilter) => void;
  activeCategory: CategoryFilter;
  onSearch: (query: string) => void;
  searchQuery: string;
  onSync?: () => void;
  syncing?: boolean;
}

export function Header({
  onCartClick,
  onCategoryChange,
  activeCategory,
  onSearch,
  searchQuery,
  onSync,
  syncing,
}: HeaderProps) {
  const { totalItems } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems: { label: string; value: CategoryFilter; icon: typeof Cat }[] = [
    { label: 'All Pets', value: 'all', icon: Search },
    { label: 'Cats', value: 'cat', icon: Cat },
    { label: 'Dogs', value: 'dog', icon: Dog },
  ];

  return (
    <>
      {/* Announcement bar */}
      <div className="bg-stone-900 text-stone-100 text-center text-xs sm:text-sm py-2.5 px-4 font-medium tracking-wide flex items-center justify-center gap-2">
        <span>Free worldwide shipping on orders over $49 — Direct from AliExpress sellers</span>
      </div>

      {/* Main header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20 gap-4">
            {/* Logo */}
            <button
              onClick={() => onCategoryChange('all')}
              className="flex items-center gap-2.5 shrink-0 group text-left"
            >
              <div className="w-10 h-10 lg:w-11 lg:h-11 bg-gradient-to-br from-brand-600 to-brand-800 rounded-2xl flex items-center justify-center shadow-md shadow-brand-600/20 group-hover:scale-105 transition-transform">
                <Cat className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="font-display text-xl lg:text-2xl font-extrabold text-stone-900 block leading-tight">
                  Pawsome
                </span>
                <span className="text-[10px] font-semibold tracking-wider text-brand-600 uppercase block">
                  AliExpress Store
                </span>
              </div>
            </button>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map(({ label, value, icon: Icon }) => (
                <button
                  key={value}
                  onClick={() => onCategoryChange(value)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                    activeCategory === value
                      ? 'bg-brand-50 text-brand-700 shadow-sm'
                      : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              ))}
            </nav>

            {/* Search */}
            <div className="hidden lg:flex flex-1 max-w-xs">
              <div className="relative w-full">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => onSearch(e.target.value)}
                  placeholder="Search AliExpress pet products..."
                  className="w-full pl-10 pr-4 py-2 text-sm bg-stone-100 border border-stone-200 rounded-xl focus:outline-none focus:bg-white focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10 transition-all"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {onSync && (
                <button
                  onClick={onSync}
                  disabled={syncing}
                  className="hidden sm:inline-flex items-center gap-2 px-3.5 py-2 bg-stone-900 text-white rounded-xl text-xs font-bold hover:bg-brand-600 transition-all disabled:opacity-60 shadow-sm"
                  title="Sync Products from AliExpress"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin' : ''}`} />
                  <span>{syncing ? 'Syncing...' : 'Sync AliExpress'}</span>
                </button>
              )}

              {/* Cart */}
              <button
                onClick={onCartClick}
                className="relative p-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 transition-colors group"
                aria-label="Open cart"
              >
                <ShoppingCart className="w-5 h-5 group-hover:text-brand-600 transition-colors" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-accent-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center animate-scale-in shadow-md">
                    {totalItems}
                  </span>
                )}
              </button>

              {/* Mobile menu button */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden p-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 transition-colors"
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile nav */}
        {mobileOpen && (
          <div className="md:hidden border-t border-stone-200 bg-white animate-slide-up">
            <div className="px-4 py-4 space-y-2">
              <div className="relative mb-3">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => onSearch(e.target.value)}
                  placeholder="Search products..."
                  className="w-full pl-9 pr-4 py-2.5 text-sm bg-stone-100 border border-transparent rounded-lg focus:outline-none focus:bg-white focus:border-brand-300 transition-all"
                />
              </div>
              {navItems.map(({ label, value, icon: Icon }) => (
                <button
                  key={value}
                  onClick={() => {
                    onCategoryChange(value);
                    setMobileOpen(false);
                  }}
                  className={`flex items-center gap-2 w-full px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                    activeCategory === value
                      ? 'bg-brand-50 text-brand-700'
                      : 'text-stone-600 hover:bg-stone-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              ))}
            </div>
          </div>
        )}
      </header>
    </>
  );
}
