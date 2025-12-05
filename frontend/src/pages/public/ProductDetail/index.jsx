// src/pages/public/ProductDetail/index.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FaClock } from 'react-icons/fa';

// Hooks & Styles
import { useProductDetail } from './useProductDetail';
import { getStyles } from './styles';

// Components
import Breadcrumb from './components/Breadcrumb';
import ImageGallery from './components/ImageGallery';
import Lightbox from './components/Lightbox';
import ProductInfo from './components/ProductInfo';
import ProductTabs from './components/ProductTabs';
import RelatedProducts from './components/RelatedProducts';

/**
 * Product detail page
 */
const ProductDetail = () => {
  const {
    // State
    isMobile,
    quantity,
    selectedVariant,
    selectedImage,
    activeTab,
    showShareMenu,
    recentlyViewed,
    showLightbox,

    // Data
    product,
    relatedProducts,
    isLoading,
    error,

    // Calculated
    currentPrice,
    currentStock,
    isInStock,
    showLowStockWarning,

    // Context
    isFavorite,

    // Setters
    setQuantity,
    setSelectedVariant,
    setSelectedImage,
    setActiveTab,
    setShowShareMenu,
    setShowLightbox,

    // Handlers
    handleAddToCart,
    handleShare,
    copyToClipboard,
    handleToggleFavorite,
  } = useProductDetail();

  const styles = getStyles(isMobile);

  // Loading state
  if (isLoading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingContainer}>
          <div>Ürün yükleniyor...</div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !product) {
    return (
      <div style={styles.container}>
        <div style={styles.errorContainer}>
          <h2>Ürün bulunamadı</h2>
          <p>Aradığınız ürün mevcut değil veya kaldırılmış olabilir.</p>
          <Link to="/products" style={{ color: '#059669' }}>Ürünlere Dön</Link>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Lightbox Modal */}
      {showLightbox && (
        <Lightbox 
          product={product}
          selectedImage={selectedImage}
          setSelectedImage={setSelectedImage}
          onClose={() => setShowLightbox(false)}
          styles={styles}
        />
      )}

      {/* Breadcrumb */}
      <Breadcrumb product={product} styles={styles} />

      {/* Main Content */}
      <div style={styles.mainGrid}>
        {/* Image Gallery */}
        <ImageGallery 
          product={product}
          selectedImage={selectedImage}
          setSelectedImage={setSelectedImage}
          setShowLightbox={setShowLightbox}
          styles={styles}
        />

        {/* Product Info */}
        <ProductInfo 
          product={product}
          selectedVariant={selectedVariant}
          setSelectedVariant={setSelectedVariant}
          quantity={quantity}
          setQuantity={setQuantity}
          currentPrice={currentPrice}
          currentStock={currentStock}
          isInStock={isInStock}
          showLowStockWarning={showLowStockWarning}
          isFavorite={isFavorite}
          showShareMenu={showShareMenu}
          setShowShareMenu={setShowShareMenu}
          handleAddToCart={handleAddToCart}
          handleToggleFavorite={handleToggleFavorite}
          handleShare={handleShare}
          copyToClipboard={copyToClipboard}
          styles={styles}
        />
      </div>

      {/* Tabs Section */}
      <ProductTabs 
        product={product}
        selectedVariant={selectedVariant}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        styles={styles}
      />

      {/* Related Products */}
      <RelatedProducts 
        products={relatedProducts}
        title="Benzer Ürünler"
        styles={styles}
      />

      {/* Recently Viewed Products */}
      <RelatedProducts 
        products={recentlyViewed.slice(0, 4)}
        title="Son Görüntülediğiniz Ürünler"
        icon={<FaClock />}
        styles={styles}
      />
    </div>
  );
};

export default ProductDetail;
