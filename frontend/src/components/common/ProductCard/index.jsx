// src/components/common/ProductCard/index.jsx
import React, { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFavorites } from '../../../context/FavoritesContext';
import { useAuth } from '../../../context/AuthContext';
import { useToast } from '../Toast';
import { useResponsive } from '../../../hooks/useResponsive';
import { useHoverEffect } from '../../../hooks/useHoverEffect';
import { calculateDiscountPercentage } from '../../../utils/formatters';
import { getCardStyles } from './styles';
import ProductImage from './ProductImage';
import ProductActions from './ProductActions';
import ProductInfo from './ProductInfo';

const ProductCard = ({
  product,
  viewMode = 'grid',
  isInCompareList = false,
  onToggleCompare,
  onAddToCart,
  onQuickView,
  styles: propStyles
}) => {
  const { isFavorite, addToFavorites, removeFromFavorites } = useFavorites();
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const { isMobile } = useResponsive();
  const { isHovered, handleMouseEnter, handleMouseLeave } = useHoverEffect();
  
  const isFav = useMemo(() => isFavorite(product.id), [isFavorite, product.id]);
  const productUrl = useMemo(() => `/product/${product.slug || product.id}`, [product.slug, product.id]);
  
  const styles = useMemo(
    () => propStyles || getCardStyles(isMobile, viewMode, isInCompareList, isFav),
    [propStyles, isMobile, viewMode, isInCompareList, isFav]
  );

  const handleToggleFavorite = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isFav) removeFromFavorites(product.id);
    else addToFavorites(product);
  }, [isFav, product, addToFavorites, removeFromFavorites]);

  const handleAddToCart = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      showToast('Sepete ürün eklemek için lütfen giriş yapın.', 'warning');
      navigate('/register');
      return;
    }
    if (onAddToCart) onAddToCart(product);
  }, [user, product, onAddToCart, showToast, navigate]);

  const handleBuyNow = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      showToast('Satın alma işlemi için lütfen giriş yapın.', 'warning');
      navigate('/register');
      return;
    }
    if (onAddToCart) onAddToCart(product);
    navigate('/cart');
  }, [user, product, onAddToCart, showToast, navigate]);

  const handleQuickView = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onQuickView) onQuickView(product);
    else navigate(productUrl);
  }, [product, productUrl, onQuickView, navigate]);

  const handleToggleCompare = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onToggleCompare) onToggleCompare(product);
  }, [product, onToggleCompare]);

  const discountPercent = useMemo(() => {
    if (product.has_deal && product.original_price && product.price) {
      return calculateDiscountPercentage(product.original_price, product.price);
    }
    return product.discount_percent || 0;
  }, [product]);

  const handleCardMouseEnter = useCallback(() => {
    if (!isMobile) {
      handleMouseEnter();
    }
  }, [isMobile, handleMouseEnter]);

  const handleCardMouseLeave = useCallback(() => {
    if (!isMobile) {
      handleMouseLeave();
    }
  }, [isMobile, handleMouseLeave]);

  return (
    <div
      style={{
        ...styles.card,
        ...(isHovered && !isMobile ? styles.cardHover : {})
      }}
      onMouseEnter={handleCardMouseEnter}
      onMouseLeave={handleCardMouseLeave}
    >
      {/* Featured Deal Badge */}
      {product.has_deal && product.deal_badge && (
        <div style={{
          ...styles.discountBadge,
          backgroundColor: product.deal_badge.color || '#dc2626'
        }}>
          {product.deal_badge.text || `%${Math.round(discountPercent)} İNDİRİM`}
        </div>
      )}
      
      {/* Discount Badge (fallback) */}
      {!product.has_deal && discountPercent > 0 && (
        <div style={styles.discountBadge}>
          %{Math.round(discountPercent)} İNDİRİM
        </div>
      )}
      
      {/* Action Overlay */}
      <ProductActions
        product={product}
        isFavorite={isFav}
        isInCompareList={isInCompareList}
        onToggleFavorite={handleToggleFavorite}
        onQuickView={handleQuickView}
        onToggleCompare={onToggleCompare ? handleToggleCompare : null}
        styles={styles}
      />

      {/* Product Image */}
      <ProductImage
        product={product}
        productUrl={productUrl}
        styles={{
          ...styles,
          cardImage: {
            ...styles.cardImage,
            ...(isHovered && !isMobile ? styles.cardImageHover : {})
          }
        }}
        isMobile={isMobile}
      />

      {/* Product Info */}
      <ProductInfo
        product={product}
        productUrl={productUrl}
        styles={styles}
        isMobile={isMobile}
        onBuyNow={handleBuyNow}
        onAddToCart={handleAddToCart}
      />
    </div>
  );
};

export default React.memo(ProductCard);
