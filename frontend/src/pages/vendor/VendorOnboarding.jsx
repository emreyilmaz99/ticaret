import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getVendorProfile, updateVendorProfile, createVendorAddress, createVendorBankAccount } from '../../features/vendor/api/vendorAuthApi';

const VendorOnboarding = () => {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [step, setStep] = useState(1);
  const [loadingSave, setLoadingSave] = useState(false);

  // Form state
  const [basic, setBasic] = useState({ company_name: '', tax_id: '', phone: '' });
  const [logoFile, setLogoFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);

  const [address, setAddress] = useState({ label: 'İş yeri', country: 'Türkiye', city: '', address_line: '', postal_code: '', is_primary: true });

  const [bank, setBank] = useState({ bank_name: '', account_holder: '', iban: '', currency: 'TRY', is_primary: true });

  const { data: meData, isLoading: loadingMe } = useQuery({
    queryKey: ['vendor','me'],
    queryFn: () => getVendorProfile(),
    onSuccess: (res) => {
      const v = res.data.vendor;
      if (!v) return;
      setBasic({ company_name: v.company_name || '', tax_id: v.tax_id || '', phone: v.phone || '' });
      if (v.addresses && v.addresses.length > 0) setAddress(prev => ({ ...prev, ...v.addresses[0] }));
      if (v.bank_accounts && v.bank_accounts.length > 0) setBank(prev => ({ ...prev, ...v.bank_accounts[0] }));
    }
  });

  const updateProfileMutation = useMutation({ mutationFn: (payload) => updateVendorProfile(payload) });
  const createAddressMutation = useMutation({ mutationFn: (payload) => createVendorAddress(payload) });
  const createBankMutation = useMutation({ mutationFn: (payload) => createVendorBankAccount(payload) });

  useEffect(() => {
    // If vendor is already active and has data, skip onboarding
    if (meData && meData.data && meData.data.vendor) {
      const v = meData.data.vendor;
      const hasCompany = !!v.company_name;
      const hasAddress = (v.addresses && v.addresses.length > 0);
      const hasBank = (v.bank_accounts && v.bank_accounts.length > 0);
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
      qc.invalidateQueries(['vendor','me']);
      setStep(2);
    } catch (e) {
      alert('Kaydetme hatası: ' + (e.response?.data?.message || e.message));
    } finally {
      setLoadingSave(false);
    }
  };

  const handleSaveAddress = async () => {
    setLoadingSave(true);
    try {
      await createAddressMutation.mutateAsync(address);
      qc.invalidateQueries(['vendor','me']);
      setStep(3);
    } catch (e) {
      alert('Adres kaydı başarısız: ' + (e.response?.data?.message || e.message));
    } finally {
      setLoadingSave(false);
    }
  };

  const handleSaveBank = async () => {
    setLoadingSave(true);
    try {
      await createBankMutation.mutateAsync(bank);
      qc.invalidateQueries(['vendor','me']);
      // tamamlandı
      alert('Onboarding tamamlandı. Bilgiler kaydedildi. Admin onayı bekleniyor.');
      navigate('/vendor/dashboard');
    } catch (e) {
      alert('Banka hesabı kaydı başarısız: ' + (e.response?.data?.message || e.message));
    } finally {
      setLoadingSave(false);
    }
  };

  if (loadingMe) return <div style={{ padding: 24 }}>Yükleniyor...</div>;

  return (
    <div style={{ padding: 24, maxWidth: 900, margin: '24px auto' }}>
      <h2>Satıcı Onboarding (Adım {step} / 3)</h2>

      {step === 1 && (
        <div style={{ marginTop: 16 }}>
          <label>Mağaza / Şirket Adı</label>
          <input value={basic.company_name} onChange={e => setBasic({...basic, company_name: e.target.value})} style={{ width: '100%', padding: 8, marginTop: 8 }} />

          <label style={{ marginTop: 12 }}>Vergi Numarası (opsiyonel)</label>
          <input value={basic.tax_id} onChange={e => setBasic({...basic, tax_id: e.target.value})} style={{ width: '100%', padding: 8, marginTop: 8 }} />

          <label style={{ marginTop: 12 }}>Telefon</label>
          <input value={basic.phone} onChange={e => setBasic({...basic, phone: e.target.value})} style={{ width: '100%', padding: 8, marginTop: 8 }} />

          <label style={{ marginTop: 12 }}>Logo (opsiyonel)</label>
          <input type="file" accept="image/*" onChange={e => setLogoFile(e.target.files[0])} />

          <label style={{ marginTop: 12 }}>Kapak Görseli (opsiyonel)</label>
          <input type="file" accept="image/*" onChange={e => setCoverFile(e.target.files[0])} />

          <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
            <button onClick={handleSaveBasic} disabled={loadingSave} style={{ padding: '10px 16px' }}>{loadingSave ? 'Kaydediliyor...' : 'Kaydet ve İleri'}</button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div style={{ marginTop: 16 }}>
          <h4>Adres Bilgisi</h4>
          <label>Şehir</label>
          <input value={address.city} onChange={e => setAddress({...address, city: e.target.value})} style={{ width: '100%', padding: 8, marginTop: 8 }} />
          <label style={{ marginTop: 12 }}>Açık Adres</label>
          <textarea value={address.address_line} onChange={e => setAddress({...address, address_line: e.target.value})} style={{ width: '100%', padding: 8, marginTop: 8 }} />
          <label style={{ marginTop: 12 }}>Posta Kodu</label>
          <input value={address.postal_code} onChange={e => setAddress({...address, postal_code: e.target.value})} style={{ width: '100%', padding: 8, marginTop: 8 }} />

          <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
            <button onClick={() => setStep(1)} style={{ padding: '10px 16px' }}>Geri</button>
            <button onClick={handleSaveAddress} disabled={loadingSave} style={{ padding: '10px 16px' }}>{loadingSave ? 'Kaydediliyor...' : 'Adres Kaydet ve İleri'}</button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div style={{ marginTop: 16 }}>
          <h4>Banka Hesabı</h4>
          <label>Banka Adı</label>
          <input value={bank.bank_name} onChange={e => setBank({...bank, bank_name: e.target.value})} style={{ width: '100%', padding: 8, marginTop: 8 }} />
          <label style={{ marginTop: 12 }}>Hesap Sahibi</label>
          <input value={bank.account_holder} onChange={e => setBank({...bank, account_holder: e.target.value})} style={{ width: '100%', padding: 8, marginTop: 8 }} />
          <label style={{ marginTop: 12 }}>IBAN</label>
          <input value={bank.iban} onChange={e => setBank({...bank, iban: e.target.value})} style={{ width: '100%', padding: 8, marginTop: 8 }} />

          <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
            <button onClick={() => setStep(2)} style={{ padding: '10px 16px' }}>Geri</button>
            <button onClick={handleSaveBank} disabled={loadingSave} style={{ padding: '10px 16px' }}>{loadingSave ? 'Kaydediliyor...' : 'Banka Hesabını Kaydet'}</button>
          </div>
        </div>
      )}

    </div>
  );
};

export default VendorOnboarding;
