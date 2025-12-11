// src/pages/public/Home/styles.js

export const getStyles = (isMobile) => ({
  container: {
    fontFamily: '"Inter", sans-serif',
    backgroundColor: '#f8fafc',
    minHeight: '100vh',
    paddingBottom: '80px',
    position: 'relative',
  },
  hero: {
    background: 'linear-gradient(135deg, #064e3b 0%, #059669 100%)',
    color: 'white',
    padding: isMobile ? '40px 0' : '80px 0',
    marginBottom: isMobile ? '30px' : '60px',
    position: 'relative',
    zIndex: 1,
    borderRadius: isMobile ? '0 0 30px 30px' : '0 0 60px 60px',
    boxShadow: '0 20px 60px -20px rgba(6, 78, 59, 0.5)',
  },
  heroContent: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: isMobile ? '0 16px' : '0 20px',
    display: 'flex',
    flexDirection: isMobile ? 'column' : 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: isMobile ? '24px' : '0',
  },
  heroText: {
    maxWidth: isMobile ? '100%' : '600px',
    textAlign: isMobile ? 'center' : 'left',
  },
  heroTitle: {
    fontFamily: '"DM Sans", sans-serif',
    fontSize: isMobile ? '32px' : '64px',
    fontWeight: '800',
    marginBottom: isMobile ? '16px' : '24px',
    lineHeight: '1.05',
    letterSpacing: isMobile ? '-1px' : '-2px',
  },
  heroSubtitle: {
    fontSize: isMobile ? '16px' : '20px',
    opacity: 0.9,
    marginBottom: isMobile ? '24px' : '40px',
    lineHeight: '1.6',
    fontWeight: '300',
  },
  heroButtons: {
    display: 'flex',
    flexDirection: isMobile ? 'column' : 'row',
    gap: isMobile ? '12px' : '20px',
    alignItems: isMobile ? 'stretch' : 'center',
  },
  heroBtn: {
    backgroundColor: '#ffffff',
    color: '#059669',
    padding: isMobile ? '14px 24px' : '18px 40px',
    borderRadius: '50px',
    fontWeight: '700',
    fontSize: isMobile ? '14px' : '16px',
    border: 'none',
    cursor: 'pointer',
    transition: 'transform 0.2s, box-shadow 0.2s',
    boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
    textDecoration: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
  },
  secondaryButton: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    backdropFilter: 'blur(10px)',
    color: 'white',
    padding: isMobile ? '14px 24px' : '18px 40px',
    borderRadius: '50px',
    fontWeight: '600',
    fontSize: isMobile ? '14px' : '16px',
    border: '1px solid rgba(255,255,255,0.3)',
    cursor: 'pointer',
    transition: 'all 0.2s',
    textDecoration: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
  },
  mainLayout: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: isMobile ? '0 12px' : '0 20px',
    position: 'relative',
    zIndex: 1,
  },
  filterBar: {
    display: 'flex',
    flexDirection: isMobile ? 'column' : 'row',
    flexWrap: isMobile ? 'wrap' : 'nowrap',
    gap: isMobile ? '12px' : '16px',
    alignItems: isMobile ? 'stretch' : 'center',
    backgroundColor: 'white',
    padding: isMobile ? '16px' : '24px 40px',
    borderRadius: isMobile ? '16px' : '24px',
    marginBottom: isMobile ? '24px' : '40px',
    boxShadow: '0 10px 30px -10px rgba(0,0,0,0.05)',
    overflow: 'hidden',
    width: '100%',
    maxWidth: isMobile ? '100%' : '2000px',
    margin: '0 auto 40px auto',
  },
  filterGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    flexWrap: isMobile ? 'wrap' : 'nowrap',
  },
  filterSelect: {
    padding: '10px 16px',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
    outline: 'none',
    fontFamily: 'inherit',
    fontSize: '14px',
    color: '#334155',
    cursor: 'pointer',
    backgroundColor: '#f8fafc',
    flex: isMobile ? 1 : 'none',
    minWidth: isMobile ? '120px' : 'auto',
  },
  filterInput: {
    width: isMobile ? '70px' : '80px',
    padding: '10px',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
    outline: 'none',
    fontFamily: 'inherit',
    fontSize: '14px',
    backgroundColor: '#f8fafc',
  },
  content: {
    width: '100%',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(auto-fill, minmax(260px, 1fr))',
    gap: isMobile ? '12px' : '32px',
  },
  // Stats Section
  statsSection: {
    display: 'grid',
    gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: isMobile ? '12px' : '24px',
    maxWidth: '1000px',
    margin: isMobile ? '0 auto 40px' : '0 auto 80px',
    padding: isMobile ? '0 12px' : '0 20px',
    position: 'relative',
    zIndex: 1,
  },
  statCard: {
    background: 'white',
    borderRadius: isMobile ? '16px' : '20px',
    padding: isMobile ? '20px' : '32px',
    textAlign: 'center',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  },
  statIcon: {
    width: isMobile ? '48px' : '60px',
    height: isMobile ? '48px' : '60px',
    borderRadius: isMobile ? '12px' : '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 16px',
    fontSize: isMobile ? '20px' : '24px',
  },
  statNumber: {
    fontSize: isMobile ? '24px' : '32px',
    fontWeight: '700',
    color: '#064e3b',
    marginBottom: '8px',
  },
  statLabel: {
    fontSize: isMobile ? '12px' : '14px',
    color: '#64748b',
    fontWeight: '500',
  },
  // Popular Categories
  popularCategories: {
    display: 'flex',
    justifyContent: isMobile ? 'flex-start' : 'center',
    gap: isMobile ? '16px' : '32px',
    marginBottom: isMobile ? '30px' : '60px',
    flexWrap: isMobile ? 'nowrap' : 'wrap',
    overflowX: isMobile ? 'auto' : 'visible',
    padding: isMobile ? '0 12px 12px' : '0',
    position: 'relative',
    zIndex: 1,
    WebkitOverflowScrolling: 'touch',
  },
  categoryCircle: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: isMobile ? '8px' : '12px',
    cursor: 'pointer',
    transition: 'transform 0.2s',
    textDecoration: 'none',
    color: '#334155',
    fontWeight: '600',
    fontSize: isMobile ? '12px' : '14px',
    flexShrink: 0,
  },
  catImg: {
    width: isMobile ? '60px' : '80px',
    height: isMobile ? '60px' : '80px',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '3px solid white',
    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
  },
  // Deal Section
  dealSection: {
    background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
    color: 'white',
    padding: isMobile ? '30px 20px' : '80px',
    borderRadius: isMobile ? '24px' : '40px',
    margin: isMobile ? '0 12px 40px' : '0 auto 100px',
    maxWidth: '1200px',
    display: 'flex',
    flexDirection: isMobile ? 'column' : 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'relative',
    overflow: 'hidden',
    zIndex: 1,
    boxShadow: '0 30px 60px -15px rgba(15, 23, 42, 0.4)',
    gap: isMobile ? '24px' : '0',
  },
  // Brand Strip
  brandStrip: {
    padding: '40px 0',
    borderTop: '1px solid #e2e8f0',
    borderBottom: '1px solid #e2e8f0',
    marginBottom: '60px',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    position: 'relative',
    zIndex: 1,
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  brandLogo: {
    display: 'inline-block',
    fontSize: '24px',
    fontWeight: '800',
    color: '#94a3b8',
    margin: '0 40px',
    fontFamily: '"DM Sans", sans-serif',
  },
  // Features Section
  featuresSection: {
    background: 'white',
    padding: isMobile ? '40px 16px' : '80px 20px',
    position: 'relative',
    zIndex: 1,
  },
  sectionTitle: {
    fontFamily: '"DM Sans", sans-serif',
    fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
    fontWeight: '700',
    color: '#064e3b',
    textAlign: 'center',
    marginBottom: '16px',
  },
  sectionSubtitle: {
    fontSize: '16px',
    color: '#64748b',
    textAlign: 'center',
    maxWidth: '600px',
    margin: '0 auto 48px',
  },
  featuresGrid: {
    display: 'grid',
    gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: isMobile ? '16px' : '32px',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  featureCard: {
    padding: isMobile ? '24px' : '32px',
    borderRadius: isMobile ? '16px' : '20px',
    border: '1px solid #e2e8f0',
    transition: 'all 0.3s ease',
    background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
  },
  featureIcon: {
    width: '56px',
    height: '56px',
    borderRadius: '14px',
    background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '24px',
    color: '#047857',
    marginBottom: '20px',
  },
  featureTitle: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: '12px',
  },
  featureDescription: {
    fontSize: '15px',
    color: '#64748b',
    lineHeight: '1.7',
  },
  // CTA Section
  ctaSection: {
    padding: isMobile ? '40px 16px' : '80px 20px',
    textAlign: 'center',
    background: 'linear-gradient(135deg, #064e3b 0%, #047857 100%)',
    color: 'white',
    position: 'relative',
    zIndex: 1,
  },
  ctaTitle: {
    fontFamily: '"DM Sans", sans-serif',
    fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
    fontWeight: '700',
    marginBottom: '16px',
  },
  ctaText: {
    fontSize: '18px',
    opacity: 0.9,
    maxWidth: '600px',
    margin: '0 auto 32px',
  },
  ctaButton: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '10px',
    padding: '18px 36px',
    backgroundColor: 'white',
    color: '#047857',
    borderRadius: '12px',
    textDecoration: 'none',
    fontWeight: '700',
    fontSize: '16px',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 14px rgba(0, 0, 0, 0.2)',
  },
  // Cookie Banner
  cookieBanner: {
    position: 'fixed',
    bottom: '24px',
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: '#1e293b',
    color: 'white',
    padding: isMobile ? '12px 16px' : '16px 24px',
    borderRadius: '12px',
    display: 'flex',
    flexDirection: isMobile ? 'column' : 'row',
    alignItems: isMobile ? 'stretch' : 'center',
    gap: isMobile ? '12px' : '24px',
    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.2)',
    zIndex: 2000,
    maxWidth: '90%',
    width: isMobile ? '95%' : '600px',
  },
  cookieBtn: {
    padding: '8px 20px',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    border: 'none',
  },
});

