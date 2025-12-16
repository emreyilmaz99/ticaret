// src/components/Navbar/SearchBar.jsx
import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { FaSearch } from 'react-icons/fa';
import SearchDropdown from './SearchDropdown';
import { searchProducts } from '../../../services/searchService';

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
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [popularSearches, setPopularSearches] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const searchTimeoutRef = useRef(null);

  // Debounced search - kullanıcı yazmayı bıraktıktan 300ms sonra arama yapar
  useEffect(() => {
    if (searchTerm.length >= 2) {
      setIsLoading(true);
      setIsDropdownOpen(true);

      // Önceki timeout'u temizle
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }

      // Yeni timeout ayarla
      searchTimeoutRef.current = setTimeout(async () => {
        try {
          const response = await searchProducts(searchTerm);
          if (response.success) {
            setSearchResults(response.data.products || []);
            setPopularSearches(response.data.popular_searches || []);
          }
        } catch (error) {
          console.error('Arama hatası:', error);
          setSearchResults([]);
        } finally {
          setIsLoading(false);
        }
      }, 300);
    } else {
      setIsDropdownOpen(false);
      setSearchResults([]);
    }

    // Cleanup
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchTerm]);

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

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
        onFocus={() => {
          if (searchTerm.length >= 2) {
            setIsDropdownOpen(true);
          }
        }}
        // Focus stillerini inline olarak koruyoruz
        onFocus={(e) => {
          e.target.style.borderColor = '#059669';
          if (searchTerm.length >= 2) {
            setIsDropdownOpen(true);
          }
        }}
        onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
      />

      {/* Search Dropdown */}
      <SearchDropdown
        isOpen={isDropdownOpen}
        searchResults={searchResults}
        popularSearches={popularSearches}
        isLoading={isLoading}
        onClose={closeDropdown}
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