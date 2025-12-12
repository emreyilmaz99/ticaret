// src/pages/public/VendorStore/components/VendorNav.jsx
import React from 'react';
import { FaHome, FaBox, FaTags, FaStar, FaSearch } from 'react-icons/fa';

const VendorNav = ({ activeTab, setActiveTab, searchQuery, setSearchQuery, isMobile }) => {
  const tabs = [
    { key: 'home', label: 'Ana Sayfa', icon: FaHome },
    { key: 'products', label: 'Tüm Ürünler', icon: FaBox },
    { key: 'deals', label: 'Fırsat Ürünleri', icon: FaTags },
    { key: 'reviews', label: 'Değerlendirmeler', icon: FaStar },
  ];

  return (
    <div style={styles.navWrapper}>
      <div style={styles.navContent}>
        {/* Tabs */}
        <div style={styles.tabs}>
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                ...styles.tab,
                ...(activeTab === tab.key ? styles.tabActive : {})
              }}
            >
              <tab.icon style={{
                ...styles.tabIcon,
                color: activeTab === tab.key ? '#059669' : '#64748b'
              }} />
              <span>{tab.label}</span>
              {activeTab === tab.key && <div style={styles.tabActiveIndicator} />}
            </button>
          ))}
        </div>

        {/* Search */}
        <div style={styles.searchWrapper}>
          <FaSearch style={styles.searchIcon} />
          <input
            type="text"
            placeholder="Mağazada ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={styles.searchInput}
          />
        </div>
      </div>
    </div>
  );
};

const styles = {
  navWrapper: {
    backgroundColor: '#fff',
    borderBottom: '1px solid #e2e8f0',
    marginTop: '70px', // Offset for header overlap
    position: 'sticky',
    top: '0',
    zIndex: 100,
    boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
  },
  navContent: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '0 24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '24px',
  },
  tabs: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  tab: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '18px 20px',
    backgroundColor: 'transparent',
    border: 'none',
    borderBottom: 'none',
    fontSize: '14px',
    fontWeight: '600',
    color: '#64748b',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    whiteSpace: 'nowrap',
    position: 'relative',
  },
  tabActive: {
    color: '#059669',
  },
  tabActiveIndicator: {
    position: 'absolute',
    bottom: '0',
    left: '0',
    right: '0',
    height: '3px',
    backgroundColor: '#059669',
    borderRadius: '3px 3px 0 0',
  },
  tabIcon: {
    fontSize: '14px',
  },
  searchWrapper: {
    position: 'relative',
    width: '280px',
  },
  searchIcon: {
    position: 'absolute',
    left: '14px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#94a3b8',
    fontSize: '14px',
  },
  searchInput: {
    width: '100%',
    padding: '12px 16px 12px 42px',
    border: '1px solid #e2e8f0',
    borderRadius: '10px',
    fontSize: '14px',
    color: '#1e293b',
    backgroundColor: '#f8fafc',
    outline: 'none',
    transition: 'all 0.2s ease',
  },
};

export default VendorNav;
