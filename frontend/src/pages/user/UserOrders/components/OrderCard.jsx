// src/pages/user/UserOrders/components/OrderCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FiCalendar, FiPackage, FiMapPin, FiChevronRight } from 'react-icons/fi';

export const OrderCard = ({ 
  order, 
  formatDate, 
  formatPrice, 
  getStatusConfig, 
  getPaymentStatusConfig,
  styles,
  onDetailClick // <--- YENİ PROP: Tıklama fonksiyonunu buradan alıyoruz
}) => {
  const statusConfig = getStatusConfig(order.status);
  const paymentConfig = getPaymentStatusConfig(order.payment_status);
  const StatusIcon = statusConfig.icon;

  return (
    <div style={styles.orderCard}>
      {/* Order Header */}
      <div style={styles.orderHeader}>
        <div style={styles.headerInfoGroup}>
          <div>
            <p style={styles.headerLabel}>Sipariş No</p>
            <p style={styles.headerValue}>{order.order_number}</p>
          </div>
          <div>
            <p style={styles.headerLabel}>Tarih</p>
            <p style={{ ...styles.headerValue, display: 'flex', alignItems: 'center', gap: '4px' }}>
              <FiCalendar size={16} />
              {formatDate(order.created_at)}
            </p>
          </div>
        </div>
        <div style={styles.headerInfoGroup}>
          <span style={{
            ...styles.statusBadge,
            backgroundColor: paymentConfig.bg,
            color: paymentConfig.color
          }}>
            {paymentConfig.label}
          </span>
          <span style={{
            ...styles.statusBadge,
            backgroundColor: statusConfig.bg,
            color: statusConfig.color
          }}>
            <StatusIcon size={14} />
            {statusConfig.label}
          </span>
        </div>
      </div>

      {/* Order Items Preview */}
      <div style={styles.orderBody}>
        <div style={styles.productsContainer}>
          {/* Products - Ürün detaylarına giden linkler aynen kalabilir */}
          <div style={styles.productImages}>
            <div style={styles.imageList}>
              {(order.items || []).slice(0, 4).map((item, idx) => (
                <Link
                  key={idx}
                  to={`/product/${item.product?.slug}`}
                  style={styles.imageWrapper}
                  title={item.product_name}
                >
                  {item.product?.photos?.[0]?.file_path ? (
                    <img 
                      src={item.product.photos[0].file_path} 
                      alt={item.product_name}
                      style={styles.productImage}
                    />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <FiPackage size={20} color="#9ca3af" />
                    </div>
                  )}
                </Link>
              ))}
              {(order.items?.length || 0) > 4 && (
                <div style={styles.imageWrapper}>
                  <div style={styles.moreCount}>
                    +{order.items.length - 4}
                  </div>
                </div>
              )}
            </div>
            <p style={styles.itemCount}>
              {order.items_count || order.items?.length || 0} ürün
            </p>
          </div>

          {/* Address */}
          {order.shipping_address && (
            <div style={styles.addressInfo}>
              <FiMapPin size={16} style={{ marginTop: '2px', flexShrink: 0 }} />
              <span style={{ maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {order.shipping_address.city}, {order.shipping_address.district}
              </span>
            </div>
          )}

          {/* Total */}
          <div style={styles.totalPrice}>
            <p style={styles.priceLabel}>Toplam</p>
            <p style={styles.priceValue}>
              {formatPrice(order.total)}
            </p>
          </div>
        </div>
      </div>

      {/* Order Footer */}
      <div style={styles.orderFooter}>
        <div style={{ fontSize: '14px', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <FiCalendar size={16} />
          {formatDate(order.created_at)}
        </div>
        
        {/* DEĞİŞİKLİK BURADA: Link yerine Button kullanıyoruz */}
        <button
          onClick={onDetailClick} // Parent'tan gelen fonksiyonu çalıştır
          style={{
            ...styles.detailLink, // Mevcut stilleri koru (renk, font vs.)
            background: 'transparent', // Butonun varsayılan gri arka planını kaldır
            border: 'none',            // Butonun çerçevesini kaldır
            cursor: 'pointer',         // Tıklanabilir imleci ekle
            padding: 0,                // Varsa padding'i sıfırla (link gibi görünmesi için)
            display: 'flex',           // Flex yapısını koru
            alignItems: 'center',
            fontSize: 'inherit',       // Font boyutunu inherit al
            fontFamily: 'inherit'
          }}
        >
          Detayları Görüntüle
          <FiChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};