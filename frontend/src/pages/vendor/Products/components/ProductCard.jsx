// src/pages/vendor/Products/components/ProductCard.jsx
import React from 'react';
import { FaEdit, FaEye, FaTrash, FaToggleOn, FaToggleOff, FaStar, FaImage } from 'react-icons/fa';
import { styles } from '../styles';

const ProductCard = ({ 
  product, 
  getCategoryName, 
  toFullUrl, 
  onEdit, 
  onView, 
  onDelete, 
  onToggleStatus,
  onImageClick 
}) => {
  const firstPhoto = product.photos?.[0];
  const imageUrl = toFullUrl(firstPhoto?.url || firstPhoto?.path);
  const isActive = product.status === 'active';

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

  return (
    <div style={styles.card}>
      <div 
        style={styles.cardImageWrapper}
        onClick={() => imageUrl && onImageClick(imageUrl)}
      >
        {imageUrl ? (
          <img src={imageUrl} alt={product.name} style={styles.cardImage} />
        ) : (
          <div style={styles.noImage}>
            <FaImage style={{ fontSize: 32, opacity: 0.3 }} />
          </div>
        )}
        {product.is_featured && (
          <span style={styles.featuredBadge}>
            <FaStar style={{ marginRight: 4 }} /> Öne Çıkan
          </span>
        )}
      </div>

      <div style={styles.cardBody}>
        <h3 style={styles.cardTitle}>{product.name}</h3>
        <p style={styles.cardCategory}>{getCategoryName(product.category_id)}</p>
        
        <div style={styles.cardMeta}>
          <span style={styles.cardPrice}>
            {product.price ? `₺${parseFloat(product.price).toLocaleString('tr-TR')}` : '-'}
          </span>
          <span style={styles.cardStock}>Stok: {product.stock ?? 0}</span>
        </div>

        <div style={styles.cardFooter}>
          <span style={getStatusStyle(product.status)}>
            {getStatusLabel(product.status)}
          </span>
          
          <div style={styles.cardActions}>
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
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
