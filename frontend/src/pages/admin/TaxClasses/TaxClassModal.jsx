// src/pages/admin/TaxClasses/TaxClassModal.jsx
import React, { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';

const TaxClassModal = ({ isOpen, taxClass, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    rate: '',
    description: '',
    is_default: false,
    is_active: true,
    sort_order: 0
  });

  useEffect(() => {
    if (taxClass) {
      setFormData({
        name: taxClass.name || '',
        rate: taxClass.rate || '',
        description: taxClass.description || '',
        is_default: taxClass.is_default || false,
        is_active: taxClass.is_active !== undefined ? taxClass.is_active : true,
        sort_order: taxClass.sort_order || 0
      });
    } else {
      setFormData({
        name: '',
        rate: '',
        description: '',
        is_default: false,
        is_active: true,
        sort_order: 0
      });
    }
  }, [taxClass, isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={styles.header}>
          <h2 style={styles.title}>
            {taxClass ? 'Vergi Sınıfını Düzenle' : 'Yeni Vergi Sınıfı Ekle'}
          </h2>
          <button style={styles.closeBtn} onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>
              Ad <span style={styles.required}>*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Örn: KDV %20"
              required
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>
              Oran (%) <span style={styles.required}>*</span>
            </label>
            <input
              type="number"
              name="rate"
              value={formData.rate}
              onChange={handleChange}
              placeholder="Örn: 20"
              min="0"
              max="100"
              step="0.01"
              required
              style={styles.input}
            />
            <span style={styles.hint}>0 ile 100 arasında bir değer girin</span>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Açıklama</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Opsiyonel açıklama"
              rows="3"
              style={styles.textarea}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Sıra</label>
            <input
              type="number"
              name="sort_order"
              value={formData.sort_order}
              onChange={handleChange}
              min="0"
              style={styles.input}
            />
            <span style={styles.hint}>Listede görünme sırası (küçükten büyüğe)</span>
          </div>

          <div style={styles.checkboxGroup}>
            <label style={styles.checkboxLabel}>
              <input
                type="checkbox"
                name="is_default"
                checked={formData.is_default}
                onChange={handleChange}
                style={styles.checkbox}
              />
              <span>Varsayılan olarak ayarla</span>
            </label>
          </div>

          <div style={styles.checkboxGroup}>
            <label style={styles.checkboxLabel}>
              <input
                type="checkbox"
                name="is_active"
                checked={formData.is_active}
                onChange={handleChange}
                style={styles.checkbox}
              />
              <span>Aktif</span>
            </label>
          </div>

          {/* Footer */}
          <div style={styles.footer}>
            <button type="button" style={styles.cancelBtn} onClick={onClose}>
              İptal
            </button>
            <button type="submit" style={styles.submitBtn}>
              {taxClass ? 'Güncelle' : 'Oluştur'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000
  },
  modal: {
    backgroundColor: '#FFF',
    borderRadius: '12px',
    width: '90%',
    maxWidth: '600px',
    maxHeight: '90vh',
    overflow: 'auto',
    boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '24px',
    borderBottom: '1px solid #E5E7EB'
  },
  title: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#111827',
    margin: 0
  },
  closeBtn: {
    padding: '8px',
    backgroundColor: 'transparent',
    border: 'none',
    fontSize: '20px',
    color: '#6B7280',
    cursor: 'pointer',
    borderRadius: '6px',
    transition: 'all 0.2s'
  },
  form: {
    padding: '24px'
  },
  formGroup: {
    marginBottom: '20px'
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#374151'
  },
  required: {
    color: '#EF4444'
  },
  input: {
    width: '100%',
    padding: '10px 12px',
    fontSize: '14px',
    border: '1px solid #D1D5DB',
    borderRadius: '6px',
    outline: 'none',
    transition: 'border-color 0.2s',
    boxSizing: 'border-box'
  },
  textarea: {
    width: '100%',
    padding: '10px 12px',
    fontSize: '14px',
    border: '1px solid #D1D5DB',
    borderRadius: '6px',
    outline: 'none',
    transition: 'border-color 0.2s',
    resize: 'vertical',
    fontFamily: 'inherit',
    boxSizing: 'border-box'
  },
  hint: {
    display: 'block',
    marginTop: '6px',
    fontSize: '12px',
    color: '#6B7280'
  },
  checkboxGroup: {
    marginBottom: '16px'
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    color: '#374151',
    cursor: 'pointer'
  },
  checkbox: {
    width: '18px',
    height: '18px',
    cursor: 'pointer'
  },
  footer: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
    marginTop: '24px',
    paddingTop: '24px',
    borderTop: '1px solid #E5E7EB'
  },
  cancelBtn: {
    padding: '10px 20px',
    backgroundColor: '#F3F4F6',
    color: '#374151',
    border: '1px solid #D1D5DB',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  submitBtn: {
    padding: '10px 20px',
    backgroundColor: '#10B981',
    color: '#FFF',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s'
  }
};

export default TaxClassModal;
