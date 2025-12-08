// src/pages/user/UserOrders/components/OrdersHeader.jsx
import React from 'react';

export const OrdersHeader = ({ totalOrders, styles }) => {
  return (
    <div style={styles.header}>
      <div>
        <h1 style={styles.title}>Siparişlerim</h1>
        <p style={styles.subtitle}>
          Toplam {totalOrders} sipariş
        </p>
      </div>
    </div>
  );
};
