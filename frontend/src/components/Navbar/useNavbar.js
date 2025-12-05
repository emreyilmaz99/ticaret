import { useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createUserAddress } from '../../features/user/api/userAddressApi';
import { useToast } from '../Toast';
import AuthContext from '../../context/AuthContext';
import { useFavorites } from '../../context/FavoritesContext';
import { useCart } from '../../context/CartContext';
import { styles } from './styles';

/**
 * Navbar bileşeni için tüm business logic'i içeren custom hook
 * @returns {Object} Navbar için gerekli tüm state ve fonksiyonlar
 */
const useNavbar = () => {
  // --- State Tanımları ---
  const [searchTerm, setSearchTerm] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [currentAddress, setCurrentAddress] = useState(() => {
    const saved = localStorage.getItem('user_address');
    try {
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // --- Hook Tanımları ---
  const toast = useToast();
  const { user, logout } = useContext(AuthContext);
  const { favorites, count: favoriteCount } = useFavorites();
  const { cartItems, totals, itemCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();

  // --- Adres Kaydetme Mutation ---
  const createAddressMutation = useMutation({
    mutationFn: createUserAddress,
    onSuccess: (response) => {
      const addressData = response.data || response.address || response;
      setCurrentAddress(addressData);
      localStorage.setItem('user_address', JSON.stringify(addressData));
      queryClient.invalidateQueries(['user-addresses']);
      toast.success('Adres Kaydedildi', 'Teslimat adresi başarıyla eklendi.');
      setIsAddressModalOpen(false);
    },
    onError: (error) => {
      console.error('Adres ekleme hatası:', error);
      toast.error('Hata', 'Adres eklenirken bir sorun oluştu.');
    }
  });

  // --- Link Stili Fonksiyonu ---
  const getLinkStyle = (path) => {
    const isActive = location.pathname === path || 
      (path === '/account/profile' && location.pathname.startsWith('/account'));
    return {
      ...styles.actionItem,
      color: isActive ? '#059669' : '#334155',
      fontWeight: isActive ? '700' : 'normal'
    };
  };

  // --- Çıkış Yapma ---
  const handleLogout = () => {
    logout();
    toast.success('Başarılı', 'Başarıyla çıkış yapıldı.');
    navigate('/');
  };

  // --- Arama İşlemi ---
  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  // --- Adres Modal Açma ---
  const handleAddressClick = () => {
    setIsAddressModalOpen(true);
  };

  // --- Adres Modal Kapatma ---
  const handleAddressModalClose = () => {
    setIsAddressModalOpen(false);
  };

  // --- Adres Kaydetme ---
  const handleSaveAddress = (address) => {
    if (user) {
      if (address.id) {
        // Mevcut adres seçildi
        setCurrentAddress(address);
        localStorage.setItem('user_address', JSON.stringify(address));
        toast.success('Adres Seçildi', 'Teslimat adresi güncellendi.');
        setIsAddressModalOpen(false);
      } else {
        // Yeni adres oluştur
        createAddressMutation.mutate(address);
      }
    } else {
      // Misafir kullanıcı için localStorage'a kaydet
      setCurrentAddress(address);
      localStorage.setItem('user_address', JSON.stringify(address));
      toast.success('Adres Kaydedildi', 'Teslimat adresi geçici olarak kaydedildi.');
      setIsAddressModalOpen(false);
    }
  };

  // --- Günün Fırsatları Tıklama ---
  const handleDealsClick = () => {
    toast.info('Bilgi', 'Günün fırsatları sayfası hazırlanıyor.');
  };

  // --- Sepet Hover Açma/Kapama ---
  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  return {
    // State
    searchTerm,
    setSearchTerm,
    isCartOpen,
    isAddressModalOpen,
    currentAddress,
    
    // Context Data
    user,
    favorites,
    favoriteCount,
    cartItems,
    totals,
    itemCount,
    
    // Fonksiyonlar
    getLinkStyle,
    handleLogout,
    handleSearch,
    handleAddressClick,
    handleAddressModalClose,
    handleSaveAddress,
    handleDealsClick,
    openCart,
    closeCart,
    
    // Toast (diğer bileşenler için)
    toast,
  };
};

export default useNavbar;
