import { useState, useMemo, useCallback, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '../../../components/common/Toast';
import apiClient from '@lib/apiClient';

/**
 * Custom hook for vendor category selection management
 * Handles category tree data, selection state, and save operations
 */
export const useVendorCategories = () => {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();
  
  // Search and filter state
  const [searchQuery, setSearchQuery] = useState('');
  
  // Expanded categories for tree view
  const [expandedCategories, setExpandedCategories] = useState(new Set());
  
  // Selected category IDs
  const [selectedIds, setSelectedIds] = useState(new Set());
  
  // Track if user has made changes
  const [hasChanges, setHasChanges] = useState(false);

  // Fetch category tree
  const { 
    data: categoryTree = [], 
    isLoading: isLoadingTree,
    error: treeError 
  } = useQuery({
    queryKey: ['vendorCategoryTree'],
    queryFn: async () => {
      const response = await apiClient.get(`${BACKEND_URL}/api/v1/categories/tree`);
      return response.data.data || [];
    }
  });

  // Fetch user's selected categories
  const { 
    data: myCategories = [],
    isLoading: isLoadingMy 
  } = useQuery({
    queryKey: ['mySelectedCategories'],
    queryFn: async () => {
      const token = localStorage.getItem('vendor_token');
      const response = await apiClient.get(`${BACKEND_URL}/api/v1/vendor/my-categories`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data.data?.categories || [];
    }
  });

  // Initialize selected IDs from fetched data
  useEffect(() => {
    if (myCategories.length > 0) {
      setSelectedIds(new Set(myCategories.map(c => c.id)));
    }
  }, [myCategories]);

  // Save mutation
  const saveMutation = useMutation({
    mutationFn: async (categoryIds) => {
      const token = localStorage.getItem('vendor_token');
      const response = await apiClient.put(
        `${BACKEND_URL}/api/v1/vendor/my-categories`,
        { category_ids: categoryIds },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    },
    onSuccess: () => {
      showSuccess('Kategoriler başarıyla kaydedildi!');
      queryClient.invalidateQueries(['mySelectedCategories']);
      setHasChanges(false);
    },
    onError: (error) => {
      showError(error.response?.data?.message || 'Kategoriler kaydedilemedi');
    }
  });

  // Toggle category selection
  const toggleCategory = useCallback((categoryId) => {
    setSelectedIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
    setHasChanges(true);
  }, []);

  // Toggle category expansion in tree
  const toggleExpand = useCallback((categoryId) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  }, []);

  // Get all category IDs from tree (for expand/collapse all)
  const getAllCategoryIds = useCallback((categories) => {
    let ids = [];
    categories.forEach(cat => {
      ids.push(cat.id);
      if (cat.children?.length > 0) {
        ids = ids.concat(getAllCategoryIds(cat.children));
      }
    });
    return ids;
  }, []);

  // Expand all categories
  const expandAll = useCallback(() => {
    const allIds = getAllCategoryIds(categoryTree);
    setExpandedCategories(new Set(allIds));
  }, [categoryTree, getAllCategoryIds]);

  // Collapse all categories
  const collapseAll = useCallback(() => {
    setExpandedCategories(new Set());
  }, []);

  // Filter categories by search query
  const filterCategories = useCallback((categories, query) => {
    if (!query.trim()) return categories;
    
    const lowerQuery = query.toLowerCase();
    
    return categories.reduce((acc, category) => {
      const matchesName = category.name?.toLowerCase().includes(lowerQuery);
      const filteredChildren = category.children?.length > 0 
        ? filterCategories(category.children, query) 
        : [];
      
      if (matchesName || filteredChildren.length > 0) {
        acc.push({
          ...category,
          children: filteredChildren
        });
      }
      
      return acc;
    }, []);
  }, []);

  // Filtered category tree
  const filteredTree = useMemo(() => {
    return filterCategories(categoryTree, searchQuery);
  }, [categoryTree, searchQuery, filterCategories]);

  // Handle save
  const handleSave = useCallback(() => {
    saveMutation.mutate(Array.from(selectedIds));
  }, [selectedIds, saveMutation]);

  // Calculate statistics
  const stats = useMemo(() => {
    const countAll = (cats) => {
      let count = 0;
      cats.forEach(cat => {
        count++;
        if (cat.children?.length > 0) {
          count += countAll(cat.children);
        }
      });
      return count;
    };

    return {
      totalCategories: countAll(categoryTree),
      selectedCount: selectedIds.size,
      expandedCount: expandedCategories.size
    };
  }, [categoryTree, selectedIds, expandedCategories]);

  // Loading state
  const isLoading = isLoadingTree || isLoadingMy;

  return {
    // State
    searchQuery,
    setSearchQuery,
    expandedCategories,
    selectedIds,
    hasChanges,
    
    // Data
    categoryTree,
    filteredTree,
    myCategories,
    stats,
    
    // Loading & Error states
    isLoading,
    isSaving: saveMutation.isPending,
    treeError,
    
    // Actions
    toggleCategory,
    toggleExpand,
    expandAll,
    collapseAll,
    handleSave
  };
};

export default useVendorCategories;
