// src/pages/user/Favorites/index.jsx
import React from 'react';
import { FaSpinner } from 'react-icons/fa';
import { getStyles } from './styles';
import { useFavoritesPage } from './useFavoritesPage';
import { FavoritesHeader, EmptyFavorites, FavoritesGrid } from './components';

const Favorites = () => {
  const {
    favorites,
    loading,
    count,
    sortBy,
    setSortBy,
    isMobile,
    getProduct,
    handleAddToCart,
    handleMoveAllToCart,
    handleRemove,
    handleClearAll
  } = useFavoritesPage();

  const styles = getStyles(isMobile);

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <FaSpinner style={styles.spinner} />
        <p>Favoriler yükleniyor...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {favorites.length > 0 ? (
        <>
          <FavoritesHeader 
            count={count}
            sortBy={sortBy}
            setSortBy={setSortBy}
            onMoveAllToCart={handleMoveAllToCart}
            onClearAll={handleClearAll}
            styles={styles}
          />
          <FavoritesGrid 
            favorites={favorites}
            getProduct={getProduct}
            onRemove={handleRemove}
            onAddToCart={handleAddToCart}
            styles={styles}
          />
        </>
      ) : (
        <EmptyFavorites styles={styles} />
      )}
    </div>
  );
};

export default Favorites;
