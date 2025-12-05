import React from 'react';
import { styles } from '../styles';

/**
 * Pending approval state screen
 */
export const PendingScreen = ({ vendor }) => {
  return (
    <div style={styles.pendingContainer}>
      <div style={styles.pendingCard}>
        <div style={styles.pendingIcon}>⏳</div>
        <h1 style={styles.pendingTitle}>Hesabınız Onay Bekliyor</h1>
        <p style={styles.pendingText}>
          Tam başvurunuz admin ekibi tarafından inceleniyor. Onaylandığında mağazanız aktifleştirilecektir.
        </p>
      </div>

      <div style={styles.infoGrid}>
        <div style={styles.infoCard}>
          <h4 style={styles.infoTitle}>📋 Mağaza Bilgileriniz</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={styles.infoRow}>
              <span style={styles.infoLabel}>Mağaza / Şirket:</span>
              <span style={styles.infoValue}>{vendor.company_name || '-'}</span>
            </div>
            <div style={styles.infoRow}>
              <span style={styles.infoLabel}>E-posta:</span>
              <span style={styles.infoValue}>{vendor.email || '-'}</span>
            </div>
            <div style={styles.infoRow}>
              <span style={styles.infoLabel}>Telefon:</span>
              <span style={styles.infoValue}>{vendor.phone || '-'}</span>
            </div>
            <div style={styles.infoRow}>
              <span style={styles.infoLabel}>Vergi No:</span>
              <span style={styles.infoValue}>{vendor.tax_id || '-'}</span>
            </div>
          </div>
        </div>

        <div style={styles.infoCard}>
          <h4 style={styles.infoTitle}>📍 Kayıtlı Bilgiler</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={styles.infoRow}>
              <span style={styles.infoLabel}>Adres Sayısı:</span>
              <span style={{ 
                ...styles.infoValue, 
                color: (vendor.addresses || []).length > 0 ? '#059669' : '#ef4444' 
              }}>
                {(vendor.addresses || []).length > 0 
                  ? `${(vendor.addresses || []).length} adres` 
                  : 'Eklenmemiş'}
              </span>
            </div>
            <div style={styles.infoRow}>
              <span style={styles.infoLabel}>Banka Hesabı:</span>
              <span style={{ 
                ...styles.infoValue, 
                color: (vendor.bank_accounts || []).length > 0 ? '#059669' : '#ef4444' 
              }}>
                {(vendor.bank_accounts || []).length > 0 
                  ? `${(vendor.bank_accounts || []).length} hesap` 
                  : 'Eklenmemiş'}
              </span>
            </div>
          </div>
          <p style={{ marginTop: 16, color: '#94a3b8', fontSize: 13 }}>
            Admin onayından sonra ürünlerinizi ekleyebilir ve satışa başlayabilirsiniz.
          </p>
        </div>
      </div>
    </div>
  );
};

/**
 * Banned/Suspended state screen
 */
export const BannedScreen = ({ vendor }) => {
  const isSuspended = vendor.status === 'suspended';
  
  return (
    <div style={styles.pendingContainer}>
      <div style={styles.bannedCard}>
        <div style={styles.pendingIcon}>🚫</div>
        <h1 style={styles.bannedTitle}>
          {isSuspended ? 'Hesabınız Askıya Alındı' : 'Hesabınız Yasaklandı'}
        </h1>
        <p style={styles.bannedText}>
          Detaylı bilgi için lütfen destek ekibi ile iletişime geçin.
        </p>
      </div>
    </div>
  );
};

export default { PendingScreen, BannedScreen };
