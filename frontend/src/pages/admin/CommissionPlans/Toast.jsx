// src/pages/admin/CommissionPlans/Toast.jsx
import React, { useEffect } from 'react';
import { FaCheck, FaTimes } from 'react-icons/fa';

/**
 * Toast notification bileşeni
 */
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColors = {
    success: '#10b981',
    error: '#ef4444',
    info: '#3b82f6'
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      backgroundColor: bgColors[type] || bgColors.info,
      color: 'white',
      padding: '12px 24px',
      borderRadius: '8px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      zIndex: 2000,
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      animation: 'slideIn 0.3s ease-out'
    }}>
      {type === 'success' && <FaCheck />}
      {type === 'error' && <FaTimes />}
      <span>{message}</span>
    </div>
  );
};

export default Toast;
