import React, { useState } from 'react';
import { FaSearch, FaFilter, FaStore, FaStar, FaEdit, FaBan, FaChevronLeft, FaChevronRight, FaCheck, FaTimes } from 'react-icons/fa';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import VendorEditModal from './VendorEditModal';
import { getVendors, updateVendorStatus } from '../api/vendorApi';

const VendorList = () => {
  const queryClient = useQueryClient();
  
  // Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState(null);
  
  // Sayfalama State'leri
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // React Query ile Veri Çekme
  const { data: responseData, isLoading } = useQuery({
    queryKey: ['vendors', currentPage],
    queryFn: async () => {
      const response = await getVendors({ page: currentPage, per_page: itemsPerPage });
      return response.data; // { data: [...], meta: ... }
    },
    keepPreviousData: true,
    staleTime: 1000 * 60 * 5, // 5 dakika boyunca taze kabul et
  });

  const vendors = responseData?.data || [];
  const meta = responseData?.meta || {};

  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all'); // all, pre_pending, active, pending, banned

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }) => updateVendorStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries(['vendors']);
      alert('Satıcı durumu güncellendi');
    },
    onError: (err) => {
      alert('Durum güncellenemedi: ' + (err.response?.data?.message || err.message));
    }
  });

  // Edit İşlemleri
  const handleEditClick = (vendor) => {
    setSelectedVendor(vendor);
    setIsEditModalOpen(true);
  };

  const handleSaveVendor = (id, updatedData) => {
    queryClient.setQueryData(['vendors', currentPage], (oldData) => {
      if (!oldData) return oldData;
      return {
        ...oldData,
        data: oldData.data.map(v => v.id === id ? { ...v, ...updatedData } : v)
      };
    });

    setIsEditModalOpen(false);
    setSelectedVendor(null);
  };

  const filteredVendors = vendors.filter(vendor => {
    const matchesSearch = (vendor.storeName || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (vendor.email || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === 'all' ? true : vendor.status === activeTab;
    return matchesSearch && matchesTab;
  });

  const totalPages = meta.last_page || 1;
  const currentItems = filteredVendors;
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const StatusBadge = ({ status }) => {
    const styles = {
      pre_pending: { bg: '#fff7ed', color: '#92400e', label: 'Ön Başvuru - Beklemede' },
      pre_approved: { bg: '#dcfce7', color: '#166534', label: 'Ön Başvuru - Onaylandı' },
      pre_rejected: { bg: '#fee2e2', color: '#991b1b', label: 'Ön Başvuru - Reddedildi' },
      active: { bg: '#dcfce7', color: '#166534', label: 'Aktif' },
      pending: { bg: '#fef9c3', color: '#854d0e', label: 'Onay Bekliyor' },
      banned: { bg: '#fee2e2', color: '#991b1b', label: 'Yasaklı' },
    };
    const current = styles[status] || { bg: '#f1f5f9', color: '#475569', label: status };

    return (
      <span style={{
        backgroundColor: current.bg,
        color: current.color,
        padding: '4px 12px',
        borderRadius: '20px',
        fontSize: '12px',
        fontWeight: '600',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px'
      }}>
        <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: current.color }}></span>
        {current.label}
      </span>
    );
  };

  if (isLoading) return <div style={{ padding: '24px', color: 'var(--text-muted)' }}>Yükleniyor...</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* omitted for brevity: same markup as before */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--bg-card)', padding: '16px 24px', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow-sm)', border: '1px solid #e2e8f0' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          {['all','pre_pending', 'active', 'pending', 'banned'].map((tab) => (
            <button key={tab} onClick={() => { setActiveTab(tab); setCurrentPage(1); }} style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', backgroundColor: activeTab === tab ? 'var(--primary)' : 'transparent', color: activeTab === tab ? 'white' : 'var(--text-muted)', fontWeight: '500', cursor: 'pointer', textTransform: 'capitalize' }}>{tab === 'all' ? 'Tümü' : tab === 'pre_pending' ? 'Ön Başvuru' : tab === 'active' ? 'Aktif' : tab === 'pending' ? 'Bekleyen' : 'Yasaklı'}</button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <div style={{ position: 'relative' }}>
            <FaSearch style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input type="text" placeholder="Mağaza veya E-posta ara..." value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }} style={{ padding: '10px 10px 10px 36px', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none', width: '250px', fontFamily: 'Inter, sans-serif' }} />
          </div>
          <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '8px', color: 'var(--text-main)', cursor: 'pointer' }}><FaFilter /> Filtrele</button>
        </div>
      </div>

      {/* Table area (kept compact in patch) */}
      <div style={{ backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
            <tr>
              <th style={{ padding: '16px 24px', fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Mağaza Bilgisi</th>
              <th style={{ padding: '16px 24px', fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Yetkili</th>
              <th style={{ padding: '16px 24px', fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Durum</th>
              <th style={{ padding: '16px 24px', fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Ciro</th>
              <th style={{ padding: '16px 24px', fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Puan</th>
              <th style={{ padding: '16px 24px', fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', textAlign: 'right' }}>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((vendor) => (
              <tr key={vendor.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '16px 24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '40px', height: '40px', backgroundColor: '#e0e7ff', color: 'var(--primary)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}><FaStore /></div>
                    <div>
                      <p style={{ fontWeight: '600', color: 'var(--text-main)' }}>{vendor.storeName}</p>
                      <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{vendor.products} Ürün</p>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '16px 24px' }}><p style={{ fontWeight: '500', color: 'var(--text-main)' }}>{vendor.owner}</p><p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{vendor.email}</p></td>
                <td style={{ padding: '16px 24px' }}><StatusBadge status={vendor.status} /></td>
                <td style={{ padding: '16px 24px', fontWeight: '600', color: 'var(--text-main)' }}>{vendor.revenue}</td>
                <td style={{ padding: '16px 24px' }}><div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#f59e0b' }}><FaStar /><span style={{ fontWeight: '600', color: 'var(--text-main)' }}>{vendor.rating}</span></div></td>
                <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                    <button onClick={() => handleEditClick(vendor)} title="Düzenle" style={{ padding: '8px', borderRadius: '6px', border: '1px solid #e2e8f0', backgroundColor: 'white', color: 'var(--text-muted)', cursor: 'pointer' }}><FaEdit /></button>
                    {(vendor.status === 'pending' || vendor.status === 'pre_pending') && (
                      <>
                        <button title="Onayla" onClick={() => { if (!confirm('Bu satıcıyı onaylamak istiyor musunuz?')) return; const newStatus = vendor.status === 'pre_pending' ? 'pre_approved' : 'active'; updateStatusMutation.mutate({ id: vendor.id, status: newStatus }); }} style={{ padding: '8px', borderRadius: '6px', border: '1px solid #dcfce7', backgroundColor: '#dcfce7', color: '#16a34a', cursor: 'pointer' }}><FaCheck /></button>
                        <button title="Reddet" onClick={() => { if (!confirm('Bu satıcı başvurusunu reddetmek istiyor musunuz?')) return; const newStatus = vendor.status === 'pre_pending' ? 'pre_rejected' : 'inactive'; updateStatusMutation.mutate({ id: vendor.id, status: newStatus }); }} style={{ padding: '8px', borderRadius: '6px', border: '1px solid #fee2e2', backgroundColor: '#fff1f2', color: '#ef4444', cursor: 'pointer' }}><FaTimes /></button>
                      </>
                    )}
                    {vendor.status !== 'pending' && (<button title="Yasakla" style={{ padding: '8px', borderRadius: '6px', border: '1px solid #fee2e2', backgroundColor: '#fff1f2', color: '#ef4444', cursor: 'pointer' }}><FaBan /></button>)}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', backgroundColor: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Toplam <span style={{ fontWeight: '600', color: 'var(--text-main)' }}>{meta.total || 0}</span> satıcıdan <span style={{ fontWeight: '600', color: 'var(--text-main)' }}>{meta.from || 0}-{meta.to || 0}</span> arası gösteriliyor</p>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} style={{ padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: '6px', backgroundColor: 'white', color: currentPage === 1 ? '#cbd5e1' : 'var(--text-main)', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center' }}>&lt;</button>
            <span style={{ display: 'flex', alignItems: 'center', padding: '0 12px', fontSize: '14px', fontWeight: '600' }}>Sayfa {currentPage} / {totalPages}</span>
            <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages} style={{ padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: '6px', backgroundColor: 'white', color: currentPage === totalPages ? '#cbd5e1' : 'var(--text-main)', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center' }}>&gt;</button>
          </div>
        </div>
      </div>

      <VendorEditModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} vendor={selectedVendor} onSave={handleSaveVendor} />
    </div>
  );
};

export default VendorList;
