// src/pages/vendor/Products/components/modal/GeneralTab.jsx
import React from 'react';
import { styles } from '../../styles';

const GeneralTab = ({ 
  formData, 
  setFormData, 
  groupedCategories,
  taxClasses = [],
  readOnly = false 
}) => {
  const handleChange = (field, value) => {
    if (readOnly) return;
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Helper functions for readOnly mode
  const getCategoryName = () => {
    for (const group of groupedCategories) {
      const cat = group.children.find(c => c.id == formData.category_id);
      if (cat) return cat.name;
    }
    return '-';
  };

  const getTaxClassName = () => {
    // Loose comparison (==) to handle string/number mismatch
    const taxClass = taxClasses.find(tc => tc.id == formData.tax_class_id);
    if (taxClass) {
      return `${taxClass.name} - %${taxClass.rate}`;
    }
    // If not found but tax_class_id exists, show loading state
    if (formData.tax_class_id) {
      return 'Yükleniyor...';
    }
    return '-';
  };

  return (
    <div style={styles.tabContent}>
      {/* Product Name */}
      <div style={styles.formGroup}>
        <label style={styles.label}>
          Ürün Adı {!readOnly && <span style={styles.required}>*</span>}
        </label>
        {readOnly ? (
          <div style={styles.readOnlyValue}>{formData.name || '-'}</div>
        ) : (
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="Ürün adını giriniz"
            style={styles.input}
          />
        )}
      </div>

      {/* Category */}
      <div style={styles.formGroup}>
        <label style={styles.label}>
          Kategori {!readOnly && <span style={styles.required}>*</span>}
        </label>
        {readOnly ? (
          <div style={styles.readOnlyValue}>{getCategoryName()}</div>
        ) : (
          <select
            value={formData.category_id}
            onChange={(e) => handleChange('category_id', e.target.value)}
            style={styles.select}
          >
            <option value="">Kategori seçiniz</option>
            {groupedCategories.map(group => (
              <optgroup key={group.parent.id || group.parent.name} label={group.parent.name}>
                {group.children.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        )}
      </div>

      {/* Tax Class */}
      <div style={styles.formGroup}>
        <label style={styles.label}>
          Vergi Sınıfı (KDV) {!readOnly && <span style={styles.required}>*</span>}
        </label>
        {readOnly ? (
          <div style={styles.readOnlyValue}>{getTaxClassName()}</div>
        ) : (
          <select
            value={formData.tax_class_id || ''}
            onChange={(e) => handleChange('tax_class_id', e.target.value)}
            style={styles.select}
          >
            <option value="">Vergi sınıfı seçiniz</option>
            {taxClasses.map(taxClass => (
              <option key={taxClass.id} value={taxClass.id}>
                {taxClass.name} - %{taxClass.rate}
                {taxClass.is_default ? ' (Varsayılan)' : ''}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Product Type */}
      <div style={styles.formGroup}>
        <label style={styles.label}>Ürün Tipi</label>
        {readOnly ? (
          <div style={styles.readOnlyValue}>
            {formData.type === 'simple' ? 'Basit Ürün' : 'Varyantlı Ürün'}
          </div>
        ) : (
          <div style={styles.radioGroup}>
            <label style={styles.radioLabel}>
              <input
                type="radio"
                name="type"
                value="simple"
                checked={formData.type === 'simple'}
                onChange={(e) => handleChange('type', e.target.value)}
              />
              <span style={styles.radioText}>Basit Ürün</span>
            </label>
            <label style={styles.radioLabel}>
              <input
                type="radio"
                name="type"
                value="variable"
                checked={formData.type === 'variable'}
                onChange={(e) => handleChange('type', e.target.value)}
              />
              <span style={styles.radioText}>Varyantlı Ürün</span>
            </label>
          </div>
        )}
      </div>

      {/* Short Description */}
      <div style={styles.formGroup}>
        <label style={styles.label}>Kısa Açıklama</label>
        {readOnly ? (
          <div style={styles.readOnlyValue}>{formData.short_description || '-'}</div>
        ) : (
          <>
            <input
              type="text"
              value={formData.short_description}
              onChange={(e) => handleChange('short_description', e.target.value)}
              placeholder="Kısa açıklama giriniz"
              style={styles.input}
              maxLength={200}
            />
            <small style={styles.helpText}>
              {formData.short_description.length}/200 karakter
            </small>
          </>
        )}
      </div>

      {/* Description */}
      <div style={styles.formGroup}>
        <label style={styles.label}>Detaylı Açıklama</label>
        {readOnly ? (
          <div style={styles.readOnlyValue}>{formData.description || '-'}</div>
        ) : (
          <textarea
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Ürün açıklamasını giriniz"
            style={styles.textarea}
            rows={5}
          />
        )}
      </div>
    </div>
  );
};

export default GeneralTab;
