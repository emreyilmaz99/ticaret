import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaHome, FaBox, FaUsers, FaSignOutAlt, FaChartLine, FaStore, FaUserShield, FaPercentage } from 'react-icons/fa';

const AdminSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Hangi sayfadayız?

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    navigate('/admin/login');
  };

  // Link stilini dinamik yapan fonksiyon
  const getLinkStyle = (path) => {
    const isActive = location.pathname === path;
    return {
      color: isActive ? 'white' : '#94a3b8', // Aktifse beyaz, değilse gri
      backgroundColor: isActive ? 'var(--primary)' : 'transparent', // Aktifse Indigo
      textDecoration: 'none',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '12px 16px',
      borderRadius: 'var(--radius)',
      transition: 'all 0.2s ease',
      fontWeight: isActive ? '600' : '400',
      fontSize: '14px'
    };
  };

  return (
    <div style={{
      width: '260px',
      height: '100vh',
      backgroundColor: 'var(--bg-sidebar)',
      color: 'white',
      display: 'flex',
      flexDirection: 'column',
      padding: '24px',
      position: 'fixed',
      left: 0,
      top: 0,
      boxShadow: '4px 0 24px rgba(0,0,0,0.02)',
      zIndex: 1000
    }}>
      {/* LOGO ALANI */}
      <div style={{ marginBottom: '40px', paddingLeft: '10px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '700', letterSpacing: '-0.5px', color: 'white' }}>
          Ticaret<span style={{ color: 'var(--primary)' }}>Panel</span>
        </h2>
        <p style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>Yönetici Konsolu</p>
      </div>

      {/* MENÜ LİNKLERİ */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <p style={{ fontSize: '11px', textTransform: 'uppercase', color: '#475569', fontWeight: '700', marginBottom: '8px', paddingLeft: '10px' }}>
          Genel
        </p>
        
        <Link to="/admin/dashboard" style={getLinkStyle('/admin/dashboard')}>
          <FaHome size={18} /> Özet
        </Link>
        
        <p style={{ fontSize: '11px', textTransform: 'uppercase', color: '#475569', fontWeight: '700', marginTop: '20px', marginBottom: '8px', paddingLeft: '10px' }}>
          Yönetim
        </p>

        <Link to="/admin/active-vendors" style={getLinkStyle('/admin/active-vendors')}>
          <FaStore size={18} /> Satıcılar
        </Link>

        <Link to="/admin/vendors" style={getLinkStyle('/admin/vendors')}>
          <FaStore size={18} /> Satıcı Başvuruları
        </Link>

        <Link to="/admin/vendor-applications" style={getLinkStyle('/admin/vendor-applications')}>
          <FaUsers size={18} /> Ön Başvurular
        </Link>

        <Link to="/admin/commission-plans" style={getLinkStyle('/admin/commission-plans')}>
          <FaPercentage size={18} /> Komisyon Planları
        </Link>

        <Link to="/admin/products" style={getLinkStyle('/admin/products')}>
          <FaBox size={18} /> Ürünler
        </Link>
        
        <Link to="/admin/users" style={getLinkStyle('/admin/users')}>
          <FaUsers size={18} /> Kullanıcılar
        </Link>

        <Link to="/admin/admins" style={getLinkStyle('/admin/admins')}>
          <FaUserShield size={18} /> Yöneticiler
        </Link>

        <Link to="/admin/orders" style={getLinkStyle('/admin/orders')}>
          <FaChartLine size={18} /> Siparişler
        </Link>
      </div>

      {/* ÇIKIŞ BUTONU */}
      <button 
        onClick={handleLogout}
        style={{ 
          marginTop: 'auto', 
          backgroundColor: 'rgba(255,255,255,0.05)', 
          color: '#ef4444', // Kırmızı tonu
          border: '1px solid rgba(255,255,255,0.1)', 
          padding: '12px', 
          borderRadius: 'var(--radius)', 
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
          fontSize: '14px',
          fontWeight: '500'
        }}
        onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)'}
        onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'}
      >
        <FaSignOutAlt /> Oturumu Kapat
      </button>
    </div>
  );
};

export default AdminSidebar;