// src/components/Navbar/index.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaUser, 
  FaShoppingBag, 
  FaHeart, 
  FaSignOutAlt, 
  FaBars,      // Hamburger menü için
  FaSearch,    // Mobil arama butonu için
  FaMapMarkerAlt // Adres ikonu için
} from 'react-icons/fa';

import AddressModal from '../../modals/AddressModal';
import ConfirmModal from '../../modals/ConfirmModal';

// --- Stiller ---
// DİKKAT: styles.js dosyasını güncelledin, artık getStyles fonksiyonunu import ediyoruz
import { getStyles } from './styles';

// --- Alt Bileşenler ---
// TopBar'ı koşullu render edeceğiz, AddressBar'ı ise yeni yapıya dahil ettik
import SearchBar from './SearchBar'; 
import MiniCart from './MiniCart';
import MobileMenu from './MobileMenu';
import BottomNav from './BottomNav';
import SearchOverlay from './SearchOverlay';

// --- Custom Hook ---
import useNavbar from './useNavbar';

/**
 * Ana Navbar Bileşeni - Mobile First & Senior Refactor
 */
const Navbar = () => {
  // 1. EKRAN GENİŞLİĞİ KONTROLÜ (Responsive Logic)
  const [width, setWidth] = useState(window.innerWidth);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOverlayOpen, setIsSearchOverlayOpen] = useState(false);
  const isMobile = width <= 768;

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 2. STİLLERİ HESAPLA
  const styles = getStyles(isMobile);

  // 3. LOGIC (Hook'tan gelen veriler)
  const {
    searchTerm,
    setSearchTerm,
    isCartOpen,
    isAddressModalOpen,
    currentAddress,
    // Delete Confirm
    deleteConfirm,
    confirmDeleteAddress,
    cancelDeleteAddress,
    isDeleting,
    // Context Data
    user,
    favorites,
    favoriteCount,
    cartItems,
    totals,
    itemCount,
    categories,
    categoriesLoading,
    getLinkStyle,
    handleLogout,
    handleSearch,
    handleAddressClick,
    handleAddressModalClose,
    handleSaveAddress,
    handleDeleteAddress,
    openCart,
    closeCart,
  } = useNavbar();

  // Mobil Menü Açma Fonksiyonu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(true);
  };

  return (
    <>
      <MobileMenu 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
        user={user}
        onLogout={handleLogout}
      />
      
      <SearchOverlay 
        isOpen={isSearchOverlayOpen} 
        onClose={() => setIsSearchOverlayOpen(false)} 
      />

      {/* 1. PARÇA: EN ÜST BAR (Mobilde styles.js tarafından gizlenir: display: none) */}
      <div style={styles.topBar}>
        <div style={styles.container}>
           <span>Hoş Geldiniz! | Satıcı Ol</span>
           <span>0850 123 45 67 | Yardım</span>
        </div>
      </div>

      {/* 2. PARÇA: ANA HEADER (Sticky) */}
      <header style={styles.header}>
        <div style={styles.container}>
          <div style={styles.headerContent}>
            
            {/* SOL KISIM: Hamburger + Logo */}
            <div style={styles.leftSection}>
              {/* Hamburger Menu (Sadece Mobilde Görünür) */}
              <button style={styles.menuBtn} onClick={toggleMobileMenu}>
                <FaBars />
              </button>

              <Link to="/" style={styles.logo}>
                ticaret<span style={{ color: '#334155' }}>.com</span>
              </Link>
            </div>

            {/* ORTA KISIM: Arama Çubuğu */}
            <div style={styles.searchContainer}>
              <SearchBar 
                searchTerm={searchTerm} 
                setSearchTerm={setSearchTerm} 
                handleSearch={handleSearch}
                styles={styles}  // <-- YENİ EKLENEN KISIM: Stili prop olarak gönderiyoruz
              />
            </div>

            {/* SAĞ KISIM: İkonlar */}
            <div style={styles.actions}>
              
              {/* Mobil Arama Butonu (Sadece Mobilde Görünür) */}
              <button style={styles.mobileSearchBtn} onClick={() => setIsSearchOverlayOpen(true)}>
                <FaSearch />
              </button>

              {!user ? (
                // MİSAFİR KULLANICI
                <Link to="/login" style={styles.actionItem}>
                  <div style={styles.iconBox}><FaUser /></div>
                  <span style={styles.actionText}>Giriş Yap</span>
                </Link>
              ) : (
                // GİRİŞ YAPMIŞ KULLANICI
                <>
                  {/* Masaüstünde Çıkış Yap (Mobilde Hamburgerde olmalı) */}
                  {!isMobile && (
                    <div style={{ ...styles.actionItem, cursor: 'pointer' }} onClick={handleLogout}>
                      <div style={styles.iconBox}><FaSignOutAlt /></div>
                      <span style={styles.actionText}>Çıkış</span>
                    </div>
                  )}

                  {/* Favoriler (Mobilde Gizle -> Hamburgere taşıyabilirsin) */}
                  {!isMobile && (
                    <Link to="/favorites" style={styles.actionItem}>
                      <div style={styles.iconBox}>
                        <FaHeart />
                        {(favoriteCount > 0 || favorites?.length > 0) && (
                          <span style={styles.badge}>{favoriteCount || favorites?.length}</span>
                        )}
                      </div>
                      <span style={styles.actionText}>Favoriler</span>
                    </Link>
                  )}

                  {/* Sepet Kutusu (Her zaman görünür) */}
                  <div 
                    style={{ position: 'relative', height: '100%', display: 'flex', alignItems: 'center' }}
                    onMouseEnter={!isMobile ? openCart : undefined}
                    onMouseLeave={!isMobile ? closeCart : undefined}
                  >
                    <Link to="/cart" style={styles.actionItem}>
                      <div style={styles.iconBox}>
                        <FaShoppingBag />
                        {(itemCount > 0 || cartItems?.length > 0) && (
                          <span style={styles.badge}>{itemCount || cartItems?.length}</span>
                        )}
                      </div>
                      <span style={styles.actionText}>Sepetim</span>
                    </Link>

                    {/* MiniCart Hover (Sadece Masaüstü) */}
                    {!isMobile && isCartOpen && cartItems?.length > 0 && (
                      <MiniCart cartItems={cartItems} totals={totals} />
                    )}
                  </div>

                  {/* Hesabım (Masaüstü) */}
                  {!isMobile && (
                    <Link to="/account/profile" style={styles.actionItem}>
                      <div style={styles.iconBox}><FaUser /></div>
                      <span style={styles.actionText}>Hesabım</span>
                    </Link>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* 3. PARÇA: ALT BAR (Yatay Kaydırmalı Kategoriler + Adres) */}
      {isMobile ? (
        // --- MOBİL GÖRÜNÜM ---
        <>
          {/* 1. Adres Barı (İnce Şerit) */}
          <div style={styles.mobileAddressBar} onClick={handleAddressClick}>
            <FaMapMarkerAlt />
            <span style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {currentAddress ? `${currentAddress.title || currentAddress.label || 'Adresim'}${currentAddress.city ? ` - ${currentAddress.city}` : ''}` : 'Teslimat Adresi Seçin'}
            </span>
            <span style={{ fontSize: '18px' }}>›</span>
          </div>

          {/* 2. Story Tipi Kategoriler */}
          <div style={styles.storyContainer}>
            {categoriesLoading ? (
              <span style={{fontSize: '12px', color: '#64748b', padding: '10px'}}>Yükleniyor...</span>
            ) : (
              categories.map((cat) => {
                const Icon = cat.IconComponent;
                return (
                  <Link 
                    key={cat.id}
                    to={`/products?category=${cat.slug}`}
                    style={styles.storyItem}
                  >
                    <div style={styles.storyCircle}>
                      <Icon style={{fontSize: '20px'}} />
                    </div>
                    <span style={styles.storyText}>{cat.name}</span>
                  </Link>
                );
              })
            )}
          </div>
        </>
      ) : (
        // --- MASAÜSTÜ GÖRÜNÜM (Eski Hal) ---
        <div style={styles.bottomBar}>
          <div style={styles.bottomBarContainer}>
            
            {/* Adres Seçimi (Minimal Hap Şeklinde) */}
            <div style={styles.addressBtn} onClick={handleAddressClick}>
              <FaMapMarkerAlt color="#059669" />
              <span>
                {currentAddress ? `${currentAddress.title || currentAddress.label || 'Adresim'}${currentAddress.city ? ` - ${currentAddress.city}` : ''}` : 'Teslimat Adresi Seç'}
              </span>
            </div>

            {/* Kategoriler (Instagram Story Tarzı Kaydırma) */}
            {categoriesLoading ? (
              <span style={{fontSize: '14px', color: '#64748b'}}>Yükleniyor...</span>
            ) : (
              categories.map((cat) => {
                const Icon = cat.IconComponent;
                return (
                  <Link 
                    key={cat.id}
                    to={`/products?category=${cat.slug}`}
                    style={styles.categoryLink}
                  >
                    <Icon style={{marginRight: '6px', fontSize: '14px'}} /> {cat.name}
                  </Link>
                );
              })
            )}

          </div>
        </div>
      )}

      {/* --- MODALLAR --- */}
      <AddressModal 
        isOpen={isAddressModalOpen} 
        onClose={handleAddressModalClose} 
        onSave={handleSaveAddress}
        onDeleteAddress={handleDeleteAddress}
        initialAddress={currentAddress}
      />

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

      {/* Bottom Navigation Bar (Mobile Only) */}
      {isMobile && (
        <BottomNav 
          cartItemCount={itemCount || cartItems?.length} 
          favoriteCount={favoriteCount || favorites?.length} 
        />
      )}
    </>
  );
};

export default Navbar;