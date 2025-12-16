import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '../../../components/common/Toast';
import apiClient from '@lib/apiClient';

const BACKEND_URL = 'http://127.0.0.1:8000';

export const useTaxClasses = () => {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();

  // Fetch tax classes
  const { 
    data: taxClasses = [], 
    isLoading,
    error
  } = useQuery({
    queryKey: ['taxClasses'],
    queryFn: async () => {
      const token = localStorage.getItem('admin_token');
      const response = await apiClient.get(`${BACKEND_URL}/api/v1/admin/tax-classes`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data.data.tax_classes || [];
    }
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: async (data) => {
      const token = localStorage.getItem('admin_token');
      const response = await apiClient.post(
        `${BACKEND_URL}/api/v1/admin/tax-classes`,
        data,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    },
    onSuccess: () => {
      showSuccess('Vergi sınıfı oluşturuldu');
      queryClient.invalidateQueries(['taxClasses']);
    },
    onError: (error) => {
      showError(error.response?.data?.message || 'Oluşturulamadı');
    }
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }) => {
      const token = localStorage.getItem('admin_token');
      const response = await apiClient.put(
        `${BACKEND_URL}/api/v1/admin/tax-classes/${id}`,
        data,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    },
    onSuccess: () => {
      showSuccess('Vergi sınıfı güncellendi');
      queryClient.invalidateQueries(['taxClasses']);
    },
    onError: (error) => {
      showError(error.response?.data?.message || 'Güncellenemedi');
    }
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const token = localStorage.getItem('admin_token');
      const response = await apiClient.delete(
        `${BACKEND_URL}/api/v1/admin/tax-classes/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    },
    onSuccess: () => {
      showSuccess('Vergi sınıfı silindi');
      queryClient.invalidateQueries(['taxClasses']);
    },
    onError: (error) => {
      showError(error.response?.data?.message || 'Silinemedi');
    }
  });

  const createTaxClass = (data) => {
    createMutation.mutate(data);
  };

  const updateTaxClass = (id, data) => {
    updateMutation.mutate({ id, data });
  };

  const deleteTaxClass = (id) => {
    if (window.confirm('Bu vergi sınıfını silmek istediğinize emin misiniz?')) {
      deleteMutation.mutate(id);
    }
  };

  return {
    taxClasses,
    isLoading,
    error,
    createTaxClass,
    updateTaxClass,
    deleteTaxClass,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending
  };
};
