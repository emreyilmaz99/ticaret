import React, { createContext, useState, useContext, useEffect, useCallback, useRef } from 'react';
import { useAuth } from './AuthContext';
import { useToast } from '../components/common/Toast';
import * as favoriteApi from '../api/favoriteApi';

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const [favoriteIds, setFavoriteIds] = useState(new Set());
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);
  // localStorage'dan badge durumunu oku
  const [hasNewItems, setHasNewItems] = useState(() => {
    return localStorage.getItem('favorites_has_new') === 'true';
  });
  const isFetching = useRef(false);
  const lastUserId = useRef(null);
  
  const { user, loading: authLoading } = useAuth();
  const toast = useToast();

  // Bildirimi temizle (sayfa ziyaret edildiğinde çağrılır)
  const clearNewItemsBadge = useCallback(() => {
    setHasNewItems(false);
    localStorage.removeItem('favorites_has_new');
  }, []);

  // Favorileri yükle
  const fetchFavorites = useCallback(async (showLoading = true) => {
    // Auth hala yükleniyorsa bekle
    if (authLoading) return;
    
    // Zaten fetch ediliyorsa tekrar çağırma
    if (isFetching.current) return;
    
    if (!user) {
      // Kullanıcı giriş yapmamışsa localStorage'dan yükle
      const storedFavorites = localStorage.getItem('user_favorites');
      if (storedFavorites) {
        try {
          const items = JSON.parse(storedFavorites);
          setFavorites(items);
          setFavoriteIds(new Set(items.map(item => item.id)));
          setCount(items.length);
        } catch (e) {
          console.error('localStorage parse error:', e);
        }
      } else {
        setFavorites([]);
        setFavoriteIds(new Set());
        setCount(0);
      }
      setInitialized(true);
      return;
    }

    try {
      isFetching.current = true;
      if (showLoading) setLoading(true);
      
      console.log('Fetching favorites for user:', user.id);
      const response = await favoriteApi.getFavorites();
      console.log('Favorites API response:', response);
      
      if (response.success) {
        const items = response.data.items || [];
        setFavorites(items);
        
        // API'den dönen item.product.id'leri set'e ekle
        const ids = new Set();
        items.forEach(item => {
          if (item.product?.id) {
            ids.add(String(item.product.id));
          }
        });
        
        console.log('Setting favoriteIds:', [...ids]);
        setFavoriteIds(ids);
        setCount(items.length);
      }
    } catch (error) {
      console.error('Favoriler yüklenirken hata:', error);
    } finally {
      if (showLoading) setLoading(false);
      setInitialized(true);
      isFetching.current = false;
    }
  }, [user, authLoading]);

  // Kullanıcı değiştiğinde favorileri yükle
  useEffect(() => {
    // Auth yükleniyorsa bekle
    if (authLoading) return;
    
    // Kullanıcı değiştiyse favorileri yeniden yükle
    const currentUserId = user?.id || null;
    if (lastUserId.current !== currentUserId) {
      lastUserId.current = currentUserId;
      // State'leri sıfırla
      setFavorites([]);
      setFavoriteIds(new Set());
      setCount(0);
      setInitialized(false);
      // Yeniden yükle
      fetchFavorites();
    }
  }, [user, authLoading, fetchFavorites]);

  // Ürünün favorilerde olup olmadığını kontrol et
  const isFavorite = useCallback((productId) => {
    if (!productId) return false;
    return favoriteIds.has(String(productId));
  }, [favoriteIds]);

  // Favorilere ekle
  const addToFavorites = async (product) => {
    const productId = String(product.id);
    
    if (!user) {
      // Giriş yapılmamışsa localStorage kullan
      if (favorites.some(item => String(item.id) === productId)) {
        toast.info('Bilgi', 'Bu ürün zaten favorilerinizde.');
        return true;
      }
      
      const newFavorites = [...favorites, { ...product, id: productId, dateAdded: new Date().toISOString() }];
      setFavorites(newFavorites);
      setFavoriteIds(new Set(newFavorites.map(item => String(item.id))));
      setCount(newFavorites.length);
      localStorage.setItem('user_favorites', JSON.stringify(newFavorites));
      toast.success('Başarılı', 'Ürün favorilere eklendi.');
      return true;
    }

    // Zaten favorilerde mi kontrol et
    if (favoriteIds.has(productId)) {
      toast.info('Bilgi', 'Bu ürün zaten favorilerinizde.');
      return true;
    }

    // Önce optimistic update yap
    setFavoriteIds(prev => new Set([...prev, productId]));
    setCount(prev => prev + 1);
    
    // Favorites listesini de güncelle (Optimistic)
    setFavorites(prev => {
      // Zaten listede var mı kontrol et
      if (prev.some(f => String(f.product?.id || f.id) === productId)) return prev;
      
      // API yapısına uygun geçici obje oluştur
      const newFavoriteItem = {
        id: 'temp_' + Date.now(),
        product: {
          id: productId,
          name: product.name || product.title,
          slug: product.slug,
          image: product.image,
          price: product.price,
          compare_price: product.compare_price || product.oldPrice,
          stock: product.stock,
          in_stock: product.in_stock
        }
      };
      return [...prev, newFavoriteItem];
    });

    try {
      const response = await favoriteApi.addToFavorites(productId);
      if (response.success) {
        toast.success('Başarılı', 'Ürün favorilere eklendi.');
        // Yeni ürün eklendi bildirimi
        setHasNewItems(true);
        localStorage.setItem('favorites_has_new', 'true');
        // Gerçek veriyi almak için arka planda yenile - isFetching kontrolünü atla
        isFetching.current = false;
        await fetchFavorites(false);
        return true;
      } else {
        // Hata durumunda geri al
        setFavoriteIds(prev => {
          const newSet = new Set(prev);
          newSet.delete(productId);
          return newSet;
        });
        setFavorites(prev => prev.filter(f => String(f.product?.id || f.id) !== productId));
        setCount(prev => Math.max(0, prev - 1));
        return false;
      }
    } catch (error) {
      console.error('Favorilere ekleme hatası:', error);
      // Hata durumunda geri al
      setFavoriteIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
      setFavorites(prev => prev.filter(f => String(f.product?.id || f.id) !== productId));
      setCount(prev => Math.max(0, prev - 1));
      
      // "Zaten favorilerde" hatası değilse göster
      const errorMsg = error.response?.data?.message || '';
      if (!errorMsg.includes('zaten')) {
        toast.error('Hata', errorMsg || 'Ürün favorilere eklenemedi');
      }
      return false;
    }
  };

  // Favorilerden kaldır
  const removeFromFavorites = async (productId) => {
    const strProductId = String(productId);
    if (!user) {
      // Giriş yapılmamışsa localStorage kullan
      const newFavorites = favorites.filter(item => String(item.id) !== strProductId);
      setFavorites(newFavorites);
      setFavoriteIds(new Set(newFavorites.map(item => String(item.id))));
      setCount(newFavorites.length);
      localStorage.setItem('user_favorites', JSON.stringify(newFavorites));
      toast.info('Bilgi', 'Ürün favorilerden kaldırıldı.');
      return true;
    }

    // Önce optimistic update yap
    const prevFavoriteIds = new Set(favoriteIds);
    const prevFavorites = [...favorites];
    const prevCount = count;
    
    setFavoriteIds(prev => {
      const newSet = new Set(prev);
      newSet.delete(strProductId);
      return newSet;
    });
    setFavorites(prev => prev.filter(f => String(f.product?.id || f.id) !== strProductId));
    setCount(prev => Math.max(0, prev - 1));

    try {
      const response = await favoriteApi.removeFromFavorites(strProductId);
      if (response.success) {
        toast.info('Bilgi', 'Ürün favorilerden kaldırıldı.');
        // Listeyi senkronize et - isFetching kontrolünü atla
        isFetching.current = false;
        await fetchFavorites(false);
        return true;
      } else {
        // Hata durumunda geri al
        setFavoriteIds(prevFavoriteIds);
        setFavorites(prevFavorites);
        setCount(prevCount);
        return false;
      }
    } catch (error) {
      console.error('Favorilerden kaldırma hatası:', error);
      // Hata durumunda geri al
      setFavoriteIds(prevFavoriteIds);
      setFavorites(prevFavorites);
      setCount(prevCount);
      toast.error('Hata', 'Ürün favorilerden kaldırılamadı');
      return false;
    }
  };

  // Favori toggle (ekle/kaldır)
  const toggleFavorite = async (product) => {
    const productId = product.id;
    
    if (isFavorite(productId)) {
      return await removeFromFavorites(productId);
    } else {
      return await addToFavorites(product);
    }
  };

  // Tüm favorileri temizle
  const clearFavorites = async () => {
    if (!user) {
      setFavorites([]);
      setFavoriteIds(new Set());
      setCount(0);
      localStorage.setItem('user_favorites', JSON.stringify([]));
      toast.info('Bilgi', 'Favori listeniz temizlendi.');
      return true;
    }

    try {
      const response = await favoriteApi.clearFavorites();
      if (response.success) {
        setFavorites([]);
        setFavoriteIds(new Set());
        setCount(0);
        toast.info('Bilgi', 'Tüm favoriler temizlendi.');
        return true;
      }
    } catch (error) {
      console.error('Favorileri temizleme hatası:', error);
      toast.error('Hata', 'Favoriler temizlenemedi');
      return false;
    }
  };

  return (
    <FavoritesContext.Provider value={{ 
      favorites, 
      favoriteIds,
      count,
      loading,
      initialized,
      hasNewItems,
      addToFavorites, 
      removeFromFavorites, 
      toggleFavorite,
      clearFavorites, 
      isFavorite,
      fetchFavorites,
      clearNewItemsBadge,
    }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => useContext(FavoritesContext);
