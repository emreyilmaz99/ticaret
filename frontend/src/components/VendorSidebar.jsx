import React, { useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaHome, FaBox, FaShoppingBag, FaSignOutAlt, FaStore, FaCog, FaWallet, FaTags, FaTruck, FaGift, FaTimes } from 'react-icons/fa';
import { vendorLogout } from '../features/vendor/api/vendorAuthApi';

const VendorSidebar = ({ isMobile, isOpen, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Close sidebar on route change (mobile)
  useEffect(() => {
    if (isMobile && onClose) {
      onClose();
    }
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      await vendorLogout();
    } catch (error) {
      console.error('Logout failed', error);
    } finally {
      localStorage.removeItem('vendor_token');
      navigate('/vendor/login');
    }
  };

  const getLinkStyle = (path) => {
    const isActive = location.pathname === path;
    return {
      color: isActive ? 'white' : '#dcfce7', // Light green text for inactive
      backgroundColor: isActive ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
      textDecoration: 'none',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '12px 16px',
      borderRadius: '12px',
      transition: 'all 0.2s ease',
      fontWeight: isActive ? '600' : '400',
      fontSize: '14px',
      marginBottom: '4px'
    };
  };

  return (
    <div style={{
      width: '280px',
      height: '100vh',
      backgroundColor: '#14532d', // Dark Green
      backgroundImage: 'linear-gradient(to bottom, #14532d, #064e3b)',
      color: 'white',
      display: 'flex',
      flexDirection: 'column',
      padding: '24px',
      position: 'fixed',
      left: 0,
      top: 0,
      boxShadow: '4px 0 24px rgba(0,0,0,0.05)',
      zIndex: 1200,
      transition: 'transform 0.3s ease-in-out',
      transform: isMobile ? (isOpen ? 'translateX(0)' : 'translateX(-100%)') : 'none',
    }}>
      {/* LOGO ALANI */}
      <div style={{ marginBottom: '40px', paddingLeft: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ 
            width: '36px', 
            height: '36px', 
            backgroundColor: 'white', 
            borderRadius: '8px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            color: '#14532d'
          }}>
            <FaStore size={20} />
          </div>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: '700', letterSpacing: '-0.5px', color: 'white', margin: 0 }}>
              Satıcı Paneli
            </h2>
            <p style={{ fontSize: '11px', color: '#86efac', marginTop: '2px', margin: 0 }}>Yönetim Konsolu</p>
          </div>
        </div>

        {/* Mobile Close Button */}
        {isMobile && (
          <button 
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'white',
              fontSize: '20px',
              cursor: 'pointer',
              padding: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <FaTimes />
          </button>
        )}
      </div>

      {/* MENÜ LİNKLERİ */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1, overflowY: 'auto' }}>
        <p style={{ fontSize: '11px', textTransform: 'uppercase', color: '#86efac', fontWeight: '700', marginBottom: '12px', paddingLeft: '10px', letterSpacing: '1px' }}>
          Genel Bakış
        </p>
        
        <Link to="/vendor/dashboard" style={getLinkStyle('/vendor/dashboard')}>
          <FaHome size={18} /> Özet
        </Link>
        
        <p style={{ fontSize: '11px', textTransform: 'uppercase', color: '#86efac', fontWeight: '700', marginTop: '24px', marginBottom: '12px', paddingLeft: '10px', letterSpacing: '1px' }}>
          Mağaza Yönetimi
        </p>

        <Link to="/vendor/products" style={getLinkStyle('/vendor/products')}>
          <FaBox size={18} /> Ürünlerim
        </Link>

        <Link to="/vendor/categories" style={getLinkStyle('/vendor/categories')}>
          <FaTags size={18} /> Kategoriler
        </Link>

        <Link to="/vendor/orders" style={getLinkStyle('/vendor/orders')}>
          <FaShoppingBag size={18} /> Siparişler
        </Link>
        
        <Link to="/vendor/finance" style={getLinkStyle('/vendor/finance')}>
          <FaWallet size={18} /> Finans & Ödemeler
        </Link>

        <Link to="/vendor/shipping" style={getLinkStyle('/vendor/shipping')}>
          <FaTruck size={18} /> Kargo Ayarları
        </Link>

        <Link to="/vendor/promotions" style={getLinkStyle('/vendor/promotions')}>
          <FaGift size={18} /> Promosyonlar
        </Link>

        <Link to="/vendor/settings" style={getLinkStyle('/vendor/settings')}>
          <FaCog size={18} /> Mağaza Ayarları
        </Link>
      </div>

      {/* ÇIKIŞ BUTONU */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '20px' }}>
        <button 
          onClick={handleLogout}
          style={{ 
            width: '100%',
            backgroundColor: 'rgba(220, 38, 38, 0.1)', 
            color: '#fca5a5', // Light Red
            border: 'none', 
            padding: '12px', 
            borderRadius: '12px', 
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            fontSize: '14px',
            fontWeight: '600',
            transition: 'all 0.2s'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(220, 38, 38, 0.2)';
            e.currentTarget.style.color = '#fecaca';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(220, 38, 38, 0.1)';
            e.currentTarget.style.color = '#fca5a5';
          }}
        >
          <FaSignOutAlt /> Güvenli Çıkış
        </button>
      </div>
    </div>
  );
};

export default VendorSidebar;
