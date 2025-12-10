import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FiLoader, FiX, FiPackage, FiMapPin, FiCreditCard, 
  FiCalendar, FiAlertCircle, FiXCircle 
} from 'react-icons/fi';
import { useUserOrderDetail } from './useUserOrderDetail';
import { styles } from './styles';

const UserOrderDetail = ({ orderId, onClose }) => {
  // 1. Hook ile veriyi çekiyoruz (URL'den değil, prop'tan gelen ID ile)
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
  } = useUserOrderDetail(orderId);

  // 2. Modal açılınca scroll'u kilitle
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'unset'; };
  }, []);

  // Responsive: detect mobile width to adjust grid behavior
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 900);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // --- YÜKLENİYOR DURUMU ---
  if (isLoading) {
    return (
      <div style={styles.overlay}>
        <div style={styles.modalContainer}>
           <div style={styles.loadingContainer}>
              <FiLoader className="animate-spin" size={40} color="#2563eb" />
           </div>
        </div>
      </div>
    );
  }

  // --- HATA DURUMU ---
  if (error || !order) {
    return (
      <div style={styles.overlay}>
        <div style={styles.modalContainer}>
          <div style={styles.errorContainer}>
            <FiXCircle size={48} color="#f87171" style={{ margin: '0 auto 12px' }} />
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#991b1b' }}>Sipariş Yüklenemedi</h3>
            <p style={{ color: '#dc2626', marginBottom: '16px' }}>{error?.message || 'Bir hata oluştu.'}</p>
            <button onClick={onClose} style={styles.closeButton}>Kapat</button>
          </div>
        </div>
      </div>
    );
  }

  const statusConfig = getStatusConfig(order.status);
  const paymentConfig = getPaymentStatusConfig(order.payment_status);
  const StatusIcon = statusConfig.icon;

  // --- BAŞARILI İÇERİK ---
  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modalContainer} onClick={(e) => e.stopPropagation()}>
        
        {/* --- HEADER --- */}
        <div style={styles.header}>
          <div>
            <h2 style={styles.title}>Sipariş Detayı</h2>
            <p style={styles.orderNumber}>#{order.order_number}</p>
          </div>
          <button onClick={onClose} style={styles.iconCloseBtn}>
            <FiX size={24} />
          </button>
        </div>

        {/* --- SCROLLABLE BODY --- */}
        <div style={isMobile ? { ...styles.body, gridTemplateColumns: '1fr', padding: '16px' } : styles.body}>

          {/* LEFT COLUMN: status, products, address, history */}
          <div style={{ gridColumn: '1 / 2' }}>
            {/* 1. Durum Kartları */}
            <div style={styles.statusCards}>
            {/* Sipariş Durumu */}
            <div style={styles.statusCard}>
               <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontSize: '13px', color: '#6b7280' }}>
                  <FiPackage /> Sipariş Durumu
               </div>
               <div style={{ ...styles.statusBadge, backgroundColor: statusConfig.bg, color: statusConfig.color }}>
                  <StatusIcon size={14} /> {statusConfig.label}
               </div>
            </div>

            {/* Ödeme Durumu */}
            <div style={styles.statusCard}>
               <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontSize: '13px', color: '#6b7280' }}>
                  <FiCreditCard /> Ödeme
               </div>
               <div style={{ ...styles.statusBadge, backgroundColor: paymentConfig.bg, color: paymentConfig.color }}>
                  {paymentConfig.label}
               </div>
            </div>

            {/* Tarih */}
            <div style={styles.statusCard}>
               <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontSize: '13px', color: '#6b7280' }}>
                  <FiCalendar /> Tarih
               </div>
               <div style={{ fontWeight: '600', color: '#1f2937', fontSize: '14px' }}>
                  {formatDate(order.created_at)}
               </div>
            </div>
            </div>

            {/* 2. Ürünler Listesi */}
            <div style={styles.section}>
            <h3 style={styles.sectionTitle}><FiPackage /> Ürünler</h3>
            <div style={styles.itemsList}>
              {order.items?.map((item, idx) => (
                <Link key={idx} to={`/product/${item.product?.slug}`} style={isMobile ? { ...styles.itemCard, flexDirection: 'row' } : styles.itemCard}>
                  <div style={isMobile ? { ...styles.itemImage, width: 56, height: 56 } : styles.itemImage}>
                    {item.product?.photos?.[0]?.file_path ? (
                      <img src={item.product.photos[0].file_path} alt={item.product_name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <FiPackage size={24} color="#9ca3af" />
                    )}
                  </div>
                  <div style={styles.itemInfo}>
                    <div style={styles.itemName}>{item.product_name}</div>
                    {item.variant_name && <div style={styles.itemVariant}>Varyant: {item.variant_name}</div>}
                    <div style={styles.itemPriceRow}>
                      <span style={styles.itemQuantity}>{item.quantity} adet x</span>
                      <span style={styles.itemPrice}>{formatPrice(item.unit_price)}</span>
                    </div>
                  </div>
                  <div style={styles.itemTotal}>{formatPrice(item.line_total)}</div>
                </Link>
              ))}
            </div>
          </div>

          {/* 3. Adres Bilgisi */}
            {order.shipping_address && (
              <div style={styles.section}>
              <h3 style={styles.sectionTitle}><FiMapPin /> Teslimat Adresi</h3>
              <div style={styles.addressCard}>
                 <p style={styles.addressTitle}>{order.shipping_address.title}</p>
                 <p style={styles.addressText}>{order.shipping_address.address_line_1}</p>
                 <p style={styles.addressText}>{order.shipping_address.district}, {order.shipping_address.city}</p>
              </div>
              </div>
            )}

           {/* 4. Özet (moved to right column) */}

          {/* 5. Sipariş Geçmişi */}
            {order.status_history?.length > 0 && (
              <div style={styles.section}>
               <h3 style={styles.sectionTitle}>Sipariş Geçmişi</h3>
               <div style={styles.historyList}>
                  {order.status_history.map((history, idx) => {
                     const hConfig = getStatusConfig(history.status);
                     const HIcon = hConfig.icon;
                     return (
                       <div key={idx} style={styles.historyItem}>
                          <div style={{ ...styles.historyIcon, backgroundColor: hConfig.bg, color: hConfig.color }}>
                             <HIcon />
                          </div>
                          <div style={styles.historyContent}>
                             <div style={styles.historyStatus}>{hConfig.label}</div>
                             {history.comment && <div style={styles.historyComment}>{history.comment}</div>}
                             <div style={styles.historyDate}>{formatDate(history.created_at)}</div>
                          </div>
                       </div>
                     );
                  })}
               </div>
              </div>
            )}

          </div>

          {/* RIGHT COLUMN: summary, actions */}
          <div style={{ gridColumn: '2 / 3' }}>
            <div style={styles.summaryContainer}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: 13, color: '#6b7280' }}>Sipariş Numarası</div>
                  <div style={{ fontWeight: 800, fontSize: 16 }}>{order.order_number}</div>
                </div>
                <div>
                  <div style={{ textAlign: 'right', fontSize: 13, color: '#6b7280' }}>{formatDate(order.created_at)}</div>
                  <div style={{ marginTop: 6 }}><span style={{ ...styles.statusBadge, backgroundColor: statusConfig.bg, color: statusConfig.color }}>{statusConfig.label}</span></div>
                </div>
              </div>
              <div style={{ height: 8 }} />
              <div style={styles.summaryRow}><span>Ara Toplam</span><span>{formatPrice(order.subtotal)}</span></div>
              {order.discount_total > 0 && <div style={styles.summaryRow}><span style={{color:'#16a34a'}}>İndirim</span><span style={{color:'#16a34a'}}>-{formatPrice(order.discount_total)}</span></div>}
              <div style={styles.summaryRow}><span>Kargo</span><span>{formatPrice(order.shipping_total || 0)}</span></div>
              <div style={styles.summaryDivider} />
              <div style={styles.summaryTotal}><span>Toplam</span><span>{formatPrice(order.total)}</span></div>
              <div style={{ height: 12 }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, alignItems: 'center' }}>
                <div>
                  <a href={`#`} style={styles.actionLink}>Faturayı İndir</a>
                  <a href={`#`} style={styles.actionLink}>Yeniden Sipariş Ver</a>
                </div>
                <div>
                  {order.can_cancel && (
                    <button onClick={() => handleCancelOrder(order.order_number)} disabled={isCancelling} style={{ ...styles.cancelButton, opacity: isCancelling ? 0.6 : 1 }}>
                      {isCancelling ? <FiLoader className="animate-spin" /> : <FiAlertCircle />} {isCancelling ? 'İptal Ediliyor...' : 'Siparişi İptal Et'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* --- FOOTER --- */}
        <div style={styles.footer}>
          <button onClick={onClose} style={styles.closeButton}>
            Pencereyi Kapat
          </button>
        </div>

      </div>
    </div>
  );
};

export default UserOrderDetail;