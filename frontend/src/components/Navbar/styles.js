// src/components/Header/styles.js

export const getStyles = (isMobile) => ({
  // --- EN ÜST BAR (Mobilde Gizli) ---
  topBar: {
    display: isMobile ? 'none' : 'block',
    backgroundColor: '#064e3b',
    color: '#ecfdf5',
    fontSize: '12px',
    padding: '8px 0',
    fontFamily: '"Inter", sans-serif',
  },

  // --- ANA KONTEYNER ---
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: isMobile ? '0 16px' : '0 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '100%',
  },

  // --- HEADER (Yapışkan) ---
  header: {
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    backdropFilter: 'blur(12px)',
    padding: isMobile ? '12px 0' : '16px 0',
    borderBottom: '1px solid rgba(226, 232, 240, 0.6)',
    fontFamily: '"Inter", sans-serif',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    boxShadow: '0 4px 30px rgba(0, 0, 0, 0.03)',
  },
  headerContent: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: isMobile ? 'space-between' : 'flex-start',
    gap: isMobile ? '0' : '40px',
    width: '100%',
  },

  // --- LOGO & HAMBURGER ---
  leftSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  menuBtn: {
    display: isMobile ? 'flex' : 'none', // Sadece mobilde görünür
    alignItems: 'center',
    justifyContent: 'center',
    background: 'none',
    border: 'none',
    fontSize: '24px',
    color: '#334155',
    cursor: 'pointer',
    padding: 0,
  },
  logo: {
    fontFamily: '"DM Sans", sans-serif',
    fontSize: isMobile ? '22px' : '28px',
    fontWeight: '800',
    background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    textDecoration: 'none',
    letterSpacing: '-1px',
  },

  // --- ARAMA ÇUBUĞU ---
  searchContainer: {
    flex: 1,
    position: 'relative',
    maxWidth: '500px',
    // Mobilde arama çubuğunu gizleyip sadece ikon gösterebiliriz
    // Veya küçük bir bar yapabiliriz. Şimdilik gizleyip sağa ikon koyacağız.
    display: isMobile ? 'none' : 'block', 
  },
  searchInput: {
    width: '100%',
    padding: '12px 24px 12px 52px',
    borderRadius: '24px',
    border: '1px solid #e2e8f0',
    backgroundColor: '#f8fafc',
    fontSize: '14px',
    outline: 'none',
    transition: 'all 0.3s ease',
  },
  searchIcon: {
    position: 'absolute',
    left: '20px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#94a3b8',
  },

  // --- SAĞ İKONLAR (ACTIONS) ---
  actions: {
    display: 'flex',
    alignItems: 'center',
    gap: isMobile ? '16px' : '24px',
  },
  actionItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textDecoration: 'none',
    color: '#334155',
    fontSize: '12px',
    gap: '4px',
    cursor: 'pointer',
    // Mobilde yazıları gizle, sadece ikon kalsın
  },
  actionText: {
    display: isMobile ? 'none' : 'block',
  },
  iconBox: {
    fontSize: isMobile ? '22px' : '20px',
    position: 'relative',
    color: '#334155',
  },
  badge: {
    position: 'absolute',
    top: '-6px',
    right: '-6px',
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

  // --- MOBİL İÇİN SEARCH ICON (Headerda sağda) ---
  mobileSearchBtn: {
    display: isMobile ? 'flex' : 'none',
    fontSize: '20px',
    color: '#334155',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
  },

  // --- BOTTOM BAR (Kategoriler & Adres) ---
  bottomBar: {
    backgroundColor: 'rgba(248, 250, 252, 0.95)',
    borderBottom: '1px solid rgba(226, 232, 240, 0.6)',
    padding: isMobile ? '10px 0' : '12px 0',
    fontFamily: '"Inter", sans-serif',
    // Mobilde sticky yaparak menünün header ile kalmasını sağlayabilirsin
    position: isMobile ? 'sticky' : 'relative',
    top: isMobile ? '58px' : '0', // Header yüksekliğine göre ayarla
    zIndex: 990,
  },
  bottomBarContainer: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: isMobile ? '0' : '0 20px', // Mobilde padding'i scroll container halledecek
    display: 'flex',
    alignItems: 'center',
    // --- BURASI SİHİRLİ KISIM (Yatay Scroll) ---
    overflowX: isMobile ? 'auto' : 'visible',
    whiteSpace: 'nowrap',
    gap: isMobile ? '12px' : '24px',
    // Scrollbarı gizle
    scrollbarWidth: 'none', 
    WebkitOverflowScrolling: 'touch',
    paddingLeft: isMobile ? '16px' : '20px', // Mobilde başlangıç boşluğu
    paddingRight: isMobile ? '16px' : '20px',
  },
  
  // Adres Butonu (Mobilde Hap Şeklinde)
  addressBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    color: '#475569',
    fontSize: '13px',
    cursor: 'pointer',
    background: 'white',
    border: '1px solid #e2e8f0',
    padding: '6px 12px',
    borderRadius: '50px',
    flexShrink: 0, // Küçülmesini engelle
  },
  
  categoryLink: {
    color: '#64748b',
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 0',
    flexShrink: 0, // Küçülmesini engelle
  },

  // --- STORY STYLE CATEGORIES (MOBILE) ---
  storyContainer: {
    display: 'flex',
    gap: '16px',
    padding: '10px 16px',
    overflowX: 'auto',
    scrollbarWidth: 'none',
    WebkitOverflowScrolling: 'touch',
    backgroundColor: 'white',
    borderBottom: '1px solid #f1f5f9',
  },
  storyItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '6px',
    textDecoration: 'none',
    flexShrink: 0,
    width: '64px',
  },
  storyCircle: {
    width: '56px',
    height: '56px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
    border: '2px solid #059669',
    padding: '2px', // Border ile içerik arası boşluk
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '24px',
    color: '#059669',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
  },
  storyText: {
    fontSize: '11px',
    color: '#334155',
    textAlign: 'center',
    fontWeight: '500',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    width: '100%',
  },

  // --- MOBILE ADDRESS BAR ---
  mobileAddressBar: {
    backgroundColor: '#059669',
    color: 'white',
    padding: '8px 16px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '13px',
    fontWeight: '500',
    cursor: 'pointer',
  },

  // --- MİNİ CART (Değişmedi) ---
  miniCart: {
    position: 'absolute',
    top: '100%',
    right: 0,
    width: '300px',
    backgroundColor: 'white',
    boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
    borderRadius: '12px',
    padding: '20px',
    zIndex: 1001,
    border: '1px solid #e2e8f0',
    display: 'none', // Hover veya click ile açılır
  },

  // --- BOTTOM NAVIGATION BAR (MOBILE ONLY) ---
  bottomNav: {
    display: isMobile ? 'flex' : 'none',
    position: 'fixed',
    bottom: 0,
    left: 0,
    width: '100%',
    height: '60px',
    backgroundColor: 'white',
    borderTop: '1px solid #e2e8f0',
    zIndex: 1000,
    justifyContent: 'space-around',
    alignItems: 'center',
    boxShadow: '0 -4px 6px -1px rgba(0, 0, 0, 0.05)',
  },
  bottomNavItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textDecoration: 'none',
    color: '#64748b',
    fontSize: '10px',
    gap: '4px',
    width: '20%',
    height: '100%',
  },
  bottomNavItemActive: {
    color: '#059669',
    fontWeight: '600',
  },
  bottomNavIcon: {
    fontSize: '20px',
    marginBottom: '2px',
    position: 'relative',
  },
  bottomNavBadge: {
    position: 'absolute',
    top: '-5px',
    right: '-8px',
    backgroundColor: '#ef4444',
    color: 'white',
    fontSize: '9px',
    fontWeight: 'bold',
    width: '14px',
    height: '14px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // --- SEARCH OVERLAY (MOBILE) ---
  searchOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
    zIndex: 2100, // Menüden daha üstte
    display: 'flex',
    flexDirection: 'column',
    transform: 'translateY(100%)',
    transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  },
  searchOverlayOpen: {
    transform: 'translateY(0)',
  },
  searchHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: '16px',
    borderBottom: '1px solid #e2e8f0',
    gap: '12px',
  },
  searchBackBtn: {
    background: 'none',
    border: 'none',
    fontSize: '20px',
    color: '#64748b',
    cursor: 'pointer',
    padding: '4px',
  },
  searchOverlayInput: {
    flex: 1,
    border: 'none',
    fontSize: '16px',
    outline: 'none',
    color: '#334155',
    background: 'transparent',
  },
  searchBody: {
    flex: 1,
    overflowY: 'auto',
    padding: '20px',
  },
  searchSectionTitle: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#94a3b8',
    marginBottom: '12px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  recentTags: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
    marginBottom: '24px',
  },
  recentTag: {
    padding: '8px 16px',
    backgroundColor: '#f1f5f9',
    borderRadius: '20px',
    fontSize: '13px',
    color: '#475569',
    cursor: 'pointer',
  },
  popularList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  popularItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    cursor: 'pointer',
  },
  popularItemImage: {
    width: '48px',
    height: '48px',
    borderRadius: '8px',
    backgroundColor: '#f1f5f9',
    objectFit: 'cover',
  },
  popularItemInfo: {
    flex: 1,
  },
  popularItemName: {
    fontSize: '14px',
    color: '#334155',
    fontWeight: '500',
    marginBottom: '2px',
  },
  popularItemPrice: {
    fontSize: '13px',
    color: '#059669',
    fontWeight: '600',
  },

  // --- MOBİL MENÜ (SIDEBAR) ---
  mobileMenuOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 2000,
    display: 'flex',
    justifyContent: 'flex-start',
    opacity: 0,
    visibility: 'hidden',
    transition: 'all 0.3s ease',
  },
  mobileMenuOverlayOpen: {
    opacity: 1,
    visibility: 'visible',
  },
  mobileMenuContainer: {
    width: '80%',
    maxWidth: '300px',
    height: '100%',
    backgroundColor: 'white',
    boxShadow: '4px 0 24px rgba(0,0,0,0.1)',
    transform: 'translateX(-100%)',
    transition: 'transform 0.3s ease',
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'auto',
  },
  mobileMenuContainerOpen: {
    transform: 'translateX(0)',
  },
  mobileMenuHeader: {
    padding: '20px',
    borderBottom: '1px solid #e2e8f0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  mobileMenuCloseBtn: {
    background: 'none',
    border: 'none',
    fontSize: '24px',
    color: '#64748b',
    cursor: 'pointer',
  },
  mobileMenuContent: {
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  mobileMenuItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px',
    borderRadius: '8px',
    color: '#334155',
    textDecoration: 'none',
    fontSize: '15px',
    fontWeight: '500',
    transition: 'background-color 0.2s',
  },
  mobileMenuItemActive: {
    backgroundColor: '#f1f5f9',
    color: '#059669',
    fontWeight: '600',
  },
  mobileMenuDivider: {
    height: '1px',
    backgroundColor: '#e2e8f0',
    margin: '8px 0',
  },
});