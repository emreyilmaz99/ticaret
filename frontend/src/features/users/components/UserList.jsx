import React, { useState, useEffect } from 'react';
import { 
  FaSearch, FaUser, FaTrash, FaEye, FaFilter, FaTimes, 
  FaPhone, FaEnvelope, FaMapMarkerAlt, FaCalendarAlt, 
  FaVenusMars, FaCheckCircle, FaTimesCircle, FaSortAmountDown,
  FaSortAmountUp, FaToggleOn, FaToggleOff, FaEdit
} from 'react-icons/fa';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUsers, getUser, deleteUser, toggleUserStatus, updateUser } from '../api/userApi';
import { useToast } from '../../../components/common/Toast';
import Pagination from '../../../components/ui/Pagination';

const UserList = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  // State
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(15);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [filters, setFilters] = useState({
    is_active: null,
    gender: '',
    email_verified: null,
  });
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalMode, setModalMode] = useState(null); // 'view' | 'edit'
  const [editForm, setEditForm] = useState({});
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [activeTab, setActiveTab] = useState('details'); // 'details' | 'orders'
  const [userOrders, setUserOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Query
  const { data: response, isLoading } = useQuery({
    queryKey: ['users', currentPage, perPage, debouncedSearch, filters, sortBy, sortOrder],
    queryFn: () => getUsers({
      page: currentPage,
      per_page: perPage,
      search: debouncedSearch,
      is_active: filters.is_active,
      gender: filters.gender,
      email_verified: filters.email_verified,
      sort_by: sortBy,
      sort_order: sortOrder,
    }),
    keepPreviousData: true,
  });

  const users = response?.data?.data ?? [];
  const meta = response?.data?.meta ?? null;

  // User Detail Query
  const { data: userDetailResponse, isLoading: userDetailLoading } = useQuery({
    queryKey: ['user', selectedUser?.id],
    queryFn: () => getUser(selectedUser.id),
    enabled: !!selectedUser?.id && modalMode !== null,
  });
  const userDetail = userDetailResponse?.data ?? null;

  // Mutations
  const deleteMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
      toast.success('Başarılı', 'Kullanıcı silindi.');
      setConfirmDelete(null);
    },
    onError: () => {
      toast.error('Hata', 'Kullanıcı silinemedi.');
    }
  });

  const toggleStatusMutation = useMutation({
    mutationFn: toggleUserStatus,
    onSuccess: (data) => {
      queryClient.invalidateQueries(['users']);
      queryClient.invalidateQueries(['user', selectedUser?.id]);
      toast.success('Başarılı', data.message);
    },
    onError: () => {
      toast.error('Hata', 'Durum değiştirilemedi.');
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
      queryClient.invalidateQueries(['user', selectedUser?.id]);
      toast.success('Başarılı', 'Kullanıcı güncellendi.');
      setModalMode('view');
    },
    onError: (err) => {
      toast.error('Hata', err.response?.data?.message || 'Güncelleme başarısız.');
    }
  });

  // Handlers
  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
    setCurrentPage(1);
  };

  const openViewModal = (user) => {
    setSelectedUser(user);
    setModalMode('view');
    setActiveTab('details');
  };

  const openEditModal = () => {
    if (userDetail) {
      setEditForm({
        name: userDetail.name || '',
        email: userDetail.email || '',
        phone: userDetail.phone || '',
        gender: userDetail.gender || '',
        birth_date: userDetail.birth_date || '',
        is_active: userDetail.is_active ?? true,
      });
      setModalMode('edit');
    }
  };

  const closeModal = () => {
    setSelectedUser(null);
    setModalMode(null);
    setEditForm({});
    setActiveTab('details');
    setUserOrders([]);
  };

  // Kullanıcı siparişlerini yükle
  const loadUserOrders = async (userId) => {
    setLoadingOrders(true);
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`http://127.0.0.1:8000/api/v1/admin/users/${userId}/orders`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setUserOrders(data.data.orders || []);
      }
    } catch (error) {
      console.error('Siparişler yüklenirken hata:', error);
    } finally {
      setLoadingOrders(false);
    }
  };

  // Siparişler sekmesine geçildiğinde yükle
  useEffect(() => {
    if (activeTab === 'orders' && selectedUser?.id && userOrders.length === 0) {
      loadUserOrders(selectedUser.id);
    }
  }, [activeTab, selectedUser?.id]);

  const handleEditSubmit = (e) => {
    e.preventDefault();
    updateMutation.mutate({ id: selectedUser.id, data: editForm });
  };

  const resetFilters = () => {
    setFilters({ is_active: null, gender: '', email_verified: null });
    setSearchTerm('');
    setCurrentPage(1);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const formatDateTime = (dateStr) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleString('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getGenderText = (gender) => {
    switch (gender) {
      case 'male': return 'Erkek';
      case 'female': return 'Kadın';
      case 'other': return 'Diğer';
      default: return '-';
    }
  };

  // Styles
  const styles = {
    container: { display: 'flex', flexDirection: 'column', gap: '24px' },
    card: {
      backgroundColor: 'var(--bg-card, white)',
      borderRadius: '12px',
      border: '1px solid #e2e8f0',
      boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
    },
    headerCard: {
      padding: '20px 24px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '16px',
    },
    searchWrapper: {
      position: 'relative',
      flex: '1',
      maxWidth: '400px',
      minWidth: '250px',
    },
    searchInput: {
      width: '100%',
      padding: '10px 12px 10px 40px',
      borderRadius: '8px',
      border: '1px solid #e2e8f0',
      outline: 'none',
      fontSize: '14px',
    },
    searchIcon: {
      position: 'absolute',
      left: '14px',
      top: '50%',
      transform: 'translateY(-50%)',
      color: '#94a3b8',
    },
    btn: {
      padding: '10px 16px',
      borderRadius: '8px',
      border: '1px solid #e2e8f0',
      backgroundColor: 'white',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      fontSize: '14px',
      fontWeight: '500',
      color: '#475569',
      transition: 'all 0.2s',
    },
    btnPrimary: {
      backgroundColor: '#3b82f6',
      borderColor: '#3b82f6',
      color: 'white',
    },
    btnDanger: {
      backgroundColor: '#ef4444',
      borderColor: '#ef4444',
      color: 'white',
    },
    filterPanel: {
      padding: '16px 24px',
      borderTop: '1px solid #e2e8f0',
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
      gap: '16px',
      alignItems: 'end',
    },
    filterGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: '6px',
    },
    filterLabel: {
      fontSize: '12px',
      fontWeight: '600',
      color: '#64748b',
      textTransform: 'uppercase',
    },
    filterSelect: {
      padding: '8px 12px',
      borderRadius: '6px',
      border: '1px solid #e2e8f0',
      outline: 'none',
      fontSize: '14px',
    },
    table: { width: '100%', borderCollapse: 'collapse' },
    th: {
      padding: '14px 20px',
      textAlign: 'left',
      fontSize: '12px',
      fontWeight: '600',
      color: '#64748b',
      textTransform: 'uppercase',
      backgroundColor: '#f8fafc',
      borderBottom: '1px solid #e2e8f0',
      cursor: 'pointer',
      userSelect: 'none',
    },
    td: {
      padding: '16px 20px',
      borderBottom: '1px solid #f1f5f9',
      color: '#334155',
      fontSize: '14px',
    },
    avatar: {
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      backgroundColor: '#e0e7ff',
      color: '#4338ca',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '16px',
      flexShrink: 0,
      overflow: 'hidden',
    },
    badge: (color) => ({
      display: 'inline-flex',
      alignItems: 'center',
      gap: '4px',
      padding: '4px 10px',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: '600',
      backgroundColor: color === 'green' ? '#d1fae5' : color === 'red' ? '#fee2e2' : color === 'yellow' ? '#fef3c7' : '#f1f5f9',
      color: color === 'green' ? '#047857' : color === 'red' ? '#dc2626' : color === 'yellow' ? '#b45309' : '#475569',
    }),
    actionBtn: (color) => ({
      padding: '8px',
      borderRadius: '6px',
      border: 'none',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: color === 'blue' ? '#eff6ff' : color === 'red' ? '#fef2f2' : color === 'green' ? '#ecfdf5' : '#f1f5f9',
      color: color === 'blue' ? '#2563eb' : color === 'red' ? '#dc2626' : color === 'green' ? '#059669' : '#64748b',
      transition: 'all 0.2s',
    }),
    modalOverlay: {
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      backdropFilter: 'blur(4px)',
    },
    modalContent: {
      backgroundColor: 'white',
      borderRadius: '16px',
      width: '100%',
      maxWidth: '600px',
      maxHeight: '90vh',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
    },
    modalHeader: {
      padding: '20px 24px',
      borderBottom: '1px solid #e2e8f0',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    modalBody: {
      padding: '24px',
      overflowY: 'auto',
      flex: 1,
    },
    modalFooter: {
      padding: '16px 24px',
      borderTop: '1px solid #e2e8f0',
      display: 'flex',
      justifyContent: 'flex-end',
      gap: '12px',
      backgroundColor: '#f8fafc',
    },
    infoGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '20px',
    },
    infoItem: {
      display: 'flex',
      flexDirection: 'column',
      gap: '4px',
    },
    infoLabel: {
      fontSize: '12px',
      color: '#64748b',
      fontWeight: '600',
      textTransform: 'uppercase',
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
    },
    infoValue: {
      fontSize: '15px',
      color: '#0f172a',
      fontWeight: '500',
    },
    formGroup: {
      marginBottom: '16px',
    },
    formLabel: {
      display: 'block',
      fontSize: '14px',
      fontWeight: '500',
      color: '#334155',
      marginBottom: '6px',
    },
    formInput: {
      width: '100%',
      padding: '10px 12px',
      borderRadius: '8px',
      border: '1px solid #e2e8f0',
      outline: 'none',
      fontSize: '14px',
    },
    stats: {
      display: 'flex',
      gap: '24px',
      alignItems: 'center',
      color: '#64748b',
      fontSize: '14px',
    },
  };

  return (
    <div style={styles.container}>
      {/* Header & Search */}
      <div style={{ ...styles.card }}>
        <div style={styles.headerCard}>
          <div style={styles.searchWrapper}>
            <FaSearch style={styles.searchIcon} />
            <input
              type="text"
              placeholder="İsim, email veya telefon ile ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={styles.searchInput}
            />
          </div>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <div style={styles.stats}>
              <span>Toplam: <strong>{meta?.total || 0}</strong></span>
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              style={{
                ...styles.btn,
                ...(showFilters ? { backgroundColor: '#f1f5f9' } : {}),
              }}
            >
              <FaFilter /> Filtreler
            </button>
          </div>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div style={styles.filterPanel}>
            <div style={styles.filterGroup}>
              <label style={styles.filterLabel}>Durum</label>
              <select
                value={filters.is_active === null ? '' : filters.is_active.toString()}
                onChange={(e) => {
                  const val = e.target.value;
                  setFilters({ ...filters, is_active: val === '' ? null : val === 'true' });
                  setCurrentPage(1);
                }}
                style={styles.filterSelect}
              >
                <option value="">Tümü</option>
                <option value="true">Aktif</option>
                <option value="false">Pasif</option>
              </select>
            </div>

            <div style={styles.filterGroup}>
              <label style={styles.filterLabel}>Cinsiyet</label>
              <select
                value={filters.gender}
                onChange={(e) => {
                  setFilters({ ...filters, gender: e.target.value });
                  setCurrentPage(1);
                }}
                style={styles.filterSelect}
              >
                <option value="">Tümü</option>
                <option value="male">Erkek</option>
                <option value="female">Kadın</option>
                <option value="other">Diğer</option>
              </select>
            </div>

            <div style={styles.filterGroup}>
              <label style={styles.filterLabel}>Email Doğrulama</label>
              <select
                value={filters.email_verified === null ? '' : filters.email_verified.toString()}
                onChange={(e) => {
                  const val = e.target.value;
                  setFilters({ ...filters, email_verified: val === '' ? null : val === 'true' });
                  setCurrentPage(1);
                }}
                style={styles.filterSelect}
              >
                <option value="">Tümü</option>
                <option value="true">Doğrulanmış</option>
                <option value="false">Doğrulanmamış</option>
              </select>
            </div>

            <div style={styles.filterGroup}>
              <label style={styles.filterLabel}>&nbsp;</label>
              <button onClick={resetFilters} style={{ ...styles.btn, padding: '8px 12px' }}>
                <FaTimes size={12} /> Temizle
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Table */}
      <div style={{ ...styles.card, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Kullanıcı</th>
                <th style={styles.th} onClick={() => handleSort('email')}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    Email
                    {sortBy === 'email' && (sortOrder === 'asc' ? <FaSortAmountUp size={12} /> : <FaSortAmountDown size={12} />)}
                  </div>
                </th>
                <th style={styles.th}>Telefon</th>
                <th style={styles.th}>Durum</th>
                <th style={styles.th}>Email Doğrulama</th>
                <th style={styles.th} onClick={() => handleSort('last_login_at')}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    Son Giriş
                    {sortBy === 'last_login_at' && (sortOrder === 'asc' ? <FaSortAmountUp size={12} /> : <FaSortAmountDown size={12} />)}
                  </div>
                </th>
                <th style={styles.th} onClick={() => handleSort('created_at')}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    Kayıt Tarihi
                    {sortBy === 'created_at' && (sortOrder === 'asc' ? <FaSortAmountUp size={12} /> : <FaSortAmountDown size={12} />)}
                  </div>
                </th>
                <th style={{ ...styles.th, textAlign: 'right' }}>İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={8} style={{ padding: '48px', textAlign: 'center', color: '#64748b' }}>
                    Yükleniyor...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ padding: '48px', textAlign: 'center', color: '#64748b' }}>
                    Kullanıcı bulunamadı.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} style={{ transition: 'background-color 0.2s' }}>
                    <td style={styles.td}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={styles.avatar}>
                          {user.avatar ? (
                            <img src={user.avatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : (
                            <FaUser />
                          )}
                        </div>
                        <div>
                          <div style={{ fontWeight: '600', color: '#0f172a' }}>{user.name}</div>
                          <div style={{ fontSize: '12px', color: '#94a3b8' }}>ID: #{user.id}</div>
                        </div>
                      </div>
                    </td>
                    <td style={styles.td}>{user.email}</td>
                    <td style={styles.td}>{user.phone || '-'}</td>
                    <td style={styles.td}>
                      <span style={styles.badge(user.is_active ? 'green' : 'red')}>
                        {user.is_active ? <FaCheckCircle size={10} /> : <FaTimesCircle size={10} />}
                        {user.is_active ? 'Aktif' : 'Pasif'}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <span style={styles.badge(user.email_verified_at ? 'green' : 'yellow')}>
                        {user.email_verified_at ? 'Doğrulanmış' : 'Bekliyor'}
                      </span>
                    </td>
                    <td style={styles.td}>{formatDateTime(user.last_login_at)}</td>
                    <td style={styles.td}>{formatDate(user.created_at)}</td>
                    <td style={{ ...styles.td, textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                        <button
                          onClick={() => openViewModal(user)}
                          style={styles.actionBtn('blue')}
                          title="Detay"
                        >
                          <FaEye />
                        </button>
                        <button
                          onClick={() => toggleStatusMutation.mutate(user.id)}
                          style={styles.actionBtn(user.is_active ? 'gray' : 'green')}
                          title={user.is_active ? 'Pasife Al' : 'Aktif Et'}
                        >
                          {user.is_active ? <FaToggleOff /> : <FaToggleOn />}
                        </button>
                        <button
                          onClick={() => setConfirmDelete(user)}
                          style={styles.actionBtn('red')}
                          title="Sil"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {meta && meta.last_page > 1 && (
          <div style={{ padding: '16px 24px', borderTop: '1px solid #f1f5f9' }}>
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

      {/* User Detail / Edit Modal */}
      {modalMode && selectedUser && (
        <div style={styles.modalOverlay} onClick={closeModal}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#0f172a', margin: 0 }}>
                {modalMode === 'view' ? 'Kullanıcı Detayı' : 'Kullanıcı Düzenle'}
              </h2>
              <button onClick={closeModal} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>
                <FaTimes size={20} />
              </button>
            </div>

            {/* Tabs */}
            {modalMode === 'view' && (
              <div style={{ display: 'flex', borderBottom: '2px solid #f1f5f9', padding: '0 24px' }}>
                <button
                  onClick={() => setActiveTab('details')}
                  style={{
                    padding: '12px 20px',
                    border: 'none',
                    background: 'none',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: activeTab === 'details' ? '600' : '400',
                    color: activeTab === 'details' ? '#3b82f6' : '#64748b',
                    borderBottom: activeTab === 'details' ? '2px solid #3b82f6' : 'none',
                    marginBottom: '-2px'
                  }}
                >
                  Detaylar
                </button>
                <button
                  onClick={() => setActiveTab('orders')}
                  style={{
                    padding: '12px 20px',
                    border: 'none',
                    background: 'none',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: activeTab === 'orders' ? '600' : '400',
                    color: activeTab === 'orders' ? '#3b82f6' : '#64748b',
                    borderBottom: activeTab === 'orders' ? '2px solid #3b82f6' : 'none',
                    marginBottom: '-2px'
                  }}
                >
                  Siparişler {userOrders.length > 0 && `(${userOrders.length})`}
                </button>
              </div>
            )}

            <div style={styles.modalBody}>
              {userDetailLoading ? (
                <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>Yükleniyor...</div>
              ) : modalMode === 'view' && userDetail ? (
                <>
                  {/* Detaylar Tab */}
                  {activeTab === 'details' && (
                    <>
                      {/* User Header */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px', paddingBottom: '24px', borderBottom: '1px solid #e2e8f0' }}>
                        <div style={{ ...styles.avatar, width: '64px', height: '64px', fontSize: '24px' }}>
                          {userDetail.avatar ? (
                            <img src={userDetail.avatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : (
                            <FaUser />
                          )}
                        </div>
                        <div>
                          <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#0f172a', margin: 0 }}>{userDetail.name}</h3>
                          <p style={{ color: '#64748b', margin: '4px 0 0' }}>ID: #{userDetail.id}</p>
                        </div>
                        <div style={{ marginLeft: 'auto' }}>
                          <span style={styles.badge(userDetail.is_active ? 'green' : 'red')}>
                            {userDetail.is_active ? 'Aktif' : 'Pasif'}
                          </span>
                        </div>
                      </div>

                      {/* Info Grid */}
                      <div style={styles.infoGrid}>
                        <div style={styles.infoItem}>
                          <span style={styles.infoLabel}><FaEnvelope size={12} /> Email</span>
                          <span style={styles.infoValue}>{userDetail.email}</span>
                        </div>
                        <div style={styles.infoItem}>
                          <span style={styles.infoLabel}><FaPhone size={12} /> Telefon</span>
                          <span style={styles.infoValue}>{userDetail.phone || '-'}</span>
                        </div>
                        <div style={styles.infoItem}>
                          <span style={styles.infoLabel}><FaVenusMars size={12} /> Cinsiyet</span>
                          <span style={styles.infoValue}>{getGenderText(userDetail.gender)}</span>
                        </div>
                        <div style={styles.infoItem}>
                          <span style={styles.infoLabel}><FaCalendarAlt size={12} /> Doğum Tarihi</span>
                          <span style={styles.infoValue}>{formatDate(userDetail.birth_date)}</span>
                        </div>
                        <div style={styles.infoItem}>
                          <span style={styles.infoLabel}><FaCheckCircle size={12} /> Email Doğrulama</span>
                          <span style={styles.infoValue}>
                            {userDetail.email_verified_at ? (
                              <span style={{ color: '#059669' }}>Doğrulanmış ({formatDateTime(userDetail.email_verified_at)})</span>
                            ) : (
                              <span style={{ color: '#f59e0b' }}>Doğrulanmamış</span>
                            )}
                          </span>
                        </div>
                        <div style={styles.infoItem}>
                          <span style={styles.infoLabel}><FaCalendarAlt size={12} /> Son Giriş</span>
                          <span style={styles.infoValue}>{formatDateTime(userDetail.last_login_at)}</span>
                        </div>
                        <div style={styles.infoItem}>
                          <span style={styles.infoLabel}><FaMapMarkerAlt size={12} /> Adres Sayısı</span>
                          <span style={styles.infoValue}>{userDetail.addresses_count ?? userDetail.addresses?.length ?? 0} adet</span>
                        </div>
                        <div style={styles.infoItem}>
                          <span style={styles.infoLabel}><FaCalendarAlt size={12} /> Kayıt Tarihi</span>
                          <span style={styles.infoValue}>{formatDateTime(userDetail.created_at)}</span>
                        </div>
                      </div>

                      {/* Addresses */}
                      {userDetail.addresses && userDetail.addresses.length > 0 && (
                        <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid #e2e8f0' }}>
                          <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#0f172a', marginBottom: '12px' }}>Kayıtlı Adresler</h4>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {userDetail.addresses.map((addr, idx) => (
                              <div key={idx} style={{ padding: '12px', backgroundColor: '#f8fafc', borderRadius: '8px', fontSize: '14px' }}>
                                <div style={{ fontWeight: '600', marginBottom: '4px' }}>
                                  {addr.title || `Adres ${idx + 1}`}
                                  {addr.is_default && <span style={{ marginLeft: '8px', fontSize: '11px', color: '#059669' }}>(Varsayılan)</span>}
                                </div>
                                <div style={{ color: '#64748b' }}>
                                  {addr.address_line}, {addr.district}/{addr.city}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  {/* Siparişler Tab */}
                  {activeTab === 'orders' && (
                    <div>
                      {loadingOrders ? (
                        <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                          Siparişler yükleniyor...
                        </div>
                      ) : userOrders.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                          Bu kullanıcının henüz siparişi bulunmuyor.
                        </div>
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                          {userOrders.map((order) => (
                            <div
                              key={order.id}
                              style={{
                                padding: '16px',
                                backgroundColor: '#f8fafc',
                                border: '1px solid #e2e8f0',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor = '#3b82f6';
                                e.currentTarget.style.backgroundColor = '#eff6ff';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor = '#e2e8f0';
                                e.currentTarget.style.backgroundColor = '#f8fafc';
                              }}
                              onClick={() => window.location.href = `/admin/orders?id=${order.id}`}
                            >
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
                                <div>
                                  <div style={{ fontSize: '14px', fontWeight: '600', color: '#0f172a' }}>
                                    Sipariş #{order.order_number}
                                  </div>
                                  <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                                    {new Date(order.created_at).toLocaleDateString('tr-TR', { 
                                      year: 'numeric', 
                                      month: 'long', 
                                      day: 'numeric',
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })}
                                  </div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                  <span style={{
                                    ...styles.badge(
                                      order.status === 'delivered' ? 'green' :
                                      order.status === 'cancelled' ? 'red' :
                                      order.status === 'pending' ? 'yellow' : 'blue'
                                    ),
                                    marginBottom: '4px',
                                    display: 'inline-block'
                                  }}>
                                    {order.status === 'pending' ? 'Beklemede' :
                                     order.status === 'processing' ? 'İşleniyor' :
                                     order.status === 'shipped' ? 'Kargoda' :
                                     order.status === 'delivered' ? 'Teslim Edildi' :
                                     order.status === 'cancelled' ? 'İptal Edildi' : order.status}
                                  </span>
                                  <div style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a', marginTop: '4px' }}>
                                    ₺{parseFloat(order.total).toFixed(2)}
                                  </div>
                                </div>
                              </div>
                              <div style={{ 
                                fontSize: '12px', 
                                color: order.payment_status === 'paid' ? '#059669' : 
                                       order.payment_status === 'pending' ? '#f59e0b' : '#dc2626',
                                fontWeight: '500'
                              }}>
                                Ödeme: {order.payment_status === 'paid' ? 'Ödendi' :
                                        order.payment_status === 'pending' ? 'Beklemede' :
                                        order.payment_status === 'failed' ? 'Başarısız' : 
                                        order.payment_status === 'refunded' ? 'İade Edildi' : order.payment_status}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </>
              ) : modalMode === 'edit' ? (
                <form onSubmit={handleEditSubmit}>
                  <div style={styles.formGroup}>
                    <label style={styles.formLabel}>Ad Soyad</label>
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      style={styles.formInput}
                      required
                    />
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.formLabel}>Email</label>
                    <input
                      type="email"
                      value={editForm.email}
                      onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                      style={styles.formInput}
                      required
                    />
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.formLabel}>Telefon</label>
                    <input
                      type="text"
                      value={editForm.phone}
                      onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                      style={styles.formInput}
                    />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div style={styles.formGroup}>
                      <label style={styles.formLabel}>Cinsiyet</label>
                      <select
                        value={editForm.gender}
                        onChange={(e) => setEditForm({ ...editForm, gender: e.target.value })}
                        style={styles.formInput}
                      >
                        <option value="">Belirtilmemiş</option>
                        <option value="male">Erkek</option>
                        <option value="female">Kadın</option>
                        <option value="other">Diğer</option>
                      </select>
                    </div>
                    <div style={styles.formGroup}>
                      <label style={styles.formLabel}>Doğum Tarihi</label>
                      <input
                        type="date"
                        value={editForm.birth_date}
                        onChange={(e) => setEditForm({ ...editForm, birth_date: e.target.value })}
                        style={styles.formInput}
                      />
                    </div>
                  </div>
                  <div style={styles.formGroup}>
                    <label style={{ ...styles.formLabel, display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <input
                        type="checkbox"
                        checked={editForm.is_active}
                        onChange={(e) => setEditForm({ ...editForm, is_active: e.target.checked })}
                        style={{ width: '16px', height: '16px' }}
                      />
                      Aktif Kullanıcı
                    </label>
                  </div>
                </form>
              ) : null}
            </div>

            <div style={styles.modalFooter}>
              {modalMode === 'view' ? (
                <>
                  <button onClick={closeModal} style={styles.btn}>Kapat</button>
                  <button onClick={openEditModal} style={{ ...styles.btn, ...styles.btnPrimary }}>
                    <FaEdit /> Düzenle
                  </button>
                </>
              ) : (
                <>
                  <button onClick={() => setModalMode('view')} style={styles.btn}>İptal</button>
                  <button onClick={handleEditSubmit} style={{ ...styles.btn, ...styles.btnPrimary }} disabled={updateMutation.isLoading}>
                    {updateMutation.isLoading ? 'Kaydediliyor...' : 'Kaydet'}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {confirmDelete && (
        <div style={styles.modalOverlay} onClick={() => setConfirmDelete(null)}>
          <div style={{ ...styles.modalContent, maxWidth: '400px' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ padding: '24px', textAlign: 'center' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: '#fee2e2', color: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: '24px' }}>
                <FaTrash />
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#0f172a', marginBottom: '8px' }}>Kullanıcıyı Sil</h3>
              <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '24px' }}>
                <strong>{confirmDelete.name}</strong> kullanıcısını silmek istediğinize emin misiniz? Bu işlem geri alınamaz.
              </p>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                <button onClick={() => setConfirmDelete(null)} style={{ ...styles.btn, flex: 1 }}>İptal</button>
                <button
                  onClick={() => deleteMutation.mutate(confirmDelete.id)}
                  style={{ ...styles.btn, ...styles.btnDanger, flex: 1 }}
                  disabled={deleteMutation.isLoading}
                >
                  {deleteMutation.isLoading ? 'Siliniyor...' : 'Sil'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserList;
