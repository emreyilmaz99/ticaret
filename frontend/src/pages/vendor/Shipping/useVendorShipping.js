import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '../../../components/common/Toast';
import apiClient from '@lib/apiClient';

/**
 * Custom hook for vendor shipping settings
 * Handles form state, API operations, and defaults
 */
export const useVendorShipping = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const toast = useToast();

  // Form state
  const [form, setForm] = useState({
    shipping_cost: 29.90,
    free_shipping_threshold: 300.00,
    is_shipping_enabled: true
  });

  // Default values
  const [defaults, setDefaults] = useState({
    shipping_cost: 29.90,
    free_shipping_threshold: 300.00
  });

  // Auth check
  useEffect(() => {
    const token = localStorage.getItem('vendor_token');
    if (!token) {
      navigate('/vendor/login');
    }
  }, [navigate]);

  // Fetch shipping settings
  const { data: settingsData, isLoading } = useQuery({
    queryKey: ['vendor', 'shipping-settings'],
    queryFn: async () => {
      const res = await apiClient.get('/v1/vendor/shipping-settings');
      return res.data;
    }
  });

  // Update form when settings loaded
  useEffect(() => {
    if (settingsData?.data) {
      setForm({
        shipping_cost: settingsData.data.shipping_cost,
        free_shipping_threshold: settingsData.data.free_shipping_threshold,
        is_shipping_enabled: settingsData.data.is_shipping_enabled
      });
    }
    if (settingsData?.defaults) {
      setDefaults(settingsData.defaults);
    }
  }, [settingsData]);

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async (data) => {
      const res = await apiClient.put('/v1/vendor/shipping-settings', data);
      return res.data;
    },
    onSuccess: (data) => {
      toast.success('Başarılı', data.message || 'Kargo ayarları kaydedildi');
      queryClient.invalidateQueries({ queryKey: ['vendor', 'shipping-settings'] });
    },
    onError: (err) => {
      toast.error('Hata', err.response?.data?.message || 'Kaydetme başarısız');
    }
  });

  // Form submit handler
  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    updateMutation.mutate(form);
  }, [form, updateMutation]);

  // Input change handler
  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: parseFloat(value) || 0
    }));
  }, []);

  // Toggle shipping enabled
  const toggleShipping = useCallback(() => {
    setForm(prev => ({
      ...prev,
      is_shipping_enabled: !prev.is_shipping_enabled
    }));
  }, []);

  // Reset to defaults
  const resetToDefaults = useCallback(() => {
    setForm(prev => ({
      ...prev,
      shipping_cost: defaults.shipping_cost,
      free_shipping_threshold: defaults.free_shipping_threshold
    }));
    toast.success('Bilgi', 'Varsayılan değerler yüklendi');
  }, [defaults, toast]);

  // Calculate preview values
  const getPreviewValues = useCallback(() => {
    const testAmount = 100;
    const isTestFree = !form.is_shipping_enabled || testAmount >= form.free_shipping_threshold;
    
    return {
      testAmount,
      isTestFree,
      shippingCost: form.shipping_cost,
      freeThreshold: form.free_shipping_threshold
    };
  }, [form]);

  return {
    // State
    form,
    defaults,
    
    // Loading states
    isLoading,
    isSaving: updateMutation.isPending,
    
    // Computed
    previewValues: getPreviewValues(),
    
    // Actions
    handleSubmit,
    handleInputChange,
    toggleShipping,
    resetToDefaults
  };
};

export default useVendorShipping;
