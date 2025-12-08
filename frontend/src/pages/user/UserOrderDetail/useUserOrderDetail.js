// src/pages/user/UserOrderDetail/useUserOrderDetail.js
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { 
  FiPackage, 
  FiTruck, 
  FiCheckCircle, 
  FiXCircle, 
  FiClock
} from 'react-icons/fi';
import { getOrder, cancelOrder } from '../../../features/checkout/api/checkoutApi';
import { useToast } from '../../../components/common/Toast';

export const useUserOrderDetail = (orderNumber) => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['order', orderNumber],
    queryFn: () => getOrder(orderNumber),
    enabled: !!orderNumber,
  });

  const order = data?.data?.order;

  const cancelMutation = useMutation({
    mutationFn: (orderNum) => cancelOrder(orderNum),
    onSuccess: () => {
      showToast('Sipariş başarıyla iptal edildi', 'success');
      queryClient.invalidateQueries({ queryKey: ['order', orderNumber] });
      queryClient.invalidateQueries({ queryKey: ['userOrders'] });
    },
    onError: (error) => {
      showToast(
        error.response?.data?.message || 'Sipariş iptal edilirken bir hata oluştu',
        'error'
      );
    }
  });

  const formatPrice = (price) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusConfig = (status) => {
    const configs = {
      pending: {
        label: 'Beklemede',
        icon: FiClock,
        color: '#d97706',
        bg: '#fef3c7'
      },
      confirmed: {
        label: 'Onaylandı',
        icon: FiCheckCircle,
        color: '#059669',
        bg: '#d1fae5'
      },
      processing: {
        label: 'Hazırlanıyor',
        icon: FiPackage,
        color: '#2563eb',
        bg: '#dbeafe'
      },
      shipped: {
        label: 'Kargoda',
        icon: FiTruck,
        color: '#9333ea',
        bg: '#f3e8ff'
      },
      delivered: {
        label: 'Teslim Edildi',
        icon: FiCheckCircle,
        color: '#16a34a',
        bg: '#dcfce7'
      },
      cancelled: {
        label: 'İptal Edildi',
        icon: FiXCircle,
        color: '#dc2626',
        bg: '#fee2e2'
      },
      returned: {
        label: 'İade Edildi',
        icon: FiXCircle,
        color: '#f59e0b',
        bg: '#fef3c7'
      }
    };
    return configs[status] || configs.pending;
  };

  const getPaymentStatusConfig = (status) => {
    const configs = {
      pending: {
        label: 'Ödeme Bekliyor',
        color: '#d97706',
        bg: '#fef3c7'
      },
      processing: {
        label: 'Ödeme İşleniyor',
        color: '#2563eb',
        bg: '#dbeafe'
      },
      paid: {
        label: 'Ödendi',
        color: '#16a34a',
        bg: '#dcfce7'
      },
      failed: {
        label: 'Ödeme Başarısız',
        color: '#dc2626',
        bg: '#fee2e2'
      },
      refunded: {
        label: 'İade Edildi',
        color: '#4b5563',
        bg: '#f3f4f6'
      }
    };
    return configs[status] || configs.pending;
  };

  const handleCancelOrder = async (orderNum) => {
    if (window.confirm('Siparişi iptal etmek istediğinizden emin misiniz?')) {
      await cancelMutation.mutateAsync(orderNum);
    }
  };

  return {
    order,
    isLoading,
    error,
    isCancelling: cancelMutation.isPending,
    formatPrice,
    formatDate,
    getStatusConfig,
    getPaymentStatusConfig,
    handleCancelOrder
  };
};
