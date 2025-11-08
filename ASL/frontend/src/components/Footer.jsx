import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

const Footer = () => {
  const { isDark } = useTheme();

  return (
    <footer className={`py-12 ${isDark ? 'bg-gray-900 border-t border-gray-800' : 'bg-gray-100'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>AI Alliance</h3>
            <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Making education accessible through AI-powered ASL conversion</p>
          </div>
          <div>
            <h4 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Quick Links</h4>
            <ul className={`space-y-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              <li><a href="#" className="hover:text-purple-500 transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-purple-500 transition-colors">Features</a></li>
              <li><a href="#" className="hover:text-purple-500 transition-colors">Pricing</a></li>
              <li><a href="#" className="hover:text-purple-500 transition-colors">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Connect</h4>
            <p className={`mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Stay updated with our latest features</p>
            <div className="flex space-x-4">
              <button className={`p-2 rounded-lg transition-colors ${isDark ? 'bg-gray-800 hover:bg-gray-700 text-gray-400' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}`}>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </button>
              <button className={`p-2 rounded-lg transition-colors ${isDark ? 'bg-gray-800 hover:bg-gray-700 text-gray-400' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}`}>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
              </button>
            </div>
          </div>
        </div>
        <div className={`mt-8 pt-8 border-t ${isDark ? 'border-gray-800' : 'border-gray-300'}`}>
          <p className={`text-center ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>© 2024 AI Alliance. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
