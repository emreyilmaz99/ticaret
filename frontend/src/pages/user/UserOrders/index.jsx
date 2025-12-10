import React, { useState } from 'react';
import { FiLoader, FiXCircle } from 'react-icons/fi';
import { useUserOrders } from './useUserOrders';
import { styles } from './styles';
import { OrderCard } from './components/OrderCard';
import { EmptyOrders } from './components/EmptyOrders';
import { OrdersHeader } from './components/OrdersHeader';
// Dosya yapına göre bir üst klasöre çıkıp UserOrderDetail'i alıyoruz
import UserOrderDetail from '../UserOrderDetail'; 

const UserOrders = () => {
  // 1. STATE: Hangi siparişin detayının açılacağını tutar. Null ise modal kapalıdır.
  const [selectedOrderId, setSelectedOrderId] = useState(null);

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

  // Modal Açma Fonksiyonu
  const handleOpenDetail = (orderId) => {
    setSelectedOrderId(orderId);
  };

  // Modal Kapatma Fonksiyonu
  const handleCloseDetail = () => {
    setSelectedOrderId(null);
  };

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
          <OrderCard
            key={order.id}
            order={order}
            formatDate={formatDate}
            formatPrice={formatPrice}
            getStatusConfig={getStatusConfig}
            getPaymentStatusConfig={getPaymentStatusConfig}
            styles={styles}
            // 2. DEĞİŞİKLİK: Link yerine tıklama fonksiyonunu gönderiyoruz
            onDetailClick={() => handleOpenDetail(order.id)}
          />
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

      {/* 3. DEĞİŞİKLİK: MODAL ENTEGRASYONU */}
      {selectedOrderId && (
        <UserOrderDetail 
          orderId={selectedOrderId} 
          onClose={handleCloseDetail} 
        />
      )}
    </div>
  );
};

export default UserOrders;