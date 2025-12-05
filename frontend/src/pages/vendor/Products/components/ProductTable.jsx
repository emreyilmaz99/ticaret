// src/pages/vendor/Products/components/ProductTable.jsx
import React from 'react';
import { FaEdit, FaEye, FaTrash, FaToggleOn, FaToggleOff, FaStar, FaImage } from 'react-icons/fa';
import { styles } from '../styles';

const ProductTable = ({ 
  products, 
  getCategoryName, 
  toFullUrl, 
  onEdit, 
  onView, 
  onDelete, 
  onToggleStatus,
  onImageClick 
}) => {
  const getStatusStyle = (status) => {
    switch (status) {
      case 'active': return styles.statusActive;
      case 'draft': return styles.statusDraft;
      case 'pending': return styles.statusPending;
      default: return styles.statusDefault;
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'active': return 'Aktif';
      case 'draft': return 'Taslak';
      case 'pending': return 'Beklemede';
      default: return status;
    }
  };

  if (products.length === 0) {
    return (
      <div style={styles.emptyState}>
        <p>Henüz ürün eklenmemiş.</p>
      </div>
    );
  }

  return (
    <div style={styles.tableWrapper}>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Görsel</th>
            <th style={styles.th}>Ürün Adı</th>
            <th style={styles.th}>Kategori</th>
            <th style={styles.th}>Fiyat</th>
            <th style={styles.th}>Stok</th>
            <th style={styles.th}>Durum</th>
            <th style={styles.th}>İşlemler</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => {
            const firstPhoto = product.photos?.[0];
            const imageUrl = toFullUrl(firstPhoto?.url || firstPhoto?.path);
            const isActive = product.status === 'active';

            return (
              <tr key={product.id} style={styles.tr}>
                <td style={styles.td}>
                  <div 
                    style={styles.tableImageWrapper}
                    onClick={() => imageUrl && onImageClick(imageUrl)}
                  >
                    {imageUrl ? (
                      <img src={imageUrl} alt={product.name} style={styles.tableImage} />
                    ) : (
                      <div style={styles.tableNoImage}>
                        <FaImage style={{ fontSize: 16, opacity: 0.3 }} />
                      </div>
                    )}
                  </div>
                </td>
                <td style={styles.td}>
                  <div style={styles.productNameCell}>
                    <span style={styles.productName}>{product.name}</span>
                    {product.is_featured && (
                      <FaStar style={{ color: '#f1c40f', marginLeft: 6 }} title="Öne Çıkan" />
                    )}
                  </div>
                  {product.sku && <small style={styles.skuText}>SKU: {product.sku}</small>}
                </td>
                <td style={styles.td}>{getCategoryName(product.category_id)}</td>
                <td style={styles.td}>
                  {product.price ? `₺${parseFloat(product.price).toLocaleString('tr-TR')}` : '-'}
                </td>
                <td style={styles.td}>{product.stock ?? 0}</td>
                <td style={styles.td}>
                  <span style={getStatusStyle(product.status)}>
                    {getStatusLabel(product.status)}
                  </span>
                </td>
                <td style={styles.td}>
                  <div style={styles.tableActions}>
                    <button 
                      style={styles.actionBtn}
                      onClick={() => onView(product)}
                      title="Görüntüle"
                    >
                      <FaEye />
                    </button>
                    <button 
                      style={styles.actionBtn}
                      onClick={() => onEdit(product)}
                      title="Düzenle"
                    >
                      <FaEdit />
                    </button>
                    <button 
                      style={{ ...styles.actionBtn, color: isActive ? '#27ae60' : '#95a5a6' }}
                      onClick={() => onToggleStatus(product)}
                      title={isActive ? 'Pasife Al' : 'Aktif Et'}
                    >
                      {isActive ? <FaToggleOn /> : <FaToggleOff />}
                    </button>
                    <button 
                      style={{ ...styles.actionBtn, color: '#e74c3c' }}
                      onClick={() => onDelete(product)}
                      title="Sil"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;
