// src/components/common/ProductCard/ProductInfo.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';
import { formatRating } from '../../../utils/formatters';
import PriceDisplay from '../../shared/PriceDisplay';
import ProductActionButtons from './ProductActionButtons';

const getCategoryName = (product) => {
  if (product.vendor_name) return product.vendor_name;
  if (product.category && typeof product.category === 'object') {
    return product.category.name || 'GENEL';
  }
  return product.category || 'GENEL';
};

const ProductInfo = React.memo(({ 
  product, 
  productUrl, 
  styles, 
  isMobile,
  onBuyNow,
  onAddToCart
}) => {
  const rating = formatRating(product.rating || product.rating_avg || 0);
  const reviewCount = product.review_count || product.reviews_count || 0;
  
  return (
    <div style={styles.cardBody}>
      {/* Category */}
      <div style={styles.cardCategory}>{getCategoryName(product)}</div>
      
      {/* Product Title */}
      <Link to={productUrl} style={{ textDecoration: 'none', color: 'inherit' }}>
        <h3 style={styles.cardTitle}>{product.name}</h3>
      </Link>

      {/* Rating */}
      <div style={styles.rating}>
        {[...Array(5)].map((_, i) => (
          <FaStar 
            key={i} 
            color={i < Math.floor(rating) ? '#f59e0b' : '#e5e7eb'} 
            size={11}
          />
        ))}
        <span style={{ color: '#0f172a', marginLeft: '4px', fontSize: '11px', fontWeight: '700' }}>
          {parseFloat(rating || 0).toFixed(1)}
        </span>
        <span style={{ color: '#94a3b8', fontSize: '10px' }}>
          ({reviewCount})
        </span>
      </div>

      {/* Price Section */}
      <div style={styles.priceSection}>
        <PriceDisplay
          price={parseFloat(product.price || 0)}
          originalPrice={
            product.has_deal 
              ? parseFloat(product.original_price || 0)
              : product.discount_percent > 0 
                ? parseFloat(product.compare_at_price || 0) 
                : null
          }
          hasDiscount={product.has_deal || product.discount_percent > 0}
          isMobile={isMobile}
        />
        
        {/* Action Buttons */}
        <ProductActionButtons
          styles={styles}
          onBuyNow={onBuyNow}
          onAddToCart={onAddToCart}
        />
      </div>
    </div>
  );
});

ProductInfo.displayName = 'ProductInfo';

export default ProductInfo;
