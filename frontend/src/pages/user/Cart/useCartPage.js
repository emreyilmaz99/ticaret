// src/pages/user/Cart/useCartPage.js
import { useState, useEffect, useCallback } from 'react';
import { useCart } from '../../../context/CartContext';

/**
 * Cart sayfası için custom hook
 * Tüm state yönetimi ve iş mantığını içerir
 */
const useCartPage = () => {
  // Cart context'ten verileri al
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    clearCart,
    applyCoupon,
    removeCoupon,
    coupon,
    totals,
    loading,
    initialized,
    clearNewItemsBadge
  } = useCart();

  // Local state
  const [couponInput, setCouponInput] = useState('');
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Resize listener
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Sayfa açıldığında badge'i temizle
  useEffect(() => {
    clearNewItemsBadge();
  }, [clearNewItemsBadge]);

  /**
   * Kupon uygulama işlemi
   */
  const handleApplyCoupon = useCallback((e) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    applyCoupon(couponInput);
    setCouponInput('');
  }, [couponInput, applyCoupon]);

  /**
   * Ürün silme işlemi
   */
  const handleRemoveItem = useCallback((itemId) => {
    removeFromCart(itemId);
  }, [removeFromCart]);

  /**
   * Miktar güncelleme işlemi
   */
  const handleUpdateQuantity = useCallback((itemId, newQuantity) => {
    if (newQuantity >= 1) {
      updateQuantity(itemId, newQuantity);
    }
  }, [updateQuantity]);

  /**
   * Sepeti temizleme işlemi
   */
  const handleClearCart = useCallback(() => {
    clearCart();
  }, [clearCart]);

  /**
   * Kuponu kaldırma işlemi
   */
  const handleRemoveCoupon = useCallback(() => {
    removeCoupon();
  }, [removeCoupon]);

  return {
    // State
    cartItems,
    coupon,
    totals,
    loading,
    initialized,
    couponInput,
    isMobile,

    // Setters
    setCouponInput,

    // Handlers
    handleApplyCoupon,
    handleRemoveItem,
    handleUpdateQuantity,
    handleClearCart,
    handleRemoveCoupon,
  };
};

export default useCartPage;
