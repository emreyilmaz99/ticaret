// src/features/users/hooks/useUserMutations.js
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteUser, toggleUserStatus, updateUser } from '../api/userApi';
import { useToast } from '../../../components/common/Toast';

export const useUserMutations = (selectedUserId) => {
  const queryClient = useQueryClient();
  const toast = useToast();

  const deleteMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
      toast.success('Başarılı', 'Kullanıcı silindi.');
    },
    onError: () => {
      toast.error('Hata', 'Kullanıcı silinemedi.');
    }
  });

  const toggleStatusMutation = useMutation({
    mutationFn: toggleUserStatus,
    onSuccess: (data) => {
      queryClient.invalidateQueries(['users']);
      queryClient.invalidateQueries(['user', selectedUserId]);
      toast.success('Başarılı', data.message);
    },
    onError: () => {
      toast.error('Hata', 'Durum değiştirilemedi.');
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
      queryClient.invalidateQueries(['user', selectedUserId]);
      toast.success('Başarılı', 'Kullanıcı güncellendi.');
    },
    onError: (err) => {
      toast.error('Hata', err.response?.data?.message || 'Güncelleme başarısız.');
    }
  });

  return {
    deleteMutation,
    toggleStatusMutation,
    updateMutation,
  };
};
