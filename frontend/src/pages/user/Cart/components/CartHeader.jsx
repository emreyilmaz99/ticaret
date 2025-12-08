// src/pages/user/Cart/CartHeader.jsx
import React from 'react';
import PropTypes from 'prop-types';

/**
 * Sepet sayfa başlığı
 */
const CartHeader = ({ itemCount, styles }) => {
  return (
    <div style={styles.header}>
      <h1 style={styles.headerTitle}>Sepetim</h1>
      <span style={styles.headerCount}>({itemCount} Ürün)</span>
    </div>
  );
};

CartHeader.propTypes = {
  itemCount: PropTypes.number.isRequired,
  styles: PropTypes.object.isRequired,
};

export default CartHeader;
