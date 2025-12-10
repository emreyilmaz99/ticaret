import React, { useState } from 'react';
import { FiLoader, FiXCircle } from 'react-icons/fi';
import { useUserOrders } from './useUserOrders';
import { styles } from './styles';
import { OrderCard } from './components/OrderCard';
import { EmptyOrders } from './components/EmptyOrders';
import { OrdersHeader } from './components/OrdersHeader';
import { useQuery } from '@tanstack/react-query';
import { getOrder } from '../../../features/checkout/api/checkoutApi';

const UserOrders = () => {
  // STATE: Hangi siparişin detayının gösterileceğini tutar. Null ise detay kapalıdır.
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  const {
    orders,
    pagination,
    currentPage,
    isLoading,
    error,
    formatPrice,
    formatDate,
    getStatusConfig,
    getPaymentStatusConfig,
    handlePageChange
  } = useUserOrders();

  // Detay toggle fonksiyonu
  const handleToggleDetail = (orderId) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  // Seçili siparişin detayını çek
  const { data: orderDetail, isLoading: isDetailLoading } = useQuery({
    queryKey: ['orderDetail', expandedOrderId],
    queryFn: () => getOrder(expandedOrderId),
    enabled: !!expandedOrderId,
  });

  if (isLoading) {
    return (
      <div style={styles.loadingContainer}>
        <FiLoader className="animate-spin" size={32} color="#2563eb" />
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.errorContainer}>
        <FiXCircle size={48} color="#f87171" style={{ margin: '0 auto 12px' }} />
        <h3 style={{ fontSize: '18px', fontWeight: '500', color: '#991b1b', marginBottom: '4px' }}>
          Siparişler yüklenemedi
        </h3>
        <p style={{ color: '#dc2626', fontSize: '14px' }}>
          {error.message || 'Bir hata oluştu'}
        </p>
      </div>
    );
  }

  if (orders.length === 0) {
    return <EmptyOrders styles={styles} />;
  }

  return (
    <div style={styles.container}>
      <OrdersHeader 
        totalOrders={pagination?.total || orders.length} 
        styles={styles} 
      />

      <div style={styles.ordersList}>
        {orders.map((order) => (
          <React.Fragment key={order.id}>
            <OrderCard
              order={order}
              formatDate={formatDate}
              formatPrice={formatPrice}
              getStatusConfig={getStatusConfig}
              getPaymentStatusConfig={getPaymentStatusConfig}
              styles={styles}
              onDetailClick={() => handleToggleDetail(order.id)}
            />
            
            {/* Detay Bölümü - Expand/Collapse */}
            {expandedOrderId === order.id && (
              <div style={{
                backgroundColor: '#f9fafb',
                border: '1px solid #e5e7eb',
                borderTop: 'none',
                borderRadius: '0 0 16px 16px',
                padding: '24px',
                marginTop: '-12px',
                marginBottom: '16px',
              }}>
                {isDetailLoading ? (
                  <div style={{ textAlign: 'center', padding: '40px' }}>
                    <FiLoader className="animate-spin" size={24} color="#2563eb" style={{ margin: '0 auto' }} />
                  </div>
                ) : orderDetail ? (
                  <OrderDetailContent 
                    order={orderDetail.data} 
                    formatPrice={formatPrice} 
                    formatDate={formatDate}
                  />
                ) : null}
              </div>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Pagination */}
      {pagination && pagination.last_page > 1 && (
        <div style={styles.pagination}>
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            style={{
              ...styles.pageButton,
              opacity: currentPage === 1 ? 0.5 : 1,
              cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
            }}
          >
            Önceki
          </button>
          <span style={styles.pageInfo}>
            {currentPage} / {pagination.last_page}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === pagination.last_page}
            style={{
              ...styles.pageButton,
              opacity: currentPage === pagination.last_page ? 0.5 : 1,
              cursor: currentPage === pagination.last_page ? 'not-allowed' : 'pointer'
            }}
          >
            Sonraki
          </button>
        </div>
      )}

    </div>
  );
};

// Sipariş Detay İçeriği Komponenti
const OrderDetailContent = ({ order, formatPrice, formatDate }) => {
  return (
    <div style={{ display: 'grid', gap: '24px' }}>
      {/* Ürünler */}
      <div>
        <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#111827', marginBottom: '16px' }}>
          Sipariş Ürünleri
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {order.items?.map((item, idx) => (
            <div key={idx} style={{
              display: 'flex',
              gap: '16px',
              padding: '16px',
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              border: '1px solid #e5e7eb'
            }}>
              <img
                src={item.product?.photos?.[0]?.file_path || 'https://via.placeholder.com/80'}
                alt={item.product_name}
                style={{ width: '80px', height: '80px', objectFit: 'contain', borderRadius: '8px' }}
              />
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '14px', fontWeight: '600', color: '#111827', marginBottom: '4px' }}>
                  {item.product_name}
                </p>
                <p style={{ fontSize: '13px', color: '#6b7280' }}>
                  Adet: {item.quantity}
                </p>
                <p style={{ fontSize: '14px', fontWeight: '700', color: '#059669', marginTop: '8px' }}>
                  {formatPrice(item.price * item.quantity)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Adres Bilgileri */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
        <div style={{ padding: '16px', backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
          <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#111827', marginBottom: '12px' }}>
            Teslimat Adresi
          </h4>
          {order.shipping_address && (
            <p style={{ fontSize: '13px', color: '#6b7280', lineHeight: '1.6' }}>
              {order.shipping_address.address}<br />
              {order.shipping_address.district}, {order.shipping_address.city}<br />
              {order.shipping_address.postal_code}
            </p>
          )}
        </div>

        <div style={{ padding: '16px', backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
          <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#111827', marginBottom: '12px' }}>
            Fatura Adresi
          </h4>
          {order.billing_address && (
            <p style={{ fontSize: '13px', color: '#6b7280', lineHeight: '1.6' }}>
              {order.billing_address.address}<br />
              {order.billing_address.district}, {order.billing_address.city}<br />
              {order.billing_address.postal_code}
            </p>
          )}
        </div>
      </div>

      {/* Ödeme Özeti */}
      <div style={{ padding: '20px', backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
        <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#111827', marginBottom: '12px' }}>
          Ödeme Özeti
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
            <span style={{ color: '#6b7280' }}>Ara Toplam:</span>
            <span style={{ color: '#111827', fontWeight: '600' }}>{formatPrice(order.subtotal)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
            <span style={{ color: '#6b7280' }}>Kargo:</span>
            <span style={{ color: '#111827', fontWeight: '600' }}>{formatPrice(order.shipping_cost || 0)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '15px', fontWeight: '700', paddingTop: '8px', borderTop: '1px solid #e5e7eb' }}>
            <span style={{ color: '#111827' }}>Toplam:</span>
            <span style={{ color: '#059669' }}>{formatPrice(order.total)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserOrders;