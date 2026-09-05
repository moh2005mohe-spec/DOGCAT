import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useEffect } from 'react';
import { useCart } from '@/context/CartContext';

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

export function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { items, updateQuantity, removeFromCart, subtotal, totalItems, clearCart } = useCart();

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const shipping = subtotal >= 49 || subtotal === 0 ? 0 : 6.99;
  const total = subtotal + shipping;

  return (
    <>
      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-stone-900/50 backdrop-blur-sm z-50 animate-fade-in"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 bottom-0 w-full max-w-md bg-white z-50 shadow-2xl flex flex-col transition-transform duration-300 ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-stone-200">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-brand-600" />
            <h2 className="font-display text-lg font-bold text-stone-900">
              Your Cart {totalItems > 0 && `(${totalItems})`}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-stone-100 transition-colors"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Items */}
        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <div className="w-20 h-20 bg-stone-100 rounded-full flex items-center justify-center mb-4">
              <ShoppingBag className="w-10 h-10 text-stone-300" />
            </div>
            <h3 className="font-display text-lg font-bold text-stone-900 mb-1">Your cart is empty</h3>
            <p className="text-sm text-stone-500 mb-6">Start shopping for your furry friends!</p>
            <button
              onClick={onClose}
              className="px-6 py-3 bg-brand-600 text-white rounded-xl font-bold text-sm hover:bg-brand-700 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {items.map(({ product, quantity }) => (
                <div key={product.id} className="flex gap-3 group">
                  <img
                    src={product.image_url}
                    alt={product.title}
                    className="w-20 h-20 rounded-xl object-cover bg-stone-100 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-stone-900 line-clamp-2 mb-1">
                      {product.title}
                    </h4>
                    <p className="text-xs text-stone-400 capitalize mb-2">{product.category} · {product.subcategory}</p>
                    <div className="flex items-center justify-between">
                      {/* Quantity */}
                      <div className="flex items-center gap-1 bg-stone-100 rounded-lg p-0.5">
                        <button
                          onClick={() => updateQuantity(product.id, quantity - 1)}
                          className="p-1.5 rounded-md hover:bg-white transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-sm font-semibold w-6 text-center">{quantity}</span>
                        <button
                          onClick={() => updateQuantity(product.id, quantity + 1)}
                          className="p-1.5 rounded-md hover:bg-white transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      {/* Price */}
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-stone-900">
                          ${(Number(product.price) * quantity).toFixed(2)}
                        </span>
                        <button
                          onClick={() => removeFromCart(product.id)}
                          className="p-1 text-stone-300 hover:text-red-500 transition-colors"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Clear cart */}
              <button
                onClick={clearCart}
                className="text-xs text-stone-400 hover:text-red-500 transition-colors font-medium"
              >
                Clear all items
              </button>
            </div>

            {/* Summary */}
            <div className="border-t border-stone-200 p-5 space-y-3 bg-stone-50">
              <div className="flex justify-between text-sm">
                <span className="text-stone-600">Subtotal</span>
                <span className="font-semibold text-stone-900">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-stone-600">Shipping</span>
                <span className="font-semibold text-stone-900">
                  {shipping === 0 ? <span className="text-brand-600">FREE</span> : `$${shipping.toFixed(2)}`}
                </span>
              </div>
              {subtotal < 49 && subtotal > 0 && (
                <p className="text-xs text-accent-600 bg-accent-50 rounded-lg p-2 text-center">
                  Add ${(49 - subtotal).toFixed(2)} more for free shipping!
                </p>
              )}
              <div className="flex justify-between text-base pt-2 border-t border-stone-200">
                <span className="font-bold text-stone-900">Total</span>
                <span className="font-extrabold text-stone-900">${total.toFixed(2)}</span>
              </div>
              <button className="w-full py-3.5 bg-brand-600 text-white rounded-xl font-bold text-sm hover:bg-brand-700 transition-all hover:scale-[1.02] flex items-center justify-center gap-2 group">
                Checkout
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
