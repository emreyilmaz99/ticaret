import React from 'react';
import { Link } from 'react-router-dom';
import { FaStore, FaShoppingBag, FaTruck, FaShieldAlt, FaArrowRight, FaStar, FaUsers, FaBox } from 'react-icons/fa';

const Home = () => {
  // Animated background style
  const backgroundStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: -1,
    background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 50%, #f0fdf4 100%)',
    overflow: 'hidden',
  };

  // Floating circles for subtle animation
  const FloatingCircle = ({ size, top, left, delay, duration }) => (
    <div
      style={{
        position: 'absolute',
        width: size,
        height: size,
        borderRadius: '50%',
        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.05) 100%)',
        top,
        left,
        animation: `float ${duration}s ease-in-out infinite`,
        animationDelay: `${delay}s`,
      }}
    />
  );

  const styles = {
    container: {
      minHeight: '100vh',
      fontFamily: '"Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, sans-serif',
      color: '#1e293b',
      position: 'relative',
    },
    hero: {
      padding: '80px 20px 100px',
      textAlign: 'center',
      maxWidth: '1200px',
      margin: '0 auto',
    },
    heroTitle: {
      fontFamily: '"Playfair Display", serif',
      fontSize: 'clamp(2.5rem, 5vw, 4rem)',
      fontWeight: '700',
      color: '#064e3b',
      marginBottom: '24px',
      lineHeight: '1.2',
    },
    heroSubtitle: {
      fontSize: 'clamp(1rem, 2vw, 1.25rem)',
      color: '#64748b',
      maxWidth: '600px',
      margin: '0 auto 40px',
      lineHeight: '1.8',
    },
    heroButtons: {
      display: 'flex',
      gap: '16px',
      justifyContent: 'center',
      flexWrap: 'wrap',
    },
    primaryButton: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '10px',
      padding: '16px 32px',
      backgroundColor: '#047857',
      color: 'white',
      borderRadius: '12px',
      textDecoration: 'none',
      fontWeight: '600',
      fontSize: '16px',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 14px rgba(4, 120, 87, 0.4)',
    },
    secondaryButton: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '10px',
      padding: '16px 32px',
      backgroundColor: 'white',
      color: '#047857',
      borderRadius: '12px',
      textDecoration: 'none',
      fontWeight: '600',
      fontSize: '16px',
      border: '2px solid #047857',
      transition: 'all 0.3s ease',
    },
    statsSection: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '24px',
      maxWidth: '1000px',
      margin: '0 auto 80px',
      padding: '0 20px',
    },
    statCard: {
      background: 'white',
      borderRadius: '20px',
      padding: '32px',
      textAlign: 'center',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    },
    statIcon: {
      width: '60px',
      height: '60px',
      borderRadius: '16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto 16px',
      fontSize: '24px',
    },
    statNumber: {
      fontSize: '32px',
      fontWeight: '700',
      color: '#064e3b',
      marginBottom: '8px',
    },
    statLabel: {
      fontSize: '14px',
      color: '#64748b',
      fontWeight: '500',
    },
    featuresSection: {
      background: 'white',
      padding: '80px 20px',
    },
    sectionTitle: {
      fontFamily: '"Playfair Display", serif',
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
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: '32px',
      maxWidth: '1200px',
      margin: '0 auto',
    },
    featureCard: {
      padding: '32px',
      borderRadius: '20px',
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
    ctaSection: {
      padding: '80px 20px',
      textAlign: 'center',
      background: 'linear-gradient(135deg, #064e3b 0%, #047857 100%)',
      color: 'white',
    },
    ctaTitle: {
      fontFamily: '"Playfair Display", serif',
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
    footer: {
      background: '#0f172a',
      color: 'white',
      padding: '40px 20px',
      textAlign: 'center',
    },
    footerText: {
      fontSize: '14px',
      opacity: 0.7,
    },
  };

  return (
    <div style={styles.container}>
      {/* Animated Background */}
      <div style={backgroundStyle}>
        <FloatingCircle size="300px" top="10%" left="5%" delay={0} duration={8} />
        <FloatingCircle size="200px" top="60%" left="80%" delay={2} duration={10} />
        <FloatingCircle size="150px" top="30%" left="70%" delay={4} duration={7} />
        <FloatingCircle size="250px" top="70%" left="20%" delay={1} duration={9} />
        <FloatingCircle size="180px" top="5%" left="60%" delay={3} duration={11} />
      </div>

      {/* Hero Section */}
      <section style={styles.hero}>
        <h1 style={styles.heroTitle}>
          Türkiye'nin En Güvenilir<br />
          <span style={{ color: '#10b981' }}>E-Ticaret Platformu</span>
        </h1>
        <p style={styles.heroSubtitle}>
          Binlerce satıcı ve milyonlarca ürün ile alışverişin keyfini çıkarın. 
          Güvenli ödeme, hızlı teslimat ve müşteri memnuniyeti garantisi ile hizmetinizdeyiz.
        </p>
        <div style={styles.heroButtons}>
          <Link to="/products" style={styles.primaryButton}>
            <FaShoppingBag /> Alışverişe Başla
          </Link>
          <Link to="/vendor/register" style={styles.secondaryButton}>
            <FaStore /> Satıcı Ol
          </Link>
        </div>
      </section>

      {/* Stats Section */}
      <section style={styles.statsSection}>
        <div style={styles.statCard}>
          <div style={{ ...styles.statIcon, background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)', color: '#047857' }}>
            <FaUsers />
          </div>
          <div style={styles.statNumber}>50K+</div>
          <div style={styles.statLabel}>Mutlu Müşteri</div>
        </div>
        <div style={styles.statCard}>
          <div style={{ ...styles.statIcon, background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)', color: '#2563eb' }}>
            <FaStore />
          </div>
          <div style={styles.statNumber}>1.2K+</div>
          <div style={styles.statLabel}>Aktif Satıcı</div>
        </div>
        <div style={styles.statCard}>
          <div style={{ ...styles.statIcon, background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)', color: '#d97706' }}>
            <FaBox />
          </div>
          <div style={styles.statNumber}>100K+</div>
          <div style={styles.statLabel}>Ürün Çeşidi</div>
        </div>
        <div style={styles.statCard}>
          <div style={{ ...styles.statIcon, background: 'linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%)', color: '#db2777' }}>
            <FaStar />
          </div>
          <div style={styles.statNumber}>4.9</div>
          <div style={styles.statLabel}>Ortalama Puan</div>
        </div>
      </section>

      {/* Features Section */}
      <section style={styles.featuresSection}>
        <h2 style={styles.sectionTitle}>Neden Bizi Tercih Etmelisiniz?</h2>
        <p style={styles.sectionSubtitle}>
          Alışveriş deneyiminizi en üst seviyeye çıkarmak için sürekli çalışıyoruz.
        </p>
        <div style={styles.featuresGrid}>
          <div style={styles.featureCard}>
            <div style={styles.featureIcon}>
              <FaShieldAlt />
            </div>
            <h3 style={styles.featureTitle}>Güvenli Alışveriş</h3>
            <p style={styles.featureDescription}>
              256-bit SSL şifreleme ile tüm işlemleriniz güvende. Ödeme bilgileriniz tamamen korunur.
            </p>
          </div>
          <div style={styles.featureCard}>
            <div style={styles.featureIcon}>
              <FaTruck />
            </div>
            <h3 style={styles.featureTitle}>Hızlı Teslimat</h3>
            <p style={styles.featureDescription}>
              Aynı gün kargo ile siparişleriniz hızlıca kapınıza gelsin. Türkiye'nin her yerine teslimat.
            </p>
          </div>
          <div style={styles.featureCard}>
            <div style={styles.featureIcon}>
              <FaStar />
            </div>
            <h3 style={styles.featureTitle}>Kalite Garantisi</h3>
            <p style={styles.featureDescription}>
              Tüm satıcılarımız titizlikle seçilir ve ürün kalitesi sürekli denetlenir.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={styles.ctaSection}>
        <h2 style={styles.ctaTitle}>Satıcı Olmak İster misiniz?</h2>
        <p style={styles.ctaText}>
          Ürünlerinizi milyonlarca müşteriye ulaştırın. Hemen başvurun, satışa başlayın!
        </p>
        <Link to="/vendor/register" style={styles.ctaButton}>
          <FaStore /> Hemen Başvur <FaArrowRight />
        </Link>
      </section>

      {/* Footer */}
      <footer style={styles.footer}>
        <p style={styles.footerText}>
          © 2025 E-Ticaret. Tüm hakları saklıdır.
        </p>
      </footer>

      {/* CSS Animations */}
      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(5deg);
          }
        }
        
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap');
      `}</style>
    </div>
  );
};

export default Home;