// src/pages/admin/Categories/CategoryTree.jsx
import React from 'react';
import CategoryTreeItem from './CategoryTreeItem';

/**
 * Kategori ağaç görünümü container
 */
const CategoryTree = ({ 
  categories,
  loading,
  searchTerm,
  expandedCategories,
  toggleExpand,
  openCreateModal,
  openEditModal,
  confirmDelete,
  styles 
}) => {
  if (loading) {
    return (
      <div style={styles.treeContainer}>
        <div style={styles.loadingState}>Yükleniyor...</div>
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div style={styles.treeContainer}>
        <div style={styles.emptyState}>
          {searchTerm ? 'Sonuç bulunamadı.' : 'Henüz kategori eklenmemiş.'}
        </div>
      </div>
    );
  }

  return (
    <div style={styles.treeContainer}>
      {categories.map(category => (
        <CategoryTreeItem
          key={category.id}
          category={category}
          expandedCategories={expandedCategories}
          toggleExpand={toggleExpand}
          openCreateModal={openCreateModal}
          openEditModal={openEditModal}
          confirmDelete={confirmDelete}
          styles={styles}
        />
      ))}
    </div>
  );
};

export default CategoryTree;
