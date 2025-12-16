// src/pages/vendor/Settings/useVendorSettings.js
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getVendorProfile, updateVendorProfile } from '../../../features/vendor/api/vendorAuthApi';
import { useToast } from '../../../components/common/Toast';
import apiClient from '@lib/apiClient';

// Türkiye şehirleri
export const TURKEY_CITIES = [
  'Adana', 'Adıyaman', 'Afyonkarahisar', 'Ağrı', 'Aksaray', 'Amasya', 'Ankara', 'Antalya', 'Ardahan', 'Artvin',
  'Aydın', 'Balıkesir', 'Bartın', 'Batman', 'Bayburt', 'Bilecik', 'Bingöl', 'Bitlis', 'Bolu', 'Burdur',
  'Bursa', 'Çanakkale', 'Çankırı', 'Çorum', 'Denizli', 'Diyarbakır', 'Düzce', 'Edirne', 'Elazığ', 'Erzincan',
  'Erzurum', 'Eskişehir', 'Gaziantep', 'Giresun', 'Gümüşhane', 'Hakkari', 'Hatay', 'Iğdır', 'Isparta', 'İstanbul',
  'İzmir', 'Kahramanmaraş', 'Karabük', 'Karaman', 'Kars', 'Kastamonu', 'Kayseri', 'Kırıkkale', 'Kırklareli', 'Kırşehir',
  'Kilis', 'Kocaeli', 'Konya', 'Kütahya', 'Malatya', 'Manisa', 'Mardin', 'Mersin', 'Muğla', 'Muş',
  'Nevşehir', 'Niğde', 'Ordu', 'Osmaniye', 'Rize', 'Sakarya', 'Samsun', 'Siirt', 'Sinop', 'Sivas',
  'Şanlıurfa', 'Şırnak', 'Tekirdağ', 'Tokat', 'Trabzon', 'Tunceli', 'Uşak', 'Van', 'Yalova', 'Yozgat', 'Zonguldak'
];

// Türkiye bankaları
export const TURKEY_BANKS = [
  'Akbank', 'Denizbank', 'Finansbank (QNB)', 'Garanti BBVA', 'Halkbank', 'HSBC', 'ING Bank',
  'İş Bankası', 'Kuveyt Türk', 'Odeabank', 'Şekerbank', 'TEB', 'Türkiye Finans',
  'Vakıfbank', 'Yapı Kredi', 'Ziraat Bankası', 'Albaraka Türk', 'Fibabanka', 'Diğer'
];

// Adres etiketleri
export const ADDRESS_LABELS = ['İş Yeri', 'Depo', 'Merkez Ofis', 'Şube', 'Fabrika', 'Diğer'];

