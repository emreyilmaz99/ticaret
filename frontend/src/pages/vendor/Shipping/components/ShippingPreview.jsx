import React from 'react';
import { FaBox } from 'react-icons/fa';
import { styles } from '../styles';

/**
 * Preview section showing what customers will see
 */
const ShippingPreview = ({ previewValues, isEnabled }) => {
  const { testAmount, isTestFree, shippingCost, freeThreshold } = previewValues;

  return (
    <div style={{
      ...styles.formFieldsContainer,
      ...(isEnabled ? styles.formFieldsEnabled : styles.formFieldsDisabled)
    }}>
      <div style={styles.previewCard}>
        <p style={styles.previewTitle}>
          <FaBox style={styles.previewIcon} /> Önizleme - Müşterileriniz Şunu Görecek
        </p>
        
        <div style={styles.previewList}>
          {/* Preview Row 1 - Test Amount */}
          <div style={{ ...styles.previewRow, ...styles.previewRowDefault }}>
            <span style={styles.previewLabel}>
              {testAmount}₺'lik sipariş için kargo:
            </span>
            {isTestFree ? (
              <span style={{ ...styles.previewValue, ...styles.previewValueFree }}>
                ✓ Ücretsiz
              </span>
            ) : (
              <span style={{ ...styles.previewValue, ...styles.previewValuePaid }}>
                {shippingCost.toFixed(2)} ₺
              </span>
            )}
          </div>

          {/* Preview Row 2 - Free Threshold */}
          <div style={{ ...styles.previewRow, ...styles.previewRowFree }}>
            <span style={styles.previewLabel}>
              {freeThreshold.toFixed(0)}₺ ve üzeri sipariş için kargo:
            </span>
            <span style={{ ...styles.previewValue, ...styles.previewValueFree }}>
              ✓ Ücretsiz
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShippingPreview;
