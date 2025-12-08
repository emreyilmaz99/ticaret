import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { vendorRegister } from '../../../features/vendor/api/vendorAuthApi';
import { useToast } from '../../../components/common/Toast';
import { INITIAL_FORM_STATE, getStyles } from './styles';

/**
 * Custom hook for vendor registration
 * Handles form state, validation, and registration
 */
export const useVendorRegister = () => {
  const navigate = useNavigate();
  const toast = useToast();
  
  // Step state
  const [step, setStep] = useState(1);
  
  // Responsive state
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  
  // Form state
  const [form, setForm] = useState(INITIAL_FORM_STATE);
  const [acceptTerms, setAcceptTerms] = useState(false);

  // Handle resize
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Get styles based on mobile state
  const styles = useMemo(() => getStyles(isMobile), [isMobile]);

  // Registration mutation
  const registerMutation = useMutation({
    mutationFn: (data) => vendorRegister(data),
    onSuccess: () => {
      toast.success(
        'Ön Başvurunuz Alındı!', 
        'Admin onayından sonra e-posta adresinize bilgilendirme gönderilecektir.', 
        5000
      );
      setTimeout(() => {
        navigate('/', { 
          state: { message: 'Ön başvurunuz başarıyla alındı. Lütfen e-postanızı kontrol edin.' } 
        });
      }, 600);
    },
    onError: (err) => {
      const errorMsg = err.response?.data?.message || err.message || 'Bir hata oluştu';
      toast.error('Başvuru Başarısız', errorMsg, 5000);
    }
  });

  // Step navigation
  const next = useCallback(() => setStep((s) => Math.min(2, s + 1)), []);
  const back = useCallback(() => setStep((s) => Math.max(1, s - 1)), []);

  // Update form field
  const updateField = useCallback((field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  }, []);

  // Phone input handler (digits only, max 10)
  const handlePhoneChange = useCallback((value) => {
    const digits = value.replace(/\D/g, '').slice(0, 10);
    setForm(prev => ({ ...prev, phone: digits }));
  }, []);

  // Tax ID handler (digits only, max 10)
  const handleTaxIdChange = useCallback((value) => {
    const digits = value.replace(/\D/g, '').slice(0, 10);
    setForm(prev => ({ ...prev, tax_id: digits }));
  }, []);

  // Input focus/blur handlers
  const handleFocus = useCallback((e) => {
    Object.assign(e.target.style, styles.inputFocus);
  }, [styles]);

  const handleBlur = useCallback((e) => {
    e.target.style.borderColor = '#e2e8f0';
    e.target.style.boxShadow = 'none';
    e.target.style.backgroundColor = '#f8fafc';
  }, []);

  // Validate form
  const validateForm = useCallback(() => {
    if (!form.company_name || form.company_name.trim().length < 2) {
      toast.warning('Uyarı', 'Mağaza/Şirket adı zorunludur!', 4000);
      return false;
    }

    if (!form.phone || form.phone.length < 10) {
      toast.warning('Uyarı', 'Geçerli bir telefon numarası giriniz!', 4000);
      return false;
    }

    if (form.password !== form.password_confirmation) {
      toast.warning('Uyarı', 'Şifreler eşleşmiyor!', 4000);
      return false;
    }

    if (form.password.length < 8) {
      toast.warning('Uyarı', 'Şifre en az 8 karakter olmalıdır!', 4000);
      return false;
    }

    return true;
  }, [form, toast]);

  // Submit handler
  const handleSubmit = useCallback((e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const payload = {
      full_name: form.full_name,
      email: form.email,
      company_name: form.company_name,
      phone: form.phone,
      tax_id: form.tax_id || null,
      password: form.password,
      password_confirmation: form.password_confirmation,
    };

    registerMutation.mutate(payload);
  }, [form, validateForm, registerMutation]);

  // Check if step 1 is valid
  const isStep1Valid = form.full_name && form.email;
  
  // Check if step 2 is valid
  const isStep2Valid = acceptTerms;

  return {
    // State
    step,
    form,
    acceptTerms,
    setAcceptTerms,
    isMobile,
    styles,
    
    // Loading
    isSubmitting: registerMutation.isPending,
    
    // Validity
    isStep1Valid,
    isStep2Valid,
    
    // Actions
    next,
    back,
    updateField,
    handlePhoneChange,
    handleTaxIdChange,
    handleFocus,
    handleBlur,
    handleSubmit
  };
};

export default useVendorRegister;
