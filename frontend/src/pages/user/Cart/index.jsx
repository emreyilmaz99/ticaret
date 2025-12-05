// src/pages/user/Cart/index.jsx
import React from 'react';

// --- Alt Bileşenler ---
import CartHeader from './CartHeader';
import CartProductList from './CartProductList';
import OrderSummary from './OrderSummary';
import EmptyCart from './EmptyCart';

// --- Custom Hook ---
import useCartPage from './useCartPage';

// --- Stiller ---
import { getStyles } from './styles';

/**
 * Ana Sepet Sayfası Bileşeni
 * 
 * Modüler yapı:
 * - useCartPage: Tüm state ve iş mantığı
 * - CartHeader: Sayfa başlığı
 * - CartProductList: Ürün listesi
 * - OrderSummary: Sipariş özeti ve checkout
 * - EmptyCart: Boş sepet durumu
 */
const Cart = () => {
  // Custom hook'tan tüm state ve fonksiyonları al
  const {
    cartItems,
    coupon,
    totals,
    loading,
    initialized,
    couponInput,
    isMobile,
    setCouponInput,
    handleApplyCoupon,
    handleRemoveItem,
    handleUpdateQuantity,
    handleClearCart,
    handleRemoveCoupon,
  } = useCartPage();

  // Responsive stiller
  const styles = getStyles(isMobile);

  // Yükleniyor veya boş sepet durumu
  if (!initialized || cartItems.length === 0) {
    return (
      <EmptyCart 
        isLoading={!initialized} 
        styles={styles} 
      />
    );
  }

  // Normal sepet görünümü
  return (
    <div style={styles.container}>
      {/* Başlık */}
      <CartHeader 
        itemCount={cartItems.length} 
        styles={styles} 
      />

      {/* Ana Layout */}
      <div style={styles.layout}>
        {/* Sol Taraf: Ürün Listesi */}
        <CartProductList
          cartItems={cartItems}
          onRemoveItem={handleRemoveItem}
          onUpdateQuantity={handleUpdateQuantity}
          onClearCart={handleClearCart}
          loading={loading}
          isMobile={isMobile}
          styles={styles}
        />

        {/* Sağ Taraf: Sipariş Özeti */}
        <OrderSummary
          totals={totals}
          coupon={coupon}
          couponInput={couponInput}
          onCouponInputChange={setCouponInput}
          onApplyCoupon={handleApplyCoupon}
          onRemoveCoupon={handleRemoveCoupon}
          styles={styles}
        />
      </div>
    </div>
  );
};

export default Cart;

// --- Barrel Exports ---
// Tüm alt bileşenleri tek noktadan export et
export { default as CartHeader } from './CartHeader';
export { default as CartProductList } from './CartProductList';
export { default as CartItem } from './CartItem';
export { default as OrderSummary } from './OrderSummary';
export { default as CouponSection } from './CouponSection';
export { default as ShippingBreakdown } from './ShippingBreakdown';
export { default as EmptyCart } from './EmptyCart';
export { default as useCartPage } from './useCartPage';
export { getStyles } from './styles';
