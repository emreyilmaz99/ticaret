import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useToast } from '../components/Toast';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('cartItems');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [coupon, setCoupon] = useState(null);
  const toast = useToast();

  // Sepet değiştiğinde localStorage'a kaydet
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  // MOCK KUPONLAR
  const AVAILABLE_COUPONS = {
    'YAZ20': { type: 'percent', value: 20, minSpend: 500 }, // %20 İndirim
    'HOSGELDIN': { type: 'fixed', value: 100, minSpend: 250 }, // 100 TL İndirim
    'KARGO': { type: 'shipping', value: 0, minSpend: 0 } // Ücretsiz Kargo (Henüz kargo mantığı tam yok ama ekleyelim)
  };

  const addToCart = (product, quantity = 1, variant = null) => {
    setCartItems(prev => {
      // Ürün zaten sepette var mı? (ID ve Varyant kontrolü)
      const existingItemIndex = prev.findIndex(item => 
        item.id === product.id && 
        JSON.stringify(item.variant) === JSON.stringify(variant)
      );

      if (existingItemIndex > -1) {
        // Varsa miktarını artır
        const newCart = [...prev];
        newCart[existingItemIndex].quantity += quantity;
        toast.success('Başarılı', 'Ürün miktarı güncellendi');
        return newCart;
      } else {
        // Yoksa yeni ekle
        toast.success('Başarılı', 'Ürün sepete eklendi');
        return [...prev, { ...product, quantity, variant }];
      }
    });
  };

  const removeFromCart = (productId, variant = null) => {
    setCartItems(prev => prev.filter(item => 
      !(item.id === productId && JSON.stringify(item.variant) === JSON.stringify(variant))
    ));
    toast.info('Bilgi', 'Ürün sepetten çıkarıldı');
  };

  const updateQuantity = (productId, variant = null, newQuantity) => {
    if (newQuantity < 1) return;
    setCartItems(prev => prev.map(item => {
      if (item.id === productId && JSON.stringify(item.variant) === JSON.stringify(variant)) {
        return { ...item, quantity: newQuantity };
      }
      return item;
    }));
  };

  const clearCart = () => {
    setCartItems([]);
    setCoupon(null);
    toast.info('Bilgi', 'Sepet temizlendi');
  };

  const applyCoupon = (code) => {
    const upperCode = code.toUpperCase();
    if (AVAILABLE_COUPONS[upperCode]) {
      // Kupon geçerli mi kontrolü (Min harcama vs.)
      const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const couponData = AVAILABLE_COUPONS[upperCode];

      if (subtotal >= couponData.minSpend) {
        setCoupon({ code: upperCode, ...couponData });
        toast.success('Başarılı', `${upperCode} kuponu uygulandı!`);
      } else {
        toast.error('Hata', `Bu kupon için minimum sepet tutarı ${couponData.minSpend} TL olmalıdır.`);
        setCoupon(null);
      }
    } else {
      toast.error('Hata', 'Geçersiz kupon kodu');
      setCoupon(null);
    }
  };

  const removeCoupon = () => {
    setCoupon(null);
    toast.info('Bilgi', 'Kupon kaldırıldı');
  };

  // Hesaplamalar
  const totals = useMemo(() => {
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    let discount = 0;
    let shipping = subtotal > 1000 ? 0 : 29.90; // 1000 TL üzeri kargo bedava

    if (coupon) {
      if (coupon.type === 'percent') {
        discount = (subtotal * coupon.value) / 100;
      } else if (coupon.type === 'fixed') {
        discount = coupon.value;
      } else if (coupon.type === 'shipping') {
        shipping = 0;
        discount = 0; // Sadece kargo sıfırlanır
      }
    }

    // İndirim sepet tutarından fazla olamaz
    if (discount > subtotal) discount = subtotal;
    
    return {
      subtotal,
      discount,
      shipping,
      total: subtotal - discount + shipping
    };
  }, [cartItems, coupon]);

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      applyCoupon,
      removeCoupon,
      coupon,
      totals
    }}>
      {children}
    </CartContext.Provider>
  );
};
