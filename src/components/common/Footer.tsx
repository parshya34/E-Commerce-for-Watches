import React from 'react';
import { Link } from 'react-router-dom';
import { Watch, Mail, Phone, MapPin, Facebook, Instagram, Twitter } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-secondary-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo and About */}
          <div>
            <div className="flex items-center mb-4">
              <Watch className="h-8 w-8 text-accent-400 mr-2" />
              <span className="text-2xl font-serif font-semibold text-white">Chrono</span>
            </div>
            <p className="text-secondary-300 mb-6">
              Discover exquisite timepieces that blend elegance with precision engineering. 
              Our curated collection features the finest watches for every occasion.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-secondary-300 hover:text-white transition">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-secondary-300 hover:text-white transition">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-secondary-300 hover:text-white transition">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 font-serif">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-secondary-300 hover:text-white transition">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/collection" className="text-secondary-300 hover:text-white transition">
                  Collection
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-secondary-300 hover:text-white transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-secondary-300 hover:text-white transition">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-lg font-semibold mb-4 font-serif">Customer Service</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-secondary-300 hover:text-white transition">
                  Shipping Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-secondary-300 hover:text-white transition">
                  Return & Refund
                </a>
              </li>
              <li>
                <a href="#" className="text-secondary-300 hover:text-white transition">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-secondary-300 hover:text-white transition">
                  FAQs
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4 font-serif">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex">
                <MapPin className="h-5 w-5 mr-3 text-accent-400 flex-shrink-0" />
                <span className="text-secondary-300">
                  123 Luxury Lane, Fashion District, Mumbai, Maharashtra, India
                </span>
              </li>
              <li className="flex">
                <Mail className="h-5 w-5 mr-3 text-accent-400 flex-shrink-0" />
                <a href="mailto:info@chrono.com" className="text-secondary-300 hover:text-white transition">
                  info@chrono.com
                </a>
              </li>
              <li className="flex">
                <Phone className="h-5 w-5 mr-3 text-accent-400 flex-shrink-0" />
                <a href="tel:+918625014405" className="text-secondary-300 hover:text-white transition">
                  +91 8625014405
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 mt-8 border-t border-secondary-700 text-center text-secondary-400">
          <p>&copy; {new Date().getFullYear()} Chrono. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;