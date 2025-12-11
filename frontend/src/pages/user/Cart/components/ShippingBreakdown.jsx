// src/pages/user/Cart/ShippingBreakdown.jsx
import React from 'react';
import PropTypes from 'prop-types';
import { FiTruck, FiGift } from 'react-icons/fi';

/**
 * Satıcı bazlı kargo detayları bileşeni
 */
const ShippingBreakdown = ({ shippingBreakdown, totalShipping, styles }) => {
  // Kargo breakdown yoksa basit görünüm
  if (!shippingBreakdown || shippingBreakdown.length === 0) {
    return (
      <div style={styles.row}>
        <span>Kargo</span>
        {totalShipping === 0 ? (
          <span style={{ color: '#16a34a', fontWeight: '600' }}>Bedava</span>
        ) : (
          <span>{totalShipping.toLocaleString('tr-TR')} TL</span>
        )}
      </div>
    );
  }

  // Detaylı kargo görünümü
  return (
    <div style={{ marginBottom: '16px' }}>
      {/* Başlık */}
      <div style={{
        ...styles.row, 
        marginBottom: '8px', 
        fontWeight: '600', 
        color: '#475569'
      }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <FiTruck size={14} /> Kargo Ücretleri
        </span>
      </div>

      {/* Satıcı bazlı kargo */}
      {shippingBreakdown.map((vendor, idx) => (
        <VendorShippingCard key={idx} vendor={vendor} />
      ))}

      {/* Toplam kargo */}
      <div style={{
        ...styles.row, 
        marginTop: '12px', 
        paddingTop: '8px', 
        borderTop: '1px dashed #e2e8f0'
      }}>
        <span style={{ fontWeight: '500' }}>Toplam Kargo</span>
        {totalShipping === 0 ? (
          <span style={{ color: '#16a34a', fontWeight: '600' }}>Bedava</span>
        ) : (
          <span style={{ fontWeight: '600' }}>
            {totalShipping.toLocaleString('tr-TR')} TL
          </span>
        )}
      </div>
    </div>
  );
};

/**
 * Tek satıcı kargo kartı
 */
const VendorShippingCard = ({ vendor }) => (
  <div style={{
    padding: '10px 12px',
    backgroundColor: '#f8fafc',
    borderRadius: '8px',
    marginBottom: '8px',
    border: '1px solid #e2e8f0'
  }}>
    <div style={{
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center'
    }}>
      <span style={{ fontSize: '13px', color: '#475569', fontWeight: '500' }}>
        {vendor.vendor_name}
      </span>
      {vendor.is_free ? (
        <span style={{
          color: '#16a34a', 
          fontWeight: '600', 
          fontSize: '13px',
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }}>
          <FiGift size={12} /> Ücretsiz
        </span>
      ) : (
        <span style={{ fontWeight: '600', fontSize: '13px', color: '#1e293b' }}>
          {vendor.shipping_cost.toLocaleString('tr-TR')} TL
        </span>
      )}
    </div>
    
    {/* Ücretsiz kargo için kalan tutar */}
    {!vendor.is_free && vendor.remaining_for_free && (
      <p style={{
        fontSize: '11px', 
        color: '#64748b', 
        margin: '4px 0 0 0'
      }}>
        💡 {vendor.remaining_for_free.toLocaleString('tr-TR')} TL daha alışveriş yapın, kargo bedava!
      </p>
    )}
  </div>
);

ShippingBreakdown.propTypes = {
  shippingBreakdown: PropTypes.arrayOf(
    PropTypes.shape({
      vendor_name: PropTypes.string,
      shipping_cost: PropTypes.number,
      is_free: PropTypes.bool,
      remaining_for_free: PropTypes.number,
    })
  ),
  totalShipping: PropTypes.number.isRequired,
  styles: PropTypes.object.isRequired,
};

VendorShippingCard.propTypes = {
  vendor: PropTypes.shape({
    vendor_name: PropTypes.string.isRequired,
    shipping_cost: PropTypes.number,
    is_free: PropTypes.bool,
    remaining_for_free: PropTypes.number,
  }).isRequired,
};

export default ShippingBreakdown;
