import React from 'react';
// FIX: Swapping lucide-react social icons for Font Awesome icons (Fa) from react-icons/fa6 
// Note: Assuming FaTiktok and FaPinterest are available in your installed version of react-icons
import { FaInstagram, FaTiktok, FaPinterest } from 'react-icons/fa6'; 
// You can remove this line if you no longer use any Lucide icons:
// import { Facebook, X, Instagram, Youtube } from 'lucide-react'; 

const Footer = () => {
  return (
  <footer className="bg-[#111111] py-8 sm:py-10 text-white font-['Inter']">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-12 py-8 sm:py-12">
        {/* Adjusted grid to feature 5 main columns: Links, Links, Brand/Social, Location 1, Location 2 */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-8 sm:gap-10 lg:gap-12">
          
          {/* 1. Useful Links */}
          <div className="space-y-4 sm:space-y-6">
            <h3 className="font-bold text-xl sm:text-2xl text-white mb-4">Useful Links</h3>
            <ul className="space-y-3 sm:space-y-4">
              <li><a href="#" className="text-base sm:text-lg text-gray-300 hover:text-white transition-colors rounded-sm">Customer Services</a></li>
              <li><a href="#" className="text-base sm:text-lg text-gray-300 hover:text-white transition-colors rounded-sm">Order Tracking</a></li>
              <li><a href="#" className="text-base sm:text-lg text-gray-300 hover:text-white transition-colors rounded-sm">Wishlist</a></li>
              <li><a href="#" className="text-base sm:text-lg text-gray-300 hover:text-white transition-colors rounded-sm">Payment</a></li>
              <li><a href="/account" className="text-base sm:text-lg text-gray-300 hover:text-white transition-colors rounded-sm">Login</a></li>
            </ul>
          </div>

          {/* 2. Quick Links */}
          <div className="space-y-4 sm:space-y-6">
            <h3 className="font-bold text-xl sm:text-2xl text-white mb-4">Quick Links</h3>
            <ul className="space-y-3 sm:space-y-4">
              <li><a href="/about" className="text-base sm:text-lg text-gray-300 hover:text-white transition-colors rounded-sm">About Us</a></li>
              <li><a href="/contact" className="text-base sm:text-lg text-gray-300 hover:text-white transition-colors rounded-sm">Contact Us</a></li>
              <li><a href="#" className="text-base sm:text-lg text-gray-300 hover:text-white transition-colors rounded-sm">Our Blog</a></li>
              <li><a href="#" className="text-base sm:text-lg text-gray-300 hover:text-white transition-colors rounded-sm">FAQs</a></li>
            </ul>
          </div>

          {/* 3. Logo and Social Media (Center Block on large screens) */}
          <div className="col-span-2 lg:col-span-1 flex flex-col items-center sm:items-start lg:items-center space-y-6 sm:space-y-10 border-t sm:border-t-0 pt-8 sm:pt-0 border-b border-b-gray-800/50 lg:border-none pb-6 lg:pb-0">
            {/* Logo with filter invert for white color */}
            <div className="flex items-center justify-center lg:justify-start">
              <img
                src='/Logo.png'
                alt="Footer Logo"
                className="h-20 sm:h-22 w-auto filter invert" // Filter invert makes the image white
                onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/150x50/111111/ffffff?text=Logo+Boxcar"; }}
              />
            </div>
            
            {/* Follow Us On */}
            <div className="space-y-4 flex flex-col items-center">
              <h3 className="font-semibold text-base sm:text-lg text-white">Follow Us On</h3>
              <div className="flex items-center gap-4 sm:gap-6">
                {/* Instagram */}
                <a href="https://www.instagram.com/bxcrdonuts/" aria-label="Instagram" className="p-2 rounded-full border border-gray-700 hover:border-white transition-all hover:bg-white/10">
                  <FaInstagram className='w-5 h-5 sm:w-6 sm:h-6'/>
                </a>

                {/* TikTok */}
                <a href="https://www.tiktok.com/@bxcr_donuts" aria-label="TikTok" className="p-2 rounded-full border border-gray-700 hover:border-white transition-all hover:bg-white/10">
                  <FaTiktok className='w-5 h-5 sm:w-6 sm:h-6'/>
                </a>

                {/* Pinterest */}
                <a href="https://ca.pinterest.com/bxcrdonuts/" aria-label="Pinterest" className="p-2 rounded-full border border-gray-700 hover:border-white transition-all hover:bg-white/10">
                  <FaPinterest className='w-5 h-5 sm:w-6 sm:h-6'/>
                </a>
              </div>
            </div>
          </div>
          
   {/* 4. Masonville Location (New Block) */}
          <div className="space-y-4 sm:space-y-6 pt-8 sm:pt-0 lg:pt-0">
            <h3 className="font-bold text-xl sm:text-2xl text-white mb-4">Masonville Location</h3>
            <div className="space-y-3 text-sm sm:text-base lg:text-lg">
              <p className="font-medium text-white">Address:</p>
              <p className="text-gray-300">1673 Richmond St, Unit 5B, London, Ontario, N6G 2N3</p>
              
              <p className="font-medium text-white mt-4">Contact:</p>
              <p className="text-gray-300">P: 519-645-3000</p>
              <p className="text-gray-300">E: <a href="mailto:hello@boxcardonuts.ca" className="hover:text-white transition-colors">hello@boxcardonuts.ca</a></p>
            </div>
          </div>

          {/* 5. Downtown Location (New Block) */}
          <div className="space-y-4 sm:space-y-6 pt-8 sm:pt-0 lg:pt-0">
            <h3 className="font-bold text-xl sm:text-2xl text-white mb-4">Downtown Location</h3>
            <div className="space-y-3 text-sm sm:text-base lg:text-lg">
              <p className="font-medium text-white">Address:</p>
              <p className="text-gray-300">200 Queens Ave, Unit 104, London, Ontario, N6A 1J3</p>
              
              <p className="font-medium text-white mt-4">Contact:</p>
              <p className="text-gray-300">P: 548-866-0421</p>
              <p className="text-gray-300">E: <a href="mailto:downtown@boxcardonuts.ca" className="hover:text-white transition-colors">downtown@boxcardonuts.ca</a></p>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4">
            <p className="text-white text-sm sm:text-base lg:text-lg">Copyright © All Right Reserved</p>
            <div className="flex gap-4 sm:gap-6">
              <a href="/terms" className="text-white hover:text-white/70 text-sm sm:text-base lg:text-lg transition-colors">Terms & Conditions</a>
              <a href="refund&return" className="text-white hover:text-white/70 text-sm sm:text-base lg:text-lg transition-colors">Refund and return policy</a>
              <a href="privacy" className="text-white hover:text-white/70 text-sm sm:text-base lg:text-lg transition-colors">Privacy Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;