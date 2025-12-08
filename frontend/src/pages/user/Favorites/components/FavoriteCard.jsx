// src/pages/user/Favorites/components/FavoriteCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FaTrash, FaShoppingCart, FaCheck, FaTimes } from 'react-icons/fa';

export const FavoriteCard = ({ item, getProduct, onRemove, onAddToCart, styles }) => {
  const product = getProduct(item);

  return (
    <div style={styles.card} 
         onMouseEnter={(e) => {
           e.currentTarget.style.transform = styles.cardHover.transform;
           e.currentTarget.style.boxShadow = styles.cardHover.boxShadow;
         }}
         onMouseLeave={(e) => {
           e.currentTarget.style.transform = 'none';
           e.currentTarget.style.boxShadow = styles.card.boxShadow;
         }}
    >
      <div style={styles.imageContainer}>
        {product.discount_percent > 0 && (
          <span style={styles.discountBadge}>%{product.discount_percent} İndirim</span>
        )}
        <button 
          onClick={() => onRemove(product.id)}
          style={styles.removeBtn}
          title="Favorilerden Kaldır"
        >
          <FaTrash size={14} />
        </button>
        <Link to={`/product/${product.slug}`}>
          <img 
            src={product.image || '/placeholder.jpg'} 
            alt={product.title} 
            style={styles.image}
          />
        </Link>
      </div>

      <div style={styles.content}>
        {product.vendor && (
          <div style={styles.vendorName}>{product.vendor.name}</div>
        )}
        
        <Link to={`/product/${product.slug}`} style={styles.productTitle}>
          {product.title}
        </Link>

        <div style={styles.stockStatus}>
          {product.inStock ? (
            <span style={{ color: '#059669', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <FaCheck size={10} /> Stokta
            </span>
          ) : (
            <span style={{ color: '#ef4444', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <FaTimes size={10} /> Tükendi
            </span>
          )}
        </div>

        <div style={styles.priceRow}>
          <span style={styles.price}>
            {parseFloat(product.price).toLocaleString('tr-TR')} TL
          </span>
          {product.oldPrice && parseFloat(product.oldPrice) > parseFloat(product.price) && (
            <span style={styles.oldPrice}>
              {parseFloat(product.oldPrice).toLocaleString('tr-TR')} TL
            </span>
          )}
        </div>

        <button 
          onClick={() => onAddToCart(product)}
          disabled={!product.inStock}
          style={{
            ...styles.addToCartBtn,
            opacity: product.inStock ? 1 : 0.5,
            cursor: product.inStock ? 'pointer' : 'not-allowed'
          }}
        >
          <FaShoppingCart />
          {product.inStock ? 'Sepete Ekle' : 'Stokta Yok'}
        </button>
      </div>
    </div>
  );
};
