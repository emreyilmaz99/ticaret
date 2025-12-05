import React from 'react';
import { Link } from 'react-router-dom';
import { FaUser, FaShoppingBag, FaHeart, FaSignOutAlt } from 'react-icons/fa';
import AddressModal from '../AddressModal';
import { styles } from './styles';

// --- Alt Bileşenler ---
import TopBar from './TopBar';
import SearchBar from './SearchBar';
import MiniCart from './MiniCart';
import AddressBar from './AddressBar';

// --- Custom Hook ---
import useNavbar from './useNavbar';

/**
 * Ana Navbar Bileşeni
 * Tüm navigation, arama, sepet ve kullanıcı işlemlerini yönetir
 */
const Navbar = () => {
  // Custom hook'tan tüm state ve fonksiyonları al
  const {
    searchTerm,
    setSearchTerm,
    isCartOpen,
    isAddressModalOpen,
    currentAddress,
    user,
    favorites,
    favoriteCount,
    hasNewFavorites,
    cartItems,
    totals,
    itemCount,
    hasNewCartItems,
    getLinkStyle,
    handleLogout,
    handleSearch,
    handleAddressClick,
    handleAddressModalClose,
    handleSaveAddress,
    handleDealsClick,
    openCart,
    closeCart,
  } = useNavbar();

  return (
    <>
      {/* 1. Parça: En Üst Bar */}
      <TopBar />

      {/* 2. Parça: Ana Header */}
      <header style={styles.header}>
        <div style={{ ...styles.container, ...styles.headerContent }}>
          
          {/* Logo */}
          <Link to="/" style={styles.logo}>
            ticaret<span style={{ color: '#334155' }}>.com</span>
          </Link>

          {/* Arama Çubuğu */}
          <SearchBar 
            searchTerm={searchTerm} 
            setSearchTerm={setSearchTerm} 
            handleSearch={handleSearch} 
          />

          {/* Sağ İkonlar */}
          <div style={styles.actions}>
            {!user ? (
              <Link to="/login" style={styles.actionItem}>
                <div style={styles.iconBox}><FaUser /></div>
                <span>Giriş Yap</span>
              </Link>
            ) : (
              <>
                {/* Çıkış Yap */}
                <div style={{ ...styles.actionItem, cursor: 'pointer' }} onClick={handleLogout}>
                  <div style={styles.iconBox}><FaSignOutAlt /></div>
                  <span>Çıkış Yap</span>
                </div>

                {/* Favoriler */}
                <Link to="/favorites" style={getLinkStyle('/favorites')}>
                  <div style={styles.iconBox}>
                    <FaHeart />
                    {hasNewFavorites && (
                      <span style={styles.badge}>{favoriteCount || favorites?.length || '!'}</span>
                    )}
                  </div>
                  <span>Favorilerim</span>
                </Link>

                {/* Sepet Kutusu */}
                <div 
                  style={{ position: 'relative', height: '100%', display: 'flex', alignItems: 'center' }}
                  onMouseEnter={openCart}
                  onMouseLeave={closeCart}
                >
                  <Link to="/cart" style={getLinkStyle('/cart')}>
                    <div style={styles.iconBox}>
                      <FaShoppingBag />
                      {hasNewCartItems && (
                        <span style={styles.badge}>{itemCount || cartItems?.length || '!'}</span>
                      )}
                    </div>
                    <span>Sepetim</span>
                  </Link>

                  {/* Açılır Sepet (MiniCart) */}
                  {isCartOpen && cartItems?.length > 0 && (
                    <MiniCart cartItems={cartItems} totals={totals} />
                  )}
                </div>

                {/* Profil Linki */}
                <Link to="/account/profile" style={getLinkStyle('/account/profile')}>
                  <div style={styles.iconBox}><FaUser /></div>
                  <span>{user?.name || 'Hesabım'}</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* 3. Parça: Alt Bar (Adres ve Kategoriler) */}
      <AddressBar 
        user={user}
        currentAddress={currentAddress}
        handleAddressClick={handleAddressClick}
        handleDealsClick={handleDealsClick}
      />

      {/* Adres Modal */}
      <AddressModal 
        isOpen={isAddressModalOpen} 
        onClose={handleAddressModalClose} 
        onSave={handleSaveAddress}
        initialAddress={currentAddress}
      />
    </>
  );
};

export default Navbar;

// --- Barrel Exports ---
// Diğer bileşenleri tek noktadan export et
export { default as TopBar } from './TopBar';
export { default as SearchBar } from './SearchBar';
export { default as MiniCart } from './MiniCart';
export { default as AddressBar } from './AddressBar';
export { default as useNavbar } from './useNavbar';
export { styles } from './styles';
