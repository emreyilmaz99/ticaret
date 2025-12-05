// src/pages/public/ProductDetail/components/RelatedProducts.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FaBox, FaClock } from 'react-icons/fa';
import { formatPrice } from '../styles';

/**
 * Related products grid
 */
const RelatedProducts = ({ 
  products, 
  title = 'Benzer Ürünler', 
  icon = null,
  styles 
}) => {
  if (!products?.length) return null;

  return (
    <div style={icon ? styles.recentlyViewedSection : styles.relatedSection}>
      <h2 style={styles.sectionTitle}>
        {icon && <span style={{ marginRight: '10px', color: '#64748b' }}>{icon}</span>}
        {title}
      </h2>
      <div style={styles.relatedGrid}>
        {products.map((item) => (
          <Link 
            key={item.id} 
            to={`/product/${item.slug}`}
            style={styles.productCard}
          >
            {item.image ? (
              <img 
                src={item.image} 
                alt={item.name}
                style={styles.productCardImage}
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            ) : (
              <div style={{
                ...styles.productCardImage, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center'
              }}>
                <FaBox size={32} color="#cbd5e1" />
              </div>
            )}
            <div style={styles.productCardInfo}>
              <div style={styles.productCardName}>{item.name}</div>
              <div style={styles.productCardPrice}>{formatPrice(item.price)}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;
