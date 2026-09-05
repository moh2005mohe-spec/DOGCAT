import { Cat, Dog, PawPrint, Mail, Facebook, Instagram, Twitter } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-stone-900 text-stone-300">
      {/* Newsletter */}
      <div className="border-b border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="font-display text-2xl font-extrabold text-white mb-2">
                Join the Pawsome Family
              </h3>
              <p className="text-stone-400 text-sm">
                Subscribe for exclusive deals, pet care tips, and new product alerts. Get 10% off your first order.
              </p>
            </div>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-stone-800 border border-stone-700 rounded-xl text-sm text-white placeholder-stone-500 focus:outline-none focus:border-brand-500 transition-colors"
              />
              <button className="px-6 py-3 bg-brand-600 text-white rounded-xl font-bold text-sm hover:bg-brand-700 transition-colors whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-brand-500 to-brand-700 rounded-xl flex items-center justify-center">
                <Cat className="w-5 h-5 text-white" />
              </div>
              <span className="font-display text-xl font-extrabold text-white">Pawsome</span>
            </div>
            <p className="text-sm text-stone-400 leading-relaxed mb-4">
              Premium pet products for cats and dogs. Curated by pet lovers, loved by pets worldwide.
            </p>
            <div className="flex gap-2">
              {[Facebook, Instagram, Twitter].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 bg-stone-800 rounded-lg flex items-center justify-center hover:bg-brand-600 transition-colors"
                  aria-label="Social link"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-bold text-white text-sm mb-4">Shop</h4>
            <ul className="space-y-2.5 text-sm">
              <li><a href="#" className="hover:text-brand-400 transition-colors flex items-center gap-1.5"><Cat className="w-3.5 h-3.5" /> Cat Products</a></li>
              <li><a href="#" className="hover:text-brand-400 transition-colors flex items-center gap-1.5"><Dog className="w-3.5 h-3.5" /> Dog Products</a></li>
              <li><a href="#" className="hover:text-brand-400 transition-colors">New Arrivals</a></li>
              <li><a href="#" className="hover:text-brand-400 transition-colors">Best Sellers</a></li>
              <li><a href="#" className="hover:text-brand-400 transition-colors">On Sale</a></li>
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="font-bold text-white text-sm mb-4">Help</h4>
            <ul className="space-y-2.5 text-sm">
              <li><a href="#" className="hover:text-brand-400 transition-colors">Shipping Info</a></li>
              <li><a href="#" className="hover:text-brand-400 transition-colors">Returns & Refunds</a></li>
              <li><a href="#" className="hover:text-brand-400 transition-colors">Track Your Order</a></li>
              <li><a href="#" className="hover:text-brand-400 transition-colors">FAQ</a></li>
              <li><a href="#" className="hover:text-brand-400 transition-colors">Contact Us</a></li>
            </ul>
          </div>

          {/* About */}
          <div>
            <h4 className="font-bold text-white text-sm mb-4">Company</h4>
            <ul className="space-y-2.5 text-sm">
              <li><a href="#" className="hover:text-brand-400 transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-brand-400 transition-colors">Our Mission</a></li>
              <li><a href="#" className="hover:text-brand-400 transition-colors">Sustainability</a></li>
              <li><a href="#" className="hover:text-brand-400 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-brand-400 transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-stone-500 flex items-center gap-1.5">
            <PawPrint className="w-3.5 h-3.5" />
            © 2026 Pawsome. All rights reserved. Made with love for pets.
          </p>
          <div className="flex items-center gap-3 text-xs text-stone-500">
            <span>We accept:</span>
            <div className="flex gap-1.5">
              {['VISA', 'MC', 'AMEX', 'PP'].map(p => (
                <span key={p} className="px-2 py-1 bg-stone-800 rounded text-[10px] font-bold text-stone-400">{p}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
