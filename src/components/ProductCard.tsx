import { Star, Plus, Check } from 'lucide-react';
import { useState } from 'react';
import type { Product } from '@/types';
import { useCart } from '@/context/CartContext';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const discount = product.original_price
    ? Math.round(((Number(product.original_price) - Number(product.price)) / Number(product.original_price)) * 100)
    : 0;

  const handleAdd = () => {
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="group bg-white rounded-2xl border border-stone-200 overflow-hidden hover:shadow-xl hover:border-stone-300 transition-all duration-300 hover:-translate-y-1 flex flex-col">
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-stone-100">
        <img
          src={product.image_url}
          alt={product.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {discount > 0 && (
            <span className="px-2.5 py-1 bg-accent-500 text-white text-xs font-bold rounded-lg shadow-md">
              -{discount}%
            </span>
          )}
          {product.is_featured && (
            <span className="px-2.5 py-1 bg-brand-600 text-white text-xs font-bold rounded-lg shadow-md">
              Featured
            </span>
          )}
        </div>
        {/* Category tag */}
        <div className="absolute top-3 right-3">
          <span className="px-2.5 py-1 bg-white/90 backdrop-blur-sm text-stone-700 text-xs font-semibold rounded-lg capitalize">
            {product.category}
          </span>
        </div>
        {!product.in_stock && (
          <div className="absolute inset-0 bg-stone-900/50 flex items-center justify-center">
            <span className="text-white font-bold text-lg">Out of Stock</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        {/* Rating */}
        <div className="flex items-center gap-1.5 mb-2">
          <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map(i => (
              <Star
                key={i}
                className={`w-3.5 h-3.5 ${
                  i <= Math.round(product.rating)
                    ? 'text-accent-400 fill-accent-400'
                    : 'text-stone-300'
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-stone-500 font-medium">
            {product.rating} ({product.reviews_count.toLocaleString()})
          </span>
        </div>

        {/* Title */}
        <h3 className="font-semibold text-stone-900 text-sm leading-snug mb-1 line-clamp-2 group-hover:text-brand-700 transition-colors">
          {product.title}
        </h3>

        {/* Description */}
        <p className="text-xs text-stone-500 leading-relaxed mb-3 line-clamp-2 flex-1">
          {product.description}
        </p>

        {/* Price + Add */}
        <div className="flex items-center justify-between gap-2 mt-auto">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-extrabold text-stone-900">
                ${Number(product.price).toFixed(2)}
              </span>
              {product.original_price && (
                <span className="text-xs text-stone-400 line-through font-medium">
                  ${Number(product.original_price).toFixed(2)}
                </span>
              )}
            </div>
            <span className="text-[11px] text-stone-400">
              {product.orders_count.toLocaleString()}+ sold
            </span>
          </div>

          <button
            onClick={handleAdd}
            disabled={!product.in_stock}
            className={`flex items-center justify-center w-9 h-9 rounded-xl transition-all shrink-0 ${
              added
                ? 'bg-brand-600 text-white scale-110'
                : product.in_stock
                ? 'bg-stone-100 text-stone-700 hover:bg-brand-600 hover:text-white'
                : 'bg-stone-100 text-stone-300 cursor-not-allowed'
            }`}
            aria-label="Add to cart"
          >
            {added ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}
