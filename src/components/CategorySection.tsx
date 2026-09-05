import { Cat, Dog, PawPrint, Truck, Shield, RefreshCw, Headphones } from 'lucide-react';

interface CategorySectionProps {
  onSelect: (cat: 'cat' | 'dog') => void;
}

export function CategorySection({ onSelect }: CategorySectionProps) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
        {/* Cat card */}
        <button
          onClick={() => onSelect('cat')}
          className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-500 to-brand-700 p-8 lg:p-12 text-left hover:shadow-2xl transition-all hover:-translate-y-1"
        >
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-2xl" />
          <div className="relative">
            <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Cat className="w-7 h-7 text-white" />
            </div>
            <h3 className="font-display text-2xl lg:text-3xl font-extrabold text-white mb-2">
              For Cats
            </h3>
            <p className="text-white/80 text-sm lg:text-base mb-4 max-w-xs">
              Toys, scratching posts, cozy beds, grooming tools & everything your feline friend needs.
            </p>
            <span className="inline-flex items-center gap-1.5 text-sm font-bold text-white">
              Explore Collection
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </span>
          </div>
          <PawPrint className="absolute bottom-4 right-4 w-20 h-20 text-white/10" />
        </button>

        {/* Dog card */}
        <button
          onClick={() => onSelect('dog')}
          className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-500 to-amber-700 p-8 lg:p-12 text-left hover:shadow-2xl transition-all hover:-translate-y-1"
        >
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-2xl" />
          <div className="relative">
            <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Dog className="w-7 h-7 text-white" />
            </div>
            <h3 className="font-display text-2xl lg:text-3xl font-extrabold text-white mb-2">
              For Dogs
            </h3>
            <p className="text-white/80 text-sm lg:text-base mb-4 max-w-xs">
              Chew toys, harnesses, orthopedic beds, food bowls & accessories for every breed.
            </p>
            <span className="inline-flex items-center gap-1.5 text-sm font-bold text-white">
              Explore Collection
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </span>
          </div>
          <PawPrint className="absolute bottom-4 right-4 w-20 h-20 text-white/10" />
        </button>
      </div>

      {/* Features bar */}
      <div className="mt-12 lg:mt-16 grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {[
          { icon: Truck, title: 'Free Shipping', desc: 'On orders over $49' },
          { icon: RefreshCw, title: '30-Day Returns', desc: 'Hassle-free returns' },
          { icon: Shield, title: 'Secure Payment', desc: 'Encrypted checkout' },
          { icon: Headphones, title: '24/7 Support', desc: 'Always here to help' },
        ].map(({ icon: Icon, title, desc }) => (
          <div key={title} className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-stone-200">
            <div className="w-11 h-11 bg-brand-50 rounded-xl flex items-center justify-center shrink-0">
              <Icon className="w-5 h-5 text-brand-600" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-stone-900 truncate">{title}</p>
              <p className="text-xs text-stone-500 truncate">{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
