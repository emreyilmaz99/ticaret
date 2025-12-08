// src/pages/user/UserOrders/useUserOrders.js
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  FiPackage, 
  FiTruck, 
  FiCheckCircle, 
  FiXCircle, 
  FiClock
} from 'react-icons/fi';
import { getUserOrders } from '../../../features/checkout/api/checkoutApi';

export const useUserOrders = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading, error } = useQuery({
    queryKey: ['userOrders', currentPage],
    queryFn: () => getUserOrders({ page: currentPage, per_page: 10 }),
  });

  const orders = data?.data?.orders || [];
  const pagination = data?.data?.pagination;

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
        color: '#d97706', // yellow-600
        bg: '#fef3c7'     // yellow-100
      },
      processing: {
        label: 'Hazırlanıyor',
        icon: FiPackage,
        color: '#2563eb', // blue-600
        bg: '#dbeafe'     // blue-100
      },
      shipped: {
        label: 'Kargoda',
        icon: FiTruck,
        color: '#9333ea', // purple-600
        bg: '#f3e8ff'     // purple-100
      },
      delivered: {
        label: 'Teslim Edildi',
        icon: FiCheckCircle,
        color: '#16a34a', // green-600
        bg: '#dcfce7'     // green-100
      },
      cancelled: {
        label: 'İptal Edildi',
        icon: FiXCircle,
        color: '#dc2626', // red-600
        bg: '#fee2e2'     // red-100
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
      paid: {
        label: 'Ödendi',
        color: '#16a34a',
        bg: '#dcfce7'
      },
      failed: {
        label: 'Başarısız',
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

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= (pagination?.last_page || 1)) {
      setCurrentPage(newPage);
    }
  };

  return {
    orders,
    pagination,
    currentPage,
    isLoading,
    error,
    formatPrice,
    formatDate,
    getStatusConfig,
    getPaymentStatusConfig,
    handlePageChange
  };
};
