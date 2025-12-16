// src/pages/admin/Products/ProductTable.jsx
import React from 'react';
import { FaStore, FaImage, FaEye, FaCheck, FaTimes } from 'react-icons/fa';
import { StatusBadge } from '../../../features/admin/shared';
import { toFullUrl } from './styles';

/**
 * Ürün tablosu bileşeni
 */
const ProductTable = ({
  products,
  isLoading,
  selectedProducts,
  onToggleSelectAll,
  onToggleSelect,
  onView,
  onStatusChange,
  styles
}) => {
  return (
    <table style={styles.table}>
      <thead>
        <tr>
          <th style={styles.th}>
            <input 
              type="checkbox" 
              checked={selectedProducts.length === products.length && products.length > 0}
              onChange={onToggleSelectAll}
            />
          </th>
          <th style={styles.th}>Ürün</th>
          <th style={styles.th}>Satıcı</th>
          <th style={styles.th}>Fiyat</th>
          <th style={styles.th}>Stok</th>
          <th style={styles.th}>Durum</th>
          <th style={styles.th}>Tarih</th>
          <th style={{ ...styles.th, textAlign: 'right' }}>İşlemler</th>
        </tr>
      </thead>
      <tbody>
        {isLoading ? (
          <tr>
            <td colSpan={8} style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
              Yükleniyor...
            </td>
          </tr>
        ) : products.length === 0 ? (
          <tr>
            <td colSpan={8} style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
              Ürün bulunamadı
            </td>
          </tr>
        ) : products.map(product => (
          <tr key={product.id}>
            <td style={styles.td}>
              <input 
                type="checkbox" 
                checked={selectedProducts.includes(product.id)}
                onChange={() => onToggleSelect(product.id)}
              />
            </td>
            <td style={styles.td}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={styles.thumbnail}>
                  {product.thumbnail ? (
                    <img 
                      src={toFullUrl(product.thumbnail)} 
                      alt={product.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  ) : (
                    <FaImage style={{ color: '#cbd5e1' }} />
                  )}
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
            <td style={{ ...styles.td, fontWeight: '600' }}>
              {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(product.price || 0)}
            </td>
            <td style={styles.td}>
              <span style={{ 
                color: product.stock > 10 ? '#047857' : product.stock > 0 ? '#b45309' : '#dc2626'
              }}>
                {product.stock} adet
              </span>
            </td>
            <td style={styles.td}>
              <StatusBadge status={product.status} />
            </td>
            <td style={styles.td}>
              <div style={{ fontSize: '13px' }}>
                {new Date(product.created_at).toLocaleDateString('tr-TR')}
              </div>
            </td>
            <td style={{ ...styles.td, textAlign: 'right' }}>
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                <button 
                  onClick={() => onView(product)} 
                  style={{ ...styles.btn(), padding: '8px' }}
                  title="Görüntüle"
                >
                  <FaEye />
                </button>
                {product.status === 'pending' && (
                  <>
                    <button 
                      onClick={() => onStatusChange(product.id, 'active')} 
                      style={{ ...styles.btn('success'), padding: '8px' }}
                      title="Onayla"
                    >
                      <FaCheck />
                    </button>
                    <button 
                      onClick={() => onStatusChange(product.id, 'rejected', product.name)} 
                      style={{ ...styles.btn('danger'), padding: '8px' }}
                      title="Reddet"
                    >
                      <FaTimes />
                    </button>
                  </>
                )}
                {product.status === 'active' && (
                  <button 
                    onClick={() => onStatusChange(product.id, 'inactive')} 
                    style={{ ...styles.btn('danger'), padding: '8px' }}
                    title="Pasife Al"
                  >
                    <FaTimes />
                  </button>
                )}
                {(product.status === 'rejected' || product.status === 'inactive' || product.status === 'draft') && (
                  <button 
                    onClick={() => onStatusChange(product.id, 'active')} 
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
  );
};

export default ProductTable;
