// src/pages/public/VendorStore/index.jsx
import React from 'react';
import { useVendorStore } from './useVendorStore';
import {
  VendorHeader,
  VendorNav,
  VendorHomePage,
  FilterSidebar,
  ProductsGrid,
  ReviewsSection,
  LoadingState,
  ErrorState
} from './components';

const VendorStore = () => {
  const {
    // Vendor data
    vendor,
    stats,
    isLoading,
    error,
    
    // Tab state
    activeTab,
    setActiveTab,
    
    // Products
    products,
    productsLoading,
    hasMoreProducts,
    loadMoreRef,
    
    // Filters
    categories,
    categoriesLoading,
    availableCategories,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    priceRange,
    setPriceRange,
    
    // Reviews
    reviews,
    reviewsLoading,
    reviewSummary,
    reviewsSortBy,
    setReviewsSortBy,
    selectedRating,
    setSelectedRating,
    
    // Actions
    handleAddToCart,
    
    // Responsive
    isMobile,
    showMobileFilters,
    setShowMobileFilters,
  } = useVendorStore();

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;
  if (!vendor) return <ErrorState error="Mağaza bulunamadı" />;

  return (
    <div style={styles.container}>
      {/* Vendor Header - Banner & Info */}
      <VendorHeader 
        vendor={vendor} 
        stats={stats} 
        isMobile={isMobile}
      />

      {/* Navigation Tabs */}
      <VendorNav 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        isMobile={isMobile}
      />

      {/* Main Content */}
      <div style={styles.mainWrapper}>
        <div style={styles.mainContent}>
          {/* Home Tab */}
          {activeTab === 'home' && (
            <VendorHomePage
              vendor={vendor}
              stats={stats}
              products={products}
              onAddToCart={handleAddToCart}
              isMobile={isMobile}
              setActiveTab={setActiveTab}
            />
          )}

          {/* Products Tab */}
          {(activeTab === 'products' || activeTab === 'deals') && (
            <>
              {/* Sidebar */}
              <FilterSidebar
                isMobile={isMobile}
                showMobileFilters={showMobileFilters}
                onCloseMobile={() => setShowMobileFilters(false)}
                categories={categories}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                priceRange={priceRange}
                setPriceRange={setPriceRange}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                styles={styles}
              />

              {/* Products Grid */}
              <main style={styles.productsSection}>
                {/* Sort Bar - CategoryProducts ile aynı yapı */}
                <div style={styles.sortBar}>
                  <div style={styles.sortInfo}>
                    <span style={styles.categoryTitle}>
                      {selectedCategory ? categories.find(c => c.id === selectedCategory)?.name : vendor.name}
                    </span>
                    <span style={styles.productCount}>
                      <span style={styles.resultNumber}>{products.length}</span> ürün
                    </span>
                  </div>

                  {/* Sort Dropdown */}
                  <div style={styles.sortWrapper}>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      style={styles.sortSelect}
                    >
                      <option value="newest">Önerilen Sıralama</option>
                      <option value="best_seller">Çok Satanlar</option>
                      <option value="price_asc">En Düşük Fiyat</option>
                      <option value="price_desc">En Yüksek Fiyat</option>
                      <option value="rating">En Yüksek Puan</option>
                    </select>
                  </div>

                  {isMobile && (
                    <button
                      onClick={() => setShowMobileFilters(true)}
                      style={styles.mobileFilterBtn}
                    >
                      Filtrele
                    </button>
                  )}
                </div>

                {/* Products */}
                <ProductsGrid
                  products={products}
                  isLoading={productsLoading}
                  hasMore={hasMoreProducts}
                  loadMoreRef={loadMoreRef}
                  onAddToCart={handleAddToCart}
                  isMobile={isMobile}
                />
              </main>
            </>
          )}

          {/* Reviews Tab */}
          {activeTab === 'reviews' && (
            <ReviewsSection
              reviews={reviews}
              isLoading={reviewsLoading}
              summary={reviewSummary}
              sortBy={reviewsSortBy}
              setSortBy={setReviewsSortBy}
              selectedRating={selectedRating}
              setSelectedRating={setSelectedRating}
              isMobile={isMobile}
            />
          )}
        </div>
      </div>
    </div>
  );
};

