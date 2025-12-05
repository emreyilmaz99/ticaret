// src/pages/admin/Categories/DeleteConfirmModal.jsx
import React from 'react';
import { FaTimes, FaTrash } from 'react-icons/fa';

/**
 * Silme onay modal bileşeni
 */
const DeleteConfirmModal = ({
  isOpen,
  category,
  onConfirm,
  onCancel,
  isDeleting,
  styles
}) => {
  if (!isOpen || !category) return null;

  return (
    <div style={styles.modalOverlay} onClick={onCancel}>
      <div 
        style={{ ...styles.modalContent, maxWidth: '400px' }} 
        onClick={(e) => e.stopPropagation()}
      >
        <div style={styles.modalHeader}>
          <h2 style={styles.modalTitle}>Kategori Sil</h2>
          <button 
            onClick={onCancel} 
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}
          >
            <FaTimes size={20} />
          </button>
        </div>
        
        <div style={{ padding: '24px' }}>
          <p style={{ color: '#475569', lineHeight: '1.6' }}>
            <strong>"{category.name}"</strong> kategorisini silmek istediğinize emin misiniz?
          </p>
          {category.children_count > 0 && (
            <p style={{ color: '#dc2626', marginTop: '12px', fontSize: '14px' }}>
              ⚠️ Bu kategorinin {category.children_count} alt kategorisi var. Önce alt kategorileri silmelisiniz.
            </p>
          )}
        </div>
        
        <div style={styles.modalFooter}>
          <button onClick={onCancel} style={styles.btnSecondary}>
            İptal
          </button>
          <button 
            onClick={onConfirm}
            disabled={isDeleting}
            style={styles.btnDanger}
          >
            <FaTrash size={14} /> Sil
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
