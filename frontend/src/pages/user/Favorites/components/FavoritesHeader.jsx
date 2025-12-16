// src/pages/user/Favorites/components/FavoritesHeader.jsx
import React from 'react';
import { FaTrash, FaShoppingCart, FaSortAmountDown } from 'react-icons/fa';

export const FavoritesHeader = ({ 
  count, 
  sortBy, 
  setSortBy, 
  onMoveAllToCart, 
  onClearAll, 
  styles 
}) => {
  return (
    <div style={styles.header}>
      <div style={styles.titleGroup}>
        <h1 style={styles.title}>Favorilerim</h1>
        <span style={styles.countBadge}>{count} Ürün</span>
      </div>

      <div style={styles.actions}>
        <select 
          value={sortBy} 
          onChange={(e) => setSortBy(e.target.value)}
          style={{
            ...styles.actionBtn,
            outline: 'none',
            cursor: 'pointer'
          }}
        >
          <option value="date">Eklenme Tarihi</option>
          <option value="price-asc">Fiyat (Artan)</option>
          <option value="price-desc">Fiyat (Azalan)</option>
        </select>

        <button 
          onClick={onMoveAllToCart}
          style={{...styles.actionBtn, ...styles.primaryBtn}}
        >
          <FaShoppingCart /> Tümünü Sepete Ekle
        </button>

        <button 
          onClick={onClearAll}
          style={{...styles.actionBtn, color: '#ef4444', border: '1px solid #fee2e2'}}
        >
          <FaTrash /> Tümünü Sil
        </button>
      </div>
    </div>
  );
};
