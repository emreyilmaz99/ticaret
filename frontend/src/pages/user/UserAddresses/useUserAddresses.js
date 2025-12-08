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
      qc.invalidateQueries(['user', 'addresses']);
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
      qc.invalidateQueries(['user', 'addresses']);
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
      qc.invalidateQueries(['user', 'addresses']);
      toast.success('Başarılı', 'Adres silindi.');
    },
    onError: (err) => {
      toast.error('Hata', err.response?.data?.message || 'Adres silinemedi.');
    }
  });

  // Set default mutation
  const setDefaultMutation = useMutation({
    mutationFn: setDefaultUserAddress,
    onSuccess: () => {
      qc.invalidateQueries(['user', 'addresses']);
      toast.success('Başarılı', 'Varsayılan adres güncellendi.');
    },
    onError: (err) => {
      toast.error('Hata', err.response?.data?.message || 'İşlem başarısız.');
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
