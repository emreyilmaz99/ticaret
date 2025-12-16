// src/pages/vendor/Products/components/ProductStats.jsx
import React, { useState, useMemo } from 'react';
import { FaBoxOpen, FaExclamationTriangle, FaExclamationCircle, FaSortAmountDown, FaSortAmountUp } from 'react-icons/fa';
import { styles } from '../styles';

const ProductStats = ({ products = [], statusFilter, setStatusFilter }) => {
  const [stockFilter, setStockFilter] = useState('all');
  const [stockSortOrder, setStockSortOrder] = useState(null);

  const activeCount = products.filter(p => p.status === 'active').length;
  const draftCount = products.filter(p => p.status === 'draft').length;
  const totalStock = products.reduce((sum, p) => sum + (p.stock || 0), 0);

  const stockStats = useMemo(() => {
    const critical = products.filter(p => (p.stock || 0) <= 5).length;
    const low = products.filter(p => (p.stock || 0) > 5 && (p.stock || 0) < 10).length;
    const normal = products.filter(p => (p.stock || 0) >= 10).length;
    return { critical, low, normal };
  }, [products]);

  const stockProducts = useMemo(() => {
    let filtered = [...products];
    
    if (stockFilter === 'critical') {
      filtered = filtered.filter(p => (p.stock || 0) <= 5);
    } else if (stockFilter === 'low') {
      filtered = filtered.filter(p => (p.stock || 0) > 5 && (p.stock || 0) < 10);
    } else if (stockFilter === 'normal') {
      filtered = filtered.filter(p => (p.stock || 0) >= 10);
    }
    
    if (stockSortOrder === 'asc') {
      filtered.sort((a, b) => (a.stock || 0) - (b.stock || 0));
    } else if (stockSortOrder === 'desc') {
      filtered.sort((a, b) => (b.stock || 0) - (a.stock || 0));
    }
    
    return filtered;
  }, [products, stockFilter, stockSortOrder]);

  const handleStatClick = (filter) => {
    setStatusFilter(statusFilter === filter ? 'all' : filter);
  };

  const isStockPanelOpen = statusFilter === 'stock';

  const getStatCardStyle = (filter) => ({
    ...styles.statCard,
    cursor: 'pointer',
    transition: 'all 0.2s',
    transform: statusFilter === filter ? 'translateY(-4px)' : 'none',
    boxShadow: statusFilter === filter ? '0 4px 12px rgba(5, 150, 105, 0.2)' : '0 1px 2px rgba(0,0,0,0.05)',
    borderColor: statusFilter === filter ? '#059669' : '#e2e8f0',
    borderWidth: statusFilter === filter ? '2px' : '1px'
  });

  const getStockBadgeStyle = (stock) => {
    if (stock <= 5) return { backgroundColor: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca' };
    if (stock < 10) return { backgroundColor: '#fffbeb', color: '#d97706', border: '1px solid #fde68a' };
    return { backgroundColor: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0' };
  };

  const getStockIcon = (stock) => {
    if (stock <= 5) return <FaExclamationCircle style={{ fontSize: '12px' }} />;
    if (stock < 10) return <FaExclamationTriangle style={{ fontSize: '12px' }} />;
    return <FaBoxOpen style={{ fontSize: '12px' }} />;
  };

  return (
    <div style={{ marginBottom: '24px' }}>
      <div style={styles.statsBar}>
        <div style={getStatCardStyle('all')} onClick={() => handleStatClick('all')} title="Tüm ürünleri göster">
          <span style={styles.statValue}>{products.length}</span>
          <span style={styles.statLabel}>Toplam Ürün</span>
        </div>
        <div style={getStatCardStyle('active')} onClick={() => handleStatClick('active')} title="Sadece aktif ürünleri göster">
          <span style={{ ...styles.statValue, color: '#27ae60' }}>{activeCount}</span>
          <span style={styles.statLabel}>Aktif</span>
        </div>
        <div style={getStatCardStyle('draft')} onClick={() => handleStatClick('draft')} title="Sadece taslak ürünleri göster">
          <span style={{ ...styles.statValue, color: '#f39c12' }}>{draftCount}</span>
          <span style={styles.statLabel}>Taslak</span>
        </div>
        
        <div 
          style={getStatCardStyle('stock')}
          onClick={() => handleStatClick('stock')}
          title="Stok yönetimini aç"
        >
          <span style={styles.statValue}>{totalStock}</span>
          <span style={styles.statLabel}>Toplam Stok</span>
          
          {stockStats.critical > 0 && (
            <div style={{
              position: 'absolute',
              top: '-8px',
              right: '-8px',
              backgroundColor: '#dc2626',
              color: 'white',
              borderRadius: '12px',
              padding: '2px 8px',
              fontSize: '11px',
              fontWeight: '600',
              boxShadow: '0 2px 4px rgba(220, 38, 38, 0.3)',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              <FaExclamationCircle style={{ fontSize: '10px' }} />
              {stockStats.critical} kritik
            </div>
          )}
        </div>
      </div>

      {isStockPanelOpen && (
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          marginTop: '16px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          overflow: 'hidden'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '16px 20px',
            borderBottom: '1px solid #e2e8f0',
            backgroundColor: '#f8fafc'
          }}>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FaBoxOpen style={{ color: '#059669' }} />
              Stok Durumu
            </h3>
            
            <div style={{ display: 'flex', gap: '8px' }}>
              <button 
                onClick={() => setStockSortOrder(stockSortOrder === 'asc' ? null : 'asc')} 
                style={{ 
                  padding: '6px 12px', 
                  borderRadius: '6px', 
                  border: stockSortOrder === 'asc' ? '1px solid #059669' : '1px solid #e2e8f0', 
                  backgroundColor: stockSortOrder === 'asc' ? '#f0fdf4' : 'white', 
                  color: stockSortOrder === 'asc' ? '#059669' : '#64748b', 
                  fontSize: '12px', 
                  fontWeight: '500', 
                  cursor: 'pointer', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '4px' 
                }}
              >
                <FaSortAmountUp /> Az→Çok
              </button>
              <button 
                onClick={() => setStockSortOrder(stockSortOrder === 'desc' ? null : 'desc')} 
                style={{ 
                  padding: '6px 12px', 
                  borderRadius: '6px', 
                  border: stockSortOrder === 'desc' ? '1px solid #059669' : '1px solid #e2e8f0', 
                  backgroundColor: stockSortOrder === 'desc' ? '#f0fdf4' : 'white', 
                  color: stockSortOrder === 'desc' ? '#059669' : '#64748b', 
                  fontSize: '12px', 
                  fontWeight: '500', 
                  cursor: 'pointer', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '4px' 
                }}
              >
                <FaSortAmountDown /> Çok→Az
              </button>
            </div>
          </div>

          <div style={{ padding: '12px 20px', borderBottom: '1px solid #e2e8f0', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {[
              { key: 'all', label: `Tümü (${products.length})` },
              { key: 'critical', label: `Kritik ≤5 (${stockStats.critical})`, color: '#dc2626' },
              { key: 'low', label: `Düşük 6-9 (${stockStats.low})`, color: '#d97706' },
              { key: 'normal', label: `Normal ≥10 (${stockStats.normal})`, color: '#16a34a' }
            ].map(({ key, label, color }) => (
              <button
                key={key}
                onClick={() => setStockFilter(stockFilter === key ? 'all' : key)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  border: stockFilter === key ? `1px solid ${color || '#059669'}` : '1px solid #e2e8f0',
                  backgroundColor: stockFilter === key ? (color ? `${color}10` : '#f0fdf4') : 'white',
                  color: stockFilter === key ? (color || '#059669') : '#64748b',
                  fontSize: '12px',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                {label}
              </button>
            ))}
          </div>

          <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            {stockProducts.length === 0 ? (
              <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>Bu filtreye uygun ürün bulunamadı.</div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8fafc' }}>
                    <th style={{ padding: '12px 20px', textAlign: 'left', fontSize: '11px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', borderBottom: '1px solid #e2e8f0' }}>Ürün</th>
                    <th style={{ padding: '12px 20px', textAlign: 'center', fontSize: '11px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', borderBottom: '1px solid #e2e8f0', width: '120px' }}>Stok</th>
                    <th style={{ padding: '12px 20px', textAlign: 'center', fontSize: '11px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', borderBottom: '1px solid #e2e8f0', width: '100px' }}>Durum</th>
                  </tr>
                </thead>
                <tbody>
                  {stockProducts.map((product, index) => (
                    <tr key={product.id} style={{ backgroundColor: index % 2 === 0 ? 'white' : '#fafafa' }}>
                      <td style={{ padding: '12px 20px', borderBottom: '1px solid #f1f5f9', fontSize: '13px', color: '#334155', fontWeight: '500' }}>{product.name}</td>
                      <td style={{ padding: '12px 20px', borderBottom: '1px solid #f1f5f9', textAlign: 'center' }}>
                        <span style={{ 
                          display: 'inline-flex', 
                          alignItems: 'center', 
                          gap: '6px', 
                          padding: '4px 12px', 
                          borderRadius: '16px', 
                          fontSize: '13px', 
                          fontWeight: '600', 
                          ...getStockBadgeStyle(product.stock || 0) 
                        }}>
                          {getStockIcon(product.stock || 0)} {product.stock || 0}
                        </span>
                      </td>
                      <td style={{ padding: '12px 20px', borderBottom: '1px solid #f1f5f9', textAlign: 'center', fontSize: '12px' }}>
                        {(product.stock || 0) <= 5 ? (
                          <span style={{ color: '#dc2626', fontWeight: '600' }}>Kritik</span>
                        ) : (product.stock || 0) < 10 ? (
                          <span style={{ color: '#d97706', fontWeight: '600' }}>Düşük</span>
                        ) : (
                          <span style={{ color: '#16a34a', fontWeight: '600' }}>Normal</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div style={{ padding: '12px 20px', borderTop: '1px solid #e2e8f0', backgroundColor: '#f8fafc', fontSize: '12px', color: '#64748b', display: 'flex', justifyContent: 'space-between' }}>
            <span>{stockProducts.length} ürün gösteriliyor</span>
            <div style={{ display: 'flex', gap: '12px' }}>
              {stockStats.critical > 0 && <span style={{ color: '#dc2626' }}>⚠️ {stockStats.critical} kritik</span>}
              {stockStats.low > 0 && <span style={{ color: '#d97706' }}>⚡ {stockStats.low} düşük</span>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductStats;
