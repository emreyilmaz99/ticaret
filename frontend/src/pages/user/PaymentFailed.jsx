import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { FiXCircle, FiShoppingCart, FiHome, FiRefreshCw, FiAlertTriangle, FiLoader } from 'react-icons/fi';
import { getCheckoutStatus } from '../../features/checkout/api/checkoutApi';

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: 'var(--bg-body)',
    padding: '48px 16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '24px',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1)',
    padding: '40px',
    maxWidth: '480px',
    width: '100%',
    textAlign: 'center',
  },
  iconWrapper: {
    width: '80px',
    height: '80px',
    backgroundColor: 'var(--danger-light)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 24px',
  },
  icon: {
    width: '48px',
    height: '48px',
    color: 'var(--danger)',
  },
  title: {
    fontSize: '28px',
    fontWeight: '700',
    color: 'var(--text-main)',
    marginBottom: '8px',
  },
  subtitle: {
    fontSize: '16px',
    color: 'var(--text-muted)',
    marginBottom: '24px',
    lineHeight: '1.5',
  },
  errorBox: {
    backgroundColor: 'var(--danger-light)',
    border: '1px solid #fecaca',
    borderRadius: '12px',
    padding: '16px',
    marginBottom: '24px',
    textAlign: 'left',
  },
  errorHeader: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
  },
  errorTitle: {
    fontWeight: '600',
    color: '#991b1b',
    fontSize: '14px',
    marginBottom: '4px',
  },
  errorText: {
    fontSize: '14px',
    color: '#b91c1c',
    lineHeight: '1.4',
  },
  orderBox: {
    backgroundColor: 'var(--bg-body)',
    borderRadius: '16px',
    padding: '20px',
    marginBottom: '24px',
    textAlign: 'left',
  },
  orderRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px 0',
  },
  orderLabel: {
    fontSize: '14px',
    color: 'var(--text-muted)',
  },
  orderValue: {
    fontSize: '14px',
    fontWeight: '600',
    color: 'var(--text-main)',
  },
  statusBadge: {
    display: 'inline-block',
    padding: '4px 12px',
    backgroundColor: 'var(--danger-light)',
    color: 'var(--danger)',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600',
  },
  reasonsBox: {
    backgroundColor: 'var(--warning-light)',
    border: '1px solid #fde68a',
    borderRadius: '12px',
    padding: '16px',
    marginBottom: '24px',
    textAlign: 'left',
  },
  reasonsTitle: {
    fontWeight: '600',
    color: '#92400e',
    fontSize: '14px',
    marginBottom: '12px',
  },
  reasonsList: {
    margin: 0,
    paddingLeft: '20px',
  },
  reasonItem: {
    fontSize: '13px',
    color: '#a16207',
    marginBottom: '6px',
    lineHeight: '1.4',
  },
  buttonPrimary: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '14px 24px',
    backgroundColor: 'var(--primary)',
    color: 'white',
    borderRadius: '12px',
    fontWeight: '600',
    fontSize: '15px',
    textDecoration: 'none',
    border: 'none',
    cursor: 'pointer',
    marginBottom: '12px',
    transition: 'background-color 0.2s',
  },
  buttonSecondary: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '14px 24px',
    backgroundColor: '#f1f5f9',
    color: 'var(--text-main)',
    borderRadius: '12px',
    fontWeight: '600',
    fontSize: '15px',
    textDecoration: 'none',
    border: 'none',
    cursor: 'pointer',
    marginBottom: '12px',
    transition: 'background-color 0.2s',
  },
  buttonLink: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '14px 24px',
    backgroundColor: 'transparent',
    color: 'var(--text-muted)',
    borderRadius: '12px',
    fontWeight: '500',
    fontSize: '15px',
    textDecoration: 'none',
    border: 'none',
    cursor: 'pointer',
    transition: 'color 0.2s',
  },
  footerNote: {
    marginTop: '24px',
    fontSize: '13px',
    color: 'var(--text-muted)',
  },
  loadingContainer: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'var(--bg-body)',
  },
  spinner: {
    width: '32px',
    height: '32px',
    color: 'var(--danger)',
    animation: 'spin 1s linear infinite',
  },
};

function PaymentFailed() {
  const [searchParams] = useSearchParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const orderNumber = searchParams.get('order');
  const errorMessage = searchParams.get('error');

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderNumber) {
        setLoading(false);
        return;
      }

      try {
        const response = await getCheckoutStatus(orderNumber);
        if (response.success) {
          setOrder(response.data.order);
        }
      } catch (err) {
        // Ignore errors for failed payment page
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderNumber]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(price);
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <FiLoader style={styles.spinner} />
        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* Error Icon */}
        <div style={styles.iconWrapper}>
          <FiXCircle style={styles.icon} />
        </div>

        {/* Title */}
        <h1 style={styles.title}>Ödeme Başarısız</h1>
        <p style={styles.subtitle}>
          Ödemeniz işlenemedi. Lütfen tekrar deneyin veya farklı bir ödeme yöntemi kullanın.
        </p>

        {/* Error Message */}
        {errorMessage && (
          <div style={styles.errorBox}>
            <div style={styles.errorHeader}>
              <FiAlertTriangle size={20} color="#dc2626" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <p style={styles.errorTitle}>Hata Detayı</p>
                <p style={styles.errorText}>{decodeURIComponent(errorMessage)}</p>
              </div>
            </div>
          </div>
        )}

        {/* Order Info (if available) */}
        {order && (
          <div style={styles.orderBox}>
            <div style={styles.orderRow}>
              <span style={styles.orderLabel}>Sipariş No:</span>
              <span style={styles.orderValue}>{order.order_number}</span>
            </div>
            <div style={styles.orderRow}>
              <span style={styles.orderLabel}>Toplam:</span>
              <span style={styles.orderValue}>{formatPrice(order.total)}</span>
            </div>
            <div style={styles.orderRow}>
              <span style={styles.orderLabel}>Durum:</span>
              <span style={styles.statusBadge}>Ödeme Başarısız</span>
            </div>
          </div>
        )}

        {/* Common Reasons */}
        <div style={styles.reasonsBox}>
          <p style={styles.reasonsTitle}>Olası Sebepler:</p>
          <ul style={styles.reasonsList}>
            <li style={styles.reasonItem}>Yetersiz bakiye</li>
            <li style={styles.reasonItem}>Kart bilgileri hatalı</li>
            <li style={styles.reasonItem}>3D Secure doğrulaması başarısız</li>
            <li style={styles.reasonItem}>Banka tarafından reddedildi</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div>
          <Link to="/cart" style={styles.buttonPrimary}>
            <FiRefreshCw size={18} />
            Tekrar Dene
          </Link>
          
          <Link to="/cart" style={styles.buttonSecondary}>
            <FiShoppingCart size={18} />
            Sepete Dön
          </Link>

          <Link to="/" style={styles.buttonLink}>
            <FiHome size={18} />
            Ana Sayfaya Dön
          </Link>
        </div>

        {/* Help Note */}
        <p style={styles.footerNote}>
          Sorun devam ederse lütfen destek ekibimizle iletişime geçin.
        </p>
      </div>
    </div>
  );
}

export default PaymentFailed;
