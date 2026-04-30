import React, { useState, useEffect } from 'react';
import { collection, query, limit, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Product } from '../types';
import Hero from '../components/Hero';
import ProductCard from '../components/ProductCard';
import { motion } from 'motion/react';
import { ArrowRight, Star, ShieldCheck, Truck, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFeatured() {
      try {
        const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'), limit(4));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
        setFeaturedProducts(data);
      } catch (err) {
        console.error("Error fetching products", err);
      } finally {
        setLoading(false);
      }
    }
    fetchFeatured();
  }, []);

  const categories = [
    { name: 'Sofa', img: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=400' },
    { name: 'Bed', img: 'https://images.unsplash.com/photo-1505691723518-36a5ac3be353?auto=format&fit=crop&q=80&w=400' },
    { name: 'Table', img: 'https://images.unsplash.com/photo-1577145785726-23902ee1f4ac?auto=format&fit=crop&q=80&w=400' },
    { name: 'Chair', img: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&q=80&w=400' },
    { name: 'Decor', img: 'https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&q=80&w=400' },
  ];

  return (
    <div className="space-y-24 pb-20">
      <Hero />

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-12">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#A67B5B]">Browse Rooms</span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#2C1810] mt-2">Shop by Category</h2>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          {categories.map((cat, idx) => (
            <Link to={`/products?category=${cat.name}`} key={cat.name}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="group cursor-pointer text-center"
              >
                <div className="aspect-square rounded-full overflow-hidden mb-4 border-2 border-transparent group-hover:border-[#A67B5B] p-1 transition-all">
                  <img src={cat.img} alt={cat.name} className="w-full h-full object-cover rounded-full grayscale group-hover:grayscale-0 transition-all duration-500" />
                </div>
                <h3 className="text-sm font-semibold text-[#2C1810] group-hover:text-[#A67B5B]">{cat.name}</h3>
              </motion.div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="bg-[#FAF9F6] py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#A67B5B]">New Arrivals</span>
              <h2 className="text-3xl md:text-4xl font-bold text-[#2C1810] mt-2">Premium Selection</h2>
            </div>
            <Link to="/products" className="group flex items-center space-x-2 text-[#5C4033] font-semibold text-sm">
              <span>View All</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          
          {loading ? (
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
               {[1,2,3,4].map(i => (
                 <div key={i} className="animate-pulse bg-[#E5E1DA] h-96 rounded-xl" />
               ))}
             </div>
          ) : featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-[#E5E1DA]">
              <p className="text-[#8E7F71]">No products found. Please check back later.</p>
            </div>
          )}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-12 border-y border-[#E5E1DA] py-16">
        {[
          { icon: Star, title: "Premium Quality", desc: "Handpicked materials for ultimate luxury." },
          { icon: Truck, title: "Swift Delivery", desc: "Fast and safe transit to your doorstep." },
          { icon: ShieldCheck, title: "Lifetime Warranty", desc: "Guarantee of excellence on all items." },
          { icon: Clock, title: "24/7 Support", desc: "Always here for your inquiries." }
        ].map((f, i) => (
          <div key={i} className="flex flex-col items-center text-center space-y-4">
            <div className="p-4 bg-[#F5F2EE] rounded-full text-[#A67B5B]">
              <f.icon className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-[#2C1810]">{f.title}</h3>
            <p className="text-sm text-[#8E7F71] leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </section>

      {/* Promotional */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden h-[500px] group">
          <img 
            src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=1920" 
            alt="Promotion" 
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105" 
          />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center p-8 text-center">
            <div className="max-w-2xl space-y-6">
              <span className="text-white/80 font-bold tracking-widest text-xs uppercase">Summer Collection</span>
              <h2 className="text-4xl md:text-6xl font-bold text-white leading-tight">Elevate Your Home with Our Curated Decor</h2>
              <p className="text-white/70 text-lg">Up to 40% Off on Selected Premium Items</p>
              <Link to="/products" className="inline-block px-8 py-4 bg-white text-[#2C1810] font-bold rounded-full hover:bg-[#5C4033] hover:text-white transition-all transform hover:scale-105 shadow-xl">
                Explore Collection
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-center mb-16">
           <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#A67B5B]">Testimonials</span>
           <h2 className="text-3xl md:text-4xl font-bold text-[#2C1810] mt-2">What Our Clients Say</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { name: "Ahmed Raza", role: "Interior Designer", text: "Katolon furniture transformed my client's penthouse. The quality of the leather is unmatched." },
            { name: "Sara Khan", role: "Homeowner", text: "The delivery was so fast! My new sofa looks even better in person than on the website." },
            { name: "John Doe", role: "CEO", text: "Premium furniture with a premium service. The assembly team was professional and tidy." }
          ].map((t, i) => (
            <div key={i} className="bg-white p-10 rounded-2xl border border-[#E5E1DA] shadow-sm italic text-[#2C1810]">
              <div className="flex text-[#A67B5B] mb-4">
                {[1,2,3,4,5].map(s => <Star key={s} className="h-4 w-4 fill-current" />)}
              </div>
              <p className="mb-6 leading-relaxed">"{t.text}"</p>
              <div className="not-italic">
                <p className="font-bold">{t.name}</p>
                <p className="text-xs text-[#8E7F71] uppercase tracking-widest">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
