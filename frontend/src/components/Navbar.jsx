import React, { useEffect, useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';

const Navbar = ({ toggleDrawer }) => {
  const { isDark } = useTheme();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed w-full top-0 z-40 transition-all duration-300 ${
      scrolled ? (isDark ? 'bg-gray-900/95 backdrop-blur-lg' : 'bg-white/95 backdrop-blur-lg shadow-lg') : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          <div className="flex items-center space-x-3">
            <button
              onClick={toggleDrawer}
              className={`p-2 rounded-lg transition-colors ${
                isDark ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-100 text-gray-700'
              }`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className={`text-xl sm:text-2xl font-bold font-['Poppins'] ${isDark ? 'text-white' : 'text-gray-900'}`}>
              AI Alliance
            </h1>
          </div>
          <div className="flex items-center space-x-4">
             <a href="http://localhost:8080" className={`hidden sm:block px-4 py-2 rounded-lg transition-colors ${
              isDark ? 'text-gray-300 hover:text-white hover:bg-gray-800' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
            }`}>
              Vidhya Home
            </a>
            <a href="#features" className={`hidden sm:block px-4 py-2 rounded-lg transition-colors ${
              isDark ? 'text-gray-300 hover:text-white hover:bg-gray-800' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
            }`}>
              Features
            </a>
            <a href="#how-it-works" className={`hidden sm:block px-4 py-2 rounded-lg transition-colors ${
              isDark ? 'text-gray-300 hover:text-white hover:bg-gray-800' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
            }`}>
              How It Works
            </a>
            <button onClick={toggleDrawer} className="gradient-bg text-white px-4 sm:px-6 py-2 rounded-full font-medium hover:opacity-90 transition-opacity">
              Get Started
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
