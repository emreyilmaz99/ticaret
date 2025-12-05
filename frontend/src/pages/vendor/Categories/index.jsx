import React from 'react';
import { useVendorCategories } from './useVendorCategories';
import { styles } from './styles';
import {
  CategoryHeader,
  CategoryStats,
  CategoryToolbar,
  CategoryList,
  CategoryInfo
} from './components';

/**
 * VendorCategories - Main category management page
 * Allows vendors to select and manage product categories
 */
const VendorCategories = () => {
  const {
    // State
    searchQuery,
    setSearchQuery,
    expandedCategories,
    selectedIds,
    hasChanges,
    
    // Data
    filteredTree,
    stats,
    
    // Loading states
    isLoading,
    isSaving,
    
    // Actions
    toggleCategory,
    toggleExpand,
    expandAll,
    collapseAll,
    handleSave
  } = useVendorCategories();

  return (
    <div style={styles.container}>
      <CategoryHeader 
        hasChanges={hasChanges}
        isSaving={isSaving}
        onSave={handleSave}
      />

      <CategoryInfo />

      <CategoryStats stats={stats} />

      <div style={styles.mainCard}>
        <CategoryToolbar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onExpandAll={expandAll}
          onCollapseAll={collapseAll}
        />

        <CategoryList
          categories={filteredTree}
          isLoading={isLoading}
          expandedCategories={expandedCategories}
          selectedIds={selectedIds}
          onToggleExpand={toggleExpand}
          onToggleSelect={toggleCategory}
        />
      </div>
    </div>
  );
};

export default VendorCategories;
