// src/pages/user/UserProfile/components/Sidebar.jsx
import React from 'react';
import { 
  FaUserCircle, FaMapMarkerAlt, FaShieldAlt, FaBoxOpen, FaSignOutAlt, FaStar 
} from 'react-icons/fa';

export const Sidebar = ({ activeTab, setActiveTab, onLogout, styles }) => {
  const menuItems = [
    { id: 'profile', label: 'Profil Bilgileri', icon: FaUserCircle },
    { id: 'addresses', label: 'Adreslerim', icon: FaMapMarkerAlt },
    { id: 'security', label: 'Güvenlik & Şifre', icon: FaShieldAlt },
    { id: 'orders', label: 'Siparişlerim', icon: FaBoxOpen },
    { id: 'reviews', label: 'Değerlendirmelerim', icon: FaStar },
  ];

  return (
    <div style={styles.sidebar}>
      <div style={styles.content}>
        <h3 style={styles.sectionTitle}>Hesabım</h3>
        {menuItems.map(item => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            style={{
              ...styles.menuItem,
              ...(activeTab === item.id ? styles.activeMenuItem : {})
            }}
          >
            <item.icon size={18} />
            {item.label}
          </button>
        ))}
        
        <div style={{ margin: '16px 0', borderTop: '1px solid #e2e8f0' }}></div>
        
        <button
          onClick={onLogout}
          style={{...styles.menuItem, color: '#ef4444'}}
        >
          <FaSignOutAlt size={18} />
          Çıkış Yap
        </button>
      </div>
    </div>
  );
};
