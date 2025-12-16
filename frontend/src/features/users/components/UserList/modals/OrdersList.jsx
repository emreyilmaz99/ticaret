// src/features/users/components/UserList/modals/OrdersList.jsx
import React from 'react';
import PropTypes from 'prop-types';
import { FaCopy } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../../../../components/common/Toast';
import { formatDateTimeLong, formatPrice } from '../../../utils/formatters';
import { ORDER_STATUS_MAP, PAYMENT_STATUS_MAP } from '../../../shared/constants';
import { styles } from '../../../shared/styles';

const OrdersList = React.memo(({ orders, isLoading }) => {
  const navigate = useNavigate();
  const toast = useToast();

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
        Siparişler yükleniyor...
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
        Bu kullanıcının henüz siparişi bulunmuyor.
      </div>
    );
  }

  const handleOrderClick = (orderId) => {
    navigate(`/admin/orders?id=${orderId}`);
  };

  const handleCopyOrderNumber = (e, orderNumber) => {
    e.stopPropagation();
    navigator.clipboard.writeText(orderNumber);
    toast.success('Sipariş ID kopyalandı!');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {orders.map((order) => {
        const statusConfig = ORDER_STATUS_MAP[order.status] || { label: order.status, color: 'gray' };
        const paymentConfig = PAYMENT_STATUS_MAP[order.payment_status] || { label: order.payment_status, color: '#64748b' };

        return (
          <div
            key={order.id}
            style={{
              padding: '16px',
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#3b82f6';
              e.currentTarget.style.backgroundColor = '#eff6ff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#e2e8f0';
              e.currentTarget.style.backgroundColor = '#f8fafc';
            }}
            onClick={() => handleOrderClick(order.id)}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
              <div>
                <div style={{ fontSize: '14px', fontWeight: '600', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  Sipariş #{order.order_number}
                  <button
                    onClick={(e) => handleCopyOrderNumber(e, order.order_number)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      color: '#64748b',
                      padding: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      transition: 'color 0.2s',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#3b82f6')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = '#64748b')}
                    title="Sipariş ID'sini kopyala"
                  >
                    <FaCopy size={14} />
                  </button>
                </div>
                <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                  {formatDateTimeLong(order.created_at)}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span
                  style={{
                    ...styles.badge(statusConfig.color),
                    marginBottom: '4px',
                    display: 'inline-block',
                  }}
                >
                  {statusConfig.label}
                </span>
                <div style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a', marginTop: '4px' }}>
                  {formatPrice(order.total)}
                </div>
              </div>
            </div>
            <div
              style={{
                fontSize: '12px',
                color: paymentConfig.color,
                fontWeight: '500',
              }}
            >
              Ödeme: {paymentConfig.label}
            </div>
          </div>
        );
      })}
    </div>
  );
});

OrdersList.displayName = 'OrdersList';

OrdersList.propTypes = {
  orders: PropTypes.array.isRequired,
  isLoading: PropTypes.bool,
};

export default OrdersList;
