import React, { useState } from 'react';
import './App.css';
import { ThemeProvider } from './contexts/ThemeContext';
import Navbar from './components/Navbar';
import SideDrawer from './components/SideDrawer';
import HeroSection from './components/HeroSection';
import Features from './components/Features';
import HowItWorks from './components/HowItWorks';
import Footer from './components/Footer';

const App = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = () => setDrawerOpen((v) => !v);

  return (
    <ThemeProvider>
      <div className="min-h-screen">
        <Navbar toggleDrawer={toggleDrawer} />
        <SideDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />
        <HeroSection />
        <Features />
        <HowItWorks />
        <Footer />
      </div>
    </ThemeProvider>
  );
};

export default App;
