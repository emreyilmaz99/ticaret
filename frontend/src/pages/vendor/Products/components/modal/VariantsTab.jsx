// src/pages/vendor/Products/components/modal/VariantsTab.jsx
import React from 'react';
import { FaPlus, FaTrash } from 'react-icons/fa';
import { styles } from '../../styles';

const VariantsTab = ({ 
  formData, 
  handleVariantChange, 
  addVariant, 
  removeVariant,
  units = [],
  readOnly = false 
}) => {
  // Only show for variable products
  if (formData.type === 'simple') {
    return (
      <div style={styles.tabContent}>
        <div style={styles.infoBox}>
          <p>Basit ürünlerde varyant tanımlaması yapılmaz.</p>
          <p>Varyant eklemek için ürün tipini "Varyantlı Ürün" olarak değiştiriniz.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.tabContent}>
      <div style={styles.variantsHeader}>
        <h4 style={styles.variantsTitle}>Ürün Varyantları</h4>
        {!readOnly && (
          <button 
            type="button" 
            style={styles.addVariantBtn}
            onClick={addVariant}
          >
            <FaPlus style={{ marginRight: 6 }} />
            Varyant Ekle
          </button>
        )}
      </div>

      {formData.variants.length === 0 ? (
        <div style={styles.emptyVariants}>
          <p>Henüz varyant eklenmemiş.</p>
          {!readOnly && (
            <button 
              type="button" 
              style={styles.addVariantBtn}
              onClick={addVariant}
            >
              <FaPlus style={{ marginRight: 6 }} />
              İlk Varyantı Ekle
            </button>
          )}
        </div>
      ) : (
        <div style={styles.variantsList}>
          {formData.variants.map((variant, index) => (
            <div key={index} style={styles.variantCard}>
              <div style={styles.variantHeader}>
                <span style={styles.variantIndex}>Varyant #{index + 1}</span>
                {!readOnly && (
                  <button
                    type="button"
                    style={styles.variantDeleteBtn}
                    onClick={() => removeVariant(index)}
                    title="Varyantı sil"
                  >
                    <FaTrash />
                  </button>
                )}
              </div>

              <div style={styles.variantFields}>
                <div style={styles.variantRow}>
                  <div style={styles.variantField}>
                    <label style={styles.variantLabel}>Başlık</label>
                    <input
                      type="text"
                      value={variant.title || ''}
                      onChange={(e) => handleVariantChange(index, 'title', e.target.value)}
                      placeholder="Örn: Kırmızı - XL"
                      style={styles.variantInput}
                      readOnly={readOnly}
                    />
                  </div>
                  <div style={styles.variantField}>
                    <label style={styles.variantLabel}>SKU</label>
                    <input
                      type="text"
                      value={variant.sku || ''}
                      onChange={(e) => handleVariantChange(index, 'sku', e.target.value)}
                      placeholder="Örn: PRD-001-RED-XL"
                      style={styles.variantInput}
                      readOnly={readOnly}
                    />
                  </div>
                </div>

                <div style={styles.variantRow}>
                  <div style={styles.variantField}>
                    <label style={styles.variantLabel}>Fiyat</label>
                    <div style={styles.inputWithPrefix}>
                      <span style={styles.inputPrefix}>₺</span>
                      <input
                        type="number"
                        value={variant.price || ''}
                        onChange={(e) => handleVariantChange(index, 'price', e.target.value)}
                        placeholder="0.00"
                        style={styles.inputWithPrefixField}
                        min="0"
                        step="0.01"
                        readOnly={readOnly}
                      />
                    </div>
                  </div>
                  <div style={styles.variantField}>
                    <label style={styles.variantLabel}>Stok</label>
                    <input
                      type="number"
                      value={variant.stock ?? ''}
                      onChange={(e) => handleVariantChange(index, 'stock', parseInt(e.target.value) || 0)}
                      placeholder="0"
                      style={styles.variantInput}
                      min="0"
                      readOnly={readOnly}
                    />
                  </div>
                  <div style={styles.variantField}>
                    <label style={styles.variantLabel}>Birim</label>
                    <select
                      value={variant.unit_id || ''}
                      onChange={(e) => handleVariantChange(index, 'unit_id', e.target.value)}
                      style={styles.variantSelect}
                      disabled={readOnly}
                    >
                      <option value="">Seçiniz</option>
                      {units.map(unit => (
                        <option key={unit.id} value={unit.id}>
                          {unit.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VariantsTab;
