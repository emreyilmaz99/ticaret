import React, { useState } from 'react';
import { FaSearch, FaFilter, FaStore, FaStar, FaEdit, FaBan, FaEye, FaFolder } from 'react-icons/fa';
import Pagination from '../../../components/ui/Pagination';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import VendorEditModal from './VendorEditModal';
import VendorCategoryModal from '../../admin/components/VendorCategoryModal';
import { getVendors, updateVendorStatus } from '../api/vendorApi';
import { useToast } from '../../../components/common/Toast';

const ActiveVendorList = () => {
  const queryClient = useQueryClient();
  const toast = useToast();
  
  // Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState(null);
  
  // Sayfalama State'leri
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [searchTerm, setSearchTerm] = useState('');

  // React Query ile Veri Çekme
  const { data: responseData, isLoading } = useQuery({
    queryKey: ['active-vendors', currentPage, searchTerm],
    queryFn: async () => {
      // Sadece aktif satıcıları getir
      const response = await getVendors({ 
        page: currentPage, 
        per_page: itemsPerPage,
        status: 'active',
        search: searchTerm 
      });
      return response.data; 
    },
    keepPreviousData: true,
    staleTime: 1000 * 60 * 5, 
  });

  const vendors = responseData?.data || [];
  const meta = responseData?.meta || {};

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }) => updateVendorStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries(['active-vendors']);
      toast.success('Durum Güncellendi', 'Satıcı durumu başarıyla güncellendi.', 3000);
    },
    onError: (err) => {
      toast.error('Hata', 'Durum güncellenemedi: ' + (err.response?.data?.message || err.message), 4000);
    }
  });

  // Edit İşlemleri
  const handleEditClick = (vendor) => {
    setSelectedVendor(vendor);
    setIsEditModalOpen(true);
  };

  // Kategori Modal İşlemleri
  const handleCategoryClick = (vendor) => {
    setSelectedVendor(vendor);
    setIsCategoryModalOpen(true);
  };

  const handleSaveVendor = (id, updatedData) => {
    queryClient.setQueryData(['active-vendors', currentPage], (oldData) => {
      if (!oldData) return oldData;
      return {
        ...oldData,
        data: oldData.data.map(v => v.id === id ? { ...v, ...updatedData } : v)
      };
    });

    setIsEditModalOpen(false);
    setSelectedVendor(null);
  };

  // Client-side filtering is not needed if API handles it, but keeping search logic just in case API search is limited
  // However, I passed search to API above. Let's assume API handles it or we filter here.
  // If API handles 'search' param, we don't need client side filter.
  // But the previous code did client side filtering. I'll stick to client side for safety if API doesn't support search param fully yet.
  // Wait, previous code fetched ALL vendors? No, it fetched with pagination.
  // Previous code: `const response = await getVendors({ page: currentPage, per_page: itemsPerPage });`
  // And then `filteredVendors = vendors.filter(...)`.
  // This is buggy if pagination is server side. Filtering only current page?
  // I will assume server side filtering is better. But for now I will replicate the pattern but add `status: 'active'` to the API call.
  
  const filteredVendors = vendors.filter(vendor => {
    const matchesSearch = (vendor.storeName || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (vendor.email || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const totalPages = meta.last_page || 1;
  const currentItems = filteredVendors;

  if (isLoading) return <div style={{ padding: '24px', color: 'var(--text-muted)' }}>Yükleniyor...</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Filtre Alanı */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--bg-card)', padding: '16px 24px', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow-sm)', border: '1px solid #e2e8f0' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
           {/* Tablar kaldırıldı çünkü sadece Aktif satıcılar */}
           <span style={{ fontWeight: '600', color: 'var(--text-main)' }}>Aktif Satıcı Listesi</span>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <div style={{ position: 'relative' }}>
            <FaSearch style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input type="text" placeholder="Mağaza veya E-posta ara..." value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }} style={{ padding: '10px 10px 10px 36px', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none', width: '250px', fontFamily: 'Inter, sans-serif' }} />
          </div>
          <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '8px', color: 'var(--text-main)', cursor: 'pointer' }}><FaFilter /> Filtrele</button>
        </div>
      </div>

      {/* Tablo */}
      <div style={{ backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
            <tr>
              <th style={{ padding: '16px 24px', fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Mağaza Bilgisi</th>
              <th style={{ padding: '16px 24px', fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Yetkili</th>
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
                <td style={{ padding: '16px 24px', fontWeight: '600', color: 'var(--text-main)' }}>{vendor.revenue}</td>
                <td style={{ padding: '16px 24px' }}><div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#f59e0b' }}><FaStar /><span style={{ fontWeight: '600', color: 'var(--text-main)' }}>{vendor.rating}</span></div></td>
                <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                    <button onClick={() => handleCategoryClick(vendor)} title="Kategoriler" style={{ padding: '8px', borderRadius: '6px', border: '1px solid #e2e8f0', backgroundColor: 'white', color: 'var(--primary)', cursor: 'pointer' }}><FaFolder /></button>
                    <button onClick={() => handleEditClick(vendor)} title="Düzenle" style={{ padding: '8px', borderRadius: '6px', border: '1px solid #e2e8f0', backgroundColor: 'white', color: 'var(--text-muted)', cursor: 'pointer' }}><FaEdit /></button>
                    <button title="Yasakla" onClick={() => { if (!confirm('Bu satıcıyı yasaklamak istiyor musunuz?')) return; updateStatusMutation.mutate({ id: vendor.id, status: 'banned' }); }} style={{ padding: '8px', borderRadius: '6px', border: '1px solid #fee2e2', backgroundColor: '#fff1f2', color: '#ef4444', cursor: 'pointer' }}><FaBan /></button>
                  </div>
                </td>
              </tr>
            ))}
            {currentItems.length === 0 && (
               <tr>
                 <td colSpan="5" style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>Aktif satıcı bulunamadı.</td>
               </tr>
            )}
          </tbody>
        </table>
        <div style={{ padding: '16px 24px', backgroundColor: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={meta.total || 0}
            perPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>

      <VendorEditModal isOpen={isEditModalOpen} onClose={() => { setIsEditModalOpen(false); setSelectedVendor(null); }} vendor={selectedVendor} onSave={handleSaveVendor} />
      <VendorCategoryModal isOpen={isCategoryModalOpen} onClose={() => { setIsCategoryModalOpen(false); setSelectedVendor(null); }} vendor={selectedVendor} />
    </div>
  );
};

export default ActiveVendorList;
