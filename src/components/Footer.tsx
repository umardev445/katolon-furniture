import React from 'react';
import { Package, Instagram, Twitter, Facebook, Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-[#2C1810] text-[#FDFCFB] pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand Info */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center space-x-2">
              <Package className="h-8 w-8 text-[#A67B5B]" />
              <span className="text-2xl font-bold tracking-tight">KATOLON</span>
            </Link>
            <p className="text-[#8E7F71] text-sm leading-relaxed">
              Crafting premium, modern furniture that transforms your living space into a sanctuary of elegance and comfort.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-[#8E7F71] hover:text-[#A67B5B] transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-[#8E7F71] hover:text-[#A67B5B] transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-[#8E7F71] hover:text-[#A67B5B] transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Quick Links</h3>
            <ul className="space-y-4">
              <li><Link to="/" className="text-[#8E7F71] hover:text-[#A67B5B] transition-colors text-sm">Home</Link></li>
              <li><Link to="/products" className="text-[#8E7F71] hover:text-[#A67B5B] transition-colors text-sm">Shop All</Link></li>
              <li><Link to="/category/Sofa" className="text-[#8E7F71] hover:text-[#A67B5B] transition-colors text-sm">Sofas</Link></li>
              <li><Link to="/category/Bed" className="text-[#8E7F71] hover:text-[#A67B5B] transition-colors text-sm">Beds</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Company</h3>
            <ul className="space-y-4">
              <li><Link to="/about" className="text-[#8E7F71] hover:text-[#A67B5B] transition-colors text-sm">Our Story</Link></li>
              <li><Link to="/contact" className="text-[#8E7F71] hover:text-[#A67B5B] transition-colors text-sm">Contact Us</Link></li>
              <li><Link to="#" className="text-[#8E7F71] hover:text-[#A67B5B] transition-colors text-sm">Terms of Service</Link></li>
              <li><Link to="#" className="text-[#8E7F71] hover:text-[#A67B5B] transition-colors text-sm">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Experience Katolon</h3>
            <ul className="space-y-4">
              <li className="flex items-center space-x-3 text-sm text-[#8E7F71]">
                <MapPin className="h-4 w-4 text-[#A67B5B]" />
                <span>123 Design Avenue, Lahore, PK</span>
              </li>
              <li className="flex items-center space-x-3 text-sm text-[#8E7F71]">
                <Phone className="h-4 w-4 text-[#A67B5B]" />
                <span>+92 300 1234567</span>
              </li>
              <li className="flex items-center space-x-3 text-sm text-[#8E7F71]">
                <Mail className="h-4 w-4 text-[#A67B5B]" />
                <span>contact@katolon.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[#3D2B22] pt-8 flex flex-col md:flex-row justify-between items-center text-[#8E7F71] text-xs font-light">
          <p>© 2026 Katolon Furniture. All rights reserved.</p>
          <p className="mt-4 md:mt-0">Premium Pakistan Craftsmanship</p>
        </div>
      </div>
    </footer>
  );
}
