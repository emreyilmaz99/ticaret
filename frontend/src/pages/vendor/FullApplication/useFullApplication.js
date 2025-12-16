import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useToast } from '../../../components/common/Toast';
import apiClient from '@lib/apiClient';
import { INITIAL_FORM_STATE, styles } from './styles';

/**
 * Custom hook for vendor full application logic
 * Handles form state, validation, and API operations
 */
export const useFullApplication = () => {
  const navigate = useNavigate();
  const toast = useToast();
  
  // Form state
  const [form, setForm] = useState(INITIAL_FORM_STATE);
  const [acceptTerms, setAcceptTerms] = useState(false);

  // Fetch vendor status
  const { 
    data: statusData, 
    isLoading, 
    error: statusError 
  } = useQuery({
    queryKey: ['vendorStatus'],
    queryFn: async () => {
      const response = await apiClient.get('/v1/vendor/application/status');
      return response.data.data;
    }
  });

  // Pre-fill form with vendor data
  useEffect(() => {
    if (statusData?.vendor) {
      const vendor = statusData.vendor;
      const fullName = vendor.name || '';
      const nameParts = fullName.split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';
      
      setForm(prev => ({
        ...prev,
        full_name: fullName,
        company_name: vendor.company_name || '',
        slug: vendor.slug || '',
        phone: vendor.phone || '',
        tax_id: vendor.tax_id || '',
        contact_name: firstName,
        contact_surname: lastName,
        account_holder: fullName
      }));
    }
  }, [statusData]);

  // Check if vendor can submit full application
  useEffect(() => {
    if (statusData && !statusData.can_submit_full_application) {
      toast.warning('Erişim Engellendi', 'Tam başvuru yapmak için yetkiniz bulunmuyor.', 4000);
      setTimeout(() => navigate('/vendor/status'), 600);
    }
  }, [statusData, navigate, toast]);

  // Submit mutation
  const submitMutation = useMutation({
    mutationFn: async (data) => {
      const response = await apiClient.post('/v1/vendor/application/submit-full', data);
      return response.data;
    },
    onSuccess: () => {
      toast.success(
        'Tam Başvurunuz Tamamlandı!', 
        'Başvurunuz admin onayına gönderildi. Onaylandıktan sonra hesabınız aktifleştirilecektir.', 
        5000
      );
      setTimeout(() => navigate('/vendor/status'), 600);
    },
    onError: (err) => {
      const response = err.response?.data;
      const errorMsg = response?.message || err.message || 'Bir hata oluştu';
      toast.error('Tam Başvuru Başarısız', errorMsg, 5000);
    }
  });

  // Form field update handler
  const updateField = useCallback((field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  }, []);

  // Company name change handler (also updates slug)
  const handleCompanyNameChange = useCallback((value) => {
    const slug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    setForm(prev => ({ ...prev, company_name: value, slug }));
  }, []);

  // Slug change handler (sanitize input)
  const handleSlugChange = useCallback((value) => {
    const sanitized = value.toLowerCase().replace(/[^a-z0-9-]/g, '');
    setForm(prev => ({ ...prev, slug: sanitized }));
  }, []);

  // Phone change handler (digits only, max 10)
  const handlePhoneChange = useCallback((value) => {
    const digits = value.replace(/\D/g, '').slice(0, 10);
    setForm(prev => ({ ...prev, phone: digits }));
  }, []);

  // Identity number handler (digits only, max 11)
  const handleIdentityChange = useCallback((value) => {
    const digits = value.replace(/\D/g, '').slice(0, 11);
    setForm(prev => ({ ...prev, identity_number: digits }));
  }, []);

  // Tax ID handler (digits only, max 10)
  const handleTaxIdChange = useCallback((value) => {
    const digits = value.replace(/\D/g, '').slice(0, 10);
    setForm(prev => ({ ...prev, tax_id: digits }));
  }, []);

  // IBAN handler (uppercase, alphanumeric only, max 26)
  const handleIbanChange = useCallback((value) => {
    const formatted = value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 26);
    setForm(prev => ({ ...prev, iban: formatted }));
  }, []);

  // City change handler (also updates postal code)
  const handleCityChange = useCallback((city, cityPlateCodes) => {
    const postalCode = city && cityPlateCodes[city] ? cityPlateCodes[city] + '000' : '';
    setForm(prev => ({ ...prev, city, postal_code: postalCode }));
  }, []);

  // Submit form
  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    submitMutation.mutate(form);
  }, [form, submitMutation]);

  // Navigation helpers
  const goToStatus = useCallback(() => navigate('/vendor/status'), [navigate]);
  const goToLogin = useCallback(() => navigate('/vendor/login'), [navigate]);

  // Input focus/blur handlers for styling
  const handleFocus = useCallback((e) => {
    Object.assign(e.target.style, styles.inputFocus);
  }, []);

  const handleBlur = useCallback((e) => {
    e.target.style.borderColor = '#e2e8f0';
    e.target.style.boxShadow = 'none';
    e.target.style.backgroundColor = '#f8fafc';
  }, []);

  // Check form validity
  const isFormValid = acceptTerms && form.merchant_type;

  return {
    // State
    form,
    acceptTerms,
    setAcceptTerms,
    
    // Data
    statusData,
    vendorName: statusData?.vendor?.full_name,
    vendorStatus: statusData?.vendor?.status_label,
    canSubmit: statusData?.can_submit_full_application,
    
    // Loading states
    isLoading,
    isSubmitting: submitMutation.isPending,
    statusError,
    
    // Validity
    isFormValid,
    
    // Field handlers
    updateField,
    handleCompanyNameChange,
    handleSlugChange,
    handlePhoneChange,
    handleIdentityChange,
    handleTaxIdChange,
    handleIbanChange,
    handleCityChange,
    
    // Input styling
    handleFocus,
    handleBlur,
    
    // Actions
    handleSubmit,
    goToStatus,
    goToLogin
  };
};

export default useFullApplication;
