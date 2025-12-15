// src/pages/user/Cart/OrderSummary.jsx
import React from 'react';
import PropTypes from 'prop-types';
import { FiArrowRight, FiLoader } from 'react-icons/fi';
import { FaCcVisa, FaCcMastercard, FaCreditCard } from 'react-icons/fa';
import CouponSection from './CouponSection';
import ShippingBreakdown from './ShippingBreakdown';

/**
 * Sipariş özeti bileşeni
 * Kupon, fiyat hesaplamaları ve checkout butonu içerir
 */
const OrderSummary = ({ 
  totals, 
  coupon, 
  couponInput, 
  onCouponInputChange, 
  onApplyCoupon, 
  onRemoveCoupon,
  onCheckout,
  isCheckoutLoading,
  styles 
}) => {
  return (
    <div style={styles.summary}>
      <div style={styles.summaryCard}>
        <h2 style={styles.summaryTitle}>Sipariş Özeti</h2>

        {/* Kupon Alanı */}
        <CouponSection 
          coupon={coupon}
          couponInput={couponInput}
          onCouponInputChange={onCouponInputChange}
          onApplyCoupon={onApplyCoupon}
          onRemoveCoupon={onRemoveCoupon}
          styles={styles}
        />

        {/* Hesaplamalar */}
        <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '24px' }}>
          {/* Ara Toplam */}
          <div style={styles.row}>
            <span>Ara Toplam</span>
            <span>{(totals?.subtotal || 0).toLocaleString('tr-TR')} TL</span>
          </div>
          
          {/* Kampanya İndirimi */}
          {(totals?.deal_discount || 0) > 0 && (
            <div style={{ ...styles.row, color: '#ef4444' }}>
              <span>🔥 Kampanya Tasarrufu</span>
              <span>-{(totals?.deal_discount || 0).toLocaleString('tr-TR')} TL</span>
            </div>
          )}
          
          {/* Kupon İndirimi */}
          {(totals?.discount || 0) > 0 && (
            <div style={{ ...styles.row, color: '#16a34a' }}>
              <span>Kupon İndirimi ({coupon?.code})</span>
              <span>-{(totals?.discount || 0).toLocaleString('tr-TR')} TL</span>
            </div>
          )}

          {/* Kargo */}
          <ShippingBreakdown 
            shippingBreakdown={totals?.shipping_breakdown}
            totalShipping={totals?.shipping || 0}
            styles={styles}
          />
        </div>

        {/* Genel Toplam */}
        <div style={styles.totalRow}>
          <span>Genel Toplam</span>
          <span style={{ color: '#059669' }}>
            {(totals?.total || 0).toLocaleString('tr-TR')} TL
          </span>
        </div>

        {/* Checkout Butonu */}
        <button 
          style={{
            ...styles.checkoutBtn,
            opacity: isCheckoutLoading ? 0.7 : 1,
            cursor: isCheckoutLoading ? 'not-allowed' : 'pointer',
          }}
          onClick={onCheckout}
          disabled={isCheckoutLoading}
        >
          {isCheckoutLoading ? (
            <>
              <FiLoader className="spin" /> İşleniyor...
            </>
          ) : (
            <>
              Sepeti Onayla <FiArrowRight />
            </>
          )}
        </button>

        {/* Ödeme Yöntemleri İkonları */}
        <PaymentIcons />
      </div>
    </div>
  );
};

/**
 * Ödeme yöntemleri ikonları
 */
const PaymentIcons = () => (
  <div style={{
    marginTop: '16px',
    paddingTop: '16px',
    borderTop: '1px solid #f1f5f9',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
  }}>
    <FaCcVisa 
      size={48} 
      style={{ color: '#1434CB' }}
      title="Visa"
    />
    <FaCcMastercard 
      size={48} 
      style={{ color: '#EB001B' }}
      title="Mastercard"
    />
    <FaCreditCard 
      size={36} 
      style={{ color: '#6b7280' }}
      title="Diğer Kartlar"
    />
  </div>
);

OrderSummary.propTypes = {
  totals: PropTypes.shape({
    subtotal: PropTypes.number,
    discount: PropTypes.number,
    shipping: PropTypes.number,
    total: PropTypes.number,
    shipping_breakdown: PropTypes.array,
  }),
  coupon: PropTypes.shape({
    code: PropTypes.string,
    discount: PropTypes.number,
  }),
  couponInput: PropTypes.string.isRequired,
  onCouponInputChange: PropTypes.func.isRequired,
  onApplyCoupon: PropTypes.func.isRequired,
  onRemoveCoupon: PropTypes.func.isRequired,
  onCheckout: PropTypes.func.isRequired,
  isCheckoutLoading: PropTypes.bool,
  styles: PropTypes.object.isRequired,
};

OrderSummary.defaultProps = {
  isCheckoutLoading: false,
};

export default OrderSummary;
