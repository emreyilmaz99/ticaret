import React from 'react';
import { 
  FaCheckCircle, 
  FaClock, 
  FaTimesCircle, 
  FaExclamationTriangle,
  FaFileAlt
} from 'react-icons/fa';

const ICON_MAP = {
  check: FaCheckCircle,
  clock: FaClock,
  times: FaTimesCircle,
  warning: FaExclamationTriangle,
  file: FaFileAlt
};

/**
 * Status icon component
 */
const StatusIcon = ({ iconType, color, size = 48 }) => {
  const IconComponent = ICON_MAP[iconType] || FaClock;
  return <IconComponent size={size} color={color} />;
};

export default StatusIcon;
