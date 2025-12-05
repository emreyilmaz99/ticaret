// src/pages/admin/Categories/CategoryFormModal.jsx
import React from 'react';
import { FaTimes, FaSave, FaImage, FaEye, FaEyeSlash } from 'react-icons/fa';
import { getIconEmoji } from './styles';

/**
 * Kategori oluşturma/düzenleme modal formu
 */
const CategoryFormModal = ({
  isOpen,
  mode,
  formData,
  imagePreview,
  parentOptions,
  onFormChange,
  onImageChange,
  onSubmit,
  onClose,
  isSubmitting,
  styles
}) => {
  if (!isOpen) return null;

  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={styles.modalHeader}>
          <h2 style={styles.modalTitle}>
            {mode === 'create' ? 'Yeni Kategori Oluştur' : 'Kategori Düzenle'}
          </h2>
          <button 
            onClick={onClose} 
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}
          >
            <FaTimes size={20} />
          </button>
        </div>
        
        <form onSubmit={onSubmit}>
          <div style={styles.modalBody}>
            {/* Name */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Kategori Adı *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => onFormChange('name', e.target.value)}
                style={styles.input}
                placeholder="Örn: Elektronik"
                required
              />
            </div>

            {/* Parent Category */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Üst Kategori</label>
              <select
                value={formData.parent_id}
                onChange={(e) => onFormChange('parent_id', e.target.value)}
                style={styles.input}
              >
                {parentOptions.map(opt => (
                  <option key={opt.id} value={opt.id}>{opt.name}</option>
                ))}
              </select>
            </div>

            {/* Icon */}
            <div style={styles.formGroup}>
              <label style={styles.label}>İkon (React Icon Adı)</label>
              <input
                type="text"
                value={formData.icon}
                onChange={(e) => onFormChange('icon', e.target.value)}
                style={styles.input}
                placeholder="Örn: FaMobileAlt"
              />
              <p style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                Önizleme: {getIconEmoji(formData.icon)}
              </p>
            </div>

            {/* Description */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Açıklama</label>
              <textarea
                value={formData.description}
                onChange={(e) => onFormChange('description', e.target.value)}
                style={styles.textarea}
                placeholder="Kategori açıklaması..."
              />
            </div>

            {/* Image */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Görsel</label>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                {imagePreview && (
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    style={{ 
                      width: '80px', 
                      height: '80px', 
                      objectFit: 'cover', 
                      borderRadius: '8px', 
                      border: '1px solid #e2e8f0' 
                    }} 
                  />
                )}
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={onImageChange}
                    style={{ display: 'none' }}
                    id="category-image"
                  />
                  <label 
                    htmlFor="category-image"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '8px 16px',
                      borderRadius: '8px',
                      border: '1px dashed #cbd5e1',
                      cursor: 'pointer',
                      fontSize: '14px',
                      color: '#64748b'
                    }}
                  >
                    <FaImage size={14} /> Görsel Seç
                  </label>
                  <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>
                    Max 2MB (JPG, PNG, WEBP)
                  </p>
                </div>
              </div>
            </div>

            {/* Sort Order & Status */}
            <div style={styles.grid2}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Sıra Numarası</label>
                <input
                  type="number"
                  value={formData.sort_order}
                  onChange={(e) => onFormChange('sort_order', parseInt(e.target.value) || 0)}
                  style={styles.input}
                  min="0"
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Durum</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingTop: '8px' }}>
                  <button
                    type="button"
                    onClick={() => onFormChange('is_active', true)}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '8px',
                      border: '1px solid',
                      borderColor: formData.is_active ? '#16a34a' : '#e2e8f0',
                      backgroundColor: formData.is_active ? '#dcfce7' : 'white',
                      color: formData.is_active ? '#166534' : '#64748b',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <FaEye size={12} /> Aktif
                  </button>
                  <button
                    type="button"
                    onClick={() => onFormChange('is_active', false)}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '8px',
                      border: '1px solid',
                      borderColor: !formData.is_active ? '#dc2626' : '#e2e8f0',
                      backgroundColor: !formData.is_active ? '#fee2e2' : 'white',
                      color: !formData.is_active ? '#991b1b' : '#64748b',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <FaEyeSlash size={12} /> Pasif
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div style={styles.modalFooter}>
            <button type="button" onClick={onClose} style={styles.btnSecondary}>
              İptal
            </button>
            <button 
              type="submit" 
              style={styles.btnPrimary}
              disabled={isSubmitting}
            >
              <FaSave size={14} /> {mode === 'create' ? 'Oluştur' : 'Güncelle'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryFormModal;
