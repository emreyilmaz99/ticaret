// src/pages/user/Cart/VendorGroup.jsx
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { FiTruck, FiPackage, FiChevronRight, FiCheck } from 'react-icons/fi';
import CartItem from './CartItem';

/**
 * Vendor'a göre gruplanmış sepet ürünleri bileşeni
 */
const VendorGroup = ({
  vendorGroup,
  onRemoveItem,
  onUpdateQuantity,
  loading,
  isMobile,
}) => {
  const {
    vendor_id,
    vendor_name,
    vendor_slug,
    items,
    subtotal,
    shipping,
    estimated_delivery,
  } = vendorGroup;

  const formatPrice = (price) => {
    return new Intl.NumberFormat('tr-TR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

  const styles = {
    container: {
      backgroundColor: 'white',
      borderRadius: '16px',
      border: '1px solid #e2e8f0',
      overflow: 'hidden',
      marginBottom: '16px',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: isMobile ? '12px 16px' : '14px 20px',
      borderBottom: '1px solid #f1f5f9',
      backgroundColor: '#fafafa',
    },
    vendorInfo: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    vendorLabel: {
      fontSize: '12px',
      color: '#64748b',
    },
    vendorName: {
      fontSize: '14px',
      fontWeight: '600',
      color: '#1e293b',
      textDecoration: 'none',
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
      transition: 'color 0.2s',
    },
    shippingBadge: {
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      padding: '6px 12px',
      borderRadius: '20px',
      fontSize: '13px',
      fontWeight: '600',
    },
    freeShipping: {
      backgroundColor: '#f8fafc',
      color: '#16a34a',
    },
    paidShipping: {
      backgroundColor: '#fef3c7',
      color: '#d97706',
    },
    deliveryInfo: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '10px 20px',
      backgroundColor: '#f8fafc',
      borderBottom: '1px solid #f1f5f9',
    },
    deliveryIcon: {
      width: '28px',
      height: '28px',
      borderRadius: '8px',
      backgroundColor: '#e0f2fe',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#0284c7',
    },
    deliveryText: {
      fontSize: '13px',
      color: '#475569',
    },
    itemsContainer: {
      padding: '0',
    },
    itemWrapper: {
      borderBottom: '1px solid #f1f5f9',
    },
    footer: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: isMobile ? '12px 16px' : '14px 20px',
      backgroundColor: '#fafafa',
      borderTop: '1px solid #f1f5f9',
    },
    footerLeft: {
      display: 'flex',
      flexDirection: 'column',
      gap: '2px',
    },
    itemCount: {
      fontSize: '12px',
      color: '#64748b',
    },
    subtotalLabel: {
      fontSize: '12px',
      color: '#64748b',
    },
    subtotalValue: {
      fontSize: '16px',
      fontWeight: '700',
      color: '#1e293b',
    },
    progressContainer: {
      padding: '12px 20px',
      backgroundColor: '#fffbeb',
      borderBottom: '1px solid #fef3c7',
    },
    progressText: {
      fontSize: '13px',
      color: '#92400e',
      marginBottom: '8px',
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
    },
    progressBar: {
      height: '6px',
      backgroundColor: '#fde68a',
      borderRadius: '3px',
      overflow: 'hidden',
    },
    progressFill: {
      height: '100%',
      backgroundColor: '#f59e0b',
      borderRadius: '3px',
      transition: 'width 0.3s ease',
    },
  };

  const progress = shipping.free_threshold > 0 
    ? Math.min(100, (subtotal / shipping.free_threshold) * 100)
    : 100;

  return (
    <div style={styles.container}>
      {/* Header: Satıcı Bilgisi + Kargo Durumu */}
      <div style={styles.header}>
        <div style={styles.vendorInfo}>
          <span style={styles.vendorLabel}>Satıcı:</span>
          <Link 
            to={`/vendor/${vendor_slug}`}
            style={styles.vendorName}
            onMouseEnter={(e) => e.target.style.color = '#059669'}
            onMouseLeave={(e) => e.target.style.color = '#1e293b'}
          >
            {vendor_name}
            <FiChevronRight size={14} />
          </Link>
        </div>
        <div style={{
          ...styles.shippingBadge,
          ...(shipping.is_free ? styles.freeShipping : styles.paidShipping),
        }}>
          {shipping.is_free ? (
            <>
              <FiCheck size={14} />
              Kargo bedava
            </>
          ) : (
            <>
              <FiTruck size={14} />
              {formatPrice(shipping.cost)} ₺
            </>
          )}
        </div>
      </div>

      {/* Ücretsiz Kargo Progress Bar */}
      {!shipping.is_free && shipping.remaining_for_free && (
        <div style={styles.progressContainer}>
          <div style={styles.progressText}>
            <FiTruck size={14} />
            Ücretsiz kargo için {formatPrice(shipping.remaining_for_free)} ₺ daha ekleyin
          </div>
          <div style={styles.progressBar}>
            <div style={{ ...styles.progressFill, width: `${progress}%` }} />
          </div>
        </div>
      )}

      {/* Tahmini Teslimat */}
      <div style={styles.deliveryInfo}>
        <div style={styles.deliveryIcon}>
          <FiPackage size={14} />
        </div>
        <span style={styles.deliveryText}>{estimated_delivery}</span>
      </div>

      {/* Ürünler */}
      <div style={styles.itemsContainer}>
        {items.map((item, index) => (
          <div 
            key={item.id} 
            style={{
              ...styles.itemWrapper,
              borderBottom: index === items.length - 1 ? 'none' : '1px solid #f1f5f9',
            }}
          >
            <CartItem
              item={item}
              onRemove={() => onRemoveItem(item.id)}
              onUpdateQuantity={(qty) => onUpdateQuantity(item.id, qty)}
              loading={loading}
              isMobile={isMobile}
              showVendor={false}
            />
          </div>
        ))}
      </div>

      {/* Footer: Satıcı Alt Toplamı */}
      <div style={styles.footer}>
        <div style={styles.footerLeft}>
          <span style={styles.itemCount}>{items.length} ürün</span>
        </div>
        <div>
          <span style={styles.subtotalLabel}>Satıcı Toplamı: </span>
          <span style={styles.subtotalValue}>{formatPrice(subtotal)} ₺</span>
        </div>
      </div>
    </div>
  );
};

VendorGroup.propTypes = {
  vendorGroup: PropTypes.shape({
    vendor_id: PropTypes.number.isRequired,
    vendor_name: PropTypes.string.isRequired,
    vendor_slug: PropTypes.string,
    items: PropTypes.array.isRequired,
    subtotal: PropTypes.number.isRequired,
    shipping: PropTypes.shape({
      cost: PropTypes.number,
      is_free: PropTypes.bool,
      free_threshold: PropTypes.number,
      remaining_for_free: PropTypes.number,
    }).isRequired,
    estimated_delivery: PropTypes.string,
  }).isRequired,
  onRemoveItem: PropTypes.func.isRequired,
  onUpdateQuantity: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  isMobile: PropTypes.bool,
};

VendorGroup.defaultProps = {
  loading: false,
  isMobile: false,
};

export default VendorGroup;
