import { useState, useContext, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { useFavorites } from '../context/FavoritesContext';
import { useCart } from '../context/CartContext';
import api from '../services/api';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { favorites, hasNewItems: hasNewFavorites } = useFavorites();
  const { items: cartItems, hasNewItems: hasNewCartItems } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  
  const mobileMenuRef = useRef(null);
  const userDropdownRef = useRef(null);

  useEffect(() => {
    fetchCategories();
    
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth > 768) {
        setShowMobileMenu(false);
        setShowMobileSearch(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    setShowMobileMenu(false);
    setShowMobileSearch(false);
    setShowUserDropdown(false);
  }, [location]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setShowMobileMenu(false);
      }
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
        setShowUserDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories');
      if (response.data?.data) {
        setCategories(response.data.data);
      }
    } catch (error) {
      console.error('Kategoriler yüklenirken hata:', error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setShowMobileSearch(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setShowUserDropdown(false);
    setShowMobileMenu(false);
  };

  const styles = {
    // Ana navbar container
    navbar: {
      backgroundColor: '#ffffff',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      width: '100%',
    },
    
    // Üst bar (logo, arama, aksiyonlar)
    topBar: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: isMobile ? '12px 16px' : '16px 40px',
      maxWidth: '1400px',
      margin: '0 auto',
      gap: isMobile ? '12px' : '24px',
    },
    
    // Logo
    logo: {
      fontSize: isMobile ? '20px' : '28px',
      fontWeight: 'bold',
      color: '#2563eb',
      textDecoration: 'none',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      whiteSpace: 'nowrap',
    },
    
    // Desktop arama
    searchContainer: {
      flex: 1,
      maxWidth: '600px',
      display: isMobile ? 'none' : 'flex',
    },
    
    searchForm: {
      display: 'flex',
      width: '100%',
      borderRadius: '8px',
      overflow: 'hidden',
      border: '2px solid #e5e7eb',
      transition: 'border-color 0.2s',
    },
    
    searchInput: {
      flex: 1,
      padding: '12px 16px',
      border: 'none',
      fontSize: '15px',
      outline: 'none',
      minWidth: 0,
    },
    
    searchButton: {
      backgroundColor: '#2563eb',
      color: 'white',
      border: 'none',
      padding: '12px 20px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    
    // Aksiyon butonları container
    actionsContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: isMobile ? '8px' : '16px',
    },
    
    // Icon button
    iconButton: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      padding: '8px',
      borderRadius: '8px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      color: '#374151',
      transition: 'background-color 0.2s',
    },
    
    // Badge
    badge: {
      position: 'absolute',
      top: '-2px',
      right: '-2px',
      backgroundColor: '#ef4444',
      color: 'white',
      fontSize: '10px',
      fontWeight: 'bold',
      minWidth: '18px',
      height: '18px',
      borderRadius: '9px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '0 4px',
    },
    
    // Desktop link
    navLink: {
      display: isMobile ? 'none' : 'flex',
      alignItems: 'center',
      gap: '6px',
      textDecoration: 'none',
      color: '#374151',
      fontSize: '14px',
      fontWeight: '500',
      padding: '8px 12px',
      borderRadius: '8px',
      transition: 'background-color 0.2s',
      whiteSpace: 'nowrap',
    },
    
    // User dropdown container
    userDropdownContainer: {
      position: 'relative',
    },
    
    userButton: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      background: 'none',
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      padding: isMobile ? '8px' : '8px 12px',
      cursor: 'pointer',
      color: '#374151',
      fontSize: '14px',
      fontWeight: '500',
    },
    
    dropdown: {
      position: 'absolute',
      top: 'calc(100% + 8px)',
      right: 0,
      backgroundColor: 'white',
      borderRadius: '12px',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
      minWidth: '200px',
      padding: '8px 0',
      zIndex: 1001,
    },
    
    dropdownItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '12px 16px',
      color: '#374151',
      textDecoration: 'none',
      fontSize: '14px',
      cursor: 'pointer',
      border: 'none',
      background: 'none',
      width: '100%',
      textAlign: 'left',
    },
    
    dropdownDivider: {
      height: '1px',
      backgroundColor: '#e5e7eb',
      margin: '8px 0',
    },
    
    // Hamburger menu button
    hamburgerButton: {
      display: isMobile ? 'flex' : 'none',
      flexDirection: 'column',
      gap: '5px',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      padding: '8px',
    },
    
    hamburgerLine: {
      width: '24px',
      height: '3px',
      backgroundColor: '#374151',
      borderRadius: '2px',
      transition: 'all 0.3s',
    },
    
    // Mobile search bar
    mobileSearchContainer: {
      display: showMobileSearch ? 'block' : 'none',
      padding: '0 16px 16px',
      borderTop: '1px solid #e5e7eb',
    },
    
    mobileSearchForm: {
      display: 'flex',
      borderRadius: '8px',
      overflow: 'hidden',
      border: '2px solid #e5e7eb',
    },
    
    // Mobile menu overlay
    mobileMenuOverlay: {
      display: showMobileMenu ? 'block' : 'none',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      zIndex: 999,
    },
    
    // Mobile menu
    mobileMenu: {
      display: showMobileMenu ? 'flex' : 'none',
      flexDirection: 'column',
      position: 'fixed',
      top: 0,
      left: 0,
      bottom: 0,
      width: '280px',
      backgroundColor: 'white',
      zIndex: 1001,
      overflowY: 'auto',
      animation: 'slideIn 0.3s ease',
    },
    
    mobileMenuHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '16px',
      borderBottom: '1px solid #e5e7eb',
    },
    
    mobileMenuCloseButton: {
      background: 'none',
      border: 'none',
      fontSize: '24px',
      cursor: 'pointer',
      color: '#374151',
      padding: '8px',
    },
    
    mobileMenuContent: {
      flex: 1,
      padding: '16px 0',
    },
    
    mobileMenuItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '14px 20px',
      color: '#374151',
      textDecoration: 'none',
      fontSize: '15px',
      fontWeight: '500',
      border: 'none',
      background: 'none',
      width: '100%',
      textAlign: 'left',
      cursor: 'pointer',
    },
    
    mobileMenuSection: {
      padding: '8px 20px',
      fontSize: '12px',
      fontWeight: '600',
      color: '#9ca3af',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
    },
    
    mobileCategoryItem: {
      display: 'block',
      padding: '12px 20px 12px 32px',
      color: '#6b7280',
      textDecoration: 'none',
      fontSize: '14px',
    },
    
    // Kategori barı (desktop)
    categoryBar: {
      display: isMobile ? 'none' : 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '12px 40px',
      maxWidth: '1400px',
      margin: '0 auto',
      borderTop: '1px solid #f3f4f6',
      overflowX: 'auto',
    },
    
    categoryLink: {
      padding: '8px 16px',
      color: '#4b5563',
      textDecoration: 'none',
      fontSize: '14px',
      fontWeight: '500',
      borderRadius: '6px',
      whiteSpace: 'nowrap',
      transition: 'all 0.2s',
    },
    
    // Auth buttons
    authButtons: {
      display: 'flex',
      gap: '8px',
    },
    
    loginButton: {
      padding: isMobile ? '8px 12px' : '10px 20px',
      backgroundColor: 'transparent',
      color: '#2563eb',
      border: '2px solid #2563eb',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      textDecoration: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    
    registerButton: {
      padding: isMobile ? '8px 12px' : '10px 20px',
      backgroundColor: '#2563eb',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      textDecoration: 'none',
      display: isMobile ? 'none' : 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
  };

  // SVG Icons
  const SearchIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="8"/>
      <path d="M21 21l-4.35-4.35"/>
    </svg>
  );

  const HeartIcon = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  );

  const CartIcon = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="9" cy="21" r="1"/>
      <circle cx="20" cy="21" r="1"/>
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
    </svg>
  );

  const UserIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  );

  const MenuIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="3" y1="12" x2="21" y2="12"/>
      <line x1="3" y1="6" x2="21" y2="6"/>
      <line x1="3" y1="18" x2="21" y2="18"/>
    </svg>
  );

  const CloseIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="18" y1="6" x2="6" y2="18"/>
      <line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  );

  const HomeIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
      <polyline points="9,22 9,12 15,12 15,22"/>
    </svg>
  );

  const PackageIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="16.5" y1="9.4" x2="7.5" y2="4.21"/>
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
      <polyline points="3.27,6.96 12,12.01 20.73,6.96"/>
      <line x1="12" y1="22.08" x2="12" y2="12"/>
    </svg>
  );

  const SettingsIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
    </svg>
  );

  const LogoutIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
      <polyline points="16,17 21,12 16,7"/>
      <line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
  );

  const StoreIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
      <path d="M9 22V12h6v10"/>
    </svg>
  );

  const GridIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="7" height="7"/>
      <rect x="14" y="3" width="7" height="7"/>
      <rect x="14" y="14" width="7" height="7"/>
      <rect x="3" y="14" width="7" height="7"/>
    </svg>
  );

  const ChevronDownIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="6,9 12,15 18,9"/>
    </svg>
  );

  return (
    <>
      <style>
        {`
          @keyframes slideIn {
            from {
              transform: translateX(-100%);
            }
            to {
              transform: translateX(0);
            }
          }
          
          .nav-link:hover {
            background-color: #f3f4f6 !important;
          }
          
          .dropdown-item:hover {
            background-color: #f3f4f6 !important;
          }
          
          .category-link:hover {
            background-color: #eff6ff !important;
            color: #2563eb !important;
          }
          
          .mobile-menu-item:hover {
            background-color: #f3f4f6 !important;
          }
          
          .icon-button:hover {
            background-color: #f3f4f6 !important;
          }
          
          .search-form:focus-within {
            border-color: #2563eb !important;
          }
        `}
      </style>
      
      <nav style={styles.navbar}>
        {/* Top Bar */}
        <div style={styles.topBar}>
          {/* Hamburger Menu Button (Mobile) */}
          <button 
            style={styles.hamburgerButton}
            onClick={() => setShowMobileMenu(true)}
            aria-label="Menü"
          >
            <MenuIcon />
          </button>
          
          {/* Logo */}
          <Link to="/" style={styles.logo}>
            <span>🛒</span>
            <span>TicaretSite</span>
          </Link>
          
          {/* Desktop Search */}
          <div style={styles.searchContainer}>
            <form onSubmit={handleSearch} style={styles.searchForm} className="search-form">
              <input
                type="text"
                placeholder="Ürün, kategori veya marka ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={styles.searchInput}
              />
              <button type="submit" style={styles.searchButton}>
                <SearchIcon />
              </button>
            </form>
          </div>
          
          {/* Actions */}
          <div style={styles.actionsContainer}>
            {/* Mobile Search Toggle */}
            {isMobile && (
              <button 
                style={styles.iconButton}
                className="icon-button"
                onClick={() => setShowMobileSearch(!showMobileSearch)}
                aria-label="Ara"
              >
                <SearchIcon />
              </button>
            )}
            
            {/* Favorites */}
            <Link 
              to="/favorites" 
              style={styles.iconButton}
              className="icon-button"
            >
              <HeartIcon />
              {(hasNewFavorites || favorites.length > 0) && (
                <span style={styles.badge}>
                  {favorites.length || '!'}
                </span>
              )}
            </Link>
            
            {/* Cart */}
            <Link 
              to="/cart" 
              style={styles.iconButton}
              className="icon-button"
            >
              <CartIcon />
              {(hasNewCartItems || cartItems.length > 0) && (
                <span style={styles.badge}>
                  {cartItems.length || '!'}
                </span>
              )}
            </Link>
            
            {/* User Section */}
            {user ? (
              <div style={styles.userDropdownContainer} ref={userDropdownRef}>
                <button 
                  style={styles.userButton}
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                >
                  <UserIcon />
                  {!isMobile && <span>{user.name?.split(' ')[0] || 'Hesabım'}</span>}
                  {!isMobile && <ChevronDownIcon />}
                </button>
                
                {showUserDropdown && (
                  <div style={styles.dropdown}>
                    <div style={{ padding: '12px 16px', borderBottom: '1px solid #e5e7eb' }}>
                      <div style={{ fontWeight: '600', color: '#111827' }}>{user.name}</div>
                      <div style={{ fontSize: '13px', color: '#6b7280' }}>{user.email}</div>
                    </div>
                    
                    <Link to="/account" style={styles.dropdownItem} className="dropdown-item">
                      <UserIcon /> Hesabım
                    </Link>
                    <Link to="/orders" style={styles.dropdownItem} className="dropdown-item">
                      <PackageIcon /> Siparişlerim
                    </Link>
                    <Link to="/favorites" style={styles.dropdownItem} className="dropdown-item">
                      <HeartIcon /> Favorilerim
                    </Link>
                    
                    <div style={styles.dropdownDivider} />
                    
                    <button 
                      onClick={handleLogout}
                      style={{ ...styles.dropdownItem, color: '#ef4444' }}
                      className="dropdown-item"
                    >
                      <LogoutIcon /> Çıkış Yap
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div style={styles.authButtons}>
                <Link to="/login" style={styles.loginButton}>
                  Giriş
                </Link>
                <Link to="/register" style={styles.registerButton}>
                  Kayıt Ol
                </Link>
              </div>
            )}
          </div>
        </div>
        
        {/* Mobile Search Bar */}
        <div style={styles.mobileSearchContainer}>
          <form onSubmit={handleSearch} style={styles.mobileSearchForm}>
            <input
              type="text"
              placeholder="Ürün, kategori veya marka ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ ...styles.searchInput, flex: 1 }}
            />
            <button type="submit" style={styles.searchButton}>
              <SearchIcon />
            </button>
          </form>
        </div>
        
        {/* Desktop Category Bar */}
        <div style={styles.categoryBar}>
          <Link 
            to="/categories" 
            style={{ ...styles.categoryLink, backgroundColor: '#2563eb', color: 'white' }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <GridIcon /> Tüm Kategoriler
            </span>
          </Link>
          {categories.slice(0, 8).map((category) => (
            <Link
              key={category.id}
              to={`/category/${category.slug}`}
              style={styles.categoryLink}
              className="category-link"
            >
              {category.name}
            </Link>
          ))}
        </div>
      </nav>
      
      {/* Mobile Menu Overlay */}
      <div 
        style={styles.mobileMenuOverlay}
        onClick={() => setShowMobileMenu(false)}
      />
      
      {/* Mobile Menu */}
      <div style={styles.mobileMenu} ref={mobileMenuRef}>
        <div style={styles.mobileMenuHeader}>
          <Link to="/" style={styles.logo} onClick={() => setShowMobileMenu(false)}>
            <span>🛒</span>
            <span>TicaretSite</span>
          </Link>
          <button 
            style={styles.mobileMenuCloseButton}
            onClick={() => setShowMobileMenu(false)}
          >
            <CloseIcon />
          </button>
        </div>
        
        <div style={styles.mobileMenuContent}>
          {/* User info if logged in */}
          {user && (
            <div style={{ padding: '16px 20px', backgroundColor: '#f9fafb', marginBottom: '8px' }}>
              <div style={{ fontWeight: '600', color: '#111827' }}>{user.name}</div>
              <div style={{ fontSize: '13px', color: '#6b7280' }}>{user.email}</div>
            </div>
          )}
          
          {/* Main navigation */}
          <Link 
            to="/" 
            style={styles.mobileMenuItem}
            className="mobile-menu-item"
            onClick={() => setShowMobileMenu(false)}
          >
            <HomeIcon /> Ana Sayfa
          </Link>
          
          <Link 
            to="/favorites" 
            style={styles.mobileMenuItem}
            className="mobile-menu-item"
            onClick={() => setShowMobileMenu(false)}
          >
            <HeartIcon /> Favorilerim
            {favorites.length > 0 && (
              <span style={{ 
                marginLeft: 'auto', 
                backgroundColor: '#ef4444', 
                color: 'white',
                padding: '2px 8px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: '600'
              }}>
                {favorites.length}
              </span>
            )}
          </Link>
          
          <Link 
            to="/cart" 
            style={styles.mobileMenuItem}
            className="mobile-menu-item"
            onClick={() => setShowMobileMenu(false)}
          >
            <CartIcon /> Sepetim
            {cartItems.length > 0 && (
              <span style={{ 
                marginLeft: 'auto', 
                backgroundColor: '#ef4444', 
                color: 'white',
                padding: '2px 8px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: '600'
              }}>
                {cartItems.length}
              </span>
            )}
          </Link>
          
          {user && (
            <>
              <Link 
                to="/orders" 
                style={styles.mobileMenuItem}
                className="mobile-menu-item"
                onClick={() => setShowMobileMenu(false)}
              >
                <PackageIcon /> Siparişlerim
              </Link>
              
              <Link 
                to="/account" 
                style={styles.mobileMenuItem}
                className="mobile-menu-item"
                onClick={() => setShowMobileMenu(false)}
              >
                <SettingsIcon /> Hesap Ayarları
              </Link>
            </>
          )}
          
          {/* Categories section */}
          <div style={styles.dropdownDivider} />
          <div style={styles.mobileMenuSection}>Kategoriler</div>
          
          <button
            onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
            style={styles.mobileMenuItem}
            className="mobile-menu-item"
          >
            <GridIcon /> Tüm Kategoriler
            <ChevronDownIcon />
          </button>
          
          {showCategoryDropdown && categories.map((category) => (
            <Link
              key={category.id}
              to={`/category/${category.slug}`}
              style={styles.mobileCategoryItem}
              onClick={() => setShowMobileMenu(false)}
            >
              {category.name}
            </Link>
          ))}
          
          {/* Auth section */}
          <div style={styles.dropdownDivider} />
          
          {user ? (
            <button 
              onClick={handleLogout}
              style={{ ...styles.mobileMenuItem, color: '#ef4444' }}
              className="mobile-menu-item"
            >
              <LogoutIcon /> Çıkış Yap
            </button>
          ) : (
            <>
              <Link 
                to="/login" 
                style={styles.mobileMenuItem}
                className="mobile-menu-item"
                onClick={() => setShowMobileMenu(false)}
              >
                <UserIcon /> Giriş Yap
              </Link>
              <Link 
                to="/register" 
                style={{ ...styles.mobileMenuItem, color: '#2563eb' }}
                className="mobile-menu-item"
                onClick={() => setShowMobileMenu(false)}
              >
                <UserIcon /> Kayıt Ol
              </Link>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;
