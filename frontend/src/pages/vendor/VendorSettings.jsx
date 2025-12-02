import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getVendorProfile, updateVendorProfile } from '../../features/vendor/api/vendorAuthApi';
import { useToast } from '../../components/Toast';
import { FaStore, FaImage, FaMapMarkerAlt, FaSave, FaPhone, FaEnvelope, FaIdCard, FaUser, FaSpinner, FaCamera, FaTimes, FaUniversity, FaPlus, FaTrash, FaEdit } from 'react-icons/fa';
import axios from '../../lib/axios';

const VendorSettings = () => {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const toast = useToast();
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

  useEffect(() => {
    const token = localStorage.getItem('vendor_token');
    if (!token) {
      navigate('/vendor/login');
    }
  }, [navigate]);

  // Fetch vendor profile
  const { data: meData, isLoading } = useQuery({
    queryKey: ['vendor', 'me'],
    queryFn: getVendorProfile,
    onSuccess: (res) => {
      const v = res.data?.vendor;
      if (v) {
        setForm({
          name: v.name || '',
          company_name: v.company_name || '',
          phone: v.phone || '',
          tax_id: v.tax_id || '',
          description: v.description || ''
        });
        if (v.logo_path) setLogoPreview(v.logo_path);
        if (v.cover_path) setCoverPreview(v.cover_path);
      }
    }
  });

  const vendor = meData?.data?.vendor;

  // Update profile mutation
  const updateMutation = useMutation({
    mutationFn: (data) => updateVendorProfile(data),
    onSuccess: () => {
      qc.invalidateQueries(['vendor', 'me']);
      toast.success('Başarılı', 'Profil bilgileriniz güncellendi.');
      setIsSaving(false);
    },
    onError: (err) => {
      toast.error('Hata', err.response?.data?.message || 'Güncelleme başarısız.');
      setIsSaving(false);
    }
  });

  // Address mutations
  const createAddressMutation = useMutation({
    mutationFn: (data) => axios.post('/v1/vendor/addresses', data),
    onSuccess: () => {
      qc.invalidateQueries(['vendor', 'me']);
      toast.success('Başarılı', 'Adres eklendi.');
      resetAddressForm();
    },
    onError: (err) => toast.error('Hata', err.response?.data?.message || 'Adres eklenemedi.')
  });

  const updateAddressMutation = useMutation({
    mutationFn: ({ id, data }) => axios.put(`/v1/vendor/addresses/${id}`, data),
    onSuccess: () => {
      qc.invalidateQueries(['vendor', 'me']);
      toast.success('Başarılı', 'Adres güncellendi.');
      resetAddressForm();
    },
    onError: (err) => toast.error('Hata', err.response?.data?.message || 'Adres güncellenemedi.')
  });

  const deleteAddressMutation = useMutation({
    mutationFn: (id) => axios.delete(`/v1/vendor/addresses/${id}`),
    onSuccess: () => {
      qc.invalidateQueries(['vendor', 'me']);
      toast.success('Başarılı', 'Adres silindi.');
    },
    onError: (err) => toast.error('Hata', err.response?.data?.message || 'Adres silinemedi.')
  });

  // Bank mutations
  const createBankMutation = useMutation({
    mutationFn: (data) => axios.post('/v1/vendor/bank-accounts', data),
    onSuccess: () => {
      qc.invalidateQueries(['vendor', 'me']);
      toast.success('Başarılı', 'Banka hesabı eklendi.');
      resetBankForm();
    },
    onError: (err) => toast.error('Hata', err.response?.data?.message || 'Banka hesabı eklenemedi.')
  });

  const updateBankMutation = useMutation({
    mutationFn: ({ id, data }) => axios.put(`/v1/vendor/bank-accounts/${id}`, data),
    onSuccess: () => {
      qc.invalidateQueries(['vendor', 'me']);
      toast.success('Başarılı', 'Banka hesabı güncellendi.');
      resetBankForm();
    },
    onError: (err) => toast.error('Hata', err.response?.data?.message || 'Banka hesabı güncellenemedi.')
  });

  const deleteBankMutation = useMutation({
    mutationFn: (id) => axios.delete(`/v1/vendor/bank-accounts/${id}`),
    onSuccess: () => {
      qc.invalidateQueries(['vendor', 'me']);
      toast.success('Başarılı', 'Banka hesabı silindi.');
    },
    onError: (err) => toast.error('Hata', err.response?.data?.message || 'Banka hesabı silinemedi.')
  });

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

  const handleSubmit = (e) => {
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

  if (isLoading) {
    return (
      <div style={{ padding: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 400 }}>
        <FaSpinner className="spin" style={{ fontSize: 32, color: '#64748b' }} />
      </div>
    );
  }

  const tabStyle = (isActive) => ({
    padding: '0 0 16px 0',
    border: 'none',
    background: 'none',
    borderBottom: isActive ? '2px solid #14532d' : '2px solid transparent',
    color: isActive ? '#14532d' : '#64748b',
    fontWeight: isActive ? '600' : '500',
    cursor: 'pointer',
    fontSize: '14px'
  });

  const inputStyle = {
    width: '100%',
    padding: '12px 12px 12px 40px',
    borderRadius: '10px',
    border: '1px solid #e2e8f0',
    outline: 'none',
    fontSize: '14px',
    transition: 'all 0.2s'
  };

  const labelStyle = {
    display: 'block',
    fontSize: '14px',
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: '8px'
  };

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", color: '#1e293b', maxWidth: '900px' }}>
      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .spin { animation: spin 1s linear infinite; }
      `}</style>
      
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.5px' }}>Mağaza Ayarları</h1>
        <p style={{ color: '#64748b', fontSize: '14px', marginTop: '4px' }}>Mağaza profilinizi ve görünümünüzü özelleştirin.</p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '24px', borderBottom: '1px solid #e2e8f0', marginBottom: '32px' }}>
        <button onClick={() => setActiveTab('general')} style={tabStyle(activeTab === 'general')}>Genel Bilgiler</button>
        <button onClick={() => setActiveTab('address')} style={tabStyle(activeTab === 'address')}>Adresler</button>
        <button onClick={() => setActiveTab('bank')} style={tabStyle(activeTab === 'bank')}>Banka Hesapları</button>
      </div>

      {/* General Tab */}
      {activeTab === 'general' && (
        <form onSubmit={handleSubmit}>
          <div style={{ backgroundColor: 'white', padding: '32px', borderRadius: '24px', border: '1px solid #f1f5f9', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.02)' }}>
            
            {/* Logo & Cover Upload */}
            <div style={{ marginBottom: '32px' }}>
              <label style={labelStyle}>Mağaza Logosu</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                <div style={{ 
                  width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#f1f5f9', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', 
                  border: '2px dashed #cbd5e1', overflow: 'hidden', position: 'relative'
                }}>
                  {logoPreview ? (
                    <img src={logoPreview} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <FaImage size={24} />
                  )}
                </div>
                <div>
                  <label style={{ padding: '8px 16px', backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '8px', fontWeight: '600', color: '#475569', cursor: 'pointer', marginRight: '12px', display: 'inline-block' }}>
                    <FaCamera style={{ marginRight: 6 }} /> Logo Yükle
                    <input type="file" accept="image/*" onChange={handleLogoChange} style={{ display: 'none' }} />
                  </label>
                  {logoPreview && (
                    <button type="button" onClick={() => { setLogoFile(null); setLogoPreview(null); }} style={{ padding: '8px 16px', backgroundColor: 'transparent', border: 'none', color: '#ef4444', fontWeight: '600', cursor: 'pointer' }}>
                      <FaTimes /> Kaldır
                    </button>
                  )}
                  <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '8px' }}>Önerilen boyut: 400x400px. Max: 2MB</p>
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
              <div>
                <label style={labelStyle}>Yetkili Ad Soyad</label>
                <div style={{ position: 'relative' }}>
                  <FaUser style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                  <input type="text" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} style={inputStyle} placeholder="Ad Soyad" />
                </div>
              </div>
              <div>
                <label style={labelStyle}>Mağaza / Şirket Adı</label>
                <div style={{ position: 'relative' }}>
                  <FaStore style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                  <input type="text" value={form.company_name} onChange={(e) => setForm({...form, company_name: e.target.value})} style={inputStyle} placeholder="Şirket Adı" />
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
              <div>
                <label style={labelStyle}>Telefon</label>
                <div style={{ position: 'relative' }}>
                  <FaPhone style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                  <input type="text" value={form.phone} onChange={(e) => setForm({...form, phone: e.target.value})} style={inputStyle} placeholder="05xx xxx xx xx" />
                </div>
              </div>
              <div>
                <label style={labelStyle}>Vergi Numarası</label>
                <div style={{ position: 'relative' }}>
                  <FaIdCard style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                  <input type="text" value={form.tax_id} onChange={(e) => setForm({...form, tax_id: e.target.value})} style={inputStyle} placeholder="Vergi No" />
                </div>
              </div>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={labelStyle}>E-posta Adresi</label>
              <div style={{ position: 'relative' }}>
                <FaEnvelope style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input type="email" value={vendor?.email || ''} disabled style={{ ...inputStyle, backgroundColor: '#f8fafc', color: '#94a3b8' }} />
              </div>
              <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>E-posta adresi değiştirilemez.</p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button type="submit" disabled={isSaving} style={{ 
                backgroundColor: '#14532d', color: 'white', border: 'none', padding: '12px 32px', borderRadius: '10px', fontWeight: '600', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 12px rgba(20, 83, 45, 0.2)', opacity: isSaving ? 0.7 : 1
              }}>
                {isSaving ? <FaSpinner className="spin" /> : <FaSave />} {isSaving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Address Tab */}
      {activeTab === 'address' && (
        <div style={{ backgroundColor: 'white', padding: '32px', borderRadius: '24px', border: '1px solid #f1f5f9' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '24px' }}>
            <FaMapMarkerAlt style={{ marginRight: 8, color: '#059669' }} />
            {editingAddressId ? 'Adresi Düzenle' : 'Yeni Adres Ekle'}
          </h3>
          
          <form onSubmit={handleAddressSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={labelStyle}>Adres Etiketi</label>
                <input type="text" value={addressForm.label} onChange={(e) => setAddressForm({...addressForm, label: e.target.value})} style={{ ...inputStyle, paddingLeft: 12 }} placeholder="Örn: İş Yeri, Depo" />
              </div>
              <div>
                <label style={labelStyle}>Ülke</label>
                <input type="text" value={addressForm.country} onChange={(e) => setAddressForm({...addressForm, country: e.target.value})} style={{ ...inputStyle, paddingLeft: 12 }} placeholder="Türkiye" />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={labelStyle}>Şehir</label>
                <input type="text" value={addressForm.city} onChange={(e) => setAddressForm({...addressForm, city: e.target.value})} style={{ ...inputStyle, paddingLeft: 12 }} placeholder="İstanbul" required />
              </div>
              <div>
                <label style={labelStyle}>Posta Kodu</label>
                <input type="text" value={addressForm.postal_code} onChange={(e) => setAddressForm({...addressForm, postal_code: e.target.value})} style={{ ...inputStyle, paddingLeft: 12 }} placeholder="34000" />
              </div>
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={labelStyle}>Açık Adres</label>
              <textarea value={addressForm.address_line} onChange={(e) => setAddressForm({...addressForm, address_line: e.target.value})} style={{ ...inputStyle, paddingLeft: 12, minHeight: 80 }} placeholder="Mahalle, cadde, sokak, bina no..." required />
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <button type="submit" style={{ backgroundColor: '#059669', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>
                <FaPlus style={{ marginRight: 6 }} /> {editingAddressId ? 'Güncelle' : 'Adres Ekle'}
              </button>
              {editingAddressId && (
                <button type="button" onClick={resetAddressForm} style={{ backgroundColor: '#f1f5f9', color: '#64748b', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>
                  İptal
                </button>
              )}
            </div>
          </form>

          {/* Address List */}
          {(vendor?.addresses || []).length > 0 && (
            <div style={{ marginTop: '32px' }}>
              <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px', color: '#64748b' }}>Kayıtlı Adresler</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {vendor.addresses.map((addr) => (
                  <div key={addr.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                    <div>
                      <div style={{ fontWeight: '600', color: '#0f172a' }}>{addr.label} {addr.is_primary && <span style={{ fontSize: 11, backgroundColor: '#dcfce7', color: '#059669', padding: '2px 8px', borderRadius: 12, marginLeft: 8 }}>Birincil</span>}</div>
                      <div style={{ fontSize: '13px', color: '#64748b', marginTop: 4 }}>{addr.address_line}, {addr.city}, {addr.country}</div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => editAddress(addr)} style={{ padding: '8px', backgroundColor: '#eff6ff', color: '#2563eb', border: 'none', borderRadius: '6px', cursor: 'pointer' }}><FaEdit /></button>
                      <button onClick={() => deleteAddressMutation.mutate(addr.id)} style={{ padding: '8px', backgroundColor: '#fef2f2', color: '#dc2626', border: 'none', borderRadius: '6px', cursor: 'pointer' }}><FaTrash /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Bank Tab */}
      {activeTab === 'bank' && (
        <div style={{ backgroundColor: 'white', padding: '32px', borderRadius: '24px', border: '1px solid #f1f5f9' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '24px' }}>
            <FaUniversity style={{ marginRight: 8, color: '#059669' }} />
            {editingBankId ? 'Banka Hesabını Düzenle' : 'Yeni Banka Hesabı Ekle'}
          </h3>
          
          <form onSubmit={handleBankSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={labelStyle}>Banka Adı</label>
                <input type="text" value={bankForm.bank_name} onChange={(e) => setBankForm({...bankForm, bank_name: e.target.value})} style={{ ...inputStyle, paddingLeft: 12 }} placeholder="Örn: Ziraat Bankası" required />
              </div>
              <div>
                <label style={labelStyle}>Hesap Sahibi</label>
                <input type="text" value={bankForm.account_holder} onChange={(e) => setBankForm({...bankForm, account_holder: e.target.value})} style={{ ...inputStyle, paddingLeft: 12 }} placeholder="Ad Soyad" required />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={labelStyle}>IBAN</label>
                <input type="text" value={bankForm.iban} onChange={(e) => setBankForm({...bankForm, iban: e.target.value.toUpperCase()})} style={{ ...inputStyle, paddingLeft: 12 }} placeholder="TR00 0000 0000 0000 0000 0000 00" required />
              </div>
              <div>
                <label style={labelStyle}>Para Birimi</label>
                <select value={bankForm.currency} onChange={(e) => setBankForm({...bankForm, currency: e.target.value})} style={{ ...inputStyle, paddingLeft: 12 }}>
                  <option value="TRY">TRY (₺)</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <button type="submit" style={{ backgroundColor: '#059669', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>
                <FaPlus style={{ marginRight: 6 }} /> {editingBankId ? 'Güncelle' : 'Hesap Ekle'}
              </button>
              {editingBankId && (
                <button type="button" onClick={resetBankForm} style={{ backgroundColor: '#f1f5f9', color: '#64748b', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>
                  İptal
                </button>
              )}
            </div>
          </form>

          {/* Bank List */}
          {(vendor?.bank_accounts || []).length > 0 && (
            <div style={{ marginTop: '32px' }}>
              <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px', color: '#64748b' }}>Kayıtlı Banka Hesapları</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {vendor.bank_accounts.map((bank) => (
                  <div key={bank.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                    <div>
                      <div style={{ fontWeight: '600', color: '#0f172a' }}>{bank.bank_name} {bank.is_primary && <span style={{ fontSize: 11, backgroundColor: '#dcfce7', color: '#059669', padding: '2px 8px', borderRadius: 12, marginLeft: 8 }}>Birincil</span>}</div>
                      <div style={{ fontSize: '13px', color: '#64748b', marginTop: 4 }}>{bank.account_holder} • {bank.iban}</div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => editBank(bank)} style={{ padding: '8px', backgroundColor: '#eff6ff', color: '#2563eb', border: 'none', borderRadius: '6px', cursor: 'pointer' }}><FaEdit /></button>
                      <button onClick={() => deleteBankMutation.mutate(bank.id)} style={{ padding: '8px', backgroundColor: '#fef2f2', color: '#dc2626', border: 'none', borderRadius: '6px', cursor: 'pointer' }}><FaTrash /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default VendorSettings;
