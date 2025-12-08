// src/pages/user/Favorites/components/FavoritesGrid.jsx
import React from 'react';
import { FavoriteCard } from './FavoriteCard';

export const FavoritesGrid = ({ favorites, getProduct, onRemove, onAddToCart, styles }) => {
  return (
    <div style={styles.grid}>
      {favorites.map((item) => (
        <FavoriteCard 
          key={item.id || item.product?.id} 
          item={item}
          getProduct={getProduct}
          onRemove={onRemove}
          onAddToCart={onAddToCart}
          styles={styles}
        />
      ))}
    </div>
  );
};
