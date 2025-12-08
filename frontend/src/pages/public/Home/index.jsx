// src/pages/public/Home/index.jsx
import React from 'react';
import QuickViewModal from '../../../components/modals/QuickViewModal';

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
    setPriceRange,
    setMinRating,
    setSortOrder,
    
    // Handlers
    addToCart,
    toggleFavorite,
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

      {/* Popular Categories */}
      <CategoryCircles 
        categories={categories}
        selectedCategory={selectedCategory}
        setSelectedCategory={handleCategoryChange}
        styles={styles}
      />

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
            products={filteredProducts}
            isLoading={productsLoading}
            error={productsError}
            favorites={favorites}
            toggleFavorite={toggleFavorite}
            setQuickViewProduct={setQuickViewProduct}
            addToCart={addToCart}
            clearFilters={clearFilters}
            styles={styles}
          />
        </main>
      </div>

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

      {/* CSS Animations */}
      <style>{cssAnimations}</style>
    </div>
  );
};

export default Home;
