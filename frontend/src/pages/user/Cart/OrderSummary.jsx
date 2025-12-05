// src/pages/user/Cart/OrderSummary.jsx
import React from 'react';
import PropTypes from 'prop-types';
import { FiArrowRight } from 'react-icons/fi';
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
          
          {/* İndirim */}
          {(totals?.discount || 0) > 0 && (
            <div style={{ ...styles.row, color: '#16a34a' }}>
              <span>İndirim ({coupon?.code})</span>
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
        <button style={styles.checkoutBtn}>
          Sepeti Onayla <FiArrowRight />
        </button>

        {/* Ödeme Yöntemleri İkonları */}
        <PaymentIcons />
      </div>
    </div>
  );
};

/**
 * Ödeme yöntemleri placeholder ikonları
 */
const PaymentIcons = () => (
  <div style={{
    marginTop: '24px', 
    display: 'flex', 
    justifyContent: 'center', 
    gap: '12px', 
    opacity: 0.5
  }}>
    <div style={{
      height: '24px', 
      width: '40px', 
      backgroundColor: '#e2e8f0', 
      borderRadius: '4px'
    }} />
    <div style={{
      height: '24px', 
      width: '40px', 
      backgroundColor: '#e2e8f0', 
      borderRadius: '4px'
    }} />
    <div style={{
      height: '24px', 
      width: '40px', 
      backgroundColor: '#e2e8f0', 
      borderRadius: '4px'
    }} />
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
  styles: PropTypes.object.isRequired,
};

export default OrderSummary;
