// src/components/modals/QuickViewModal/components/ProductImage.jsx
import React from 'react';
import PropTypes from 'prop-types';
import { useProductImage } from '../../../../hooks/useProductImage';
import { styles } from '../styles';

const ProductImage = React.memo(({ product }) => {
  const { imageSrc, handleImageError } = useProductImage(product);

  return (
    <div style={styles.imageSection}>
      <div style={styles.imageContainer}>
        <img
          src={imageSrc}
          alt={product?.name}
          style={styles.image}
          onError={handleImageError}
          loading="lazy"
        />
      </div>
    </div>
  );
});

ProductImage.displayName = 'ProductImage';

ProductImage.propTypes = {
  product: PropTypes.shape({
    name: PropTypes.string,
    image_url: PropTypes.string,
    images: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
};

export default ProductImage;
