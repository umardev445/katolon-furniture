import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Hero() {
  return (
    <div className="relative h-[85vh] w-full overflow-hidden">
      {/* Background with parallax effect */}
      <motion.div 
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 10, ease: "easeOut" }}
        className="absolute inset-0"
      >
        <img 
          src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=1920"
          alt="Luxury Living Room"
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent" />
      </motion.div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center">
        <div className="max-w-2xl space-y-8">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <span className="text-[#A67B5B] font-bold tracking-[0.4em] text-xs uppercase mb-4 block">
              Luxury Furniture Pakistan
            </span>
            <h1 className="text-5xl md:text-7xl font-bold text-white leading-[1.1] tracking-tight">
              Transform Your Space with <span className="text-[#A67B5B]">Katolon</span> Furniture
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="text-lg text-white/80 leading-relaxed max-w-lg"
          >
            Experience the pinnacle of Pakistan modern luxury. Hand-crafted pieces designed 
            to bring timeless elegance and contemporary comfort to your home.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link 
              to="/products"
              className="px-8 py-4 bg-[#A67B5B] text-white font-bold rounded-full hover:bg-[#8B6547] transition-all transform hover:scale-105 flex items-center justify-center space-x-2 shadow-2xl"
            >
              <span>Shop Collection</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link 
              to="/about"
              className="px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white font-bold rounded-full hover:bg-white/20 transition-all text-center"
            >
              Our Story
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Floating Scroll Badge */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 hidden md:block">
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="flex flex-col items-center space-y-2 opacity-50"
        >
          <div className="w-[1px] h-12 bg-white" />
          <span className="text-white text-[10px] uppercase tracking-widest font-bold">Scroll</span>
        </motion.div>
      </div>
    </div>
  );
}
