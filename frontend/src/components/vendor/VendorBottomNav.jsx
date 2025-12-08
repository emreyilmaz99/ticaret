import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaBox, FaShoppingBag, FaWallet, FaBars } from 'react-icons/fa';

const VendorBottomNav = ({ onMenuClick }) => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path);
  };

  const styles = {
    bottomNav: {
      display: 'flex',
      position: 'fixed',
      bottom: 0,
      left: 0,
      width: '100%',
      height: '65px',
      backgroundColor: 'white',
      borderTop: '1px solid #e2e8f0',
      zIndex: 1100,
      justifyContent: 'space-around',
      alignItems: 'center',
      boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.05)',
      paddingBottom: 'safe-area-inset-bottom' // For iPhone X+
    },
    bottomNavItem: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textDecoration: 'none',
      color: '#64748b',
      fontSize: '10px',
      fontWeight: '500',
      gap: '4px',
      flex: 1,
      height: '100%',
      transition: 'all 0.2s ease'
    },
    bottomNavItemActive: {
      color: '#059669',
      fontWeight: '600'
    },
    bottomNavIcon: {
      fontSize: '20px',
      position: 'relative',
      marginBottom: '2px'
    },
    menuButton: {
      background: 'none',
      border: 'none',
      padding: 0,
      cursor: 'pointer',
      fontFamily: 'inherit'
    }
  };

  const navItems = [
    { path: '/vendor/dashboard', icon: <FaHome />, label: 'Özet' },
    { path: '/vendor/products', icon: <FaBox />, label: 'Ürünler' },
    { path: '/vendor/orders', icon: <FaShoppingBag />, label: 'Sipariş' },
    { path: '/vendor/finance', icon: <FaWallet />, label: 'Finans' },
  ];

  return (
    <div style={styles.bottomNav}>
      {navItems.map((item) => (
        <Link 
          key={item.path} 
          to={item.path} 
          style={{
            ...styles.bottomNavItem,
            ...(isActive(item.path) ? styles.bottomNavItemActive : {})
          }}
        >
          <div style={styles.bottomNavIcon}>
            {item.icon}
          </div>
          <span>{item.label}</span>
        </Link>
      ))}
      
      {/* Menu Button (Toggles Sidebar) */}
      <button 
        onClick={onMenuClick}
        style={{
          ...styles.bottomNavItem,
          ...styles.menuButton
        }}
      >
        <div style={styles.bottomNavIcon}>
          <FaBars />
        </div>
        <span>Menü</span>
      </button>
    </div>
  );
};

export default VendorBottomNav;
