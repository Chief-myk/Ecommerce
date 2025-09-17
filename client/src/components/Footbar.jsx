import React, { useState } from 'react';
import {
  ShoppingCart,
  Search,
  Home,
  Contact,
  Heart,
  User,
  Phone,
  Mail,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  CreditCard,
  Shield,
  Truck,
  Box
} from "lucide-react";
import { useNavigate } from "react-router-dom"

const Footbar = () => {
  const [activeTab, setActiveTab] = useState('home');
  const navigate = useNavigate();
  return (
    <>
      {/* Main Footer */}
      <footer className="bg-gray-900 hidden md:block text-white pt-12 pb-6 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Top Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {/* Company Info */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold flex items-center">
                <span className="bg-gradient-to-r from-blue-500 to-purple-500 p-2 rounded-md mr-2">
                  <Home size={20} />
                </span>
                OneCart
              </h3>
              <p className="text-gray-400 text-sm">
                Your one-stop destination for all your shopping needs. Quality products at affordable prices.
              </p>
              <div className="flex space-x-4 pt-2">
                <a href="#" className="bg-gray-800 p-2 rounded-full hover:bg-blue-600 transition-colors">
                  <Facebook size={18} />
                </a>
                <a href="#" className="bg-gray-800 p-2 rounded-full hover:bg-blue-400 transition-colors">
                  <Twitter size={18} />
                </a>
                <a href="#" className="bg-gray-800 p-2 rounded-full hover:bg-pink-600 transition-colors">
                  <Instagram size={18} />
                </a>
                <a href="#" className="bg-gray-800 p-2 rounded-full hover:bg-red-600 transition-colors">
                  <Youtube size={18} />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Quick Links</h3>
              <ul className="space-y-3">
                <li><a href={"/"} className="text-gray-400 hover:text-white transition-colors flex items-center"><Home size={16} className="mr-2" /> Home</a></li>
                <li><a href="/collections" className="text-gray-400 hover:text-white transition-colors flex items-center"><Heart size={16} className="mr-2" /> Collections</a></li>
                <li><a href="/about" className="text-gray-400 hover:text-white transition-colors flex items-center"><User size={16} className="mr-2" /> My Account</a></li>
                <li><a href="/cart" className="text-gray-400 hover:text-white transition-colors flex items-center"><ShoppingCart size={16} className="mr-2" /> Cart</a></li>
                <li><a href="/order" className="text-gray-400 hover:text-white transition-colors flex items-center"><Box size={16} className="mr-2" /> Orders</a></li>
              </ul>
            </div>

            {/* Contact Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Contact Us</h3>
              <div className="space-y-3">
                <div className="flex items-start">
                  <MapPin size={16} className="mt-1 mr-2 text-blue-400" />
                  <span className="text-gray-400 text-sm">Paschim Vihar, New Delhi</span>
                </div>
                <div className="flex items-center">
                  <Phone size={16} className="mr-2 text-blue-400" />
                  <span className="text-gray-400 text-sm">+91 999053882 </span>
                </div>
                <div className="flex items-center">
                  <Mail size={16} className="mr-2 text-blue-400" />
                  <span className="text-gray-400 text-sm">support@onecart.com</span>
                </div>
              </div>
            </div>

            {/* Newsletter */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Newsletter</h3>
              <p className="text-gray-400 text-sm">Subscribe to get special offers, free giveaways, and new arrivals</p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="bg-gray-800 text-white px-4 py-2 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                />
                <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-r-md transition-colors">
                  Subscribe
                </button>
              </div>
            </div>
          </div>

          {/* Trust Badges */}
          {/* <div className="flex flex-wrap justify-center gap-6 mb-8">
            <div className="flex items-center bg-gray-800 px-4 py-2 rounded-md">
              <Truck size={20} className="text-green-400 mr-2" />
              <span className="text-sm">Free Shipping Over $50</span>
            </div>
            <div className="flex items-center bg-gray-800 px-4 py-2 rounded-md">
              <Shield size={20} className="text-blue-400 mr-2" />
              <span className="text-sm">Secure Payment</span>
            </div>
            <div className="flex items-center bg-gray-800 px-4 py-2 rounded-md">
              <CreditCard size={20} className="text-purple-400 mr-2" />
              <span className="text-sm">Easy Returns</span>
            </div>
          </div> */}

          {/* Divider */}
          <div className="border-t border-gray-800 my-6"></div>

          {/* Bottom Section */}
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm mb-4 md:mb-0">
              © {new Date().getFullYear()} OneCart. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-500 hover:text-white text-sm transition-colors">Privacy Policy</a>
              <a href="#" className="text-gray-500 hover:text-white text-sm transition-colors">Terms of Service</a>
              <a href="#" className="text-gray-500 hover:text-white text-sm transition-colors">Returns & Refunds</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 z-40">
        <div className="flex justify-around items-center py-3">

          <button
            onClick={() => { setActiveTab('home'); navigate("/"); }}
            className={`flex flex-col items-center px-4 py-2 rounded-lg transition-colors ${activeTab === 'home' ? 'text-blue-400' : 'text-gray-400'}`}
          >
            <Home size={20} />
            <span className="text-xs mt-1">Home</span>
          </button>

          <button
            onClick={() => { setActiveTab('collections'); navigate("/collections"); }}
            className={`flex flex-col items-center px-4 py-2 rounded-lg transition-colors ${activeTab === 'collections' ? 'text-blue-400' : 'text-gray-400'}`}
          >
            <Heart size={20} />
            <span className="text-xs mt-1">Collections</span>
          </button>
          {/*           
          <button 
            onClick={() => { setActiveTab('search'); navigate("/"); }}
            className={`flex flex-col items-center px-4 py-2 rounded-lg transition-colors ${activeTab === 'search' ? 'text-blue-400' : 'text-gray-400'}`}
          >
            <Search size={20} />
            <span className="text-xs mt-1">Search</span>
          </button> */}
                    
          <button 
            onClick={() => { setActiveTab('order'); navigate("/order"); }}
            className={`flex flex-col items-center px-4 py-2 rounded-lg transition-colors ${activeTab === 'order' ? 'text-blue-400' : 'text-gray-400'}`}
          >
            <Box size={20} />
            <span className="text-xs mt-1">Order</span>
          </button>

          <button
            onClick={() => { setActiveTab('cart'); navigate("/cart"); }}
            className={`flex flex-col items-center px-4 py-2 rounded-lg transition-colors ${activeTab === 'cart' ? 'text-blue-400' : 'text-gray-400'}`}
          >
            <div className="relative">
              <ShoppingCart size={20} />
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">3</span>
            </div>
            <span className="text-xs mt-1">Cart</span>
          </button>

          <button
            onClick={() => { setActiveTab('contact'); navigate("/contact"); }}
            className={`flex flex-col items-center px-4 py-2 rounded-lg transition-colors ${activeTab === 'contact' ? 'text-blue-400' : 'text-gray-400'}`}
          >
            <Contact size={20} />
            <span className="text-xs mt-1">Contact</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Footbar;