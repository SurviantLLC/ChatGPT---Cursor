'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { FaPlus, FaUser, FaSignOutAlt, FaLightbulb, FaBars, FaTimes } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [scrolled, setScrolled] = useState<boolean>(false);
  const pathname = usePathname();
  
  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      setIsLoggedIn(!!data.session);
    };
    
    checkAuth();
    
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setIsLoggedIn(!!session);
    });

    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    return () => {
      authListener?.subscription.unsubscribe();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Active link style
  const activeLinkClass = "text-primary-600 font-medium";
  const inactiveLinkClass = "text-gray-600 hover:text-primary-500 transition-colors duration-200";
  
  return (
    <motion.nav 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`sticky top-0 z-50 w-full transition-all duration-300 ease-in-out ${
        scrolled ? 'bg-white/95 backdrop-blur-sm shadow-md' : 'bg-white'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.div 
            className="flex-shrink-0 flex items-center"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link href="/" className="flex items-center space-x-2">
              <FaLightbulb className="h-6 w-6 text-primary-500" />
              <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-secondary-500 bg-clip-text text-transparent">
                Startup Idea Hub
              </span>
            </Link>
          </motion.div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-6">
            {isLoggedIn ? (
              <>
                <Link 
                  href="/"
                  className={`px-3 py-2 text-sm ${pathname === '/' ? activeLinkClass : inactiveLinkClass}`}
                >
                  Discover
                </Link>
                <Link 
                  href="/ideas/new" 
                  className="flex items-center space-x-1 btn btn-primary shadow-sm hover:shadow-md"
                >
                  <FaPlus size={14} />
                  <span>New Idea</span>
                </Link>
                <Link
                  href="/profile"
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm ${pathname === '/profile' ? activeLinkClass : inactiveLinkClass}`}
                >
                  <FaUser size={14} />
                  <span>Profile</span>
                </Link>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm text-gray-600 hover:text-red-500 transition-colors"
                >
                  <FaSignOutAlt size={14} />
                  <span>Log Out</span>
                </motion.button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${pathname === '/login' ? 'text-primary-700 bg-primary-50' : 'text-gray-700 hover:bg-gray-50'}`}
                >
                  Log In
                </Link>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    href="/register"
                    className="btn btn-primary shadow-sm hover:shadow-md"
                  >
                    Sign Up
                  </Link>
                </motion.div>
              </>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-primary-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 transition-colors duration-200"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <FaTimes className="block h-5 w-5" aria-hidden="true" />
              ) : (
                <FaBars className="block h-5 w-5" aria-hidden="true" />
              )}
            </motion.button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu, show/hide based on menu state */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            className="md:hidden bg-white shadow-lg rounded-b-lg"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="px-3 pt-2 pb-3 space-y-1 sm:px-4">
              {isLoggedIn ? (
                <>
                  <Link
                    href="/"
                    className={`block px-3 py-2 rounded-md text-base font-medium ${pathname === '/' ? 'text-primary-600 bg-primary-50' : 'text-gray-600 hover:bg-gray-50'}`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Discover
                  </Link>
                  <Link
                    href="/ideas/new"
                    className="flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium text-primary-600 hover:bg-primary-50"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <FaPlus size={16} />
                    <span>New Idea</span>
                  </Link>
                  <Link
                    href="/profile"
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium ${pathname === '/profile' ? 'text-primary-600 bg-primary-50' : 'text-gray-600 hover:bg-gray-50'}`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <FaUser size={16} />
                    <span>Profile</span>
                  </Link>
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      handleLogout();
                    }}
                    className="flex items-center space-x-2 w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-red-500 hover:bg-red-50"
                  >
                    <FaSignOutAlt size={16} />
                    <span>Log Out</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className={`block px-3 py-2 rounded-md text-base font-medium ${pathname === '/login' ? 'text-primary-600 bg-primary-50' : 'text-gray-600 hover:bg-gray-50'}`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Log In
                  </Link>
                  <Link
                    href="/register"
                    className="block px-3 py-2 rounded-md text-base font-medium bg-primary-600 text-white hover:bg-primary-700 mt-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
