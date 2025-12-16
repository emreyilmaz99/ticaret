// src/features/vendor/hooks/useVendorMutations.js
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateVendorStatus } from '../api/vendorApi';
import { useToast } from '../../../components/common/Toast';

export const useVendorMutations = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }) => updateVendorStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries(['vendors']);
      queryClient.invalidateQueries(['active-vendors']);
      toast.success('Durum Güncellendi', 'Satıcı durumu başarıyla güncellendi.', 3000);
    },
    onError: (err) => {
      toast.error('Hata', 'Durum güncellenemedi: ' + (err.response?.data?.message || err.message), 4000);
    }
  });

  return {
    updateStatusMutation,
  };
};
