// src/components/modals/AddressModal/hooks/useAddressValidation.js
import { useCallback } from 'react';

export const useAddressValidation = () => {
  const validateForm = useCallback((formData) => {
    const errors = [];

    if (!formData.fullName || formData.fullName.trim().length < 3) {
      errors.push('Ad Soyad en az 3 karakter olmalıdır');
    }

    if (!formData.phone || formData.phone.length !== 10) {
      errors.push('Geçerli bir telefon numarası giriniz (10 haneli)');
    }

    if (!formData.identityNumber || formData.identityNumber.length !== 11) {
      errors.push('TC Kimlik Numarası 11 haneli olmalıdır');
    }

    if (!formData.city) {
      errors.push('İl seçiniz');
    }

    if (!formData.district) {
      errors.push('İlçe seçiniz');
    }

    if (!formData.neighborhood) {
      errors.push('Mahalle seçiniz');
    }

    if (!formData.addressLine || formData.addressLine.trim().length < 10) {
      errors.push('Açık adres en az 10 karakter olmalıdır');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }, []);

  const formatPhone = useCallback((phone) => {
    return phone.replace(/\D/g, '').slice(0, 10);
  }, []);

  const formatIdentityNumber = useCallback((id) => {
    return id.replace(/\D/g, '').slice(0, 11);
  }, []);

  return {
    validateForm,
    formatPhone,
    formatIdentityNumber,
  };
};
