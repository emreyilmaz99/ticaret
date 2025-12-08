// src/pages/user/UserOrders/components/EmptyOrders.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FiShoppingBag } from 'react-icons/fi';

export const EmptyOrders = ({ styles }) => {
  return (
    <div style={styles.emptyState}>
      <FiShoppingBag style={styles.emptyIcon} />
      <h3 style={styles.emptyTitle}>Henüz sipariş yok</h3>
      <p style={styles.emptyText}>İlk siparişinizi vermek için alışverişe başlayın!</p>
      <Link
        to="/"
        style={styles.shopButton}
      >
        Alışverişe Başla
      </Link>
    </div>
  );
};
