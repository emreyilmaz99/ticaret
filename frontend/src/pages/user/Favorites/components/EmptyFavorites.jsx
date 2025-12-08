// src/pages/user/Favorites/components/EmptyFavorites.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FaHeartBroken, FaArrowLeft } from 'react-icons/fa';

export const EmptyFavorites = ({ styles }) => {
  return (
    <div style={styles.emptyState}>
      <FaHeartBroken style={styles.emptyIcon} />
      <h2 style={styles.emptyTitle}>Favori Listeniz Boş</h2>
      <p style={styles.emptyText}>
        Henüz favori listenize hiç ürün eklememişsiniz. 
        Beğendiğiniz ürünleri kalp ikonuna tıklayarak buraya ekleyebilirsiniz.
      </p>
      <Link to="/" style={styles.startShoppingBtn}>
        <FaArrowLeft /> Alışverişe Başla
      </Link>
    </div>
  );
};
