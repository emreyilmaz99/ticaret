// src/pages/public/CategoryProducts/index.jsx
import React from 'react';
import { getStyles } from './styles';
import { useCategoryProducts } from './useCategoryProducts';
import {
  CategoryBanner,
  Breadcrumb,
  FilterSidebar,
  SortBar,
  ProductsGrid,
  CompareBar,
  QuickViewModal
} from './components';

/**
 * CategoryProducts Page - Displays products filtered by category
 * Features: Infinite scroll, filtering, sorting, comparison, quick view
 */
const CategoryProducts = () => {
  const {
    // State
    isMobile,
    viewMode,
    sortBy,
    priceRange,
    selectedBrands,
    quickViewProduct,
    showMobileFilters,
    compareList,

    // Data
    products,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    currentBanner,
    breadcrumbs,

    // Refs
    loadMoreRef,

    // Setters
    setViewMode,
    setSortBy,
    setPriceRange,
    setQuickViewProduct,
    setShowMobileFilters,
    setIsCompareModalOpen,

    // Handlers
    handleAddToCart,
    toggleCompare,
    toggleBrand,
  } = useCategoryProducts();

  const styles = getStyles(isMobile);

  return (
    <div style={styles.container}>
      {/* Category Banner */}
      <CategoryBanner banner={currentBanner} styles={styles} />

      {/* Breadcrumb */}
      <div style={styles.wrapper}>
        <Breadcrumb items={breadcrumbs} styles={styles} />

        <div style={styles.mainContent}>
          {/* Filter Sidebar - Desktop */}
          <FilterSidebar
            isMobile={isMobile}
            showMobileFilters={showMobileFilters}
            onCloseMobile={() => setShowMobileFilters(false)}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            selectedBrands={selectedBrands}
            toggleBrand={toggleBrand}
            styles={styles}
          />

          {/* Products Section */}
          <main style={styles.productsSection}>
            {/* Sort Bar */}
            <SortBar
              isMobile={isMobile}
              productCount={products.length}
              sortBy={sortBy}
              setSortBy={setSortBy}
              viewMode={viewMode}
              setViewMode={setViewMode}
              onOpenMobileFilter={() => setShowMobileFilters(true)}
              styles={styles}
            />

            {/* Products Grid */}
            <ProductsGrid
              products={products}
              viewMode={viewMode}
              compareList={compareList}
              onToggleCompare={toggleCompare}
              onAddToCart={handleAddToCart}
              onQuickView={setQuickViewProduct}
              isLoading={isLoading}
              isFetchingNextPage={isFetchingNextPage}
              hasNextPage={hasNextPage}
              loadMoreRef={loadMoreRef}
              styles={styles}
            />
          </main>
        </div>
      </div>

      {/* Compare Bar */}
      <CompareBar
        compareList={compareList}
        onRemove={toggleCompare}
        onOpenModal={() => setIsCompareModalOpen(true)}
        styles={styles}
      />

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={handleAddToCart}
        styles={styles}
      />
    </div>
  );
};

export default CategoryProducts;
