// src/features/vendor/components/VendorList/VendorFilters.jsx
import React from 'react';
import PropTypes from 'prop-types';
import { FaSearch, FaFilter } from 'react-icons/fa';
import { VENDOR_TABS } from '../../shared/constants';
import { styles } from '../../shared/styles';

const VendorFilters = React.memo(({
  searchTerm,
  onSearchChange,
  activeTab,
  onTabChange,
  showTabs = true,
  title,
}) => {
  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <div style={styles.tabContainer}>
          {showTabs ? (
            VENDOR_TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => onTabChange(tab.key)}
                style={styles.tab(activeTab === tab.key)}
              >
                {tab.label}
              </button>
            ))
          ) : (
            <span style={{ fontWeight: '600', color: 'var(--text-main)' }}>
              {title || 'Satıcı Listesi'}
            </span>
          )}
        </div>
        <div style={styles.actionGroup}>
          <div style={styles.searchWrapper}>
            <FaSearch style={styles.searchIcon} />
            <input
              type="text"
              placeholder="Mağaza veya E-posta ara..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              style={styles.searchInput}
            />
          </div>
          <button style={styles.filterButton}>
            <FaFilter /> Filtrele
          </button>
        </div>
      </div>
    </div>
  );
});

VendorFilters.displayName = 'VendorFilters';

VendorFilters.propTypes = {
  searchTerm: PropTypes.string.isRequired,
  onSearchChange: PropTypes.func.isRequired,
  activeTab: PropTypes.string.isRequired,
  onTabChange: PropTypes.func.isRequired,
  showTabs: PropTypes.bool,
  title: PropTypes.string,
};

export default VendorFilters;
