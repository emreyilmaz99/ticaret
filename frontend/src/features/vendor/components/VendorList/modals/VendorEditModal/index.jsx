// src/features/vendor/components/VendorList/modals/VendorEditModal/index.jsx
import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { FaTimes } from 'react-icons/fa';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateVendor } from '../../../../api/vendorApi';
import { useToast } from '../../../../../../components/common/Toast';
import VendorEditForm from './VendorEditForm';
import { modalStyles } from './styles';

const VendorEditModal = ({ vendor, isOpen = true, onClose }) => {
  const queryClient = useQueryClient();
  const toast = useToast();
  const overlayRef = useRef(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    commission_rate: 0,
    status: 'active',
    password: '',
    password_confirmation: '',
    addresses: [],
    bank_accounts: [],
  });

  useEffect(() => {
    if (vendor) {
      setFormData({
        name: vendor.storeName || vendor.name || '',
        email: vendor.email || '',
        phone: vendor.phone || '',
        commission_rate:
          vendor.commission_rate ?? vendor.commissionRate ?? vendor.commission_plan?.rate ?? 0,
        commission_plan_name: vendor.commission_plan?.name || 'Atanmamış',
        status: vendor.status || 'active',
        password: '',
        password_confirmation: '',
        addresses: vendor.addresses || vendor.addresses_list || [],
        bank_accounts: vendor.bank_accounts || vendor.bankAccounts || [],
      });
    }
  }, [vendor]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose && onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const updateMutation = useMutation({
    mutationFn: (data) => updateVendor(vendor?.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['vendors']);
      queryClient.invalidateQueries(['active-vendors']);
      toast.success('Satıcı Güncellendi', 'Satıcı bilgileri başarıyla güncellendi.', 3000);
      onClose && onClose();
    },
    onError: (err) => {
      toast.error('Güncelleme Hatası', err.response?.data?.message || err.message, 4000);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const dataToSend = { ...formData };
    if (!dataToSend.password) {
      delete dataToSend.password;
      delete dataToSend.password_confirmation;
    }
    updateMutation.mutate(dataToSend);
  };

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) onClose && onClose();
  };

  const handleFieldChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  if (!isOpen || !vendor) return null;

  return (
    <div ref={overlayRef} onClick={handleOverlayClick} style={modalStyles.overlay}>
      <div style={modalStyles.container}>
        <div style={modalStyles.header}>
          <h2 style={modalStyles.title}>
            Satıcı Düzenle: <span style={modalStyles.storeName}>{vendor.storeName}</span>
          </h2>
          <button
            type="button"
            aria-label="Kapat"
            onClick={onClose}
            style={modalStyles.closeButton}
          >
            <FaTimes size={20} />
          </button>
        </div>

        <div style={modalStyles.content}>
          <VendorEditForm
            formData={formData}
            onFieldChange={handleFieldChange}
            onSubmit={handleSubmit}
            isSubmitting={updateMutation.isLoading}
          />

          <div style={modalStyles.footer}>
            <button type="button" onClick={onClose} style={modalStyles.cancelButton}>
              İptal
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              style={modalStyles.submitButton}
              disabled={updateMutation.isLoading}
            >
              {updateMutation.isLoading ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

VendorEditModal.propTypes = {
  vendor: PropTypes.object,
  isOpen: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
};

export default VendorEditModal;
