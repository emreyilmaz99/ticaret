// src/pages/admin/Products/ProductFilterBar.jsx
import React from 'react';
import { FaSearch, FaCheck, FaTimes } from 'react-icons/fa';

/**
 * Arama ve toplu işlem barı
 */
const ProductFilterBar = ({ 
  searchValue, 
  onSearchChange, 
  selectedCount,
  onBulkApprove,
  onBulkReject,
  styles 
}) => {
  return (
    <div style={styles.filterBar}>
      <div style={{ position: 'relative', flex: 1 }}>
        <FaSearch 
          style={{ 
            position: 'absolute', 
            left: '14px', 
            top: '50%', 
            transform: 'translateY(-50%)', 
            color: '#94a3b8' 
          }} 
        />
        <input 
          type="text"
          placeholder="Ürün adı veya SKU ara..."
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          style={styles.searchInput}
        />
      </div>
      
      {selectedCount > 0 && (
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span style={{ fontSize: '13px', color: '#64748b' }}>
            {selectedCount} seçili
          </span>
          <button onClick={onBulkApprove} style={styles.btn('success')}>
            <FaCheck style={{ marginRight: '4px' }} /> Onayla
          </button>
          <button onClick={onBulkReject} style={styles.btn('danger')}>
            <FaTimes style={{ marginRight: '4px' }} /> Reddet
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductFilterBar;
