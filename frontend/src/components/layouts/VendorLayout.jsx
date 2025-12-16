import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation, Navigate } from 'react-router-dom';
import VendorSidebar from '../vendor/VendorSidebar';
import VendorBottomNav from '../vendor/VendorBottomNav';
import VendorMobileHeader from '../vendor/VendorMobileHeader';

const VendorLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Token kontrolü - sayfa yüklenmeden önce kontrol et
  const token = localStorage.getItem('vendor_token');
  
  // Token yoksa hemen login sayfasına yönlendir
  if (!token) {
    return <Navigate to="/vendor/login" replace />;
  }

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Get page title based on path
  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes('/dashboard')) return 'Mağaza Paneli';
    if (path.includes('/products')) return 'Ürünlerim';
    if (path.includes('/orders')) return 'Siparişler';
    if (path.includes('/finance')) return 'Finans';
    if (path.includes('/settings')) return 'Ayarlar';
    return 'Satıcı Paneli';
  };

  return (
    <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      {/* Sol taraf: Sidebar */}
      <VendorSidebar 
        isMobile={isMobile} 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />

      {/* Mobile Overlay */}
      {isMobile && isSidebarOpen && (
        <div 
          onClick={() => setIsSidebarOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 1150,
            backdropFilter: 'blur(2px)',
            transition: 'opacity 0.3s ease'
          }}
        />
      )}

      {/* Mobile Header */}
      {isMobile && (
        <VendorMobileHeader 
          onMenuClick={() => setIsSidebarOpen(true)} 
          onNotificationClick={() => alert('Bildirimler yakında eklenecek!')}
          title={getPageTitle()}
        />
      )}

      {/* Sağ taraf: İçerik Alanı */}
      <div style={{ 
        marginLeft: isMobile ? 0 : '280px', 
        width: isMobile ? '100%' : 'calc(100% - 280px)', 
        padding: isMobile ? '16px' : '32px', 
        paddingBottom: isMobile ? '80px' : '32px', // Bottom nav için boşluk
        backgroundColor: '#f8fafc',
        minHeight: '100vh',
        transition: 'all 0.3s ease'
      }}>
        <Outlet context={{ isMobile }} /> 
      </div>

      {/* Bottom Navigation (Sadece Mobil) */}
      {isMobile && (
        <VendorBottomNav onMenuClick={() => setIsSidebarOpen(true)} />
      )}
    </div>
  );
};

export default VendorLayout;
