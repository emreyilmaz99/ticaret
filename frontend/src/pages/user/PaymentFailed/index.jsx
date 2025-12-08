// src/pages/user/PaymentFailed/index.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FiXCircle, FiShoppingCart, FiHome, FiRefreshCw, FiAlertTriangle, FiLoader } from 'react-icons/fi';
import { usePaymentFailed } from './usePaymentFailed';
import { styles } from './styles';

const PaymentFailed = () => {
  const { status, orderDetails, orderNumber, errorMessage, formatPrice } = usePaymentFailed();

  if (status === 'loading') {
    return (
      <div style={styles.loadingContainer}>
        <FiLoader className="animate-spin" size={48} color="#dc2626" />
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.iconWrapper}>
          <FiXCircle style={styles.icon} />
        </div>

        <h1 style={styles.title}>Ödeme Başarısız</h1>
        <p style={styles.subtitle}>
          Ödeme işlemi sırasında bir sorun oluştu. Lütfen bilgilerinizi kontrol edip tekrar deneyin.
        </p>

        {errorMessage && (
          <div style={styles.errorBox}>
            <div style={styles.errorHeader}>
              <FiAlertTriangle size={20} color="#b91c1c" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <h4 style={styles.errorTitle}>Hata Detayı</h4>
                <p style={styles.errorText}>{errorMessage}</p>
              </div>
            </div>
          </div>
        )}

        {orderDetails && (
          <div style={styles.orderBox}>
            <div style={styles.orderRow}>
              <span style={styles.orderLabel}>Sipariş Numarası</span>
              <span style={styles.orderValue}>#{orderNumber}</span>
            </div>
            
            <div style={styles.orderRow}>
              <span style={styles.orderLabel}>Toplam Tutar</span>
              <span style={styles.orderValue}>{formatPrice(orderDetails.total_amount)}</span>
            </div>

            <div style={styles.orderRow}>
              <span style={styles.orderLabel}>Durum</span>
              <span style={styles.statusBadge}>Başarısız</span>
            </div>
          </div>
        )}

        <div style={styles.actions}>
          <Link to="/checkout" style={styles.primaryButton}>
            <FiRefreshCw size={20} />
            Tekrar Dene
          </Link>
          
          <Link to="/cart" style={styles.secondaryButton}>
            <FiShoppingCart size={20} />
            Sepete Dön
          </Link>

          <Link to="/" style={{ ...styles.secondaryButton, border: 'none' }}>
            <FiHome size={20} />
            Ana Sayfaya Dön
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailed;
