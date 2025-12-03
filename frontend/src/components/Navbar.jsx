import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createUserAddress } from '../features/user/api/userAddressApi';
import { 
  FaSearch, FaUser, FaShoppingBag, FaHeart, FaMapMarkerAlt, 
  FaBars, FaChevronDown, FaPhoneAlt, FaSignOutAlt 
} from 'react-icons/fa';
import { useToast } from '../components/Toast';
import { useAuth } from '../context/AuthContext';
import { useFavorites } from '../context/FavoritesContext';
import { useCart } from '../context/CartContext';
import CategoryMenu from './CategoryMenu';
import AddressModal from './AddressModal';

const Navbar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [currentAddress, setCurrentAddress] = useState(() => {
    const saved = localStorage.getItem('user_address');
    return saved ? JSON.parse(saved) : null;
  });

  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { favorites } = useFavorites();
  const { cartItems } = useCart();
  const queryClient = useQueryClient();

  const createAddressMutation = useMutation({
    mutationFn: createUserAddress,
    onSuccess: (response) => {
      // API yanıtından adresi çıkar (response.data veya response.address veya direkt response)
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

  const getLinkStyle = (path) => {
    const isActive = location.pathname === path || (path === '/account/profile' && location.pathname.startsWith('/account'));
    return {
      ...styles.actionItem,
      color: isActive ? '#059669' : '#334155',
      fontWeight: isActive ? '700' : 'normal'
    };
  };

  const handleLogout = () => {
    logout();
    toast.success('Başarılı', 'Başarıyla çıkış yapıldı.');
    navigate('/');
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      if (searchTerm.trim()) {
        toast.info('Bilgi', `Aranıyor: ${searchTerm}`);
        // In a real app, you would navigate to a search results page
        // navigate(\`/search?q=\${encodeURIComponent(searchTerm)}\`);
      }
    }
  };

  const handleHelpClick = () => {
    toast.info('Bilgi', 'Yardım merkezi şu anda bakımda.');
  };

  const handleAddressClick = () => {
    setIsAddressModalOpen(true);
  };

  const handleSaveAddress = (address) => {
    if (user) {
      if (address.id) {
        // Existing address selected
        setCurrentAddress(address);
        localStorage.setItem('user_address', JSON.stringify(address));
        toast.success('Adres Seçildi', 'Teslimat adresi güncellendi.');
        setIsAddressModalOpen(false);
      } else {
        // New address created
        createAddressMutation.mutate(address);
      }
    } else {
      setCurrentAddress(address);
      localStorage.setItem('user_address', JSON.stringify(address));
      toast.success('Adres Kaydedildi', 'Teslimat adresi geçici olarak kaydedildi.');
      setIsAddressModalOpen(false);
    }
  };


  const styles = {
    topBar: {
      backgroundColor: '#064e3b', // Dark Green
      color: '#ecfdf5',
      fontSize: '12px',
      padding: '8px 0',
      fontFamily: '"Inter", sans-serif',
    },
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 20px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    header: {
      backgroundColor: 'rgba(255, 255, 255, 0.85)', // Daha şeffaf
      backdropFilter: 'blur(12px)', // Buzlu cam efekti
      padding: '16px 0',
      borderBottom: '1px solid rgba(226, 232, 240, 0.6)', // Çok hafif çizgi
      fontFamily: '"Inter", sans-serif',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      boxShadow: '0 4px 30px rgba(0, 0, 0, 0.03)', // Çok yumuşak gölge
      transition: 'all 0.3s ease',
    },
    headerContent: {
      display: 'flex',
      alignItems: 'center',
      gap: '40px',
    },
    logo: {
      fontFamily: '"DM Sans", sans-serif',
      fontSize: '32px', // Biraz daha büyük
      fontWeight: '800',
      background: 'linear-gradient(135deg, #059669 0%, #047857 100%)', // Logoya gradient
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      textDecoration: 'none',
      letterSpacing: '-1px',
    },
    searchContainer: {
      flex: 1,
      position: 'relative',
    },
    searchInput: {
      width: '100%',
      padding: '14px 24px 14px 52px',
      borderRadius: '24px', // Tam yuvarlak yerine modern oval
      border: '1px solid transparent', // Normalde kenarlık yok
      backgroundColor: '#f1f5f9', // Hafif gri zemin
      fontSize: '14px',
      outline: 'none',
      transition: 'all 0.3s ease',
      fontFamily: '"Inter", sans-serif',
      boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)', // İç gölge
    },
    searchIcon: {
      position: 'absolute',
      left: '16px',
      top: '50%',
      transform: 'translateY(-50%)',
      color: '#94a3b8',
    },
    actions: {
      display: 'flex',
      alignItems: 'center',
      gap: '24px',
    },
    actionItem: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textDecoration: 'none',
      color: '#334155',
      fontSize: '12px',
      gap: '4px',
      transition: 'color 0.2s',
    },
    iconBox: {
      fontSize: '20px',
      position: 'relative',
    },
    badge: {
      position: 'absolute',
      top: '-8px',
      right: '-8px',
      backgroundColor: '#ef4444',
      color: 'white',
      fontSize: '10px',
      fontWeight: 'bold',
      width: '16px',
      height: '16px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    bottomBar: {
      backgroundColor: 'rgba(248, 250, 252, 0.8)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid rgba(226, 232, 240, 0.6)',
      padding: '12px 0',
      fontFamily: '"Inter", sans-serif',
      position: 'relative',
      zIndex: 900,
    },
    addressBtn: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      color: '#475569',
      fontSize: '13px',
      cursor: 'pointer',
      background: 'white', // Beyaz buton
      border: '1px solid #e2e8f0',
      padding: '8px 16px',
      borderRadius: '50px', // Yuvarlak buton
      transition: 'all 0.2s',
      boxShadow: '0 2px 5px rgba(0,0,0,0.02)',
    },
    navLinks: {
      display: 'flex',
      gap: '24px',
      listStyle: 'none',
      margin: 0,
      padding: 0,
    },
    navLink: {
      textDecoration: 'none',
      color: '#334155',
      fontSize: '14px',
      fontWeight: '500',
      transition: 'color 0.2s',
    },
    miniCart: {
      position: 'absolute',
      top: '100%',
      right: 0,
      width: '320px',
      backgroundColor: 'white',
      boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
      borderRadius: '12px',
      padding: '20px',
      zIndex: 1001,
      border: '1px solid #e2e8f0',
      display: isCartOpen ? 'block' : 'none',
      animation: 'fadeIn 0.2s ease',
    },
    miniCartItem: {
      display: 'flex',
      gap: '12px',
      marginBottom: '16px',
      paddingBottom: '16px',
      borderBottom: '1px solid #f1f5f9',
    },
    miniCartImg: {
      width: '60px',
      height: '60px',
      borderRadius: '8px',
      objectFit: 'cover',
    },
    miniCartInfo: {
      flex: 1,
    },
    miniCartTitle: {
      fontSize: '13px',
      fontWeight: '600',
      color: '#1e293b',
      marginBottom: '4px',
      lineHeight: '1.4',
    },
    miniCartPrice: {
      fontSize: '14px',
      fontWeight: '700',
      color: '#059669',
    },
    checkoutBtn: {
      width: '100%',
      padding: '12px',
      backgroundColor: '#059669',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontWeight: '600',
      cursor: 'pointer',
      marginTop: '12px',
      display: 'block',
      textAlign: 'center',
      textDecoration: 'none',
    },
  };

  return (
    <>
      {/* Top Bar */}
      <div style={styles.topBar}>
        <div style={styles.container}>
          <div style={{ display: 'flex', gap: '20px' }}>
            <span>Hoş Geldiniz!</span>
            <span style={{ opacity: 0.8 }}>|</span>
            <Link to="/vendor/register" style={{ color: 'inherit', textDecoration: 'none' }}>Satıcı Ol</Link>
          </div>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><FaPhoneAlt size={10} /> 0850 123 45 67</span>
            <span style={{ cursor: 'pointer' }} onClick={handleHelpClick}>Yardım</span>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header style={styles.header}>
        <div style={{ ...styles.container, ...styles.headerContent }}>
          {/* Logo */}
          <Link to="/" style={styles.logo}>
            ticaret<span style={{ color: '#334155' }}>.com</span>
          </Link>

          {/* Search */}
          <div style={styles.searchContainer}>
            <FaSearch style={styles.searchIcon} />
            <input 
              type="text" 
              placeholder="Ürün, kategori veya marka ara..." 
              style={styles.searchInput}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleSearch}
              onFocus={(e) => e.target.style.borderColor = '#059669'}
              onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
            />
          </div>

          {/* Actions */}
          <div style={styles.actions}>
            {!user ? (
              <Link to="/login" style={styles.actionItem}>
                <div style={styles.iconBox}><FaUser /></div>
                <span>Giriş Yap</span>
              </Link>
            ) : (
              <>
                <div style={{ ...styles.actionItem, cursor: 'pointer' }} onClick={handleLogout}>
                  <div style={styles.iconBox}><FaSignOutAlt /></div>
                  <span>Çıkış Yap</span>
                </div>
                
                <Link to="/favorites" style={getLinkStyle('/favorites')}>
                  <div style={styles.iconBox}>
                    <FaHeart />
                    {favorites.length > 0 && <span style={styles.badge}>{favorites.length}</span>}
                  </div>
                  <span>Favorilerim</span>
                </Link>

                <div 
                  style={{ position: 'relative', height: '100%', display: 'flex', alignItems: 'center' }}
                  onMouseEnter={() => setIsCartOpen(true)}
                  onMouseLeave={() => setIsCartOpen(false)}
                >
                  <Link to="/cart" style={getLinkStyle('/cart')}>
                    <div style={styles.iconBox}>
                      <FaShoppingBag />
                      {cartItems.length > 0 && (
                        <span style={styles.badge}>{cartItems.length}</span>
                      )}
                    </div>
                    <span>Sepetim</span>
                  </Link>

                  {/* Mini Cart Dropdown */}
                  {isCartOpen && cartItems.length > 0 && (
                    <div style={styles.miniCart}>
                      <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '16px', color: '#334155' }}>
                        Sepetim ({cartItems.length} Ürün)
                      </div>
                      
                      {cartItems.slice(0, 3).map((item, index) => (
                        <div key={index} style={styles.miniCartItem}>
                          <img src={item.image} alt={item.name} style={styles.miniCartImg} />
                          <div style={styles.miniCartInfo}>
                            <div style={styles.miniCartTitle}>{item.name}</div>
                            <div style={styles.miniCartPrice}>{item.price.toLocaleString('tr-TR')} TL</div>
                            <div style={{ fontSize: '12px', color: '#64748b' }}>Adet: {item.quantity}</div>
                          </div>
                        </div>
                      ))}

                      {cartItems.length > 3 && (
                        <div style={{ textAlign: 'center', fontSize: '12px', color: '#64748b', marginBottom: '10px' }}>
                          ve {cartItems.length - 3} ürün daha...
                        </div>
                      )}

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                        <span style={{ fontSize: '14px', color: '#64748b' }}>Toplam:</span>
                        <span style={{ fontSize: '18px', fontWeight: '700', color: '#059669' }}>
                          {cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0).toLocaleString('tr-TR')} TL
                        </span>
                      </div>
                      
                      <Link to="/cart" style={styles.checkoutBtn}>Sepete Git</Link>
                    </div>
                  )}
                </div>

                <Link to="/account/profile" style={getLinkStyle('/account/profile')}>
                  <div style={styles.iconBox}><FaUser /></div>
                  <span>{user?.name || 'Hesabım'}</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Bottom Navigation & Address */}
      <div style={styles.bottomBar}>
        <div style={{ ...styles.container, justifyContent: 'space-between', position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
            {user && (
              <>
                <button style={styles.addressBtn} onClick={handleAddressClick}>
                  <FaMapMarkerAlt color="#059669" />
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', lineHeight: '1.2' }}>
                    <span style={{ fontSize: '10px', color: '#64748b' }}>Teslimat Adresi</span>
                    <span style={{ fontWeight: '600', color: '#1e293b' }}>
                      {currentAddress ? (
                        <>
                          {currentAddress.label || currentAddress.title || 'Adres'}
                          {(currentAddress.district || currentAddress.city) 
                            ? ` - ${currentAddress.district || ''}${currentAddress.district && currentAddress.city ? '/' : ''}${currentAddress.city || ''}`
                            : (currentAddress.address_line ? ` - ${currentAddress.address_line.substring(0, 20)}${currentAddress.address_line.length > 20 ? '...' : ''}` : '')}
                        </>
                      ) : 'Adres Seçin'}
                    </span>
                  </div>
                  <FaChevronDown size={10} style={{ marginLeft: '4px' }} />
                </button>
                <div style={{ width: '1px', height: '20px', backgroundColor: '#cbd5e1' }}></div>
              </>
            )}
            <CategoryMenu />
          </div>
          <div 
            style={{ fontSize: '13px', color: '#059669', fontWeight: '600', cursor: 'pointer' }}
            onClick={() => toast.info('Bilgi', 'Günün fırsatları sayfası hazırlanıyor.')}
          >
            Günün Fırsatları
          </div>
        </div>
      </div>

      <AddressModal 
        isOpen={isAddressModalOpen} 
        onClose={() => setIsAddressModalOpen(false)} 
        onSave={handleSaveAddress}
        initialAddress={currentAddress}
      />
    </>
  );
};

export default Navbar;