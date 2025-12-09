// src/pages/public/CategoryProducts/components/QuickViewModal.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FaTimes, FaShoppingCart, FaStar } from 'react-icons/fa';

/**
 * Quick view modal component
 */
export const QuickViewModal = ({ product, onClose, onAddToCart, styles }) => {
  if (!product) return null;

  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div style={styles.quickViewModal} onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} style={styles.modalCloseBtn}>
          <FaTimes />
        </button>

        <div style={styles.quickViewContent}>
          {/* Image */}
          <div style={styles.quickViewImage}>
            <img
              src={product.image || '/placeholder.jpg'}
              alt={product.name}
              style={{ width: '100%', height: 'auto', borderRadius: '12px' }}
            />
          </div>

          {/* Info */}
          <div style={styles.quickViewInfo}>
            <h2 style={styles.quickViewTitle}>{product.name}</h2>
            
            {/* Rating */}
            <div style={styles.ratingContainer}>
              {[...Array(5)].map((_, i) => (
                <FaStar
                  key={i}
                  style={{
                    fontSize: '14px',
                    color: i < (product.rating || 4) ? '#ffc107' : '#e0e0e0'
                  }}
                />
              ))}
              <span style={styles.ratingCount}>({product.review_count || 0} değerlendirme)</span>
            </div>

            {/* Price */}
            <div style={styles.quickViewPrice}>
              {product.discount_percent > 0 && (
                <span style={styles.oldPrice}>
                  {product.original_price?.toLocaleString('tr-TR')} TL
                </span>
              )}
              <span style={styles.currentPrice}>
                {product.price?.toLocaleString('tr-TR')} TL
              </span>
            </div>

            {/* Short Description */}
            <p style={styles.quickViewDescription}>
              {product.description?.substring(0, 150)}...
            </p>

            {/* Actions */}
            <div style={styles.quickViewActions}>
              <button
                onClick={() => onAddToCart(product)}
                style={styles.quickViewCartBtn}
              >
                <FaShoppingCart style={{ marginRight: '8px' }} />
                Sepete Ekle
              </button>
              <Link
                to={`/product/${product.slug}`}
                style={styles.quickViewDetailBtn}
              >
                Ürün Detayı
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
