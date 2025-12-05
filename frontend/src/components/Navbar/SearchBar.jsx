// src/components/Navbar/SearchBar.jsx
import React from 'react';
import PropTypes from 'prop-types';
import { FaSearch } from 'react-icons/fa';
import { styles } from './styles';

/**
 * Arama çubuğu bileşeni
 * @param {string} searchTerm - Arama terimi
 * @param {function} setSearchTerm - Arama terimini güncelleyen fonksiyon
 * @param {function} handleSearch - Enter tuşuna basıldığında çağrılacak fonksiyon
 */
const SearchBar = ({ searchTerm, setSearchTerm, handleSearch }) => {
  return (
    <div style={styles.searchContainer}>
      <FaSearch style={styles.searchIcon} />
      <input 
        type="text" 
        placeholder="Ürün, kategori veya marka ara..." 
        style={styles.searchInput}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyDown={handleSearch}
        onFocus={(e) => e.target.style.borderColor = '#059669'}
        onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
      />
    </div>
  );
};

SearchBar.propTypes = {
  searchTerm: PropTypes.string.isRequired,
  setSearchTerm: PropTypes.func.isRequired,
  handleSearch: PropTypes.func.isRequired,
};

SearchBar.defaultProps = {
  searchTerm: '',
};

export default SearchBar;