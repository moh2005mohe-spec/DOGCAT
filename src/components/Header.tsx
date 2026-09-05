import { Cat, Dog, ShoppingCart, Menu, X, Search } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import type { CategoryFilter } from '@/types';

interface HeaderProps {
  onCartClick: () => void;
  onCategoryChange: (cat: CategoryFilter) => void;
  activeCategory: CategoryFilter;
  onSearch: (query: string) => void;
  searchQuery: string;
}

export function Header({ onCartClick, onCategoryChange, activeCategory, onSearch, searchQuery }: HeaderProps) {
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
      <div className="bg-stone-900 text-stone-100 text-center text-xs sm:text-sm py-2.5 px-4 font-medium tracking-wide">
        Free worldwide shipping on orders over $49 — Shop now and save up to 40%
      </div>

      {/* Main header */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20 gap-4">
            {/* Logo */}
            <button
              onClick={() => onCategoryChange('all')}
              className="flex items-center gap-2 shrink-0 group"
            >
              <div className="w-10 h-10 lg:w-11 lg:h-11 bg-gradient-to-br from-brand-500 to-brand-700 rounded-xl flex items-center justify-center shadow-lg shadow-brand-500/20 group-hover:scale-105 transition-transform">
                <Cat className="w-6 h-6 text-white" />
              </div>
              <span className="font-display text-xl lg:text-2xl font-extrabold text-stone-900 hidden sm:block">
                Pawsome
              </span>
            </button>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map(({ label, value, icon: Icon }) => (
                <button
                  key={value}
                  onClick={() => onCategoryChange(value)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                    activeCategory === value
                      ? 'bg-brand-50 text-brand-700'
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
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => onSearch(e.target.value)}
                  placeholder="Search products..."
                  className="w-full pl-9 pr-4 py-2 text-sm bg-stone-100 border border-transparent rounded-lg focus:outline-none focus:bg-white focus:border-brand-300 transition-all"
                />
              </div>
            </div>

            {/* Cart */}
            <button
              onClick={onCartClick}
              className="relative p-2.5 rounded-lg hover:bg-stone-100 transition-colors group"
              aria-label="Open cart"
            >
              <ShoppingCart className="w-6 h-6 text-stone-700 group-hover:text-brand-600 transition-colors" />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-accent-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center animate-scale-in shadow-md">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-stone-100 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
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
