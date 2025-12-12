// src/pages/user/UserReviews/components/PendingReviewCard.jsx
import React from 'react';
import { FaPen } from 'react-icons/fa';

const PendingReviewCard = ({ item, orderNumber, orderId, onReview, styles }) => {
  // Build image URL from backend path
  const imageUrl = item.product_image 
    ? `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/storage/${item.product_image}`
    : 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23f1f5f9" width="200" height="200"/%3E%3Ctext fill="%2394a3b8" font-family="Arial" font-size="14" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3EGörsel Yok%3C/text%3E%3C/svg%3E';

  return (
    <div style={styles.pendingCard}>
      <img
        src={imageUrl}
        alt={item.product_name}
        style={styles.pendingProductImage}
        onError={(e) => { 
          e.target.onerror = null;
          e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23f1f5f9" width="200" height="200"/%3E%3Ctext fill="%2394a3b8" font-family="Arial" font-size="14" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3EGörsel Yok%3C/text%3E%3C/svg%3E';
        }}
      />
      
      <div style={styles.pendingProductInfo}>
        <div>
          <div style={styles.pendingProductName}>{item.product_name}</div>
          <div style={styles.pendingOrderInfo}>
            Sipariş: #{orderNumber}
          </div>
        </div>
        
        <button
          style={styles.pendingReviewBtn}
          onClick={() => onReview(orderId, item.order_item_id, {
            ...item,
            order_number: orderNumber,
          })}
        >
          <FaPen size={12} style={{ marginRight: '6px' }} />
          Değerlendir
        </button>
      </div>
    </div>
  );
};

export default PendingReviewCard;