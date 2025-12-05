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

export const getStyles = () => ({
  container: { 
    padding: '24px', 
    fontFamily: "'Inter', sans-serif", 
    color: '#1e293b',
    maxWidth: '1200px',
    margin: '0 auto'
  },
  header: { 
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '24px'
  },
  title: { 
    fontSize: '24px', 
    fontWeight: '700', 
    color: '#0f172a',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    margin: 0
  },
  titleIcon: {
    color: '#059669'
  },
  subtitle: { 
    color: '#64748b', 
    fontSize: '14px', 
    marginTop: '8px',
    lineHeight: '1.6'
  },
  
  // Info box
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

  // Stats
  statsContainer: {
    display: 'flex',
    gap: '16px',
    marginBottom: '20px',
    flexWrap: 'wrap'
  },
  statsCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    backgroundColor: 'white',
    padding: '16px 20px',
    borderRadius: '12px',
    border: '1px solid #e2e8f0'
  },
  statsCardWarning: {
    backgroundColor: '#fef3c7',
    borderColor: '#fcd34d'
  },
  statsIcon: {
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  statsIconGreen: {
    backgroundColor: '#dcfce7'
  },
  statsIconBlue: {
    backgroundColor: '#e0f2fe'
  },
  statsValue: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#0f172a'
  },
  statsLabel: {
    fontSize: '13px',
    color: '#64748b'
  },
  warningText: {
    fontSize: '14px',
    color: '#92400e',
    fontWeight: '500'
  },

  // Toolbar
  toolbar: { 
    backgroundColor: 'white', 
    padding: '14px 16px', 
    borderRadius: '12px', 
    marginBottom: '16px', 
    border: '1px solid #e2e8f0', 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    gap: '12px',
    flexWrap: 'wrap'
  },
  searchWrapper: {
    position: 'relative'
  },
  searchIcon: {
    position: 'absolute',
    left: '14px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#94a3b8'
  },
  searchInput: { 
    padding: '10px 16px', 
    paddingLeft: '40px', 
    borderRadius: '8px', 
    border: '1px solid #e2e8f0', 
    width: '300px', 
    outline: 'none', 
    fontSize: '14px' 
  },
  toolbarButtons: {
    display: 'flex',
    gap: '8px'
  },

  // Buttons
  btnSecondary: { 
    backgroundColor: 'white', 
    color: '#64748b', 
    border: '1px solid #e2e8f0', 
    padding: '8px 16px', 
    borderRadius: '8px', 
    fontWeight: '500', 
    cursor: 'pointer',
    fontSize: '13px',
    display: 'flex',
    alignItems: 'center',
    gap: '6px'
  },
  btnPrimary: {
    backgroundColor: '#059669',
    color: 'white',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '8px',
    fontWeight: '600',
    cursor: 'pointer',
    fontSize: '14px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  btnDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed'
  },

  // Category list
  categoryContainer: { 
    backgroundColor: 'white', 
    borderRadius: '12px', 
    border: '1px solid #e2e8f0', 
    overflow: 'hidden',
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
  },
  emptyState: {
    padding: '48px',
    textAlign: 'center',
    color: '#64748b'
  },

  // Category item
  categoryItem: {
    display: 'flex',
    alignItems: 'center',
    padding: '14px 16px',
    borderBottom: '1px solid #e2e8f0',
    transition: 'all 0.15s',
    cursor: 'pointer'
  },
  categoryItemSelected: {
    backgroundColor: '#f0fdf4',
    borderLeft: '3px solid #22c55e'
  },
  categoryItemRoot: {
    backgroundColor: '#f8fafc'
  },
  checkbox: {
    width: '22px',
    height: '22px',
    borderRadius: '6px',
    border: '2px solid #cbd5e1',
    backgroundColor: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: '12px',
    flexShrink: 0,
    transition: 'all 0.15s'
  },
  checkboxSelected: {
    border: '2px solid #22c55e',
    backgroundColor: '#22c55e'
  },
  expandIcon: {
    width: '24px',
    height: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#64748b',
    marginRight: '8px',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  categoryIcon: {
    fontSize: '22px',
    marginRight: '14px',
    display: 'flex',
    alignItems: 'center'
  },
  categoryImage: {
    width: '28px',
    height: '28px',
    borderRadius: '6px',
    objectFit: 'cover'
  },
  categoryName: {
    fontWeight: '600',
    color: '#1e293b',
    fontSize: '15px'
  },
  categoryNameChild: {
    fontWeight: '500',
    fontSize: '14px'
  },
  categoryNameSelected: {
    color: '#166534'
  },
  categoryDescription: {
    fontSize: '12px',
    color: '#64748b',
    marginTop: '2px'
  },
  childrenCount: {
    padding: '4px 10px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '500',
    backgroundColor: '#e0f2fe',
    color: '#0369a1'
  },
  childrenContainer: {
    backgroundColor: '#fafafa'
  }
});

export const styles = getStyles();
