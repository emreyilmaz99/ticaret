// src/pages/admin/Applications/shared/components/DetailSection.jsx
import React from 'react';
import PropTypes from 'prop-types';

/**
 * Atomic component for grouping detail fields into sections
 */
const DetailSection = React.memo(({ title, icon, children, style = {} }) => {
  return (
    <div style={{ marginBottom: '24px', ...style }}>
      {title && (
        <h3
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '16px',
            fontWeight: '700',
            color: '#111827',
            marginBottom: '16px',
            paddingBottom: '8px',
            borderBottom: '2px solid #e5e7eb',
          }}
        >
          {icon && <span>{icon}</span>}
          {title}
        </h3>
      )}
      <div>{children}</div>
    </div>
  );
});

DetailSection.displayName = 'DetailSection';

DetailSection.propTypes = {
  title: PropTypes.string,
  icon: PropTypes.node,
  children: PropTypes.node.isRequired,
  style: PropTypes.object,
};

export default DetailSection;
