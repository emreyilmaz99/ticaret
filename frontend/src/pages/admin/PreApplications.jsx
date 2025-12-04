import React, { useState } from 'react';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { getVendors, updateVendorStatus } from '../../features/vendor/api/vendorApi';
import { useToast } from '../../components/Toast';
import Pagination from '../../components/ui/Pagination';
import { 
  FaCheck, FaTimes, FaEye, FaSearch, FaFilePdf, 
  FaExternalLinkAlt, FaUser, FaMapMarkerAlt, FaUniversity,
  FaInstagram, FaGlobe, FaStore, FaCalendarAlt
} from 'react-icons/fa';

const PreApplications = () => {
  const queryClient = useQueryClient();
  const toast = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const [adminNote, setAdminNote] = useState('');
  const [hoveredRow, setHoveredRow] = useState(null);
  const [actionModal, setActionModal] = useState({ type: null, vendorId: null }); // type: 'approve' | 'reject' | null
  const [rejectionReason, setRejectionReason] = useState('');
  const [commissionRate, setCommissionRate] = useState(10);
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(10); // Normal: 15, test için düşürülebilir

  const statusTabs = [
    { id: 'all', label: 'Tümü' },
    { id: 'pre_pending', label: 'Ön Başvuru - Beklemede' },
    { id: 'pre_approved', label: 'Ön Başvuru - Onaylandı' },
    { id: 'pending', label: 'Bekleyen' },
    { id: 'active', label: 'Aktif' },
    { id: 'rejected', label: 'Yasaklı' },
  ];

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
    searchContainer: {
      position: 'relative',
    },
    searchInput: {
      padding: '10px 16px 10px 40px',
      border: '1px solid #cbd5e1',
      borderRadius: '8px',
      fontSize: '14px',
      width: '280px',
      outline: 'none',
      transition: 'border-color 0.2s',
    },
    searchIcon: {
      position: 'absolute',
      left: '12px',
      top: '50%',
      transform: 'translateY(-50%)',
      color: '#94a3b8',
    },
    filterBar: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '24px',
      backgroundColor: 'white',
      padding: '12px',
      borderRadius: '12px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      flexWrap: 'wrap',
      gap: '16px',
    },
    filterTabs: {
      display: 'flex',
      gap: '8px',
      flexWrap: 'wrap',
    },
    filterTab: {
      padding: '8px 16px',
      borderRadius: '8px',
      fontSize: '13px',
      fontWeight: '500',
      cursor: 'pointer',
      border: 'none',
      backgroundColor: 'transparent',
      color: '#64748b',
      transition: 'all 0.2s',
    },
    activeFilterTab: {
      backgroundColor: '#6366f1',
      color: 'white',
    },
    paginationContainer: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '16px 24px',
      borderTop: '1px solid #e2e8f0',
      backgroundColor: '#f8fafc',
    },
    paginationInfo: {
      fontSize: '14px',
      color: '#64748b',
    },
    paginationControls: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    pageBtn: {
      padding: '6px 12px',
      border: '1px solid #e2e8f0',
      borderRadius: '6px',
      background: 'white',
      cursor: 'pointer',
      color: '#64748b',
      fontSize: '14px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.2s',
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
    avatar: {
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      backgroundColor: '#eff6ff',
      color: '#3b82f6',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 'bold',
      fontSize: '16px',
      marginRight: '12px',
    },
    flexCenter: {
      display: 'flex',
      alignItems: 'center',
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
    btnView: { background: '#eff6ff', color: '#3b82f6' },
    btnApprove: { background: '#f0fdf4', color: '#16a34a' },
    btnReject: { background: '#fef2f2', color: '#ef4444' },
    
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
      maxWidth: '900px',
      maxHeight: '90vh',
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
      alignItems: 'flex-start',
      background: '#f8fafc',
    },
    modalBody: {
      padding: '24px',
      overflowY: 'auto',
      flex: 1,
    },
    tabContainer: {
      display: 'flex',
      borderBottom: '1px solid #e2e8f0',
      padding: '0 24px',
    },
    tab: {
      padding: '16px 20px',
      background: 'none',
      border: 'none',
      borderBottom: '2px solid transparent',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '500',
      color: '#64748b',
      transition: 'all 0.2s',
    },
    activeTab: {
      color: '#2563eb',
      borderBottom: '2px solid #2563eb',
    },
    sectionTitle: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#0f172a',
      marginBottom: '16px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    infoBox: {
      background: '#f8fafc',
      padding: '16px',
      borderRadius: '8px',
      border: '1px solid #e2e8f0',
    },
    infoRow: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '8px',
      fontSize: '14px',
    },
    label: { color: '#64748b' },
    value: { fontWeight: '500', color: '#334155' },
    grid2: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '24px',
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
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    dangerBtn: {
      padding: '10px 20px',
      background: 'white',
      color: '#ef4444',
      border: '1px solid #fecaca',
      borderRadius: '8px',
      fontWeight: '500',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    }
  };

  // Fetch vendors
  const { data, isLoading, error } = useQuery({
    queryKey: ['preApplications', currentPage, perPage],
    queryFn: async () => {
      const res = await getVendors({ status: 'pre_pending', per_page: perPage, page: currentPage });
      return res.data; 
    },
    keepPreviousData: true,
    staleTime: 1000 * 60
  });

  const vendors = data?.data || [];
  const meta = data?.meta || null;

  // Mutation
  const mutation = useMutation({
    mutationFn: ({ id, status, reason, commissionRate }) => updateVendorStatus(id, status, { reason, commissionRate }),
    onSuccess: () => {
      queryClient.invalidateQueries(['preApplications']);
      queryClient.invalidateQueries(['vendors']);
      setIsModalOpen(false);
      setActionModal({ type: null, vendorId: null });
      setRejectionReason('');
      setCommissionRate(10);
      toast.success('İşlem Başarılı', 'İşlem başarıyla tamamlandı.', 3000);
    },
    onError: (err) => {
      toast.error('Hata', err.response?.data?.message || err.message, 4000);
    }
  });

  const handleApprove = (id) => {
    setActionModal({ type: 'approve', vendorId: id });
  };

  const handleReject = (id) => {
    setActionModal({ type: 'reject', vendorId: id });
  };

  const submitApprove = () => {
    mutation.mutate({ id: actionModal.vendorId, status: 'active', commissionRate });
  };

  const submitReject = () => {
    if (!rejectionReason.trim()) {
      toast.warning('Uyarı', 'Lütfen bir reddetme nedeni giriniz.', 3000);
      return;
    }
    mutation.mutate({ id: actionModal.vendorId, status: 'rejected', reason: rejectionReason });
  };

  const openModal = (vendor) => {
    setSelectedVendor(vendor);
    setAdminNote(vendor.adminNotes || '');
    setActiveTab('general');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedVendor(null);
  };

  const filteredVendors = vendors.filter(v => {
    const matchesSearch = v.storeName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.owner?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' ? true : v.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  if (isLoading) return <div style={{ padding: 24 }}>Yükleniyor...</div>;
  if (error) return <div style={{ padding: 24, color: 'red' }}>Hata: {error.message}</div>;

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Ön Başvurular</h1>
          <p style={styles.subtitle}>Onay bekleyen satıcı başvurularını buradan yönetebilirsiniz.</p>
        </div>
      </div>

      {/* Filter Bar */}
      <div style={styles.filterBar}>
        <div style={styles.filterTabs}>
          {statusTabs.map(tab => (
            <button
              key={tab.id}
              style={{
                ...styles.filterTab,
                ...(statusFilter === tab.id ? styles.activeFilterTab : {})
              }}
              onClick={() => setStatusFilter(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div style={styles.searchContainer}>
          <FaSearch style={styles.searchIcon} />
          <input
            type="text"
            placeholder="Mağaza veya E-posta ara..."
            style={styles.searchInput}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Mağaza</th>
              <th style={styles.th}>Yetkili</th>
              <th style={styles.th}>İletişim</th>
              <th style={styles.th}>Başvuru Tarihi</th>
              <th style={{ ...styles.th, textAlign: 'right' }}>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {filteredVendors.length > 0 ? (
              filteredVendors.map((vendor) => (
                <tr 
                  key={vendor.id} 
                  style={{ 
                    ...styles.row, 
                    backgroundColor: hoveredRow === vendor.id ? '#f8fafc' : 'white' 
                  }}
                  onMouseEnter={() => setHoveredRow(vendor.id)}
                  onMouseLeave={() => setHoveredRow(null)}
                >
                  <td style={styles.td}>
                    <div style={styles.flexCenter}>
                      <div style={styles.avatar}>
                        {vendor.storeName?.charAt(0).toUpperCase() || <FaStore />}
                      </div>
                      <span style={{ fontWeight: '500' }}>{vendor.storeName}</span>
                    </div>
                  </td>
                  <td style={styles.td}>{vendor.owner}</td>
                  <td style={styles.td}>
                    <div style={{ display: 'flex', flexDirection: 'column', fontSize: '13px', color: '#64748b' }}>
                      <span>{vendor.email}</span>
                      <span>{vendor.phone}</span>
                    </div>
                  </td>
                  <td style={styles.td}>{vendor.joinDate}</td>
                  <td style={{ ...styles.td, textAlign: 'right' }}>
                    <button 
                      onClick={() => openModal(vendor)}
                      style={{ ...styles.actionBtn, ...styles.btnView }}
                      title="İncele"
                    >
                      <FaEye size={16} />
                    </button>
                    <button 
                      onClick={() => handleApprove(vendor.id)}
                      style={{ ...styles.actionBtn, ...styles.btnApprove }}
                      title="Onayla"
                    >
                      <FaCheck size={16} />
                    </button>
                    <button 
                      onClick={() => handleReject(vendor.id)}
                      style={{ ...styles.actionBtn, ...styles.btnReject }}
                      title="Reddet"
                    >
                      <FaTimes size={16} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ padding: '32px', textAlign: 'center', color: '#94a3b8' }}>
                  Kriterlere uygun başvuru bulunamadı.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        
        {/* Pagination Footer */}
        {meta && (
          <div style={{ padding: '16px 24px', borderTop: '1px solid #e2e8f0' }}>
            <Pagination
              currentPage={meta.current_page}
              totalPages={meta.last_page}
              totalItems={meta.total}
              perPage={meta.per_page}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>

      {/* Action Modals */}
      {actionModal.type && (
        <div style={styles.modalOverlay}>
          <div style={{ ...styles.modalContent, maxWidth: '500px', overflow: 'visible' }}>
            <div style={styles.modalHeader}>
              <h2 style={{ margin: 0, fontSize: '18px', color: '#0f172a' }}>
                {actionModal.type === 'approve' ? 'Başvuruyu Onayla' : 'Başvuruyu Reddet'}
              </h2>
              <button 
                onClick={() => setActionModal({ type: null, vendorId: null })} 
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
              >
                <FaTimes size={20} />
              </button>
            </div>
            <div style={styles.modalBody}>
              {actionModal.type === 'approve' ? (
                <div>
                  <p style={{ marginBottom: '16px', color: '#64748b' }}>
                    Bu satıcıyı onaylamak üzeresiniz. Lütfen bu satıcı için geçerli olacak komisyon oranını belirleyin.
                  </p>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#334155' }}>
                    Komisyon Oranı (%)
                  </label>
                  <input 
                    type="number" 
                    min="0" 
                    max="100"
                    value={commissionRate}
                    onChange={(e) => setCommissionRate(Number(e.target.value))}
                    style={{ 
                      width: '100%', padding: '10px', borderRadius: '8px', 
                      border: '1px solid #cbd5e1', outline: 'none' 
                    }}
                  />
                </div>
              ) : (
                <div>
                  <p style={{ marginBottom: '16px', color: '#64748b' }}>
                    Bu başvuruyu reddetmek üzeresiniz. Lütfen satıcıya iletilecek reddetme nedenini giriniz.
                  </p>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#334155' }}>
                    Reddetme Nedeni
                  </label>
                  <textarea 
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="Örn: Belgeler eksik, mağaza adı uygunsuz..."
                    style={{ 
                      width: '100%', height: '100px', padding: '10px', borderRadius: '8px', 
                      border: '1px solid #cbd5e1', outline: 'none', resize: 'none', fontFamily: 'inherit'
                    }}
                  />
                </div>
              )}
            </div>
            <div style={styles.modalFooter}>
              <button 
                onClick={() => setActionModal({ type: null, vendorId: null })} 
                style={{ ...styles.dangerBtn, color: '#64748b', borderColor: '#e2e8f0' }}
              >
                İptal
              </button>
              <button 
                onClick={actionModal.type === 'approve' ? submitApprove : submitReject} 
                style={actionModal.type === 'approve' ? styles.primaryBtn : { ...styles.dangerBtn, background: '#ef4444', color: 'white', border: 'none' }}
              >
                {actionModal.type === 'approve' ? 'Onayla ve Tamamla' : 'Reddet'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && selectedVendor && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            {/* Modal Header */}
            <div style={styles.modalHeader}>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <div style={{ 
                  width: '64px', height: '64px', borderRadius: '12px', 
                  border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', 
                  justifyContent: 'center', fontSize: '24px', color: '#3b82f6',
                  overflow: 'hidden'
                }}>
                  {selectedVendor.logo ? (
                    <img src={selectedVendor.logo} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    selectedVendor.storeName?.charAt(0).toUpperCase()
                  )}
                </div>
                <div>
                  <h2 style={{ margin: 0, fontSize: '20px', color: '#0f172a' }}>{selectedVendor.storeName}</h2>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                    <span style={{ 
                      padding: '2px 8px', background: '#fef9c3', color: '#a16207', 
                      borderRadius: '99px', fontSize: '12px', fontWeight: '500', border: '1px solid #fde047' 
                    }}>
                      Onay Bekliyor
                    </span>
                    <span style={{ fontSize: '13px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <FaCalendarAlt size={12} /> {selectedVendor.joinDate}
                    </span>
                  </div>
                </div>
              </div>
              <button 
                onClick={closeModal} 
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
              >
                <FaTimes size={24} />
              </button>
            </div>

            {/* Tabs */}
            <div style={styles.tabContainer}>
              {['general', 'address', 'documents', 'notes'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{ 
                    ...styles.tab, 
                    ...(activeTab === tab ? styles.activeTab : {}) 
                  }}
                >
                  {tab === 'general' && 'Genel Bilgiler'}
                  {tab === 'address' && 'İletişim & Finans'}
                  {tab === 'documents' && 'Belgeler'}
                  {tab === 'notes' && 'Yönetici Notu'}
                </button>
              ))}
            </div>

            {/* Content */}
            <div style={styles.modalBody}>
              {activeTab === 'general' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  <div style={styles.grid2}>
                    <div>
                      <h3 style={styles.sectionTitle}><FaUser color="#3b82f6" /> Yetkili Bilgileri</h3>
                      <div style={styles.infoBox}>
                        <div style={styles.infoRow}><span style={styles.label}>Ad Soyad:</span><span style={styles.value}>{selectedVendor.owner}</span></div>
                        <div style={styles.infoRow}><span style={styles.label}>E-posta:</span><span style={styles.value}>{selectedVendor.email}</span></div>
                        <div style={styles.infoRow}><span style={styles.label}>Telefon:</span><span style={styles.value}>{selectedVendor.phone || '-'}</span></div>
                      </div>
                    </div>
                    <div>
                      <h3 style={styles.sectionTitle}><FaGlobe color="#3b82f6" /> Sosyal Medya & Web</h3>
                      <div style={styles.infoBox}>
                        {selectedVendor.metadata?.website && (
                          <div style={{ marginBottom: 8 }}>
                            <a href={selectedVendor.metadata.website} target="_blank" rel="noreferrer" style={{ color: '#2563eb', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
                              <FaGlobe /> Website
                            </a>
                          </div>
                        )}
                        {selectedVendor.metadata?.social_media?.instagram && (
                          <div>
                            <a href={selectedVendor.metadata.social_media.instagram} target="_blank" rel="noreferrer" style={{ color: '#db2777', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
                              <FaInstagram /> Instagram
                            </a>
                          </div>
                        )}
                        {!selectedVendor.metadata?.website && !selectedVendor.metadata?.social_media && (
                          <span style={{ color: '#94a3b8', fontSize: '14px' }}>Sosyal medya bilgisi yok.</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 style={styles.sectionTitle}>Mağaza Hakkında</h3>
                    <div style={{ ...styles.infoBox, lineHeight: '1.6', color: '#475569' }}>
                      {selectedVendor.metadata?.description || 'Mağaza açıklaması girilmemiş.'}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'address' && (
                <div style={styles.grid2}>
                  <div>
                    <h3 style={styles.sectionTitle}><FaMapMarkerAlt color="#ef4444" /> Adres Bilgileri</h3>
                    <div style={styles.infoBox}>
                      {selectedVendor.addresses && selectedVendor.addresses.length > 0 ? (
                        selectedVendor.addresses.map((addr, idx) => (
                          <div key={idx} style={{ marginBottom: idx === selectedVendor.addresses.length - 1 ? 0 : 16 }}>
                            <div style={{ fontWeight: '600', color: '#1e293b' }}>{addr.title}</div>
                            <div style={{ fontSize: '14px', color: '#475569', marginTop: 4 }}>{addr.address_line}</div>
                            <div style={{ fontSize: '14px', color: '#64748b' }}>{addr.district} / {addr.city} / {addr.country}</div>
                          </div>
                        ))
                      ) : (
                        <span style={{ color: '#94a3b8' }}>{selectedVendor.address || 'Adres bilgisi yok.'}</span>
                      )}
                    </div>
                  </div>
                  <div>
                    <h3 style={styles.sectionTitle}><FaUniversity color="#16a34a" /> Banka Bilgileri</h3>
                    <div style={styles.infoBox}>
                      {selectedVendor.bank_accounts && selectedVendor.bank_accounts.length > 0 ? (
                        selectedVendor.bank_accounts.map((bank, idx) => (
                          <div key={idx} style={{ marginBottom: 16 }}>
                            <div style={{ fontWeight: '600', color: '#1e293b' }}>{bank.bank_name}</div>
                            <div style={{ 
                              fontFamily: 'monospace', background: 'white', padding: '4px 8px', 
                              border: '1px solid #e2e8f0', borderRadius: '4px', display: 'inline-block', margin: '4px 0' 
                            }}>
                              {bank.iban}
                            </div>
                            <div style={{ fontSize: '12px', color: '#64748b' }}>Sahibi: {bank.account_holder}</div>
                          </div>
                        ))
                      ) : (
                        <div style={{ color: '#94a3b8' }}>
                          <div>Banka: {selectedVendor.bankName || '-'}</div>
                          <div>IBAN: {selectedVendor.iban || '-'}</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'documents' && (
                <div>
                  <h3 style={styles.sectionTitle}>Yüklenen Belgeler</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    {selectedVendor.metadata?.documents ? (
                      selectedVendor.metadata.documents.map((doc, idx) => (
                        <div key={idx} style={{ 
                          display: 'flex', alignItems: 'center', padding: '16px', 
                          border: '1px solid #e2e8f0', borderRadius: '8px', background: '#fff' 
                        }}>
                          <div style={{ 
                            width: '40px', height: '40px', background: '#fef2f2', color: '#ef4444', 
                            borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '12px' 
                          }}>
                            <FaFilePdf size={20} />
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: '500', fontSize: '14px' }}>{doc.name}</div>
                            <div style={{ fontSize: '12px', color: '#94a3b8' }}>{doc.date || 'Tarih yok'}</div>
                          </div>
                          <button style={{ background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer' }}>
                            <FaExternalLinkAlt />
                          </button>
                        </div>
                      ))
                    ) : (
                      <div style={{ gridColumn: 'span 2', textAlign: 'center', padding: '32px', background: '#f8fafc', borderRadius: '8px', border: '1px dashed #cbd5e1', color: '#94a3b8' }}>
                        <FaFilePdf size={32} style={{ marginBottom: '8px', opacity: 0.5 }} />
                        <div>Henüz belge yüklenmemiş.</div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'notes' && (
                <div>
                  <h3 style={styles.sectionTitle}>Yönetici Notu</h3>
                  <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '8px' }}>Bu not sadece yöneticiler tarafından görülebilir.</p>
                  <textarea
                    style={{ 
                      width: '100%', height: '120px', padding: '12px', borderRadius: '8px', 
                      border: '1px solid #cbd5e1', outline: 'none', fontFamily: 'inherit', resize: 'none' 
                    }}
                    placeholder="Başvuru ile ilgili notlarınızı buraya yazabilirsiniz..."
                    value={adminNote}
                    onChange={(e) => setAdminNote(e.target.value)}
                  ></textarea>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px' }}>
                    <button style={{ padding: '8px 16px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
                      Notu Kaydet
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div style={styles.modalFooter}>
              <button onClick={() => handleReject(selectedVendor.id)} style={styles.dangerBtn}>
                <FaTimes /> Reddet
              </button>
              <button onClick={() => handleApprove(selectedVendor.id)} style={styles.primaryBtn}>
                <FaCheck /> Onayla
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PreApplications;
