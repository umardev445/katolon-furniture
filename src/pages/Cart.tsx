import React from 'react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, cartTotal } = useCart();

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-32 flex flex-col items-center justify-center text-center space-y-8">
        <div className="p-8 bg-[#FAF9F6] rounded-full">
           <ShoppingBag className="h-16 w-16 text-[#8E7F71] opacity-20" />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-[#2C1810]">Your Cart is Empty</h2>
          <p className="mt-2 text-[#8E7F71]">It looks like you haven't added anything to your cart yet.</p>
        </div>
        <Link 
          to="/products"
          className="px-10 py-4 bg-[#5C4033] text-white font-bold rounded-full hover:bg-[#4A3329] transition-all shadow-xl"
        >
          Explore Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <h1 className="text-4xl font-bold text-[#2C1810] mb-12">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
        {/* Items List */}
        <div className="lg:col-span-2 space-y-8">
          <AnimatePresence mode='popLayout'>
            {cart.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex items-center space-x-6 bg-white p-6 rounded-2xl border border-[#E5E1DA] shadow-sm relative group"
              >
                <div className="h-32 w-32 rounded-xl overflow-hidden flex-shrink-0 border border-[#E5E1DA]">
                  <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                </div>
                <div className="flex-grow space-y-2">
                  <div className="flex justify-between items-start">
                    <Link to={`/product/${item.id}`}>
                      <h3 className="text-lg font-bold text-[#2C1810] hover:text-[#A67B5B] transition-colors line-clamp-1">{item.name}</h3>
                    </Link>
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="p-2 text-[#8E7F71] hover:text-red-500 hover:bg-red-50 transition-all rounded-full"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="text-sm text-[#8E7F71] uppercase tracking-widest font-bold">{item.category}</p>
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center border border-[#E5E1DA] rounded-full overflow-hidden">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="px-3 py-1 hover:bg-[#F5F2EE] transition-colors"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="px-3 py-1 hover:bg-[#F5F2EE] transition-colors"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                    <span className="text-lg font-bold text-[#2C1810]">${(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white p-10 rounded-3xl border border-[#E5E1DA] shadow-sm sticky top-32 space-y-8">
            <h2 className="text-2xl font-bold text-[#2C1810]">Order Summary</h2>
            
            <div className="space-y-4 text-sm">
              <div className="flex justify-between text-[#8E7F71]">
                <span>Subtotal</span>
                <span className="font-bold text-[#2C1810]">${cartTotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-[#8E7F71]">
                <span>Shipping</span>
                <span className="font-bold text-[#2C1810]">Free</span>
              </div>
              <div className="pt-4 border-t border-[#E5E1DA] flex justify-between">
                <span className="text-lg font-bold text-[#2C1810]">Total</span>
                <span className="text-2xl font-bold text-[#5C4033]">${cartTotal.toLocaleString()}</span>
              </div>
            </div>

            <Link 
              to="/checkout"
              className="w-full flex items-center justify-center space-x-3 bg-[#5C4033] text-white py-5 rounded-full font-bold hover:bg-[#4A3329] transition-all transform hover:scale-[1.02] shadow-xl group"
            >
              <span>Checkout Now</span>
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>

            <div className="flex items-center justify-center space-x-4 pt-4 grayscale opacity-40">
               <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-4" />
               <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-4" />
               <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-4" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
