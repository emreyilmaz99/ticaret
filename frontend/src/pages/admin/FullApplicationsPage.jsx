import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getApplications, 
  approveFullApplication, 
  rejectApplication 
} from '../../features/vendor-application/api/vendorApplicationApi';
import { 
  FaCheck, FaTimes, FaEye, FaSearch, FaFilter, FaStore 
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

const FullApplicationsPage = () => {
  const queryClient = useQueryClient();
  // STRICT FILTER: Only show pending FULL applications
  const [filters, setFilters] = useState({ status: 'pending', type: 'full_application' });
  const [selectedApp, setSelectedApp] = useState(null); 
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  // Queries
  const { data, isLoading, error } = useQuery({
    queryKey: ['fullApplications', filters],
    queryFn: () => getApplications(filters),
    keepPreviousData: true
  });

  const applications = data?.data?.data?.data || [];

  // Mutations
  const approveFullMutation = useMutation({
    mutationFn: approveFullApplication,
    onSuccess: () => {
      queryClient.invalidateQueries(['fullApplications']);
      queryClient.invalidateQueries(['active-vendors']); // Also refresh active vendors list
      setSelectedApp(null);
      showToast('Satıcı başvurusu onaylandı ve aktif edildi.');
    },
    onError: (err) => showToast(err.response?.data?.message || 'Hata oluştu', 'error')
  });

  const rejectMutation = useMutation({
    mutationFn: ({ id, reason }) => rejectApplication(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries(['fullApplications']);
      setRejectModalOpen(false);
      setSelectedApp(null);
      setRejectionReason('');
      showToast('Başvuru reddedildi.', 'info');
    },
    onError: (err) => showToast(err.response?.data?.message || 'Hata oluştu', 'error')
  });

  if (isLoading) return <div>Yükleniyor...</div>;

  return (
    <div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: '700', color: 'var(--text-main)' }}>Satıcı Başvuruları</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '4px' }}>Tam başvurularını tamamlayan satıcıları inceleyin ve onaylayın.</p>
        </div>
      </div>

      <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
            <tr>
              <th style={{ padding: '16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase' }}>Şirket / Mağaza</th>
              <th style={{ padding: '16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase' }}>Yetkili</th>
              <th style={{ padding: '16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase' }}>İletişim</th>
              <th style={{ padding: '16px', textAlign: 'right', fontSize: '12px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase' }}>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {applications.length === 0 ? (
              <tr>
                <td colSpan="4" style={{ padding: '32px', textAlign: 'center', color: '#94a3b8' }}>
                  Bekleyen tam başvuru bulunmamaktadır.
                </td>
              </tr>
            ) : (
              applications.map((app) => (
                <tr key={app.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '40px', height: '40px', backgroundColor: '#e0e7ff', color: '#4f46e5', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <FaStore />
                      </div>
                      <div>
                        <div style={{ fontWeight: '600', color: '#1e293b' }}>{app.company_name}</div>
                        <div style={{ fontSize: '12px', color: '#64748b' }}>Vergi No: {app.tax_id || '-'}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <div style={{ fontWeight: '500', color: '#1e293b' }}>{app.full_name}</div>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <div style={{ fontSize: '14px', color: '#1e293b' }}>{app.email}</div>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>{app.phone}</div>
                  </td>
                  <td style={{ padding: '16px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                      <button 
                        onClick={() => {
                            if(confirm('Bu satıcı başvurusunu onaylamak ve hesabı aktifleştirmek istiyor musunuz?')) {
                                approveFullMutation.mutate(app.id);
                            }
                        }}
                        style={{ padding: '8px 12px', backgroundColor: '#dcfce7', color: '#166534', border: '1px solid #bbf7d0', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: '500' }}
                      >
                        <FaCheck /> Onayla
                      </button>
                      <button 
                        onClick={() => {
                            setSelectedApp(app);
                            setRejectModalOpen(true);
                        }}
                        style={{ padding: '8px 12px', backgroundColor: '#fee2e2', color: '#991b1b', border: '1px solid #fecaca', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: '500' }}
                      >
                        <FaTimes /> Reddet
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Reject Modal */}
      {rejectModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 3000 }}>
          <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', width: '400px', maxWidth: '90%' }}>
            <h3 style={{ marginTop: 0, marginBottom: '16px', color: '#1e293b' }}>Başvuruyu Reddet</h3>
            <textarea 
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Reddetme sebebi..."
              style={{ width: '100%', height: '100px', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '16px', resize: 'none' }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button onClick={() => setRejectModalOpen(false)} style={{ padding: '8px 16px', borderRadius: '6px', border: '1px solid #e2e8f0', backgroundColor: 'white', cursor: 'pointer' }}>İptal</button>
              <button 
                onClick={() => rejectMutation.mutate({ id: selectedApp.id, reason: rejectionReason })}
                disabled={!rejectionReason}
                style={{ padding: '8px 16px', borderRadius: '6px', border: 'none', backgroundColor: '#ef4444', color: 'white', cursor: 'pointer', opacity: !rejectionReason ? 0.5 : 1 }}
              >
                Reddet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FullApplicationsPage;
