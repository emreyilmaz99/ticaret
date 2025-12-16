// src/components/common/ProductCard/ProductActionButtons.jsx
import React from 'react';
import { FaBolt, FaShoppingCart } from 'react-icons/fa';
import { useHoverEffect } from '../../../hooks/useHoverEffect';

const ProductActionButtons = React.memo(({ styles, onBuyNow, onAddToCart }) => {
  const {
    isHovered: isBuyNowHovered,
    handleMouseEnter: handleBuyNowEnter,
    handleMouseLeave: handleBuyNowLeave,
  } = useHoverEffect();
  
  const {
    isHovered: isAddToCartHovered,
    handleMouseEnter: handleAddToCartEnter,
    handleMouseLeave: handleAddToCartLeave,
  } = useHoverEffect();

  return (
    <div style={styles.buttonsRow}>
      <button 
        style={{
          ...styles.buyNowBtn,
          ...(isBuyNowHovered ? styles.buyNowBtnHover : {})
        }}
        onClick={onBuyNow} 
        title="Hemen Satın Al"
        onMouseEnter={handleBuyNowEnter}
        onMouseLeave={handleBuyNowLeave}
      >
        <FaBolt size={13} />
        <span>Hemen Al</span>
      </button>
      
      <button 
        style={{
          ...styles.addToCartBtn,
          ...(isAddToCartHovered ? styles.addToCartBtnHover : {})
        }}
        onClick={onAddToCart} 
        title="Sepete Ekle"
        onMouseEnter={handleAddToCartEnter}
        onMouseLeave={handleAddToCartLeave}
      >
        <FaShoppingCart size={15} />
      </button>
    </div>
  );
});

ProductActionButtons.displayName = 'ProductActionButtons';

export default ProductActionButtons;
