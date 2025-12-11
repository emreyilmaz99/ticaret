import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FaTimes, 
  FaHome, 
  FaUser, 
  FaShoppingBag, 
  FaHeart, 
  FaSignOutAlt, 
  FaSignInAlt,
  FaUserPlus,
  FaList
} from 'react-icons/fa';
import { getStyles } from './styles';

const MobileMenu = ({ isOpen, onClose, user, onLogout }) => {
  const styles = getStyles(true); // Force mobile styles
  const location = useLocation();

  // Overlay click handler to close menu
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const isActive = (path) => location.pathname === path;

  const getItemStyle = (path) => ({
    ...styles.mobileMenuItem,
    ...(isActive(path) ? styles.mobileMenuItemActive : {})
  });

  return (
    <div 
      style={{
        ...styles.mobileMenuOverlay,
        ...(isOpen ? styles.mobileMenuOverlayOpen : {})
      }}
      onClick={handleOverlayClick}
    >
      <div 
        style={{
          ...styles.mobileMenuContainer,
          ...(isOpen ? styles.mobileMenuContainerOpen : {})
        }}
      >
        {/* Header */}
        <div style={styles.mobileMenuHeader}>
          <span style={styles.logo}>ticaret.com</span>
          <button style={styles.mobileMenuCloseBtn} onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        {/* Content */}
        <div style={styles.mobileMenuContent}>
          <Link to="/" style={getItemStyle('/')} onClick={onClose}>
            <FaHome /> Ana Sayfa
          </Link>
          
          <Link to="/products" style={getItemStyle('/products')} onClick={onClose}>
            <FaList /> Kategoriler
          </Link>

          <div style={styles.mobileMenuDivider} />

          {user ? (
            <>
              <div style={{ padding: '0 12px', fontSize: '13px', color: '#64748b', marginBottom: '8px' }}>
                Hesabım ({user.name})
              </div>
              <Link to="/account/profile" style={getItemStyle('/account/profile')} onClick={onClose}>
                <FaUser /> Profilim
              </Link>
              <Link to="/account/orders" style={getItemStyle('/account/orders')} onClick={onClose}>
                <FaShoppingBag /> Siparişlerim
              </Link>
              <Link to="/account/favorites" style={getItemStyle('/account/favorites')} onClick={onClose}>
                <FaHeart /> Favorilerim
              </Link>
              <button 
                onClick={() => { onLogout(); onClose(); }} 
                style={{ ...styles.mobileMenuItem, width: '100%', border: 'none', background: 'none', cursor: 'pointer' }}
              >
                <FaSignOutAlt /> Çıkış Yap
              </button>
            </>
          ) : (
            <>
              <Link to="/auth/login" style={getItemStyle('/auth/login')} onClick={onClose}>
                <FaSignInAlt /> Giriş Yap
              </Link>
              <Link to="/auth/register" style={getItemStyle('/auth/register')} onClick={onClose}>
                <FaUserPlus /> Kayıt Ol
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
