import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

const HowItWorks = () => {
  const { isDark } = useTheme();

  const steps = [
    { number: '01', title: 'Upload Your Video', description: 'Choose an MP4 file from your device or paste a YouTube link' },
    { number: '02', title: 'AI Processing', description: 'Our advanced AI analyzes the speech and content of your video' },
    { number: '03', title: 'ASL Generation', description: 'The system generates accurate ASL gestures for the content' },
    { number: '04', title: 'Download & Share', description: 'Get your ASL video ready to download and share with students' }
  ];

  return (
    <section id="how-it-works" className={`py-20 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className={`text-3xl sm:text-4xl md:text-5xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>How It Works</h2>
          <p className={`text-lg sm:text-xl max-w-2xl mx-auto ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Simple steps to transform your educational content</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <div className={`text-center ${index < steps.length - 1 ? 'lg:after:content-["\"] lg:after:absolute lg:after:top-12 lg:after:left-full lg:after:w-full lg:after:h-0.5 lg:after:bg-gradient-to-r lg:after:from-purple-500 lg:after:to-transparent' : ''}`}>
                <div className="gradient-bg w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold animate-pulse-slow">{step.number}</div>
                <h3 className={`text-xl font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>{step.title}</h3>
                <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
