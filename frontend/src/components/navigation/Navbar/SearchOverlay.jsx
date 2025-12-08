import React, { useState, useEffect, useRef } from 'react';
import { FaArrowLeft, FaSearch, FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { getStyles } from './styles';

const SearchOverlay = ({ isOpen, onClose }) => {
  const styles = getStyles(true); // Force mobile styles
  const [searchTerm, setSearchTerm] = useState('');
  const inputRef = useRef(null);
  const navigate = useNavigate();

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current.focus();
      }, 300); // Wait for animation
    }
  }, [isOpen]);

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
      onClose();
    }
  };

  const handleTagClick = (term) => {
    setSearchTerm(term);
    navigate(`/search?q=${encodeURIComponent(term)}`);
    onClose();
  };

  // Mock Data
  const recentSearches = ['iPhone 13', 'Spor Ayakkabı', 'Kablosuz Kulaklık', 'Laptop'];
  const popularProducts = [
    { id: 1, name: 'Apple AirPods Pro', price: '5.499 TL', image: 'https://placehold.co/100x100?text=AirPods' },
    { id: 2, name: 'Samsung Galaxy S23', price: '24.999 TL', image: 'https://placehold.co/100x100?text=S23' },
    { id: 3, name: 'Nike Air Force 1', price: '3.299 TL', image: 'https://placehold.co/100x100?text=Nike' },
  ];

  return (
    <div style={{
      ...styles.searchOverlay,
      ...(isOpen ? styles.searchOverlayOpen : {})
    }}>
      {/* Header */}
      <div style={styles.searchHeader}>
        <button style={styles.searchBackBtn} onClick={onClose}>
          <FaArrowLeft />
        </button>
        <div style={{ position: 'relative', flex: 1, display: 'flex', alignItems: 'center' }}>
          <FaSearch style={{ color: '#94a3b8', marginRight: '8px' }} />
          <input
            ref={inputRef}
            type="text"
            placeholder="Ürün, kategori veya marka ara..."
            style={styles.searchOverlayInput}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleSearch}
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')}
              style={{ background: 'none', border: 'none', color: '#94a3b8', padding: '4px' }}
            >
              <FaTimes />
            </button>
          )}
        </div>
      </div>

      {/* Body */}
      <div style={styles.searchBody}>
        {/* Recent Searches */}
        <div style={styles.searchSectionTitle}>Son Aramalar</div>
        <div style={styles.recentTags}>
          {recentSearches.map((term, index) => (
            <div key={index} style={styles.recentTag} onClick={() => handleTagClick(term)}>
              {term}
            </div>
          ))}
        </div>

        {/* Popular Products */}
        <div style={{ ...styles.searchSectionTitle, marginTop: '24px' }}>Popüler Ürünler</div>
        <div style={styles.popularList}>
          {popularProducts.map((product) => (
            <div key={product.id} style={styles.popularItem} onClick={() => handleTagClick(product.name)}>
              <img src={product.image} alt={product.name} style={styles.popularItemImage} />
              <div style={styles.popularItemInfo}>
                <div style={styles.popularItemName}>{product.name}</div>
                <div style={styles.popularItemPrice}>{product.price}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchOverlay;
