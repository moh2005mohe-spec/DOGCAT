import { useState, useEffect } from 'react';
import { ArrowRight, Sparkles, Truck, Shield, Heart } from 'lucide-react';

const slides = [
  {
    badge: 'New Arrivals',
    title: 'Everything Your Pet Deserves',
    subtitle: 'Premium toys, beds, food & accessories for cats and dogs. Curated by pet lovers, loved by pets.',
    image: 'https://images.pexels.com/photos/16764535/pexels-photo-16764535.jpeg?auto=compress&cs=tinysrgb&w=1200',
    cta: 'Shop Cats',
    category: 'cat' as const,
    bg: 'from-brand-600 via-brand-700 to-brand-900',
  },
  {
    badge: 'Best Sellers',
    title: 'Spoil Your Best Friend',
    subtitle: 'Top-rated products that dogs actually love. From chew toys to orthopedic beds, we have it all.',
    image: 'https://images.pexels.com/photos/14084426/pexels-photo-14084426.jpeg?auto=compress&cs=tinysrgb&w=1200',
    cta: 'Shop Dogs',
    category: 'dog' as const,
    bg: 'from-amber-600 via-amber-700 to-amber-900',
  },
  {
    badge: 'Limited Time',
    title: 'Up to 40% Off Premium Gear',
    subtitle: 'Upgrade your pet\'s daily life with our hand-picked collection. Free shipping on orders over $49.',
    image: 'https://images.pexels.com/photos/31308251/pexels-photo-31308251.jpeg?auto=compress&cs=tinysrgb&w=1200',
    cta: 'Shop All',
    category: 'all' as const,
    bg: 'from-stone-700 via-stone-800 to-stone-900',
  },
];

interface HeroProps {
  onShopNow: (category: 'cat' | 'dog' | 'all') => void;
}

export function Hero({ onShopNow }: HeroProps) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const slide = slides[current];

  return (
    <section className={`relative overflow-hidden bg-gradient-to-br ${slide.bg} transition-all duration-700`}>
      {/* Decorative shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -left-32 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 right-1/3 w-72 h-72 bg-white/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 items-center py-12 lg:py-20">
          {/* Text content */}
          <div className="text-white space-y-6 animate-fade-in" key={current}>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/15 backdrop-blur-sm rounded-full text-sm font-semibold">
              <Sparkles className="w-4 h-4 text-accent-300" />
              {slide.badge}
            </div>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.1] text-balance">
              {slide.title}
            </h1>
            <p className="text-lg text-white/80 max-w-lg leading-relaxed">
              {slide.subtitle}
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <button
                onClick={() => onShopNow(slide.category)}
                className="group inline-flex items-center gap-2 px-6 py-3.5 bg-white text-stone-900 rounded-xl font-bold text-sm hover:bg-stone-100 transition-all hover:scale-105 shadow-xl"
              >
                {slide.cta}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => onShopNow('all')}
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-white/10 backdrop-blur-sm text-white border border-white/20 rounded-xl font-bold text-sm hover:bg-white/20 transition-all"
              >
                Browse All
              </button>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap gap-6 pt-6">
              {[
                { icon: Truck, label: 'Free Shipping $49+' },
                { icon: Shield, label: '30-Day Returns' },
                { icon: Heart, label: 'Loved by 50K+ Pets' },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2 text-sm text-white/70">
                  <Icon className="w-4 h-4" />
                  {label}
                </div>
              ))}
            </div>
          </div>

          {/* Image */}
          <div className="relative hidden lg:block animate-scale-in" key={`img-${current}`}>
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <img
                src={slide.image}
                alt="Pets"
                className="w-full h-[440px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
            {/* Floating badge */}
            <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-xl p-4 flex items-center gap-3 animate-bounce-subtle">
              <div className="w-10 h-10 bg-accent-100 rounded-full flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-accent-600" />
              </div>
              <div>
                <p className="text-xs text-stone-500 font-medium">Rated</p>
                <p className="text-sm font-bold text-stone-900">4.8/5 Stars</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Slide indicators */}
      <div className="relative flex justify-center gap-2 pb-6">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-2 rounded-full transition-all ${
              i === current ? 'w-8 bg-white' : 'w-2 bg-white/40'
            }`}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
