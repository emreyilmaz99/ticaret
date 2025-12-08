// src/pages/admin/Categories/useCategoriesPage.js
import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getCategoryTree, 
  getCategoryStatistics, 
  createCategory, 
  updateCategory, 
  deleteCategory 
} from '../../../features/admin/api/categoryApi';
import { useToast } from '../../../components/common/Toast';
import { toFullUrl } from './styles';

/**
 * Categories sayfası için custom hook
 * Tüm state yönetimi ve iş mantığını içerir
 */
const useCategoriesPage = () => {
  const toast = useToast();
  const queryClient = useQueryClient();
  
  // UI State
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCategories, setExpandedCategories] = useState({});
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // create | edit
  const [selectedCategory, setSelectedCategory] = useState(null);
  
  // Delete Confirm State
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    parent_id: '',
    icon: '',
    description: '',
    is_active: true,
    sort_order: 0,
    image: null
  });
  const [imagePreview, setImagePreview] = useState(null);

  // Queries
  const { data: treeData, isLoading: treeLoading } = useQuery({
    queryKey: ['adminCategoryTree'],
    queryFn: getCategoryTree
  });

  const { data: statsData } = useQuery({
    queryKey: ['adminCategoryStats'],
    queryFn: getCategoryStatistics
  });

  const categoryTree = treeData?.data || [];
  const stats = statsData?.data || {};

  // Mutations
  const createMutation = useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries(['adminCategoryTree']);
      queryClient.invalidateQueries(['adminCategories']);
      queryClient.invalidateQueries(['adminCategoryStats']);
      closeModal();
      toast.success('Başarılı', 'Kategori başarıyla oluşturuldu.');
    },
    onError: (err) => {
      toast.error('Hata', err.response?.data?.message || 'Kategori oluşturulamadı.');
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updateCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['adminCategoryTree']);
      queryClient.invalidateQueries(['adminCategories']);
      queryClient.invalidateQueries(['adminCategoryStats']);
      closeModal();
      toast.success('Başarılı', 'Kategori başarıyla güncellendi.');
    },
    onError: (err) => {
      toast.error('Hata', err.response?.data?.message || 'Kategori güncellenemedi.');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries(['adminCategoryTree']);
      queryClient.invalidateQueries(['adminCategories']);
      queryClient.invalidateQueries(['adminCategoryStats']);
      setDeleteConfirmOpen(false);
      setCategoryToDelete(null);
      toast.success('Başarılı', 'Kategori başarıyla silindi.');
    },
    onError: (err) => {
      toast.error('Hata', err.response?.data?.message || 'Kategori silinemedi.');
    }
  });

  // Tree Helpers
  const toggleExpand = useCallback((categoryId) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  }, []);

  const expandAll = useCallback(() => {
    const allExpanded = {};
    const setAllExpanded = (cats) => {
      cats.forEach(cat => {
        allExpanded[cat.id] = true;
        if (cat.children?.length > 0) {
          setAllExpanded(cat.children);
        }
      });
    };
    setAllExpanded(categoryTree);
    setExpandedCategories(allExpanded);
  }, [categoryTree]);

  const collapseAll = useCallback(() => {
    setExpandedCategories({});
  }, []);

  // Modal Handlers
  const openCreateModal = useCallback((parentId = null) => {
    setModalMode('create');
    setFormData({
      name: '',
      parent_id: parentId || '',
      icon: '',
      description: '',
      is_active: true,
      sort_order: 0,
      image: null
    });
    setImagePreview(null);
    setSelectedCategory(null);
    setIsModalOpen(true);
  }, []);

  const openEditModal = useCallback((category) => {
    setModalMode('edit');
    setSelectedCategory(category);
    setFormData({
      name: category.name || '',
      parent_id: category.parent_id || '',
      icon: category.icon || '',
      description: category.description || '',
      is_active: category.is_active ?? true,
      sort_order: category.sort_order || 0,
      image: null
    });
    setImagePreview(category.image ? toFullUrl(category.image) : null);
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedCategory(null);
    setFormData({
      name: '',
      parent_id: '',
      icon: '',
      description: '',
      is_active: true,
      sort_order: 0,
      image: null
    });
    setImagePreview(null);
  }, []);

  // Form Handlers
  const handleImageChange = useCallback((e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.warning('Uyarı', 'Görsel 2MB\'dan küçük olmalıdır.');
        return;
      }
      setFormData(prev => ({ ...prev, image: file }));
      setImagePreview(URL.createObjectURL(file));
    }
  }, [toast]);

  const handleFormChange = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.warning('Uyarı', 'Kategori adı zorunludur.');
      return;
    }

    const fd = new FormData();
    fd.append('name', formData.name);
    if (formData.parent_id) fd.append('parent_id', formData.parent_id);
    if (formData.icon) fd.append('icon', formData.icon);
    if (formData.description) fd.append('description', formData.description);
    fd.append('is_active', formData.is_active ? '1' : '0');
    fd.append('sort_order', formData.sort_order);
    if (formData.image) fd.append('image', formData.image);

    if (modalMode === 'create') {
      createMutation.mutate(fd);
    } else {
      updateMutation.mutate({ id: selectedCategory.id, data: fd });
    }
  }, [formData, modalMode, selectedCategory, createMutation, updateMutation, toast]);

  // Delete Handlers
  const confirmDelete = useCallback((category) => {
    setCategoryToDelete(category);
    setDeleteConfirmOpen(true);
  }, []);

  const handleDelete = useCallback(() => {
    if (categoryToDelete) {
      deleteMutation.mutate(categoryToDelete.id);
    }
  }, [categoryToDelete, deleteMutation]);

  const cancelDelete = useCallback(() => {
    setDeleteConfirmOpen(false);
    setCategoryToDelete(null);
  }, []);

  // Parent Options Helper
  const getParentOptions = useCallback(() => {
    const options = [{ id: '', name: 'Ana Kategori (Üst kategori yok)' }];
    
    const addOptions = (cats, level = 0) => {
      cats.forEach(cat => {
        if (selectedCategory && cat.id === selectedCategory.id) return;
        
        options.push({
          id: cat.id,
          name: `${'—'.repeat(level)} ${cat.name}`,
          level
        });
        
        if (cat.children?.length > 0 && level < 1) {
          addOptions(cat.children, level + 1);
        }
      });
    };
    
    addOptions(categoryTree);
    return options;
  }, [categoryTree, selectedCategory]);

  // Filter Categories
  const filterCategories = useCallback((cats) => {
    if (!searchTerm) return cats;
    
    const search = searchTerm.toLowerCase();
    
    const filterRecursive = (categories) => {
      return categories.reduce((acc, cat) => {
        const matches = cat.name.toLowerCase().includes(search);
        const filteredChildren = cat.children ? filterRecursive(cat.children) : [];
        
        if (matches || filteredChildren.length > 0) {
          acc.push({
            ...cat,
            children: filteredChildren.length > 0 ? filteredChildren : cat.children
          });
        }
        
        return acc;
      }, []);
    };
    
    return filterRecursive(cats);
  }, [searchTerm]);

  const filteredTree = filterCategories(categoryTree);

  return {
    // Data
    categoryTree,
    filteredTree,
    stats,
    treeLoading,
    
    // UI State
    searchTerm,
    setSearchTerm,
    expandedCategories,
    isMobile,
    
    // Tree Actions
    toggleExpand,
    expandAll,
    collapseAll,
    
    // Modal State
    isModalOpen,
    modalMode,
    selectedCategory,
    
    // Modal Actions
    openCreateModal,
    openEditModal,
    closeModal,
    
    // Form
    formData,
    imagePreview,
    handleFormChange,
    handleImageChange,
    handleSubmit,
    getParentOptions,
    
    // Delete
    deleteConfirmOpen,
    categoryToDelete,
    confirmDelete,
    handleDelete,
    cancelDelete,
    
    // Mutation States
    isCreating: createMutation.isLoading,
    isUpdating: updateMutation.isLoading,
    isDeleting: deleteMutation.isLoading
  };
};

export default useCategoriesPage;
