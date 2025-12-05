// src/pages/vendor/Products/components/modal/GeneralTab.jsx
import React from 'react';
import { styles } from '../../styles';

const GeneralTab = ({ 
  formData, 
  setFormData, 
  groupedCategories, 
  readOnly = false 
}) => {
  const handleChange = (field, value) => {
    if (readOnly) return;
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div style={styles.tabContent}>
      {/* Product Name */}
      <div style={styles.formGroup}>
        <label style={styles.label}>
          Ürün Adı <span style={styles.required}>*</span>
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          placeholder="Ürün adını giriniz"
          style={styles.input}
          readOnly={readOnly}
        />
      </div>

      {/* Category */}
      <div style={styles.formGroup}>
        <label style={styles.label}>
          Kategori <span style={styles.required}>*</span>
        </label>
        <select
          value={formData.category_id}
          onChange={(e) => handleChange('category_id', e.target.value)}
          style={styles.select}
          disabled={readOnly}
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
      </div>

      {/* Product Type */}
      <div style={styles.formGroup}>
        <label style={styles.label}>Ürün Tipi</label>
        <div style={styles.radioGroup}>
          <label style={styles.radioLabel}>
            <input
              type="radio"
              name="type"
              value="simple"
              checked={formData.type === 'simple'}
              onChange={(e) => handleChange('type', e.target.value)}
              disabled={readOnly}
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
              disabled={readOnly}
            />
            <span style={styles.radioText}>Varyantlı Ürün</span>
          </label>
        </div>
      </div>

      {/* Short Description */}
      <div style={styles.formGroup}>
        <label style={styles.label}>Kısa Açıklama</label>
        <input
          type="text"
          value={formData.short_description}
          onChange={(e) => handleChange('short_description', e.target.value)}
          placeholder="Kısa açıklama giriniz"
          style={styles.input}
          maxLength={200}
          readOnly={readOnly}
        />
        <small style={styles.helpText}>
          {formData.short_description.length}/200 karakter
        </small>
      </div>

      {/* Description */}
      <div style={styles.formGroup}>
        <label style={styles.label}>Detaylı Açıklama</label>
        <textarea
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder="Ürün açıklamasını giriniz"
          style={styles.textarea}
          rows={5}
          readOnly={readOnly}
        />
      </div>
    </div>
  );
};

export default GeneralTab;
