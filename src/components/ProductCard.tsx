import React from 'react';
import { ShoppingCart, Eye } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="group bg-white rounded-xl overflow-hidden border border-[#E5E1DA] shadow-sm hover:shadow-md transition-all duration-300"
    >
      <div className="relative aspect-[4/5] overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-3">
          <Link
            to={`/product/${product.id}`}
            className="p-3 bg-white text-[#2C1810] rounded-full hover:bg-[#5C4033] hover:text-white transition-colors shadow-lg"
          >
            <Eye className="h-5 w-5" />
          </Link>
          <button
            onClick={() => addToCart(product)}
            className="p-3 bg-white text-[#2C1810] rounded-full hover:bg-[#5C4033] hover:text-white transition-colors shadow-lg"
          >
            <ShoppingCart className="h-5 w-5" />
          </button>
        </div>
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-[10px] font-bold uppercase tracking-widest text-[#5C4033] rounded-full border border-[#E5E1DA]">
            {product.category}
          </span>
        </div>
      </div>
      <div className="p-6">
        <Link to={`/product/${product.id}`}>
          <h3 className="text-lg font-semibold text-[#2C1810] group-hover:text-[#5C4033] transition-colors line-clamp-1">
            {product.name}
          </h3>
        </Link>
        <p className="mt-2 text-sm text-[#8E7F71] line-clamp-2 leading-relaxed h-10">
          {product.description}
        </p>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-xl font-bold text-[#2C1810]">
            ${product.price.toLocaleString()}
          </span>
          <button
            onClick={() => addToCart(product)}
            className="text-xs font-bold uppercase tracking-widest text-[#5C4033] hover:underline"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </motion.div>
  );
}
