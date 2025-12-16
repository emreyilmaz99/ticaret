import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { useToast } from '../components/common/Toast';
import * as cartApi from '../api/cartApi';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [vendorGroups, setVendorGroups] = useState([]);
  const [coupon, setCoupon] = useState(null);
  const [totals, setTotals] = useState({
    subtotal: 0,
    discount: 0,
    shipping: 0,
    total: 0,
    item_count: 0,
  });
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);
  // localStorage'dan badge durumunu oku
  const [hasNewItems, setHasNewItems] = useState(() => {
    return localStorage.getItem('cart_has_new') === 'true';
  });
  const toast = useToast();

  // Bildirimi temizle (sayfa ziyaret edildiğinde çağrılır)
  const clearNewItemsBadge = useCallback(() => {
    setHasNewItems(false);
    localStorage.removeItem('cart_has_new');
  }, []);

  // Sepeti API'den yükle
  const fetchCart = useCallback(async () => {
    // Kullanıcı token'ı yoksa sepet yükleme
    const userToken = localStorage.getItem('user_token');
    if (!userToken) {
      setInitialized(true);
      setLoading(false);
      // localStorage'dan sepeti yükle
      const savedCart = localStorage.getItem('cartItems');
      if (savedCart) {
        try {
          setCartItems(JSON.parse(savedCart));
        } catch (e) {
          console.error('Sepet parse hatası:', e);
        }
      }
      return;
    }

    try {
      setLoading(true);
      const response = await cartApi.getCart();
      if (response.success) {
        setCartItems(response.data.items || []);
        setVendorGroups(response.data.vendor_groups || []);
        setTotals(response.data.totals || {
          subtotal: 0,
          discount: 0,
          shipping: 0,
          total: 0,
          item_count: 0,
        });
        setCoupon(response.data.coupon || null);
      }
    } catch (error) {
      console.error('Sepet yüklenirken hata:', error);
      // Hata durumunda localStorage'a fallback
      const savedCart = localStorage.getItem('cartItems');
      if (savedCart) {
        try {
          setCartItems(JSON.parse(savedCart));
        } catch (e) {
          console.error('Sepet parse hatası:', e);
        }
      }
    } finally {
      setLoading(false);
      setInitialized(true);
    }
  }, []);

  // İlk yüklemede sepeti getir
  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // Sepete ürün ekle
  const addToCart = async (product, quantity = 1, variant = null) => {
    try {
      setLoading(true);
      const response = await cartApi.addToCart(
        product.id,
        variant?.id || product.variantId || null,
        quantity
      );
      
      if (response.success) {
        setCartItems(response.data.items || []);
        setVendorGroups(response.data.vendor_groups || []);
        setTotals(response.data.totals);
        setCoupon(response.data.coupon);
        // Yeni ürün eklendi bildirimi
        setHasNewItems(true);
        localStorage.setItem('cart_has_new', 'true');
        toast.success('Başarılı', response.message || 'Ürün sepete eklendi');
      }
    } catch (error) {
      console.error('Sepete eklerken hata:', error);
      toast.error('Hata', error.response?.data?.message || 'Ürün sepete eklenemedi');
    } finally {
      setLoading(false);
    }
  };

  // Sepetten ürün kaldır
  const removeFromCart = async (itemId) => {
    try {
      setLoading(true);
      const response = await cartApi.removeFromCart(itemId);
      
      if (response.success) {
        setCartItems(response.data.items || []);
        setVendorGroups(response.data.vendor_groups || []);
        setTotals(response.data.totals);
        toast.info('Bilgi', 'Ürün sepetten çıkarıldı');
      }
    } catch (error) {
      console.error('Sepetten çıkarırken hata:', error);
      toast.error('Hata', 'Ürün sepetten çıkarılamadı');
    } finally {
      setLoading(false);
    }
  };

  // Miktar güncelle
  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    
    try {
      setLoading(true);
      const response = await cartApi.updateCartItem(itemId, newQuantity);
      
      if (response.success) {
        setCartItems(response.data.items || []);
        setVendorGroups(response.data.vendor_groups || []);
        setTotals(response.data.totals);
      }
    } catch (error) {
      console.error('Miktar güncellenirken hata:', error);
      // Stok hatası için özel mesaj
      const errorMessage = error.response?.data?.message || 'Miktar güncellenemedi';
      toast.error('Hata', errorMessage);
      
      // Hata durumunda sepeti yeniden yükle (güncel stok bilgisi için)
      await fetchCart();
    } finally {
      setLoading(false);
    }
  };

  // Sepeti temizle
  const clearCart = async () => {
    try {
      setLoading(true);
      const response = await cartApi.clearCart();
      
      if (response.success) {
        setCartItems([]);
        setVendorGroups([]);
        setTotals({
          subtotal: 0,
          discount: 0,
          shipping: 0,
          total: 0,
          item_count: 0,
        });
        setCoupon(null);
        toast.info('Bilgi', 'Sepet temizlendi');
      }
    } catch (error) {
      console.error('Sepet temizlenirken hata:', error);
      toast.error('Hata', 'Sepet temizlenemedi');
    } finally {
      setLoading(false);
    }
  };

  // Kupon uygula
  const applyCoupon = async (code) => {
    // Mevcut sepeti kaydet - hata durumunda geri yüklemek için
    const currentItems = [...cartItems];
    const currentVendorGroups = [...vendorGroups];
    const currentTotals = { ...totals };

    try {
      setLoading(true);
      const response = await cartApi.applyCoupon(code);
      
      if (response.success) {
        // Backend response yapısını kontrol et
        const cartData = response.data;
        
        // Sepet bilgilerini güncelle
        if (cartData.items && Array.isArray(cartData.items)) {
          setCartItems(cartData.items);
        }
        if (cartData.vendor_groups && Array.isArray(cartData.vendor_groups)) {
          setVendorGroups(cartData.vendor_groups);
        }
        if (cartData.totals) {
          setTotals(cartData.totals);
        }
        if (cartData.coupon) {
          setCoupon(cartData.coupon);
        }
        
        toast.success('Başarılı', response.message || 'Kupon başarıyla uygulandı');
      } else {
        toast.error('Hata', response.message || 'Kupon uygulanamadı');
      }
    } catch (error) {
      console.error('Kupon uygulanırken hata:', error);
      // Hata durumunda sepeti eski haline getir
      setCartItems(currentItems);
      setVendorGroups(currentVendorGroups);
      setTotals(currentTotals);
      toast.error('Hata', error.response?.data?.message || 'Geçersiz kupon kodu');
    } finally {
      setLoading(false);
    }
  };

  // Kuponu kaldır
  const removeCoupon = async () => {
    // Mevcut sepeti kaydet
    const currentItems = [...cartItems];
    const currentVendorGroups = [...vendorGroups];
    const currentTotals = { ...totals };

    try {
      setLoading(true);
      const response = await cartApi.removeCoupon();
      
      if (response.success) {
        const cartData = response.data;
        
        if (cartData.items && Array.isArray(cartData.items)) {
          setCartItems(cartData.items);
        }
        if (cartData.vendor_groups && Array.isArray(cartData.vendor_groups)) {
          setVendorGroups(cartData.vendor_groups);
        }
        if (cartData.totals) {
          setTotals(cartData.totals);
        }
        setCoupon(null);
        toast.info('Bilgi', 'Kupon kaldırıldı');
      } else {
        toast.error('Hata', response.message || 'Kupon kaldırılamadı');
      }
    } catch (error) {
      console.error('Kupon kaldırılırken hata:', error);
      // Hata durumunda sepeti eski haline getir
      setCartItems(currentItems);
      setVendorGroups(currentVendorGroups);
      setTotals(currentTotals);
      toast.error('Hata', error.response?.data?.message || 'Kupon kaldırılamadı');
    } finally {
      setLoading(false);
    }
  };

  // Misafir sepetini kullanıcıya aktar (giriş sonrası)
  const mergeGuestCart = async () => {
    try {
      const response = await cartApi.mergeCart();
      if (response.success) {
        setCartItems(response.data.items || []);
        setVendorGroups(response.data.vendor_groups || []);
        setTotals(response.data.totals);
        setCoupon(response.data.coupon);
      }
    } catch (error) {
      console.error('Sepet aktarılırken hata:', error);
    }
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      vendorGroups,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      applyCoupon,
      removeCoupon,
      mergeGuestCart,
      fetchCart,
      coupon,
      totals,
      loading,
      initialized,
      hasNewItems,
      clearNewItemsBadge,
      itemCount: totals.item_count || cartItems.length,
    }}>
      {children}
    </CartContext.Provider>
  );
};
