import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getCommissionPlans, 
  createCommissionPlan, 
  updateCommissionPlan, 
  deleteCommissionPlan,
  setDefaultCommissionPlan,
  toggleActiveCommissionPlan
} from '../../features/commission/api/commissionApi';
import { 
  FaPlus, FaEdit, FaTrash, FaCheck, FaTimes, FaStar, FaToggleOn, FaToggleOff 
} from 'react-icons/fa';

// Simple Toast Component
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

const CommissionPlans = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [toast, setToast] = useState(null); // { message, type }
  const [formData, setFormData] = useState({
    name: '',
    rate: '',
    description: '',
    is_active: true
  });

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  // --- STYLES ---
  const styles = {
    container: {
      padding: '24px',
      fontFamily: "'Inter', sans-serif",
      color: '#1e293b',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '24px',
    },
    title: {
      fontSize: '24px',
      fontWeight: '700',
      color: '#0f172a',
      margin: 0,
    },
    subtitle: {
      color: '#64748b',
      marginTop: '4px',
      fontSize: '14px',
    },
    createBtn: {
      padding: '10px 20px',
      background: '#3b82f6',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontWeight: '500',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      transition: 'background 0.2s',
    },
    tableContainer: {
      background: '#ffffff',
      borderRadius: '12px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)',
      overflow: 'hidden',
      border: '1px solid #e2e8f0',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      textAlign: 'left',
    },
    th: {
      background: '#f8fafc',
      padding: '16px',
      fontSize: '12px',
      fontWeight: '600',
      textTransform: 'uppercase',
      color: '#64748b',
      borderBottom: '1px solid #e2e8f0',
    },
    td: {
      padding: '16px',
      borderBottom: '1px solid #f1f5f9',
      fontSize: '14px',
      color: '#334155',
    },
    row: {
      transition: 'background-color 0.2s',
    },
    actionBtn: {
      padding: '8px',
      borderRadius: '6px',
      border: 'none',
      cursor: 'pointer',
      marginLeft: '8px',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'background 0.2s',
    },
    btnEdit: { background: '#eff6ff', color: '#3b82f6' },
    btnDelete: { background: '#fef2f2', color: '#ef4444' },
    btnDefault: { background: '#fff7ed', color: '#f97316' },
    btnDefaultDisabled: { background: '#f1f5f9', color: '#cbd5e1', cursor: 'not-allowed' },
    btnToggleOn: { background: '#f0fdf4', color: '#16a34a' },
    btnToggleOff: { background: '#fef2f2', color: '#94a3b8' },
    
    // Modal Styles
    modalOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px',
    },
    modalContent: {
      backgroundColor: 'white',
      borderRadius: '16px',
      width: '100%',
      maxWidth: '500px',
      display: 'flex',
      flexDirection: 'column',
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
      overflow: 'hidden',
    },
    modalHeader: {
      padding: '24px',
      borderBottom: '1px solid #e2e8f0',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      background: '#f8fafc',
    },
    modalBody: {
      padding: '24px',
    },
    formGroup: {
      marginBottom: '16px',
    },
    label: {
      display: 'block',
      marginBottom: '8px',
      fontWeight: '500',
      color: '#334155',
      fontSize: '14px',
    },
    input: {
      width: '100%',
      padding: '10px',
      border: '1px solid #cbd5e1',
      borderRadius: '8px',
      fontSize: '14px',
      outline: 'none',
      boxSizing: 'border-box', 
    },
    textarea: {
      width: '100%',
      padding: '10px',
      border: '1px solid #cbd5e1',
      borderRadius: '8px',
      fontSize: '14px',
      outline: 'none',
      minHeight: '80px',
      resize: 'vertical',
      boxSizing: 'border-box',
    },
    modalFooter: {
      padding: '16px 24px',
      borderTop: '1px solid #e2e8f0',
      background: '#f8fafc',
      display: 'flex',
      justifyContent: 'flex-end',
      gap: '12px',
    },
    primaryBtn: {
      padding: '10px 20px',
      background: '#16a34a',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontWeight: '500',
      cursor: 'pointer',
    },
    cancelBtn: {
      padding: '10px 20px',
      background: 'white',
      color: '#64748b',
      border: '1px solid #cbd5e1',
      borderRadius: '8px',
      fontWeight: '500',
      cursor: 'pointer',
    },
    badge: {
      padding: '4px 8px',
      borderRadius: '4px',
      fontSize: '12px',
      fontWeight: '600',
      display: 'inline-block',
    },
    badgeActive: { background: '#dcfce7', color: '#166534' },
    badgeInactive: { background: '#f1f5f9', color: '#64748b' },
    badgeDefault: { background: '#ffedd5', color: '#9a3412', marginLeft: '8px' },
  };

  // Queries
  const { data, isLoading, error } = useQuery({
    queryKey: ['commissionPlans'],
    queryFn: async () => {
      const res = await getCommissionPlans();
      return res.data;
    }
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: createCommissionPlan,
    onSuccess: () => {
      queryClient.invalidateQueries(['commissionPlans']);
      closeModal();
      showToast('Plan başarıyla oluşturuldu.');
    },
    onError: (err) => showToast('Hata: ' + err.message, 'error')
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updateCommissionPlan(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['commissionPlans']);
      closeModal();
      showToast('Plan güncellendi.');
    },
    onError: (err) => showToast('Hata: ' + err.message, 'error')
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCommissionPlan,
    onSuccess: () => {
      queryClient.invalidateQueries(['commissionPlans']);
      showToast('Plan silindi.');
    },
    onError: (err) => showToast('Hata: ' + err.message, 'error')
  });

  const defaultMutation = useMutation({
    mutationFn: setDefaultCommissionPlan,
    onSuccess: () => {
      queryClient.invalidateQueries(['commissionPlans']);
      showToast('Varsayılan plan güncellendi.');
    },
    onError: (err) => showToast('Hata: ' + err.message, 'error')
  });

  const toggleActiveMutation = useMutation({
    mutationFn: toggleActiveCommissionPlan,
    onSuccess: () => {
      queryClient.invalidateQueries(['commissionPlans']);
    },
    onError: (err) => showToast('Hata: ' + err.message, 'error')
  });

  // Handlers
  const handleCreate = () => {
    setEditingPlan(null);
    setFormData({ name: '', rate: '', description: '', is_active: true });
    setIsModalOpen(true);
  };

  const handleEdit = (plan) => {
    setEditingPlan(plan);
    setFormData({
      name: plan.name,
      rate: plan.rate,
      description: plan.description || '',
      is_active: plan.is_active
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Bu planı silmek istediğinize emin misiniz?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingPlan) {
      updateMutation.mutate({ id: editingPlan.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingPlan(null);
  };

  // API'den dönen yapı: { status, success, message, data: { current_page, data: [...], ... } }
  // Bu yüzden data?.data?.data şeklinde erişiyoruz.
  const plans = data?.data?.data || [];

  if (isLoading) return <div style={{ padding: 24 }}>Yükleniyor...</div>;
  if (error) return <div style={{ padding: 24, color: 'red' }}>Hata: {error.message}</div>;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Komisyon Planları</h1>
          <p style={styles.subtitle}>Satıcılar için komisyon oranlarını yönetin.</p>
        </div>
        <button style={styles.createBtn} onClick={handleCreate}>
          <FaPlus /> Yeni Plan Ekle
        </button>
      </div>

      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Plan Adı</th>
              <th style={styles.th}>Oran (%)</th>
              <th style={styles.th}>Açıklama</th>
              <th style={styles.th}>Durum</th>
              <th style={{ ...styles.th, textAlign: 'right' }}>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {plans.length > 0 ? (
              plans.map((plan) => (
                <tr key={plan.id} style={styles.row}>
                  <td style={styles.td}>
                    <span style={{ fontWeight: '500' }}>{plan.name}</span>
                    {plan.is_default && (
                      <span style={{ ...styles.badge, ...styles.badgeDefault }}>
                        <FaStar size={10} style={{ marginRight: 4 }} /> Varsayılan
                      </span>
                    )}
                  </td>
                  <td style={styles.td}>%{plan.rate}</td>
                  <td style={styles.td}>{plan.description || '-'}</td>
                  <td style={styles.td}>
                    <span style={{ ...styles.badge, ...(plan.is_active ? styles.badgeActive : styles.badgeInactive) }}>
                      {plan.is_active ? 'Aktif' : 'Pasif'}
                    </span>
                  </td>
                  <td style={{ ...styles.td, textAlign: 'right' }}>
                    <button 
                      onClick={() => toggleActiveMutation.mutate(plan.id)}
                      style={{ 
                        ...styles.actionBtn, 
                        ...(plan.is_active ? styles.btnToggleOn : styles.btnToggleOff) 
                      }}
                      title={plan.is_active ? 'Pasife Al' : 'Aktife Al'}
                    >
                      {plan.is_active ? <FaToggleOn size={16} /> : <FaToggleOff size={16} />}
                    </button>
                    <button 
                      onClick={() => defaultMutation.mutate(plan.id)}
                      style={{ 
                        ...styles.actionBtn, 
                        ...(plan.is_default ? styles.btnDefaultDisabled : styles.btnDefault) 
                      }}
                      title="Varsayılan Yap"
                      disabled={plan.is_default}
                    >
                      <FaStar size={16} />
                    </button>
                    <button 
                      onClick={() => handleEdit(plan)}
                      style={{ ...styles.actionBtn, ...styles.btnEdit }}
                      title="Düzenle"
                    >
                      <FaEdit size={16} />
                    </button>
                    <button 
                      onClick={() => handleDelete(plan.id)}
                      style={{ ...styles.actionBtn, ...styles.btnDelete }}
                      title="Sil"
                    >
                      <FaTrash size={16} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ padding: '32px', textAlign: 'center', color: '#94a3b8' }}>
                  Henüz komisyon planı eklenmemiş.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <div style={styles.modalHeader}>
              <h2 style={{ margin: 0, fontSize: '18px', color: '#0f172a' }}>
                {editingPlan ? 'Planı Düzenle' : 'Yeni Plan Ekle'}
              </h2>
              <button 
                onClick={closeModal} 
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
              >
                <FaTimes size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div style={styles.modalBody}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Plan Adı</label>
                  <input 
                    type="text" 
                    style={styles.input} 
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Komisyon Oranı (%)</label>
                  <input 
                    type="number" 
                    step="0.01"
                    style={styles.input} 
                    value={formData.rate}
                    onChange={(e) => setFormData({ ...formData, rate: e.target.value })}
                    required
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Açıklama</label>
                  <textarea 
                    style={styles.textarea} 
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input 
                    type="checkbox" 
                    id="isActive"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  />
                  <label htmlFor="isActive" style={{ fontSize: '14px', color: '#334155', cursor: 'pointer' }}>
                    Aktif
                  </label>
                </div>
              </div>
              <div style={styles.modalFooter}>
                <button type="button" onClick={closeModal} style={styles.cancelBtn}>İptal</button>
                <button type="submit" style={styles.primaryBtn}>Kaydet</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}
    </div>
  );
};

export default CommissionPlans;
