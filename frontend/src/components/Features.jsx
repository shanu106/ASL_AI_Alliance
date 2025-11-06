import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

const Features = () => {
  const { isDark } = useTheme();

  const features = [
    { icon: '🎥', title: 'MP4 Upload', description: 'Upload your lecture videos directly in MP4 format for instant processing' },
    { icon: '🔗', title: 'YouTube Support', description: 'Paste YouTube links to convert online educational content to ASL' },
    { icon: '🤖', title: 'AI-Powered', description: 'Advanced AI algorithms ensure accurate sign language translation' },
    { icon: '⚡', title: 'Fast Processing', description: 'Quick conversion times to get your ASL videos ready in minutes' },
    { icon: '📚', title: 'Educational Focus', description: 'Optimized for academic content and study materials' },
    { icon: '♿', title: 'Accessibility', description: 'Making education accessible to the deaf and hard of hearing community' }
  ];
  return (
    <section id="features" className={`py-20 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className={`text-3xl sm:text-4xl md:text-5xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Powerful Features</h2>
          <p className={`text-lg sm:text-xl max-w-2xl mx-auto ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Everything you need to make your educational content accessible</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <div key={index} className={`p-6 rounded-2xl transition-all transform hover:scale-105 hover:-translate-y-2 ${isDark ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:shadow-2xl'}`}>
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className={`text-xl font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>{feature.title}</h3>
              <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
