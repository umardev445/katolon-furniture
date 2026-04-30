import React, { useState, useEffect } from 'react';
import { collection, query, getDocs, where } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Product, Category } from '../types';
import ProductCard from '../components/ProductCard';
import { CATEGORIES } from '../constants';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, SlidersHorizontal, PackageOpen } from 'lucide-react';
import { motion } from 'motion/react';

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const selectedCategory = searchParams.get('category') || 'All';

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        let q = query(collection(db, 'products'));
        if (selectedCategory !== 'All') {
          q = query(collection(db, 'products'), where('category', '==', selectedCategory));
        }
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
        setProducts(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, [selectedCategory]);

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-[#2C1810]">Our Collection</h1>
        <p className="mt-4 text-[#8E7F71]">Modern refinement meets artisanal craftsmanship.</p>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setSearchParams({})}
            className={`px-6 py-2 rounded-full text-sm font-semibold transition-all ${
              selectedCategory === 'All' ? 'bg-[#5C4033] text-white' : 'bg-white text-[#8E7F71] border border-[#E5E1DA]'
            }`}
          >
            All
          </button>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSearchParams({ category: cat })}
              className={`px-6 py-2 rounded-full text-sm font-semibold transition-all ${
                selectedCategory === cat ? 'bg-[#5C4033] text-white' : 'bg-white text-[#8E7F71] border border-[#E5E1DA]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8E7F71]" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-[#E5E1DA] rounded-full focus:outline-none focus:ring-2 focus:ring-[#5C4033]/20 transition-all text-sm"
          />
        </div>
      </div>

      {/* Product Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
           {[1,2,3,4,5,6,7,8].map(i => (
             <div key={i} className="animate-pulse bg-[#E5E1DA] h-96 rounded-xl" />
           ))}
        </div>
      ) : filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredProducts.map((p, idx) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              key={p.id}
            >
              <ProductCard product={p} />
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-32 text-[#8E7F71]">
          <PackageOpen className="h-16 w-16 mb-4 opacity-20" />
          <p className="text-xl font-medium">No results found for your search.</p>
          <button onClick={() => { setSearchParams({}); setSearchTerm(''); }} className="mt-4 text-[#5C4033] font-bold hover:underline">
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
}
