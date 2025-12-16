// src/components/common/Toast/config.js
import { FaCheckCircle, FaTimesCircle, FaInfoCircle, FaExclamationTriangle } from 'react-icons/fa';

export const toastConfig = {
  success: {
    icon: FaCheckCircle,
    bgColor: 'linear-gradient(135deg, #047857 0%, #059669 100%)',
    borderColor: '#10b981',
    iconBg: 'rgba(255, 255, 255, 0.2)',
  },
  error: {
    icon: FaTimesCircle,
    bgColor: 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)',
    borderColor: '#f87171',
    iconBg: 'rgba(255, 255, 255, 0.2)',
  },
  warning: {
    icon: FaExclamationTriangle,
    bgColor: 'linear-gradient(135deg, #d97706 0%, #f59e0b 100%)',
    borderColor: '#fbbf24',
    iconBg: 'rgba(255, 255, 255, 0.2)',
  },
  info: {
    icon: FaInfoCircle,
    bgColor: 'linear-gradient(135deg, #0369a1 0%, #0ea5e9 100%)',
    borderColor: '#38bdf8',
    iconBg: 'rgba(255, 255, 255, 0.2)',
  },
};
