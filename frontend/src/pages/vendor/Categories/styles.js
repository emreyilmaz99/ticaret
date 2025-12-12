// src/pages/vendor/Categories/styles.js

// Icon mapping
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

export const getIconEmoji = (iconName) => iconMap[iconName] || '📁';

// Convert relative URL to full URL
export const toFullUrl = (url) => {
  if (!url) return null;
  if (url.startsWith('http')) return url;
  return `http://127.0.0.1:8000${url.startsWith('/') ? '' : '/'}${url}`;
};

export const styles = {
  container: { 
    padding: '24px', 
    fontFamily: "'Inter', sans-serif", 
    color: '#1e293b'
  },
  
  // --- Header ---
  header: { 
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '24px',
    background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
    padding: '28px 32px',
    borderRadius: '16px',
    border: '1px solid #e2e8f0',
    flexWrap: 'wrap',
    gap: '16px',
  },
  headerLeft: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
  },
  title: { 
    fontSize: '26px', 
    fontWeight: '800', 
    color: '#0f172a',
    letterSpacing: '-0.02em',
    margin: 0
  },
  subtitle: { 
    color: '#64748b', 
    fontSize: '15px', 
    margin: 0
  },
  saveButton: {
    backgroundColor: '#059669',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '8px',
    fontWeight: '600',
    cursor: 'pointer',
    fontSize: '14px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    transition: 'all 0.2s'
  },
  buttonIcon: {
    fontSize: '16px'
  },

  // --- Info Box ---
  infoBox: {
    backgroundColor: '#eff6ff',
    border: '1px solid #bfdbfe',
    borderRadius: '12px',
    padding: '16px 20px',
    marginBottom: '24px',
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px'
  },
  infoIcon: {
    marginTop: '2px',
    flexShrink: 0,
    color: '#2563eb'
  },
  infoTitle: {
    fontWeight: '600',
    color: '#1e40af',
    marginBottom: '4px'
  },
  infoText: {
    fontSize: '14px',
    color: '#3b82f6',
    lineHeight: '1.5',
    margin: 0
  },

  // --- Stats ---
  statsContainer: {
    display: 'flex',
    gap: '16px',
    marginBottom: '24px',
    flexWrap: 'wrap'
  },
  statCard: {
    flex: 1,
    minWidth: '200px',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
    boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
  },
  statIcon: {
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px'
  },
  statInfo: {
    display: 'flex',
    flexDirection: 'column'
  },
  statValue: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#0f172a',
    lineHeight: '1.2'
  },
  statLabel: {
    fontSize: '14px',
    color: '#64748b',
    fontWeight: '500'
  },

  // --- Main Card ---
  mainCard: {
    backgroundColor: 'white',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
    overflow: 'hidden',
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
  },

  // --- Toolbar ---
  toolbar: { 
    padding: '16px', 
    borderBottom: '1px solid #e2e8f0', 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    gap: '16px',
    flexWrap: 'wrap',
    backgroundColor: '#f8fafc'
  },
  searchContainer: {
    position: 'relative',
    flex: 1,
    maxWidth: '400px'
  },
  searchIcon: {
    position: 'absolute',
    left: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#94a3b8'
  },
  searchInput: { 
    width: '100%',
    padding: '10px 36px', 
    borderRadius: '8px', 
    border: '1px solid #e2e8f0', 
    outline: 'none', 
    fontSize: '14px',
    backgroundColor: 'white'
  },
  clearButton: {
    position: 'absolute',
    right: '10px',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    color: '#94a3b8',
    cursor: 'pointer',
    fontSize: '14px',
    padding: '4px'
  },
  toolbarActions: {
    display: 'flex',
    gap: '12px'
  },
  toolbarButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    backgroundColor: 'white',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    color: '#475569',
    fontSize: '13px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },

  // --- Category List ---
  categoryList: {
    backgroundColor: 'white',
    minHeight: '400px'
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '48px',
    gap: '16px',
    color: '#64748b'
  },
  loadingSpinner: {
    fontSize: '24px',
    animation: 'spin 1s linear infinite',
    color: '#059669'
  },
  emptyContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '64px',
    color: '#64748b'
  },
  emptyIcon: {
    fontSize: '48px',
    color: '#cbd5e1',
    marginBottom: '16px'
  },
  emptyTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: '8px'
  },
  emptyText: {
    fontSize: '14px',
    color: '#64748b'
  },

  // --- Category Item ---
  categoryWrapper: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%'
  },
  categoryItem: {
    display: 'flex',
    alignItems: 'center',
    padding: '12px 16px',
    borderBottom: '1px solid #f1f5f9',
    transition: 'all 0.15s',
    cursor: 'pointer',
    minHeight: '56px'
  },
  expandButton: {
    width: '24px',
    height: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    marginRight: '8px',
    padding: 0,
    color: '#64748b',
    borderRadius: '4px',
    transition: 'background-color 0.2s'
  },
  chevronIcon: {
    fontSize: '12px'
  },
  expandPlaceholder: {
    width: '24px',
    height: '24px',
    marginRight: '8px'
  },
  checkbox: {
    width: '18px',
    height: '18px',
    marginRight: '12px',
    cursor: 'pointer',
    accentColor: '#22c55e'
  },
  categoryIcon: {
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    backgroundColor: '#f1f5f9',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: '12px',
    fontSize: '16px'
  },
  iconEmoji: {
    fontSize: '18px',
    lineHeight: 1
  },
  iconImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    borderRadius: '8px'
  },
  categoryName: {
    flex: 1,
    fontSize: '14px',
    fontWeight: '500',
    color: '#334155'
  },
  childCount: {
    padding: '2px 8px',
    borderRadius: '12px',
    fontSize: '11px',
    fontWeight: '600',
    backgroundColor: '#f1f5f9',
    color: '#64748b',
    marginLeft: '8px'
  },
  childrenContainer: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%'
  }
};
