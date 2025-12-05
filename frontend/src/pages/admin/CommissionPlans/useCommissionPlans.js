// src/pages/admin/CommissionPlans/useCommissionPlans.js
import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getCommissionPlans, 
  createCommissionPlan, 
  updateCommissionPlan, 
  deleteCommissionPlan,
  setDefaultCommissionPlan,
  toggleActiveCommissionPlan
} from '../../../features/commission/api/commissionApi';

/**
 * Commission Plans sayfası için custom hook
 */
const useCommissionPlans = () => {
  const queryClient = useQueryClient();
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  
  // Toast State
  const [toast, setToast] = useState(null);
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    rate: '',
    description: '',
    is_active: true
  });

  // Toast helper
  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
  }, []);

  const clearToast = useCallback(() => {
    setToast(null);
  }, []);

  // Query
  const { data, isLoading, error } = useQuery({
    queryKey: ['commissionPlans'],
    queryFn: async () => {
      const res = await getCommissionPlans();
      return res.data;
    }
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: createCommissionPlan,
    onSuccess: () => {
      queryClient.invalidateQueries(['commissionPlans']);
      closeModal();
      showToast('Plan başarıyla oluşturuldu.');
    },
    onError: (err) => showToast('Hata: ' + err.message, 'error')
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updateCommissionPlan(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['commissionPlans']);
      closeModal();
      showToast('Plan güncellendi.');
    },
    onError: (err) => showToast('Hata: ' + err.message, 'error')
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCommissionPlan,
    onSuccess: () => {
      queryClient.invalidateQueries(['commissionPlans']);
      showToast('Plan silindi.');
    },
    onError: (err) => showToast('Hata: ' + err.message, 'error')
  });

  const defaultMutation = useMutation({
    mutationFn: setDefaultCommissionPlan,
    onSuccess: () => {
      queryClient.invalidateQueries(['commissionPlans']);
      showToast('Varsayılan plan güncellendi.');
    },
    onError: (err) => showToast('Hata: ' + err.message, 'error')
  });

  const toggleActiveMutation = useMutation({
    mutationFn: toggleActiveCommissionPlan,
    onSuccess: () => {
      queryClient.invalidateQueries(['commissionPlans']);
    },
    onError: (err) => showToast('Hata: ' + err.message, 'error')
  });

  // Modal Handlers
  const openCreateModal = useCallback(() => {
    setEditingPlan(null);
    setFormData({ name: '', rate: '', description: '', is_active: true });
    setIsModalOpen(true);
  }, []);

  const openEditModal = useCallback((plan) => {
    setEditingPlan(plan);
    setFormData({
      name: plan.name,
      rate: plan.rate,
      description: plan.description || '',
      is_active: plan.is_active
    });
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setEditingPlan(null);
  }, []);

  // Form Handler
  const handleFormChange = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    if (editingPlan) {
      updateMutation.mutate({ id: editingPlan.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  }, [editingPlan, formData, updateMutation, createMutation]);

  // Delete Handler
  const handleDelete = useCallback((id) => {
    if (window.confirm('Bu planı silmek istediğinize emin misiniz?')) {
      deleteMutation.mutate(id);
    }
  }, [deleteMutation]);

  // Toggle & Default Handlers
  const handleToggleActive = useCallback((id) => {
    toggleActiveMutation.mutate(id);
  }, [toggleActiveMutation]);

  const handleSetDefault = useCallback((id) => {
    defaultMutation.mutate(id);
  }, [defaultMutation]);

  // Data
  const plans = data?.data?.data || [];

  return {
    // Data
    plans,
    isLoading,
    error,
    
    // Modal
    isModalOpen,
    editingPlan,
    openCreateModal,
    openEditModal,
    closeModal,
    
    // Form
    formData,
    handleFormChange,
    handleSubmit,
    
    // Actions
    handleDelete,
    handleToggleActive,
    handleSetDefault,
    
    // Toast
    toast,
    clearToast,
    
    // Mutation States
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending
  };
};

export default useCommissionPlans;
