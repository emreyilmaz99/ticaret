import React from 'react';
import { FaSpinner, FaFolderOpen } from 'react-icons/fa';
import CategoryItem from './CategoryItem';
import { styles } from '../styles';

/**
 * Category tree list component
 * Renders the category tree with loading and empty states
 */
const CategoryList = ({ 
  categories, 
  isLoading,
  expandedCategories, 
  selectedIds,
  onToggleExpand, 
  onToggleSelect 
}) => {
  if (isLoading) {
    return (
      <div style={styles.loadingContainer}>
        <FaSpinner style={styles.loadingSpinner} />
        <span>Kategoriler yükleniyor...</span>
      </div>
    );
  }

  if (!categories || categories.length === 0) {
    return (
      <div style={styles.emptyContainer}>
        <FaFolderOpen style={styles.emptyIcon} />
        <h3 style={styles.emptyTitle}>Kategori Bulunamadı</h3>
        <p style={styles.emptyText}>
          Arama kriterlerinize uygun kategori bulunamadı.
        </p>
      </div>
    );
  }

  return (
    <div style={styles.categoryList}>
      {categories.map(category => (
        <CategoryItem
          key={category.id}
          category={category}
          level={0}
          expandedCategories={expandedCategories}
          selectedIds={selectedIds}
          onToggleExpand={onToggleExpand}
          onToggleSelect={onToggleSelect}
        />
      ))}
    </div>
  );
};

export default CategoryList;
