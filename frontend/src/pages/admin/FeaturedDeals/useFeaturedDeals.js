import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '../../../components/common/Toast';
import apiClient from '@lib/apiClient';

const BACKEND_URL = 'http://127.0.0.1:8000';

export const useFeaturedDeals = () => {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' or 'edit'
  const [selectedDeal, setSelectedDeal] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all'); // all, active, expired, upcoming, inactive
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null); // For delete confirmation modal
  const [togglingId, setTogglingId] = useState(null); // Track which deal is being toggled
  const [deletingId, setDeletingId] = useState(null); // Track which deal is being deleted
  const ITEMS_PER_PAGE = 4;

  // Fetch deals
  const { 
    data: dealsData, 
    isLoading,
    error,
    refetch: refetchDeals
  } = useQuery({
    queryKey: ['featuredDeals', filterStatus],
    queryFn: async () => {
      const token = localStorage.getItem('admin_token');
      const params = filterStatus !== 'all' ? `?status=${filterStatus}` : '';
      const response = await apiClient.get(
        `${BACKEND_URL}/api/v1/admin/featured-deals${params}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data.data;
    }
  });

  // Fetch products for dropdown
  const { data: productsData } = useQuery({
    queryKey: ['productsForDeals'],
    queryFn: async () => {
      const token = localStorage.getItem('admin_token');
      const response = await apiClient.get(
        `${BACKEND_URL}/api/v1/admin/featured-deals/create`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data.data;
    },
    enabled: isModalOpen // Only fetch when modal is open
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: async (data) => {
      const token = localStorage.getItem('admin_token');
      const response = await apiClient.post(
        `${BACKEND_URL}/api/v1/admin/featured-deals`,
        data,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    },
    onSuccess: async () => {
      showSuccess('✅ Öne çıkan ürün başarıyla oluşturuldu!');
      await queryClient.invalidateQueries({ queryKey: ['featuredDeals'] });
      await refetchDeals();
      closeModal();
    },
    onError: (error) => {
      showError('❌ ' + (error.response?.data?.message || 'Oluşturma işlemi başarısız!'));
    }
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }) => {
      const token = localStorage.getItem('admin_token');
      const response = await apiClient.put(
        `${BACKEND_URL}/api/v1/admin/featured-deals/${id}`,
        data,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    },
    onSuccess: async () => {
      showSuccess('✅ Öne çıkan ürün başarıyla güncellendi!');
      await queryClient.invalidateQueries({ queryKey: ['featuredDeals'] });
      await refetchDeals();
      closeModal();
    },
    onError: (error) => {
      showError('❌ ' + (error.response?.data?.message || 'Güncelleme işlemi başarısız!'));
    }
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      setDeletingId(id);
      const token = localStorage.getItem('admin_token');
      await apiClient.delete(
        `${BACKEND_URL}/api/v1/admin/featured-deals/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
    },
    onSuccess: async () => {
      showSuccess('🗑️ Öne çıkan ürün başarıyla silindi!');
      await queryClient.invalidateQueries({ queryKey: ['featuredDeals'] });
      await refetchDeals();
      setDeletingId(null);
    },
    onError: (error) => {
      showError('❌ ' + (error.response?.data?.message || 'Silme işlemi başarısız!'));
      setDeletingId(null);
    }
  });

  // Toggle active mutation
  const toggleMutation = useMutation({
    mutationFn: async (id) => {
      setTogglingId(id);
      const token = localStorage.getItem('admin_token');
      const response = await apiClient.post(
        `${BACKEND_URL}/api/v1/admin/featured-deals/${id}/toggle`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    },
    onSuccess: async (data) => {
      const status = data?.data?.is_active ? 'aktif' : 'pasif';
      showSuccess(`🔄 Ürün durumu ${status} olarak güncellendi!`);
      await queryClient.invalidateQueries({ queryKey: ['featuredDeals'] });
      await refetchDeals();
      setTogglingId(null);
    },
    onError: (error) => {
      showError('❌ ' + (error.response?.data?.message || 'Durum değiştirme işlemi başarısız!'));
      setTogglingId(null);
    }
  });

  // Reorder mutation
  const reorderMutation = useMutation({
    mutationFn: async (deals) => {
      const token = localStorage.getItem('admin_token');
      const response = await apiClient.post(
        `${BACKEND_URL}/api/v1/admin/featured-deals/reorder`,
        { deals },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    },
    onSuccess: async () => {
      showSuccess('📋 Sıralama başarıyla güncellendi!');
      await queryClient.invalidateQueries({ queryKey: ['featuredDeals'] });
      await refetchDeals();
    },
    onError: (error) => {
      showError('❌ ' + (error.response?.data?.message || 'Sıralama güncellenemedi!'));
    }
  });

  // Modal actions
  const openCreateModal = () => {
    setModalMode('create');
    setSelectedDeal(null);
    setIsModalOpen(true);
  };

  const openEditModal = (deal) => {
    setModalMode('edit');
    setSelectedDeal(deal);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedDeal(null);
  };

  // Submit handler
  const handleSubmit = (formData) => {
    if (modalMode === 'create') {
      createMutation.mutate(formData);
    } else {
      updateMutation.mutate({ id: selectedDeal.id, data: formData });
    }
  };

  // Delete handler - shows confirmation
  const handleDelete = (id) => {
    setDeleteConfirmId(id);
  };

  // Confirm delete
  const confirmDelete = () => {
    if (deleteConfirmId) {
      deleteMutation.mutate(deleteConfirmId);
      setDeleteConfirmId(null);
    }
  };

  // Cancel delete
  const cancelDelete = () => {
    setDeleteConfirmId(null);
  };

  // Toggle handler
  const handleToggle = (id) => {
    toggleMutation.mutate(id);
  };

  // Reorder handler
  const handleReorder = (deals) => {
    reorderMutation.mutate(deals);
  };

  // Pagination
  const allDeals = dealsData?.deals || [];
  const totalPages = Math.ceil(allDeals.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedDeals = allDeals.slice(startIndex, endIndex);

  // Reset to page 1 when filter changes
  const handleFilterChange = (newFilter) => {
    setFilterStatus(newFilter);
    setCurrentPage(1);
  };

  return {
    // Data
    deals: paginatedDeals,
    stats: dealsData?.stats || {},
    products: productsData?.products || [],
    isLoading,
    error,
    refetchDeals,
    
    // Filter
    filterStatus,
    setFilterStatus: handleFilterChange,
    
    // Pagination
    currentPage,
    totalPages,
    setCurrentPage,
    totalDeals: allDeals.length,
    
    // Modal
    isModalOpen,
    modalMode,
    selectedDeal,
    openCreateModal,
    openEditModal,
    closeModal,
    
    // Delete confirmation
    deleteConfirmId,
    confirmDelete,
    cancelDelete,
    
    // Actions
    handleSubmit,
    handleDelete,
    handleToggle,
    handleReorder,
    
    // Mutation states
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isToggling: toggleMutation.isPending,
    isReordering: reorderMutation.isPending,
    togglingId,
    deletingId,
  };
};
