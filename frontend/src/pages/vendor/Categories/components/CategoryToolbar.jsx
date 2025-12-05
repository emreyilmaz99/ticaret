import React from 'react';
import { FaSearch, FaExpandAlt, FaCompressAlt } from 'react-icons/fa';
import { styles } from '../styles';

/**
 * Toolbar with search and expand/collapse controls
 */
const CategoryToolbar = ({ 
  searchQuery, 
  setSearchQuery, 
  onExpandAll, 
  onCollapseAll 
}) => {
  return (
    <div style={styles.toolbar}>
      <div style={styles.searchContainer}>
        <FaSearch style={styles.searchIcon} />
        <input
          type="text"
          placeholder="Kategori ara..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={styles.searchInput}
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            style={styles.clearButton}
          >
            ✕
          </button>
        )}
      </div>
      
      <div style={styles.toolbarActions}>
        <button 
          onClick={onExpandAll} 
          style={styles.toolbarButton}
          title="Tümünü Aç"
        >
          <FaExpandAlt style={styles.buttonIcon} />
          Tümünü Aç
        </button>
        <button 
          onClick={onCollapseAll} 
          style={styles.toolbarButton}
          title="Tümünü Kapat"
        >
          <FaCompressAlt style={styles.buttonIcon} />
          Tümünü Kapat
        </button>
      </div>
    </div>
  );
};

export default CategoryToolbar;
