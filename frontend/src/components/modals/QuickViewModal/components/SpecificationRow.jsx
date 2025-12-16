// src/components/modals/QuickViewModal/components/SpecificationRow.jsx
import React from 'react';
import PropTypes from 'prop-types';
import { styles } from '../styles';

const SpecificationRow = React.memo(({ icon, label, value }) => {
  if (!value) return null;

  return (
    <div style={styles.specRow}>
      <span>{icon}</span>
      <span style={styles.specLabel}>{label}:</span>
      <span style={styles.specValue}>{value}</span>
    </div>
  );
});

SpecificationRow.displayName = 'SpecificationRow';

SpecificationRow.propTypes = {
  icon: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default SpecificationRow;
