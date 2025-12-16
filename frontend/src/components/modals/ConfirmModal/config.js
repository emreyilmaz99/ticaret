// src/components/modals/ConfirmModal/config.js
import { FiAlertTriangle, FiTrash2, FiCheck } from 'react-icons/fi';

export const confirmTypes = {
  danger: {
    icon: FiTrash2,
    iconColor: '#dc2626',
    iconBg: '#fee2e2',
    button: '#dc2626',
    buttonHover: '#b91c1c',
  },
  warning: {
    icon: FiAlertTriangle,
    iconColor: '#f59e0b',
    iconBg: '#fef3c7',
    button: '#f59e0b',
    buttonHover: '#d97706',
  },
  success: {
    icon: FiCheck,
    iconColor: '#059669',
    iconBg: '#ecfdf5',
    button: '#059669',
    buttonHover: '#047857',
  },
};
