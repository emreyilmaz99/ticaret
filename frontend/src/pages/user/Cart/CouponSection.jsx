// src/pages/user/Cart/CouponSection.jsx
import React from 'react';
import PropTypes from 'prop-types';
import { FiTag, FiX } from 'react-icons/fi';

/**
 * Kupon giriş ve görüntüleme bileşeni
 */
const CouponSection = ({ 
  coupon, 
  couponInput, 
  onCouponInputChange, 
  onApplyCoupon, 
  onRemoveCoupon, 
  styles 
}) => {
  return (
    <div style={styles.couponSection}>
      <label style={styles.couponLabel}>İndirim Kuponu</label>
      
      {coupon ? (
        <ActiveCoupon 
          coupon={coupon} 
          onRemove={onRemoveCoupon} 
          styles={styles}
        />
      ) : (
        <CouponForm 
          value={couponInput}
          onChange={onCouponInputChange}
          onSubmit={onApplyCoupon}
          styles={styles}
        />
      )}
      
      <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '8px' }}>
        Örnek: YAZ20, HOSGELDIN
      </p>
    </div>
  );
};

/**
 * Aktif kupon görüntüleme
 */
const ActiveCoupon = ({ coupon, onRemove, styles }) => (
  <div style={styles.activeCoupon}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <FiTag />
      <span style={{ fontWeight: '600' }}>{coupon.code}</span>
    </div>
    <button 
      onClick={onRemove} 
      style={{
        background: 'none', 
        border: 'none', 
        color: 'inherit', 
        cursor: 'pointer'
      }}
    >
      <FiX />
    </button>
  </div>
);

/**
 * Kupon giriş formu
 */
const CouponForm = ({ value, onChange, onSubmit, styles }) => (
  <form onSubmit={onSubmit} style={styles.couponForm}>
    <input 
      type="text" 
      placeholder="Kupon Kodu" 
      style={styles.couponInput}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
    <button type="submit" style={styles.couponBtn}>
      Uygula
    </button>
  </form>
);

CouponSection.propTypes = {
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

ActiveCoupon.propTypes = {
  coupon: PropTypes.shape({
    code: PropTypes.string.isRequired,
  }).isRequired,
  onRemove: PropTypes.func.isRequired,
  styles: PropTypes.object.isRequired,
};

CouponForm.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  styles: PropTypes.object.isRequired,
};

export default CouponSection;
