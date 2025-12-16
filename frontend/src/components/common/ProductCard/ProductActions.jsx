// src/components/common/ProductCard/ProductActions.jsx
import React from 'react';
import { FaHeart, FaRegHeart, FaEye, FaExchangeAlt } from 'react-icons/fa';
import { useHoverEffect } from '../../../hooks/useHoverEffect';

const ProductActions = React.memo(({ 
  product,
  isFavorite,
  isInCompareList,
  onToggleFavorite,
  onQuickView,
  onToggleCompare,
  styles 
}) => {
  const {
    isHovered: isFavHovered,
    handleMouseEnter: handleFavEnter,
    handleMouseLeave: handleFavLeave,
  } = useHoverEffect();
  
  const {
    isHovered: isQuickViewHovered,
    handleMouseEnter: handleQuickViewEnter,
    handleMouseLeave: handleQuickViewLeave,
  } = useHoverEffect();
  
  const {
    isHovered: isCompareHovered,
    handleMouseEnter: handleCompareEnter,
    handleMouseLeave: handleCompareLeave,
  } = useHoverEffect();

  return (
    <div style={styles.actionOverlay}>
      {/* Favorite Button */}
      <button 
        style={{
          ...styles.cardActionBtn,
          ...styles.cardActionBtnFavorite,
          ...(isFavHovered ? styles.cardActionBtnFavoriteHover : {})
        }}
        onClick={onToggleFavorite} 
        title="Favorilere Ekle"
        onMouseEnter={handleFavEnter}
        onMouseLeave={handleFavLeave}
      >
        {isFavorite ? <FaHeart color="#ef4444" size={15} /> : <FaRegHeart size={15} />}
      </button>
      
      {/* Quick View Button */}
      <button 
        style={{
          ...styles.cardActionBtn,
          ...(isQuickViewHovered ? styles.cardActionBtnQuickViewHover : {})
        }}
        onClick={onQuickView} 
        title="Hızlı Bakış"
        onMouseEnter={handleQuickViewEnter}
        onMouseLeave={handleQuickViewLeave}
      >
        <FaEye size={15} />
      </button>
      
      {/* Compare Button */}
      {onToggleCompare && (
        <button 
          style={{ 
            ...styles.cardActionBtn,
            ...styles.cardActionBtnCompare,
            ...(isCompareHovered ? styles.cardActionBtnCompareHover : {})
          }} 
          onClick={onToggleCompare} 
          title="Karşılaştır"
          onMouseEnter={handleCompareEnter}
          onMouseLeave={handleCompareLeave}
        >
          <FaExchangeAlt size={14} />
        </button>
      )}
    </div>
  );
});

ProductActions.displayName = 'ProductActions';

export default ProductActions;
