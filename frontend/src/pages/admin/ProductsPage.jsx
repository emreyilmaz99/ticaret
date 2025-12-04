import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  FaBox, FaSearch, FaFilter, FaCheck, FaTimes, FaEye, FaTrash,
  FaClock, FaCheckCircle, FaTimesCircle, FaStore, FaImage
} from 'react-icons/fa';
import Pagination from '../../components/ui/Pagination';
import { getProducts, getProductStatistics, updateProductStatus, bulkUpdateProductStatus, deleteProduct } from '../../features/admin/api/productApi';
import { useToast } from '../../components/Toast';
import axios from '../../lib/axios';

const ProductsPage = () => {
  const queryClient = useQueryClient();
  const toast = useToast();
  
  // State
  const [filters, setFilters] = useState({
    status: 'all',
    search: '',
    page: 1
  });
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [viewProduct, setViewProduct] = useState(null);
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, action: null, data: null });
  const [rejectModal, setRejectModal] = useState({ isOpen: false, productId: null, productName: '', isBulk: false });
  const [rejectionReason, setRejectionReason] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [lightboxImage, setLightboxImage] = useState(null);

  // Backend URL for images
  const backendOrigin = (axios.defaults.baseURL || '').replace(/\/api\/?$/i, '');
  const toFullUrl = (u) => {
    if (!u) return null;
    if (u.startsWith('http')) return u;
    return `${backendOrigin}${u.startsWith('/') ? '' : '/'}${u}`;
  };

  // Queries
  const { data: productsData, isLoading } = useQuery({
    queryKey: ['adminProducts', filters],
    queryFn: () => getProducts({ 
      status: filters.status !== 'all' ? filters.status : undefined,
      search: filters.search || undefined,
      page: filters.page,
      per_page: 20
    })
  });

  const { data: statsData } = useQuery({
    queryKey: ['adminProductStats'],
    queryFn: getProductStatistics
  });

  const products = productsData?.data ?? [];
  const pagination = productsData?.meta ?? {};
  const stats = statsData?.data ?? {};

  // Mutations
  const statusMutation = useMutation({
    mutationFn: ({ id, status, rejectionReason }) => updateProductStatus(id, status, rejectionReason),
    onSuccess: (data) => {
      queryClient.invalidateQueries(['adminProducts']);
      queryClient.invalidateQueries(['adminProductStats']);
      toast.success('Başarılı', data.message || 'Ürün durumu güncellendi');
      setRejectModal({ isOpen: false, productId: null, productName: '', isBulk: false });
      setRejectionReason('');
    },
    onError: (err) => {
      toast.error('Hata', err.response?.data?.message || 'İşlem başarısız');
    }
  });

  const bulkStatusMutation = useMutation({
    mutationFn: ({ productIds, status, rejectionReason }) => bulkUpdateProductStatus(productIds, status, rejectionReason),
    onSuccess: (data) => {
      queryClient.invalidateQueries(['adminProducts']);
      queryClient.invalidateQueries(['adminProductStats']);
      setSelectedProducts([]);
      toast.success('Başarılı', data.message || 'Ürünler güncellendi');
      setRejectModal({ isOpen: false, productId: null, productName: '', isBulk: false });
      setRejectionReason('');
    },
    onError: (err) => {
      toast.error('Hata', err.response?.data?.message || 'İşlem başarısız');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['adminProducts']);
      queryClient.invalidateQueries(['adminProductStats']);
      toast.success('Başarılı', 'Ürün silindi');
    },
    onError: (err) => {
      toast.error('Hata', err.response?.data?.message || 'Silme işlemi başarısız');
    }
  });

  // Handlers
  const handleStatusChange = (id, status, productName = '') => {
    if (status === 'rejected') {
      setRejectModal({ isOpen: true, productId: id, productName, isBulk: false });
    } else {
      statusMutation.mutate({ id, status });
    }
  };

  const handleBulkAction = (status) => {
    if (selectedProducts.length === 0) {
      toast.warning('Uyarı', 'Lütfen en az bir ürün seçin');
      return;
    }
    if (status === 'rejected') {
      setRejectModal({ isOpen: true, productId: null, productName: `${selectedProducts.length} ürün`, isBulk: true });
    } else {
      bulkStatusMutation.mutate({ productIds: selectedProducts, status });
    }
  };

  const handleRejectSubmit = () => {
    if (!rejectionReason.trim()) {
      toast.warning('Uyarı', 'Lütfen red sebebini belirtin');
      return;
    }
    if (rejectModal.isBulk) {
      bulkStatusMutation.mutate({ productIds: selectedProducts, status: 'rejected', rejectionReason });
    } else {
      statusMutation.mutate({ id: rejectModal.productId, status: 'rejected', rejectionReason });
    }
    setViewProduct(null);
  };

  const toggleSelectAll = () => {
    if (selectedProducts.length === products.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(products.map(p => p.id));
    }
  };

  const toggleSelect = (id) => {
    setSelectedProducts(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  // Status badge
  const getStatusBadge = (status) => {
    const config = {
      pending: { bg: '#fef3c7', color: '#b45309', icon: FaClock, label: 'Onay Bekliyor' },
      active: { bg: '#d1fae5', color: '#047857', icon: FaCheckCircle, label: 'Yayında' },
      rejected: { bg: '#fee2e2', color: '#dc2626', icon: FaTimesCircle, label: 'Reddedildi' },
      draft: { bg: '#f1f5f9', color: '#475569', icon: FaBox, label: 'Taslak' },
      inactive: { bg: '#e2e8f0', color: '#64748b', icon: FaBox, label: 'Pasif' },
      banned: { bg: '#fecaca', color: '#991b1b', icon: FaTimesCircle, label: 'Yasaklı' }
    };
    const c = config[status] || config.draft;
    const Icon = c.icon;
    return (
      <span style={{ 
        display: 'inline-flex', alignItems: 'center', gap: '6px',
        padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600',
        backgroundColor: c.bg, color: c.color
      }}>
        <Icon size={12} /> {c.label}
      </span>
    );
  };

  // Styles
  const styles = {
    container: { padding: '24px', fontFamily: "'Inter', sans-serif" },
    header: { marginBottom: '32px' },
    title: { fontSize: '24px', fontWeight: '700', color: '#0f172a' },
    subtitle: { color: '#64748b', marginTop: '4px' },
    statsRow: { display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px', marginBottom: '24px' },
    statCard: (active) => ({ 
      padding: '20px', borderRadius: '12px', backgroundColor: 'white', 
      border: active ? '2px solid #4f46e5' : '1px solid #e2e8f0',
      cursor: 'pointer', transition: 'all 0.2s'
    }),
    statValue: { fontSize: '28px', fontWeight: '700', color: '#0f172a' },
    statLabel: { fontSize: '13px', color: '#64748b', marginTop: '4px' },
    filterBar: { 
      display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '24px', 
      padding: '16px', backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e2e8f0'
    },
    searchInput: { 
      flex: 1, padding: '10px 16px 10px 40px', borderRadius: '8px', 
      border: '1px solid #e2e8f0', outline: 'none', fontSize: '14px'
    },
    table: { width: '100%', borderCollapse: 'collapse', backgroundColor: 'white', borderRadius: '12px', overflow: 'hidden', border: '1px solid #e2e8f0' },
    th: { padding: '16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' },
    td: { padding: '16px', borderBottom: '1px solid #f1f5f9', color: '#334155', fontSize: '14px' },
    btn: (variant) => ({
      padding: '6px 12px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: '500',
      backgroundColor: variant === 'success' ? '#d1fae5' : variant === 'danger' ? '#fee2e2' : variant === 'primary' ? '#4f46e5' : '#f1f5f9',
      color: variant === 'success' ? '#047857' : variant === 'danger' ? '#dc2626' : variant === 'primary' ? 'white' : '#475569'
    }),
    modalOverlay: { position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
    modalContent: { backgroundColor: 'white', borderRadius: '16px', maxWidth: '800px', width: '90%', maxHeight: '90vh', overflow: 'auto' }
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>Ürün Yönetimi</h1>
        <p style={styles.subtitle}>Satıcıların eklediği ürünleri onaylayın veya reddedin</p>
      </div>

      {/* Stats Cards */}
      <div style={styles.statsRow}>
        <div style={styles.statCard(filters.status === 'all')} onClick={() => setFilters(f => ({...f, status: 'all', page: 1}))}>
          <div style={{...styles.statValue, color: '#4f46e5'}}>{stats.total || 0}</div>
          <div style={styles.statLabel}>Toplam Ürün</div>
        </div>
        <div style={styles.statCard(filters.status === 'pending')} onClick={() => setFilters(f => ({...f, status: 'pending', page: 1}))}>
          <div style={{...styles.statValue, color: '#b45309'}}>{stats.pending || 0}</div>
          <div style={styles.statLabel}>Onay Bekleyen</div>
        </div>
        <div style={styles.statCard(filters.status === 'active')} onClick={() => setFilters(f => ({...f, status: 'active', page: 1}))}>
          <div style={{...styles.statValue, color: '#047857'}}>{stats.active || 0}</div>
          <div style={styles.statLabel}>Yayında</div>
        </div>
        <div style={styles.statCard(filters.status === 'rejected')} onClick={() => setFilters(f => ({...f, status: 'rejected', page: 1}))}>
          <div style={{...styles.statValue, color: '#dc2626'}}>{stats.rejected || 0}</div>
          <div style={styles.statLabel}>Reddedilen</div>
        </div>
        <div style={styles.statCard(filters.status === 'draft')} onClick={() => setFilters(f => ({...f, status: 'draft', page: 1}))}>
          <div style={{...styles.statValue, color: '#475569'}}>{stats.draft || 0}</div>
          <div style={styles.statLabel}>Taslak</div>
        </div>
      </div>

      {/* Filter Bar */}
      <div style={styles.filterBar}>
        <div style={{ position: 'relative', flex: 1 }}>
          <FaSearch style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input 
            type="text"
            placeholder="Ürün adı veya SKU ara..."
            value={filters.search}
            onChange={(e) => setFilters(f => ({...f, search: e.target.value, page: 1}))}
            style={styles.searchInput}
          />
        </div>
        
        {selectedProducts.length > 0 && (
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span style={{ fontSize: '13px', color: '#64748b' }}>{selectedProducts.length} seçili</span>
            <button onClick={() => handleBulkAction('active')} style={styles.btn('success')}>
              <FaCheck style={{ marginRight: '4px' }} /> Onayla
            </button>
            <button onClick={() => handleBulkAction('rejected')} style={styles.btn('danger')}>
              <FaTimes style={{ marginRight: '4px' }} /> Reddet
            </button>
          </div>
        )}
      </div>

      {/* Products Table */}
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>
              <input 
                type="checkbox" 
                checked={selectedProducts.length === products.length && products.length > 0}
                onChange={toggleSelectAll}
              />
            </th>
            <th style={styles.th}>Ürün</th>
            <th style={styles.th}>Satıcı</th>
            <th style={styles.th}>Fiyat</th>
            <th style={styles.th}>Stok</th>
            <th style={styles.th}>Durum</th>
            <th style={styles.th}>Tarih</th>
            <th style={{...styles.th, textAlign: 'right'}}>İşlemler</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr><td colSpan={8} style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>Yükleniyor...</td></tr>
          ) : products.length === 0 ? (
            <tr><td colSpan={8} style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>Ürün bulunamadı</td></tr>
          ) : products.map(product => (
            <tr key={product.id}>
              <td style={styles.td}>
                <input 
                  type="checkbox" 
                  checked={selectedProducts.includes(product.id)}
                  onChange={() => toggleSelect(product.id)}
                />
              </td>
              <td style={styles.td}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ 
                    width: '48px', height: '48px', borderRadius: '8px', 
                    backgroundColor: '#f1f5f9', overflow: 'hidden', flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    {product.thumbnail ? (
                      <img 
                        src={toFullUrl(product.thumbnail)} 
                        alt={product.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                      />
                    ) : null}
                    <FaImage style={{ color: '#cbd5e1', display: product.thumbnail ? 'none' : 'block' }} />
                  </div>
                  <div>
                    <div style={{ fontWeight: '600', color: '#0f172a' }}>{product.name}</div>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>SKU: {product.sku || '-'}</div>
                  </div>
                </div>
              </td>
              <td style={styles.td}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FaStore size={14} color="#64748b" />
                  <span>{product.vendor?.company_name || product.vendor?.full_name || '-'}</span>
                </div>
              </td>
              <td style={{...styles.td, fontWeight: '600'}}>
                {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(product.price || 0)}
              </td>
              <td style={styles.td}>
                <span style={{ 
                  color: product.stock > 10 ? '#047857' : product.stock > 0 ? '#b45309' : '#dc2626'
                }}>
                  {product.stock} adet
                </span>
              </td>
              <td style={styles.td}>{getStatusBadge(product.status)}</td>
              <td style={styles.td}>
                <div style={{ fontSize: '13px' }}>
                  {new Date(product.created_at).toLocaleDateString('tr-TR')}
                </div>
              </td>
              <td style={{...styles.td, textAlign: 'right'}}>
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                  <button 
                    onClick={() => { setSelectedImage(null); setViewProduct(product); }} 
                    style={{ ...styles.btn(), padding: '8px' }}
                    title="Görüntüle"
                  >
                    <FaEye />
                  </button>
                  {product.status === 'pending' && (
                    <>
                      <button 
                        onClick={() => handleStatusChange(product.id, 'active')} 
                        style={{ ...styles.btn('success'), padding: '8px' }}
                        title="Onayla"
                      >
                        <FaCheck />
                      </button>
                      <button 
                        onClick={() => handleStatusChange(product.id, 'rejected', product.name)} 
                        style={{ ...styles.btn('danger'), padding: '8px' }}
                        title="Reddet"
                      >
                        <FaTimes />
                      </button>
                    </>
                  )}
                  {product.status === 'active' && (
                    <button 
                      onClick={() => handleStatusChange(product.id, 'inactive')} 
                      style={{ ...styles.btn('danger'), padding: '8px' }}
                      title="Pasife Al"
                    >
                      <FaTimes />
                    </button>
                  )}
                  {(product.status === 'rejected' || product.status === 'inactive' || product.status === 'draft') && (
                    <button 
                      onClick={() => handleStatusChange(product.id, 'active')} 
                      style={{ ...styles.btn('success'), padding: '8px' }}
                      title="Yayına Al"
                    >
                      <FaCheck />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <Pagination
        currentPage={filters.page}
        totalPages={pagination.last_page || 1}
        totalItems={pagination.total || 0}
        perPage={20}
        onPageChange={(page) => setFilters(f => ({...f, page}))}
      />

      {/* Product Detail Modal */}
      {viewProduct && (
        <div style={styles.modalOverlay} onClick={() => { setSelectedImage(null); setViewProduct(null); }}>
          <div style={{...styles.modalContent, maxWidth: '1000px'}} onClick={e => e.stopPropagation()}>
            {/* Modal Header */}
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f8fafc' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#0f172a' }}>Ürün Detayı</h2>
                {getStatusBadge(viewProduct.status)}
              </div>
              <button onClick={() => { setSelectedImage(null); setViewProduct(null); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: '8px' }}>
                <FaTimes size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '24px', maxHeight: '70vh', overflowY: 'auto' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '32px' }}>
                
                {/* Sol Kolon - Görseller */}
                <div>
                  {/* Ana Görsel */}
                  <div 
                    style={{ aspectRatio: '1/1', borderRadius: '12px', backgroundColor: '#f1f5f9', overflow: 'hidden', marginBottom: '12px', border: '1px solid #e2e8f0', cursor: 'pointer' }}
                    onClick={() => {
                      const imgUrl = selectedImage || toFullUrl(viewProduct.thumbnail) || (viewProduct.photos?.[0] && toFullUrl(viewProduct.photos[0].url));
                      if (imgUrl) setLightboxImage(imgUrl);
                    }}
                  >
                    {(selectedImage || viewProduct.thumbnail || viewProduct.photos?.[0]) ? (
                      <img 
                        src={selectedImage || toFullUrl(viewProduct.thumbnail) || toFullUrl(viewProduct.photos?.[0]?.url)} 
                        alt={viewProduct.name} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                      />
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '8px' }}>
                        <FaImage size={48} color="#cbd5e1" />
                        <span style={{ color: '#94a3b8', fontSize: '13px' }}>Görsel yok</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Diğer Görseller */}
                  {viewProduct.photos && viewProduct.photos.length > 0 && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                      {viewProduct.photos.map((photo, i) => {
                        const photoUrl = toFullUrl(photo.url);
                        const isSelected = selectedImage === photoUrl;
                        return (
                          <div 
                            key={i} 
                            style={{ 
                              aspectRatio: '1/1', 
                              borderRadius: '8px', 
                              overflow: 'hidden', 
                              backgroundColor: '#f1f5f9', 
                              border: isSelected ? '2px solid #4f46e5' : '1px solid #e2e8f0', 
                              cursor: 'pointer',
                              transition: 'all 0.2s',
                              opacity: isSelected ? 1 : 0.8
                            }}
                            onClick={() => setSelectedImage(photoUrl)}
                          >
                            <img src={photoUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          </div>
                        );
                      })}
                    </div>
                  )}
                  
                  {/* Satıcı Bilgisi */}
                  <div style={{ marginTop: '24px', padding: '16px', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: '600', marginBottom: '12px' }}>Satıcı Bilgileri</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <FaStore size={18} color="white" />
                      </div>
                      <div>
                        <div style={{ fontWeight: '600', color: '#0f172a' }}>{viewProduct.vendor?.company_name || '-'}</div>
                        <div style={{ fontSize: '12px', color: '#64748b' }}>{viewProduct.vendor?.full_name}</div>
                        <div style={{ fontSize: '12px', color: '#64748b' }}>{viewProduct.vendor?.email}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sağ Kolon - Detaylar */}
                <div>
                  {/* Ürün Başlığı */}
                  <h3 style={{ fontSize: '24px', fontWeight: '700', color: '#0f172a', marginBottom: '8px', lineHeight: '1.3' }}>{viewProduct.name}</h3>
                  
                  {/* Temel Bilgiler Grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '24px', marginTop: '16px' }}>
                    <div style={{ padding: '14px', backgroundColor: '#ecfdf5', borderRadius: '10px', textAlign: 'center' }}>
                      <div style={{ fontSize: '11px', color: '#047857', fontWeight: '600', marginBottom: '4px' }}>FİYAT</div>
                      <div style={{ fontSize: '18px', fontWeight: '700', color: '#047857' }}>
                        {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(viewProduct.price || 0)}
                      </div>
                    </div>
                    <div style={{ padding: '14px', backgroundColor: '#eff6ff', borderRadius: '10px', textAlign: 'center' }}>
                      <div style={{ fontSize: '11px', color: '#2563eb', fontWeight: '600', marginBottom: '4px' }}>STOK</div>
                      <div style={{ fontSize: '18px', fontWeight: '700', color: '#2563eb' }}>{viewProduct.stock} adet</div>
                    </div>
                    <div style={{ padding: '14px', backgroundColor: '#fef3c7', borderRadius: '10px', textAlign: 'center' }}>
                      <div style={{ fontSize: '11px', color: '#b45309', fontWeight: '600', marginBottom: '4px' }}>TİP</div>
                      <div style={{ fontSize: '14px', fontWeight: '600', color: '#b45309' }}>{viewProduct.type === 'simple' ? 'Basit' : 'Varyantlı'}</div>
                    </div>
                    <div style={{ padding: '14px', backgroundColor: '#f1f5f9', borderRadius: '10px', textAlign: 'center' }}>
                      <div style={{ fontSize: '11px', color: '#475569', fontWeight: '600', marginBottom: '4px' }}>KATEGORİ</div>
                      <div style={{ fontSize: '14px', fontWeight: '600', color: '#475569' }}>{viewProduct.category?.name || '-'}</div>
                    </div>
                  </div>

                  {/* Detay Bilgiler */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                    <div>
                      <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '600', marginBottom: '4px' }}>SKU (Stok Kodu)</div>
                      <div style={{ fontSize: '14px', color: '#0f172a', fontWeight: '500' }}>{viewProduct.sku || '-'}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '600', marginBottom: '4px' }}>Slug (URL)</div>
                      <div style={{ fontSize: '14px', color: '#0f172a', fontWeight: '500' }}>{viewProduct.slug || '-'}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '600', marginBottom: '4px' }}>Oluşturulma Tarihi</div>
                      <div style={{ fontSize: '14px', color: '#0f172a', fontWeight: '500' }}>
                        {new Date(viewProduct.created_at).toLocaleString('tr-TR')}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '600', marginBottom: '4px' }}>Güncellenme Tarihi</div>
                      <div style={{ fontSize: '14px', color: '#0f172a', fontWeight: '500' }}>
                        {new Date(viewProduct.updated_at).toLocaleString('tr-TR')}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '600', marginBottom: '4px' }}>Öne Çıkan</div>
                      <div style={{ fontSize: '14px', color: viewProduct.is_featured ? '#059669' : '#64748b', fontWeight: '500' }}>
                        {viewProduct.is_featured ? '✓ Evet' : 'Hayır'}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '600', marginBottom: '4px' }}>Ürün ID</div>
                      <div style={{ fontSize: '12px', color: '#64748b', fontFamily: 'monospace' }}>{viewProduct.id}</div>
                    </div>
                  </div>

                  {/* Kısa Açıklama */}
                  {viewProduct.short_description && (
                    <div style={{ marginBottom: '20px' }}>
                      <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '600', marginBottom: '8px', textTransform: 'uppercase' }}>Kısa Açıklama</div>
                      <p style={{ color: '#334155', fontSize: '14px', lineHeight: '1.6', padding: '12px', backgroundColor: '#f8fafc', borderRadius: '8px', margin: 0 }}>{viewProduct.short_description}</p>
                    </div>
                  )}
                  
                  {/* Detaylı Açıklama */}
                  {viewProduct.description && (
                    <div style={{ marginBottom: '20px' }}>
                      <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '600', marginBottom: '8px', textTransform: 'uppercase' }}>Detaylı Açıklama</div>
                      <div style={{ color: '#334155', fontSize: '14px', lineHeight: '1.6', padding: '12px', backgroundColor: '#f8fafc', borderRadius: '8px', whiteSpace: 'pre-wrap', maxHeight: '150px', overflowY: 'auto' }}>{viewProduct.description}</div>
                    </div>
                  )}

                  {/* Etiketler */}
                  {viewProduct.tags && viewProduct.tags.length > 0 && (
                    <div style={{ marginBottom: '20px' }}>
                      <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '600', marginBottom: '8px', textTransform: 'uppercase' }}>Etiketler</div>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {viewProduct.tags.map((tag, i) => (
                          <span key={i} style={{ padding: '6px 14px', backgroundColor: '#059669', color: 'white', borderRadius: '20px', fontSize: '12px', fontWeight: '500' }}>
                            #{tag.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Red Sebebi */}
                  {viewProduct.status === 'rejected' && viewProduct.rejection_reason && (
                    <div style={{ marginBottom: '20px', padding: '16px', backgroundColor: '#fef2f2', borderRadius: '10px', border: '1px solid #fecaca' }}>
                      <div style={{ fontSize: '11px', color: '#dc2626', fontWeight: '600', marginBottom: '8px', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <FaTimesCircle /> Red Sebebi
                      </div>
                      <p style={{ color: '#991b1b', fontSize: '14px', lineHeight: '1.6', margin: 0 }}>{viewProduct.rejection_reason}</p>
                      {viewProduct.rejected_at && (
                        <p style={{ color: '#b91c1c', fontSize: '12px', marginTop: '8px', margin: '8px 0 0 0' }}>
                          Reddedilme tarihi: {new Date(viewProduct.rejected_at).toLocaleString('tr-TR')}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Varyantlar */}
                  {viewProduct.variants && viewProduct.variants.length > 0 && (
                    <div style={{ marginBottom: '20px' }}>
                      <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '600', marginBottom: '12px', textTransform: 'uppercase' }}>
                        Varyantlar ({viewProduct.variants.length})
                      </div>
                      <div style={{ border: '1px solid #e2e8f0', borderRadius: '10px', overflow: 'hidden' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                          <thead>
                            <tr style={{ backgroundColor: '#f8fafc' }}>
                              <th style={{ padding: '10px 12px', textAlign: 'left', fontWeight: '600', color: '#64748b', borderBottom: '1px solid #e2e8f0' }}>Varyant</th>
                              <th style={{ padding: '10px 12px', textAlign: 'left', fontWeight: '600', color: '#64748b', borderBottom: '1px solid #e2e8f0' }}>SKU</th>
                              <th style={{ padding: '10px 12px', textAlign: 'right', fontWeight: '600', color: '#64748b', borderBottom: '1px solid #e2e8f0' }}>Fiyat</th>
                              <th style={{ padding: '10px 12px', textAlign: 'right', fontWeight: '600', color: '#64748b', borderBottom: '1px solid #e2e8f0' }}>Stok</th>
                            </tr>
                          </thead>
                          <tbody>
                            {viewProduct.variants.map((variant, i) => (
                              <tr key={i} style={{ borderBottom: i < viewProduct.variants.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                                <td style={{ padding: '10px 12px', color: '#0f172a', fontWeight: '500' }}>{variant.title || 'Varsayılan'}</td>
                                <td style={{ padding: '10px 12px', color: '#64748b', fontFamily: 'monospace', fontSize: '12px' }}>{variant.sku || '-'}</td>
                                <td style={{ padding: '10px 12px', textAlign: 'right', color: '#059669', fontWeight: '600' }}>
                                  {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(variant.price || 0)}
                                </td>
                                <td style={{ padding: '10px 12px', textAlign: 'right' }}>
                                  <span style={{ 
                                    padding: '2px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: '500',
                                    backgroundColor: variant.stock > 10 ? '#d1fae5' : variant.stock > 0 ? '#fef3c7' : '#fee2e2',
                                    color: variant.stock > 10 ? '#047857' : variant.stock > 0 ? '#b45309' : '#dc2626'
                                  }}>
                                    {variant.stock}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer - Actions */}
            <div style={{ padding: '20px 24px', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f8fafc' }}>
              <div style={{ fontSize: '13px', color: '#64748b' }}>
                ID: <span style={{ fontFamily: 'monospace', fontSize: '12px' }}>{viewProduct.id}</span>
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                {viewProduct.status === 'pending' && (
                  <>
                    <button 
                      onClick={() => handleStatusChange(viewProduct.id, 'rejected', viewProduct.name)}
                      style={{ ...styles.btn('danger'), padding: '10px 20px', display: 'flex', alignItems: 'center', gap: '6px' }}
                    >
                      <FaTimes /> Reddet
                    </button>
                    <button 
                      onClick={() => { handleStatusChange(viewProduct.id, 'active'); setViewProduct(null); }}
                      style={{ ...styles.btn('primary'), padding: '10px 20px', display: 'flex', alignItems: 'center', gap: '6px' }}
                    >
                      <FaCheck /> Onayla ve Yayınla
                    </button>
                  </>
                )}
                {viewProduct.status === 'active' && (
                  <button 
                    onClick={() => { handleStatusChange(viewProduct.id, 'inactive'); setViewProduct(null); }}
                    style={{ ...styles.btn('danger'), padding: '10px 20px', display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    <FaTimes /> Pasife Al
                  </button>
                )}
                {(viewProduct.status === 'rejected' || viewProduct.status === 'inactive' || viewProduct.status === 'draft') && (
                  <button 
                    onClick={() => { handleStatusChange(viewProduct.id, 'active'); setViewProduct(null); }}
                    style={{ ...styles.btn('primary'), padding: '10px 20px', display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    <FaCheck /> Yayına Al
                  </button>
                )}
                <button 
                  onClick={() => setViewProduct(null)}
                  style={{ ...styles.btn(), padding: '10px 20px' }}
                >
                  Kapat
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {rejectModal.isOpen && (
        <div style={styles.modalOverlay} onClick={() => { setRejectModal({ isOpen: false, productId: null, productName: '', isBulk: false }); setRejectionReason(''); }}>
          <div style={{ ...styles.modalContent, maxWidth: '500px' }} onClick={e => e.stopPropagation()}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #e2e8f0', backgroundColor: '#fef2f2' }}>
              <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#dc2626', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <FaTimesCircle /> Ürün Reddi
              </h2>
            </div>
            <div style={{ padding: '24px' }}>
              <p style={{ color: '#334155', marginBottom: '16px' }}>
                <strong>{rejectModal.productName}</strong> {rejectModal.isBulk ? '' : 'adlı ürünü'} reddetmek üzeresiniz.
              </p>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#0f172a', marginBottom: '8px' }}>
                  Red Sebebi <span style={{ color: '#dc2626' }}>*</span>
                </label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Ürünün neden reddedildiğini açıklayın. Bu mesaj satıcıya gösterilecektir."
                  style={{
                    width: '100%',
                    minHeight: '120px',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    fontSize: '14px',
                    resize: 'vertical',
                    outline: 'none',
                    fontFamily: 'inherit'
                  }}
                />
                <p style={{ fontSize: '12px', color: '#64748b', marginTop: '8px' }}>
                  Örn: Ürün açıklaması yetersiz, görseller düşük kaliteli, fiyat uyumsuzluğu vb.
                </p>
              </div>
            </div>
            <div style={{ padding: '16px 24px', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end', gap: '12px', backgroundColor: '#f8fafc' }}>
              <button 
                onClick={() => { setRejectModal({ isOpen: false, productId: null, productName: '', isBulk: false }); setRejectionReason(''); }}
                style={{ ...styles.btn(), padding: '10px 20px' }}
              >
                İptal
              </button>
              <button 
                onClick={handleRejectSubmit}
                disabled={statusMutation.isPending || bulkStatusMutation.isPending}
                style={{ 
                  ...styles.btn('danger'), 
                  padding: '10px 20px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '6px',
                  opacity: (statusMutation.isPending || bulkStatusMutation.isPending) ? 0.6 : 1
                }}
              >
                <FaTimes /> {(statusMutation.isPending || bulkStatusMutation.isPending) ? 'İşleniyor...' : 'Reddet'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox */}
      {lightboxImage && (
        <div 
          style={{
            position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.9)', zIndex: 2000,
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px'
          }}
          onClick={() => setLightboxImage(null)}
        >
          <button 
            style={{
              position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', 
              color: 'white', cursor: 'pointer'
            }}
            onClick={() => setLightboxImage(null)}
          >
            <FaTimes size={32} />
          </button>
          <img 
            src={lightboxImage} 
            alt="Full size" 
            style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', borderRadius: '8px' }} 
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
