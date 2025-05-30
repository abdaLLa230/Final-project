import React from 'react';
import { motion } from 'framer-motion';
import logo from "../../assets/freshcart-logo.svg";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-white to-gray-100 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2">
            <img src={logo} alt="Fresh Cart" className="h-12 mb-4" />
            <p className="text-gray-600 mb-4 md:w-[90%]">
              Your one-stop destination for fresh groceries and household essentials. 
              We deliver quality products right to your doorstep.
            </p>
            <div className="flex space-x-4">
              <motion.a 
                href="https://www.facebook.com/share/1C9a3TCRWX/?mibextid=wwXIfr"
                whileHover={{ scale: 1.1 }}
                className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white hover:bg-blue-600 transition-colors"
              >
                <i className="fab fa-facebook-f"></i>
              </motion.a>
              <motion.a 
                href="https://www.instagram.com/abdalla7_elbana?igsh=MTYzbm13dHhrMXY4Mw%3D%3D&utm_source=qr"
                whileHover={{ scale: 1.1 }}
                className="w-10 h-10 rounded-full bg-pink-500 flex items-center justify-center text-white hover:bg-pink-600 transition-colors"
              >
                <i className="fab fa-instagram"></i>
              </motion.a>
              <motion.a 
                href="https://www.tiktok.com/@abdalla7ali?_t=ZS-8wO54LfIxPk&_r=1"
                whileHover={{ scale: 1.1 }}
                className="w-10 h-10 rounded-full bg-black flex items-center justify-center text-white hover:bg-gray-800 transition-colors"
              >
                <i className="fab fa-tiktok"></i>
              </motion.a>
              <motion.a 
                href="https://x.com/skill_camper?s=21"
                whileHover={{ scale: 1.1 }}
                className="w-10 h-10 rounded-full bg-blue-400 flex items-center justify-center text-white hover:bg-blue-500 transition-colors"
              >
                <i className="fab fa-twitter"></i>
              </motion.a>
              <motion.a 
                href="https://www.linkedin.com/in/abdallah-ali-3b5956307?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app"
                whileHover={{ scale: 1.1 }}
                className="w-10 h-10 rounded-full bg-blue-700 flex items-center justify-center text-white hover:bg-blue-800 transition-colors"
              >
                <i className="fab fa-linkedin-in"></i>
              </motion.a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4  text-gray-800">Quick Links</h3>
            <ul className="space-y-2">
              <li className='flex items-center text-gray-600'><a href="/" className="text-gray-600   hover:text-blue-600 transition-colors">Home</a></li>
              <li className='flex items-center text-gray-600'><a href="/products" className="text-gray-600 hover:text-blue-600 transition-colors">   Products</a></li>
              <li className='flex items-center text-gray-600'><a href="/categories" className="text-gray-600 hover:text-blue-600 transition-colors">   Categories</a></li>
              <li className='flex items-center text-gray-600'><a href="/brands" className="text-gray-600 hover:text-blue-600 transition-colors">Brands</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Contact Us</h3>
            <ul className="space-y-2">
              <li className="flex items-center text-gray-600">
                <i className="fas fa-map-marker-alt w-6 text-blue-500"></i>
                <span>123 Shopping Street, City</span>
              </li>
              <li className="flex items-center text-gray-600">
                <i className="fas fa-phone w-6 text-blue-500"></i>
                <span>+20 1033574732</span>
              </li>
              <li className="flex items-center text-gray-600">
                <i className="fas fa-envelope w-6 text-blue-500"></i>
                <span>abdalla7ali@icloud.com</span>
              </li>
            </ul>
          </div>
        </div>

        
        
      </div>
    </footer>
  );
}
