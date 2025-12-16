import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getVendorProfile,
  updateVendorProfile,
  createVendorAddress,
  createVendorBankAccount,
  completeOnboarding,
} from '../../../../features/vendor/api/vendorAuthApi';
import { useToast } from '../../../../components/common/Toast';

const useVendorOnboarding = () => {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const toast = useToast();
  const [step, setStep] = useState(1);
  const [loadingSave, setLoadingSave] = useState(false);

  // Form states
  const [basic, setBasic] = useState({ company_name: '', tax_id: '', phone: '' });
  const [logoFile, setLogoFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const [address, setAddress] = useState({
    label: 'İş yeri',
    country: 'Türkiye',
    city: '',
    address_line: '',
    postal_code: '',
    is_primary: true,
  });
  const [bank, setBank] = useState({
    bank_name: '',
    account_holder: '',
    iban: '',
    currency: 'TRY',
    is_primary: true,
  });

  const { data: meData, isLoading: loadingMe } = useQuery({
    queryKey: ['vendor', 'me'],
    queryFn: () => getVendorProfile(),
    onSuccess: (res) => {
      const v = res.data.vendor;
      if (!v) return;
      setBasic({ company_name: v.company_name || '', tax_id: v.tax_id || '', phone: v.phone || '' });
      if (v.addresses && v.addresses.length > 0) setAddress((prev) => ({ ...prev, ...v.addresses[0] }));
      if (v.bank_accounts && v.bank_accounts.length > 0) setBank((prev) => ({ ...prev, ...v.bank_accounts[0] }));
    },
  });

  const updateProfileMutation = useMutation({ mutationFn: (payload) => updateVendorProfile(payload) });
  const createAddressMutation = useMutation({ mutationFn: (payload) => createVendorAddress(payload) });
  const createBankMutation = useMutation({ mutationFn: (payload) => createVendorBankAccount(payload) });

  // Auto-navigate if already complete
  useEffect(() => {
    if (meData && meData.data && meData.data.vendor) {
      const v = meData.data.vendor;
      const hasCompany = !!v.company_name;
      const hasAddress = v.addresses && v.addresses.length > 0;
      const hasBank = v.bank_accounts && v.bank_accounts.length > 0;
      if (v.status === 'active' && hasCompany && hasAddress && hasBank) {
        navigate('/vendor/dashboard');
      }
    }
  }, [meData, navigate]);

  const handleSaveBasic = async () => {
    setLoadingSave(true);
    try {
      const fd = new FormData();
      fd.append('company_name', basic.company_name);
      fd.append('tax_id', basic.tax_id);
      fd.append('phone', basic.phone);
      if (logoFile) fd.append('logo', logoFile);
      if (coverFile) fd.append('cover', coverFile);

      await updateProfileMutation.mutateAsync(fd);
      qc.invalidateQueries(['vendor', 'me']);
      toast.success('Profil Kaydedildi', 'Mağaza bilgileriniz başarıyla güncellendi.', 3000);
      setStep(2);
    } catch (e) {
      toast.error('Kaydetme Hatası', e.response?.data?.message || e.message, 4000);
    } finally {
      setLoadingSave(false);
    }
  };

  const handleSaveAddress = async () => {
    setLoadingSave(true);
    try {
      await createAddressMutation.mutateAsync(address);
      qc.invalidateQueries(['vendor', 'me']);
      toast.success('Adres Kaydedildi', 'İş yeri adresiniz başarıyla eklendi.', 3000);
      setStep(3);
    } catch (e) {
      toast.error('Adres Kaydı Başarısız', e.response?.data?.message || e.message, 4000);
    } finally {
      setLoadingSave(false);
    }
  };

  const handleSaveBank = async () => {
    setLoadingSave(true);
    try {
      await createBankMutation.mutateAsync(bank);
      qc.invalidateQueries(['vendor', 'me']);
      await completeOnboarding();
      toast.success('Onboarding Tamamlandı!', 'Bilgileriniz kaydedildi. Admin onayı bekleniyor.', 4000);
      setTimeout(() => navigate('/vendor/dashboard'), 600);
    } catch (e) {
      toast.error('Banka Hesabı Kaydı Başarısız', e.response?.data?.message || e.message, 4000);
    } finally {
      setLoadingSave(false);
    }
  };

  return {
    step,
    setStep,
    loadingSave,
    loadingMe,
    basic,
    setBasic,
    logoFile,
    setLogoFile,
    coverFile,
    setCoverFile,
    address,
    setAddress,
    bank,
    setBank,
    handleSaveBasic,
    handleSaveAddress,
    handleSaveBank,
  };
};

export default useVendorOnboarding;
