// src/pages/public/CategoryProducts/components/FilterSidebar.jsx
import React, { useState } from 'react';
import { FaTimes, FaSearch } from 'react-icons/fa';

/**
 * Filter sidebar component for desktop and mobile
 */
export const FilterSidebar = ({
  isMobile,
  showMobileFilters,
  onCloseMobile,
  searchQuery,
  setSearchQuery,
  priceRange,
  setPriceRange,
  selectedCategories,
  toggleCategory,
  availableCategories,
  styles
}) => {
  // Mobile overlay
  if (isMobile && showMobileFilters) {
    return (
      <>
        {/* Backdrop */}
        <div
          style={styles.mobileFilterBackdrop}
          onClick={onCloseMobile}
        />
        {/* Mobile Panel */}
        <div style={styles.mobileFilterPanel}>
          <div style={styles.mobileFilterHeader}>
            <h3 style={styles.mobileFilterTitle}>Filtreler</h3>
            <button onClick={onCloseMobile} style={styles.mobileFilterCloseBtn}>
              <FaTimes />
            </button>
          </div>
          <FilterContent
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            selectedCategories={selectedCategories}
            toggleCategory={toggleCategory}
            availableCategories={availableCategories}
            styles={styles}
          />
        </div>
      </>
    );
  }

  // Desktop sidebar
  if (!isMobile) {
    return (
      <aside style={styles.sidebar}>
        <FilterContent
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          selectedCategories={selectedCategories}
          toggleCategory={toggleCategory}
          availableCategories={availableCategories}
          styles={styles}
        />
      </aside>
    );
  }

  return null;
};

/**
 * Filter content (shared between mobile and desktop)
 */
const FilterContent = ({
  searchQuery,
  setSearchQuery,
  priceRange,
  setPriceRange,
  selectedCategories,
  toggleCategory,
  availableCategories,
  styles
}) => {
  return (
    <>
      {/* Search Filter */}
      <div style={styles.filterSection}>
        <h3 style={styles.filterTitle}>Ürün Ara</h3>
        <div style={{ position: 'relative' }}>
          <FaSearch style={{
            position: 'absolute',
            left: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#9CA3AF',
            fontSize: '14px'
          }} />
          <input
            type="text"
            placeholder="Ürün adı, marka..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              ...styles.priceInput,
              paddingLeft: '42px',
              marginBottom: 0,
            }}
          />
        </div>
      </div>

      {/* Category Filter */}
      <div style={styles.filterSection}>
        <h3 style={styles.filterTitle}>Kategoriler</h3>
        <div style={styles.brandList}>
          <label style={styles.brandItem}>
            <input
              type="radio"
              checked={selectedCategories.length === 0}
              onChange={() => toggleCategory(null)}
              style={styles.brandCheckbox}
            />
            <span style={styles.brandLabel}>Tüm Ürünler</span>
          </label>
          {availableCategories.map(category => (
            <label key={category.id} style={styles.brandItem}>
              <input
                type="radio"
                checked={selectedCategories.includes(category.id)}
                onChange={() => toggleCategory(category.id)}
                style={styles.brandCheckbox}
              />
              <span style={styles.brandLabel}>
                {category.name}
                <span style={{ 
                  color: '#9CA3AF', 
                  fontSize: '12px', 
                  marginLeft: '6px' 
                }}>
                  ({category.count})
                </span>
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Filter */}
      <div style={{...styles.filterSection, borderBottom: 'none', marginBottom: 0, paddingBottom: 0}}>
        <h3 style={styles.filterTitle}>Fiyat Aralığı</h3>
        <div style={styles.priceInputs}>
          <input
            type="number"
            placeholder="Min"
            value={priceRange.min}
            onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
            style={styles.priceInput}
          />
          <span style={{ color: '#999' }}>-</span>
          <input
            type="number"
            placeholder="Max"
            value={priceRange.max}
            onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
            style={styles.priceInput}
          />
        </div>
      </div>
    </>
  );
};
