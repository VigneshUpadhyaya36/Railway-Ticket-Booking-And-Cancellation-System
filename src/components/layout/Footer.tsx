
import React from 'react';
import { Train, Mail, Phone, MapPin, Facebook, Twitter, Instagram } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-railway-700 to-railway-800 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Train className="h-6 w-6" />
              <h3 className="text-xl font-bold">RailBooker</h3>
            </div>
            <p className="text-gray-300 mb-4">
              Your trusted partner for hassle-free train travel across the country.
              Book tickets, check schedules, and enjoy a seamless journey.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-white hover:text-railway-200">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-white hover:text-railway-200">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-white hover:text-railway-200">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 border-b border-railway-600 pb-2">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white">Home</Link>
              </li>
              <li>
                <Link to="/trains" className="text-gray-300 hover:text-white">Find Trains</Link>
              </li>
              <li>
                <Link to="/bookings" className="text-gray-300 hover:text-white">My Bookings</Link>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white">Cancellation Policy</a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white">FAQs</a>
              </li>
            </ul>
          </div>

          {/* Popular Routes */}
          <div>
            <h3 className="text-lg font-semibold mb-4 border-b border-railway-600 pb-2">Popular Routes</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-300 hover:text-white">Delhi to Mumbai</a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white">Chennai to Bangalore</a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white">Kolkata to Delhi</a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white">Mumbai to Goa</a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white">Hyderabad to Chennai</a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4 border-b border-railway-600 pb-2">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-start">
                <MapPin className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0 text-railway-300" />
                <span className="text-gray-300">
                  123 Railway Plaza, Central District<br />
                  New Delhi, 110001
                </span>
              </div>
              <div className="flex items-center">
                <Phone className="h-5 w-5 mr-2 flex-shrink-0 text-railway-300" />
                <span className="text-gray-300">+91 1800-123-4567</span>
              </div>
              <div className="flex items-center">
                <Mail className="h-5 w-5 mr-2 flex-shrink-0 text-railway-300" />
                <span className="text-gray-300">support@railbooker.com</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-railway-600 mt-8 pt-6 text-center text-gray-400">
          <p>© {new Date().getFullYear()} RailBooker. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
