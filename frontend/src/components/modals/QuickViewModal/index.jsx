// src/components/modals/QuickViewModal/index.jsx
import React, { useState, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  ModalOverlay,
  ModalContainer,
  ModalHeader,
  ModalCloseButton,
} from '../shared';
import ProductImage from './components/ProductImage';
import ProductInfo from './components/ProductInfo';
import QuantitySelector from './components/QuantitySelector';
import ProductActions from './components/ProductActions';
import { useHoverEffect } from '../../../hooks/useHoverEffect';
import { quantityConfig } from './config';
import { styles } from './styles';

const QuickViewModal = React.memo(({
  isOpen,
  onClose,
  product,
  onAddToCart,
  onAddToFavorites,
  onViewDetails,
}) => {
  const [quantity, setQuantity] = useState(quantityConfig.min);

  const closeHover = useHoverEffect({ scale: 1.1 });

  const handleAddToCart = useCallback(() => {
    if (product && product.stock > 0) {
      onAddToCart(product, quantity);
      onClose();
    }
  }, [product, quantity, onAddToCart, onClose]);

  const handleAddToFavorites = useCallback(() => {
    if (product) {
      onAddToFavorites(product);
      onClose();
    }
  }, [product, onAddToFavorites, onClose]);

  const handleViewDetails = useCallback(() => {
    if (product) {
      onViewDetails(product);
      onClose();
    }
  }, [product, onViewDetails, onClose]);

  const handleOverlayClick = useCallback(() => {
    onClose();
  }, [onClose]);

  const maxQuantity = useMemo(
    () => Math.min(product?.stock || 0, quantityConfig.max),
    [product?.stock]
  );

  const hasStock = useMemo(() => product?.stock > 0, [product?.stock]);

  if (!isOpen || !product) return null;

  return (
    <ModalOverlay onClick={handleOverlayClick}>
      <ModalContainer width="900px" onClick={(e) => e.stopPropagation()}>
        <ModalHeader title="Hızlı Ürün Görünümü" icon="👁️" />

        <ModalCloseButton
          onClose={onClose}
          hoverStyle={closeHover.style}
          onMouseEnter={closeHover.onMouseEnter}
          onMouseLeave={closeHover.onMouseLeave}
        />

        <div style={styles.content}>
          <ProductImage product={product} />

          <div style={styles.infoSection}>
            <ProductInfo product={product} />

            {hasStock && (
              <QuantitySelector
                quantity={quantity}
                onQuantityChange={setQuantity}
                max={maxQuantity}
              />
            )}

            <ProductActions
              onAddToCart={handleAddToCart}
              onAddToFavorites={handleAddToFavorites}
              onViewDetails={handleViewDetails}
              hasStock={hasStock}
            />
          </div>
        </div>
      </ModalContainer>
    </ModalOverlay>
  );
});

QuickViewModal.displayName = 'QuickViewModal';

QuickViewModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  product: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    price: PropTypes.number,
    original_price: PropTypes.number,
    stock: PropTypes.number,
    image_url: PropTypes.string,
    images: PropTypes.arrayOf(PropTypes.string),
    description: PropTypes.string,
    brand: PropTypes.string,
    category: PropTypes.string,
    rating: PropTypes.number,
    reviews_count: PropTypes.number,
    sku: PropTypes.string,
  }),
  onAddToCart: PropTypes.func.isRequired,
  onAddToFavorites: PropTypes.func.isRequired,
  onViewDetails: PropTypes.func.isRequired,
};

export default QuickViewModal;
