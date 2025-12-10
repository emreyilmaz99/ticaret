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

  const getUnitName = () => {
    const unit = units.find(u => u.id == formData.unit_id);
    return unit ? `${unit.name} (${unit.symbol})` : '-';
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
            Satış Fiyatı {!readOnly && <span style={styles.required}>*</span>}
          </label>
          {readOnly ? (
            <div style={styles.readOnlyValue}>₺{formData.price || '0.00'}</div>
          ) : (
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
              />
            </div>
          )}
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>
            Stok {!readOnly && <span style={styles.required}>*</span>}
          </label>
          {readOnly ? (
            <div style={styles.readOnlyValue}>{formData.stock || 0} Adet</div>
          ) : (
            <input
              type="number"
              value={formData.stock}
              onChange={(e) => handleChange('stock', parseInt(e.target.value) || 0)}
              placeholder="0"
              style={styles.input}
              min="0"
            />
          )}
        </div>
      </div>

      {/* SKU & Unit */}
      <div style={styles.formRow}>
        <div style={styles.formGroup}>
          <label style={styles.label}>SKU (Stok Kodu)</label>
          {readOnly ? (
            <div style={styles.readOnlyValue}>{formData.sku || '-'}</div>
          ) : (
            <input
              type="text"
              value={formData.sku}
              onChange={(e) => handleChange('sku', e.target.value)}
              placeholder="Örn: PRD-001"
              style={styles.input}
            />
          )}
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Birim</label>
          {readOnly ? (
            <div style={styles.readOnlyValue}>{getUnitName()}</div>
          ) : (
            <select
              value={formData.unit_id}
              onChange={(e) => handleChange('unit_id', e.target.value)}
              style={styles.select}
            >
              <option value="">Birim seçiniz</option>
              {units.map(unit => (
                <option key={unit.id} value={unit.id}>
                  {unit.name} ({unit.symbol})
                </option>
              ))}
            </select>
          )}
        </div>
      </div>
    </div>
  );
};

export default PricingTab;
