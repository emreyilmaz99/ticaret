// src/pages/vendor/Products/components/modal/PricingTab.jsx
import React from 'react';
import { styles } from '../../styles';

const PricingTab = ({ 
  formData, 
  setFormData, 
  units = [], 
  readOnly = false 
}) => {
  const handleChange = (field, value) => {
    if (readOnly) return;
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Only show for simple products
  if (formData.type === 'variable') {
    return (
      <div style={styles.tabContent}>
        <div style={styles.infoBox}>
          <p>Varyantlı ürünlerde fiyat ve stok bilgileri her varyant için ayrı ayrı belirlenir.</p>
          <p>Lütfen "Varyantlar" sekmesinden varyantları tanımlayınız.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.tabContent}>
      {/* Price */}
      <div style={styles.formRow}>
        <div style={styles.formGroup}>
          <label style={styles.label}>
            Satış Fiyatı <span style={styles.required}>*</span>
          </label>
          <div style={styles.inputWithPrefix}>
            <span style={styles.inputPrefix}>₺</span>
            <input
              type="number"
              value={formData.price}
              onChange={(e) => handleChange('price', e.target.value)}
              placeholder="0.00"
              style={styles.inputWithPrefixField}
              min="0"
              step="0.01"
              readOnly={readOnly}
            />
          </div>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>
            Stok <span style={styles.required}>*</span>
          </label>
          <input
            type="number"
            value={formData.stock}
            onChange={(e) => handleChange('stock', parseInt(e.target.value) || 0)}
            placeholder="0"
            style={styles.input}
            min="0"
            readOnly={readOnly}
          />
        </div>
      </div>

      {/* SKU & Unit */}
      <div style={styles.formRow}>
        <div style={styles.formGroup}>
          <label style={styles.label}>SKU (Stok Kodu)</label>
          <input
            type="text"
            value={formData.sku}
            onChange={(e) => handleChange('sku', e.target.value)}
            placeholder="Örn: PRD-001"
            style={styles.input}
            readOnly={readOnly}
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Birim</label>
          <select
            value={formData.unit_id}
            onChange={(e) => handleChange('unit_id', e.target.value)}
            style={styles.select}
            disabled={readOnly}
          >
            <option value="">Birim seçiniz</option>
            {units.map(unit => (
              <option key={unit.id} value={unit.id}>
                {unit.name} ({unit.symbol})
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default PricingTab;
