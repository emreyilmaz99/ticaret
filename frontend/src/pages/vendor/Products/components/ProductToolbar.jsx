// src/pages/vendor/Products/components/ProductToolbar.jsx
import React from 'react';
import { FaSearch, FaTh, FaList } from 'react-icons/fa';
import { styles } from '../styles';

const ProductToolbar = ({
  filterText,
  onFilterChange,
  viewMode,
  onViewModeChange,
  sortOrder,
  onSortChange
}) => {
  return (
    <div style={styles.toolbar}>
      <div style={styles.searchWrapper}>
        <FaSearch style={styles.searchIcon} />
        <input
          type="text"
          placeholder="Ürün ara..."
          value={filterText}
          onChange={(e) => onFilterChange(e.target.value)}
          style={styles.searchInput}
        />
      </div>

      <div style={styles.toolbarRight}>
        <select
          value={sortOrder}
          onChange={(e) => onSortChange(e.target.value)}
          style={styles.sortSelect}
        >
          <option value="name_asc">İsim (A-Z)</option>
          <option value="name_desc">İsim (Z-A)</option>
          <option value="price_asc">Fiyat (Düşük → Yüksek)</option>
          <option value="price_desc">Fiyat (Yüksek → Düşük)</option>
          <option value="date_asc">Tarih (Eski → Yeni)</option>
          <option value="date_desc">Tarih (Yeni → Eski)</option>
        </select>

        <div style={styles.viewToggle}>
          <button
            style={{
              ...styles.viewButton,
              ...(viewMode === 'grid' ? styles.viewButtonActive : {})
            }}
            onClick={() => onViewModeChange('grid')}
            title="Grid görünümü"
          >
            <FaTh />
          </button>
          <button
            style={{
              ...styles.viewButton,
              ...(viewMode === 'list' ? styles.viewButtonActive : {})
            }}
            onClick={() => onViewModeChange('list')}
            title="Liste görünümü"
          >
            <FaList />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductToolbar;
