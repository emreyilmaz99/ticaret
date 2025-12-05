import React from 'react';
import { FaShippingFast, FaToggleOn, FaToggleOff } from 'react-icons/fa';
import { styles } from '../styles';

/**
 * Toggle section for enabling/disabling shipping
 */
const ShippingToggle = ({ isEnabled, onToggle }) => {
  return (
    <div style={{
      ...styles.toggleSection,
      ...(isEnabled ? styles.toggleSectionEnabled : styles.toggleSectionDisabled)
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{
          ...styles.toggleIconWrapper,
          ...(isEnabled ? styles.toggleIconWrapperEnabled : styles.toggleIconWrapperDisabled)
        }}>
          <FaShippingFast style={{
            ...styles.toggleIcon,
            ...(isEnabled ? styles.toggleIconEnabled : styles.toggleIconDisabled)
          }} />
        </div>
        <div>
          <p style={styles.toggleTitle}>
            Kargo Ücreti Uygula
          </p>
          <p style={styles.toggleSubtitle}>
            {isEnabled 
              ? 'Limit altı siparişlerde kargo ücreti alınıyor' 
              : 'Tüm siparişlerde kargo ücretsiz'}
          </p>
        </div>
      </div>
      <button 
        type="button"
        onClick={onToggle}
        style={{
          ...styles.toggleButton,
          ...(isEnabled ? styles.toggleButtonEnabled : styles.toggleButtonDisabled)
        }}
      >
        {isEnabled ? <FaToggleOn /> : <FaToggleOff />}
      </button>
    </div>
  );
};

export default ShippingToggle;
