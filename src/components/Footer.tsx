import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-5">

        {/* Grid layout: Responsive columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 text-center lg:text-left">

          {/* QUICK LINKS */}
          <div>
            <h3 className="font-semibold text-[16px] text-black mb-4">QUICK LINKS</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-600 hover:text-navy-500">Home</Link></li>
              <li><Link to="/about" className="text-gray-600 hover:text-navy-500">About</Link></li>
              <li><Link to="/search" className="text-gray-600 hover:text-navy-500">Search</Link></li>
              <li><Link to="/brands" className="text-gray-600 hover:text-navy-500">Brands</Link></li>
            </ul>
          </div>

          {/* SUPPORT */}
          <div>
            <h3 className="font-semibold text-[16px] text-black mb-4">SUPPORT</h3>
            <ul className="space-y-2">
              <li><Link to="/contact" className="text-gray-600 hover:text-navy-500">Contact Us</Link></li>
              <li><Link to="/faq" className="text-gray-600 hover:text-navy-500">FAQ</Link></li>
              <li><Link to="/privacy" className="text-gray-600 hover:text-navy-500">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-gray-600 hover:text-navy-500">Terms of Service</Link></li>
            </ul>
          </div>

          {/* NEWSLETTER */}
          <div>
            <h3 className="font-semibold text-[16px] text-black mb-4">GET THE LATEST NEWS</h3>
            <p className="text-gray-600 text-sm mb-4">Stay updated with the latest trends</p>
            <form className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2 justify-center lg:justify-start">
              <input
                type="email"
                placeholder="Email address"
                className="px-4 py-2 w-full sm:w-[180px] border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-navy-500 text-sm"
              />
              <button
                type="submit"
                className="bg-navy-500 text-white px-4 py-2 rounded-md hover:bg-stone-600 text-sm whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>
          </div>

          {/* SOCIALS */}
          <div>
            <h3 className="font-semibold text-[16px] text-black mb-4">OUR SOCIALS</h3>
            <div className="flex justify-center lg:justify-start space-x-6">
              <a href="#" className="text-[#1877f2] ">
                <i className="fab fa-facebook-f text-[20px]"></i>
              </a>
              <a href="#" className="text-[#e4405f] ">
                <i className="fab fa-instagram text-[20px]"></i>
              </a>
              <a href="#" className="text-[#25d366]">
                <i className="fab fa-whatsapp text-[20px]"></i>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="border-t border-gray-200 mt-10 pt-6 text-center">
          <p className="text-gray-600 text-sm">
            © {new Date().getFullYear()} WardrobeGenius. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
