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
  const [expandedOrderNumber, setExpandedOrderNumber] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 3; // Sayfa başına 3 sipariş

  const {
    orders,
    isLoading,
    error,
    formatPrice,
    formatDate,
    getStatusConfig,
    getPaymentStatusConfig
  } = useUserOrders();

  // Frontend Pagination Hesaplaması
  const totalPages = Math.ceil(orders.length / ordersPerPage);
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Detay toggle fonksiyonu
  const handleToggleDetail = (orderNumber) => {
    setExpandedOrderNumber(expandedOrderNumber === orderNumber ? null : orderNumber);
  };

  // Seçili siparişin detayını çek
  const { data: orderDetail, isLoading: isDetailLoading } = useQuery({
    queryKey: ['orderDetail', expandedOrderNumber],
    queryFn: () => getOrder(expandedOrderNumber),
    enabled: !!expandedOrderNumber,
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
        totalOrders={orders.length} 
        styles={styles} 
      />

      <div style={styles.ordersList}>
        {currentOrders.map((order) => (
          <React.Fragment key={order.id}>
            <OrderCard
              order={order}
              formatDate={formatDate}
              formatPrice={formatPrice}
              getStatusConfig={getStatusConfig}
              getPaymentStatusConfig={getPaymentStatusConfig}
              styles={styles}
              onDetailClick={() => handleToggleDetail(order.order_number)}
            />
            
            {/* Detay Bölümü - Expand/Collapse */}
            {expandedOrderNumber === order.order_number && (
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
                    order={orderDetail.data.order} 
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
      {totalPages > 1 && (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '8px',
          marginTop: '32px',
          padding: '20px 0'
        }}>
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            style={{
              padding: '10px 16px',
              backgroundColor: currentPage === 1 ? '#f3f4f6' : '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '500',
              color: currentPage === 1 ? '#9ca3af' : '#374151',
              cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
              opacity: currentPage === 1 ? 0.6 : 1
            }}
            onMouseEnter={(e) => {
              if (currentPage !== 1) {
                e.target.style.backgroundColor = '#f9fafb';
                e.target.style.borderColor = '#d1d5db';
              }
            }}
            onMouseLeave={(e) => {
              if (currentPage !== 1) {
                e.target.style.backgroundColor = '#ffffff';
                e.target.style.borderColor = '#e5e7eb';
              }
            }}
          >
            ← Önceki
          </button>
          
          {/* Sayfa Numaraları */}
          {[...Array(totalPages)].map((_, index) => {
            const pageNumber = index + 1;
            return (
              <button
                key={pageNumber}
                onClick={() => handlePageChange(pageNumber)}
                style={{
                  width: '40px',
                  height: '40px',
                  backgroundColor: currentPage === pageNumber ? '#059669' : '#ffffff',
                  border: '1px solid',
                  borderColor: currentPage === pageNumber ? '#059669' : '#e5e7eb',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: currentPage === pageNumber ? '#ffffff' : '#374151',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  if (currentPage !== pageNumber) {
                    e.target.style.backgroundColor = '#f0fdf4';
                    e.target.style.borderColor = '#059669';
                    e.target.style.color = '#059669';
                  }
                }}
                onMouseLeave={(e) => {
                  if (currentPage !== pageNumber) {
                    e.target.style.backgroundColor = '#ffffff';
                    e.target.style.borderColor = '#e5e7eb';
                    e.target.style.color = '#374151';
                  }
                }}
              >
                {pageNumber}
              </button>
            );
          })}
          
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            style={{
              padding: '10px 16px',
              backgroundColor: currentPage === totalPages ? '#f3f4f6' : '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '500',
              color: currentPage === totalPages ? '#9ca3af' : '#374151',
              cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
              opacity: currentPage === totalPages ? 0.6 : 1
            }}
            onMouseEnter={(e) => {
              if (currentPage !== totalPages) {
                e.target.style.backgroundColor = '#f9fafb';
                e.target.style.borderColor = '#d1d5db';
              }
            }}
            onMouseLeave={(e) => {
              if (currentPage !== totalPages) {
                e.target.style.backgroundColor = '#ffffff';
                e.target.style.borderColor = '#e5e7eb';
              }
            }}
          >
            Sonraki →
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
          {order.products?.map((item, idx) => (
            <div key={idx} style={{
              display: 'flex',
              gap: '16px',
              padding: '16px',
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              border: '1px solid #e5e7eb'
            }}>
              <img
                src={item.image}
                alt={item.name}
                style={{ width: '80px', height: '80px', objectFit: 'contain', borderRadius: '8px' }}
                onError={(e) => { e.target.onerror = null; e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="80" height="80"%3E%3Crect fill="%23f1f5f9" width="80" height="80"/%3E%3Ctext fill="%2394a3b8" font-family="Arial" font-size="10" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3EGörsel%3C/text%3E%3C/svg%3E'; }}
              />
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '14px', fontWeight: '600', color: '#111827', marginBottom: '4px' }}>
                  {item.name}
                </p>
                {item.variant && (
                  <p style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '4px' }}>
                    {item.variant}
                  </p>
                )}
                <p style={{ fontSize: '13px', color: '#6b7280' }}>
                  Adet: {item.qty}
                </p>
                <p style={{ fontSize: '14px', fontWeight: '700', color: '#059669', marginTop: '8px' }}>
                  {formatPrice(item.price_after_coupon)}
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
              {order.shipping_address.address_line}<br />
              {order.shipping_address.district}, {order.shipping_address.city}<br />
              {order.shipping_address.postal_code}
            </p>
          )}
        </div>

        <div style={{ padding: '16px', backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
          <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#111827', marginBottom: '12px' }}>
            Fatura Adresi
          </h4>
          {(order.billing_address || order.shipping_address) && (
            <p style={{ fontSize: '13px', color: '#6b7280', lineHeight: '1.6' }}>
              {(order.billing_address?.address_line || order.shipping_address?.address_line)}<br />
              {(order.billing_address?.district || order.shipping_address?.district)}, {(order.billing_address?.city || order.shipping_address?.city)}<br />
              {(order.billing_address?.postal_code || order.shipping_address?.postal_code)}
            </p>
          )}
        </div>
      </div>

      {/* Ödeme Özeti */}
      <div style={{ padding: '20px', backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#111827' }}>
            Ödeme Özeti
          </h4>
          <button
            onClick={() => window.open(`/invoice/${order.order_number}`, '_blank')}
            style={{
              padding: '6px 12px',
              backgroundColor: '#ffffff',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: '500',
              color: '#374151',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#f9fafb';
              e.target.style.borderColor = '#9ca3af';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#ffffff';
              e.target.style.borderColor = '#d1d5db';
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
            Faturayı Görüntüle
          </button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
            <span style={{ color: '#6b7280' }}>Ara Toplam:</span>
            <span style={{ color: '#111827', fontWeight: '600' }}>{formatPrice(order.subtotal)}</span>
          </div>
          {order.coupon_discount > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
              <span style={{ color: '#059669' }}>
                Kupon İndirimi {order.coupon_code && `(${order.coupon_code})`}:
              </span>
              <span style={{ color: '#059669', fontWeight: '600' }}>-{formatPrice(order.coupon_discount)}</span>
            </div>
          )}
          {order.tax_amount > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
              <span style={{ color: '#6b7280' }}>KDV:</span>
              <span style={{ color: '#111827', fontWeight: '600' }}>{formatPrice(order.tax_amount)}</span>
            </div>
          )}
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
            <span style={{ color: '#6b7280' }}>Kargo:</span>
            <span style={{ color: '#111827', fontWeight: '600' }}>{formatPrice(order.shipping_cost || 0)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '15px', fontWeight: '700', paddingTop: '8px', borderTop: '1px solid #e5e7eb' }}>
            <span style={{ color: '#111827' }}>Toplam:</span>
            <span style={{ color: '#059669' }}>{formatPrice(order.amount)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserOrders;