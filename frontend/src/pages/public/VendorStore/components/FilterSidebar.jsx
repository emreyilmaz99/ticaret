// src/pages/public/VendorStore/components/FilterSidebar.jsx
import React, { useState, useEffect } from 'react';
import { FaTimes, FaSearch } from 'react-icons/fa';

const FilterSidebar = ({
  isMobile,
  showMobileFilters,
  onCloseMobile,
  categories = [],
  selectedCategory,
  setSelectedCategory,
  priceRange,
  setPriceRange,
  searchQuery,
  setSearchQuery,
  styles
}) => {
  // Local state for price inputs (to prevent freezing while typing)
  const [localPriceMin, setLocalPriceMin] = useState(priceRange.min);
  const [localPriceMax, setLocalPriceMax] = useState(priceRange.max);

  // Update local state when external priceRange changes
  useEffect(() => {
    setLocalPriceMin(priceRange.min);
    setLocalPriceMax(priceRange.max);
  }, [priceRange.min, priceRange.max]);

  // Debounce price changes
  useEffect(() => {
    const timer = setTimeout(() => {
      setPriceRange({ min: localPriceMin, max: localPriceMax });
    }, 500);
    return () => clearTimeout(timer);
  }, [localPriceMin, localPriceMax, setPriceRange]);

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
          <div style={styles.mobileFilterContent}>
            <FilterContent
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              localPriceMin={localPriceMin}
              setLocalPriceMin={setLocalPriceMin}
              localPriceMax={localPriceMax}
              setLocalPriceMax={setLocalPriceMax}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              categories={categories}
              styles={styles}
            />
          </div>
          <div style={styles.mobileFilterFooter}>
            <button onClick={onCloseMobile} style={styles.applyBtn}>
              Filtreleri Uygula
            </button>
          </div>
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
          localPriceMin={localPriceMin}
          setLocalPriceMin={setLocalPriceMin}
          localPriceMax={localPriceMax}
          setLocalPriceMax={setLocalPriceMax}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          categories={categories}
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
  localPriceMin,
  setLocalPriceMin,
  localPriceMax,
  setLocalPriceMax,
  selectedCategory,
  setSelectedCategory,
  categories,
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
        <div style={styles.categoryList}>
          <label style={styles.categoryItem}>
            <input
              type="radio"
              checked={selectedCategory === null}
              onChange={() => setSelectedCategory(null)}
              style={styles.radioInput}
            />
            <span style={styles.categoryLabel}>Tüm Ürünler</span>
          </label>
          {categories.length === 0 ? (
            <div style={{ padding: '12px', color: '#9CA3AF', fontSize: '14px' }}>
              Kategoriler yükleniyor...
            </div>
          ) : categories.map(category => (
            <label key={category.id} style={styles.categoryItem}>
              <input
                type="radio"
                checked={selectedCategory === category.id}
                onChange={() => setSelectedCategory(category.id)}
                style={styles.radioInput}
              />
              <span style={styles.categoryLabel}>
                {category.name}
                <span style={{ 
                  color: '#9CA3AF', 
                  fontSize: '12px', 
                  marginLeft: '6px' 
                }}>
                  ({category.product_count || category.count || 0})
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
            value={localPriceMin}
            onChange={(e) => setLocalPriceMin(e.target.value)}
            style={styles.priceInput}
          />
          <span style={{ color: '#999' }}>-</span>
          <input
            type="number"
            placeholder="Max"
            value={localPriceMax}
            onChange={(e) => setLocalPriceMax(e.target.value)}
            style={styles.priceInput}
          />
        </div>
      </div>
    </>
  );
};

export default FilterSidebar;
