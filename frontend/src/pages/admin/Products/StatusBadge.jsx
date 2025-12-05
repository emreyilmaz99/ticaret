// src/pages/admin/Products/StatusBadge.jsx
import React from 'react';
import { FaClock, FaCheckCircle, FaTimesCircle, FaBox } from 'react-icons/fa';
import { getStatusConfig } from './styles';

/**
 * Durum badge bileşeni
 */
const StatusBadge = ({ status }) => {
  const config = getStatusConfig();
  const statusInfo = config[status] || config.draft;
  
  const icons = {
    pending: FaClock,
    active: FaCheckCircle,
    rejected: FaTimesCircle,
    draft: FaBox,
    inactive: FaBox,
    banned: FaTimesCircle
  };
  
  const Icon = icons[status] || FaBox;

  return (
    <span style={{ 
      display: 'inline-flex', 
      alignItems: 'center', 
      gap: '6px',
      padding: '4px 12px', 
      borderRadius: '20px', 
      fontSize: '12px', 
      fontWeight: '600',
      backgroundColor: statusInfo.bg, 
      color: statusInfo.color
    }}>
      <Icon size={12} /> {statusInfo.label}
    </span>
  );
};

export default StatusBadge;
