// src/pages/user/UserOrderDetail/index.jsx
import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  FiLoader, 
  FiXCircle, 
  FiArrowLeft, 
  FiPackage, 
  FiMapPin, 
  FiCreditCard,
  FiCalendar,
  FiAlertCircle
} from 'react-icons/fi';
import { useUserOrderDetail } from './useUserOrderDetail';
import { styles } from './styles';

const UserOrderDetail = () => {
  const { orderNumber } = useParams();
  const navigate = useNavigate();
  const {
    order,
    isLoading,
    error,
    isCancelling,
    formatPrice,
    formatDate,
    getStatusConfig,
    getPaymentStatusConfig,
    handleCancelOrder
  } = useUserOrderDetail(orderNumber);

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
          Sipariş bulunamadı
        </h3>
        <p style={{ color: '#dc2626', fontSize: '14px', marginBottom: '16px' }}>
          {error.message || 'Bir hata oluştu'}
        </p>
        <Link to="/account/orders" style={styles.backButton}>
          <FiArrowLeft size={16} />
          Siparişlere Dön
        </Link>
      </div>
    );
  }

  if (!order) return null;

  const statusConfig = getStatusConfig(order.status);
  const paymentConfig = getPaymentStatusConfig(order.payment_status);
  const StatusIcon = statusConfig.icon;

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <button onClick={() => navigate('/account/orders')} style={styles.backButton}>
          <FiArrowLeft size={20} />
          Siparişlere Dön
        </button>
        <div style={styles.headerInfo}>
          <h1 style={styles.title}>Sipariş Detayı</h1>
          <p style={styles.orderNumber}>#{order.order_number}</p>
        </div>
      </div>

      {/* Status Cards */}
      <div style={styles.statusCards}>
        <div style={styles.statusCard}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <FiPackage size={20} color={statusConfig.color} />
            <span style={{ fontSize: '14px', color: '#6b7280' }}>Sipariş Durumu</span>
          </div>
          <div style={{
            ...styles.statusBadge,
            backgroundColor: statusConfig.bg,
            color: statusConfig.color
          }}>
            <StatusIcon size={16} />
            {statusConfig.label}
          </div>
        </div>

        <div style={styles.statusCard}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <FiCreditCard size={20} color={paymentConfig.color} />
            <span style={{ fontSize: '14px', color: '#6b7280' }}>Ödeme Durumu</span>
          </div>
          <div style={{
            ...styles.statusBadge,
            backgroundColor: paymentConfig.bg,
            color: paymentConfig.color
          }}>
            {paymentConfig.label}
          </div>
        </div>

        <div style={styles.statusCard}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <FiCalendar size={20} color="#6b7280" />
            <span style={{ fontSize: '14px', color: '#6b7280' }}>Sipariş Tarihi</span>
          </div>
          <p style={{ fontSize: '15px', fontWeight: '500', color: '#111827' }}>
            {formatDate(order.created_at)}
          </p>
        </div>
      </div>

      <div style={styles.mainContent}>
        {/* Order Items */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>
            <FiPackage size={20} />
            Sipariş Ürünleri
          </h2>
          <div style={styles.itemsList}>
            {order.items?.map((item, idx) => (
              <Link
                key={idx}
                to={`/product/${item.product?.slug}`}
                style={styles.itemCard}
              >
                <div style={styles.itemImage}>
                  {item.product?.photos?.[0]?.file_path ? (
                    <img 
                      src={item.product.photos[0].file_path} 
                      alt={item.product_name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <FiPackage size={32} color="#9ca3af" />
                  )}
                </div>
                <div style={styles.itemInfo}>
                  <h3 style={styles.itemName}>{item.product_name}</h3>
                  {item.variant_name && (
                    <p style={styles.itemVariant}>Varyant: {item.variant_name}</p>
                  )}
                  <div style={styles.itemPriceRow}>
                    <span style={styles.itemQuantity}>{item.quantity} adet</span>
                    <span style={styles.itemPrice}>{formatPrice(item.unit_price)}</span>
                  </div>
                </div>
                <div style={styles.itemTotal}>
                  {formatPrice(item.line_total)}
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Shipping Address */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>
            <FiMapPin size={20} />
            Teslimat Adresi
          </h2>
          <div style={styles.addressCard}>
            <p style={styles.addressTitle}>{order.shipping_address?.title}</p>
            <p style={styles.addressText}>
              {order.shipping_address?.address_line_1}
              {order.shipping_address?.address_line_2 && <br />}
              {order.shipping_address?.address_line_2}
            </p>
            <p style={styles.addressText}>
              {order.shipping_address?.district}, {order.shipping_address?.city}
            </p>
            <p style={styles.addressText}>
              {order.shipping_address?.postal_code}
            </p>
            {order.shipping_address?.phone && (
              <p style={styles.addressText}>
                Tel: {order.shipping_address.phone}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Order Summary */}
      <div style={styles.summarySection}>
        <h2 style={styles.sectionTitle}>Sipariş Özeti</h2>
        <div style={styles.summaryCard}>
          <div style={styles.summaryRow}>
            <span>Ara Toplam</span>
            <span>{formatPrice(order.subtotal)}</span>
          </div>
          {order.discount_total > 0 && (
            <div style={styles.summaryRow}>
              <span style={{ color: '#16a34a' }}>İndirim</span>
              <span style={{ color: '#16a34a' }}>-{formatPrice(order.discount_total)}</span>
            </div>
          )}
          <div style={styles.summaryRow}>
            <span>Kargo</span>
            <span>{formatPrice(order.shipping_total || 0)}</span>
          </div>
          <div style={styles.summaryDivider} />
          <div style={styles.summaryTotal}>
            <span>Toplam</span>
            <span>{formatPrice(order.total)}</span>
          </div>
        </div>

        {/* Cancel Button */}
        {order.can_cancel && (
          <button
            onClick={() => handleCancelOrder(order.order_number)}
            disabled={isCancelling}
            style={{
              ...styles.cancelButton,
              opacity: isCancelling ? 0.5 : 1,
              cursor: isCancelling ? 'not-allowed' : 'pointer'
            }}
          >
            {isCancelling ? (
              <>
                <FiLoader className="animate-spin" size={16} />
                İptal Ediliyor...
              </>
            ) : (
              <>
                <FiAlertCircle size={16} />
                Siparişi İptal Et
              </>
            )}
          </button>
        )}
      </div>

      {/* Status History */}
      {order.status_history && order.status_history.length > 0 && (
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Sipariş Geçmişi</h2>
          <div style={styles.historyList}>
            {order.status_history.map((history, idx) => {
              const historyStatusConfig = getStatusConfig(history.status);
              const HistoryIcon = historyStatusConfig.icon;
              return (
                <div key={idx} style={styles.historyItem}>
                  <div style={{
                    ...styles.historyIcon,
                    backgroundColor: historyStatusConfig.bg,
                    color: historyStatusConfig.color
                  }}>
                    <HistoryIcon size={16} />
                  </div>
                  <div style={styles.historyContent}>
                    <p style={styles.historyStatus}>{historyStatusConfig.label}</p>
                    {history.comment && (
                      <p style={styles.historyComment}>{history.comment}</p>
                    )}
                    <p style={styles.historyDate}>{formatDate(history.created_at)}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserOrderDetail;
