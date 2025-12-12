// src/pages/user/UserReviews/components/PendingReviewCard.jsx
import React from 'react';
import { FaPen } from 'react-icons/fa';

const PendingReviewCard = ({ item, orderNumber, orderId, onReview, styles }) => {
  // Build image URL from backend path
  const imageUrl = item.product_image 
    ? `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/storage/${item.product_image}`
    : 'https://via.placeholder.com/200x200?text=No+Image';

  return (
    <div style={styles.pendingCard}>
      <img
        src={imageUrl}
        alt={item.product_name}
        style={styles.pendingProductImage}
        onError={(e) => { 
          e.target.src = 'https://via.placeholder.com/200x200?text=No+Image';
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