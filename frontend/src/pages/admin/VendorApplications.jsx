import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getApplications, 
  approvePreApplication, 
  approveFullApplication, 
  rejectApplication 
} from '../../features/vendor-application/api/vendorApplicationApi';
import { 
  FaCheck, FaTimes, FaEye, FaSearch, FaFilter 
} from 'react-icons/fa';

// Toast Component (Reused)
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColors = {
    success: '#10b981',
    error: '#ef4444',
    info: '#3b82f6'
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      backgroundColor: bgColors[type] || bgColors.info,
      color: 'white',
      padding: '12px 24px',
      borderRadius: '8px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      zIndex: 2000,
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      animation: 'slideIn 0.3s ease-out'
    }}>
      {type === 'success' && <FaCheck />}
      {type === 'error' && <FaTimes />}
      <span>{message}</span>
    </div>
  );
};

const VendorApplications = () => {
  const queryClient = useQueryClient();
  // Show pre-applications (both pending and approved to track full application waiting)
  const [filters, setFilters] = useState({ type: 'pre_application' });
  const [selectedApp, setSelectedApp] = useState(null); // For Detail Modal
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  // Queries
  const { data, isLoading, error } = useQuery({
    queryKey: ['preApplications', filters],
    queryFn: () => getApplications(filters),
    keepPreviousData: true
  });

  const applications = data?.data?.data?.data || [];
  const meta = data?.data?.data || {}; // pagination info if needed

  // Mutations
  const approvePreMutation = useMutation({
    mutationFn: approvePreApplication,
    onSuccess: (response) => {
      queryClient.invalidateQueries(['preApplications']);
      const app = selectedApp || response?.data;
      const fullAppLink = app?.id ? `${window.location.origin}/vendor/full-application/${app.id}` : '';
      
      setSelectedApp(null);
      showToast('Ön başvuru onaylandı.');
      
      // Admin'e tam başvuru linkini göster
      if (fullAppLink) {
        setTimeout(() => {
          alert(`Ön başvuru onaylandı!\n\nBaşvuru sahibine bu linki gönderin:\n${fullAppLink}\n\n(Gerçek sistemde email otomatik gönderilir)`);
        }, 500);
      }
    },
    onError: (err) => showToast(err.response?.data?.message || 'Hata oluştu', 'error')
  });

  const approveFullMutation = useMutation({
    mutationFn: approveFullApplication,
    onSuccess: () => {
      queryClient.invalidateQueries(['preApplications']);
      queryClient.invalidateQueries(['fullApplications']);
      queryClient.invalidateQueries(['active-vendors']);
      setSelectedApp(null);
      showToast('Satıcı başvurusu onaylandı ve aktif edildi.');
    },
    onError: (err) => showToast(err.response?.data?.message || 'Hata oluştu', 'error')
  });

  const rejectMutation = useMutation({
    mutationFn: ({ id, reason }) => rejectApplication(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries(['preApplications']);
      setRejectModalOpen(false);
      setSelectedApp(null);
      setRejectionReason('');
      showToast('Başvuru reddedildi.');
    },
    onError: (err) => showToast(err.response?.data?.message || 'Hata oluştu', 'error')
  });

  // Handlers
  const handleApprove = (app) => {
    if (window.confirm('Bu başvuruyu onaylamak istediğinize emin misiniz?')) {
      if (app.type === 'pre_application') {
        approvePreMutation.mutate(app.id);
      } else {
        approveFullMutation.mutate(app.id);
      }
    }
  };

  const handleRejectClick = (app) => {
    setSelectedApp(app);
    setRejectModalOpen(true);
  };

  const submitReject = () => {
    if (rejectionReason.length < 10) {
      showToast('Red nedeni en az 10 karakter olmalıdır.', 'error');
      return;
    }
    rejectMutation.mutate({ id: selectedApp.id, reason: rejectionReason });
  };

  // Styles (Inline for consistency)
  const styles = {
    container: { padding: '24px', fontFamily: "'Inter', sans-serif", color: '#1e293b' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' },
    title: { fontSize: '24px', fontWeight: '700', color: '#0f172a', margin: 0 },
    subtitle: { color: '#64748b', marginTop: '4px', fontSize: '14px' },
    filterBar: { display: 'flex', gap: '12px', marginBottom: '24px', background: 'white', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' },
    select: { padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none' },
    tableContainer: { background: '#ffffff', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden', border: '1px solid #e2e8f0' },
    table: { width: '100%', borderCollapse: 'collapse', textAlign: 'left' },
    th: { background: '#f8fafc', padding: '16px', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', color: '#64748b', borderBottom: '1px solid #e2e8f0' },
    td: { padding: '16px', borderBottom: '1px solid #f1f5f9', fontSize: '14px', color: '#334155' },
    badge: { padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: '600', display: 'inline-block' },
    badgePending: { background: '#fef9c3', color: '#854d0e' },
    badgeApproved: { background: '#dcfce7', color: '#166534' },
    badgeRejected: { background: '#fee2e2', color: '#991b1b' },
    actionBtn: { padding: '8px', borderRadius: '6px', border: 'none', cursor: 'pointer', marginLeft: '8px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' },
    btnView: { background: '#eff6ff', color: '#3b82f6' },
    btnApprove: { background: '#f0fdf4', color: '#16a34a' },
    btnReject: { background: '#fef2f2', color: '#ef4444' },
    modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' },
    modalContent: { backgroundColor: 'white', borderRadius: '16px', width: '100%', maxWidth: '600px', display: 'flex', flexDirection: 'column', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', overflow: 'hidden' },
    modalHeader: { padding: '24px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc' },
    modalBody: { padding: '24px' },
    modalFooter: { padding: '16px 24px', borderTop: '1px solid #e2e8f0', background: '#f8fafc', display: 'flex', justifyContent: 'flex-end', gap: '12px' },
    detailGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' },
    detailItem: { marginBottom: '12px' },
    detailLabel: { fontSize: '12px', color: '#64748b', marginBottom: '4px', display: 'block' },
    detailValue: { fontSize: '14px', color: '#0f172a', fontWeight: '500' },
    textarea: { width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '8px', minHeight: '120px', fontSize: '14px', resize: 'vertical', boxSizing: 'border-box' }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'pending': return <span style={{...styles.badge, ...styles.badgePending}}>Bekliyor</span>;
      case 'approved': return <span style={{...styles.badge, ...styles.badgeApproved}}>Onaylandı</span>;
      case 'rejected': return <span style={{...styles.badge, ...styles.badgeRejected}}>Reddedildi</span>;
      default: return <span style={styles.badge}>{status}</span>;
    }
  };

  const getTypeLabel = (type) => {
    return type === 'pre_application' ? 'Ön Başvuru' : 'Tam Başvuru';
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Ön Başvurular</h1>
          <p style={styles.subtitle}>Ön başvuruları inceleyin ve onaylayın. Onaylanan başvurular için tam başvuru linkini başvuru sahibine gönderin.</p>
        </div>
      </div>

      {/* Filtreleri kaldırdık çünkü bu sayfa sadece pending pre-applications gösteriyor */}

      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Tarih</th>
              <th style={styles.th}>Ad Soyad</th>
              <th style={styles.th}>Şirket</th>
              <th style={styles.th}>Email</th>
              <th style={styles.th}>Durum</th>
              <th style={{...styles.th, textAlign: 'right'}}>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan="6" style={{padding: '24px', textAlign: 'center'}}>Yükleniyor...</td></tr>
            ) : applications.length === 0 ? (
              <tr><td colSpan="6" style={{padding: '24px', textAlign: 'center', color: '#94a3b8'}}>Ön başvuru bulunamadı.</td></tr>
            ) : (
              applications.map((app) => (
                <tr key={app.id} style={{borderBottom: '1px solid #f1f5f9'}}>
                  <td style={styles.td}>{new Date(app.created_at).toLocaleDateString('tr-TR')}</td>
                  <td style={styles.td}>
                    <div style={{fontWeight: '500'}}>{app.full_name}</div>
                    <div style={{fontSize: '12px', color: '#64748b'}}>{app.phone || 'Telefon yok'}</div>
                  </td>
                  <td style={styles.td}>{app.company_name || '-'}</td>
                  <td style={styles.td}>{app.email}</td>
                  <td style={styles.td}>{getStatusBadge(app.status)}</td>
                  <td style={{...styles.td, textAlign: 'right'}}>
                    <button 
                      onClick={() => setSelectedApp(app)}
                      style={{...styles.actionBtn, ...styles.btnView}}
                      title="Detay"
                    >
                      <FaEye />
                    </button>
                    {app.status === 'pending' && (
                      <>
                        <button 
                          onClick={() => handleApprove(app)}
                          style={{...styles.actionBtn, ...styles.btnApprove}}
                          title="Onayla"
                        >
                          <FaCheck />
                        </button>
                        <button 
                          onClick={() => handleRejectClick(app)}
                          style={{...styles.actionBtn, ...styles.btnReject}}
                          title="Reddet"
                        >
                          <FaTimes />
                        </button>
                      </>
                    )}
                    {app.status === 'approved' && (
                      <button 
                        onClick={() => {
                          const link = `${window.location.origin}/vendor/full-application/${app.id}`;
                          navigator.clipboard.writeText(link);
                          showToast('Tam başvuru linki kopyalandı!', 'success');
                        }}
                        style={{...styles.actionBtn, background: '#dbeafe', color: '#2563eb'}}
                        title="Tam Başvuru Linkini Kopyala"
                      >
                        📋
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Detail Modal */}
      {selectedApp && !rejectModalOpen && (
        <div style={styles.modalOverlay} onClick={() => setSelectedApp(null)}>
          <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2 style={{margin: 0, fontSize: '18px'}}>Başvuru Detayı #{selectedApp.id}</h2>
              <button onClick={() => setSelectedApp(null)} style={{background: 'none', border: 'none', cursor: 'pointer'}}><FaTimes size={20} /></button>
            </div>
            <div style={styles.modalBody}>
              <div style={styles.detailGrid}>
                <div style={styles.detailItem}>
                  <span style={styles.detailLabel}>Ad Soyad</span>
                  <span style={styles.detailValue}>{selectedApp.full_name}</span>
                </div>
                <div style={styles.detailItem}>
                  <span style={styles.detailLabel}>Email</span>
                  <span style={styles.detailValue}>{selectedApp.email}</span>
                </div>
                <div style={styles.detailItem}>
                  <span style={styles.detailLabel}>Telefon</span>
                  <span style={styles.detailValue}>{selectedApp.phone || '-'}</span>
                </div>
                <div style={styles.detailItem}>
                  <span style={styles.detailLabel}>Şirket Adı</span>
                  <span style={styles.detailValue}>{selectedApp.company_name || '-'}</span>
                </div>
                <div style={styles.detailItem}>
                  <span style={styles.detailLabel}>Başvuru Türü</span>
                  <span style={styles.detailValue}>{getTypeLabel(selectedApp.type)}</span>
                </div>
                <div style={styles.detailItem}>
                  <span style={styles.detailLabel}>Durum</span>
                  <div>{getStatusBadge(selectedApp.status)}</div>
                </div>
                <div style={styles.detailItem}>
                  <span style={styles.detailLabel}>Başvuru Tarihi</span>
                  <span style={styles.detailValue}>{new Date(selectedApp.created_at).toLocaleString('tr-TR')}</span>
                </div>
              </div>

              {selectedApp.status === 'rejected' && (
                <div style={{marginTop: '16px', padding: '12px', background: '#fef2f2', borderRadius: '8px', border: '1px solid #fee2e2'}}>
                  <span style={{...styles.detailLabel, color: '#991b1b'}}>Red Nedeni:</span>
                  <p style={{margin: '4px 0', fontSize: '14px', color: '#7f1d1d'}}>{selectedApp.rejection_reason}</p>
                </div>
              )}

              {selectedApp.status === 'approved' && selectedApp.reviewer && (
                <div style={{marginTop: '16px', padding: '12px', background: '#f0fdf4', borderRadius: '8px', border: '1px solid #dcfce7'}}>
                  <span style={{...styles.detailLabel, color: '#166534'}}>Onaylayan:</span>
                  <p style={{margin: '4px 0', fontSize: '14px', color: '#14532d'}}>
                    {selectedApp.reviewer.name} ({new Date(selectedApp.reviewed_at).toLocaleString('tr-TR')})
                  </p>
                </div>
              )}
            </div>
            <div style={styles.modalFooter}>
              <button onClick={() => setSelectedApp(null)} style={{padding: '10px 20px', borderRadius: '8px', border: '1px solid #cbd5e1', background: 'white', cursor: 'pointer'}}>Kapat</button>
              {selectedApp.status === 'pending' && (
                <>
                  <button 
                    onClick={() => handleRejectClick(selectedApp)}
                    style={{padding: '10px 20px', borderRadius: '8px', border: 'none', background: '#ef4444', color: 'white', cursor: 'pointer'}}
                  >
                    Reddet
                  </button>
                  <button 
                    onClick={() => handleApprove(selectedApp)}
                    style={{padding: '10px 20px', borderRadius: '8px', border: 'none', background: '#16a34a', color: 'white', cursor: 'pointer'}}
                  >
                    Onayla
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {rejectModalOpen && (
        <div style={styles.modalOverlay} onClick={() => setRejectModalOpen(false)}>
          <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2 style={{margin: 0, fontSize: '18px'}}>Başvuruyu Reddet</h2>
              <button onClick={() => setRejectModalOpen(false)} style={{background: 'none', border: 'none', cursor: 'pointer'}}><FaTimes size={20} /></button>
            </div>
            <div style={styles.modalBody}>
              <p style={{marginBottom: '12px', fontSize: '14px', color: '#64748b'}}>
                Lütfen başvuru sahibine iletilecek red nedenini giriniz.
              </p>
              <textarea 
                style={styles.textarea}
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Örn: Şirket belgeleriniz eksik..."
              />
              <div style={{textAlign: 'right', fontSize: '12px', marginTop: '4px', color: rejectionReason.length < 10 ? '#ef4444' : '#64748b'}}>
                {rejectionReason.length} / 1000 (Min 10)
              </div>
            </div>
            <div style={styles.modalFooter}>
              <button onClick={() => setRejectModalOpen(false)} style={{padding: '10px 20px', borderRadius: '8px', border: '1px solid #cbd5e1', background: 'white', cursor: 'pointer'}}>İptal</button>
              <button 
                onClick={submitReject}
                disabled={rejectionReason.length < 10}
                style={{
                  padding: '10px 20px', 
                  borderRadius: '8px', 
                  border: 'none', 
                  background: rejectionReason.length < 10 ? '#fca5a5' : '#ef4444', 
                  color: 'white', 
                  cursor: rejectionReason.length < 10 ? 'not-allowed' : 'pointer'
                }}
              >
                Reddet
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default VendorApplications;
