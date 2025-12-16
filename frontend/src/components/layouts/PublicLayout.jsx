import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../navigation/Navbar';
import Footer from '../common/Footer';

const PublicLayout = () => {
  const location = useLocation();

  // Sayfa değiştiğinde scroll'u en üste götür
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth' // Yumuşak kaydırma efekti
    });
  }, [location.pathname]);

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column', 
      backgroundColor: '#f8fafc' 
    }}>
      <Navbar />
      <div style={{ flex: 1 }}>
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default PublicLayout;
