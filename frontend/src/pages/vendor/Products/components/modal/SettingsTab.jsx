// src/pages/vendor/Products/components/modal/SettingsTab.jsx
import React from 'react';
import { FaTimes } from 'react-icons/fa';
import { styles } from '../../styles';

const SettingsTab = ({ 
  formData, 
  setFormData, 
  tagInput, 
  setTagInput,
  addTag,
  removeTag,
  removeLastTag,
  readOnly = false 
}) => {
  const handleChange = (field, value) => {
    if (readOnly) return;
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleTagInputKeyDown = (e) => {
    if (readOnly) return;
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag(tagInput.trim());
    } else if (e.key === 'Backspace' && !tagInput && formData.tags.length > 0) {
      removeLastTag();
    }
  };

  return (
    <div style={styles.tabContent}>
      {/* Featured Toggle */}
      <div style={styles.formGroup}>
        <label style={styles.switchLabel}>
          <span style={styles.switchText}>Öne Çıkan Ürün</span>
          <div 
            style={{
              ...styles.switch,
              ...(formData.is_featured ? styles.switchActive : {})
            }}
            onClick={() => !readOnly && handleChange('is_featured', !formData.is_featured)}
          >
            <div 
              style={{
                ...styles.switchHandle,
                ...(formData.is_featured ? styles.switchHandleActive : {})
              }}
            />
          </div>
        </label>
        <small style={styles.helpText}>
          Öne çıkan ürünler ana sayfada ve kategori sayfalarında öncelikli gösterilir.
        </small>
      </div>

      {/* Tags */}
      <div style={styles.formGroup}>
        <label style={styles.label}>Etiketler</label>
        
        {/* Input Bar */}
        {!readOnly && (
          <div style={styles.tagInputWrapper}>
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagInputKeyDown}
              placeholder="Etiket eklemek için yazın ve Enter'a basın"
              style={styles.tagInputField}
            />
          </div>
        )}

        {/* Tags List - Alt satırda hizalı */}
        {formData.tags.length > 0 && (
          <div style={styles.tagsListContainer}>
            {formData.tags.map((tag, index) => (
              <span key={index} style={styles.tag}>
                {tag}
                {!readOnly && (
                  <button
                    type="button"
                    style={styles.tagRemoveBtn}
                    onClick={() => removeTag(index)}
                  >
                    <FaTimes />
                  </button>
                )}
              </span>
            ))}
          </div>
        )}

        <small style={styles.helpText}>
          Etiketler ürünlerinizin arama sonuçlarında daha kolay bulunmasını sağlar.
        </small>
      </div>
    </div>
  );
};

export default SettingsTab;