// Background style for animated background
export const backgroundStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  zIndex: -1,
  background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 50%, #f0fdf4 100%)',
  overflow: 'hidden',
};

// CSS animations
export const cssAnimations = `
  @keyframes float {
    0%, 100% {
      transform: translateY(0) rotate(0deg);
    }
    50% {
      transform: translateY(-20px) rotate(5deg);
    }
  }
  @keyframes scroll {
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }
  @keyframes fadeIn {
    from { opacity: 0; transform: scale(0.9); }
    to { opacity: 1; transform: scale(1); }
  }
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

// Stats data
export const STATS_DATA = [
  { icon: 'FaUsers', number: '50K+', label: 'Mutlu Müşteri', bgGradient: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)', color: '#047857' },
  { icon: 'FaStore', number: '1.2K+', label: 'Aktif Satıcı', bgGradient: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)', color: '#2563eb' },
  { icon: 'FaBox', number: '100K+', label: 'Ürün Çeşidi', bgGradient: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)', color: '#d97706' },
  { icon: 'FaStar', number: '4.9', label: 'Ortalama Puan', bgGradient: 'linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%)', color: '#db2777' },
];

// Features data
export const FEATURES_DATA = [
  { 
    icon: 'FaShieldAlt', 
    title: 'Güvenli Alışveriş', 
    description: '256-bit SSL şifreleme ile tüm işlemleriniz güvende. Ödeme bilgileriniz tamamen korunur.' 
  },
  { 
    icon: 'FaTruck', 
    title: 'Hızlı Teslimat', 
    description: 'Aynı gün kargo ile siparişleriniz hızlıca kapınıza gelsin. Türkiye\'nin her yerine teslimat.' 
  },
  { 
    icon: 'FaStar', 
    title: 'Kalite Garantisi', 
    description: 'Tüm satıcılarımız titizlikle seçilir ve ürün kalitesi sürekli denetlenir.' 
  },
];

// Brands list
export const BRANDS = ['SAMSUNG', 'APPLE', 'NIKE', 'ADIDAS', 'SONY', 'LG', 'PUMA', 'ZARA', 'H&M', 'DYSON', 'BOSCH', 'PHILIPS'];
