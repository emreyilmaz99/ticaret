// src/pages/user/Cart/useCartPage.js
import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../../context/CartContext';
import { useAuth } from '../../../context/AuthContext';
import { getUserAddresses, createUserAddress, deleteUserAddress } from '../../../features/user/api/userAddressApi';
import { initializeCheckout } from '../../../features/checkout/api/checkoutApi';
import { useToast } from '../../../components/common/Toast';

/**
 * Cart sayfası için custom hook
 * Tüm state yönetimi ve iş mantığını içerir
 */
const useCartPage = () => {
  // Cart context'ten verileri al
  const {
    cartItems,
    vendorGroups,
    removeFromCart,
    updateQuantity,
    clearCart,
    applyCoupon,
    removeCoupon,
    coupon,
    totals,
    loading,
    initialized
  } = useCart();

  const { user, isAuthenticated } = useAuth();
  const toast = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Local state
  const [couponInput, setCouponInput] = useState('');
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, addressId: null });
  
  // Checkout state
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState('address'); // address, processing, payment
  const [paymentHtml, setPaymentHtml] = useState(null);

  // Kullanıcının kayıtlı adreslerini çek
  const { data: addressData, isLoading: addressLoading } = useQuery({
    queryKey: ['user', 'addresses'],
    queryFn: getUserAddresses,
    enabled: !!user,
  });

  const savedAddresses = addressData?.data?.addresses || [];

  // Varsayılan adresi seç - sadece savedAddresses değiştiğinde
  useEffect(() => {
    if (savedAddresses.length > 0) {
      // Eğer zaten seçili adres varsa ve hala listede varsa, dokunma
      if (selectedAddress) {
        const stillExists = savedAddresses.find(a => a.id === selectedAddress.id);
        if (stillExists) return;
      }
      
      // Önce localStorage'dan kontrol et
      const savedSelection = localStorage.getItem('cart_selected_address');
      if (savedSelection) {
        try {
          const parsed = JSON.parse(savedSelection);
          const found = savedAddresses.find(a => a.id === parsed.id);
          if (found) {
            setSelectedAddress(found);
            return;
          }
        } catch {}
      }
      // Varsayılan adresi veya ilk adresi seç
      const defaultAddr = savedAddresses.find(a => a.is_default) || savedAddresses[0];
      setSelectedAddress(defaultAddr);
    }
  }, [savedAddresses]);

  // Yeni adres ekleme mutation
  const createAddressMutation = useMutation({
    mutationFn: createUserAddress,
    onSuccess: (response) => {
      // Backend response: { success: true, data: { address: {...} } }
      const newAddress = response?.data?.address || response?.address || response;
      console.log('Yeni adres eklendi:', newAddress);
      
      // Önce cache'i güncelle
      queryClient.invalidateQueries(['user', 'addresses']);
      
      // Yeni eklenen adresi otomatik olarak teslimat adresi olarak seç
      if (newAddress && newAddress.id) {
        setSelectedAddress(newAddress);
        localStorage.setItem('cart_selected_address', JSON.stringify(newAddress));
        toast.success('Adres Eklendi', 'Yeni adres teslimat adresi olarak seçildi.');
      } else {
        toast.success('Adres Eklendi', 'Yeni teslimat adresi başarıyla kaydedildi.');
      }
      
      setIsAddressModalOpen(false);
    },
    onError: (error) => {
      console.error('Adres ekleme hatası:', error);
      toast.error('Hata', 'Adres eklenirken bir sorun oluştu.');
    }
  });

  // Adres silme mutation
  const deleteAddressMutation = useMutation({
    mutationFn: deleteUserAddress,
    onSuccess: (_, deletedId) => {
      queryClient.invalidateQueries(['user', 'addresses']);
      // Silinen adres seçili adresse, ilk adresi veya null seç
      if (selectedAddress?.id === deletedId) {
        const remaining = savedAddresses.filter(a => a.id !== deletedId);
        const newSelected = remaining.length > 0 
          ? (remaining.find(a => a.is_default) || remaining[0])
          : null;
        setSelectedAddress(newSelected);
        if (newSelected) {
          localStorage.setItem('cart_selected_address', JSON.stringify(newSelected));
        } else {
          localStorage.removeItem('cart_selected_address');
        }
      }
      setDeleteConfirm({ isOpen: false, addressId: null });
      toast.success('Adres Silindi', 'Adres başarıyla silindi.');
    },
    onError: (error) => {
      console.error('Adres silme hatası:', error);
      setDeleteConfirm({ isOpen: false, addressId: null });
      toast.error('Hata', 'Adres silinirken bir sorun oluştu.');
    }
  });

  // Checkout mutation - iyzico ödeme başlatma
  const checkoutMutation = useMutation({
    mutationFn: initializeCheckout,
    onSuccess: (response) => {
      if (response.success) {
        // iyzico ödeme formunu göster
        setPaymentHtml(response.data.checkout_form_content);
        setCheckoutStep('payment');
        toast.success('Ödeme Formu Hazır', 'Lütfen kart bilgilerinizi girin.');
      } else {
        toast.error('Hata', response.message || 'Ödeme başlatılamadı.');
        setCheckoutStep('address');
      }
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Ödeme başlatılırken bir hata oluştu.';
      toast.error('Hata', message);
      setCheckoutStep('address');
    }
  });

  // Resize listener
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

  /**
   * Adres seçme işlemi
   */
  const handleSelectAddress = useCallback((address) => {
    setSelectedAddress(address);
    localStorage.setItem('cart_selected_address', JSON.stringify(address));
    toast.success('Adres Seçildi', `${address.label || 'Adres'} teslimat adresi olarak seçildi.`);
  }, [toast]);

  /**
   * Yeni adres ekleme modal'ı açma
   */
  const handleOpenAddressModal = useCallback(() => {
    setIsAddressModalOpen(true);
  }, []);

  /**
   * Adres modal'ı kapatma
   */
  const handleCloseAddressModal = useCallback(() => {
    setIsAddressModalOpen(false);
  }, []);

  /**
   * Yeni adres kaydetme
   */
  const handleSaveNewAddress = useCallback((address) => {
    if (user) {
      createAddressMutation.mutate(address);
    }
  }, [user, createAddressMutation]);

  /**
   * Adres silme onay modal'ını aç
   */
  const handleDeleteAddress = useCallback((addressId) => {
    setDeleteConfirm({ isOpen: true, addressId });
  }, []);

  /**
   * Adres silme onayı
   */
  const confirmDeleteAddress = useCallback(() => {
    if (deleteConfirm.addressId) {
      deleteAddressMutation.mutate(deleteConfirm.addressId);
    }
  }, [deleteConfirm.addressId, deleteAddressMutation]);

  /**
   * Silme modal'ını kapat
   */
  const cancelDeleteAddress = useCallback(() => {
    setDeleteConfirm({ isOpen: false, addressId: null });
  }, []);

  /**
   * Sepeti Onayla butonuna tıklama - Checkout başlat
   */
  const handleCheckoutClick = useCallback(() => {
    // Giriş kontrolü
    if (!isAuthenticated) {
      toast.warning('Giriş Yapın', 'Ödeme yapabilmek için giriş yapmanız gerekmektedir.');
      navigate('/login?redirect=/cart');
      return;
    }

    // TC Kimlik kontrolü
    if (!user?.identity_number) {
      toast.warning('TC Kimlik Gerekli', 'Ödeme yapabilmek için profil sayfanızdan TC Kimlik numaranızı girmeniz gerekmektedir.');
      navigate('/account/profile');
      return;
    }

    // Adres kontrolü
    if (!selectedAddress) {
      toast.warning('Adres Seçin', 'Lütfen bir teslimat adresi seçiniz.');
      return;
    }

    // Checkout modalını aç
    setShowCheckoutModal(true);
    setCheckoutStep('address');
    setPaymentHtml(null);
  }, [isAuthenticated, user, selectedAddress, toast, navigate]);

  /**
   * Ödemeye geç - iyzico form başlat
   */
  const handleStartPayment = useCallback(() => {
    if (!selectedAddress) {
      toast.warning('Adres Seçin', 'Lütfen bir teslimat adresi seçiniz.');
      return;
    }

    setCheckoutStep('processing');
    checkoutMutation.mutate({
      shipping_address_id: selectedAddress.id,
    });
  }, [selectedAddress, checkoutMutation, toast]);

  /**
   * Checkout modal'ını kapat
   */
  const handleCloseCheckoutModal = useCallback(() => {
    setShowCheckoutModal(false);
    setCheckoutStep('address');
    setPaymentHtml(null);
  }, []);

  return {
    // State
    cartItems,
    coupon,
    totals,
    loading,
    initialized,
    couponInput,
    isMobile,

    // Address State
    // Cart Data
    cartItems,
    vendorGroups,
    coupon,
    totals,
    loading,
    initialized,
    couponInput,
    isMobile,

    // Address State
    selectedAddress,
    savedAddresses,
    addressLoading,
    isAddressModalOpen,

    // Delete Confirm Modal State
    deleteConfirm,
    confirmDeleteAddress,
    cancelDeleteAddress,

    // Checkout State
    showCheckoutModal,
    checkoutStep,
    paymentHtml,
    isCheckoutLoading: checkoutMutation.isPending,

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

    // Checkout Handlers
    handleCheckoutClick,
    handleStartPayment,
    handleCloseCheckoutModal,
    
    // Loading states
    isDeleting: deleteAddressMutation.isPending,
  };
};

export default useCartPage;
