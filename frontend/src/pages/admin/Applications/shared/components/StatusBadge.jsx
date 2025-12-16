// src/pages/admin/Applications/shared/components/StatusBadge.jsx
import React from 'react';
import PropTypes from 'prop-types';
import { STATUS_COLORS, STATUS_LABELS } from '../constants';

/**
 * Atomic component for displaying status badges
 */
const StatusBadge = React.memo(({ status, customLabel, customColors, style = {} }) => {
  const colors = customColors || STATUS_COLORS[status] || { background: '#f3f4f6', color: '#374151' };
  const label = customLabel || STATUS_LABELS[status] || status;

  const getStatusIcon = (status) => {
    if (status?.includes('pre_pending') || status?.includes('pending')) return '⏳';
    if (status?.includes('approved') || status?.includes('active')) return '✓';
    if (status?.includes('rejected') || status?.includes('banned')) return '✗';
    return '';
  };

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        padding: '6px 12px',
        borderRadius: '8px',
        fontSize: '13px',
        fontWeight: '600',
        whiteSpace: 'nowrap',
        ...colors,
        ...style,
      }}
    >
      {getStatusIcon(status)}
      {label}
    </span>
  );
});

StatusBadge.displayName = 'StatusBadge';

StatusBadge.propTypes = {
  status: PropTypes.string.isRequired,
  customLabel: PropTypes.string,
  customColors: PropTypes.shape({
    background: PropTypes.string,
    color: PropTypes.string,
  }),
  style: PropTypes.object,
};

export default StatusBadge;
