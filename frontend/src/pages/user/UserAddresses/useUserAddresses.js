// src/pages/user/UserAddresses/useUserAddresses.js
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUserAddresses, createUserAddress, updateUserAddress, deleteUserAddress, setDefaultUserAddress } from '../../../features/user/api/userAddressApi';
import { useToast } from '../../../components/common/Toast';

export const useUserAddresses = () => {
  const qc = useQueryClient();
  const toast = useToast();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [form, setForm] = useState({
    label: 'Ev',
    full_name: '',
    phone: '',
    country: 'Türkiye',
    city: '',
    district: '',
    neighborhood: '',
    address_line: '',
    postal_code: '',
    is_default: false
  });

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetch addresses
  const { data: addressData, isLoading } = useQuery({
    queryKey: ['user', 'addresses'],
    queryFn: getUserAddresses
  });

  const addresses = addressData?.data?.addresses || [];

  // Create mutation
  const createMutation = useMutation({
    mutationFn: createUserAddress,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['user', 'addresses'] });
      toast.success('Başarılı', 'Adres eklendi.');
      resetForm();
    },
    onError: (err) => {
      toast.error('Hata', err.response?.data?.message || 'Adres eklenemedi.');
    }
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updateUserAddress(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['user', 'addresses'] });
      toast.success('Başarılı', 'Adres güncellendi.');
      resetForm();
    },
    onError: (err) => {
      toast.error('Hata', err.response?.data?.message || 'Adres güncellenemedi.');
    }
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: deleteUserAddress,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['user', 'addresses'] });
      toast.success('Başarılı', 'Adres silindi.');
    },
    onError: (err) => {
      toast.error('Hata', err.response?.data?.message || 'Adres silinemedi.');
    }
  });

  // Set default mutation with optimistic update
  const setDefaultMutation = useMutation({
    mutationFn: setDefaultUserAddress,
    onMutate: async (newDefaultId) => {
      // Cancel any outgoing refetches
      await qc.cancelQueries({ queryKey: ['user', 'addresses'] });

      // Snapshot the previous value
      const previousAddresses = qc.getQueryData(['user', 'addresses']);

      // Optimistically update to the new value
      qc.setQueryData(['user', 'addresses'], (old) => {
        if (!old?.data?.addresses) return old;
        return {
          ...old,
          data: {
            ...old.data,
            addresses: old.data.addresses.map(addr => ({
              ...addr,
              is_default: addr.id === newDefaultId
            }))
          }
        };
      });

      // Return a context object with the snapshotted value
      return { previousAddresses };
    },
    onSuccess: () => {
      toast.success('Başarılı', 'Varsayılan adres güncellendi.');
    },
    onError: (err, newDefaultId, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      qc.setQueryData(['user', 'addresses'], context.previousAddresses);
      toast.error('Hata', err.response?.data?.message || 'İşlem başarısız.');
    },
    onSettled: () => {
      // Always refetch after error or success
      qc.invalidateQueries({ queryKey: ['user', 'addresses'] });
    }
  });

  const resetForm = () => {
    setForm({
      label: 'Ev',
      full_name: '',
      phone: '',
      country: 'Türkiye',
      city: '',
      district: '',
      neighborhood: '',
      address_line: '',
      postal_code: '',
      is_default: false
    });
    setEditingId(null);
    setShowForm(false);
  };

  const editAddress = (address) => {
    setForm({
      label: address.label || 'Ev',
      full_name: address.full_name || '',
      phone: address.phone || '',
      country: address.country || 'Türkiye',
      city: address.city || '',
      district: address.district || '',
      neighborhood: address.neighborhood || '',
      address_line: address.address_line || '',
      postal_code: address.postal_code || '',
      is_default: address.is_default || false
    });
    setEditingId(address.id);
    setShowForm(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      updateMutation.mutate({ id: editingId, data: form });
    } else {
      createMutation.mutate(form);
    }
  };

  return {
    addresses,
    isLoading,
    showForm,
    setShowForm,
    editingId,
    isMobile,
    form,
    setForm,
    resetForm,
    editAddress,
    handleSubmit,
    deleteMutation,
    setDefaultMutation
  };
};
