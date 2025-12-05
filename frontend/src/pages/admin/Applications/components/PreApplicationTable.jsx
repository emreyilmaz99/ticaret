// src/pages/admin/Applications/components/PreApplicationTable.jsx
import React from 'react';
import { FaUser, FaEnvelope, FaCalendarAlt, FaEye, FaCheck, FaTimes, FaCopy, FaPhone } from 'react-icons/fa';
import { styles } from '../styles';

/**
 * Pre Application tablosu
 */
const PreApplicationTable = ({
  applications,
  isLoading,
  searchTerm,
  hoveredRow,
  setHoveredRow,
  onView,
  onApprove,
  onReject,
  onCopyEmail
}) => {
  const getStatusBadge = (status) => {
    const badgeStyles = {
      pending: { background: '#fef3c7', color: '#92400e' },
      approved: { background: '#d1fae5', color: '#065f46' },
      rejected: { background: '#fee2e2', color: '#991b1b' }
    };
    const labels = {
      pending: 'Beklemede',
      approved: 'Onaylandı',
      rejected: 'Reddedildi'
    };

    return (
      <span style={{ 
        ...styles.badge, 
        ...badgeStyles[status] 
      }}>
        {status === 'pending' && '⏳'}
        {status === 'approved' && '✓'}
        {status === 'rejected' && '✗'}
        {labels[status] || status}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Başvuru Sahibi</th>
              <th style={styles.th}>İletişim</th>
              <th style={styles.th}>Şirket</th>
              <th style={styles.th}>Tarih</th>
              <th style={styles.th}>Durum</th>
              <th style={{...styles.th, textAlign: 'right'}}>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan="6" style={styles.emptyState}>
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
            <th style={styles.th}><FaUser style={{ marginRight: '6px' }} />Başvuru Sahibi</th>
            <th style={styles.th}><FaEnvelope style={{ marginRight: '6px' }} />İletişim</th>
            <th style={styles.th}>Şirket</th>
            <th style={styles.th}><FaCalendarAlt style={{ marginRight: '6px' }} />Tarih</th>
            <th style={styles.th}>Durum</th>
            <th style={{...styles.th, textAlign: 'right'}}>İşlemler</th>
          </tr>
        </thead>
        <tbody>
          {applications.length === 0 ? (
            <tr>
              <td colSpan="6" style={styles.emptyState}>
                <div style={styles.emptyIcon}>📋</div>
                <div style={{ fontSize: '16px', fontWeight: '600', color: '#6b7280', marginBottom: '8px' }}>
                  {searchTerm ? 'Arama kriterlerine uygun başvuru bulunamadı' : 'Henüz ön başvuru yok'}
                </div>
                <div style={{ fontSize: '14px', color: '#9ca3af' }}>
                  {searchTerm ? 'Farklı bir arama terimi deneyin' : 'Yeni başvurular burada görünecek'}
                </div>
              </td>
            </tr>
          ) : (
            applications.map((app) => (
              <tr 
                key={app.id} 
                style={styles.tableRow(hoveredRow === app.id)}
                onMouseEnter={() => setHoveredRow(app.id)}
                onMouseLeave={() => setHoveredRow(null)}
              >
                <td style={styles.td}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontWeight: '700',
                      fontSize: '14px'
                    }}>
                      {app.full_name?.charAt(0)?.toUpperCase() || '?'}
                    </div>
                    <div>
                      <div style={{ fontWeight: '600', color: '#064e3b' }}>{app.full_name}</div>
                      <div style={{ fontSize: '12px', color: '#6b7280' }}>ID: {app.id}</div>
                    </div>
                  </div>
                </td>
                <td style={styles.td}>
                  <div style={{ color: '#059669', fontWeight: '500' }}>{app.email}</div>
                  <div style={{ fontSize: '12px', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <FaPhone size={10} /> {app.phone || '-'}
                  </div>
                </td>
                <td style={styles.td}>
                  <div style={{ fontWeight: '500', color: '#374151' }}>{app.company_name || '-'}</div>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>{app.merchant_type || '-'}</div>
                </td>
                <td style={styles.td}>
                  <div style={{ fontSize: '13px', color: '#374151' }}>
                    {new Date(app.created_at).toLocaleDateString('tr-TR')}
                  </div>
                  <div style={{ fontSize: '11px', color: '#9ca3af' }}>
                    {new Date(app.created_at).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </td>
                <td style={styles.td}>
                  {getStatusBadge(app.status)}
                </td>
                <td style={{...styles.td, textAlign: 'right'}}>
                  <button 
                    onClick={() => onView(app)}
                    style={{...styles.actionBtn, ...styles.btnView}}
                    title="Detay"
                  >
                    <FaEye />
                  </button>
                  {onCopyEmail && (
                    <button 
                      onClick={() => onCopyEmail(app.email)}
                      style={{...styles.actionBtn, ...styles.btnCopy}}
                      title="E-posta Kopyala"
                    >
                      <FaCopy />
                    </button>
                  )}
                  {app.status === 'pending' && (
                    <>
                      <button 
                        onClick={() => onApprove(app)}
                        style={{...styles.actionBtn, ...styles.btnApprove}}
                        title="Onayla"
                      >
                        <FaCheck />
                      </button>
                      <button 
                        onClick={() => onReject(app)}
                        style={{...styles.actionBtn, ...styles.btnReject}}
                        title="Reddet"
                      >
                        <FaTimes />
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PreApplicationTable;
