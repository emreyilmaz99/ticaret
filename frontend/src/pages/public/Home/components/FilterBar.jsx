// src/pages/public/Home/components/FilterBar.jsx
import React from 'react';
import { FaFilter } from 'react-icons/fa';

/**
 * Horizontal filter bar for product filtering
 */
const FilterBar = ({ 
  categories, 
  selectedCategory, 
  handleCategoryChange,
  priceRange, 
  setPriceRange, 
  minRating, 
  setMinRating,
  sortOrder,
  setSortOrder,
  styles 
}) => {
  // Debug: Kategorileri konsola yazdır
  console.log('FilterBar Categories:', categories);
  
  return (
    <div style={styles.filterBar}>
      <div style={styles.filterGroup}>
        <span style={{ fontWeight: '600', color: '#1e293b' }}>
          <FaFilter /> Filtrele:
        </span>
      </div>
      
      {/* Category Select */}
      <div style={styles.filterGroup}>
        <select 
          value={selectedCategory} 
          onChange={(e) => handleCategoryChange(e.target.value)}
          style={styles.filterSelect}
        >
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>

      {/* Price Range */}
      <div style={styles.filterGroup}>
        <input 
          type="number" 
          placeholder="Min TL" 
          value={priceRange[0]}
          onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
          style={styles.filterInput} 
        />
        <span style={{ color: '#94a3b8' }}>-</span>
        <input 
          type="number" 
          placeholder="Max TL" 
          value={priceRange[1]}
          onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
          style={styles.filterInput} 
        />
      </div>

      {/* Rating Filter */}
      <div style={styles.filterGroup}>
        <select 
          value={minRating} 
          onChange={(e) => setMinRating(Number(e.target.value))}
          style={styles.filterSelect}
        >
          <option value={0}>Tüm Puanlar</option>
          <option value={4}>4 Yıldız & Üzeri</option>
          <option value={3}>3 Yıldız & Üzeri</option>
          <option value={2}>2 Yıldız & Üzeri</option>
          <option value={1}>1 Yıldız & Üzeri</option>
        </select>
      </div>

      {/* Sort Order */}
      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span style={{ fontSize: '14px', color: '#64748b', whiteSpace: 'nowrap' }}>Sırala:</span>
        <select 
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          style={{
            ...styles.filterSelect,
            minWidth: '140px',
            maxWidth: '160px',
            fontSize: '13px',
            padding: '10px 12px'
          }}
        >
          <option value="featured">Önerilen</option>
          <option value="price-asc">En Düşük Fiyat</option>
          <option value="price-desc">En Yüksek Fiyat</option>
          <option value="rating-desc">En Yüksek Puan</option>
        </select>
      </div>
    </div>
  );
};

export default FilterBar;