const useVendorSettings = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const toast = useToast();

  // Auth check
  useEffect(() => {
    const token = localStorage.getItem('vendor_token');
    if (!token) navigate('/vendor/login');
  }, [navigate]);

  // ============ STATE ============
  const [activeTab, setActiveTab] = useState('general');
  const [isSaving, setIsSaving] = useState(false);

  // Form state
  const [form, setForm] = useState({
    name: '',
    company_name: '',
    phone: '',
    tax_id: '',
    description: ''
  });
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);

  // Address form
  const [addressForm, setAddressForm] = useState({
    label: 'İş Yeri',
    country: 'Türkiye',
    city: '',
    address_line: '',
    postal_code: ''
  });
  const [editingAddressId, setEditingAddressId] = useState(null);

  // Bank form
  const [bankForm, setBankForm] = useState({
    bank_name: '',
    account_holder: '',
    iban: '',
    currency: 'TRY'
  });
  const [editingBankId, setEditingBankId] = useState(null);

  // ============ QUERIES ============
  const { data: meData, isLoading } = useQuery({
    queryKey: ['vendor', 'me'],
    queryFn: getVendorProfile
  });

  const vendor = meData?.data?.vendor;

  // Populate form when vendor data is loaded
  useEffect(() => {
    if (vendor) {
      setForm({
        name: vendor.name || '',
        company_name: vendor.company_name || '',
        phone: vendor.phone || '',
        tax_id: vendor.tax_id || '',
        description: vendor.description || ''
      });
      if (vendor.logo_path) setLogoPreview(vendor.logo_path);
      if (vendor.cover_path) setCoverPreview(vendor.cover_path);
    }
  }, [vendor]);

  // ============ PROFILE MUTATION ============
  const updateMutation = useMutation({
    mutationFn: (data) => updateVendorProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['vendor', 'me']);
      toast.success('Başarılı', 'Profil bilgileriniz güncellendi.');
      setIsSaving(false);
    },
    onError: (err) => {
      toast.error('Hata', err.response?.data?.message || 'Güncelleme başarısız.');
      setIsSaving(false);
    }
  });

  // ============ ADDRESS MUTATIONS ============
  const createAddressMutation = useMutation({
    mutationFn: (data) => apiClient.post('/v1/vendor/addresses', data),
    onSuccess: () => {
      queryClient.invalidateQueries(['vendor', 'me']);
      toast.success('Başarılı', 'Adres eklendi.');
      resetAddressForm();
    },
    onError: (err) => toast.error('Hata', err.response?.data?.message || 'Adres eklenemedi.')
  });

  const updateAddressMutation = useMutation({
    mutationFn: ({ id, data }) => apiClient.put(`/v1/vendor/addresses/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['vendor', 'me']);
      toast.success('Başarılı', 'Adres güncellendi.');
      resetAddressForm();
    },
    onError: (err) => toast.error('Hata', err.response?.data?.message || 'Adres güncellenemedi.')
  });

  const deleteAddressMutation = useMutation({
    mutationFn: (id) => apiClient.delete(`/v1/vendor/addresses/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(['vendor', 'me']);
      toast.success('Başarılı', 'Adres silindi.');
    },
    onError: (err) => toast.error('Hata', err.response?.data?.message || 'Adres silinemedi.')
  });

  // ============ BANK MUTATIONS ============
  const createBankMutation = useMutation({
    mutationFn: (data) => apiClient.post('/v1/vendor/bank-accounts', data),
    onSuccess: () => {
      queryClient.invalidateQueries(['vendor', 'me']);
      toast.success('Başarılı', 'Banka hesabı eklendi.');
      resetBankForm();
    },
    onError: (err) => toast.error('Hata', err.response?.data?.message || 'Banka hesabı eklenemedi.')
  });

  const updateBankMutation = useMutation({
    mutationFn: ({ id, data }) => apiClient.put(`/v1/vendor/bank-accounts/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['vendor', 'me']);
      toast.success('Başarılı', 'Banka hesabı güncellendi.');
      resetBankForm();
    },
    onError: (err) => toast.error('Hata', err.response?.data?.message || 'Banka hesabı güncellenemedi.')
  });

  const deleteBankMutation = useMutation({
    mutationFn: (id) => apiClient.delete(`/v1/vendor/bank-accounts/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(['vendor', 'me']);
      toast.success('Başarılı', 'Banka hesabı silindi.');
    },
    onError: (err) => toast.error('Hata', err.response?.data?.message || 'Banka hesabı silinemedi.')
  });

  // ============ HANDLERS ============
  const resetAddressForm = () => {
    setAddressForm({ label: 'İş Yeri', country: 'Türkiye', city: '', address_line: '', postal_code: '' });
    setEditingAddressId(null);
  };

  const resetBankForm = () => {
    setBankForm({ bank_name: '', account_holder: '', iban: '', currency: 'TRY' });
    setEditingBankId(null);
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverFile(file);
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  const removeLogo = () => {
    setLogoFile(null);
    setLogoPreview(null);
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    setIsSaving(true);
    
    const fd = new FormData();
    fd.append('name', form.name);
    fd.append('company_name', form.company_name);
    fd.append('phone', form.phone);
    fd.append('tax_id', form.tax_id);
    if (form.description) fd.append('description', form.description);
    if (logoFile) fd.append('logo', logoFile);
    if (coverFile) fd.append('cover', coverFile);

    updateMutation.mutate(fd);
  };

  const handleAddressSubmit = (e) => {
    e.preventDefault();
    if (editingAddressId) {
      updateAddressMutation.mutate({ id: editingAddressId, data: addressForm });
    } else {
      createAddressMutation.mutate({ ...addressForm, is_primary: (vendor?.addresses || []).length === 0 });
    }
  };

  const handleBankSubmit = (e) => {
    e.preventDefault();
    if (editingBankId) {
      updateBankMutation.mutate({ id: editingBankId, data: bankForm });
    } else {
      createBankMutation.mutate({ ...bankForm, is_primary: (vendor?.bank_accounts || []).length === 0 });
    }
  };

  const editAddress = (addr) => {
    setAddressForm({
      label: addr.label || 'İş Yeri',
      country: addr.country || 'Türkiye',
      city: addr.city || '',
      address_line: addr.address_line || '',
      postal_code: addr.postal_code || ''
    });
    setEditingAddressId(addr.id);
  };

  const editBank = (bank) => {
    setBankForm({
      bank_name: bank.bank_name || '',
      account_holder: bank.account_holder || '',
      iban: bank.iban || '',
      currency: bank.currency || 'TRY'
    });
    setEditingBankId(bank.id);
  };

  const deleteAddress = (id) => {
    if (window.confirm('Bu adresi silmek istediğinize emin misiniz?')) {
      deleteAddressMutation.mutate(id);
    }
  };

  const deleteBank = (id) => {
    if (window.confirm('Bu banka hesabını silmek istediğinize emin misiniz?')) {
      deleteBankMutation.mutate(id);
    }
  };

  return {
    // Data
    vendor,
    isLoading,

    // UI State
    activeTab,
    setActiveTab,
    isSaving,

    // Profile Form
    form,
    setForm,
    logoPreview,
    coverPreview,
    handleLogoChange,
    handleCoverChange,
    removeLogo,
    handleProfileSubmit,

    // Address Form
    addressForm,
    setAddressForm,
    editingAddressId,
    handleAddressSubmit,
    editAddress,
    deleteAddress,
    resetAddressForm,
    isAddressSaving: createAddressMutation.isPending || updateAddressMutation.isPending,

    // Bank Form
    bankForm,
    setBankForm,
    editingBankId,
    handleBankSubmit,
    editBank,
    deleteBank,
    resetBankForm,
    isBankSaving: createBankMutation.isPending || updateBankMutation.isPending
  };
};

export default useVendorSettings;
