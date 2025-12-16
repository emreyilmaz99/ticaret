import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '../../../components/common/Toast';
import { exportToExcel, printData } from '../../../features/admin/shared';
import apiClient from '@lib/apiClient';

export const useAdminOrders = () => {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [minAmount, setMinAmount] = useState('');
  const [maxAmount, setMaxAmount] = useState('');

  // Build query params
  const buildQueryParams = () => {
    const params = new URLSearchParams();
    if (searchTerm) params.append('search', searchTerm);
    if (statusFilter !== 'all') params.append('status', statusFilter);
    if (minAmount) params.append('min_amount', minAmount);
    if (maxAmount) params.append('max_amount', maxAmount);
    return params.toString();
  };

  // Fetch orders
  const { 
    data: ordersData = { orders: [], total: 0 }, 
    isLoading: isLoadingOrders,
    error: ordersError
  } = useQuery({
    queryKey: ['adminOrders', searchTerm, statusFilter, minAmount, maxAmount],
    queryFn: async () => {
      const queryString = buildQueryParams();
      const response = await apiClient.get(
        `/v1/admin/orders${queryString ? '?' + queryString : ''}`
      );
      return response.data.data;
    }
  });

  // Fetch stats
  const { 
    data: statsData = { stats: [] },
    isLoading: isLoadingStats
  } = useQuery({
    queryKey: ['adminOrderStats'],
    queryFn: async () => {
      const response = await apiClient.get('/v1/admin/orders/stats');
      return response.data.data;
    }
  });

  // Update status mutation
  const updateStatusMutation = useMutation({
    mutationFn: async ({ orderId, status }) => {
      const response = await apiClient.put(
        `/v1/admin/orders/${orderId}/status`,
        { status }
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminOrders'] });
      queryClient.invalidateQueries({ queryKey: ['adminOrderStats'] });
      showSuccess('Sipariş durumu güncellendi');
    },
    onError: (error) => {
      showError(error.response?.data?.message || 'Durum güncellenemedi');
    }
  });

  // Cancel order mutation
  const cancelOrderMutation = useMutation({
    mutationFn: async ({ orderId, reason }) => {
      const response = await apiClient.post(
        `/v1/admin/orders/${orderId}/cancel`,
        { reason }
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminOrders'] });
      queryClient.invalidateQueries({ queryKey: ['adminOrderStats'] });
      showSuccess('Sipariş iptal edildi');
    },
    onError: (error) => {
      showError(error.response?.data?.message || 'Sipariş iptal edilemedi');
    }
  });

  // Helper functions
  const updateOrderStatus = (orderId, newStatus) => {
    updateStatusMutation.mutate({ orderId, status: newStatus });
  };

  const cancelOrder = ({ orderId, reason }) => {
    cancelOrderMutation.mutate({ orderId, reason });
  };

  // Export to Excel using shared utility
  const handleExportExcel = () => {
    const columns = [
      { key: 'order_number', label: 'Sipariş No' },
      { key: 'customer_name', label: 'Müşteri', format: (val, item) => item.user?.name || '-' },
      { key: 'total_amount', label: 'Tutar', format: (val) => `${val} ₺` },
      { key: 'status', label: 'Durum' },
      { key: 'created_at', label: 'Tarih', format: (val) => new Date(val).toLocaleDateString('tr-TR') },
    ];
    exportToExcel(ordersData.orders, 'siparisler', columns);
  };

  // Print using shared utility
  const handlePrint = () => {
    const columns = [
      { key: 'order_number', label: 'Sipariş No' },
      { key: 'customer_name', label: 'Müşteri', format: (val, item) => item.user?.name || '-' },
      { key: 'total_amount', label: 'Tutar', format: (val) => `${val} ₺` },
      { key: 'status', label: 'Durum' },
      { key: 'created_at', label: 'Tarih', format: (val) => new Date(val).toLocaleDateString('tr-TR') },
    ];
    printData(ordersData.orders, 'Sipariş Listesi', columns);
  };

  return {
    // Data
    orders: ordersData.orders || [],
    stats: statsData.stats || [],
    
    // Loading states
    isLoadingOrders,
    isLoadingStats,
    
    // Filters
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    minAmount,
    setMinAmount,
    maxAmount,
    setMaxAmount,
    
    // Actions
    updateOrderStatus,
    cancelOrder,
    handleExportExcel,
    handlePrint,
    
    // Error
    error: ordersError
  };
};
