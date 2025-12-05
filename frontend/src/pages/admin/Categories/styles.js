// src/pages/admin/Categories/styles.js

/**
 * Categories sayfası için merkezi stil tanımlamaları
 * Tüm alt bileşenler bu stilleri kullanır
 */
export const getStyles = (isMobile = false) => ({
  // Container stilleri
  container: { 
    padding: isMobile ? '16px' : '24px', 
    fontFamily: "'Inter', sans-serif", 
    color: '#1e293b' 
  },
  
  // Header stilleri
  header: { 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: '24px',
    flexWrap: 'wrap',
    gap: '16px'
  },
  title: { 
    fontSize: isMobile ? '20px' : '24px', 
    fontWeight: '700', 
    color: '#0f172a' 
  },
  subtitle: { 
    color: '#64748b', 
    fontSize: '14px', 
    marginTop: '4px' 
  },

  // Stats kartları
  statsGrid: { 
    display: 'grid', 
    gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(auto-fit, minmax(200px, 1fr))', 
    gap: '16px', 
    marginBottom: '24px' 
  },
  statCard: { 
    backgroundColor: 'white', 
    padding: isMobile ? '16px' : '20px', 
    borderRadius: '12px', 
    border: '1px solid #e2e8f0' 
  },
  statIcon: (bgColor) => ({
    width: '48px', 
    height: '48px', 
    borderRadius: '12px', 
    backgroundColor: bgColor, 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center'
  }),
  statValue: { 
    fontSize: isMobile ? '20px' : '24px', 
    fontWeight: '700', 
    color: '#0f172a' 
  },
  statLabel: { 
    fontSize: '13px', 
    color: '#64748b' 
  },

  // Toolbar stilleri
  toolbar: { 
    backgroundColor: 'white', 
    padding: '16px', 
    borderRadius: '12px', 
    marginBottom: '16px', 
    border: '1px solid #e2e8f0', 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    flexWrap: 'wrap', 
    gap: '12px' 
  },
  searchInput: { 
    padding: '10px 16px', 
    paddingLeft: '40px', 
    borderRadius: '8px', 
    border: '1px solid #e2e8f0', 
    width: isMobile ? '100%' : '300px', 
    outline: 'none', 
    fontSize: '14px' 
  },

  // Tree container
  treeContainer: { 
    backgroundColor: 'white', 
    borderRadius: '12px', 
    border: '1px solid #e2e8f0', 
    overflow: 'hidden' 
  },

  // Buton stilleri
  btnPrimary: { 
    backgroundColor: '#7c3aed', 
    color: 'white', 
    border: 'none', 
    padding: '10px 20px', 
    borderRadius: '8px', 
    fontWeight: '600', 
    cursor: 'pointer', 
    display: 'flex', 
    alignItems: 'center', 
    gap: '8px',
    transition: 'background-color 0.2s'
  },
  btnSecondary: { 
    backgroundColor: 'white', 
    color: '#64748b', 
    border: '1px solid #e2e8f0', 
    padding: '8px 16px', 
    borderRadius: '8px', 
    fontWeight: '500', 
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  btnDanger: {
    backgroundColor: '#dc2626',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '8px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },

  // Category Item stilleri
  categoryItem: (level, isHovered) => ({
    display: 'flex',
    alignItems: 'center',
    padding: '12px 16px',
    paddingLeft: `${16 + level * 24}px`,
    backgroundColor: isHovered ? '#f1f5f9' : (level === 0 ? '#f8fafc' : 'white'),
    borderBottom: '1px solid #e2e8f0',
    transition: 'background-color 0.15s',
  }),
  expandButton: (hasChildren) => ({
    width: '24px',
    height: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: 'none',
    background: 'none',
    cursor: hasChildren ? 'pointer' : 'default',
    color: hasChildren ? '#64748b' : 'transparent',
    marginRight: '8px'
  }),
  categoryIcon: { 
    fontSize: '20px', 
    marginRight: '12px', 
    display: 'flex', 
    alignItems: 'center' 
  },
  categoryImage: { 
    width: '24px', 
    height: '24px', 
    borderRadius: '4px', 
    objectFit: 'cover' 
  },
  categoryName: (level) => ({
    fontWeight: level === 0 ? '600' : '500', 
    color: '#1e293b'
  }),
  categoryMeta: { 
    fontSize: '12px', 
    color: '#64748b', 
    marginTop: '2px' 
  },
  statusBadge: (isActive) => ({
    padding: '4px 8px',
    borderRadius: '12px',
    fontSize: '11px',
    fontWeight: '600',
    backgroundColor: isActive ? '#dcfce7' : '#fee2e2',
    color: isActive ? '#166534' : '#991b1b',
    marginRight: '12px'
  }),
  actionButton: (variant) => {
    const variants = {
      add: { color: '#059669', border: '1px solid #e2e8f0', backgroundColor: 'white' },
      edit: { color: '#2563eb', border: '1px solid #e2e8f0', backgroundColor: 'white' },
      delete: { color: '#dc2626', border: '1px solid #fee2e2', backgroundColor: '#fef2f2' }
    };
    return {
      padding: '6px',
      borderRadius: '6px',
      cursor: 'pointer',
      ...variants[variant]
    };
  },

  // Modal stilleri
  modalOverlay: { 
    position: 'fixed', 
    inset: 0, 
    backgroundColor: 'rgba(0,0,0,0.5)', 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center', 
    zIndex: 1000,
    padding: '20px'
  },
  modalContent: { 
    backgroundColor: 'white', 
    width: '100%', 
    maxWidth: '600px', 
    borderRadius: '16px', 
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' 
  },
  modalHeader: { 
    padding: '20px 24px', 
    borderBottom: '1px solid #e2e8f0', 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center' 
  },
  modalTitle: { 
    fontSize: '18px', 
    fontWeight: '600', 
    color: '#0f172a' 
  },
  modalBody: { 
    padding: '24px', 
    maxHeight: '60vh', 
    overflowY: 'auto' 
  },
  modalFooter: { 
    padding: '16px 24px', 
    borderTop: '1px solid #e2e8f0', 
    display: 'flex', 
    justifyContent: 'flex-end', 
    gap: '12px', 
    backgroundColor: '#f8fafc' 
  },

  // Form stilleri
  formGroup: { 
    marginBottom: '20px' 
  },
  label: { 
    display: 'block', 
    fontSize: '14px', 
    fontWeight: '500', 
    color: '#374151', 
    marginBottom: '6px' 
  },
  input: { 
    width: '100%', 
    padding: '10px 12px', 
    borderRadius: '8px', 
    border: '1px solid #e2e8f0', 
    outline: 'none', 
    fontSize: '14px',
    boxSizing: 'border-box'
  },
  textarea: {
    width: '100%',
    padding: '10px 12px',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    outline: 'none',
    fontSize: '14px',
    minHeight: '80px',
    resize: 'vertical',
    boxSizing: 'border-box'
  },

  // Loading & Empty states
  loadingState: { 
    padding: '40px', 
    textAlign: 'center', 
    color: '#64748b' 
  },
  emptyState: { 
    padding: '40px', 
    textAlign: 'center', 
    color: '#64748b' 
  },

  // Utilities
  flexCenter: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  grid2: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px'
  }
});

// Icon mapping for category icons
export const iconMap = {
  FaMobileAlt: '📱', FaMobile: '📱', FaApple: '🍎', FaLaptop: '💻', FaDesktop: '🖥️',
  FaTabletAlt: '📱', FaMicrochip: '🔧', FaTv: '📺', FaVolumeUp: '🔊', FaHeadphones: '🎧',
  FaCamera: '📷', FaCameraRetro: '📸', FaVideo: '🎥', FaGamepad: '🎮', FaPlaystation: '🎮',
  FaXbox: '🎮', FaTshirt: '👕', FaFemale: '👩', FaMale: '👨', FaChild: '👶', FaBaby: '👶',
  FaShoePrints: '👟', FaRunning: '🏃', FaGem: '💎', FaShoppingBag: '👜', FaClock: '⏰',
  FaGlasses: '👓', FaHome: '🏠', FaCouch: '🛋️', FaBed: '🛏️', FaChair: '🪑', FaArchive: '📦',
  FaPalette: '🎨', FaLightbulb: '💡', FaImage: '🖼️', FaSquare: '⬜', FaUtensils: '🍴',
  FaGlassMartini: '🍸', FaBlender: '🔌', FaBox: '📦', FaBath: '🛁', FaSoap: '🧼',
  FaShower: '🚿', FaLeaf: '🍃', FaSeedling: '🌱', FaDumbbell: '💪', FaSpa: '💆',
  FaBicycle: '🚲', FaFutbol: '⚽', FaBasketballBall: '🏀', FaVolleyballBall: '🏐',
  FaTableTennis: '🏓', FaCampground: '⛺', FaFire: '🔥', FaMountain: '⛰️', FaSwimmer: '🏊',
  FaWater: '💧', FaPaintBrush: '🖌️', FaEye: '👁️', FaKissWinkHeart: '💋', FaHandSparkles: '✨',
  FaTint: '💧', FaSun: '☀️', FaCut: '✂️', FaPumpSoap: '🧴', FaSprayCan: '🧴',
  FaPuzzlePiece: '🧩', FaDog: '🐕', FaBook: '📚', FaBrain: '🧠', FaBookOpen: '📖',
  FaGraduationCap: '🎓', FaMusic: '🎵', FaGuitar: '🎸', FaDrum: '🥁', FaPen: '✒️',
  FaPaperclip: '📎', FaCubes: '🧊', FaCar: '🚗', FaOilCan: '🛢️', FaCogs: '⚙️',
  FaCircle: '⭕', FaSnowflake: '❄️', FaCircleNotch: '⭕', FaMotorcycle: '🏍️', FaHardHat: '⛑️',
  FaPaw: '🐾', FaBone: '🦴', FaFirstAid: '🩹', FaCat: '🐱', FaFish: '🐟', FaDove: '🕊️',
  FaShoppingCart: '🛒', FaBreadSlice: '🍞', FaCookie: '🍪', FaCoffee: '☕', FaBroom: '🧹',
  FaToiletPaper: '🧻', FaScroll: '📜'
};

export const getIconEmoji = (iconName) => {
  return iconMap[iconName] || '📁';
};

// Backend URL helper
const BACKEND_URL = 'http://127.0.0.1:8000';
export const toFullUrl = (u) => {
  if (!u) return null;
  if (u.startsWith('http')) return u;
  return `${BACKEND_URL}${u.startsWith('/') ? '' : '/'}${u}`;
};
