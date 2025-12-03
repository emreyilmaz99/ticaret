import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaUser, FaMapMarkerAlt, FaShoppingBag, FaHeart, FaSignOutAlt, FaUserCircle, FaStar, FaBell, FaCreditCard } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const UserSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const getLinkStyle = (path) => {
    const isActive = location.pathname === path;
    return {
      color: isActive ? 'white' : '#bfdbfe',
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
      backgroundColor: '#1e40af',
      backgroundImage: 'linear-gradient(to bottom, #1e40af, #1e3a8a)',
      color: 'white',
      display: 'flex',
      flexDirection: 'column',
      padding: '24px',
      position: 'fixed',
      left: 0,
      top: 0,
      boxShadow: '4px 0 24px rgba(0,0,0,0.05)',
      zIndex: 1000
    }}>
      {/* KULLANICI BİLGİSİ */}
      <div style={{ marginBottom: '40px', paddingLeft: '10px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ 
          width: '48px', 
          height: '48px', 
          backgroundColor: 'white', 
          borderRadius: '50%', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          color: '#1e40af',
          overflow: 'hidden'
        }}>
          {user?.avatar ? (
            <img src={user.avatar} alt={user.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <FaUserCircle size={28} />
          )}
        </div>
        <div>
          <h2 style={{ fontSize: '16px', fontWeight: '700', letterSpacing: '-0.3px', color: 'white', margin: 0 }}>
            {user?.name || 'Kullanıcı'}
          </h2>
          <p style={{ fontSize: '12px', color: '#93c5fd', marginTop: '2px', margin: 0 }}>
            {user?.email || ''}
          </p>
        </div>
      </div>

      {/* MENÜ LİNKLERİ */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
        <p style={{ fontSize: '11px', textTransform: 'uppercase', color: '#93c5fd', fontWeight: '700', marginBottom: '12px', paddingLeft: '10px', letterSpacing: '1px' }}>
          Hesabım
        </p>
        
        <Link to="/account/profile" style={getLinkStyle('/account/profile')}>
          <FaUser size={18} /> Profil Bilgilerim
        </Link>
        
        <Link to="/account/addresses" style={getLinkStyle('/account/addresses')}>
          <FaMapMarkerAlt size={18} /> Adreslerim
        </Link>

        <p style={{ fontSize: '11px', textTransform: 'uppercase', color: '#93c5fd', fontWeight: '700', marginTop: '24px', marginBottom: '12px', paddingLeft: '10px', letterSpacing: '1px' }}>
          Alışverişlerim
        </p>

        <Link to="/account/orders" style={getLinkStyle('/account/orders')}>
          <FaShoppingBag size={18} /> Siparişlerim
        </Link>

        <Link to="/account/favorites" style={getLinkStyle('/account/favorites')}>
          <FaHeart size={18} /> Favorilerim
        </Link>

        <Link to="/account/reviews" style={getLinkStyle('/account/reviews')}>
          <FaStar size={18} /> Değerlendirmelerim
        </Link>

        {/* İleride eklenecekler için placeholder 
        <p style={{ fontSize: '11px', textTransform: 'uppercase', color: '#93c5fd', fontWeight: '700', marginTop: '24px', marginBottom: '12px', paddingLeft: '10px', letterSpacing: '1px' }}>
          Diğer
        </p>

        <Link to="/account/notifications" style={getLinkStyle('/account/notifications')}>
          <FaBell size={18} /> Bildirimler
        </Link>

        <Link to="/account/payment-methods" style={getLinkStyle('/account/payment-methods')}>
          <FaCreditCard size={18} /> Ödeme Yöntemlerim
        </Link>
        */}
      </div>

      {/* ÇIKIŞ BUTONU */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '20px' }}>
        <button 
          onClick={handleLogout}
          style={{ 
            width: '100%',
            backgroundColor: 'rgba(220, 38, 38, 0.1)', 
            color: '#fca5a5',
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
          <FaSignOutAlt /> Çıkış Yap
        </button>
      </div>
    </div>
  );
};

export default UserSidebar;
