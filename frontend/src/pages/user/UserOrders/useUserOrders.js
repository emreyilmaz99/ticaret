// src/pages/user/UserOrders/useUserOrders.js
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
  const { data, isLoading, error } = useQuery({
    queryKey: ['userOrders'],
    queryFn: () => getUserOrders({ page: 1, per_page: 100 }), // Tüm siparişleri çek
  });

  const orders = data?.data?.orders || [];

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
      confirmed: {
        label: 'Onaylandı',
        icon: FiCheckCircle,
        color: '#059669', // emerald-600
        bg: '#d1fae5'     // emerald-100
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
      },
      returned: {
        label: 'İade Edildi',
        icon: FiXCircle,
        color: '#f59e0b', // amber-600
        bg: '#fef3c7'     // amber-100
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

  return {
    orders,
    isLoading,
    error,
    formatPrice,
    formatDate,
    getStatusConfig,
    getPaymentStatusConfig
  };
};
