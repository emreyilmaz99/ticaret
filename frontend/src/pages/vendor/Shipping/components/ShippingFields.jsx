import React from 'react';
import { FaTruck, FaGift } from 'react-icons/fa';
import { styles } from '../styles';

/**
 * Form fields for shipping cost and threshold
 */
const ShippingFields = ({ form, onChange, isEnabled }) => {
  return (
    <div style={{
      ...styles.formFieldsContainer,
      ...(isEnabled ? styles.formFieldsEnabled : styles.formFieldsDisabled)
    }}>
      <div style={styles.formGrid}>
        {/* Shipping Cost */}
        <div>
          <label style={styles.label}>
            <FaTruck style={styles.labelIcon} />
            Kargo Ücreti
          </label>
          <div style={styles.inputWrapper}>
            <input
              type="number"
              name="shipping_cost"
              value={form.shipping_cost}
              onChange={onChange}
              style={styles.input}
              step="0.01"
              min="0"
              max="9999.99"
              disabled={!isEnabled}
            />
            <span style={styles.inputSuffix}>₺</span>
          </div>
          <p style={styles.inputHint}>
            Limit altı siparişlere uygulanacak ücret
          </p>
        </div>

        {/* Free Shipping Threshold */}
        <div>
          <label style={styles.label}>
            <FaGift style={{ ...styles.labelIcon, color: '#16a34a' }} />
            Ücretsiz Kargo Limiti
          </label>
          <div style={styles.inputWrapper}>
            <input
              type="number"
              name="free_shipping_threshold"
              value={form.free_shipping_threshold}
              onChange={onChange}
              style={styles.input}
              step="0.01"
              min="0"
              max="99999.99"
              disabled={!isEnabled}
            />
            <span style={styles.inputSuffix}>₺</span>
          </div>
          <p style={styles.inputHint}>
            Bu tutarın üzerinde kargo ücretsiz
          </p>
        </div>
      </div>
    </div>
  );
};

export default ShippingFields;
