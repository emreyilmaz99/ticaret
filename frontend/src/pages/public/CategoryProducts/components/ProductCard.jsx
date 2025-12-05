// src/pages/public/CategoryProducts/components/ProductCard.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaHeart, 
  FaRegHeart, 
  FaShoppingCart, 
  FaEye, 
  FaExchangeAlt,
  FaStar 
} from 'react-icons/fa';

/**
 * Product card component for grid and list views
 */
export const ProductCard = ({
  product,
  viewMode,
  isInCompareList,
  onToggleCompare,
  onAddToCart,
  onQuickView,
  styles
}) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const cardStyle = viewMode === 'list' 
    ? styles.productCardList 
    : styles.productCard;

  return (
    <div
      style={{
        ...cardStyle,
        transform: isHovered ? 'translateY(-5px)' : 'translateY(0)',
        boxShadow: isHovered 
          ? '0 15px 40px rgba(0,0,0,0.15)' 
          : '0 3px 15px rgba(0,0,0,0.05)'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div style={styles.imageContainer}>
        <Link to={`/product/${product.slug}`}>
          <img
            src={product.main_photo?.file_path || '/placeholder.jpg'}
            alt={product.name}
            style={styles.productImage}
          />
        </Link>
        
        {/* Discount Badge */}
        {product.discount_percent > 0 && (
          <span style={styles.discountBadge}>
            -{product.discount_percent}%
          </span>
        )}

        {/* Quick Actions */}
        <div style={{
          ...styles.quickActions,
          opacity: isHovered ? 1 : 0,
          transform: isHovered ? 'translateY(0)' : 'translateY(10px)'
        }}>
          <button
            onClick={() => setIsFavorite(!isFavorite)}
            style={styles.actionBtn}
            title="Favorilere Ekle"
          >
            {isFavorite ? <FaHeart color="#ff6b35" /> : <FaRegHeart />}
          </button>
          <button
            onClick={() => onQuickView(product)}
            style={styles.actionBtn}
            title="Hızlı Bakış"
          >
            <FaEye />
          </button>
          <button
            onClick={() => onToggleCompare(product)}
            style={{
              ...styles.actionBtn,
              backgroundColor: isInCompareList ? '#ff6b35' : '#fff',
              color: isInCompareList ? '#fff' : '#333'
            }}
            title="Karşılaştır"
          >
            <FaExchangeAlt />
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div style={styles.productInfo}>
        <Link 
          to={`/product/${product.slug}`}
          style={styles.productName}
        >
          {product.name}
        </Link>

        {/* Rating */}
        <div style={styles.ratingContainer}>
          {[...Array(5)].map((_, i) => (
            <FaStar
              key={i}
              style={{
                fontSize: '12px',
                color: i < (product.rating || 4) ? '#ffc107' : '#e0e0e0'
              }}
            />
          ))}
          <span style={styles.ratingCount}>({product.review_count || 0})</span>
        </div>

        {/* Price */}
        <div style={styles.priceContainer}>
          {product.discount_percent > 0 && (
            <span style={styles.oldPrice}>
              {product.original_price?.toLocaleString('tr-TR')} TL
            </span>
          )}
          <span style={styles.currentPrice}>
            {product.price?.toLocaleString('tr-TR')} TL
          </span>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={() => onAddToCart(product)}
          style={styles.addToCartBtn}
        >
          <FaShoppingCart style={{ marginRight: '8px' }} />
          Sepete Ekle
        </button>
      </div>
    </div>
  );
};
