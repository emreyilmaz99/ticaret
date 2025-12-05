// src/pages/public/CategoryProducts/components/FilterSidebar.jsx
import React from 'react';
import { FaTimes } from 'react-icons/fa';
import { MOCK_BRANDS } from '../styles';

/**
 * Filter sidebar component for desktop and mobile
 */
export const FilterSidebar = ({
  isMobile,
  showMobileFilters,
  onCloseMobile,
  priceRange,
  setPriceRange,
  selectedBrands,
  toggleBrand,
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
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            selectedBrands={selectedBrands}
            toggleBrand={toggleBrand}
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
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          selectedBrands={selectedBrands}
          toggleBrand={toggleBrand}
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
  priceRange,
  setPriceRange,
  selectedBrands,
  toggleBrand,
  styles
}) => {
  return (
    <>
      {/* Price Filter */}
      <div style={styles.filterSection}>
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

      {/* Brand Filter */}
      <div style={styles.filterSection}>
        <h3 style={styles.filterTitle}>Markalar</h3>
        <div style={styles.brandList}>
          {MOCK_BRANDS.map(brand => (
            <label key={brand} style={styles.brandItem}>
              <input
                type="checkbox"
                checked={selectedBrands.includes(brand)}
                onChange={(e) => toggleBrand(brand, e.target.checked)}
                style={styles.brandCheckbox}
              />
              <span style={styles.brandLabel}>{brand}</span>
            </label>
          ))}
        </div>
      </div>
    </>
  );
};
