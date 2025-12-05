// src/pages/admin/Categories/CategoryToolbar.jsx
import React from 'react';
import { FaSearch, FaChevronDown, FaChevronRight } from 'react-icons/fa';

/**
 * Arama ve genişletme kontrolleri
 */
const CategoryToolbar = ({ 
  searchTerm, 
  setSearchTerm, 
  expandAll, 
  collapseAll, 
  styles 
}) => {
  return (
    <div style={styles.toolbar}>
      <div style={{ position: 'relative' }}>
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
          placeholder="Kategori ara..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={styles.searchInput}
        />
      </div>
      <div style={{ display: 'flex', gap: '8px' }}>
        <button onClick={expandAll} style={styles.btnSecondary}>
          <FaChevronDown size={12} style={{ marginRight: '6px' }} /> Tümünü Aç
        </button>
        <button onClick={collapseAll} style={styles.btnSecondary}>
          <FaChevronRight size={12} style={{ marginRight: '6px' }} /> Tümünü Kapat
        </button>
      </div>
    </div>
  );
};

export default CategoryToolbar;
