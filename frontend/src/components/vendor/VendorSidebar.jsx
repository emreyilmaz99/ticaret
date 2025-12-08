import React, { useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaSignOutAlt, FaStore, FaTimes } from 'react-icons/fa';
import { vendorLogout } from '../../features/vendor/api/vendorAuthApi';
import { MENU_ITEMS } from './constants';
import { sidebarStyles as styles } from './styles';

const VendorSidebar = ({ isMobile, isOpen, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Close sidebar on route change (mobile)
  useEffect(() => {
    if (isMobile && onClose) {
      onClose();
    }
  }, [location.pathname, isMobile, onClose]);

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

  return (
    <div style={styles.container(isMobile, isOpen)}>
      {/* LOGO ALANI */}
      <div style={styles.logoContainer}>
        <div style={styles.logoBox}>
          <div style={styles.logoIcon}>
            <FaStore size={20} />
          </div>
          <div>
            <h2 style={styles.logoText}>
              Satıcı Paneli
            </h2>
            <p style={styles.logoSubText}>Yönetim Konsolu</p>
          </div>
        </div>

        {/* Mobile Close Button */}
        {isMobile && (
          <button 
            onClick={onClose}
            style={styles.closeButton}
          >
            <FaTimes />
          </button>
        )}
      </div>

      {/* MENÜ LİNKLERİ */}
      <div style={styles.menuContainer}>
        {MENU_ITEMS.map((section, index) => (
          <React.Fragment key={index}>
            <p style={{
              ...styles.sectionTitle,
              marginTop: index > 0 ? '24px' : '0'
            }}>
              {section.title}
            </p>
            
            {section.items.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link 
                  key={item.path} 
                  to={item.path} 
                  style={styles.link(isActive)}
                >
                  <Icon size={18} /> {item.label}
                </Link>
              );
            })}
          </React.Fragment>
        ))}
      </div>

      {/* ÇIKIŞ BUTONU */}
      <div style={styles.logoutContainer}>
        <button 
          onClick={handleLogout}
          style={styles.logoutButton}
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
