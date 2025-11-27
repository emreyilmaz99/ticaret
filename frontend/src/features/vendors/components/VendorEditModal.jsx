import React, { useState, useEffect, useRef } from 'react';
import { FaTimes, FaUser, FaMapMarkerAlt, FaCreditCard, FaPlus, FaTrash, FaCheck, FaChevronDown } from 'react-icons/fa';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateVendor } from '../api/vendorApi';
import { TURKEY_CITIES, COUNTRIES } from '../../../data/turkey_locations';
import { 
  ZiraatIcon, GarantiIcon, IsBankasiIcon, AkbankIcon, YapiKrediIcon, 
  VakifBankIcon, HalkbankIcon, QNBIcon, OtherBankIcon, getBankIcon 
} from './BankIcons';

// Banka Listesi (İkon eşleşmesi için)
const BANK_LIST = [
  { name: 'Ziraat Bankası', icon: <ZiraatIcon /> },
  { name: 'Garanti BBVA', icon: <GarantiIcon /> },
  { name: 'İş Bankası', icon: <IsBankasiIcon /> },
  { name: 'Akbank', icon: <AkbankIcon /> },
  { name: 'Yapı Kredi', icon: <YapiKrediIcon /> },
  { name: 'VakıfBank', icon: <VakifBankIcon /> },
  { name: 'Halkbank', icon: <HalkbankIcon /> },
  { name: 'QNB Finansbank', icon: <QNBIcon /> },
];

