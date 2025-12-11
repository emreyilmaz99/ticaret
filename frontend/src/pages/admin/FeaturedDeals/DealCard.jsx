import React from 'react';
import { FaEdit, FaTrash, FaToggleOn, FaToggleOff, FaEye, FaMousePointer, FaShoppingCart, FaClock, FaImage } from 'react-icons/fa';

const DealCard = ({ deal, onEdit, onDelete, onToggle, isDeleting, isToggling }) => {
  const getStatusBadge = () => {
    if (!deal.is_active) {
      return { text: 'Pasif', color: '#6b7280', bgColor: '#f3f4f6' };
    }
    if (deal.is_active_now) {
      return { text: 'Aktif', color: '#059669', bgColor: '#d1fae5' };
    }
    if (deal.starts_at && new Date(deal.starts_at) > new Date()) {
      return { text: 'Yaklaşan', color: '#f59e0b', bgColor: '#fef3c7' };
    }
    if (deal.ends_at && new Date(deal.ends_at) < new Date()) {
      return { text: 'Süresi Dolmuş', color: '#ef4444', bgColor: '#fee2e2' };
    }
    return { text: 'Bilinmiyor', color: '#6b7280', bgColor: '#f3f4f6' };
  };

  const status = getStatusBadge();

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatTime = (remainingTime) => {
    if (!remainingTime) return null;
    const { days, hours, minutes } = remainingTime;
    if (days > 0) return `${days} gün ${hours} saat`;
    if (hours > 0) return `${hours} saat ${minutes} dakika`;
    return `${minutes} dakika`;
  };

  return (
    <div style={styles.card}>
      {/* Product Image & Info */}
      <div style={styles.productSection}>
        {deal.product?.photos?.[0] ? (
          <img
            src={deal.product.photos[0].url}
            alt={deal.product.name}
            style={styles.productImage}
          />
        ) : (
          <div style={styles.noImage}>
            <FaImage size={32} color="#d1d5db" />
          </div>
        )}
        <div style={styles.productInfo}>
          <h3 style={styles.productName}>
            {deal.title || deal.product?.name}
          </h3>
          {deal.variant && (
            <p style={styles.variantText}>
              Varyant: {deal.variant.sku}
            </p>
          )}
          <p style={styles.vendorName}>
            {deal.product?.vendor?.store_name || 'Satıcı'}
          </p>
        </div>
      </div>

      {/* Status Badge */}
      <div style={styles.statusRow}>
        <span
          style={{
            ...styles.statusBadge,
            color: status.color,
            backgroundColor: status.bgColor,
          }}
        >
          {status.text}
        </span>
        <span style={styles.sortOrder}>Sıra: {deal.sort_order}</span>
      </div>

      {/* Pricing */}
      <div style={styles.pricingSection}>
        <div style={styles.priceRow}>
          <span style={styles.originalPrice}>{deal.original_price} TL</span>
          <span style={styles.dealPrice}>{deal.deal_price} TL</span>
        </div>
        <div style={styles.discountBadge}>
          %{deal.discount_percentage} İNDİRİM
        </div>
      </div>

      {/* Badge Preview */}
      {deal.badge_text && (
        <div
          style={{
            ...styles.badgePreview,
            backgroundColor: deal.badge_color,
          }}
        >
          {deal.badge_text}
        </div>
      )}

      {/* Dates */}
      <div style={styles.datesSection}>
        <div style={styles.dateRow}>
          <FaClock size={12} color="#6b7280" />
          <span style={styles.dateLabel}>Başlangıç:</span>
          <span style={styles.dateValue}>{formatDate(deal.starts_at)}</span>
        </div>
        <div style={styles.dateRow}>
          <FaClock size={12} color="#6b7280" />
          <span style={styles.dateLabel}>Bitiş:</span>
          <span style={styles.dateValue}>{formatDate(deal.ends_at)}</span>
        </div>
        {deal.remaining_time && deal.is_active_now && (
          <div style={styles.remainingTime}>
            ⏰ Kalan süre: {formatTime(deal.remaining_time)}
          </div>
        )}
      </div>

      {/* Analytics */}
      <div style={styles.analyticsSection}>
        <div style={styles.analyticItem}>
          <FaEye size={14} color="#6b7280" />
          <span>{deal.view_count || 0}</span>
        </div>
        <div style={styles.analyticItem}>
          <FaMousePointer size={14} color="#6b7280" />
          <span>{deal.click_count || 0}</span>
        </div>
        <div style={styles.analyticItem}>
          <FaShoppingCart size={14} color="#6b7280" />
          <span>{deal.conversion_count || 0}</span>
        </div>
      </div>

      {/* Actions */}
      <div style={styles.actions}>
        <button
          onClick={onToggle}
          disabled={isToggling}
          style={{
            ...styles.actionBtn,
            color: deal.is_active ? '#059669' : '#6b7280',
          }}
          title={deal.is_active ? 'Pasif Yap' : 'Aktif Yap'}
        >
          {deal.is_active ? <FaToggleOn size={20} /> : <FaToggleOff size={20} />}
        </button>
        <button
          onClick={onEdit}
          style={{ ...styles.actionBtn, color: '#3b82f6' }}
          title="Düzenle"
        >
          <FaEdit size={16} />
        </button>
        <button
          onClick={onDelete}
          disabled={isDeleting}
          style={{ ...styles.actionBtn, color: '#ef4444' }}
          title="Sil"
        >
          <FaTrash size={16} />
        </button>
      </div>
    </div>
  );
};

