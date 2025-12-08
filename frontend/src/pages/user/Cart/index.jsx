// src/pages/user/Cart/index.jsx
import React from 'react';

// --- Alt Bileşenler ---
import {
  CartHeader,
  CartProductList,
  OrderSummary,
  EmptyCart,
  DeliveryAddressSection,
  VendorGroup,
  CheckoutModal
} from './components';
import AddressModal from '../../../components/modals/AddressModal';
import ConfirmModal from '../../../components/modals/ConfirmModal';

// --- Custom Hook ---
import useCartPage from './useCartPage';

// --- Stiller ---
import { getStyles } from './styles';

const Cart = () => {
  // Custom hook'tan tüm state ve fonksiyonları al
  const {
    cartItems,
    vendorGroups,
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
    // Checkout
    showCheckoutModal,
    checkoutStep,
    paymentHtml,
    isCheckoutLoading,
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
    // Checkout Handlers
    handleCheckoutClick,
    handleStartPayment,
    handleCloseCheckoutModal,
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

  // Vendor grupları mevcut mu kontrol et
  const hasVendorGroups = vendorGroups && vendorGroups.length > 0;

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

          {/* Vendor Grupları veya Normal Ürün Listesi */}
          {hasVendorGroups ? (
            // Vendor'a göre gruplanmış görünüm
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
              {vendorGroups.map((group) => (
                <VendorGroup
                  key={group.vendor_id}
                  vendorGroup={group}
                  onRemoveItem={handleRemoveItem}
                  onUpdateQuantity={handleUpdateQuantity}
                  loading={loading}
                  isMobile={isMobile}
                />
              ))}
            </div>
          ) : (
            // Fallback: Normal ürün listesi
            <CartProductList
              cartItems={cartItems}
              onRemoveItem={handleRemoveItem}
              onUpdateQuantity={handleUpdateQuantity}
              onClearCart={handleClearCart}
              loading={loading}
              isMobile={isMobile}
              styles={styles}
            />
          )}
        </div>

        {/* Sağ Taraf: Sipariş Özeti */}
        <OrderSummary
          totals={totals}
          coupon={coupon}
          couponInput={couponInput}
          onCouponInputChange={setCouponInput}
          onApplyCoupon={handleApplyCoupon}
          onRemoveCoupon={handleRemoveCoupon}
          onCheckout={handleCheckoutClick}
          isCheckoutLoading={isCheckoutLoading}
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

      {/* Checkout Modal - iyzico ödeme */}
      <CheckoutModal
        isOpen={showCheckoutModal}
        onClose={handleCloseCheckoutModal}
        step={checkoutStep}
        paymentHtml={paymentHtml}
        selectedAddress={selectedAddress}
        totals={totals}
        onStartPayment={handleStartPayment}
        isLoading={isCheckoutLoading}
        isMobile={isMobile}
      />
    </div>
  );
};

export default Cart;
