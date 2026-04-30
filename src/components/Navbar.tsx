import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Menu, X, Package } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { auth } from '../lib/firebase';
import { signOut } from 'firebase/auth';
import { motion, AnimatePresence } from 'motion/react';

export default function Navbar() {
  const { profile, isAdmin } = useAuth();
  const { itemCount } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/products' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  if (isAdmin) {
    navLinks.push({ name: 'Admin', path: '/admin' });
  }

  const handleLogout = () => {
    signOut(auth);
  };

  return (
    <nav className="sticky top-0 z-50 bg-[#FDFCFB]/80 backdrop-blur-md border-b border-[#E5E1DA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Package className="h-8 w-8 text-[#5C4033]" />
              <span className="text-2xl font-bold tracking-tight text-[#2C1810]">
                KATOLON
              </span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium tracking-wide transition-colors hover:text-[#5C4033] ${
                  location.pathname === link.path ? 'text-[#5C4033] font-semibold' : 'text-[#8E7F71]'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <Link to="/cart" className="relative group p-2">
              <ShoppingCart className="h-5 w-5 text-[#2C1810] group-hover:text-[#5C4033] transition-colors" />
              {itemCount > 0 && (
                <span className="absolute top-0 right-0 h-4 w-4 bg-[#5C4033] text-white text-[10px] flex items-center justify-center rounded-full">
                  {itemCount}
                </span>
              )}
            </Link>
            {profile ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-[#8E7F71]">Hi, {profile.name}</span>
                <button
                  onClick={handleLogout}
                  className="p-2 hover:bg-[#E5E1DA] rounded-full transition-colors"
                >
                  <LogOut className="h-5 w-5 text-[#2C1810]" />
                </button>
              </div>
            ) : (
              <Link to="/login" className="p-2 hover:bg-[#E5E1DA] rounded-full transition-colors">
                <User className="h-5 w-5 text-[#2C1810]" />
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-4">
             <Link to="/cart" className="relative p-2">
              <ShoppingCart className="h-6 w-6 text-[#2C1810]" />
              {itemCount > 0 && (
                <span className="absolute top-0 right-0 h-4 w-4 bg-[#5C4033] text-white text-[10px] flex items-center justify-center rounded-full">
                  {itemCount}
                </span>
              )}
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-[#2C1810]"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#FDFCFB] border-b border-[#E5E1DA]"
          >
            <div className="px-4 pt-2 pb-6 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-4 text-base font-medium text-[#8E7F71] hover:text-[#5C4033] hover:bg-[#F5F2EE] rounded-lg transition-all"
                >
                  {link.name}
                </Link>
              ))}
              {profile ? (
                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="w-full text-left px-3 py-4 text-base font-medium text-[#8E7F71] hover:text-[#5C4033] hover:bg-[#F5F2EE] rounded-lg transition-all"
                >
                  Logout ({profile.name})
                </button>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-4 text-base font-medium text-[#8E7F71] hover:text-[#5C4033] hover:bg-[#F5F2EE] rounded-lg transition-all"
                >
                  Login / Signup
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
