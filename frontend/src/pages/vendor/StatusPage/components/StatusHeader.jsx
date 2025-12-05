import React from 'react';
import StatusIcon from './StatusIcon';
import { styles } from '../styles';

/**
 * Status header with icon, title and description
 */
const StatusHeader = ({ config }) => {
  return (
    <div style={{
      ...styles.header,
      backgroundColor: config.bgColor,
      borderBottom: `1px solid ${config.borderColor}`
    }}>
      <div style={styles.headerIcon}>
        <StatusIcon iconType={config.iconType} color={config.color} />
      </div>
      <h1 style={styles.headerTitle}>{config.title}</h1>
      <p style={styles.headerDescription}>{config.description}</p>
    </div>
  );
};

export default StatusHeader;
