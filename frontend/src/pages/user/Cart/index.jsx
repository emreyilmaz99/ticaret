// src/pages/user/Cart/index.jsx
import React from 'react';

// --- Alt Bileşenler ---
import CartHeader from './CartHeader';
import CartProductList from './CartProductList';
import OrderSummary from './OrderSummary';
import EmptyCart from './EmptyCart';
import DeliveryAddressSection from './DeliveryAddressSection';
import AddressModal from '../../../components/AddressModal';
import ConfirmModal from '../../../components/ConfirmModal';

// --- Custom Hook ---
import useCartPage from './useCartPage';

// --- Stiller ---
import { getStyles } from './styles';

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
    // Address
    selectedAddress,
    savedAddresses,
    addressLoading,
    isAddressModalOpen,
    // Delete Confirm
    deleteConfirm,
    confirmDeleteAddress,
    cancelDeleteAddress,
    // Setters
    setCouponInput,
    // Handlers
    handleApplyCoupon,
    handleRemoveItem,
    handleUpdateQuantity,
    handleClearCart,
    handleRemoveCoupon,
    // Address Handlers
    handleSelectAddress,
    handleOpenAddressModal,
    handleCloseAddressModal,
    handleSaveNewAddress,
    handleDeleteAddress,
    isDeleting,
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
        {/* Sol Taraf: Adres + Ürün Listesi */}
        <div style={styles.productList}>
          {/* Teslimat Adresi */}
          <DeliveryAddressSection
            selectedAddress={selectedAddress}
            savedAddresses={savedAddresses}
            onSelectAddress={handleSelectAddress}
            onAddNewAddress={handleOpenAddressModal}
            onDeleteAddress={handleDeleteAddress}
            isLoading={addressLoading}
            isDeleting={isDeleting}
            isMobile={isMobile}
          />

          {/* Ürün Listesi */}
          <CartProductList
            cartItems={cartItems}
            onRemoveItem={handleRemoveItem}
            onUpdateQuantity={handleUpdateQuantity}
            onClearCart={handleClearCart}
            loading={loading}
            isMobile={isMobile}
            styles={styles}
          />
        </div>

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

      {/* Adres Modal */}
      <AddressModal
        isOpen={isAddressModalOpen}
        onClose={handleCloseAddressModal}
        onSave={handleSaveNewAddress}
      />

      {/* Silme Onay Modal */}
      <ConfirmModal
        isOpen={deleteConfirm.isOpen}
        onClose={cancelDeleteAddress}
        onConfirm={confirmDeleteAddress}
        title="Adresi Sil"
        message="Bu adresi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz."
        confirmText="Evet, Sil"
        cancelText="Vazgeç"
        type="danger"
        isLoading={isDeleting}
      />
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
export { default as DeliveryAddressSection } from './DeliveryAddressSection';
export { default as useCartPage } from './useCartPage';
export { getStyles } from './styles';
