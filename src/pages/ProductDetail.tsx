import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { doc, getDoc, collection, query, where, limit, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { ShoppingCart, ArrowLeft, Star, ShieldCheck, Truck, RotateCcw } from 'lucide-react';
import { motion } from 'motion/react';
import toast from 'react-hot-toast';
import ProductCard from '../components/ProductCard';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    async function fetchProduct() {
      if (!id) return;
      setLoading(true);
      try {
        const docSnap = await getDoc(doc(db, 'products', id));
        if (docSnap.exists()) {
          const p = { id: docSnap.id, ...docSnap.data() } as Product;
          setProduct(p);
          
          // Fetch related
          const q = query(
            collection(db, 'products'), 
            where('category', '==', p.category), 
            limit(5)
          );
          const relSnap = await getDocs(q);
          setRelated(relSnap.docs.filter(d => d.id !== id).map(d => ({ id: d.id, ...d.data() } as Product)));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [id]);

  if (loading) {
    return <div className="max-w-7xl mx-auto px-4 py-32 flex justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5C4033]" /></div>;
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-32 text-center">
        <h2 className="text-2xl font-bold">Product not found.</h2>
        <Link to="/products" className="text-[#5C4033] mt-4 block hover:underline">Back to shop</Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    toast.success(`Added ${quantity} ${product.name} to cart!`);
  };

  return (
    <div className="pb-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <button onClick={() => navigate(-1)} className="flex items-center space-x-2 text-[#8E7F71] hover:text-[#5C4033] mb-8 transition-colors">
          <ArrowLeft className="h-4 w-4" />
          <span className="text-sm font-semibold uppercase tracking-widest">Back</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Image */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="aspect-[4/5] rounded-3xl overflow-hidden bg-[#FAF9F6] border border-[#E5E1DA]"
          >
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          </motion.div>

          {/* Info */}
          <motion.div 
             initial={{ opacity: 0, x: 20 }}
             animate={{ opacity: 1, x: 0 }}
             className="flex flex-col justify-center space-y-8"
          >
            <div>
              <span className="px-3 py-1 bg-[#F5F2EE] text-[10px] font-bold uppercase tracking-[0.2em] text-[#A67B5B] rounded-full">
                {product.category}
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-[#2C1810] mt-4">{product.name}</h1>
              <div className="flex items-center mt-4 space-x-4">
                <div className="flex text-yellow-500">
                  {[1,2,3,4,5].map(s => <Star key={s} className="h-4 w-4 fill-current" />)}
                </div>
                <span className="text-sm text-[#8E7F71]">(48 reviews)</span>
              </div>
            </div>

            <p className="text-3xl font-bold text-[#2C1810]">${product.price.toLocaleString()}</p>

            <p className="text-[#8E7F71] leading-relaxed text-lg">
              {product.description}
            </p>

            <div className="flex items-center space-x-6">
              <div className="flex items-center border border-[#E5E1DA] rounded-full overflow-hidden h-14">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-6 hover:bg-[#F5F2EE] transition-colors font-bold"
                >
                  -
                </button>
                <span className="w-12 text-center font-bold">{quantity}</span>
                <button 
                   onClick={() => setQuantity(quantity + 1)}
                   className="px-6 hover:bg-[#F5F2EE] transition-colors font-bold"
                >
                  +
                </button>
              </div>
              <button 
                 onClick={handleAddToCart}
                 className="flex-grow bg-[#5C4033] text-white flex items-center justify-center space-x-3 h-14 rounded-full font-bold hover:bg-[#4A3329] transition-all transform hover:scale-[1.02] active:scale-95 shadow-xl"
              >
                <ShoppingCart className="h-5 w-5" />
                <span>Add to Cart</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-8 pt-8 border-t border-[#E5E1DA]">
              <div className="flex items-start space-x-4">
                <Truck className="h-6 w-6 text-[#A67B5B]" />
                <div>
                  <h4 className="font-bold text-sm">Free Delivery</h4>
                  <p className="text-xs text-[#8E7F71]">On orders above $2,000</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <RotateCcw className="h-6 w-6 text-[#A67B5B]" />
                <div>
                  <h4 className="font-bold text-sm">Easy Returns</h4>
                  <p className="text-xs text-[#8E7F71]">30-day hassle-free process</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-32">
          <h2 className="text-2xl font-bold text-[#2C1810] mb-12">You Might Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {related.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
