// src/components/modals/AddressModal/hooks/useAddressForm.js
import { useState, useCallback, useEffect } from 'react';
import { cityPlateCodes } from '../../../../data/turkeyData';

export const useAddressForm = (initialAddress, user) => {
  const [formData, setFormData] = useState({
    fullName: initialAddress?.full_name || user?.name || '',
    phone: initialAddress?.phone || user?.phone || '',
    identityNumber: user?.identity_number || '',
    city: initialAddress?.city || '',
    district: initialAddress?.district || '',
    neighborhood: initialAddress?.neighborhood || '',
    postalCode: initialAddress?.postal_code || '',
    addressLine: initialAddress?.address_line || '',
    addressLabel: initialAddress?.label || 'Ev',
    selectedId: null,
  });

  useEffect(() => {
    if (user && !initialAddress) {
      setFormData(prev => ({
        ...prev,
        fullName: user.name || prev.fullName,
        phone: user.phone || prev.phone,
        identityNumber: user.identity_number || prev.identityNumber,
      }));
    }
  }, [user, initialAddress]);

  const updateField = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleCityChange = useCallback((city) => {
    setFormData(prev => ({
      ...prev,
      selectedId: null,
      city,
      district: '',
      neighborhood: '',
      postalCode: city && cityPlateCodes[city] ? cityPlateCodes[city] + '000' : '',
    }));
  }, []);

  const handleDistrictChange = useCallback((district) => {
    setFormData(prev => ({
      ...prev,
      selectedId: null,
      district,
      neighborhood: '',
    }));
  }, []);

  const loadAddress = useCallback((address) => {
    setFormData({
      selectedId: address.id,
      fullName: address.full_name,
      phone: address.phone,
      city: address.city,
      district: address.district,
      neighborhood: address.neighborhood,
      postalCode: address.postal_code || '',
      addressLine: address.address_line,
      addressLabel: address.label,
      identityNumber: formData.identityNumber,
    });
  }, [formData.identityNumber]);

  const resetForm = useCallback(() => {
    setFormData({
      fullName: user?.name || '',
      phone: user?.phone || '',
      identityNumber: user?.identity_number || '',
      city: '',
      district: '',
      neighborhood: '',
      postalCode: '',
      addressLine: '',
      addressLabel: 'Ev',
      selectedId: null,
    });
  }, [user]);

  return {
    formData,
    updateField,
    handleCityChange,
    handleDistrictChange,
    loadAddress,
    resetForm,
  };
};
