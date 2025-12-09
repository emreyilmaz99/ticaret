// src/pages/public/CategoryProducts/components/SortBar.jsx
import React from 'react';
import { FaThLarge, FaThList, FaFilter } from 'react-icons/fa';

/**
 * Sort and view options bar component
 */
export const SortBar = ({
  isMobile,
  productCount,
  sortBy,
  setSortBy,
  viewMode,
  setViewMode,
  onOpenMobileFilter,
  styles
}) => {
  const SORT_OPTIONS = [
    { value: 'featured', label: 'Öne Çıkanlar' },
    { value: 'price-low', label: 'En Düşük Fiyat' },
    { value: 'price-high', label: 'En Yüksek Fiyat' },
    { value: 'newest', label: 'En Yeniler' },
    { value: 'best-seller', label: 'Çok Satanlar' }
  ];

  return (
    <div style={styles.sortBar}>
      <div style={styles.resultInfo}>
        <span style={styles.resultCount}>{productCount} ürün bulundu</span>
      </div>
      
      <div style={styles.sortOptions}>
        {/* Mobile Filter Button */}
        {isMobile && (
          <button
            onClick={onOpenMobileFilter}
            style={styles.mobileFilterBtn}
          >
            <FaFilter /> Filtrele
          </button>
        )}

        {/* Sort Select */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          style={styles.sortSelect}
        >
          {SORT_OPTIONS.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {/* View Mode Toggle (Desktop only) */}
        {!isMobile && (
          <div style={styles.viewToggle}>
            <button
              onClick={() => {
                console.log('Grid button clicked');
                setViewMode('grid');
              }}
              style={{
                ...styles.viewBtn,
                backgroundColor: viewMode === 'grid' ? '#064e3b' : '#f0f0f0',
                color: viewMode === 'grid' ? '#fff' : '#333'
              }}
            >
              <FaThLarge />
            </button>
            <button
              onClick={() => {
                console.log('List button clicked');
                setViewMode('list');
              }}
              style={{
                ...styles.viewBtn,
                backgroundColor: viewMode === 'list' ? '#064e3b' : '#f0f0f0',
                color: viewMode === 'list' ? '#fff' : '#333'
              }}
            >
              <FaThList />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
