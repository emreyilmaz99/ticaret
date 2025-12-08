// src/pages/user/Cart/EmptyCart.jsx
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { FiShoppingBag, FiArrowRight, FiLoader } from 'react-icons/fi';

/**
 * Boş sepet ve yükleme durumu bileşeni
 */
const EmptyCart = ({ isLoading, styles }) => {
  // Yükleme durumu
  if (isLoading) {
    return (
      <div style={styles.container}>
        <div style={styles.emptyState}>
          <FiLoader 
            size={48} 
            color="#059669" 
            style={{ animation: 'spin 1s linear infinite' }} 
          />
          <p style={{ marginTop: '16px', color: '#64748b' }}>
            Sepet yükleniyor...
          </p>
        </div>
      </div>
    );
  }

  // Boş sepet durumu
  return (
    <div style={styles.container}>
      <div style={styles.emptyState}>
        <div style={styles.emptyIconBg}>
          <FiShoppingBag size={64} color="#cbd5e1" />
        </div>
        <h2 style={styles.emptyTitle}>Sepetiniz Henüz Boş</h2>
        <p style={styles.emptyText}>
          Aradığınız ürünleri bulmak için hemen alışverişe başlayın. 
          Binlerce ürün sizi bekliyor!
        </p>
        <Link to="/" style={styles.startShoppingBtn}>
          Alışverişe Başla <FiArrowRight />
        </Link>
      </div>
    </div>
  );
};

EmptyCart.propTypes = {
  isLoading: PropTypes.bool,
  styles: PropTypes.object.isRequired,
};

export default EmptyCart;
