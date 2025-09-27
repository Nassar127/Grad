// src/components/layout/Navbar.tsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X, BarChart3 } from 'lucide-react';
import { Link } from '../ui/Link';
import { userStore } from '../../lib/auth';
import { api } from '../../lib/api';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState(userStore.get());

  useEffect(() => {
    (async () => {
      try {
        const u = await api.me();
        setUser(u);
      } catch {}
    })();

    const onStorage = () => setUser(userStore.get());
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await api.logout();
    setUser(null);
    navigate('/login');
  };

  return (
    <header
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/90 backdrop-blur-sm shadow-md text-blue-900' : 'bg-transparent text-white'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 font-bold text-xl"> {/* 👈 Changed href to to */}
              <BarChart3 className="w-6 h-6" />
              <span>MediLearn</span>
            </Link>
          </div>

          <nav className="hidden md:block">
            <ul className="flex space-x-6">
              <li>
                <Link to="/" className="hover:text-blue-400 transition-colors"> {/* 👈 Changed href to to */}
                  Home
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-blue-400 transition-colors"> {/* 👈 Changed href to to */}
                  Our Products
                </Link>
              </li>
              <li>
                <Link to="/features" className="hover:text-blue-400 transition-colors"> {/* 👈 Changed href to to */}
                  Try Our Features
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-blue-400 transition-colors"> {/* 👈 Changed href to to */}
                  Contact
                </Link>
              </li>
              <li>
                {user ? (
                  <button className="hover:text-blue-400 transition-colors" onClick={handleLogout}>
                    Logout
                  </button>
                ) : (
                  <Link to="/login" className="hover:text-blue-400 transition-colors"> {/* 👈 Changed href to to */}
                    Login
                  </Link>
                )}
              </li>
            </ul>
          </nav>

          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="p-2 rounded-md focus:outline-none" aria-label="Toggle menu">
              {isOpen ? <X className="h-6 w-6" aria-hidden="true" /> : <Menu className="h-6 w-6" aria-hidden="true" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden ${isOpen ? 'block' : 'hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white/95 backdrop-blur-sm shadow-lg text-blue-900">
          <Link
            to="/" // 👈 Changed href to to
            className="block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-100 transition-colors"
            onClick={() => setIsOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/products" // 👈 Changed href to to
            className="block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-100 transition-colors"
            onClick={() => setIsOpen(false)}
          >
            Our Products
          </Link>
          <Link
            to="/features" // 👈 Changed href to to
            className="block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-100 transition-colors"
            onClick={() => setIsOpen(false)}
          >
            Try Our Features
          </Link>
          <Link
            to="/contact" // 👈 Changed href to to
            className="block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-100 transition-colors"
            onClick={() => setIsOpen(false)}
          >
            Contact
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;