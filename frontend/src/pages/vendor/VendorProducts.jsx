import React from 'react';
import { FaPlus, FaSearch, FaFilter, FaEdit, FaTrash, FaEye } from 'react-icons/fa';

const VendorProducts = () => {
  // Mock Data
  const products = [
    { id: 1, name: 'Kablosuz Kulaklık Pro', category: 'Elektronik', price: '₺1,299', stock: 45, status: 'active', image: 'https://placehold.co/50' },
    { id: 2, name: 'Akıllı Saat Series 5', category: 'Elektronik', price: '₺3,499', stock: 12, status: 'low', image: 'https://placehold.co/50' },
    { id: 3, name: 'Deri Laptop Çantası', category: 'Aksesuar', price: '₺899', stock: 0, status: 'out', image: 'https://placehold.co/50' },
    { id: 4, name: 'Mekanik Klavye RGB', category: 'Bilgisayar', price: '₺2,150', stock: 28, status: 'active', image: 'https://placehold.co/50' },
    { id: 5, name: 'Type-C Hub 7-in-1', category: 'Bilgisayar', price: '₺450', stock: 150, status: 'active', image: 'https://placehold.co/50' },
  ];

  const getStockStatus = (stock) => {
    if (stock === 0) return { label: 'Tükendi', color: '#ef4444', bg: '#fef2f2' };
    if (stock < 20) return { label: 'Kritik', color: '#f59e0b', bg: '#fffbeb' };
    return { label: 'Stokta', color: '#10b981', bg: '#ecfdf5' };
  };

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", color: '#1e293b' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.5px' }}>Ürün Yönetimi</h1>
          <p style={{ color: '#64748b', fontSize: '14px', marginTop: '4px' }}>Mağazanızdaki ürünleri buradan yönetebilirsiniz.</p>
        </div>
        <button style={{ 
          backgroundColor: '#14532d', 
          color: 'white', 
          border: 'none', 
          padding: '12px 24px', 
          borderRadius: '10px', 
          fontWeight: '600', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px',
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(20, 83, 45, 0.2)'
        }}>
          <FaPlus size={14} /> Yeni Ürün Ekle
        </button>
      </div>

      {/* Filters */}
      <div style={{ 
        backgroundColor: 'white', 
        padding: '16px', 
        borderRadius: '16px', 
        marginBottom: '24px', 
        display: 'flex', 
        gap: '16px',
        border: '1px solid #f1f5f9',
        boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
      }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <FaSearch style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input 
            type="text" 
            placeholder="Ürün adı, barkod veya kategori ara..." 
            style={{ 
              width: '100%', 
              padding: '12px 12px 12px 48px', 
              borderRadius: '10px', 
              border: '1px solid #e2e8f0', 
              outline: 'none',
              fontSize: '14px'
            }} 
          />
        </div>
        <button style={{ 
          padding: '0 20px', 
          backgroundColor: 'white', 
          border: '1px solid #e2e8f0', 
          borderRadius: '10px', 
          color: '#475569', 
          fontWeight: '600', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px',
          cursor: 'pointer'
        }}>
          <FaFilter /> Filtrele
        </button>
      </div>

      {/* Product List */}
      <div style={{ backgroundColor: 'white', borderRadius: '16px', border: '1px solid #f1f5f9', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.02)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
            <tr>
              <th style={{ padding: '16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase' }}>Ürün</th>
              <th style={{ padding: '16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase' }}>Kategori</th>
              <th style={{ padding: '16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase' }}>Fiyat</th>
              <th style={{ padding: '16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase' }}>Stok Durumu</th>
              <th style={{ padding: '16px', textAlign: 'right', fontSize: '12px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase' }}>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => {
              const stockStatus = getStockStatus(product.stock);
              return (
                <tr key={product.id} style={{ borderBottom: index !== products.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                  <td style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <img src={product.image} alt={product.name} style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover', backgroundColor: '#f1f5f9' }} />
                      <div>
                        <div style={{ fontWeight: '600', color: '#0f172a' }}>{product.name}</div>
                        <div style={{ fontSize: '12px', color: '#94a3b8' }}>ID: #{1000 + product.id}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '16px', color: '#475569' }}>{product.category}</td>
                  <td style={{ padding: '16px', fontWeight: '600', color: '#0f172a' }}>{product.price}</td>
                  <td style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ 
                        padding: '4px 10px', 
                        borderRadius: '20px', 
                        fontSize: '12px', 
                        fontWeight: '600', 
                        backgroundColor: stockStatus.bg, 
                        color: stockStatus.color 
                      }}>
                        {stockStatus.label}
                      </span>
                      <span style={{ fontSize: '12px', color: '#64748b' }}>({product.stock} adet)</span>
                    </div>
                    {/* Mini Progress Bar */}
                    <div style={{ width: '100px', height: '4px', backgroundColor: '#f1f5f9', borderRadius: '2px', marginTop: '6px' }}>
                      <div style={{ 
                        width: `${Math.min(product.stock, 100)}%`, 
                        height: '100%', 
                        backgroundColor: stockStatus.color, 
                        borderRadius: '2px' 
                      }}></div>
                    </div>
                  </td>
                  <td style={{ padding: '16px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                      <button style={{ padding: '8px', borderRadius: '8px', border: 'none', backgroundColor: '#f1f5f9', color: '#475569', cursor: 'pointer' }}><FaEye /></button>
                      <button style={{ padding: '8px', borderRadius: '8px', border: 'none', backgroundColor: '#dbeafe', color: '#2563eb', cursor: 'pointer' }}><FaEdit /></button>
                      <button style={{ padding: '8px', borderRadius: '8px', border: 'none', backgroundColor: '#fee2e2', color: '#dc2626', cursor: 'pointer' }}><FaTrash /></button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VendorProducts;
