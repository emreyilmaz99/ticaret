import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { FiCheckCircle, FiPackage, FiHome, FiShoppingBag, FiLoader } from 'react-icons/fi';
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
    backgroundColor: 'var(--primary-lighter)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 24px',
  },
  icon: {
    width: '48px',
    height: '48px',
    color: 'var(--primary)',
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
  },
  orderBox: {
    backgroundColor: 'var(--bg-body)',
    borderRadius: '16px',
    padding: '20px',
    marginBottom: '24px',
    textAlign: 'left',
  },
  orderHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '16px',
    paddingBottom: '12px',
    borderBottom: '1px solid #e2e8f0',
  },
  orderHeaderText: {
    fontWeight: '600',
    color: 'var(--text-main)',
    fontSize: '15px',
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
    backgroundColor: 'var(--primary-light)',
    color: 'var(--primary-dark)',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600',
  },
  infoBox: {
    backgroundColor: 'var(--primary-lighter)',
    border: '1px solid var(--primary-light)',
    borderRadius: '12px',
    padding: '16px',
    marginBottom: '24px',
  },
  infoText: {
    fontSize: '14px',
    color: 'var(--primary-dark)',
    lineHeight: '1.5',
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
    transition: 'background-color 0.2s',
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
    color: 'var(--primary)',
    animation: 'spin 1s linear infinite',
  },
};

function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const orderNumber = searchParams.get('order');

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
        } else {
          setError(response.message || 'Sipariş bilgileri alınamadı');
        }
      } catch (err) {
        setError('Sipariş bilgileri yüklenirken bir hata oluştu');
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
        {/* Success Icon */}
        <div style={styles.iconWrapper}>
          <FiCheckCircle style={styles.icon} />
        </div>

        {/* Title */}
        <h1 style={styles.title}>Ödeme Başarılı!</h1>
        <p style={styles.subtitle}>Siparişiniz başarıyla alındı. Teşekkür ederiz!</p>

        {/* Order Info */}
        {order && (
          <div style={styles.orderBox}>
            <div style={styles.orderHeader}>
              <FiPackage size={18} color="var(--text-muted)" />
              <span style={styles.orderHeaderText}>Sipariş Detayları</span>
            </div>
            
            <div style={styles.orderRow}>
              <span style={styles.orderLabel}>Sipariş No:</span>
              <span style={styles.orderValue}>{order.order_number}</span>
            </div>
            <div style={styles.orderRow}>
              <span style={styles.orderLabel}>Toplam:</span>
              <span style={styles.orderValue}>{formatPrice(order.total)}</span>
            </div>
            <div style={styles.orderRow}>
              <span style={styles.orderLabel}>Ürün Adedi:</span>
              <span style={styles.orderValue}>{order.items_count || order.items?.length || '-'} ürün</span>
            </div>
            <div style={styles.orderRow}>
              <span style={styles.orderLabel}>Durum:</span>
              <span style={styles.statusBadge}>
                {order.payment_status === 'paid' ? 'Ödendi' : order.payment_status}
              </span>
            </div>
          </div>
        )}

        {!order && !error && (
          <div style={styles.infoBox}>
            <p style={styles.infoText}>
              Ödemeniz başarıyla işlendi. Sipariş detaylarınız e-posta adresinize gönderilecektir.
            </p>
          </div>
        )}

        {error && (
          <div style={{...styles.infoBox, backgroundColor: '#fef3c7', borderColor: '#fde68a'}}>
            <p style={{...styles.infoText, color: '#92400e'}}>{error}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div>
          <Link to="/account/orders" style={styles.buttonPrimary}>
            <FiShoppingBag size={18} />
            Siparişlerime Git
          </Link>
          
          <Link to="/" style={styles.buttonSecondary}>
            <FiHome size={18} />
            Ana Sayfaya Dön
          </Link>
        </div>

        {/* Info Note */}
        <p style={styles.footerNote}>
          Sipariş durumunuzu hesabım sayfasından takip edebilirsiniz.
        </p>
      </div>
    </div>
  );
}

export default PaymentSuccess;