const styles = {
  card: {
    backgroundColor: 'white',
    borderRadius: '12px',
    border: '1px solid #e5e7eb',
    overflow: 'hidden',
    transition: 'all 0.3s',
    cursor: 'pointer',
    ':hover': {
      boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
      transform: 'translateY(-4px)',
    },
  },
  productSection: {
    display: 'flex',
    gap: '12px',
    padding: '16px',
    borderBottom: '1px solid #f3f4f6',
  },
  productImage: {
    width: '80px',
    height: '80px',
    objectFit: 'cover',
    borderRadius: '8px',
    flexShrink: 0,
  },
  noImage: {
    width: '80px',
    height: '80px',
    backgroundColor: '#f3f4f6',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  productInfo: {
    flex: 1,
    minWidth: 0,
  },
  productName: {
    fontSize: '15px',
    fontWeight: '600',
    color: '#111827',
    marginBottom: '4px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
  },
  variantText: {
    fontSize: '12px',
    color: '#8b5cf6',
    marginBottom: '4px',
  },
  vendorName: {
    fontSize: '12px',
    color: '#6b7280',
  },
  statusRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 16px',
    borderBottom: '1px solid #f3f4f6',
  },
  statusBadge: {
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '600',
  },
  sortOrder: {
    fontSize: '12px',
    color: '#6b7280',
    fontWeight: '500',
  },
  pricingSection: {
    padding: '16px',
    borderBottom: '1px solid #f3f4f6',
  },
  priceRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '8px',
  },
  originalPrice: {
    fontSize: '16px',
    color: '#9ca3af',
    textDecoration: 'line-through',
  },
  dealPrice: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#059669',
  },
  discountBadge: {
    display: 'inline-block',
    padding: '4px 12px',
    backgroundColor: '#fef3c7',
    color: '#f59e0b',
    borderRadius: '6px',
    fontSize: '13px',
    fontWeight: '700',
  },
  badgePreview: {
    padding: '8px 16px',
    margin: '0 16px 16px 16px',
    borderRadius: '6px',
    color: 'white',
    fontSize: '12px',
    fontWeight: '700',
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  datesSection: {
    padding: '12px 16px',
    borderBottom: '1px solid #f3f4f6',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  dateRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '12px',
  },
  dateLabel: {
    color: '#6b7280',
    fontWeight: '500',
  },
  dateValue: {
    color: '#374151',
  },
  remainingTime: {
    marginTop: '4px',
    padding: '6px 12px',
    backgroundColor: '#fef3c7',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: '600',
    color: '#f59e0b',
    textAlign: 'center',
  },
  analyticsSection: {
    display: 'flex',
    justifyContent: 'space-around',
    padding: '12px 16px',
    borderBottom: '1px solid #f3f4f6',
  },
  analyticItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
    fontSize: '13px',
    color: '#374151',
    fontWeight: '600',
  },
  actions: {
    display: 'flex',
    justifyContent: 'space-around',
    padding: '12px 16px',
  },
  actionBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '8px',
    borderRadius: '6px',
    transition: 'background-color 0.2s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
};

export default DealCard;
