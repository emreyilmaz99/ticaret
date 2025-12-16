// src/features/admin/shared/components/StatusBadge.jsx
import React from 'react';
import PropTypes from 'prop-types';
import { FaClock, FaCheckCircle, FaTimesCircle, FaBox, FaBan } from 'react-icons/fa';

/**
 * Merkezi StatusBadge bileşeni - Tüm admin modülleri için
 * Durum badge'lerini otomatik renk ve icon ile gösterir
 */

// Default durum konfigürasyonu
const DEFAULT_STATUS_CONFIG = {
  // Application statuses
  pre_pending: { label: 'Ön Başvuru Bekliyor', bg: '#fef3c7', color: '#92400e', icon: FaClock },
  pending: { label: 'İncelemede', bg: '#fef3c7', color: '#92400e', icon: FaClock },
  approved: { label: 'Onaylandı', bg: '#d1fae5', color: '#065f46', icon: FaCheckCircle },
  rejected: { label: 'Reddedildi', bg: '#fee2e2', color: '#991b1b', icon: FaTimesCircle },
  
  // Product statuses
  active: { label: 'Aktif', bg: '#d1fae5', color: '#065f46', icon: FaCheckCircle },
  inactive: { label: 'Pasif', bg: '#f3f4f6', color: '#6b7280', icon: FaBox },
  draft: { label: 'Taslak', bg: '#e0e7ff', color: '#3730a3', icon: FaBox },
  banned: { label: 'Yasaklı', bg: '#fee2e2', color: '#991b1b', icon: FaBan },
  
  // Order statuses
  processing: { label: 'Hazırlanıyor', bg: '#dbeafe', color: '#1e40af', icon: FaClock },
  shipped: { label: 'Kargoya Verildi', bg: '#e0e7ff', color: '#4338ca', icon: FaBox },
  delivered: { label: 'Teslim Edildi', bg: '#d1fae5', color: '#065f46', icon: FaCheckCircle },
  cancelled: { label: 'İptal Edildi', bg: '#fee2e2', color: '#991b1b', icon: FaTimesCircle },
  
  // Review statuses
  needs_moderation: { label: 'Onay Bekliyor', bg: '#fef3c7', color: '#92400e', icon: FaClock },
  published: { label: 'Yayında', bg: '#d1fae5', color: '#065f46', icon: FaCheckCircle },
  
  // Vendor statuses
  verified: { label: 'Doğrulanmış', bg: '#d1fae5', color: '#065f46', icon: FaCheckCircle },
  unverified: { label: 'Doğrulanmamış', bg: '#fef3c7', color: '#92400e', icon: FaClock },
};

/**
 * StatusBadge Component
 */
const StatusBadge = ({ 
  status, 
  customLabel, 
  customConfig,
  showIcon = true,
  size = 'medium',
  style = {} 
}) => {
  // Config merge
  const statusConfig = { ...DEFAULT_STATUS_CONFIG, ...customConfig };
  const statusInfo = statusConfig[status] || { 
    label: status, 
    bg: '#f3f4f6', 
    color: '#374151',
    icon: FaBox 
  };

  // Label belirleme
  const label = customLabel || statusInfo.label;
  const Icon = statusInfo.icon;

  // Size variations
  const sizeStyles = {
    small: { padding: '4px 8px', fontSize: '11px', gap: '4px', iconSize: 10 },
    medium: { padding: '6px 12px', fontSize: '13px', gap: '6px', iconSize: 12 },
    large: { padding: '8px 16px', fontSize: '14px', gap: '8px', iconSize: 14 },
  };

  const currentSize = sizeStyles[size] || sizeStyles.medium;

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: currentSize.gap,
        padding: currentSize.padding,
        borderRadius: '8px',
        fontSize: currentSize.fontSize,
        fontWeight: '600',
        whiteSpace: 'nowrap',
        backgroundColor: statusInfo.bg,
        color: statusInfo.color,
        ...style,
      }}
    >
      {showIcon && Icon && <Icon size={currentSize.iconSize} />}
      {label}
    </span>
  );
};

StatusBadge.propTypes = {
  status: PropTypes.string.isRequired,
  customLabel: PropTypes.string,
  customConfig: PropTypes.object,
  showIcon: PropTypes.bool,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  style: PropTypes.object,
};

export default React.memo(StatusBadge);
