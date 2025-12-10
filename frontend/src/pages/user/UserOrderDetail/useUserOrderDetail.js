import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getOrder, cancelOrder } from '../../../features/checkout/api/checkoutApi'; // Import yolunu kontrol et
import { useToast } from '../../../components/common/Toast';

export const useUserOrderDetail = (orderNumber) => {
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  // API'den veriyi çek
  const { data, isLoading, error } = useQuery({
    queryKey: ['order', orderNumber],
    queryFn: () => getOrder(orderNumber),
    enabled: !!orderNumber,
    staleTime: 1000 * 60 * 5, 
  });

  const order = data?.data?.order;

  // Sipariş İptal İşlemi
  const cancelMutation = useMutation({
    mutationFn: (orderNum) => cancelOrder(orderNum),
    onSuccess: () => {
      showToast('Sipariş başarıyla iptal edildi', 'success');
      queryClient.invalidateQueries({ queryKey: ['order', orderNumber] });
      queryClient.invalidateQueries({ queryKey: ['userOrders'] });
    },
    onError: (err) => {
      showToast(
        err.response?.data?.message || 'Hata oluştu',
        'error'
      );
    }
  });

  // Yardımcı Fonksiyon: Fiyat Formatlama
  const formatPrice = (price) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(price);
  };

  const handleCancelOrder = async (orderNum) => {
    if (window.confirm('Siparişi iptal etmek istediğinizden emin misiniz?')) {
      await cancelMutation.mutateAsync(orderNum);
    }
  };

  // Sadece verileri ve fonksiyonları döndür (JSX yok)
  return {
    order,
    isLoading,
    error,
    isCancelling: cancelMutation.isPending,
    formatPrice,
    handleCancelOrder
  };
};