import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getApplications, 
  approvePreApplication, 
  rejectPreApplication,
  approveFullApplication,
  rejectFullApplication
} from '../../features/vendor-application/api/vendorApplicationApi';
import { getActiveCommissionPlans } from '../../features/commission/api/commissionApi';
import { useToast } from '../../components/Toast';
import axios from '../../lib/axios';
import { 
  FaCheck, FaTimes, FaEye, FaSearch, FaFilter, FaCopy, FaCalendarAlt, FaEnvelope, FaPhone, FaBuilding, FaClock, FaUser, FaPercent, FaStar, FaStore, FaIdCard, FaFileAlt, FaUserCheck
} from 'react-icons/fa';

const VendorApplications = () => {
  const queryClient = useQueryClient();
  const toast = useToast();
  
  // Tab state: 'pre' for pre-applications, 'full' for pending activation vendors
  const [activeTab, setActiveTab] = useState('pre');
  const [filters, setFilters] = useState({ type: 'pre_application' });
  const [selectedApp, setSelectedApp] = useState(null);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [approveModalOpen, setApproveModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [selectedCommissionPlan, setSelectedCommissionPlan] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [hoveredRow, setHoveredRow] = useState(null);

  // Pre-applications query
  const { data: preAppData, isLoading: preAppLoading } = useQuery({
    queryKey: ['preApplications', filters],
    queryFn: () => getApplications(filters),
    enabled: activeTab === 'pre',
    keepPreviousData: true
  });

  // Pending activation vendors query
  const { data: pendingVendorsData, isLoading: pendingVendorsLoading } = useQuery({
    queryKey: ['pendingActivationVendors'],
    queryFn: async () => {
      const response = await axios.get('/v1/admin/vendors', { 
        params: { status: 'pending_activation' } 
      });
      return response.data;
    },
    enabled: activeTab === 'full',
    keepPreviousData: true
  });

  // Komisyon planlarını getir
  const { data: commissionPlansData } = useQuery({
    queryKey: ['activeCommissionPlans'],
    queryFn: getActiveCommissionPlans,
  });

  const commissionPlans = commissionPlansData?.data?.data || [];
  const applications = preAppData?.data?.data?.data || [];
  const pendingVendors = pendingVendorsData?.data?.data || [];
  
  // Current loading state
  const isLoading = activeTab === 'pre' ? preAppLoading : pendingVendorsLoading;
  
  // Filtreleme - Pre Applications
  const filteredApplications = useMemo(() => {
    return applications.filter(app => {
      const matchesSearch = !searchTerm || 
        app.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.phone?.includes(searchTerm);
      
      const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [applications, searchTerm, statusFilter]);

  // Filtreleme - Pending Vendors
  const filteredVendors = useMemo(() => {
    return pendingVendors.filter(vendor => {
      const matchesSearch = !searchTerm || 
        vendor.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vendor.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vendor.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vendor.phone?.includes(searchTerm);
      
      return matchesSearch;
    });
  }, [pendingVendors, searchTerm]);

  // Stats for pre-applications
  const preStats = useMemo(() => ({
    total: applications.length,
    pending: applications.filter(a => a.status === 'pending').length,
    approved: applications.filter(a => a.status === 'approved').length,
    rejected: applications.filter(a => a.status === 'rejected').length,
  }), [applications]);

  // Stats for pending vendors
  const vendorStats = useMemo(() => ({
    total: pendingVendors.length,
  }), [pendingVendors]);

  // Mutations - Pre Application
  const approvePreMutation = useMutation({
    mutationFn: approvePreApplication,
    onSuccess: (response) => {
      queryClient.invalidateQueries(['preApplications']);
      queryClient.invalidateQueries(['pendingActivationVendors']);
      setSelectedApp(null);
      setApproveModalOpen(false);
      toast.success('Ön Başvuru Onaylandı!', 'Satıcı hesabı oluşturuldu. Satıcı tam başvurusunu tamamlaması için bilgilendirilecek.', 4000);
    },
    onError: (err) => toast.error('Hata', err.response?.data?.message || 'Hata oluştu', 4000)
  });

  // Mutations - Full Application (Vendor Activation)
  const approveFullMutation = useMutation({
    mutationFn: ({ vendorId, commissionPlanId }) => approveFullApplication(vendorId, commissionPlanId),
    onSuccess: () => {
      queryClient.invalidateQueries(['pendingActivationVendors']);
      queryClient.invalidateQueries(['active-vendors']);
      setSelectedVendor(null);
      setApproveModalOpen(false);
      setSelectedCommissionPlan(null);
      toast.success('Satıcı Aktifleştirildi', 'Satıcı başarıyla aktif edildi ve iyzico\'ya kaydedildi.', 4000);
    },
    onError: (err) => toast.error('Hata', err.response?.data?.message || 'Hata oluştu', 4000)
  });

  // Reject Pre Application
  const rejectPreMutation = useMutation({
    mutationFn: ({ id, reason }) => rejectPreApplication(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries(['preApplications']);
      setRejectModalOpen(false);
      setSelectedApp(null);
      setRejectionReason('');
      toast.success('Başvuru Reddedildi', 'Ön başvuru başarıyla reddedildi.', 4000);
    },
    onError: (err) => toast.error('Hata', err.response?.data?.message || 'Hata oluştu', 4000)
  });

  // Reject Full Application (Vendor)
  const rejectFullMutation = useMutation({
    mutationFn: ({ vendorId, reason }) => rejectFullApplication(vendorId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries(['pendingActivationVendors']);
      setRejectModalOpen(false);
      setSelectedVendor(null);
      setRejectionReason('');
      toast.success('Başvuru Reddedildi', 'Tam başvuru reddedildi.', 4000);
    },
    onError: (err) => toast.error('Hata', err.response?.data?.message || 'Hata oluştu', 4000)
  });

  // Handlers - Pre Application
  const handleApprovePreClick = (app) => {
    setSelectedApp(app);
    setApproveModalOpen(true);
  };

  const handleRejectPreClick = (app) => {
    setSelectedApp(app);
    setRejectModalOpen(true);
  };

  const submitApprovePre = () => {
    approvePreMutation.mutate(selectedApp.id);
  };

  const submitRejectPre = () => {
    if (rejectionReason.length < 10) {
      toast.warning('Uyarı', 'Red nedeni en az 10 karakter olmalıdır.', 3000);
      return;
    }
    rejectPreMutation.mutate({ id: selectedApp.id, reason: rejectionReason });
  };

  // Handlers - Vendor (Full Application)
  const handleApproveVendorClick = (vendor) => {
    setSelectedVendor(vendor);
    const defaultPlan = commissionPlans.find(p => p.is_default);
    setSelectedCommissionPlan(defaultPlan?.id || (commissionPlans[0]?.id || null));
    setApproveModalOpen(true);
  };

  const handleRejectVendorClick = (vendor) => {
    setSelectedVendor(vendor);
    setRejectModalOpen(true);
  };

  const submitApproveVendor = () => {
    if (!selectedCommissionPlan) {
      toast.warning('Uyarı', 'Lütfen bir komisyon planı seçin.', 3000);
      return;
    }
    approveFullMutation.mutate({ vendorId: selectedVendor.id, commissionPlanId: selectedCommissionPlan });
  };

  const submitRejectVendor = () => {
    if (rejectionReason.length < 10) {
      toast.warning('Uyarı', 'Red nedeni en az 10 karakter olmalıdır.', 3000);
      return;
    }
    rejectFullMutation.mutate({ vendorId: selectedVendor.id, reason: rejectionReason });
  };

  // Tab change handler
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchTerm('');
    setStatusFilter('all');
    setSelectedApp(null);
    setSelectedVendor(null);
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
    // Stats kartları
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
    // Arama ve filtre barı
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
    filterSelect: {
      padding: '14px 20px',
      borderRadius: '12px',
      border: '2px solid #e5e7eb',
      fontSize: '14px',
      backgroundColor: 'white',
      color: '#064e3b',
      fontWeight: '500',
      cursor: 'pointer',
      minWidth: '160px',
    },
    // Tablo stilleri
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
    // Badge stilleri
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
    // Action butonları
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
    btnCopy: { background: '#dbeafe', color: '#2563eb' },
    // Modal stilleri
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
      overflow: 'hidden',
      animation: 'modalSlideIn 0.3s ease-out'
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
    },
    // Tab stilleri
    tabContainer: {
      display: 'flex',
      gap: '8px',
      marginBottom: '24px',
      background: '#f3f4f6',
      padding: '6px',
      borderRadius: '16px',
      width: 'fit-content'
    },
    tab: (isActive) => ({
      padding: '12px 24px',
      borderRadius: '12px',
      border: 'none',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '600',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      transition: 'all 0.2s ease',
      background: isActive ? 'white' : 'transparent',
      color: isActive ? '#059669' : '#6b7280',
      boxShadow: isActive ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
    }),
    tabBadge: (isActive) => ({
      background: isActive ? '#d1fae5' : '#e5e7eb',
      color: isActive ? '#059669' : '#6b7280',
      padding: '2px 8px',
      borderRadius: '10px',
      fontSize: '12px',
      fontWeight: '700',
    }),
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

  const getTypeLabel = (type) => {
    return type === 'pre_application' ? 'Ön Başvuru' : 'Tam Başvuru';
  };

  const copyToClipboard = (text, message) => {
    navigator.clipboard.writeText(text);
    toast.success('Kopyalandı', message, 2000);
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>📋 Satıcı Başvuruları</h1>
          <p style={styles.subtitle}>
            Ön başvuruları ve tam başvuruları yönetin.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div style={styles.tabContainer}>
        <button 
          style={styles.tab(activeTab === 'pre')}
          onClick={() => handleTabChange('pre')}
        >
          <FaFileAlt size={14} />
          Ön Başvurular
          <span style={styles.tabBadge(activeTab === 'pre')}>{preStats.pending}</span>
        </button>
        <button 
          style={styles.tab(activeTab === 'full')}
          onClick={() => handleTabChange('full')}
        >
          <FaUserCheck size={14} />
          Aktivasyon Bekleyenler
          <span style={styles.tabBadge(activeTab === 'full')}>{vendorStats.total}</span>
        </button>
      </div>

      {/* Pre-Applications Tab Content */}
      {activeTab === 'pre' && (
        <>
          {/* Stats Cards */}
          <div style={styles.statsContainer}>
            <div 
              style={styles.statCard('#059669', statusFilter === 'all')}
              onClick={() => setStatusFilter('all')}
            >
              <div style={styles.statValue(statusFilter === 'all')}>{preStats.total}</div>
              <div style={styles.statLabel(statusFilter === 'all')}>Toplam</div>
            </div>
            <div 
              style={styles.statCard('#f59e0b', statusFilter === 'pending')}
              onClick={() => setStatusFilter('pending')}
            >
              <div style={styles.statValue(statusFilter === 'pending')}>{preStats.pending}</div>
              <div style={styles.statLabel(statusFilter === 'pending')}>Bekleyen</div>
            </div>
            <div 
              style={styles.statCard('#10b981', statusFilter === 'approved')}
              onClick={() => setStatusFilter('approved')}
            >
              <div style={styles.statValue(statusFilter === 'approved')}>{preStats.approved}</div>
              <div style={styles.statLabel(statusFilter === 'approved')}>Onaylanan</div>
            </div>
            <div 
              style={styles.statCard('#ef4444', statusFilter === 'rejected')}
              onClick={() => setStatusFilter('rejected')}
            >
              <div style={styles.statValue(statusFilter === 'rejected')}>{preStats.rejected}</div>
              <div style={styles.statLabel(statusFilter === 'rejected')}>Reddedilen</div>
            </div>
          </div>

          {/* Search Bar */}
          <div style={styles.searchBar}>
            <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
              <FaSearch style={styles.searchIcon} />
              <input
                type="text"
                placeholder="İsim, e-posta veya şirket ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={styles.searchInput}
              />
            </div>
          </div>

          {/* Pre-Applications Table */}
          <div style={styles.tableContainer}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}><FaCalendarAlt style={{ marginRight: '6px' }} />Tarih</th>
                  <th style={styles.th}><FaUser style={{ marginRight: '6px' }} />Ad Soyad</th>
                  <th style={styles.th}><FaBuilding style={{ marginRight: '6px' }} />Şirket</th>
                  <th style={styles.th}><FaEnvelope style={{ marginRight: '6px' }} />Email</th>
                  <th style={styles.th}>Durum</th>
                  <th style={{...styles.th, textAlign: 'right'}}>İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan="6" style={styles.emptyState}>
                      <div style={{ margin: '0 auto 12px', width: '40px', height: '40px', border: '4px solid #e5e7eb', borderTopColor: '#059669', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                      <div>Yükleniyor...</div>
                    </td>
                  </tr>
                ) : filteredApplications.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={styles.emptyState}>
                      <div style={styles.emptyIcon}>📭</div>
                      <div style={{ fontSize: '16px', fontWeight: '600', color: '#6b7280', marginBottom: '8px' }}>
                        {searchTerm || statusFilter !== 'all' ? 'Arama kriterlerine uygun başvuru bulunamadı' : 'Henüz ön başvuru yok'}
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
                        <div style={{ fontWeight: '500' }}>{new Date(app.created_at).toLocaleDateString('tr-TR')}</div>
                        <div style={{ fontSize: '12px', color: '#9ca3af' }}>{new Date(app.created_at).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}</div>
                      </td>
                      <td style={styles.td}>
                        <div style={{ fontWeight: '600', color: '#064e3b' }}>{app.full_name}</div>
                        <div style={{ fontSize: '12px', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <FaPhone size={10} /> {app.phone || 'Telefon yok'}
                        </div>
                      </td>
                      <td style={styles.td}>
                        <span style={{ fontWeight: '500' }}>{app.company_name || '-'}</span>
                      </td>
                      <td style={styles.td}>
                        <span style={{ color: '#059669' }}>{app.email}</span>
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
                              onClick={() => handleApprovePreClick(app)}
                              style={{...styles.actionBtn, ...styles.btnApprove}}
                              title="Onayla"
                            >
                              <FaCheck />
                            </button>
                            <button 
                              onClick={() => handleRejectPreClick(app)}
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
        </>
      )}

      {/* Full Applications (Pending Activation) Tab Content */}
      {activeTab === 'full' && (
        <>
          {/* Search Bar */}
          <div style={styles.searchBar}>
            <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
              <FaSearch style={styles.searchIcon} />
              <input
                type="text"
                placeholder="İsim, e-posta veya şirket ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={styles.searchInput}
              />
            </div>
          </div>

          {/* Info Box */}
          <div style={{ 
            background: '#fef3c7', 
            padding: '16px 20px', 
            borderRadius: '12px', 
            marginBottom: '24px',
            border: '1px solid #fde68a',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <FaClock size={20} color="#d97706" />
            <div style={{ fontSize: '14px', color: '#92400e' }}>
              <strong>Aktivasyon Bekleyenler:</strong> Bu satıcılar tam başvurularını tamamlamış ve admin onayı bekliyor. 
              Onaylanan satıcılar iyzico'ya kaydedilecek ve aktifleştirilecek.
            </div>
          </div>

          {/* Pending Vendors Table */}
          <div style={styles.tableContainer}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}><FaStore style={{ marginRight: '6px' }} />Mağaza</th>
                  <th style={styles.th}><FaUser style={{ marginRight: '6px' }} />Yetkili</th>
                  <th style={styles.th}><FaEnvelope style={{ marginRight: '6px' }} />İletişim</th>
                  <th style={styles.th}><FaIdCard style={{ marginRight: '6px' }} />Bilgiler</th>
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
                ) : filteredVendors.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={styles.emptyState}>
                      <div style={styles.emptyIcon}>✅</div>
                      <div style={{ fontSize: '16px', fontWeight: '600', color: '#6b7280', marginBottom: '8px' }}>
                        Aktivasyon bekleyen satıcı yok
                      </div>
                      <div style={{ fontSize: '14px', color: '#9ca3af' }}>
                        Tüm tam başvurular işlenmiş durumda
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredVendors.map((vendor) => (
                    <tr 
                      key={vendor.id} 
                      style={styles.tableRow(hoveredRow === `v-${vendor.id}`)}
                      onMouseEnter={() => setHoveredRow(`v-${vendor.id}`)}
                      onMouseLeave={() => setHoveredRow(null)}
                    >
                      <td style={styles.td}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={styles.storeIcon}>
                            <FaStore size={16} />
                          </div>
                          <div>
                            <div style={{ fontWeight: '600', color: '#064e3b' }}>{vendor.company_name}</div>
                            <div style={{ fontSize: '12px', color: '#6b7280' }}>{vendor.slug}</div>
                          </div>
                        </div>
                      </td>
                      <td style={styles.td}>
                        <div style={{ fontWeight: '600', color: '#064e3b' }}>{vendor.full_name}</div>
                        <div style={{ fontSize: '12px', color: '#6b7280' }}>
                          {new Date(vendor.created_at).toLocaleDateString('tr-TR')}
                        </div>
                      </td>
                      <td style={styles.td}>
                        <div style={{ color: '#059669', fontWeight: '500' }}>{vendor.email}</div>
                        <div style={{ fontSize: '12px', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <FaPhone size={10} /> {vendor.phone || '-'}
                        </div>
                      </td>
                      <td style={styles.td}>
                        <div style={{ fontSize: '13px' }}>
                          <span style={{ color: '#6b7280' }}>Tür:</span> {vendor.merchant_type || '-'}
                        </div>
                        <div style={{ fontSize: '12px', color: '#6b7280' }}>
                          IBAN: {vendor.bank_accounts?.[0]?.iban ? '✓ Var' : '✗ Yok'}
                        </div>
                      </td>
                      <td style={{...styles.td, textAlign: 'right'}}>
                        <button 
                          onClick={() => setSelectedVendor(vendor)}
                          style={{...styles.actionBtn, ...styles.btnView}}
                          title="Detay"
                        >
                          <FaEye />
                        </button>
                        <button 
                          onClick={() => handleApproveVendorClick(vendor)}
                          style={{...styles.actionBtn, ...styles.btnApprove}}
                          title="Onayla ve Aktifleştir"
                        >
                          <FaCheck />
                        </button>
                        <button 
                          onClick={() => handleRejectVendorClick(vendor)}
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
        </>
      )}

      {/* Detail Modal */}
      {selectedApp && !rejectModalOpen && !approveModalOpen && (
        <div style={styles.modalOverlay} onClick={() => setSelectedApp(null)}>
          <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2 style={{margin: 0, fontSize: '20px', fontWeight: '700', color: '#064e3b'}}>
                📋 Başvuru Detayı #{selectedApp.id}
              </h2>
              <button 
                onClick={() => setSelectedApp(null)} 
                style={{
                  background: 'white', 
                  border: 'none', 
                  cursor: 'pointer', 
                  padding: '8px', 
                  borderRadius: '8px',
                  color: '#6b7280',
                  transition: 'all 0.2s'
                }}
              >
                <FaTimes size={18} />
              </button>
            </div>
            <div style={styles.modalBody}>
              <div style={styles.detailGrid}>
                <div style={styles.detailItem}>
                  <span style={styles.detailLabel}><FaUser size={10} /> Ad Soyad</span>
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
                  <span style={styles.detailLabel}><FaBuilding size={10} /> Şirket Adı</span>
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
                  color: '#6b7280',
                  transition: 'all 0.2s'
                }}
              >
                Kapat
              </button>
              {selectedApp.status === 'pending' && (
                <>
                  <button 
                    onClick={() => handleRejectPreClick(selectedApp)}
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
                    onClick={() => handleApprovePreClick(selectedApp)}
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

      {/* Vendor Detail Modal */}
      {selectedVendor && !rejectModalOpen && !approveModalOpen && (
        <div style={styles.modalOverlay} onClick={() => setSelectedVendor(null)}>
          <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2 style={{margin: 0, fontSize: '20px', fontWeight: '700', color: '#064e3b'}}>
                🏪 Satıcı Detayı - {selectedVendor.company_name}
              </h2>
              <button 
                onClick={() => setSelectedVendor(null)} 
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
                  <span style={styles.detailLabel}><FaStore size={10} /> Mağaza Adı</span>
                  <span style={styles.detailValue}>{selectedVendor.company_name}</span>
                </div>
                <div style={styles.detailItem}>
                  <span style={styles.detailLabel}><FaUser size={10} /> Yetkili</span>
                  <span style={styles.detailValue}>{selectedVendor.full_name}</span>
                </div>
                <div style={styles.detailItem}>
                  <span style={styles.detailLabel}><FaEnvelope size={10} /> Email</span>
                  <span style={styles.detailValue}>{selectedVendor.email}</span>
                </div>
                <div style={styles.detailItem}>
                  <span style={styles.detailLabel}><FaPhone size={10} /> Telefon</span>
                  <span style={styles.detailValue}>{selectedVendor.phone || '-'}</span>
                </div>
                <div style={styles.detailItem}>
                  <span style={styles.detailLabel}><FaIdCard size={10} /> Satıcı Türü</span>
                  <span style={styles.detailValue}>{selectedVendor.merchant_type || '-'}</span>
                </div>
                <div style={styles.detailItem}>
                  <span style={styles.detailLabel}>TC/Vergi No</span>
                  <span style={styles.detailValue}>{selectedVendor.identity_number || selectedVendor.tax_id || '-'}</span>
                </div>
              </div>

              {/* Banka Bilgileri */}
              {selectedVendor.bank_accounts?.[0] && (
                <div style={{marginTop: '20px', padding: '16px', background: '#f0fdf4', borderRadius: '12px', border: '1px solid #dcfce7'}}>
                  <span style={{...styles.detailLabel, color: '#166534', marginBottom: '12px'}}>🏦 Banka Bilgileri</span>
                  <div style={{fontSize: '14px', color: '#14532d'}}>
                    <div><strong>Banka:</strong> {selectedVendor.bank_accounts[0].bank_name}</div>
                    <div><strong>Hesap Sahibi:</strong> {selectedVendor.bank_accounts[0].account_holder}</div>
                    <div><strong>IBAN:</strong> {selectedVendor.bank_accounts[0].iban}</div>
                  </div>
                </div>
              )}
            </div>
            <div style={styles.modalFooter}>
              <button 
                onClick={() => setSelectedVendor(null)} 
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
                onClick={() => handleRejectVendorClick(selectedVendor)}
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
                onClick={() => handleApproveVendorClick(selectedVendor)}
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
                Onayla ve Aktifleştir
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Approve Pre-Application Modal */}
      {approveModalOpen && selectedApp && (
        <div style={styles.modalOverlay} onClick={() => { setApproveModalOpen(false); setSelectedApp(null); }}>
          <div style={{...styles.modalContent, maxWidth: '480px'}} onClick={e => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2 style={{margin: 0, fontSize: '20px', fontWeight: '700', color: '#064e3b'}}>
                ✅ Ön Başvuruyu Onayla
              </h2>
              <button 
                onClick={() => { setApproveModalOpen(false); setSelectedApp(null); }} 
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
              <div style={{ 
                background: '#f0fdf4', 
                padding: '16px', 
                borderRadius: '12px', 
                marginBottom: '16px',
                border: '1px solid #d1fae5'
              }}>
                <div style={{ fontWeight: '700', fontSize: '16px', color: '#064e3b' }}>
                  {selectedApp.company_name || selectedApp.full_name}
                </div>
                <div style={{ fontSize: '13px', color: '#6b7280', marginTop: '4px' }}>
                  {selectedApp.full_name} • {selectedApp.email}
                </div>
              </div>
              <p style={{ fontSize: '14px', color: '#6b7280', lineHeight: '1.6' }}>
                Bu ön başvuruyu onayladığınızda satıcı hesabı oluşturulacak ve satıcıya giriş bilgileri gönderilecek.
                Satıcı daha sonra tam başvurusunu tamamlayabilecek.
              </p>
            </div>
            <div style={styles.modalFooter}>
              <button 
                onClick={() => { setApproveModalOpen(false); setSelectedApp(null); }} 
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
                onClick={submitApprovePre}
                disabled={approvePreMutation.isPending}
                style={{
                  padding: '12px 28px', 
                  borderRadius: '10px', 
                  border: 'none', 
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', 
                  color: 'white', 
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '14px',
                  boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <FaCheck /> {approvePreMutation.isPending ? 'Onaylanıyor...' : 'Onayla'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Approve Vendor (Full Application) Modal */}
      {approveModalOpen && selectedVendor && (
        <div style={styles.modalOverlay} onClick={() => { setApproveModalOpen(false); setSelectedVendor(null); }}>
          <div style={{...styles.modalContent, maxWidth: '580px'}} onClick={e => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2 style={{margin: 0, fontSize: '20px', fontWeight: '700', color: '#064e3b'}}>
                ✅ Satıcıyı Aktifleştir
              </h2>
              <button 
                onClick={() => { setApproveModalOpen(false); setSelectedVendor(null); }} 
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
                    <div style={{ fontWeight: '700', fontSize: '16px', color: '#064e3b' }}>
                      {selectedVendor.company_name}
                    </div>
                    <div style={{ fontSize: '13px', color: '#6b7280' }}>
                      {selectedVendor.full_name} • {selectedVendor.email}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 style={{ 
                  fontSize: '15px', 
                  fontWeight: '700', 
                  color: '#064e3b', 
                  marginBottom: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <FaPercent size={12} /> Komisyon Planı Seçin
                </h3>
                
                {commissionPlans.length === 0 ? (
                  <div style={{ 
                    padding: '20px', 
                    textAlign: 'center', 
                    background: '#fef3c7', 
                    borderRadius: '12px',
                    color: '#92400e',
                    fontSize: '14px'
                  }}>
                    Aktif komisyon planı bulunamadı.
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {commissionPlans.map(plan => (
                      <div 
                        key={plan.id}
                        onClick={() => setSelectedCommissionPlan(plan.id)}
                        style={{
                          padding: '14px 16px',
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
                            width: '18px',
                            height: '18px',
                            borderRadius: '50%',
                            border: selectedCommissionPlan === plan.id 
                              ? '5px solid #059669' 
                              : '2px solid #d1d5db',
                            background: 'white'
                          }} />
                          <div>
                            <div style={{ 
                              fontWeight: '600', 
                              color: '#064e3b',
                              fontSize: '14px',
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
                                  borderRadius: '10px',
                                  fontSize: '10px',
                                  fontWeight: '600'
                                }}>
                                  <FaStar size={8} /> Varsayılan
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div style={{
                          background: selectedCommissionPlan === plan.id ? '#059669' : '#f3f4f6',
                          color: selectedCommissionPlan === plan.id ? 'white' : '#064e3b',
                          padding: '6px 14px',
                          borderRadius: '16px',
                          fontWeight: '700',
                          fontSize: '14px'
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
                onClick={() => { setApproveModalOpen(false); setSelectedVendor(null); }} 
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
                onClick={submitApproveVendor}
                disabled={approveFullMutation.isPending || !selectedCommissionPlan}
                style={{
                  padding: '12px 28px', 
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
                <FaCheck /> {approveFullMutation.isPending ? 'Aktifleştiriliyor...' : 'Onayla ve Aktifleştir'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal - Works for both Pre and Full */}
      {rejectModalOpen && (selectedApp || selectedVendor) && (
        <div style={styles.modalOverlay} onClick={() => { setRejectModalOpen(false); setSelectedApp(null); setSelectedVendor(null); setRejectionReason(''); }}>
          <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
            <div style={{...styles.modalHeader, background: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)'}}>
              <h2 style={{margin: 0, fontSize: '20px', fontWeight: '700', color: '#991b1b'}}>
                ⚠️ {selectedApp ? 'Ön Başvuruyu' : 'Tam Başvuruyu'} Reddet
              </h2>
              <button 
                onClick={() => { setRejectModalOpen(false); setSelectedApp(null); setSelectedVendor(null); setRejectionReason(''); }} 
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
                <strong>{selectedApp?.full_name || selectedVendor?.full_name}</strong> için red nedenini giriniz.
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
                onClick={() => { setRejectModalOpen(false); setSelectedApp(null); setSelectedVendor(null); setRejectionReason(''); }} 
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
                onClick={selectedApp ? submitRejectPre : submitRejectVendor}
                disabled={rejectionReason.length < 10 || rejectPreMutation.isPending || rejectFullMutation.isPending}
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
                {(rejectPreMutation.isPending || rejectFullMutation.isPending) ? 'Reddediliyor...' : 'Reddet'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorApplications;
