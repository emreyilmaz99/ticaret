// src/pages/vendor/Promotions/components/CouponsTab.jsx
import React from 'react';
import { FaTag, FaPlus, FaEdit, FaTrash, FaToggleOn, FaToggleOff } from 'react-icons/fa';
import { styles } from '../styles';

const CouponsTab = ({ 
  coupons, 
  onAdd, 
  onEdit, 
  onDelete, 
  onToggle 
}) => {
  const formatDate = (date) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('tr-TR');
  };

  const isExpired = (coupon) => {
    if (!coupon.expires_at) return false;
    return new Date(coupon.expires_at) < new Date();
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
        <button style={styles.addButton} onClick={onAdd}>
          <FaPlus /> Yeni Kupon
        </button>
      </div>

      {coupons.length === 0 ? (
        <div style={{ ...styles.card, ...styles.emptyState }}>
          <FaTag style={styles.emptyIcon} />
          <p style={styles.emptyText}>Henüz kupon oluşturmadınız.</p>
          <button style={{ ...styles.addButton, margin: '16px auto 0' }} onClick={onAdd}>
            <FaPlus /> İlk Kuponu Oluştur
          </button>
        </div>
      ) : (
        coupons.map((coupon) => (
          <div 
            key={coupon.id} 
            style={{ 
              ...styles.card, 
              ...(coupon.is_active ? {} : styles.cardInactive) 
            }}
          >
            <div style={styles.couponHeader}>
              <div style={styles.couponInfo}>
                <div style={styles.couponTitleRow}>
                  <span style={styles.couponCode}>{coupon.code}</span>
                  <span style={styles.couponName}>{coupon.name}</span>
                  {!coupon.is_active && (
                    <span style={styles.badgeInactive}>Pasif</span>
                  )}
                  {isExpired(coupon) && (
                    <span style={styles.badgeExpired}>Süresi Doldu</span>
                  )}
                </div>
                
                <div style={styles.couponMeta}>
                  <span>
                    <strong style={styles.discountAmount}>
                      {parseFloat(coupon.discount_amount).toFixed(0)}₺
                    </strong> indirim
                  </span>
                  <span>Min. sepet: <strong>{parseFloat(coupon.min_order_amount).toFixed(0)}₺</strong></span>
                  {coupon.usage_limit && (
                    <span>Limit: {coupon.usage_count}/{coupon.usage_limit}</span>
                  )}
                  <span>Tarih: {formatDate(coupon.starts_at)} - {formatDate(coupon.expires_at)}</span>
                </div>
              </div>
              
              <div style={styles.actionsContainer}>
                <button 
                  onClick={() => onToggle(coupon.id)}
                  style={{ 
                    ...styles.toggleBtn,
                    ...(coupon.is_active ? styles.toggleActive : styles.toggleInactive)
                  }}
                >
                  {coupon.is_active ? <FaToggleOn /> : <FaToggleOff />}
                </button>
                <button 
                  onClick={() => onEdit(coupon)}
                  style={styles.actionBtn}
                >
                  <FaEdit />
                </button>
                <button 
                  onClick={() => onDelete(coupon.id)}
                  style={styles.deleteBtn}
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default CouponsTab;
