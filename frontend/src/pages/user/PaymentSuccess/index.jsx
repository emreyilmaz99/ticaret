// src/pages/user/PaymentSuccess/index.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FiCheckCircle, FiPackage, FiHome, FiShoppingBag, FiLoader } from 'react-icons/fi';
import { usePaymentSuccess } from './usePaymentSuccess';
import { styles } from './styles';

const PaymentSuccess = () => {
  const { status, orderDetails, orderNumber, formatPrice } = usePaymentSuccess();

  if (status === 'loading') {
    return (
      <div style={styles.loadingContainer}>
        <FiLoader className="animate-spin" size={48} color="#2563eb" />
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.iconWrapper}>
          <FiCheckCircle style={styles.icon} />
        </div>

        <h1 style={styles.title}>Ödeme Başarılı!</h1>
        <p style={styles.subtitle}>
          Siparişiniz başarıyla alındı ve hazırlanmaya başlandı.
        </p>

        {orderDetails && (
          <div style={styles.orderBox}>
            <div style={styles.orderHeader}>
              <FiPackage size={20} color="#2563eb" />
              <span style={styles.orderHeaderText}>Sipariş Detayları</span>
            </div>
            
            <div style={styles.orderRow}>
              <span style={styles.orderLabel}>Sipariş Numarası</span>
              <span style={styles.orderValue}>#{orderNumber}</span>
            </div>
            
            <div style={styles.orderRow}>
              <span style={styles.orderLabel}>Toplam Tutar</span>
              <span style={styles.orderValue}>{formatPrice(orderDetails.total_amount)}</span>
            </div>

            <div style={styles.orderRow}>
              <span style={styles.orderLabel}>Ödeme Durumu</span>
              <span style={styles.statusBadge}>Ödendi</span>
            </div>
          </div>
        )}

        <div style={styles.infoBox}>
          <p style={styles.infoText}>
            Sipariş detaylarınız ve takip numaranız e-posta adresinize gönderilmiştir.
          </p>
        </div>

        <div style={styles.actions}>
          <Link to="/account/profile?tab=orders" style={styles.primaryButton}>
            <FiShoppingBag size={20} />
            Siparişlerimi Görüntüle
          </Link>
          
          <Link to="/" style={styles.secondaryButton}>
            <FiHome size={20} />
            Ana Sayfaya Dön
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
