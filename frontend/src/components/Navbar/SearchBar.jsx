// src/components/Navbar/SearchBar.jsx
import React from 'react';
import PropTypes from 'prop-types';
import { FaSearch } from 'react-icons/fa';

// DİKKAT: Artık styles dosyasını buradan import etmiyoruz.
// Stiller, parent component (Navbar) tarafından 'isMobile' durumuna göre hesaplanıp gönderiliyor.

/**
 * Arama çubuğu bileşeni
 * @param {string} searchTerm - Arama terimi
 * @param {function} setSearchTerm - Arama terimini güncelleyen fonksiyon
 * @param {function} handleSearch - Enter tuşuna basıldığında çağrılacak fonksiyon
 * @param {object} styles - Navbar'dan gelen dinamik stil objesi
 */
const SearchBar = ({ searchTerm, setSearchTerm, handleSearch, styles }) => {
  return (
    // styles.searchContainer'ı burada kullanmıyoruz çünkü parent (Navbar) 
    // onu dış kapsayıcıya zaten verdi. Burada sadece input ve ikon hizalaması yapıyoruz.
    <div style={{ position: 'relative', width: '100%' }}>
      
      {/* İkon */}
      <FaSearch style={styles.searchIcon} />
      
      {/* Input */}
      <input 
        type="text" 
        placeholder="Ürün, kategori veya marka ara..." 
        style={styles.searchInput}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyDown={handleSearch} // Enter tuşu kontrolü
        // Focus stillerini inline olarak koruyoruz
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
  styles: PropTypes.object, // styles prop'unu doğrulama listesine ekledik
};

SearchBar.defaultProps = {
  searchTerm: '',
  styles: {}, // Boş obje fallback
};

export default SearchBar;