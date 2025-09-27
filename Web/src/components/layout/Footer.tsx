import React from 'react';
import { BarChart3, Mail, Phone, MapPin, Facebook, Linkedin, Instagram } from 'lucide-react';
import { Link } from '../ui/Link';

const Footer: React.FC = () => {
  return (
    <footer className="bg-blue-900 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link href="/" className="flex items-center gap-2 text-white mb-4">
              <BarChart3 className="w-6 h-6" />
              <span className="font-bold text-xl">MediLearn</span>
            </Link>
            <p className="text-blue-200 mb-4">
              Revolutionizing medical education through interactive 3D models and AI-powered learning.
            </p>
            <div className="flex space-x-4">
              <a href="https://www.facebook.com/profile.php?id=61577413127080" className="text-blue-200 hover:text-white transition-colors">
                <Facebook size={20} />
              </a>
              <a href="https://www.linkedin.com/in/medi-learn-66b3ba372/" className="text-blue-200 hover:text-white transition-colors">
                <Linkedin size={20} />
              </a>
              <a href="#" className="text-blue-200 hover:text-white transition-colors">
                <Instagram size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-blue-200 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-blue-200 hover:text-white transition-colors">
                  Our Products
                </Link>
              </li>
              <li>
                <Link href="/features" className="text-blue-200 hover:text-white transition-colors">
                  Try Our Features
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-blue-200 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Our Features</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/features#brain" className="text-blue-200 hover:text-white transition-colors">
                  3D Brain Model
                </Link>
              </li>
              <li>
                <Link href="/features#heart" className="text-blue-200 hover:text-white transition-colors">
                  3D Heart Model
                </Link>
              </li>
              <li>
                <Link href="/features#chatbot" className="text-blue-200 hover:text-white transition-colors">
                  Medical AI Chatbot
                </Link>
              </li>
              <li>
                <Link href="/features" className="text-blue-200 hover:text-white transition-colors">
                  All Features
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <MapPin size={16} className="text-blue-200" />
                <span className="text-blue-200">Extension of 26th of July Corridor, Sheikh Zayed City, 12588 Giza, Egypt</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={16} className="text-blue-200" />
                <span className="text-blue-200">+20 114 231 2035</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={16} className="text-blue-200" />
                <span className="text-blue-200">medi.learn.v2@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-blue-800 mt-12 pt-6 text-center text-blue-300">
          <p>&copy; {new Date().getFullYear()} MediLearn. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;