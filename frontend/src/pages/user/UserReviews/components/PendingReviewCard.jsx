// src/pages/user/UserReviews/components/PendingReviewCard.jsx
import React from 'react';
import { FaPen } from 'react-icons/fa';

const PendingReviewCard = ({ item, orderNumber, orderId, onReview, styles }) => {
  return (
    <div style={styles.pendingCard}>
      <img
        src={item.product_image || '/placeholder.png'}
        alt={item.product_name}
        style={styles.pendingProductImage}
        onError={(e) => { e.target.src = '/placeholder.png'; }}
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
