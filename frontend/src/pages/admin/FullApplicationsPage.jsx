import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getApplications, 
  approveFullApplication, 
  rejectApplication 
} from '../../features/vendor-application/api/vendorApplicationApi';
import { getActiveCommissionPlans } from '../../features/commission/api/commissionApi';
import { useToast } from '../../components/Toast';
import { 
  FaCheck, FaTimes, FaEye, FaSearch, FaStore, FaCalendarAlt, FaEnvelope, FaPhone, FaBuilding, FaClock, FaUser, FaIdCard, FaPercent, FaStar
} from 'react-icons/fa';

const FullApplicationsPage = () => {
  const queryClient = useQueryClient();
  const toast = useToast();
  const [filters, setFilters] = useState({ type: 'full_application' });
  const [selectedApp, setSelectedApp] = useState(null); 
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [approveModalOpen, setApproveModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [selectedCommissionPlan, setSelectedCommissionPlan] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [hoveredRow, setHoveredRow] = useState(null);

  // Queries
  const { data, isLoading, error } = useQuery({
    queryKey: ['fullApplications', filters],
    queryFn: () => getApplications(filters),
    keepPreviousData: true
  });

  // Komisyon planlarını getir
  const { data: commissionPlansData } = useQuery({
    queryKey: ['activeCommissionPlans'],
    queryFn: getActiveCommissionPlans,
  });

  const commissionPlans = commissionPlansData?.data?.data || [];
  const applications = data?.data?.data?.data || [];

  // Filtrelenmiş başvurular
  const filteredApplications = useMemo(() => {
    let result = applications;
    
    // Durum filtresi
    if (statusFilter !== 'all') {
      result = result.filter(app => app.status === statusFilter);
    }
    
    // Arama filtresi
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(app => 
        app.full_name?.toLowerCase().includes(term) ||
        app.email?.toLowerCase().includes(term) ||
        app.company_name?.toLowerCase().includes(term) ||
        app.phone?.includes(term) ||
        app.tax_id?.includes(term)
      );
    }
    
    return result;
  }, [applications, searchTerm, statusFilter]);

  // İstatistikler
  const stats = useMemo(() => ({
    total: applications.length,
    pending: applications.filter(a => a.status === 'pending').length,
    approved: applications.filter(a => a.status === 'approved').length,
    rejected: applications.filter(a => a.status === 'rejected').length,
  }), [applications]);

  // Mutations
  const approveFullMutation = useMutation({
    mutationFn: ({ id, commissionPlanId }) => approveFullApplication(id, commissionPlanId),
    onSuccess: () => {
      queryClient.invalidateQueries(['fullApplications']);
      queryClient.invalidateQueries(['active-vendors']);
      setSelectedApp(null);
      setApproveModalOpen(false);
      setSelectedCommissionPlan(null);
      toast.success('Başarılı', 'Satıcı başvurusu onaylandı ve aktif edildi.');
    },
    onError: (err) => toast.error('Hata', err.response?.data?.message || 'Hata oluştu')
  });

  const rejectMutation = useMutation({
    mutationFn: ({ id, reason }) => rejectApplication(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries(['fullApplications']);
      setRejectModalOpen(false);
      setSelectedApp(null);
      setRejectionReason('');
      toast.info('Bilgi', 'Başvuru reddedildi.');
    },
    onError: (err) => toast.error('Hata', err.response?.data?.message || 'Hata oluştu')
  });

  const handleApproveClick = (app) => {
    setSelectedApp(app);
    // Varsayılan planı seç
    const defaultPlan = commissionPlans.find(p => p.is_default);
    setSelectedCommissionPlan(defaultPlan?.id || null);
    setApproveModalOpen(true);
  };

  const handleRejectClick = (app) => {
    setSelectedApp(app);
    setRejectionReason('');
    setRejectModalOpen(true);
  };

  const submitApprove = () => {
    if (!selectedCommissionPlan) {
      toast.warning('Uyarı', 'Lütfen bir komisyon planı seçin.');
      return;
    }
    approveFullMutation.mutate({ id: selectedApp.id, commissionPlanId: selectedCommissionPlan });
  };

  const submitReject = () => {
    if (rejectionReason.length < 10) {
      toast.warning('Uyarı', 'Red nedeni en az 10 karakter olmalıdır.');
      return;
    }
    rejectMutation.mutate({ id: selectedApp.id, reason: rejectionReason });
  };

  // Yeşil tema stilleri
  const styles = {
    container: { 
      padding: '32px', 
      fontFamily: "'Plus Jakarta Sans', sans-serif", 
      color: '#064e3b',
      minHeight: '100vh',
    },
    header: { 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'flex-start', 
      marginBottom: '32px' 
    },
    title: { 
      fontSize: '28px', 
      fontWeight: '800', 
      color: '#064e3b', 
      margin: 0,
      letterSpacing: '-0.5px'
    },
    subtitle: { 
      color: '#6b7280', 
      marginTop: '8px', 
      fontSize: '14px',
      lineHeight: '1.5'
    },
    statsContainer: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: '16px',
      marginBottom: '24px',
    },
    statCard: (color, isActive) => ({
      background: isActive ? color : 'white',
      padding: '20px',
      borderRadius: '16px',
      border: `1px solid ${isActive ? 'transparent' : '#e5e7eb'}`,
      cursor: 'pointer',
      transition: 'all 0.25s ease',
      boxShadow: isActive ? `0 8px 24px ${color}40` : '0 1px 3px rgba(0,0,0,0.05)',
    }),
    statValue: (isActive) => ({
      fontSize: '32px',
      fontWeight: '800',
      color: isActive ? 'white' : '#064e3b',
      marginBottom: '4px',
    }),
    statLabel: (isActive) => ({
      fontSize: '13px',
      fontWeight: '600',
      color: isActive ? 'rgba(255,255,255,0.85)' : '#6b7280',
    }),
    searchBar: {
      display: 'flex',
      gap: '16px',
      marginBottom: '24px',
      alignItems: 'center',
    },
    searchInput: {
      flex: 1,
      maxWidth: '400px',
      padding: '14px 20px 14px 48px',
      borderRadius: '12px',
      border: '2px solid #e5e7eb',
      fontSize: '14px',
      backgroundColor: 'white',
      transition: 'all 0.2s ease',
      color: '#064e3b',
    },
    searchIcon: {
      position: 'absolute',
      left: '18px',
      top: '50%',
      transform: 'translateY(-50%)',
      color: '#9ca3af',
    },
    tableContainer: { 
      background: '#ffffff', 
      borderRadius: '20px', 
      boxShadow: '0 4px 24px rgba(0,0,0,0.06)', 
      overflow: 'hidden', 
      border: '1px solid #e5e7eb' 
    },
    table: { width: '100%', borderCollapse: 'collapse', textAlign: 'left' },
    th: { 
      background: 'linear-gradient(180deg, #f0fdf4 0%, #ecfdf5 100%)', 
      padding: '18px 20px', 
      fontSize: '11px', 
      fontWeight: '700', 
      textTransform: 'uppercase', 
      color: '#059669', 
      borderBottom: '2px solid #d1fae5',
      letterSpacing: '0.5px'
    },
    td: { 
      padding: '20px', 
      borderBottom: '1px solid #f3f4f6', 
      fontSize: '14px', 
      color: '#374151' 
    },
    tableRow: (isHovered) => ({
      backgroundColor: isHovered ? '#f0fdf4' : 'transparent',
      transition: 'background-color 0.15s ease',
    }),
    badge: { 
      padding: '6px 12px', 
      borderRadius: '20px', 
      fontSize: '12px', 
      fontWeight: '600', 
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px'
    },
    badgePending: { background: '#fef3c7', color: '#92400e' },
    badgeApproved: { background: '#d1fae5', color: '#065f46' },
    badgeRejected: { background: '#fee2e2', color: '#991b1b' },
    actionBtn: { 
      padding: '10px', 
      borderRadius: '10px', 
      border: 'none', 
      cursor: 'pointer', 
      marginLeft: '8px', 
      display: 'inline-flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      transition: 'all 0.2s ease',
    },
    btnView: { background: '#ecfdf5', color: '#059669' },
    btnApprove: { background: '#d1fae5', color: '#047857' },
    btnReject: { background: '#fee2e2', color: '#dc2626' },
    storeIcon: {
      width: '44px',
      height: '44px',
      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      color: 'white',
      borderRadius: '12px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
    },
    modalOverlay: { 
      position: 'fixed', 
      top: 0, 
      left: 0, 
      right: 0, 
      bottom: 0, 
      backgroundColor: 'rgba(6, 78, 59, 0.5)', 
      backdropFilter: 'blur(4px)',
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      zIndex: 1000, 
      padding: '20px' 
    },
    modalContent: { 
      backgroundColor: 'white', 
      borderRadius: '24px', 
      width: '100%', 
      maxWidth: '600px', 
      display: 'flex', 
      flexDirection: 'column', 
      boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', 
      overflow: 'hidden'
    },
    modalHeader: { 
      padding: '24px 28px', 
      borderBottom: '1px solid #e5e7eb', 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)' 
    },
    modalBody: { padding: '28px' },
    modalFooter: { 
      padding: '20px 28px', 
      borderTop: '1px solid #e5e7eb', 
      background: '#f9fafb', 
      display: 'flex', 
      justifyContent: 'flex-end', 
      gap: '12px' 
    },
    detailGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' },
    detailItem: { marginBottom: '4px' },
    detailLabel: { 
      fontSize: '11px', 
      color: '#6b7280', 
      marginBottom: '6px', 
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      textTransform: 'uppercase',
      fontWeight: '600',
      letterSpacing: '0.5px'
    },
    detailValue: { fontSize: '15px', color: '#111827', fontWeight: '600' },
    textarea: { 
      width: '100%', 
      padding: '16px', 
      border: '2px solid #e5e7eb', 
      borderRadius: '12px', 
      minHeight: '140px', 
      fontSize: '14px', 
      resize: 'vertical', 
      boxSizing: 'border-box',
      transition: 'border-color 0.2s ease',
      fontFamily: "'Plus Jakarta Sans', sans-serif"
    },
    emptyState: {
      padding: '60px 24px',
      textAlign: 'center',
      color: '#9ca3af',
    },
    emptyIcon: {
      width: '80px',
      height: '80px',
      borderRadius: '50%',
      backgroundColor: '#f3f4f6',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto 16px',
      fontSize: '32px',
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'pending': return <span style={{...styles.badge, ...styles.badgePending}}><FaClock size={10} />Bekliyor</span>;
      case 'approved': return <span style={{...styles.badge, ...styles.badgeApproved}}><FaCheck size={10} />Onaylandı</span>;
      case 'rejected': return <span style={{...styles.badge, ...styles.badgeRejected}}><FaTimes size={10} />Reddedildi</span>;
      default: return <span style={styles.badge}>{status}</span>;
    }
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>🏪 Satıcı Başvuruları</h1>
          <p style={styles.subtitle}>
            Tam başvurularını tamamlayan satıcıları inceleyin ve onaylayın.<br />
            Onaylanan başvurular aktif satıcı olarak sisteme eklenir.
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div style={styles.statsContainer}>
        <div 
          style={styles.statCard('#059669', statusFilter === 'all')}
          onClick={() => setStatusFilter('all')}
        >
          <div style={styles.statValue(statusFilter === 'all')}>{stats.total}</div>
          <div style={styles.statLabel(statusFilter === 'all')}>Toplam Başvuru</div>
        </div>
        <div 
          style={styles.statCard('#f59e0b', statusFilter === 'pending')}
          onClick={() => setStatusFilter('pending')}
        >
          <div style={styles.statValue(statusFilter === 'pending')}>{stats.pending}</div>
          <div style={styles.statLabel(statusFilter === 'pending')}>Bekleyen</div>
        </div>
        <div 
          style={styles.statCard('#10b981', statusFilter === 'approved')}
          onClick={() => setStatusFilter('approved')}
        >
          <div style={styles.statValue(statusFilter === 'approved')}>{stats.approved}</div>
          <div style={styles.statLabel(statusFilter === 'approved')}>Onaylanan</div>
        </div>
        <div 
          style={styles.statCard('#ef4444', statusFilter === 'rejected')}
          onClick={() => setStatusFilter('rejected')}
        >
          <div style={styles.statValue(statusFilter === 'rejected')}>{stats.rejected}</div>
          <div style={styles.statLabel(statusFilter === 'rejected')}>Reddedilen</div>
        </div>
      </div>

      {/* Search Bar */}
      <div style={styles.searchBar}>
        <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
          <FaSearch style={styles.searchIcon} />
          <input
            type="text"
            placeholder="İsim, e-posta, şirket veya vergi no ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.searchInput}
          />
        </div>
      </div>

      {/* Table */}
      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}><FaStore style={{ marginRight: '6px' }} />Şirket / Mağaza</th>
              <th style={styles.th}><FaUser style={{ marginRight: '6px' }} />Yetkili</th>
              <th style={styles.th}><FaEnvelope style={{ marginRight: '6px' }} />İletişim</th>
              <th style={styles.th}>Durum</th>
              <th style={{...styles.th, textAlign: 'right'}}>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="5" style={styles.emptyState}>
                  <div style={{ margin: '0 auto 12px', width: '40px', height: '40px', border: '4px solid #e5e7eb', borderTopColor: '#059669', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                  <div>Yükleniyor...</div>
                </td>
              </tr>
            ) : filteredApplications.length === 0 ? (
              <tr>
                <td colSpan="5" style={styles.emptyState}>
                  <div style={styles.emptyIcon}>🏪</div>
                  <div style={{ fontSize: '16px', fontWeight: '600', color: '#6b7280', marginBottom: '8px' }}>
                    {searchTerm || statusFilter !== 'all' ? 'Arama kriterlerine uygun başvuru bulunamadı' : 'Henüz satıcı başvurusu yok'}
                  </div>
                  <div style={{ fontSize: '14px', color: '#9ca3af' }}>
                    {searchTerm || statusFilter !== 'all' ? 'Farklı bir arama terimi veya filtre deneyin' : 'Yeni başvurular burada görünecek'}
                  </div>
                </td>
              </tr>
            ) : (
              filteredApplications.map((app) => (
                <tr 
                  key={app.id} 
                  style={styles.tableRow(hoveredRow === app.id)}
                  onMouseEnter={() => setHoveredRow(app.id)}
                  onMouseLeave={() => setHoveredRow(null)}
                >
                  <td style={styles.td}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <div style={styles.storeIcon}>
                        <FaStore size={18} />
                      </div>
                      <div>
                        <div style={{ fontWeight: '600', color: '#064e3b' }}>{app.company_name}</div>
                        <div style={{ fontSize: '12px', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <FaIdCard size={10} /> Vergi No: {app.tax_id || '-'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td style={styles.td}>
                    <div style={{ fontWeight: '600', color: '#064e3b' }}>{app.full_name}</div>
                    <div style={{ fontSize: '12px', color: '#6b7280' }}>
                      {new Date(app.created_at).toLocaleDateString('tr-TR')}
                    </div>
                  </td>
                  <td style={styles.td}>
                    <div style={{ color: '#059669', fontWeight: '500' }}>{app.email}</div>
                    <div style={{ fontSize: '12px', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <FaPhone size={10} /> {app.phone || '-'}
                    </div>
                  </td>
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
                          onClick={() => handleApproveClick(app)}
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
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Approve Modal - Komisyon Planı Seçimi */}
      {approveModalOpen && selectedApp && (
        <div style={styles.modalOverlay} onClick={() => setApproveModalOpen(false)}>
          <div style={{...styles.modalContent, maxWidth: '700px'}} onClick={e => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2 style={{margin: 0, fontSize: '20px', fontWeight: '700', color: '#064e3b'}}>
                ✅ Başvuruyu Onayla
              </h2>
              <button 
                onClick={() => setApproveModalOpen(false)} 
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
              {/* Başvuru Özeti */}
              <div style={{ 
                background: '#f0fdf4', 
                padding: '16px', 
                borderRadius: '12px', 
                marginBottom: '24px',
                border: '1px solid #d1fae5'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={styles.storeIcon}>
                    <FaStore size={20} />
                  </div>
                  <div>
                    <div style={{ fontWeight: '700', fontSize: '16px', color: '#064e3b' }}>{selectedApp.company_name}</div>
                    <div style={{ fontSize: '13px', color: '#6b7280' }}>{selectedApp.full_name} • {selectedApp.email}</div>
                  </div>
                </div>
              </div>

              {/* Komisyon Planı Seçimi */}
              <div>
                <h3 style={{ 
                  fontSize: '16px', 
                  fontWeight: '700', 
                  color: '#064e3b', 
                  marginBottom: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <FaPercent size={14} /> Komisyon Planı Seçin
                </h3>
                
                {commissionPlans.length === 0 ? (
                  <div style={{ 
                    padding: '24px', 
                    textAlign: 'center', 
                    background: '#fef3c7', 
                    borderRadius: '12px',
                    color: '#92400e'
                  }}>
                    Aktif komisyon planı bulunamadı. Lütfen önce bir komisyon planı oluşturun.
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {commissionPlans.map(plan => (
                      <div 
                        key={plan.id}
                        onClick={() => setSelectedCommissionPlan(plan.id)}
                        style={{
                          padding: '16px 20px',
                          borderRadius: '12px',
                          border: selectedCommissionPlan === plan.id 
                            ? '2px solid #059669' 
                            : '2px solid #e5e7eb',
                          background: selectedCommissionPlan === plan.id 
                            ? 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)' 
                            : 'white',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{
                            width: '20px',
                            height: '20px',
                            borderRadius: '50%',
                            border: selectedCommissionPlan === plan.id 
                              ? '6px solid #059669' 
                              : '2px solid #d1d5db',
                            background: 'white',
                            transition: 'all 0.2s ease'
                          }} />
                          <div>
                            <div style={{ 
                              fontWeight: '600', 
                              color: '#064e3b',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px'
                            }}>
                              {plan.name}
                              {plan.is_default && (
                                <span style={{
                                  background: '#fef3c7',
                                  color: '#92400e',
                                  padding: '2px 8px',
                                  borderRadius: '12px',
                                  fontSize: '11px',
                                  fontWeight: '600',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '4px'
                                }}>
                                  <FaStar size={10} /> Varsayılan
                                </span>
                              )}
                            </div>
                            <div style={{ fontSize: '13px', color: '#6b7280', marginTop: '2px' }}>
                              {plan.description || 'Açıklama yok'}
                            </div>
                          </div>
                        </div>
                        <div style={{
                          background: selectedCommissionPlan === plan.id ? '#059669' : '#f3f4f6',
                          color: selectedCommissionPlan === plan.id ? 'white' : '#064e3b',
                          padding: '8px 16px',
                          borderRadius: '20px',
                          fontWeight: '700',
                          fontSize: '15px',
                          minWidth: '80px',
                          textAlign: 'center'
                        }}>
                          %{parseFloat(plan.rate).toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div style={styles.modalFooter}>
              <button 
                onClick={() => setApproveModalOpen(false)} 
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
                İptal
              </button>
              <button 
                onClick={submitApprove}
                disabled={!selectedCommissionPlan || approveFullMutation.isLoading}
                style={{
                  padding: '12px 24px', 
                  borderRadius: '10px', 
                  border: 'none', 
                  background: !selectedCommissionPlan 
                    ? '#a7f3d0' 
                    : 'linear-gradient(135deg, #10b981 0%, #059669 100%)', 
                  color: 'white', 
                  cursor: !selectedCommissionPlan ? 'not-allowed' : 'pointer',
                  fontWeight: '600',
                  fontSize: '14px',
                  boxShadow: selectedCommissionPlan ? '0 4px 12px rgba(16, 185, 129, 0.3)' : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <FaCheck /> {approveFullMutation.isLoading ? 'Onaylanıyor...' : 'Onayla ve Aktifleştir'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {selectedApp && !rejectModalOpen && !approveModalOpen && (
        <div style={styles.modalOverlay} onClick={() => setSelectedApp(null)}>
          <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2 style={{margin: 0, fontSize: '20px', fontWeight: '700', color: '#064e3b'}}>
                🏪 Başvuru Detayı #{selectedApp.id}
              </h2>
              <button 
                onClick={() => setSelectedApp(null)} 
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
                  <span style={styles.detailLabel}><FaBuilding size={10} /> Şirket Adı</span>
                  <span style={styles.detailValue}>{selectedApp.company_name || '-'}</span>
                </div>
                <div style={styles.detailItem}>
                  <span style={styles.detailLabel}><FaIdCard size={10} /> Vergi No</span>
                  <span style={styles.detailValue}>{selectedApp.tax_id || '-'}</span>
                </div>
                <div style={styles.detailItem}>
                  <span style={styles.detailLabel}><FaUser size={10} /> Yetkili Kişi</span>
                  <span style={styles.detailValue}>{selectedApp.full_name}</span>
                </div>
                <div style={styles.detailItem}>
                  <span style={styles.detailLabel}><FaEnvelope size={10} /> Email</span>
                  <span style={styles.detailValue}>{selectedApp.email}</span>
                </div>
                <div style={styles.detailItem}>
                  <span style={styles.detailLabel}><FaPhone size={10} /> Telefon</span>
                  <span style={styles.detailValue}>{selectedApp.phone || '-'}</span>
                </div>
                <div style={styles.detailItem}>
                  <span style={styles.detailLabel}>Durum</span>
                  <div>{getStatusBadge(selectedApp.status)}</div>
                </div>
                <div style={styles.detailItem}>
                  <span style={styles.detailLabel}><FaCalendarAlt size={10} /> Başvuru Tarihi</span>
                  <span style={styles.detailValue}>{new Date(selectedApp.created_at).toLocaleString('tr-TR')}</span>
                </div>
              </div>

              {selectedApp.status === 'rejected' && (
                <div style={{marginTop: '20px', padding: '16px', background: '#fef2f2', borderRadius: '12px', border: '1px solid #fee2e2'}}>
                  <span style={{...styles.detailLabel, color: '#991b1b'}}>Red Nedeni:</span>
                  <p style={{margin: '8px 0 0', fontSize: '14px', color: '#7f1d1d', lineHeight: '1.5'}}>{selectedApp.rejection_reason}</p>
                </div>
              )}

              {selectedApp.status === 'approved' && selectedApp.reviewer && (
                <div style={{marginTop: '20px', padding: '16px', background: '#f0fdf4', borderRadius: '12px', border: '1px solid #dcfce7'}}>
                  <span style={{...styles.detailLabel, color: '#166534'}}>✅ Onaylayan:</span>
                  <p style={{margin: '8px 0 0', fontSize: '14px', color: '#14532d'}}>
                    {selectedApp.reviewer.name} ({new Date(selectedApp.reviewed_at).toLocaleString('tr-TR')})
                  </p>
                </div>
              )}
            </div>
            <div style={styles.modalFooter}>
              <button 
                onClick={() => setSelectedApp(null)} 
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
              {selectedApp.status === 'pending' && (
                <>
                  <button 
                    onClick={() => handleRejectClick(selectedApp)}
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
                  <button 
                    onClick={() => {
                      setSelectedApp(selectedApp);
                      handleApproveClick(selectedApp);
                    }}
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
            <div style={{...styles.modalHeader, background: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)'}}>
              <h2 style={{margin: 0, fontSize: '20px', fontWeight: '700', color: '#991b1b'}}>
                ⚠️ Başvuruyu Reddet
              </h2>
              <button 
                onClick={() => setRejectModalOpen(false)} 
                style={{
                  background: 'white', 
                  border: 'none', 
                  cursor: 'pointer', 
                  padding: '8px', 
                  borderRadius: '8px',
                  color: '#991b1b'
                }}
              >
                <FaTimes size={18} />
              </button>
            </div>
            <div style={styles.modalBody}>
              <p style={{marginBottom: '16px', fontSize: '14px', color: '#6b7280', lineHeight: '1.5'}}>
                Lütfen başvuru sahibine iletilecek red nedenini giriniz.
              </p>
              <textarea 
                style={{
                  ...styles.textarea,
                  borderColor: rejectionReason.length > 0 && rejectionReason.length < 10 ? '#ef4444' : '#e5e7eb'
                }}
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Örn: Belgeleriniz eksik veya hatalı..."
              />
              <div style={{
                textAlign: 'right', 
                fontSize: '12px', 
                marginTop: '8px', 
                color: rejectionReason.length < 10 ? '#ef4444' : '#059669',
                fontWeight: '500'
              }}>
                {rejectionReason.length} / 1000 (Min 10)
              </div>
            </div>
            <div style={styles.modalFooter}>
              <button 
                onClick={() => setRejectModalOpen(false)} 
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
                İptal
              </button>
              <button 
                onClick={submitReject}
                disabled={rejectionReason.length < 10}
                style={{
                  padding: '12px 24px', 
                  borderRadius: '10px', 
                  border: 'none', 
                  background: rejectionReason.length < 10 
                    ? '#fca5a5' 
                    : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', 
                  color: 'white', 
                  cursor: rejectionReason.length < 10 ? 'not-allowed' : 'pointer',
                  fontWeight: '600',
                  fontSize: '14px',
                  boxShadow: rejectionReason.length >= 10 ? '0 4px 12px rgba(239, 68, 68, 0.3)' : 'none'
                }}
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
