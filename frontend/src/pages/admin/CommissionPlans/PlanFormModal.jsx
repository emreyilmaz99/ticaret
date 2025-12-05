// src/pages/admin/CommissionPlans/PlanFormModal.jsx
import React from 'react';
import { FaTimes } from 'react-icons/fa';

/**
 * Plan oluşturma/düzenleme modal formu
 */
const PlanFormModal = ({
  isOpen,
  isEditing,
  formData,
  onFormChange,
  onSubmit,
  onClose,
  styles
}) => {
  if (!isOpen) return null;

  return (
    <div style={styles.modalOverlay}>
      <div style={styles.modalContent}>
        <div style={styles.modalHeader}>
          <h2 style={{ margin: 0, fontSize: '18px', color: '#0f172a' }}>
            {isEditing ? 'Planı Düzenle' : 'Yeni Plan Ekle'}
          </h2>
          <button 
            onClick={onClose} 
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
          >
            <FaTimes size={20} />
          </button>
        </div>
        
        <form onSubmit={onSubmit}>
          <div style={styles.modalBody}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Plan Adı</label>
              <input 
                type="text" 
                style={styles.input} 
                value={formData.name}
                onChange={(e) => onFormChange('name', e.target.value)}
                required
              />
            </div>
            
            <div style={styles.formGroup}>
              <label style={styles.label}>Komisyon Oranı (%)</label>
              <input 
                type="number" 
                step="0.01"
                style={styles.input} 
                value={formData.rate}
                onChange={(e) => onFormChange('rate', e.target.value)}
                required
              />
            </div>
            
            <div style={styles.formGroup}>
              <label style={styles.label}>Açıklama</label>
              <textarea 
                style={styles.textarea} 
                value={formData.description}
                onChange={(e) => onFormChange('description', e.target.value)}
              />
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input 
                type="checkbox" 
                id="isActive"
                checked={formData.is_active}
                onChange={(e) => onFormChange('is_active', e.target.checked)}
              />
              <label 
                htmlFor="isActive" 
                style={{ fontSize: '14px', color: '#334155', cursor: 'pointer' }}
              >
                Aktif
              </label>
            </div>
          </div>
          
          <div style={styles.modalFooter}>
            <button type="button" onClick={onClose} style={styles.cancelBtn}>
              İptal
            </button>
            <button type="submit" style={styles.primaryBtn}>
              Kaydet
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PlanFormModal;