// --- ARAMALI SELECT COMPONENT ---
const SearchableSelect = ({ options, value, onChange, placeholder, disabled = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const wrapperRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      setSearchTerm('');
    }
  }, [isOpen]);

  const filteredOptions = options.filter(opt => 
    opt.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div ref={wrapperRef} style={{ position: 'relative', width: '100%' }}>
      <div 
        onClick={() => !disabled && setIsOpen(!isOpen)}
        style={{
          ...inputStyle,
          cursor: disabled ? 'not-allowed' : 'pointer',
          backgroundColor: disabled ? '#f1f5f9' : 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <span style={{ color: value ? '#0f172a' : '#94a3b8' }}>
          {value || placeholder}
        </span>
        <FaChevronDown size={12} color="#94a3b8" />
      </div>

      {isOpen && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          zIndex: 50,
          backgroundColor: 'white',
          border: '1px solid #e2e8f0',
          borderRadius: '8px',
          marginTop: '4px',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
          maxHeight: '250px',
          overflowY: 'auto'
        }}>
          <div style={{ padding: '8px', position: 'sticky', top: 0, backgroundColor: 'white', borderBottom: '1px solid #f1f5f9' }}>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Ara..."
              autoFocus
              style={{
                width: '100%',
                padding: '8px',
                borderRadius: '6px',
                border: '1px solid #e2e8f0',
                fontSize: '13px',
                outline: 'none'
              }}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          {filteredOptions.length > 0 ? (
            filteredOptions.map((opt, idx) => (
              <div
                key={idx}
                onClick={() => {
                  onChange(opt);
                  setIsOpen(false);
                }}
                style={{
                  padding: '10px 12px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  color: '#334155',
                  backgroundColor: value === opt ? '#f8fafc' : 'transparent',
                  transition: 'background-color 0.1s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = value === opt ? '#f8fafc' : 'transparent'}
              >
                {opt}
              </div>
            ))
          ) : (
            <div style={{ padding: '12px', color: '#94a3b8', fontSize: '13px', textAlign: 'center' }}>
              Sonuç bulunamadı.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const VendorEditModal = ({ vendor, onClose }) => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('general');
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    commission_rate: 0,
    status: 'active',
    password: '',
    password_confirmation: '',
    addresses: [],
    bank_accounts: []
  });

  useEffect(() => {
    if (vendor) {
      setFormData({
        name: vendor.storeName || vendor.name || '',
        email: vendor.email || '',
        phone: vendor.phone || '',
        commission_rate: vendor.commissionRate || 0,
        status: vendor.status || 'active',
        password: '',
        password_confirmation: '',
        addresses: vendor.addresses || [],
        bank_accounts: vendor.bank_accounts || []
      });
    }
  }, [vendor]);

  const updateMutation = useMutation({
    mutationFn: (data) => updateVendor(vendor.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['vendors']);
      onClose();
    },
    onError: (err) => {
      alert('Güncelleme hatası: ' + (err.response?.data?.message || err.message));
    }
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

  // --- ADRES İŞLEMLERİ ---
  const addAddress = () => {
    setFormData(prev => ({
      ...prev,
      addresses: [...prev.addresses, { 
        label: 'Yeni Adres', 
        country: 'Türkiye', 
        city: '', 
        district: '', // İlçe
        neighborhood: '', // Mahalle
        address_line: '', 
        postal_code: '', 
        is_primary: prev.addresses.length === 0 
      }]
    }));
  };

  const updateAddress = (index, field, value) => {
    const newAddresses = [...formData.addresses];
    
    // Şehir değişirse ilçeyi sıfırla
    if (field === 'city' && newAddresses[index].city !== value) {
      newAddresses[index].district = '';
    }
    
    // Ülke değişirse şehir ve ilçeyi sıfırla
    if (field === 'country' && newAddresses[index].country !== value) {
      newAddresses[index].city = '';
      newAddresses[index].district = '';
    }

    newAddresses[index] = { ...newAddresses[index], [field]: value };
    setFormData({ ...formData, addresses: newAddresses });
  };

  const setPrimaryAddress = (index) => {
    const newAddresses = formData.addresses.map((addr, i) => ({
      ...addr,
      is_primary: i === index
    }));
    setFormData({ ...formData, addresses: newAddresses });
  };

  const removeAddress = (index) => {
    const newAddresses = formData.addresses.filter((_, i) => i !== index);
    setFormData({ ...formData, addresses: newAddresses });
  };

  // --- BANKA İŞLEMLERİ ---
  const addBankAccount = () => {
    setFormData(prev => ({
      ...prev,
      bank_accounts: [...prev.bank_accounts, { 
        bank_name: '', 
        iban: '', 
        account_holder: prev.name, 
        is_primary: prev.bank_accounts.length === 0 
      }]
    }));
  };

  const updateBankAccount = (index, field, value) => {
    const newAccounts = [...formData.bank_accounts];
    newAccounts[index] = { ...newAccounts[index], [field]: value };
    setFormData({ ...formData, bank_accounts: newAccounts });
  };

  const setPrimaryBankAccount = (index) => {
    const newAccounts = formData.bank_accounts.map((acc, i) => ({
      ...acc,
      is_primary: i === index
    }));
    setFormData({ ...formData, bank_accounts: newAccounts });
  };

  const removeBankAccount = (index) => {
    const newAccounts = formData.bank_accounts.filter((_, i) => i !== index);
    setFormData({ ...formData, bank_accounts: newAccounts });
  };

  // Helper to get districts for a selected city
  const getDistrictsForCity = (cityName) => {
    const city = TURKEY_CITIES.find(c => c.name === cityName);
    return city ? city.districts : [];
  };

  if (!vendor) return null;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
      backdropFilter: 'blur(4px)'
    }}>
      <div style={{
        backgroundColor: 'white', width: '900px', maxHeight: '90vh', borderRadius: '16px',
        display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
      }}>
        
        {/* HEADER */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f8fafc' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#0f172a', margin: 0 }}>
            Satıcı Düzenle: <span style={{ color: '#3b82f6' }}>{vendor.storeName}</span>
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
            <FaTimes size={20} />
          </button>
        </div>

        {/* TABS */}
        <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0', padding: '0 24px' }}>
          {[
            { id: 'general', label: 'Genel Bilgiler', icon: <FaUser /> },
            { id: 'address', label: 'Adres Bilgileri', icon: <FaMapMarkerAlt /> },
            { id: 'payment', label: 'Ödeme & Banka', icon: <FaCreditCard /> }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '16px 24px',
                background: 'none',
                border: 'none',
                borderBottom: activeTab === tab.id ? '2px solid #3b82f6' : '2px solid transparent',
                color: activeTab === tab.id ? '#3b82f6' : '#64748b',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s'
              }}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* CONTENT */}
        <div style={{ padding: '24px', overflowY: 'auto', flex: 1 }}>
          <form onSubmit={handleSubmit}>
            
            {/* --- GENEL BİLGİLER TAB --- */}
            {activeTab === 'general' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={labelStyle}>Mağaza Adı</label>
                  <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} style={inputStyle} />
                </div>
                
                <div>
                  <label style={labelStyle}>E-posta</label>
                  <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} style={inputStyle} />
                </div>
                
                <div>
                  <label style={labelStyle}>Telefon</label>
                  <input type="text" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} style={inputStyle} />
                </div>

                <div>
                  <label style={labelStyle}>Komisyon Oranı (%)</label>
                  <input type="number" value={formData.commission_rate} onChange={e => setFormData({...formData, commission_rate: e.target.value})} style={inputStyle} />
                </div>

                <div>
                  <label style={labelStyle}>Durum</label>
                  <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} style={inputStyle}>
                    <option value="active">Aktif</option>
                    <option value="pending">Onay Bekliyor</option>
                    <option value="suspended">Askıya Alındı</option>
                  </select>
                </div>

                <div style={{ gridColumn: '1 / -1', marginTop: '16px', padding: '20px', backgroundColor: '#fff1f2', borderRadius: '12px', border: '1px solid #fecdd3' }}>
                  <h4 style={{ margin: '0 0 16px 0', color: '#be123c', fontSize: '14px', fontWeight: '700' }}>Güvenlik (Şifre Değiştirme)</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                    <div>
                      <label style={{...labelStyle, color: '#be123c'}}>Yeni Şifre</label>
                      <input type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} style={{...inputStyle, borderColor: '#fecdd3'}} placeholder="Değiştirmek istemiyorsanız boş bırakın" />
                    </div>
                    <div>
                      <label style={{...labelStyle, color: '#be123c'}}>Şifre Tekrar</label>
                      <input type="password" value={formData.password_confirmation} onChange={e => setFormData({...formData, password_confirmation: e.target.value})} style={{...inputStyle, borderColor: '#fecdd3'}} placeholder="Tekrar girin" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* --- ADRES BİLGİLERİ TAB --- */}
            {activeTab === 'address' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '700', margin: 0 }}>Kayıtlı Adresler</h3>
                  <button type="button" onClick={addAddress} style={addButtonStyle}><FaPlus /> Yeni Adres Ekle</button>
                </div>

                {formData.addresses.map((addr, index) => (
                  <div key={index} style={{ backgroundColor: '#f8fafc', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '16px', position: 'relative' }}>
                    <div style={{ position: 'absolute', top: '20px', right: '20px', display: 'flex', gap: '8px' }}>
                      <button 
                        type="button" 
                        onClick={() => setPrimaryAddress(index)}
                        style={{ 
                          padding: '6px 12px', 
                          borderRadius: '6px', 
                          border: 'none', 
                          backgroundColor: addr.is_primary ? '#dcfce7' : '#e2e8f0', 
                          color: addr.is_primary ? '#16a34a' : '#64748b',
                          fontWeight: '600',
                          fontSize: '12px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        {addr.is_primary ? <><FaCheck /> Varsayılan</> : 'Varsayılan Yap'}
                      </button>
                      <button type="button" onClick={() => removeAddress(index)} style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}><FaTrash /></button>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '24px' }}>
                      <div>
                        <label style={labelStyle}>Adres Başlığı</label>
                        <input type="text" value={addr.label || ''} onChange={e => updateAddress(index, 'label', e.target.value)} style={inputStyle} placeholder="Örn: Merkez Ofis" />
                      </div>
                      
                      {/* ÜLKE SEÇİMİ */}
                      <div>
                        <label style={labelStyle}>Ülke</label>
                        <SearchableSelect 
                          options={COUNTRIES}
                          value={addr.country}
                          onChange={(val) => updateAddress(index, 'country', val)}
                          placeholder="Ülke Seçiniz"
                        />
                      </div>

                      {/* ŞEHİR SEÇİMİ */}
                      <div>
                        <label style={labelStyle}>Şehir</label>
                        {addr.country === 'Türkiye' ? (
                          <SearchableSelect 
                            options={TURKEY_CITIES.map(c => c.name)}
                            value={addr.city}
                            onChange={(val) => updateAddress(index, 'city', val)}
                            placeholder="Şehir Seçiniz"
                          />
                        ) : (
                          <input type="text" value={addr.city || ''} onChange={e => updateAddress(index, 'city', e.target.value)} style={inputStyle} />
                        )}
                      </div>

                      {/* İLÇE SEÇİMİ */}
                      <div>
                        <label style={labelStyle}>İlçe</label>
                        {addr.country === 'Türkiye' && addr.city ? (
                          <SearchableSelect 
                            options={getDistrictsForCity(addr.city)}
                            value={addr.district}
                            onChange={(val) => updateAddress(index, 'district', val)}
                            placeholder="İlçe Seçiniz"
                          />
                        ) : (
                          <input 
                            type="text" 
                            value={addr.district || ''} 
                            onChange={e => updateAddress(index, 'district', e.target.value)} 
                            style={inputStyle} 
                            disabled={addr.country === 'Türkiye' && !addr.city}
                            placeholder={addr.country === 'Türkiye' && !addr.city ? 'Önce Şehir Seçiniz' : ''}
                          />
                        )}
                      </div>

                      {/* MAHALLE (Manuel Giriş - Veri çok büyük olduğu için) */}
                      <div>
                        <label style={labelStyle}>Mahalle</label>
                        <input type="text" value={addr.neighborhood || ''} onChange={e => updateAddress(index, 'neighborhood', e.target.value)} style={inputStyle} placeholder="Mahalle giriniz" />
                      </div>

                      <div>
                        <label style={labelStyle}>Posta Kodu</label>
                        <input type="text" value={addr.postal_code || ''} onChange={e => updateAddress(index, 'postal_code', e.target.value)} style={inputStyle} />
                      </div>

                      <div style={{ gridColumn: '1 / -1' }}>
                        <label style={labelStyle}>Açık Adres</label>
                        <textarea rows="2" value={addr.address_line || ''} onChange={e => updateAddress(index, 'address_line', e.target.value)} style={inputStyle}></textarea>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* --- ÖDEME & BANKA TAB --- */}
            {activeTab === 'payment' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '700', margin: 0 }}>Banka Hesapları</h3>
                  <button type="button" onClick={addBankAccount} style={addButtonStyle}><FaPlus /> Yeni Hesap Ekle</button>
                </div>

                {formData.bank_accounts.map((acc, index) => (
                  <div key={index} style={{ backgroundColor: '#f8fafc', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '16px', position: 'relative' }}>
                    <div style={{ position: 'absolute', top: '20px', right: '20px', display: 'flex', gap: '8px' }}>
                      <button 
                        type="button" 
                        onClick={() => setPrimaryBankAccount(index)}
                        style={{ 
                          padding: '6px 12px', 
                          borderRadius: '6px', 
                          border: 'none', 
                          backgroundColor: acc.is_primary ? '#dcfce7' : '#e2e8f0', 
                          color: acc.is_primary ? '#16a34a' : '#64748b',
                          fontWeight: '600',
                          fontSize: '12px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        {acc.is_primary ? <><FaCheck /> Varsayılan</> : 'Varsayılan Yap'}
                      </button>
                      <button type="button" onClick={() => removeBankAccount(index)} style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}><FaTrash /></button>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '24px' }}>
                      <div>
                        <label style={labelStyle}>Banka Adı</label>
                        <div style={{ position: 'relative' }}>
                          <select 
                            value={acc.bank_name || ''} 
                            onChange={e => updateBankAccount(index, 'bank_name', e.target.value)} 
                            style={{...inputStyle, paddingLeft: '40px'}}
                          >
                            <option value="">Seçiniz...</option>
                            {BANK_LIST.map(b => <option key={b.name} value={b.name}>{b.name}</option>)}
                            <option value="Diğer">Diğer</option>
                          </select>
                          <div style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                            {getBankIcon(acc.bank_name, 20)}
                          </div>
                        </div>
                      </div>
                      <div>
                        <label style={labelStyle}>Hesap Sahibi</label>
                        <input type="text" value={acc.account_holder || ''} onChange={e => updateBankAccount(index, 'account_holder', e.target.value)} style={inputStyle} />
                      </div>
                      <div style={{ gridColumn: '1 / -1' }}>
                        <label style={labelStyle}>IBAN</label>
                        <input type="text" value={acc.iban || ''} onChange={e => updateBankAccount(index, 'iban', e.target.value)} style={{...inputStyle, fontFamily: 'monospace', letterSpacing: '1px'}} placeholder="TR00 0000 0000 0000 0000 00" />
                      </div>
                    </div>
                  </div>
                ))}

                {/* BANKA LOGOLARI MARQUEE */}
                <div style={{ marginTop: '40px', overflow: 'hidden', whiteSpace: 'nowrap', position: 'relative', padding: '20px 0', borderTop: '1px solid #f1f5f9' }}>
                  <div style={{ 
                    display: 'inline-flex', 
                    gap: '40px', 
                    animation: 'scroll 20s linear infinite',
                  }}>
                    {[...BANK_LIST, ...BANK_LIST].map((bank, i) => (
                      <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', opacity: 0.8 }}>
                        <div style={{ 
                          width: '60px', 
                          height: '60px', 
                          borderRadius: '12px', 
                          backgroundColor: 'white', 
                          border: '1px solid #e2e8f0',
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
                        }}>
                          {React.cloneElement(bank.icon, { size: 32 })}
                        </div>
                        <span style={{ fontSize: '11px', fontWeight: '600', color: '#64748b' }}>{bank.name}</span>
                      </div>
                    ))}
                  </div>
                  <style>{`
                    @keyframes scroll {
                      0% { transform: translateX(0); }
                      100% { transform: translateX(-50%); }
                    }
                  `}</style>
                </div>
              </div>
            )}

            {/* FOOTER ACTIONS */}
            <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button type="button" onClick={onClose} style={{ padding: '12px 24px', borderRadius: '8px', border: '1px solid #e2e8f0', backgroundColor: 'white', color: '#64748b', fontWeight: '600', cursor: 'pointer' }}>İptal</button>
              <button type="submit" style={{ padding: '12px 32px', borderRadius: '8px', border: 'none', backgroundColor: '#3b82f6', color: 'white', fontWeight: '600', cursor: 'pointer', boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)' }}>
                {updateMutation.isLoading ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

// Styles
const labelStyle = { display: 'block', fontSize: '13px', fontWeight: '600', color: '#475569', marginBottom: '6px' };
const inputStyle = { width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none', transition: 'border-color 0.2s' };
const addButtonStyle = { padding: '8px 16px', backgroundColor: '#eff6ff', color: '#3b82f6', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' };

export default VendorEditModal;