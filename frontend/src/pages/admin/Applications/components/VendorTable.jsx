// src/pages/admin/Applications/components/VendorTable.jsx
import React from 'react';
import { FaStore, FaEye, FaCheck, FaTimes, FaPhone, FaUser, FaEnvelope, FaIdCard } from 'react-icons/fa';
import { styles } from '../styles';

/**
 * Vendor/Application tablosu
 */
const VendorTable = ({
  vendors,
  isLoading,
  searchTerm,
  hoveredRow,
  setHoveredRow,
  onView,
  onApprove,
  onReject,
  showMerchantType = true,
  emptyMessage = 'Aktivasyon bekleyen satıcı yok',
  emptySearchMessage = 'Arama kriterlerine uygun satıcı bulunamadı'
}) => {
  if (isLoading) {
    return (
      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}><FaStore style={{ marginRight: '6px' }} />Şirket / Mağaza</th>
              <th style={styles.th}><FaUser style={{ marginRight: '6px' }} />Yetkili</th>
              <th style={styles.th}><FaEnvelope style={{ marginRight: '6px' }} />İletişim</th>
              <th style={styles.th}><FaIdCard style={{ marginRight: '6px' }} />Bilgiler</th>
              <th style={{...styles.th, textAlign: 'right'}}>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan="5" style={styles.emptyState}>
                <div style={{ 
                  margin: '0 auto 12px', 
                  width: '40px', 
                  height: '40px', 
                  border: '4px solid #e5e7eb', 
                  borderTopColor: '#059669', 
                  borderRadius: '50%', 
                  animation: 'spin 1s linear infinite' 
                }} />
                <div>Yükleniyor...</div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div style={styles.tableContainer}>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}><FaStore style={{ marginRight: '6px' }} />Şirket / Mağaza</th>
            <th style={styles.th}><FaUser style={{ marginRight: '6px' }} />Yetkili</th>
            <th style={styles.th}><FaEnvelope style={{ marginRight: '6px' }} />İletişim</th>
            <th style={styles.th}><FaIdCard style={{ marginRight: '6px' }} />Bilgiler</th>
            <th style={{...styles.th, textAlign: 'right'}}>İşlemler</th>
          </tr>
        </thead>
        <tbody>
          {vendors.length === 0 ? (
            <tr>
              <td colSpan="5" style={styles.emptyState}>
                <div style={styles.emptyIcon}>✅</div>
                <div style={{ 
                  fontSize: '16px', 
                  fontWeight: '600', 
                  color: '#6b7280', 
                  marginBottom: '8px' 
                }}>
                  {searchTerm ? emptySearchMessage : emptyMessage}
                </div>
                <div style={{ fontSize: '14px', color: '#9ca3af' }}>
                  {searchTerm ? 'Farklı bir arama terimi deneyin' : 'Tüm satıcılar işlenmiş durumda'}
                </div>
              </td>
            </tr>
          ) : (
            vendors.map((vendor) => (
              <tr 
                key={vendor.id} 
                style={styles.tableRow(hoveredRow === vendor.id)}
                onMouseEnter={() => setHoveredRow(vendor.id)}
                onMouseLeave={() => setHoveredRow(null)}
              >
                <td style={styles.td}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={styles.storeIcon}>
                      <FaStore size={18} />
                    </div>
                    <div>
                      <div style={{ fontWeight: '600', color: '#064e3b' }}>
                        {vendor.company_name || vendor.storeName}
                      </div>
                      <div style={{ fontSize: '12px', color: '#6b7280' }}>ID: {vendor.id}</div>
                    </div>
                  </div>
                </td>
                <td style={styles.td}>
                  <div style={{ fontWeight: '600', color: '#064e3b' }}>
                    {vendor.full_name || vendor.owner}
                  </div>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>
                    {new Date(vendor.created_at).toLocaleDateString('tr-TR')}
                  </div>
                </td>
                <td style={styles.td}>
                  <div style={{ color: '#059669', fontWeight: '500' }}>{vendor.email}</div>
                  <div style={{ 
                    fontSize: '12px', 
                    color: '#6b7280', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '4px' 
                  }}>
                    <FaPhone size={10} /> {vendor.phone || '-'}
                  </div>
                </td>
                <td style={styles.td}>
                  {showMerchantType && (
                    <div style={{ fontSize: '13px' }}>
                      <span style={{ color: '#6b7280' }}>Tür:</span> {vendor.merchant_type || '-'}
                    </div>
                  )}
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>
                    IBAN: {vendor.iban ? '✓ Var' : '✗ Yok'}
                  </div>
                </td>
                <td style={{...styles.td, textAlign: 'right'}}>
                  <button 
                    onClick={() => onView(vendor)}
                    style={{...styles.actionBtn, ...styles.btnView}}
                    title="Detay"
                  >
                    <FaEye />
                  </button>
                  <button 
                    onClick={() => onApprove(vendor)}
                    style={{...styles.actionBtn, ...styles.btnApprove}}
                    title="Onayla"
                  >
                    <FaCheck />
                  </button>
                  <button 
                    onClick={() => onReject(vendor)}
                    style={{...styles.actionBtn, ...styles.btnReject}}
                    title="Reddet"
                  >
                    <FaTimes />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default VendorTable;
