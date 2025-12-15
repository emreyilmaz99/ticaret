import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaSignOutAlt, FaStore, FaTimes, FaChevronDown, FaChevronRight } from 'react-icons/fa';
import { vendorLogout } from '../../features/vendor/api/vendorAuthApi';
import { MENU_GROUPS } from './constants';
import { sidebarStyles as styles } from './styles';

const VendorSidebar = ({ isMobile, isOpen, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [expandedGroups, setExpandedGroups] = useState([]);

  // Close sidebar on route change (mobile)
  useEffect(() => {
    if (isMobile && onClose) {
      onClose();
    }
  }, [location.pathname, isMobile, onClose]);

  const toggleGroup = (groupKey) => {
    setExpandedGroups(prev => 
      prev.includes(groupKey) 
        ? prev.filter(key => key !== groupKey)
        : [...prev, groupKey]
    );
  };

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

  // Menü item component'i
  const MenuItem = ({ item }) => {
    const Icon = item.icon;
    const isActive = location.pathname === item.path;
    
    return (
      <Link 
        to={item.path} 
        style={{
          ...styles.link(isActive),
          paddingLeft: '40px',
          fontSize: '13px',
        }}
        onMouseEnter={(e) => {
          if (!isActive) {
            e.currentTarget.style.backgroundColor = 'rgba(148, 163, 184, 0.1)';
            e.currentTarget.style.color = '#cbd5e1';
          }
        }}
        onMouseLeave={(e) => {
          if (!isActive) {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = '#94a3b8';
          }
        }}
      >
        <Icon size={14} />
        <span>{item.label}</span>
        {isActive && (
          <div style={{
            marginLeft: 'auto',
            width: '5px',
            height: '5px',
            borderRadius: '50%',
            backgroundColor: '#10b981',
            animation: 'pulse 2s infinite',
          }} />
        )}
      </Link>
    );
  };

  // Grup başlığı component'i
  const GroupHeader = ({ group }) => {
    const isExpanded = expandedGroups.includes(group.key);
    const hasActiveChild = group.items?.some(item => location.pathname === item.path);
    const Icon = group.icon;
    
    return (
      <div
        onClick={() => group.items && toggleGroup(group.key)}
        style={{
          color: hasActiveChild ? '#10b981' : '#cbd5e1',
          cursor: group.items ? 'pointer' : 'default',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '12px 16px',
          borderRadius: '10px',
          transition: 'all 0.2s ease',
          fontWeight: '700',
          fontSize: '13px',
          backgroundColor: hasActiveChild ? 'rgba(16, 185, 129, 0.1)' : 'transparent',
          marginTop: group.key === 'genel' ? '0' : '16px',
          fontFamily: "'Plus Jakarta Sans', sans-serif",
        }}
        onMouseEnter={(e) => {
          if (group.items) {
            e.currentTarget.style.backgroundColor = 'rgba(148, 163, 184, 0.1)';
          }
        }}
        onMouseLeave={(e) => {
          if (!hasActiveChild) {
            e.currentTarget.style.backgroundColor = 'transparent';
          } else {
            e.currentTarget.style.backgroundColor = 'rgba(16, 185, 129, 0.1)';
          }
        }}
      >
        {Icon && <Icon size={16} />}
        <span style={{ flex: 1 }}>{group.label}</span>
        {group.items && (
          isExpanded ? <FaChevronDown size={12} /> : <FaChevronRight size={12} />
        )}
      </div>
    );
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
        {MENU_GROUPS.map(group => (
          <div key={group.key}>
            <GroupHeader group={group} />
            {group.items && expandedGroups.includes(group.key) && (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '2px',
                marginTop: '4px',
                marginBottom: '4px',
              }}>
                {group.items.map(item => (
                  <MenuItem key={item.path} item={item} />
                ))}
              </div>
            )}
          </div>
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
