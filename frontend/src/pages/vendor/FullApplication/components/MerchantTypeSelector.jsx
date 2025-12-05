import React from 'react';
import { MERCHANT_TYPES, styles } from '../styles';

/**
 * Merchant type selection cards
 */
const MerchantTypeSelector = ({ selectedType, onSelect }) => {
  return (
    <>
      <div style={styles.sectionTitle}>
        🏢 Satıcı Türü Seçimi *
      </div>

      <div style={styles.gridThree}>
        {Object.values(MERCHANT_TYPES).map((type) => (
          <div
            key={type.value}
            onClick={() => onSelect(type.value)}
            style={{
              ...styles.merchantTypeCard,
              ...(selectedType === type.value 
                ? styles.merchantTypeCardActive 
                : styles.merchantTypeCardInactive)
            }}
          >
            <div style={styles.merchantTypeIcon}>{type.icon}</div>
            <div style={styles.merchantTypeLabel}>{type.label}</div>
            <div style={styles.merchantTypeDesc}>{type.description}</div>
          </div>
        ))}
      </div>
    </>
  );
};

export default MerchantTypeSelector;
