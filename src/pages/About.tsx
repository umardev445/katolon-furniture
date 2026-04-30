import React from 'react';
import { motion } from 'motion/react';
import { Quote, Sparkles, Heart, Award } from 'lucide-react';

export default function About() {
  return (
    <div className="pb-32 space-y-32">
      {/* Hero */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=1920" 
          className="absolute inset-0 w-full h-full object-cover"
          alt="Katolon Story"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative text-center text-white space-y-6 px-4">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-bold"
          >
            Our Story
          </motion.h1>
          <motion.p 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.2 }}
             className="text-xl max-w-2xl mx-auto text-white/80"
          >
            Crafting luxury pieces that define modern Pakistan living since 2012.
          </motion.p>
        </div>
      </section>

      {/* Brand values */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
        <div className="space-y-8">
          <div className="inline-flex items-center space-x-2 text-[#A67B5B]">
            <Quote className="h-6 w-6" />
            <span className="text-xs font-bold uppercase tracking-widest">A Vision of Elegance</span>
          </div>
          <h2 className="text-4xl font-bold text-[#2C1810]">Dedicated to Fine Art of Living</h2>
          <p className="text-[#8E7F71] leading-relaxed text-lg">
            Katolon was born from a simple belief: that the tools of our daily lives—the tables we eat at, 
            the beds we sleep in, the sofas where we share stories—should be works of art. 
            We combine traditional craftsmanship with modern design principles to create furniture that is 
            not just functional, but emotional.
          </p>
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-4">
               <Sparkles className="h-6 w-6 text-[#A67B5B]" />
               <h3 className="font-bold">Original Design</h3>
               <p className="text-sm text-[#8E7F71]">Every piece is conceptualized in our Lahore studio.</p>
            </div>
            <div className="space-y-4">
               <Award className="h-6 w-6 text-[#A67B5B]" />
               <h3 className="font-bold">Premium Materials</h3>
               <p className="text-sm text-[#8E7F71]">We source only the finest woods and textiles globally.</p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-6 relative">
          <div className="space-y-6 pt-12">
            <img src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=600" className="rounded-3xl shadow-xl" />
            <img src="https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&q=80&w=600" className="rounded-3xl shadow-xl" />
          </div>
          <div className="space-y-6">
            <img src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=600" className="rounded-3xl shadow-xl" />
            <img src="https://images.unsplash.com/photo-1577145785726-23902ee1f4ac?auto=format&fit=crop&q=80&w=600" className="rounded-3xl shadow-xl" />
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="bg-[#FAF9F6] py-32">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-12">
          <Heart className="h-12 w-12 text-[#A67B5B] mx-auto" />
          <h2 className="text-4xl font-bold text-[#2C1810]">Our Mission</h2>
          <p className="text-2xl font-light text-[#8E7F71] leading-relaxed italic">
            "To inspire a more beautiful and comfortable life by delivering furniture that stands 
            the test of time through uncompromising quality and intentional design."
          </p>
          <div className="pt-8 flex justify-center space-x-12 uppercase tracking-widest text-xs font-bold text-[#A67B5B]">
            <span>Est. 2012</span>
            <span>Made in Pakistan</span>
            <span>Global Vision</span>
          </div>
        </div>
      </section>
    </div>
  );
}
