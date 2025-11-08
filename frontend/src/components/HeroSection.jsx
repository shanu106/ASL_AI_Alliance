import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import LoadingOverlay from './LoadingOverlay';
import ThreeJSHumanModel from './ThreeJSHumanModel'


const HeroSection = () => {
  const { isDark } = useTheme();
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
const [showModel, setShowModel] = useState(false);
  const [currentGesture, setCurrentGesture] = useState('idle');

  const simulateConvert = () => {
    setLoading(true);
    setLoadingMessage('Preparing conversion — uploading and analyzing video...');
    // simulate an async operation for demo; in real usage this would be passed down or lifted
    setTimeout(() => {
      setLoading(false);
      setLoadingMessage(''); 
      alert('Conversion flow started (demo)');
    }, 2500);
  };

  return (
    <section className={`min-h-screen flex items-center justify-center relative overflow-hidden ${isDark ? 'bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900' : 'bg-gradient-to-br from-purple-50 via-white to-purple-50'}`}>
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
        <div className="absolute top-3/4 right-1/4 w-64 h-64 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-1/4 left-1/2 w-64 h-64 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{animationDelay: '4s'}}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Convert Study Videos to
          <span className="block text-7xl bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent mt-2 font-sans">American Sign Language</span>
        </h1>
        <p className={`text-lg sm:text-xl md:text-2xl mb-8 max-w-3xl mx-auto ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
          Transform your MP4 lecture videos into accessible ASL content with our advanced AI technology
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button onClick={simulateConvert} className="gradient-bg text-white px-8 py-4 rounded-full text-lg font-semibold hover:opacity-90 transition-all transform hover:scale-105">Start Converting</button>
          <button onClick={() => { setLoading(!loading); setLoadingMessage('Opening demo...'); setTimeout(() => setLoading(!loading), 1500); }} className={`px-8 py-4 rounded-full text-lg font-semibold transition-all transform hover:scale-105 ${isDark ? 'bg-gray-800 text-white hover:bg-gray-700' : 'bg-white text-gray-900 hover:bg-gray-100 shadow-lg'}`}>Watch Demo</button>
        </div>
      </div>
      {/* ///////////////////////// */}
       
          
      {/* ///////////////////////// */}
      <LoadingOverlay visible={loading} message={loadingMessage} onCancel={() => { setLoading(false); setLoadingMessage(''); }} />
    </section>
  );
};

export default HeroSection;
