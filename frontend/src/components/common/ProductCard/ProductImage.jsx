// src/components/common/ProductCard/ProductImage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useProductImage } from '../../../hooks/useProductImage';

const ProductImage = React.memo(({ product, productUrl, styles, isMobile }) => {
  const imageUrl = useProductImage(product);
  
  const handleImageError = (e) => {
    e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%23fafafa" width="400" height="400"/%3E%3Ctext fill="%23cbd5e1" font-family="system-ui" font-size="18" font-weight="600" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3EÜrün Görseli%3C/text%3E%3C/svg%3E';
  };

  return (
    <Link to={productUrl} style={{ textDecoration: 'none' }}>
      <div style={styles.imageContainer}>
        <img
          src={imageUrl}
          alt={product.name}
          style={styles.cardImage}
          loading="lazy"
          onError={handleImageError}
        />
      </div>
    </Link>
  );
});

ProductImage.displayName = 'ProductImage';

export default ProductImage;
