// src/pages/admin/Applications/components/SearchBar.jsx
import React from 'react';
import { FaSearch } from 'react-icons/fa';
import { styles } from '../styles';

/**
 * Arama çubuğu komponenti
 */
const SearchBar = ({ 
  value, 
  onChange, 
  placeholder = "İsim, e-posta, şirket veya vergi no ara..." 
}) => {
  return (
    <div style={styles.searchBar}>
      <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
        <FaSearch style={styles.searchIcon} />
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={styles.searchInput}
        />
      </div>
    </div>
  );
};

export default SearchBar;
