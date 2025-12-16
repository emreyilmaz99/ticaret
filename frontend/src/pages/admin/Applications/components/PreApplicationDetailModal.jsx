// src/pages/admin/Applications/components/PreApplicationDetailModal.jsx
import React from 'react';
import { 
  FaTimes, FaUser, FaMapMarkerAlt, FaUniversity, FaStore, 
  FaCalendarAlt, FaInstagram, FaGlobe, FaFilePdf, FaExternalLinkAlt
} from 'react-icons/fa';
import { styles } from '../styles';
import { DetailField, DetailSection } from '../shared/components';
import { formatDate } from '../shared/utils/formatters';

/**
 * Ön Başvuru Detay Modalı
 * Daha detaylı bilgi gösterir: sekmeler, belgeler vs.
 */
const PreApplicationDetailModal = ({ 
  vendor, 
  activeTab,
  setActiveTab,
  adminNote,
  setAdminNote,
  onClose, 
  onApprove, 
  onReject,
  isApproving,
  isRejecting
}) => {
  if (!vendor) return null;

  const tabs = [
    { id: 'general', label: 'Genel Bilgiler', icon: <FaUser size={12} /> },
    { id: 'address', label: 'Adres', icon: <FaMapMarkerAlt size={12} /> },
    { id: 'bank', label: 'Banka', icon: <FaUniversity size={12} /> },
  ];

  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div 
        style={{...styles.modalContent, maxWidth: '800px', maxHeight: '90vh'}} 
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div style={styles.modalHeader}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={styles.storeIcon}>
              <FaStore size={20} />
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: '#064e3b' }}>
                {vendor.storeName || vendor.company_name || 'Mağaza Adı Yok'}
              </h2>
              <span style={{ fontSize: '13px', color: '#6b7280' }}>
                {vendor.owner || vendor.full_name} • ID: {vendor.id}
              </span>
            </div>
          </div>
          <button 
            onClick={onClose} 
            style={{
              background: 'white', 
              border: 'none', 
              cursor: 'pointer', 
              padding: '8px', 
              borderRadius: '8px',
              color: '#6b7280'
            }}
          >
            <FaTimes size={18} />
          </button>
        </div>

        {/* Tabs */}
        <div style={{ 
          display: 'flex', 
          borderBottom: '1px solid #e5e7eb', 
          padding: '0 24px',
          background: '#f9fafb'
        }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '14px 20px',
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: activeTab === tab.id ? '600' : '500',
                color: activeTab === tab.id ? '#059669' : '#6b7280',
                borderBottom: activeTab === tab.id ? '2px solid #059669' : '2px solid transparent',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s'
              }}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Body */}
        <div style={{ 
          ...styles.modalBody, 
          overflowY: 'auto', 
          maxHeight: 'calc(90vh - 250px)' 
        }}>
          {activeTab === 'general' && (
            <div>
              <DetailSection title="Genel Bilgiler" icon={<FaUser />}>
                <div style={styles.detailGrid}>
                  <DetailField label="Mağaza Adı" value={vendor.storeName || '-'} icon={<FaStore size={12} />} />
                  <DetailField label="Yetkili Kişi" value={vendor.owner || vendor.full_name || '-'} icon={<FaUser size={12} />} />
                  <DetailField label="E-posta" value={vendor.email || '-'} />
                  <DetailField label="Telefon" value={vendor.phone || '-'} />
                  <DetailField 
                    label="Kayıt Tarihi" 
                    value={vendor.created_at ? formatDate(vendor.created_at) : '-'} 
                    icon={<FaCalendarAlt size={12} />} 
                  />
                  <DetailField label="Durum" value={getStatusLabel(vendor.status)} />
                </div>
              </DetailSection>

              {/* Sosyal Medya */}
              <div style={{ marginTop: '24px' }}>
                <h4 style={{ 
                  fontSize: '14px', 
                  fontWeight: '600', 
                  color: '#064e3b', 
                  marginBottom: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  Sosyal Medya
                </h4>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  {vendor.instagram && (
                    <SocialLink 
                      href={`https://instagram.com/${vendor.instagram}`} 
                      icon={<FaInstagram />} 
                      label={vendor.instagram}
                      color="#E1306C"
                    />
                  )}
                  {vendor.website && (
                    <SocialLink 
                      href={vendor.website} 
                      icon={<FaGlobe />} 
                      label="Website"
                      color="#059669"
                    />
                  )}
                </div>
                {!vendor.instagram && !vendor.website && (
                  <span style={{ color: '#9ca3af', fontSize: '13px' }}>Sosyal medya bilgisi yok</span>
                )}
              </div>

              {/* Belgeler */}
              {vendor.documents && vendor.documents.length > 0 && (
                <div style={{ marginTop: '24px' }}>
                  <h4 style={{ 
                    fontSize: '14px', 
                    fontWeight: '600', 
                    color: '#064e3b', 
                    marginBottom: '12px'
                  }}>
                    Belgeler
                  </h4>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {vendor.documents.map((doc, idx) => (
                      <a 
                        key={idx}
                        href={doc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '8px 12px',
                          background: '#fee2e2',
                          color: '#dc2626',
                          borderRadius: '8px',
                          fontSize: '12px',
                          textDecoration: 'none'
                        }}
                      >
                        <FaFilePdf /> {doc.name || `Belge ${idx + 1}`}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'address' && (
            <DetailSection title="Adres Bilgileri" icon={<FaMapMarkerAlt />}>
              <div style={styles.detailGrid}>
                <DetailField label="İl" value={vendor.city || '-'} />
                <DetailField label="İlçe" value={vendor.district || '-'} />
              </div>
              <DetailField label="Adres" value={vendor.address || '-'} style={{ marginTop: '16px' }} />
            </DetailSection>
          )}

          {activeTab === 'bank' && (
            <DetailSection title="Banka Bilgileri" icon={<FaUniversity />}>
              <div style={styles.detailGrid}>
                <DetailField label="Banka" value={vendor.bankName || '-'} icon={<FaUniversity size={12} />} />
                <DetailField label="IBAN" value={vendor.iban || '-'} />
                <DetailField label="Hesap Sahibi" value={vendor.accountHolder || '-'} />
              </div>
            </DetailSection>
          )}

          {/* Admin Notu */}
          <div style={{ marginTop: '24px' }}>
            <label style={{ 
              display: 'block', 
              fontSize: '13px', 
              fontWeight: '600', 
              color: '#374151', 
              marginBottom: '8px' 
            }}>
              Admin Notu
            </label>
            <textarea
              value={adminNote}
              onChange={(e) => setAdminNote(e.target.value)}
              placeholder="Satıcı hakkında not ekleyin..."
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '14px',
                minHeight: '80px',
                resize: 'vertical',
                fontFamily: 'inherit'
              }}
            />
          </div>
        </div>

        {/* Footer */}
        <div style={styles.modalFooter}>
          <button 
            onClick={onClose} 
            style={{
              padding: '12px 24px', 
              borderRadius: '10px', 
              border: '2px solid #e5e7eb', 
              background: 'white', 
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '14px',
              color: '#6b7280'
            }}
          >
            Kapat
          </button>
          <button 
            onClick={() => onReject(vendor)}
            disabled={isRejecting}
            style={{
              padding: '12px 24px', 
              borderRadius: '10px', 
              border: 'none', 
              background: 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)', 
              color: 'white', 
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '14px',
              opacity: isRejecting ? 0.7 : 1
            }}
          >
            {isRejecting ? 'Reddediliyor...' : 'Reddet'}
          </button>
          <button 
            onClick={() => onApprove(vendor)}
            disabled={isApproving}
            style={{
              padding: '12px 24px', 
              borderRadius: '10px', 
              border: 'none', 
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', 
              color: 'white', 
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '14px',
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
              opacity: isApproving ? 0.7 : 1
            }}
          >
            {isApproving ? 'Onaylanıyor...' : 'Ön Başvuruyu Onayla'}
          </button>
        </div>
      </div>
    </div>
  );
};

// Helper Components
const SocialLink = ({ href, icon, label, color }) => (
  <a 
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      padding: '8px 12px',
      background: `${color}15`,
      color: color,
      borderRadius: '8px',
      fontSize: '13px',
      textDecoration: 'none',
      fontWeight: '500'
    }}
  >
    {icon} {label} <FaExternalLinkAlt size={10} />
  </a>
);

const getStatusLabel = (status) => {
  const statusMap = {
    'pre_pending': 'Ön Başvuru Bekliyor',
    'pre_approved': 'Ön Başvuru Onaylandı',
    'pending': 'Tam Başvuru Bekliyor',
    'pending_full_approval': 'Aktivasyon Bekliyor',
    'active': 'Aktif',
    'rejected': 'Reddedildi'
  };
  return statusMap[status] || status;
};

export default PreApplicationDetailModal;
