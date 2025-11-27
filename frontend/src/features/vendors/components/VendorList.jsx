import React, { useState } from 'react';
import { FaSearch, FaFilter, FaStore, FaStar, FaEdit, FaBan, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useQuery } from '@tanstack/react-query';

// Mock Data (Backend hazır olana kadar tasarım için)
const MOCK_VENDORS = Array.from({ length: 45 }, (_, i) => ({
  id: i + 1,
  storeName: `Mağaza ${i + 1}`,
  owner: `Satıcı ${i + 1}`,
  email: `satici${i + 1}@ornek.com`,
  status: i % 5 === 0 ? 'banned' : i % 3 === 0 ? 'pending' : 'active',
  revenue: `₺${(Math.random() * 100000).toFixed(2)}`,
  rating: (Math.random() * 5).toFixed(1),
  products: Math.floor(Math.random() * 500),
  joinDate: '12 Kas 2024'
}));

const VendorList = () => {
  // React Query ile Veri Çekme (Şimdilik Mock Data'yı Promise ile simüle ediyoruz)
  // İleride buraya gerçek API çağrısı gelecek: getVendors()
  const { data: vendors = [], isLoading } = useQuery({
    queryKey: ['vendors'],
    queryFn: async () => {
      // Simüle edilmiş ağ gecikmesi (Gerçek API gelince kaldırılacak)
      // await new Promise(resolve => setTimeout(resolve, 500)); 
      return MOCK_VENDORS;
    },
    staleTime: 1000 * 60 * 5, // 5 dakika boyunca taze kabul et
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all'); // all, active, pending, banned
  
  // Sayfalama State'leri
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filtreleme Mantığı
  const filteredVendors = vendors.filter(vendor => {
    const matchesSearch = vendor.storeName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          vendor.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === 'all' ? true : vendor.status === activeTab;
    return matchesSearch && matchesTab;
  });

  // Sayfalama Mantığı
  const totalPages = Math.ceil(filteredVendors.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredVendors.slice(indexOfFirstItem, indexOfLastItem);

  // Sayfa Değiştirme
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Status Badge Bileşeni
  const StatusBadge = ({ status }) => {
    const styles = {
      active: { bg: '#dcfce7', color: '#166534', label: 'Aktif' },
      pending: { bg: '#fef9c3', color: '#854d0e', label: 'Onay Bekliyor' },
      banned: { bg: '#fee2e2', color: '#991b1b', label: 'Yasaklı' },
    };
    const current = styles[status] || styles.active;

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
      
      {/* ÜST FİLTRE VE ARAMA ALANI */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        backgroundColor: 'var(--bg-card)', 
        padding: '16px 24px', 
        borderRadius: 'var(--radius)',
        boxShadow: 'var(--shadow-sm)',
        border: '1px solid #e2e8f0'
      }}>
        
        {/* Sol: Tablar */}
        <div style={{ display: 'flex', gap: '8px' }}>
          {['all', 'active', 'pending', 'banned'].map((tab) => (
            <button
              key={tab}
              onClick={() => { setActiveTab(tab); setCurrentPage(1); }} // Tab değişince 1. sayfaya dön
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: activeTab === tab ? 'var(--primary)' : 'transparent',
                color: activeTab === tab ? 'white' : 'var(--text-muted)',
                fontWeight: '500',
                cursor: 'pointer',
                textTransform: 'capitalize'
              }}
            >
              {tab === 'all' ? 'Tümü' : tab === 'active' ? 'Aktif' : tab === 'pending' ? 'Bekleyen' : 'Yasaklı'}
            </button>
          ))}
        </div>

        {/* Sağ: Arama ve Filtre */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <div style={{ position: 'relative' }}>
            <FaSearch style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              placeholder="Mağaza veya E-posta ara..." 
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }} // Arama yapınca 1. sayfaya dön
              style={{
                padding: '10px 10px 10px 36px',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                outline: 'none',
                width: '250px',
                fontFamily: 'Inter, sans-serif'
              }}
            />
          </div>
          <button style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 16px',
            backgroundColor: 'white',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            color: 'var(--text-main)',
            cursor: 'pointer'
          }}>
            <FaFilter /> Filtrele
          </button>
        </div>
      </div>

      {/* TABLO ALANI */}
      <div style={{ 
        backgroundColor: 'var(--bg-card)', 
        borderRadius: 'var(--radius)', 
        boxShadow: 'var(--shadow-sm)', 
        overflow: 'hidden',
        border: '1px solid #e2e8f0'
      }}>
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
              <tr key={vendor.id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background-color 0.2s' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                
                {/* Mağaza */}
                <td style={{ padding: '16px 24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ 
                      width: '40px', height: '40px', 
                      backgroundColor: '#e0e7ff', color: 'var(--primary)', 
                      borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 'bold'
                    }}>
                      <FaStore />
                    </div>
                    <div>
                      <p style={{ fontWeight: '600', color: 'var(--text-main)' }}>{vendor.storeName}</p>
                      <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{vendor.products} Ürün</p>
                    </div>
                  </div>
                </td>

                {/* Yetkili */}
                <td style={{ padding: '16px 24px' }}>
                  <p style={{ fontWeight: '500', color: 'var(--text-main)' }}>{vendor.owner}</p>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{vendor.email}</p>
                </td>

                {/* Durum */}
                <td style={{ padding: '16px 24px' }}>
                  <StatusBadge status={vendor.status} />
                </td>

                {/* Ciro */}
                <td style={{ padding: '16px 24px', fontWeight: '600', color: 'var(--text-main)' }}>
                  {vendor.revenue}
                </td>

                {/* Puan */}
                <td style={{ padding: '16px 24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#f59e0b' }}>
                    <FaStar />
                    <span style={{ fontWeight: '600', color: 'var(--text-main)' }}>{vendor.rating}</span>
                  </div>
                </td>

                {/* İşlemler */}
                <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                    <button title="Düzenle" style={{ padding: '8px', borderRadius: '6px', border: '1px solid #e2e8f0', backgroundColor: 'white', color: 'var(--text-muted)', cursor: 'pointer' }}>
                      <FaEdit />
                    </button>
                    <button title="Yasakla" style={{ padding: '8px', borderRadius: '6px', border: '1px solid #fee2e2', backgroundColor: '#fff1f2', color: '#ef4444', cursor: 'pointer' }}>
                      <FaBan />
                    </button>
                  </div>
                </td>

              </tr>
            ))}
          </tbody>
        </table>

        {/* SAYFALAMA (PAGINATION) ALANI */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          padding: '16px 24px', 
          backgroundColor: '#f8fafc',
          borderTop: '1px solid #e2e8f0'
        }}>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
            Toplam <span style={{ fontWeight: '600', color: 'var(--text-main)' }}>{filteredVendors.length}</span> satıcıdan <span style={{ fontWeight: '600', color: 'var(--text-main)' }}>{filteredVendors.length > 0 ? indexOfFirstItem + 1 : 0}-{Math.min(indexOfLastItem, filteredVendors.length)}</span> arası gösteriliyor
          </p>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button 
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              style={{
                padding: '8px 12px',
                border: '1px solid #e2e8f0',
                borderRadius: '6px',
                backgroundColor: 'white',
                color: currentPage === 1 ? '#cbd5e1' : 'var(--text-main)',
                cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <FaChevronLeft size={12} />
            </button>

            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => paginate(i + 1)}
                style={{
                  padding: '8px 12px',
                  border: currentPage === i + 1 ? 'none' : '1px solid #e2e8f0',
                  borderRadius: '6px',
                  backgroundColor: currentPage === i + 1 ? 'var(--primary)' : 'white',
                  color: currentPage === i + 1 ? 'white' : 'var(--text-main)',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '14px'
                }}
              >
                {i + 1}
              </button>
            ))}

            <button 
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              style={{
                padding: '8px 12px',
                border: '1px solid #e2e8f0',
                borderRadius: '6px',
                backgroundColor: 'white',
                color: currentPage === totalPages ? '#cbd5e1' : 'var(--text-main)',
                cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <FaChevronRight size={12} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorList;
