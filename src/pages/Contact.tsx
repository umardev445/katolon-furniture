import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, Instagram, Twitter, Facebook } from 'lucide-react';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import toast from 'react-hot-toast';
import { motion } from 'motion/react';

export default function Contact() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(db, 'messages'), {
        ...form,
        createdAt: serverTimestamp()
      });
      toast.success('Message sent! We will contact you soon.');
      setForm({ name: '', email: '', message: '' });
    } catch (err) {
      toast.error('Failed to send message.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
        {/* Info */}
        <div className="space-y-12">
          <div>
            <h1 className="text-5xl font-bold text-[#2C1810] mb-6">Let's Connect</h1>
            <p className="text-[#8E7F71] text-lg leading-relaxed">
              Have a question about a specific piece or need interior design advice? 
              Our team of experts is dedicated to helping you create the perfect space.
            </p>
          </div>

          <div className="space-y-8">
            <div className="flex items-start space-x-6">
              <div className="p-4 bg-[#F5F2EE] rounded-2xl text-[#A67B5B]">
                <MapPin className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-bold text-[#2C1810]">Visit Our Showroom</h4>
                <p className="text-[#8E7F71]">123 Design Avenue, Gulberg III, Lahore, Pakistan</p>
              </div>
            </div>
            <div className="flex items-start space-x-6">
              <div className="p-4 bg-[#F5F2EE] rounded-2xl text-[#A67B5B]">
                <Phone className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-bold text-[#2C1810]">Call Us</h4>
                <p className="text-[#8E7F71]">+92 300 1234567</p>
                <p className="text-xs text-[#8E7F71] mt-1">Mon-Sat: 10am - 8pm</p>
              </div>
            </div>
            <div className="flex items-start space-x-6">
              <div className="p-4 bg-[#F5F2EE] rounded-2xl text-[#A67B5B]">
                <Mail className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-bold text-[#2C1810]">Email Us</h4>
                <p className="text-[#8E7F71]">concierge@katolon.com</p>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-[#E5E1DA]">
            <h4 className="font-bold text-[#2C1810] mb-6 uppercase tracking-widest text-xs">Follow Our Journey</h4>
            <div className="flex space-x-6">
              {[Instagram, Twitter, Facebook].map((Icon, i) => (
                <a key={i} href="#" className="p-3 bg-white border border-[#E5E1DA] rounded-xl text-[#2C1810] hover:bg-[#5C4033] hover:text-white transition-all shadow-sm">
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Form */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white p-10 md:p-16 rounded-[3rem] border border-[#E5E1DA] shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#FAF9F6] rounded-bl-[100%] z-0" />
          <form onSubmit={handleSubmit} className="relative z-10 space-y-8">
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-widest text-[#8E7F71]">Your Name</label>
              <input
                required
                type="text"
                value={form.name}
                onChange={e => setForm({...form, name: e.target.value})}
                className="w-full px-0 py-4 border-b-2 border-[#E5E1DA] focus:border-[#5C4033] bg-transparent focus:outline-none transition-all text-lg font-medium"
                placeholder="Ahmed Raza"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-widest text-[#8E7F71]">Email Address</label>
              <input
                required
                type="email"
                value={form.email}
                onChange={e => setForm({...form, email: e.target.value})}
                className="w-full px-0 py-4 border-b-2 border-[#E5E1DA] focus:border-[#5C4033] bg-transparent focus:outline-none transition-all text-lg font-medium"
                placeholder="ahmed@example.com"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-widest text-[#8E7F71]">Your Message</label>
              <textarea
                required
                value={form.message}
                onChange={e => setForm({...form, message: e.target.value})}
                className="w-full px-0 py-4 border-b-2 border-[#E5E1DA] focus:border-[#5C4033] bg-transparent focus:outline-none transition-all text-lg font-medium"
                rows={4}
                placeholder="How can we help you?"
              />
            </div>
            <button
              disabled={loading}
              className="w-full bg-[#5C4033] text-white py-6 rounded-2xl font-bold flex items-center justify-center space-x-4 hover:bg-[#4A3329] transition-all transform hover:scale-[1.02] shadow-xl disabled:opacity-50"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
              ) : (
                <>
                  <Send className="h-5 w-5" />
                  <span>Send Message</span>
                </>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
