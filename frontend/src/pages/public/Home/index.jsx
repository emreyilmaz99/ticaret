// src/pages/public/Home/index.jsx
import React from 'react';
import QuickViewModal from '../../../components/modals/QuickViewModal';
import CompareModal from '@components/modals/CompareModal';

// Hooks
import { useHome } from './useHome';

// Styles
import { getStyles, backgroundStyle, cssAnimations } from './styles';

// Components
import FloatingCircle from './components/FloatingCircle';
import HeroSection from './components/HeroSection';
import CategoryCircles from './components/CategoryCircles';
import StatsSection from './components/StatsSection';
import FilterBar from './components/FilterBar';
import ProductGrid from './components/ProductGrid';
import DealSection from './components/DealSection';
import FeaturesSection from './components/FeaturesSection';
import BrandStrip from './components/BrandStrip';
import CtaSection from './components/CtaSection';
import CookieBanner from './components/CookieBanner';

/**
 * Home page - main landing page
 */
const Home = () => {
  const {
    // State
    isMobile,
    showCookieBanner,
    favorites,
    quickViewProduct,
    compareList,
    isCompareModalOpen,
    selectedCategory,
    priceRange,
    minRating,
    sortOrder,
    
    // Data
    categories,
    filteredProducts,
    productsLoading,
    productsError,
    
    // Setters
    setShowCookieBanner,
    setQuickViewProduct,
    setIsCompareModalOpen,
    setPriceRange,
    setMinRating,
    setSortOrder,
    
    // Handlers
    addToCart,
    toggleFavorite,
    toggleCompare,
    handleCategoryChange,
    clearFilters,
  } = useHome();

  const styles = getStyles(isMobile);

  return (
    <div style={styles.container}>
      {/* Animated Background */}
      <div style={backgroundStyle}>
        <FloatingCircle size="300px" top="10%" left="5%" delay={0} duration={8} />
        <FloatingCircle size="200px" top="60%" left="80%" delay={2} duration={10} />
        <FloatingCircle size="150px" top="30%" left="70%" delay={4} duration={7} />
        <FloatingCircle size="250px" top="70%" left="20%" delay={1} duration={9} />
        <FloatingCircle size="180px" top="5%" left="60%" delay={3} duration={11} />
      </div>

      {/* Hero Section */}
      <HeroSection styles={styles} isMobile={isMobile} />

      {/* Stats Section */}
      <StatsSection styles={styles} />

      {/* Main Content */}
      <div style={styles.mainLayout}>
        {/* Filter Bar */}
        <FilterBar 
          categories={categories}
          selectedCategory={selectedCategory}
          handleCategoryChange={handleCategoryChange}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          minRating={minRating}
          setMinRating={setMinRating}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
          styles={styles}
        />

        {/* Product Grid */}
        <main style={styles.content}>
          <ProductGrid 
            products={filteredProducts.slice(0, 12)}
            isLoading={productsLoading}
            error={productsError}
            favorites={favorites}
            toggleFavorite={toggleFavorite}
            setQuickViewProduct={setQuickViewProduct}
            addToCart={addToCart}
            clearFilters={clearFilters}
            compareList={compareList}
            toggleCompare={toggleCompare}
            styles={styles}
          />
          
          {/* View All Products Button */}
          {filteredProducts.length > 0 && (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              margin: '60px 0',
            }}>
              <a
                href="/products"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '16px 48px',
                  backgroundColor: '#059669',
                  color: 'white',
                  fontSize: '16px',
                  fontWeight: '600',
                  borderRadius: '16px',
                  textDecoration: 'none',
                  boxShadow: '0 10px 30px -10px rgba(5, 150, 105, 0.4)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 20px 40px -10px rgba(5, 150, 105, 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 10px 30px -10px rgba(5, 150, 105, 0.4)';
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="7" height="7"></rect>
                  <rect x="14" y="3" width="7" height="7"></rect>
                  <rect x="14" y="14" width="7" height="7"></rect>
                  <rect x="3" y="14" width="7" height="7"></rect>
                </svg>
                Tüm Ürünleri Görüntüle
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </a>
            </div>
          )}
        </main>
      </div>

      {/* Divider */}
      <div style={{
        maxWidth: '1200px',
        margin: '80px auto',
        height: '1px',
        background: 'linear-gradient(90deg, transparent, #e2e8f0 20%, #e2e8f0 80%, transparent)',
      }} />

      {/* Deal of the Day */}
      <DealSection addToCart={addToCart} styles={styles} isMobile={isMobile} />

      {/* Features Section */}
      <FeaturesSection styles={styles} />

      {/* Brands Strip */}
      <BrandStrip styles={styles} />

      {/* CTA Section */}
      <CtaSection styles={styles} />

      {/* Cookie Banner */}
      <CookieBanner 
        show={showCookieBanner}
        onClose={() => setShowCookieBanner(false)}
        styles={styles}
      />

      {/* Quick View Modal */}
      <QuickViewModal 
        product={quickViewProduct} 
        onClose={() => setQuickViewProduct(null)} 
        addToCart={addToCart}
        toggleFavorite={toggleFavorite}
        favorites={favorites}
      />

      {/* Compare Modal */}
      {isCompareModalOpen && (
        <CompareModal
          compareList={compareList}
          onClose={() => setIsCompareModalOpen(false)}
          onRemove={toggleCompare}
          styles={styles}
        />
      )}

      {/* CSS Animations */}
      <style>{cssAnimations}</style>
    </div>
  );
};

export default Home;
