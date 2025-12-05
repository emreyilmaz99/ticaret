// src/pages/admin/Applications/components/VendorDetailModal.jsx
import React from 'react';
import { 
  FaTimes, FaBuilding, FaIdCard, FaUser, FaEnvelope, FaPhone, FaCalendarAlt, FaStore 
} from 'react-icons/fa';
import { styles } from '../styles';

/**
 * Vendor detay modalı
 */
const VendorDetailModal = ({ 
  vendor, 
  onClose, 
  onApprove, 
  onReject,
  showApproveButton = true,
  showRejectButton = false 
}) => {
  if (!vendor) return null;

  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
        <div style={styles.modalHeader}>
          <h2 style={{margin: 0, fontSize: '20px', fontWeight: '700', color: '#064e3b'}}>
            🏪 Satıcı Detayı - {vendor.company_name || vendor.storeName}
          </h2>
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
        <div style={styles.modalBody}>
          <div style={styles.detailGrid}>
            <div style={styles.detailItem}>
              <span style={styles.detailLabel}>
                <FaBuilding size={10} /> Şirket Adı
              </span>
              <span style={styles.detailValue}>
                {vendor.company_name || vendor.storeName || '-'}
              </span>
            </div>
            <div style={styles.detailItem}>
              <span style={styles.detailLabel}>
                <FaIdCard size={10} /> Vergi No
              </span>
              <span style={styles.detailValue}>{vendor.tax_id || '-'}</span>
            </div>
            <div style={styles.detailItem}>
              <span style={styles.detailLabel}>
                <FaUser size={10} /> Yetkili Kişi
              </span>
              <span style={styles.detailValue}>
                {vendor.full_name || vendor.owner}
              </span>
            </div>
            <div style={styles.detailItem}>
              <span style={styles.detailLabel}>
                <FaEnvelope size={10} /> Email
              </span>
              <span style={styles.detailValue}>{vendor.email}</span>
            </div>
            <div style={styles.detailItem}>
              <span style={styles.detailLabel}>
                <FaPhone size={10} /> Telefon
              </span>
              <span style={styles.detailValue}>{vendor.phone || '-'}</span>
            </div>
            <div style={styles.detailItem}>
              <span style={styles.detailLabel}>Satıcı Türü</span>
              <span style={styles.detailValue}>{vendor.merchant_type || '-'}</span>
            </div>
            <div style={styles.detailItem}>
              <span style={styles.detailLabel}>
                <FaCalendarAlt size={10} /> Kayıt Tarihi
              </span>
              <span style={styles.detailValue}>
                {new Date(vendor.created_at).toLocaleString('tr-TR')}
              </span>
            </div>
          </div>

          {/* Banka Bilgileri */}
          {vendor.iban && (
            <div style={{
              marginTop: '20px', 
              padding: '16px', 
              background: '#f0fdf4', 
              borderRadius: '12px', 
              border: '1px solid #dcfce7'
            }}>
              <span style={{
                ...styles.detailLabel, 
                color: '#166534', 
                marginBottom: '12px'
              }}>
                🏦 Banka Bilgileri
              </span>
              <div style={{fontSize: '14px', color: '#14532d'}}>
                <div><strong>Banka:</strong> {vendor.bankName || '-'}</div>
                <div><strong>IBAN:</strong> {vendor.iban}</div>
              </div>
            </div>
          )}
        </div>
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
          
          {showRejectButton && (
            <button 
              onClick={() => onReject(vendor)}
              style={{
                padding: '12px 24px', 
                borderRadius: '10px', 
                border: 'none', 
                background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', 
                color: 'white', 
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '14px',
                boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)'
              }}
            >
              Reddet
            </button>
          )}
          
          {showApproveButton && (
            <button 
              onClick={() => onApprove(vendor)}
              style={{
                padding: '12px 24px', 
                borderRadius: '10px', 
                border: 'none', 
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', 
                color: 'white', 
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '14px',
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
              }}
            >
              Onayla
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default VendorDetailModal;
