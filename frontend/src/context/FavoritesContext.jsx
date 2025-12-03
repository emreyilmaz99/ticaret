import React, { createContext, useState, useContext, useEffect } from 'react';
import { useToast } from '../components/Toast';

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const toast = useToast();

  // Load favorites from local storage on mount
  useEffect(() => {
    const storedFavorites = localStorage.getItem('user_favorites');
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }
  }, []);

  // Save to local storage whenever favorites change
  useEffect(() => {
    localStorage.setItem('user_favorites', JSON.stringify(favorites));
  }, [favorites]);

  const addToFavorites = (product) => {
    if (favorites.some(item => item.id === product.id)) {
      toast.info('Bilgi', 'Bu ürün zaten favorilerinizde.');
      return;
    }
    setFavorites(prev => [...prev, { ...product, dateAdded: new Date().toISOString() }]);
    toast.success('Başarılı', 'Ürün favorilere eklendi.');
  };

  const removeFromFavorites = (productId) => {
    setFavorites(prev => prev.filter(item => item.id !== productId));
    toast.info('Bilgi', 'Ürün favorilerden kaldırıldı.');
  };

  const clearFavorites = () => {
    setFavorites([]);
    toast.info('Bilgi', 'Favori listeniz temizlendi.');
  };

  const isFavorite = (productId) => {
    return favorites.some(item => item.id === productId);
  };

  return (
    <FavoritesContext.Provider value={{ favorites, addToFavorites, removeFromFavorites, clearFavorites, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => useContext(FavoritesContext);
