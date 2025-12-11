// src/components/admin/AdminSidebar.jsx
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  FaHome, FaBox, FaUsers, FaSignOutAlt, FaStore, 
  FaUserShield, FaPercentage, FaLeaf, FaLayerGroup, FaShoppingBag, FaReceipt, FaStar
} from 'react-icons/fa';

const AdminSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [hoveredItem, setHoveredItem] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    navigate('/admin/login');
  };

  // Menü öğeleri
  const menuItems = {
    genel: [
      { path: '/admin/dashboard', icon: FaHome, label: 'Özet' },
    ],
    yonetim: [
      { path: '/admin/active-vendors', icon: FaStore, label: 'Satıcılar' },
      { path: '/admin/vendors', icon: FaStore, label: 'Satıcı Başvuruları' },
      { path: '/admin/vendor-applications', icon: FaUsers, label: 'Ön Başvurular' },
      
      // --- YENİ EKLENEN SİPARİŞLER ---
      { path: '/admin/orders', icon: FaShoppingBag, label: 'Siparişler' },
      // -----------------------------

      { path: '/admin/commission-plans', icon: FaPercentage, label: 'Komisyon Planları' },
      { path: '/admin/tax-classes', icon: FaReceipt, label: 'Vergi Sınıfları (KDV)' },
      { path: '/admin/categories', icon: FaLayerGroup, label: 'Kategoriler' },
      { path: '/admin/products', icon: FaBox, label: 'Ürünler' },
      { path: '/admin/featured-deals', icon: FaStar, label: 'Öne Çıkan Ürünler' },
      { path: '/admin/users', icon: FaUsers, label: 'Kullanıcılar' },
      { path: '/admin/admins', icon: FaUserShield, label: 'Yöneticiler' },
    ],
  };

  // Link stili
  const getLinkStyle = (path, isHovered) => {
    const isActive = location.pathname === path;
    return {
      color: isActive ? 'white' : isHovered ? '#a7f3d0' : '#94a3b8',
      backgroundColor: isActive 
        ? 'linear-gradient(135deg, #059669 0%, #047857 100%)' 
        : isHovered 
          ? 'rgba(16, 185, 129, 0.1)' 
          : 'transparent',
      background: isActive ? 'linear-gradient(135deg, #059669 0%, #047857 100%)' : isHovered ? 'rgba(16, 185, 129, 0.1)' : 'transparent',
      textDecoration: 'none',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '12px 16px',
      borderRadius: '10px',
      transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
      fontWeight: isActive ? '600' : '500',
      fontSize: '14px',
      position: 'relative',
      overflow: 'hidden',
      boxShadow: isActive ? '0 4px 12px rgba(5, 150, 105, 0.3)' : 'none',
      transform: isHovered && !isActive ? 'translateX(4px)' : 'translateX(0)',
    };
  };

  // Aktif gösterge
  const getActiveIndicator = (path) => {
    const isActive = location.pathname === path;
    return isActive ? (
      <div style={{
        position: 'absolute',
        left: '-24px',
        top: '50%',
        transform: 'translateY(-50%)',
        width: '4px',
        height: '24px',
        background: 'linear-gradient(180deg, #10b981 0%, #059669 100%)',
        borderRadius: '0 4px 4px 0',
      }} />
    ) : null;
  };

  const MenuItem = ({ item }) => {
    const isHovered = hoveredItem === item.path;
    const Icon = item.icon;
    
    return (
      <Link 
        to={item.path} 
        style={getLinkStyle(item.path, isHovered)}
        onMouseEnter={() => setHoveredItem(item.path)}
        onMouseLeave={() => setHoveredItem(null)}
      >
        {getActiveIndicator(item.path)}
        <Icon size={18} style={{ 
          transition: 'transform 0.2s ease',
          transform: isHovered ? 'scale(1.1)' : 'scale(1)'
        }} />
        <span>{item.label}</span>
        {location.pathname === item.path && (
          <div style={{
            marginLeft: 'auto',
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: '#a7f3d0',
            animation: 'pulse 2s infinite',
          }} />
        )}
      </Link>
    );
  };

  return (
    <div style={{
      width: '260px',
      height: '100vh',
      background: 'linear-gradient(180deg, #052e16 0%, #064e3b 100%)',
      color: 'white',
      display: 'flex',
      flexDirection: 'column',
      padding: '24px',
      position: 'fixed',
      left: 0,
      top: 0,
      boxShadow: '4px 0 24px rgba(0,0,0,0.15)',
      zIndex: 1000,
    }}>
      {/* LOGO ALANI */}
      <div style={{ marginBottom: '40px', paddingLeft: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
          }}>
            <FaLeaf size={20} color="white" />
          </div>
          <div>
            <h2 style={{ 
              fontSize: '20px', 
              fontWeight: '700', 
              letterSpacing: '-0.5px', 
              color: 'white',
              fontFamily: "'Plus Jakarta Sans', sans-serif"
            }}>
              Ticaret<span style={{ color: '#10b981' }}>Panel</span>
            </h2>
            <p style={{ fontSize: '11px', color: '#6ee7b7', marginTop: '2px', fontWeight: '500' }}>
              Yönetici Konsolu
            </p>
          </div>
        </div>
      </div>

      {/* MENÜ LİNKLERİ */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1, overflowY: 'auto' }}>
        <p style={{ 
          fontSize: '10px', 
          textTransform: 'uppercase', 
          color: '#6ee7b7', 
          fontWeight: '700', 
          marginBottom: '8px', 
          paddingLeft: '10px',
          letterSpacing: '1px'
        }}>
          Genel
        </p>
        
        {menuItems.genel.map(item => <MenuItem key={item.path} item={item} />)}
        
        <p style={{ 
          fontSize: '10px', 
          textTransform: 'uppercase', 
          color: '#6ee7b7', 
          fontWeight: '700', 
          marginTop: '24px', 
          marginBottom: '8px', 
          paddingLeft: '10px',
          letterSpacing: '1px'
        }}>
          Yönetim
        </p>

        {menuItems.yonetim.map(item => <MenuItem key={item.path} item={item} />)}
      </div>

      {/* ÇIKIŞ BUTONU */}
      <button 
        onClick={handleLogout}
        style={{ 
          marginTop: 'auto', 
          background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(239, 68, 68, 0.05) 100%)',
          color: '#fca5a5', 
          border: '1px solid rgba(239, 68, 68, 0.2)', 
          padding: '14px', 
          borderRadius: '12px', 
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
          fontSize: '14px',
          fontWeight: '600',
          transition: 'all 0.25s ease',
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.background = 'linear-gradient(135deg, rgba(239, 68, 68, 0.2) 0%, rgba(239, 68, 68, 0.1) 100%)';
          e.currentTarget.style.color = '#f87171';
          e.currentTarget.style.transform = 'translateY(-2px)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.background = 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(239, 68, 68, 0.05) 100%)';
          e.currentTarget.style.color = '#fca5a5';
          e.currentTarget.style.transform = 'translateY(0)';
        }}
      >
        <FaSignOutAlt /> Oturumu Kapat
      </button>

      {/* Pulse Animation */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.2); }
        }
      `}</style>
    </div>
  );
};

export default AdminSidebar;