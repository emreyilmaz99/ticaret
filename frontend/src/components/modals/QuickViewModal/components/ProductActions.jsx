// src/components/modals/QuickViewModal/components/ProductActions.jsx
import React from 'react';
import PropTypes from 'prop-types';
import { FaShoppingCart, FaHeart, FaEye } from 'react-icons/fa';
import { useHoverEffect } from '../../../../hooks/useHoverEffect';
import { styles } from '../styles';

const ProductActions = React.memo(({
  onAddToCart,
  onAddToFavorites,
  onViewDetails,
  hasStock,
}) => {
  const cartHover = useHoverEffect({ scale: 1.02 });
  const favoriteHover = useHoverEffect({ scale: 1.02 });
  const detailsHover = useHoverEffect({ scale: 1.02 });

  return (
    <div style={styles.actions}>
      <button
        style={{
          ...styles.button('primary'),
          transform: cartHover.style.transform,
          opacity: hasStock ? 1 : 0.5,
          cursor: hasStock ? 'pointer' : 'not-allowed',
        }}
        onClick={onAddToCart}
        disabled={!hasStock}
        onMouseEnter={cartHover.onMouseEnter}
        onMouseLeave={cartHover.onMouseLeave}
      >
        <FaShoppingCart />
        Sepete Ekle
      </button>
      <button
        style={{
          ...styles.button('secondary'),
          transform: favoriteHover.style.transform,
        }}
        onClick={onAddToFavorites}
        onMouseEnter={favoriteHover.onMouseEnter}
        onMouseLeave={favoriteHover.onMouseLeave}
      >
        <FaHeart />
        Favorilere Ekle
      </button>
      <button
        style={{
          ...styles.button('outline'),
          transform: detailsHover.style.transform,
        }}
        onClick={onViewDetails}
        onMouseEnter={detailsHover.onMouseEnter}
        onMouseLeave={detailsHover.onMouseLeave}
      >
        <FaEye />
        Detaylar
      </button>
    </div>
  );
});

ProductActions.displayName = 'ProductActions';

ProductActions.propTypes = {
  onAddToCart: PropTypes.func.isRequired,
  onAddToFavorites: PropTypes.func.isRequired,
  onViewDetails: PropTypes.func.isRequired,
  hasStock: PropTypes.bool.isRequired,
};

export default ProductActions;
