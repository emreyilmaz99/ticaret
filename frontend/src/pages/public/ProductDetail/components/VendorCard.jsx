// src/pages/public/ProductDetail/components/VendorCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FaStore, FaStar, FaBoxOpen, FaCalendarAlt } from 'react-icons/fa';

/**
 * Vendor information card
 */
const VendorCard = ({ vendor, styles }) => {
  return (
    <div style={styles.vendorCard}>
      <div style={styles.vendorCardHeader}>
        <div style={styles.vendorLogo}>
          {vendor.logo ? (
            <img src={vendor.logo} alt={vendor.name} style={styles.vendorLogoImg} />
          ) : (
            <FaStore size={24} color="#94a3b8" />
          )}
        </div>
        <div style={styles.vendorInfo}>
          <div style={styles.vendorName}>{vendor.name}</div>
          <div style={styles.vendorStats}>
            {vendor.rating > 0 && (
              <span style={styles.vendorStat}>
                <FaStar color="#f59e0b" size={12} />
                {parseFloat(vendor.rating || 0).toFixed(1)} ({vendor.rating_count} değerlendirme)
              </span>
            )}
            {vendor.product_count > 0 && (
              <span style={styles.vendorStat}>
                <FaBoxOpen size={12} />
                {vendor.product_count} ürün
              </span>
            )}
            {vendor.member_since && (
              <span style={styles.vendorStat}>
                <FaCalendarAlt size={12} />
                {vendor.member_since}'den beri üye
              </span>
            )}
          </div>
        </div>
        <Link to={`/store/${vendor.slug}`} style={styles.vendorVisitBtn}>
          <FaStore size={14} />
          Mağazayı Ziyaret Et
        </Link>
      </div>
      {vendor.description && (
        <p style={{ margin: 0, fontSize: '14px', color: '#64748b', lineHeight: 1.6 }}>
          {vendor.description.substring(0, 150)}
          {vendor.description.length > 150 ? '...' : ''}
        </p>
      )}
    </div>
  );
};

export default VendorCard;
