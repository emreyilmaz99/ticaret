import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaList, FaShoppingBag, FaHeart, FaUser } from 'react-icons/fa';
import { getStyles } from './styles';

const BottomNav = ({ cartItemCount, favoriteCount }) => {
  const styles = getStyles(true); // Force mobile styles
  const location = useLocation();

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const navItems = [
    { path: '/', icon: <FaHome />, label: 'Ana Sayfa' },
    { path: '/products', icon: <FaList />, label: 'Kategoriler' },
    { 
      path: '/cart', 
      icon: <FaShoppingBag />, 
      label: 'Sepetim',
      badge: cartItemCount 
    },
    { 
      path: '/favorites', 
      icon: <FaHeart />, 
      label: 'Favoriler',
      badge: favoriteCount
    },
    { path: '/account/profile', icon: <FaUser />, label: 'Hesabım' },
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
            {item.badge > 0 && (
              <span style={styles.bottomNavBadge}>{item.badge}</span>
            )}
          </div>
          <span>{item.label}</span>
        </Link>
      ))}
    </div>
  );
};

export default BottomNav;
