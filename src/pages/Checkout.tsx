import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { handlePayment } from '../lib/payment';
import toast from 'react-hot-toast';
import { motion } from 'motion/react';
import { CreditCard, Wallet, Truck, CheckCircle2, ArrowRight, ShieldCheck } from 'lucide-react';

export default function Checkout() {
  const { cart, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'card' | 'mobile_wallet'>('cod');
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    zip: ''
  });

  if (cart.length === 0) {
    navigate('/products');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to place an order');
      navigate('/login?redirect=checkout');
      return;
    }

    setLoading(true);

    try {
      // 1. Process Payment
      const paymentResult = await handlePayment({
        method: paymentMethod,
        amount: cartTotal
      });

      if (!paymentResult.success) {
        toast.error(paymentResult.error || 'Payment failed');
        setLoading(false);
        return;
      }

      // 2. Save Order to Firestore
      const orderData = {
        userId: user.uid,
        customerDetails: {
          name: formData.name,
          phone: formData.phone,
          address: `${formData.address}, ${formData.city}, ${formData.zip}`
        },
        items: cart,
        total: cartTotal,
        status: 'pending',
        paymentMethod: paymentMethod === 'cod' ? 'Cash on Delivery' : paymentMethod === 'card' ? 'Credit Card' : 'Mobile Wallet',
        transactionId: paymentResult.transactionId || null,
        createdAt: serverTimestamp()
      };

      await addDoc(collection(db, 'orders'), orderData);
      
      toast.success('Order placed successfully!');
      clearCart();
      navigate('/');
    } catch (err) {
      console.error(err);
      toast.error('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <h1 className="text-4xl font-bold text-[#2C1810] mb-12">Checkout</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Left Col: Customer Details & Payment */}
        <div className="space-y-12">
          {/* Form */}
          <section className="space-y-8 bg-white p-10 rounded-3xl border border-[#E5E1DA] shadow-sm">
            <h2 className="text-xl font-bold text-[#2C1810] flex items-center space-x-3">
              <Truck className="h-5 w-5 text-[#A67B5B]" />
              <span>Shipping Information</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="col-span-2">
                <label className="block text-xs font-bold uppercase tracking-widest text-[#8E7F71] mb-2">Full Name</label>
                <input
                  required
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-5 py-3 rounded-xl border border-[#E5E1DA] focus:ring-2 focus:ring-[#5C4033]/20 focus:outline-none"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-[#8E7F71] mb-2">Phone Number</label>
                <input
                  required
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-5 py-3 rounded-xl border border-[#E5E1DA] focus:ring-2 focus:ring-[#5C4033]/20 focus:outline-none"
                  placeholder="+92 300 0000000"
                />
              </div>
              <div className="md:col-span-1">
                 <label className="block text-xs font-bold uppercase tracking-widest text-[#8E7F71] mb-2">City</label>
                 <input
                  required
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-5 py-3 rounded-xl border border-[#E5E1DA] focus:ring-2 focus:ring-[#5C4033]/20 focus:outline-none"
                  placeholder="Lahore"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-bold uppercase tracking-widest text-[#8E7F71] mb-2">Full Address</label>
                <textarea
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-5 py-3 rounded-xl border border-[#E5E1DA] focus:ring-2 focus:ring-[#5C4033]/20 focus:outline-none"
                  rows={3}
                  placeholder="House number, street name, area..."
                />
              </div>
            </div>
          </section>

          {/* Payment Section - IMPORTANT */}
          <section className="space-y-8 bg-[#FAF9F6] p-10 rounded-3xl border border-[#E5E1DA] shadow-sm">
             <h2 className="text-xl font-bold text-[#2C1810] flex items-center space-x-3">
              <CreditCard className="h-5 w-5 text-[#A67B5B]" />
              <span>Payment Method</span>
            </h2>

            <div className="space-y-4">
              {/* Option 1: COD */}
              <label 
                className={`relative flex items-center justify-between p-6 rounded-2xl border-2 transition-all cursor-pointer ${
                  paymentMethod === 'cod' ? 'border-[#5C4033] bg-white shadow-md' : 'border-[#E5E1DA] bg-transparent hover:border-[#8E7F71]'
                }`}
              >
                <input 
                  type="radio" 
                  name="payment" 
                  className="sr-only" 
                  onChange={() => setPaymentMethod('cod')}
                  checked={paymentMethod === 'cod'}
                />
                <div className="flex items-center space-x-4">
                  <div className={`p-2 rounded-lg ${paymentMethod === 'cod' ? 'bg-[#5C4033] text-white' : 'bg-[#E5E1DA] text-[#8E7F71]'}`}>
                    <Truck className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#2C1810]">Cash on Delivery</h3>
                    <p className="text-xs text-[#8E7F71]">Pay when your furniture arrives</p>
                  </div>
                </div>
                {paymentMethod === 'cod' && <CheckCircle2 className="h-5 w-5 text-[#5C4033]" />}
              </label>

              {/* Option 2: Card - COMING SOON */}
              <div className="relative group grayscale opacity-50 cursor-not-allowed">
                <div className="flex items-center justify-between p-6 rounded-2xl border-2 border-[#E5E1DA] bg-transparent">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 rounded-lg bg-[#E5E1DA] text-[#8E7F71]">
                      <CreditCard className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-[#2C1810]">Credit / Debit Card</h3>
                      <p className="text-xs text-[#8E7F71]">Coming Soon (Stripe Integration)</p>
                    </div>
                  </div>
                </div>
                {/* TODO: Integrate Stripe / Payment API here */}
              </div>

               {/* Option 3: Mobile Wallets - COMING SOON */}
               <div className="relative group grayscale opacity-50 cursor-not-allowed">
                <div className="flex items-center justify-between p-6 rounded-2xl border-2 border-[#E5E1DA] bg-transparent">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 rounded-lg bg-[#E5E1DA] text-[#8E7F71]">
                      <Wallet className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-[#2C1810]">JazzCash / EasyPaisa</h3>
                      <p className="text-xs text-[#8E7F71]">Coming Soon (Local Gateway Integration)</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-[#5C4033]/5 p-4 rounded-xl flex items-center space-x-3 text-[#5C4033]">
              <ShieldCheck className="h-5 w-5" />
              <p className="text-xs">Your transaction is secured with end-to-end encryption.</p>
            </div>
          </section>
        </div>

        {/* Right Col: Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white p-10 rounded-3xl border border-[#E5E1DA] shadow-sm sticky top-32 space-y-8">
            <h2 className="text-2xl font-bold text-[#2C1810]">Order Summary</h2>
            
            <div className="max-h-60 overflow-y-auto pr-2 space-y-4">
              {cart.map(item => (
                <div key={item.id} className="flex items-center justify-between space-x-4">
                  <div className="flex items-center space-x-3">
                    <div className="h-12 w-12 rounded-lg overflow-hidden flex-shrink-0 border border-[#E5E1DA]">
                       <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#2C1810] line-clamp-1">{item.name}</h4>
                      <p className="text-xs text-[#8E7F71]">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-[#2C1810]">${(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>

            <div className="pt-8 border-t border-[#E5E1DA] space-y-4">
              <div className="flex justify-between text-[#8E7F71] text-sm">
                <span>Shipping Cost</span>
                <span className="font-bold text-green-600">FREE</span>
              </div>
              <div className="flex justify-between items-center pt-4">
                <span className="text-lg font-bold text-[#2C1810]">Grand Total</span>
                <span className="text-3xl font-bold text-[#5C4033]">${cartTotal.toLocaleString()}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center space-x-3 bg-[#5C4033] text-white py-5 rounded-full font-bold hover:bg-[#4A3329] transition-all transform hover:scale-[1.02] shadow-xl group disabled:opacity-50 disabled:scale-100"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
              ) : (
                <>
                  <span>Proceed to Payment</span>
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
