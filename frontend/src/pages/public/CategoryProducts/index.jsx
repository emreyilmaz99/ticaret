import React from 'react';
import getStyles from './styles';
import { useCategoryProducts } from './useCategoryProducts';

import {
  Breadcrumb,    // Sadece Breadcrumb kaldı
  FilterSidebar, // Sidebar'ı stiller ile düzelttik
  SortBar,
  ProductsGrid,  // Yenilenmiş Grid
  CompareBar,
  QuickViewModal
} from './components';

// ProductsGrid'i doğrudan components klasöründen çekiyoruz
import { ProductsGrid as GridComponent } from './components/ProductsGrid'; 
// Not: Eğer ProductsGrid export default ise: import ProductsGrid from './components/ProductsGrid';

const CategoryProducts = () => {
  const {
    isMobile,
    viewMode,
    sortBy,
    priceRange,
    selectedBrands,
    quickViewProduct,
    showMobileFilters,
    compareList,
    products,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    breadcrumbs, // Banner verisine ihtiyacımız kalmadı
    loadMoreRef,
    setViewMode,
    setSortBy,
    setPriceRange,
    setQuickViewProduct,
    setShowMobileFilters,
    setIsCompareModalOpen,
    handleAddToCart,
    toggleCompare,
    toggleBrand,
  } = useCategoryProducts();

  const styles = getStyles(isMobile);

  return (
    <div style={styles.container}>
      
      {/* BANNER KALDIRILDI. Sayfa direkt başlıyor. */}

      <div style={styles.wrapper}>
        {/* Navigasyon Yolu (Breadcrumb) */}
        <div style={styles.breadcrumbArea}>
          <Breadcrumb items={breadcrumbs} styles={styles} />
        </div>

        <div style={styles.mainContent}>
          {/* Sidebar - Artık Beyaz Kutu İçinde ve Sticky */}
          <div style={styles.sidebar}>
             <FilterSidebar
                isMobile={isMobile}
                showMobileFilters={showMobileFilters}
                onCloseMobile={() => setShowMobileFilters(false)}
                priceRange={priceRange}
                setPriceRange={setPriceRange}
                selectedBrands={selectedBrands}
                toggleBrand={toggleBrand}
                styles={styles} // styles.js'deki yeni input stillerini kullanacak
             />
          </div>

          {/* Ana Ürün Alanı */}
          <main style={styles.productsSection}>
            {/* Sıralama Barı */}
            <SortBar
              isMobile={isMobile}
              productCount={products ? products.length : 0}
              sortBy={sortBy}
              setSortBy={setSortBy}
              viewMode={viewMode}
              setViewMode={setViewMode}
              onOpenMobileFilter={() => setShowMobileFilters(true)}
              styles={styles}
            />

            {/* Ürünler Grid */}
            <GridComponent
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

      <CompareBar
        compareList={compareList}
        onRemove={toggleCompare}
        onOpenModal={() => setIsCompareModalOpen && setIsCompareModalOpen(true)}
        styles={styles}
      />

      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
          onAddToCart={handleAddToCart}
          styles={styles}
        />
      )}
    </div>
  );
};

export default CategoryProducts;