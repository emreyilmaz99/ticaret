// src/pages/public/VendorStore/components/VendorHeader.jsx
import React, { useState } from 'react';
import { FaStar, FaStore, FaBoxOpen, FaUserPlus, FaCheck, FaShareAlt, FaInfoCircle, FaTimes, FaMapMarkerAlt, FaPhone, FaEnvelope, FaCalendarAlt, FaCopy, FaFacebook, FaTwitter, FaWhatsapp } from 'react-icons/fa';

const VendorHeader = ({ vendor, stats, isMobile }) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const getLogoUrl = () => {
    if (vendor.logo_path) {
      return vendor.logo_path.startsWith('http') 
        ? vendor.logo_path 
        : `http://127.0.0.1:8000/storage/${vendor.logo_path}`;
    }
    return null;
  };

  const getCoverUrl = () => {
    if (vendor.cover_path) {
      return vendor.cover_path.startsWith('http')
        ? vendor.cover_path
        : `http://127.0.0.1:8000/storage/${vendor.cover_path}`;
    }
    return null;
  };

  // Takip Et fonksiyonu
  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    // TODO: API'ye takip isteği gönder
    // apiClient.post(`/v1/vendors/${vendor.slug}/follow`)
  };

  // Paylaş fonksiyonu
  const handleShare = () => {
    setShowShareMenu(!showShareMenu);
  };

  // Linki kopyala
  const copyToClipboard = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    });
  };

  // Sosyal medyada paylaş
  const shareOnSocial = (platform) => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(`${vendor.company_name || vendor.name} mağazasına göz atın!`);
    
    let shareUrl = '';
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${text}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${text}%20${url}`;
        break;
    }
    
    window.open(shareUrl, '_blank', 'width=600,height=400');
    setShowShareMenu(false);
  };

  return (
    <div style={styles.headerWrapper}>
      {/* Cover Image */}
      <div style={{
        ...styles.coverArea,
        backgroundImage: getCoverUrl() ? `url(${getCoverUrl()})` : undefined,
      }}>
        <div style={styles.coverOverlay} />
        
        {/* Header Content */}
        <div style={styles.headerContent}>
          <div style={styles.headerInner}>
            {/* Logo & Info */}
            <div style={styles.vendorInfo}>
              <div style={styles.logoWrapper}>
                {getLogoUrl() ? (
                  <img src={getLogoUrl()} alt={vendor.name} style={styles.logo} />
                ) : (
                  <div style={styles.logoPlaceholder}>
                    <FaStore size={32} color="#94a3b8" />
                  </div>
                )}
              </div>

              <div style={styles.infoContent}>
                <div style={styles.nameRow}>
                  <h1 style={styles.vendorName}>{vendor.company_name || vendor.name}</h1>
                  {vendor.rating_avg >= 4.5 && (
                    <span style={styles.verifiedBadge}>✓ Güvenilir Satıcı</span>
                  )}
                </div>

                {/* Stats Row */}
                <div style={styles.statsRow}>
                  {/* Rating */}
                  <div style={styles.statItem}>
                    <div style={styles.ratingBadge}>
                      <FaStar style={styles.ratingIcon} />
                      <span style={styles.ratingValue}>{vendor.rating_avg?.toFixed(1) || '0.0'}</span>
                    </div>
                    <span style={styles.statLabel}>Puan</span>
                  </div>

                  <div style={styles.statDivider} />

                  {/* Products */}
                  <div style={styles.statItem}>
                    <FaBoxOpen style={styles.statIcon} />
                    <span style={styles.statValue}>{stats?.product_count || 0}</span>
                    <span style={styles.statLabel}>Ürün</span>
                  </div>

                  <div style={styles.statDivider} />

                  {/* Followers */}
                  <div style={styles.statItem}>
                    <span style={styles.statValue}>{stats?.follower_count || 0}</span>
                    <span style={styles.statLabel}>Takipçi</span>
                  </div>

                  <div style={styles.statDivider} />

                  {/* Member Since */}
                  <div style={styles.statItem}>
                    <span style={styles.statValue}>{stats?.member_since || new Date().getFullYear()}</span>
                    <span style={styles.statLabel}>'den beri üye</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div style={styles.actions}>
              <button
                onClick={handleFollow}
                style={{
                  ...styles.followBtn,
                  ...(isFollowing ? styles.followBtnActive : {})
                }}
              >
                {isFollowing ? (
                  <>
                    <FaCheck size={14} />
                    <span>Takip Ediliyor</span>
                  </>
                ) : (
                  <>
                    <FaUserPlus size={14} />
                    <span>Takip Et</span>
                  </>
                )}
              </button>

              {/* Paylaş Butonu */}
              <div style={{ position: 'relative' }}>
                <button 
                  style={styles.iconBtn} 
                  title="Paylaş"
                  onClick={handleShare}
                >
                  <FaShareAlt size={16} />
                </button>
                
                {/* Paylaş Menüsü */}
                {showShareMenu && (
                  <div style={styles.shareMenu}>
                    <button style={styles.shareMenuItem} onClick={copyToClipboard}>
                      <FaCopy size={14} />
                      <span>{copySuccess ? 'Kopyalandı!' : 'Linki Kopyala'}</span>
                    </button>
                    <button style={styles.shareMenuItem} onClick={() => shareOnSocial('whatsapp')}>
                      <FaWhatsapp size={14} style={{ color: '#25D366' }} />
                      <span>WhatsApp</span>
                    </button>
                    <button style={styles.shareMenuItem} onClick={() => shareOnSocial('facebook')}>
                      <FaFacebook size={14} style={{ color: '#1877F2' }} />
                      <span>Facebook</span>
                    </button>
                    <button style={styles.shareMenuItem} onClick={() => shareOnSocial('twitter')}>
                      <FaTwitter size={14} style={{ color: '#1DA1F2' }} />
                      <span>Twitter</span>
                    </button>
                  </div>
                )}
              </div>

              <button 
                style={styles.iconBtn} 
                title="Satıcı Bilgileri"
                onClick={() => setShowInfoModal(true)}
              >
                <FaInfoCircle size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Satıcı Bilgileri Modalı */}
      {showInfoModal && (
        <>
          <div style={styles.modalBackdrop} onClick={() => setShowInfoModal(false)} />
          <div style={styles.infoModal}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>Satıcı Bilgileri</h3>
              <button style={styles.modalCloseBtn} onClick={() => setShowInfoModal(false)}>
                <FaTimes />
              </button>
            </div>
            <div style={styles.modalContent}>
              <div style={styles.modalLogoSection}>
                {getLogoUrl() ? (
                  <img src={getLogoUrl()} alt={vendor.name} style={styles.modalLogo} />
                ) : (
                  <div style={styles.modalLogoPlaceholder}>
                    <FaStore size={40} color="#94a3b8" />
                  </div>
                )}
                <div>
                  <h4 style={styles.modalVendorName}>{vendor.company_name || vendor.name}</h4>
                  <div style={styles.modalRating}>
                    <FaStar style={{ color: '#f59e0b' }} />
                    <span>{vendor.rating_avg?.toFixed(1) || '0.0'}</span>
                    <span style={{ color: '#94a3b8' }}>({vendor.review_count || 0} değerlendirme)</span>
                  </div>
                </div>
              </div>

              <div style={styles.modalInfoList}>
                {vendor.city && (
                  <div style={styles.modalInfoItem}>
                    <FaMapMarkerAlt style={styles.modalInfoIcon} />
                    <span>{vendor.city}, Türkiye</span>
                  </div>
                )}
                <div style={styles.modalInfoItem}>
                  <FaCalendarAlt style={styles.modalInfoIcon} />
                  <span>{stats?.member_since || new Date().getFullYear()} yılından beri üye</span>
                </div>
                <div style={styles.modalInfoItem}>
                  <FaBoxOpen style={styles.modalInfoIcon} />
                  <span>{stats?.product_count || 0} aktif ürün</span>
                </div>
              </div>

              {vendor.description && (
                <div style={styles.modalDescription}>
                  <h5 style={styles.modalSubtitle}>Hakkında</h5>
                  <p style={styles.modalDescText}>{vendor.description}</p>
                </div>
              )}

              <div style={styles.modalStats}>
                <div style={styles.modalStatItem}>
                  <span style={styles.modalStatValue}>{stats?.product_count || 0}</span>
                  <span style={styles.modalStatLabel}>Ürün</span>
                </div>
                <div style={styles.modalStatItem}>
                  <span style={styles.modalStatValue}>{stats?.follower_count || 0}</span>
                  <span style={styles.modalStatLabel}>Takipçi</span>
                </div>
                <div style={styles.modalStatItem}>
                  <span style={styles.modalStatValue}>{vendor.rating_avg?.toFixed(1) || '0.0'}</span>
                  <span style={styles.modalStatLabel}>Puan</span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const styles = {
  headerWrapper: {
    width: '100%',
  },
  coverArea: {
    position: 'relative',
    height: '200px',
    backgroundColor: '#1e293b',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  coverOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.6) 100%)',
  },
  headerContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    transform: 'translateY(50%)',
  },
  headerInner: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '0 24px',
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: '24px',
  },
  vendorInfo: {
    display: 'flex',
    alignItems: 'flex-end',
    gap: '20px',
  },
  logoWrapper: {
    width: '120px',
    height: '120px',
    borderRadius: '16px',
    backgroundColor: '#fff',
    boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
    overflow: 'hidden',
    border: '4px solid #fff',
    flexShrink: 0,
  },
  logo: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  logoPlaceholder: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f1f5f9',
  },
  infoContent: {
    paddingBottom: '8px',
  },
  nameRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '8px',
  },
  vendorName: {
    fontSize: '28px',
    fontWeight: '800',
    color: '#fff',
    margin: 0,
    textShadow: '0 2px 4px rgba(0,0,0,0.2)',
  },
  verifiedBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    padding: '6px 12px',
    backgroundColor: '#059669',
    color: '#fff',
    fontSize: '12px',
    fontWeight: '600',
    borderRadius: '20px',
  },
  statsRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    backgroundColor: 'rgba(255,255,255,0.95)',
    padding: '12px 20px',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  },
  statItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  statDivider: {
    width: '1px',
    height: '24px',
    backgroundColor: '#e2e8f0',
  },
  ratingBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    backgroundColor: '#fef3c7',
    padding: '4px 10px',
    borderRadius: '6px',
  },
  ratingIcon: {
    color: '#f59e0b',
    fontSize: '14px',
  },
  ratingValue: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#92400e',
  },
  statIcon: {
    color: '#64748b',
    fontSize: '14px',
  },
  statValue: {
    fontSize: '15px',
    fontWeight: '700',
    color: '#1e293b',
  },
  statLabel: {
    fontSize: '13px',
    color: '#64748b',
    fontWeight: '500',
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    paddingBottom: '16px',
  },
  followBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 24px',
    backgroundColor: '#ef4444',
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)',
  },
  followBtnActive: {
    backgroundColor: '#10b981',
    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
  },
  iconBtn: {
    width: '44px',
    height: '44px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.95)',
    color: '#475569',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  // Paylaş Menüsü
  shareMenu: {
    position: 'absolute',
    top: '52px',
    right: 0,
    backgroundColor: '#fff',
    borderRadius: '12px',
    boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
    padding: '8px',
    minWidth: '180px',
    zIndex: 100,
  },
  shareMenuItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    width: '100%',
    padding: '10px 14px',
    backgroundColor: 'transparent',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500',
    color: '#1e293b',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  // Modal Stilleri
  modalBackdrop: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 1000,
  },
  infoModal: {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: '#fff',
    borderRadius: '20px',
    width: '90%',
    maxWidth: '480px',
    maxHeight: '90vh',
    overflow: 'auto',
    zIndex: 1001,
    boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
  },
  modalHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '20px 24px',
    borderBottom: '1px solid #e2e8f0',
  },
  modalTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#1e293b',
    margin: 0,
  },
  modalCloseBtn: {
    width: '36px',
    height: '36px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f1f5f9',
    border: 'none',
    borderRadius: '8px',
    color: '#64748b',
    cursor: 'pointer',
    fontSize: '16px',
  },
  modalContent: {
    padding: '24px',
  },
  modalLogoSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    marginBottom: '24px',
  },
  modalLogo: {
    width: '80px',
    height: '80px',
    borderRadius: '16px',
    objectFit: 'cover',
  },
  modalLogoPlaceholder: {
    width: '80px',
    height: '80px',
    borderRadius: '16px',
    backgroundColor: '#f1f5f9',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalVendorName: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#1e293b',
    margin: 0,
    marginBottom: '6px',
  },
  modalRating: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '14px',
    color: '#64748b',
  },
  modalInfoList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginBottom: '24px',
  },
  modalInfoItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    fontSize: '14px',
    color: '#475569',
  },
  modalInfoIcon: {
    fontSize: '16px',
    color: '#059669',
    width: '20px',
  },
  modalDescription: {
    marginBottom: '24px',
  },
  modalSubtitle: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#1e293b',
    margin: 0,
    marginBottom: '8px',
  },
  modalDescText: {
    fontSize: '14px',
    lineHeight: '1.6',
    color: '#64748b',
    margin: 0,
  },
  modalStats: {
    display: 'flex',
    gap: '16px',
    padding: '16px',
    backgroundColor: '#f8fafc',
    borderRadius: '12px',
  },
  modalStatItem: {
    flex: 1,
    textAlign: 'center',
  },
  modalStatValue: {
    display: 'block',
    fontSize: '20px',
    fontWeight: '700',
    color: '#059669',
    marginBottom: '4px',
  },
  modalStatLabel: {
    fontSize: '12px',
    color: '#64748b',
    fontWeight: '500',
  },
};

export default VendorHeader;