// Styles
const styles = {
  container: {
    backgroundColor: '#f8fafc',
    minHeight: '100vh',
  },
  mainWrapper: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '0 24px',
  },
  mainContent: {
    display: 'flex',
    gap: '24px',
    paddingTop: '24px',
    paddingBottom: '60px',
  },
  // Sidebar Filter Styles
  sidebar: {
    width: '280px',
    flexShrink: 0,
    backgroundColor: '#fff',
    borderRadius: '16px',
    border: '1px solid #E5E7EB',
    padding: '24px',
    position: 'sticky',
    top: '80px',
    maxHeight: 'calc(100vh - 100px)',
    overflowY: 'auto',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
  },
  filterSection: {
    marginBottom: '24px',
    paddingBottom: '24px',
    borderBottom: '1px solid #E5E7EB',
  },
  filterTitle: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#111827',
    marginBottom: '16px',
    fontFamily: '"Inter", sans-serif',
    margin: '0 0 16px 0',
  },
  categoryList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  categoryItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    cursor: 'pointer',
    padding: '8px',
    borderRadius: '8px',
    transition: 'background-color 0.2s',
  },
  radioInput: {
    width: '18px',
    height: '18px',
    cursor: 'pointer',
    accentColor: '#059669',
  },
  categoryLabel: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#111827',
    cursor: 'pointer',
    flex: 1,
    fontFamily: '"Inter", sans-serif',
  },
  priceInputs: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  priceInput: {
    flex: 1,
    padding: '10px 12px',
    border: '1px solid #E5E7EB',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500',
    color: '#111827',
    outline: 'none',
    fontFamily: '"Inter", sans-serif',
    backgroundColor: '#F9FAFB',
  },
  // Mobile Filter Styles
  mobileFilterBackdrop: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 999,
  },
  mobileFilterPanel: {
    position: 'fixed',
    right: 0,
    top: 0,
    bottom: 0,
    width: '85%',
    maxWidth: '400px',
    backgroundColor: '#fff',
    zIndex: 1000,
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '-4px 0 16px rgba(0,0,0,0.15)',
  },
  mobileFilterHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '20px',
    borderBottom: '1px solid #E5E7EB',
  },
  mobileFilterTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#111827',
    margin: 0,
  },
  mobileFilterCloseBtn: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    backgroundColor: '#F3F4F6',
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    fontSize: '16px',
    color: '#6B7280',
  },
  mobileFilterContent: {
    flex: 1,
    overflowY: 'auto',
    padding: '20px',
  },
  mobileFilterFooter: {
    padding: '16px 20px',
    borderTop: '1px solid #E5E7EB',
  },
  applyBtn: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#059669',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  productsSection: {
    flex: 1,
    minWidth: 0,
  },
  sortBar: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    marginBottom: '20px',
    backgroundColor: '#fff',
    padding: '16px 20px',
    borderRadius: '12px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
    flexWrap: 'wrap',
  },
  sortInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  categoryTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#1e293b',
  },
  resultNumber: {
    fontSize: '14px',
    color: '#64748b',
    fontWeight: '500',
  },
  sortWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginLeft: 'auto',
  },
  sortLabel: {
    fontSize: '14px',
    color: '#64748b',
    fontWeight: '500',
  },
  sortSelect: {
    padding: '10px 16px',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500',
    color: '#1e293b',
    backgroundColor: '#fff',
    cursor: 'pointer',
    outline: 'none',
  },
  mobileFilterBtn: {
    padding: '10px 16px',
    backgroundColor: '#059669',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },
};

export default VendorStore;
