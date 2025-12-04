import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useToast } from '../../components/Toast';
import axios from '../../lib/axios';
import { FaStore, FaPhone, FaIdCard, FaMapMarkerAlt, FaCity, FaCheckCircle, FaMailBulk, FaUniversity, FaCreditCard, FaUser, FaLink, FaBuilding, FaUserTie, FaFileInvoice, FaArrowLeft, FaExclamationTriangle } from 'react-icons/fa';
import { cities, cityPlateCodes } from '../../data/turkeyData';

// Satıcı türleri
const MERCHANT_TYPES = {
  personal: { value: 'personal', label: 'Bireysel Satıcı', description: 'Şahıs olarak satış yapacaksınız' },
  private_company: { value: 'private_company', label: 'Şahıs Şirketi', description: 'Şahıs şirketi olarak satış yapacaksınız' },
  limited_company: { value: 'limited_company', label: 'Limited / Anonim Şirket', description: 'Tüzel kişilik olarak satış yapacaksınız' }
};

const VendorFullApplication = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [form, setForm] = useState({
    full_name: '',
    company_name: '',
    slug: '',
    phone: '',
    // iyzico SubMerchant fields
    merchant_type: '',
    identity_number: '',
    contact_name: '',
    contact_surname: '',
    tax_id: '',
    tax_office: '',
    legal_company_title: '',
    // Address fields
    address: '',
    city: '',
    district: '',
    postal_code: '',
    // Bank account fields
    bank_name: '',
    account_holder: '',
    iban: ''
  });
  const [acceptTerms, setAcceptTerms] = useState(false);

  // Fetch vendor status
  const { data: statusData, isLoading, error: statusError } = useQuery({
    queryKey: ['vendorStatus'],
    queryFn: async () => {
      const response = await axios.get('/v1/vendor/application/status');
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

  const submitMutation = useMutation({
    mutationFn: async (data) => {
      const response = await axios.post('/v1/vendor/application/submit-full', data);
      return response.data;
    },
    onSuccess: (data) => {
      toast.success('Tam Başvurunuz Tamamlandı!', 'Başvurunuz admin onayına gönderildi. Onaylandıktan sonra hesabınız aktifleştirilecektir.', 5000);
      setTimeout(() => navigate('/vendor/status'), 600);
    },
    onError: (err) => {
      const response = err.response?.data;
      const errorMsg = response?.message || err.message || 'Bir hata oluştu';
      toast.error('Tam Başvuru Başarısız', errorMsg, 5000);
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    submitMutation.mutate(form);
  };

  // Styles (Reused from VendorRegister for consistency)
  const styles = {
    container: {
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f0fdf4',
      fontFamily: '"Plus Jakarta Sans", sans-serif',
      padding: '20px'
    },
    card: {
      width: '100%',
      maxWidth: '600px',
      backgroundColor: 'white',
      borderRadius: '24px',
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      padding: '48px',
      position: 'relative',
      overflow: 'hidden'
    },
    header: {
      textAlign: 'center',
      marginBottom: '40px'
    },
    iconWrapper: {
      width: '64px',
      height: '64px',
      backgroundColor: '#d1fae5',
      color: '#047857',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '24px',
      margin: '0 auto 24px auto'
    },
    title: {
      fontFamily: '"Playfair Display", serif',
      fontSize: '32px',
      fontWeight: '700',
      color: '#064e3b',
      marginBottom: '8px'
    },
    subtitle: {
      color: '#64748b',
      fontSize: '16px',
      lineHeight: '1.5'
    },
    formGroup: {
      marginBottom: '20px'
    },
    label: {
      display: 'block',
      fontSize: '14px',
      fontWeight: '600',
      color: '#334155',
      marginBottom: '8px'
    },
    inputWrapper: {
      position: 'relative'
    },
    inputIcon: {
      position: 'absolute',
      left: '16px',
      top: '50%',
      transform: 'translateY(-50%)',
      color: '#94a3b8',
      fontSize: '16px'
    },
    input: {
      width: '100%',
      padding: '14px 16px 14px 48px',
      borderRadius: '12px',
      border: '1px solid #e2e8f0',
      fontSize: '15px',
      color: '#1e293b',
      transition: 'all 0.2s',
      outline: 'none',
      backgroundColor: '#f8fafc'
    },
    inputFocus: {
      borderColor: '#059669',
      boxShadow: '0 0 0 4px rgba(5, 150, 105, 0.1)',
      backgroundColor: 'white'
    },
    buttonPrimary: {
      width: '100%',
      padding: '16px',
      backgroundColor: '#047857',
      color: 'white',
      border: 'none',
      borderRadius: '12px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'background-color 0.2s',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px'
    }
  };

  const handleFocus = (e) => Object.assign(e.target.style, styles.inputFocus);
  const handleBlur = (e) => {
    e.target.style.borderColor = '#e2e8f0';
    e.target.style.boxShadow = 'none';
    e.target.style.backgroundColor = '#f8fafc';
  };

  if (isLoading) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.header}>
            <div style={styles.iconWrapper}>
              <FaStore />
            </div>
            <h1 style={styles.title}>Yükleniyor...</h1>
            <p style={styles.subtitle}>Hesap bilgileriniz getiriliyor.</p>
          </div>
        </div>
      </div>
    );
  }

  if (statusError) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.header}>
            <div style={{...styles.iconWrapper, backgroundColor: '#fee2e2', color: '#dc2626'}}>
              <FaExclamationTriangle />
            </div>
            <h1 style={{...styles.title, color: '#dc2626'}}>Hata Oluştu</h1>
            <p style={styles.subtitle}>Hesap bilgileriniz yüklenemedi. Lütfen giriş yapın.</p>
            <button 
              onClick={() => navigate('/vendor/login')}
              style={{...styles.buttonPrimary, marginTop: '24px', maxWidth: '200px', margin: '24px auto 0'}}
            >
              Giriş Yap
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (statusData && !statusData.can_submit_full_application) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.header}>
            <div style={{...styles.iconWrapper, backgroundColor: '#fef3c7', color: '#d97706'}}>
              <FaExclamationTriangle />
            </div>
            <h1 style={{...styles.title, color: '#d97706'}}>Erişim Engellendi</h1>
            <p style={styles.subtitle}>
              Mevcut hesap durumunuz: <strong>{statusData.vendor?.status_label}</strong>
              <br />
              Bu aşamada tam başvuru yapamazsınız.
            </p>
            <button 
              onClick={() => navigate('/vendor/status')}
              style={{...styles.buttonPrimary, marginTop: '24px', maxWidth: '200px', margin: '24px auto 0'}}
            >
              <FaArrowLeft /> Duruma Dön
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={{...styles.card, maxWidth: '700px'}}>
        {/* Back Button */}
        <button 
          onClick={() => navigate('/vendor/status')}
          style={{
            position: 'absolute',
            top: '24px',
            left: '24px',
            background: 'none',
            border: 'none',
            color: '#64748b',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '14px'
          }}
        >
          <FaArrowLeft /> Duruma Dön
        </button>

        <div style={styles.header}>
          <div style={styles.iconWrapper}>
            <FaStore />
          </div>
          <h1 style={styles.title}>Tam Başvuru Formu</h1>
          <p style={styles.subtitle}>
            Merhaba <strong>{statusData?.vendor?.full_name}</strong>! Hesabınızı aktifleştirmek için kalan bilgileri tamamlayın.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Temel Bilgiler */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Ad Soyad *</label>
            <div style={styles.inputWrapper}>
              <FaUser style={styles.inputIcon} />
              <input 
                style={styles.input} 
                onFocus={handleFocus} 
                onBlur={handleBlur}
                value={form.full_name} 
                onChange={(e) => setForm({...form, full_name: e.target.value})} 
                required 
                placeholder="Ad ve soyadınız" 
              />
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Şirket / Mağaza Adı *</label>
            <div style={styles.inputWrapper}>
              <FaStore style={styles.inputIcon} />
              <input 
                style={styles.input} 
                onFocus={handleFocus} 
                onBlur={handleBlur}
                value={form.company_name} 
                onChange={(e) => {
                  const value = e.target.value;
                  setForm({
                    ...form, 
                    company_name: value,
                    slug: value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
                  });
                }} 
                required 
                placeholder="Resmi şirket adı" 
              />
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Mağaza URL (Slug) *</label>
            <div style={styles.inputWrapper}>
              <FaLink style={styles.inputIcon} />
              <input 
                style={styles.input} 
                onFocus={handleFocus} 
                onBlur={handleBlur}
                value={form.slug} 
                onChange={(e) => setForm({...form, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '')})} 
                required 
                placeholder="magaza-adi" 
              />
            </div>
            <small style={{color: '#64748b', fontSize: '12px', marginTop: '4px', display: 'block'}}>
              Site adresiniz: yoursite.com/vendor/{form.slug || 'magaza-adi'}
            </small>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Telefon *</label>
            <div style={styles.inputWrapper}>
              <FaPhone style={styles.inputIcon} />
              <input 
                style={styles.input} 
                onFocus={handleFocus} 
                onBlur={handleBlur}
                value={form.phone} 
                onChange={(e) => setForm({...form, phone: e.target.value.replace(/\D/g, '').slice(0, 10)})} 
                maxLength={10}
                required 
                placeholder="5XX XXX XX XX" 
              />
            </div>
          </div>

          {/* Satıcı Türü Seçimi */}
          <div style={{...styles.subtitle, textAlign: 'left', marginTop: '32px', marginBottom: '16px', fontWeight: '600', color: '#047857'}}>
            🏢 Satıcı Türü Seçimi *
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '24px' }}>
            {Object.values(MERCHANT_TYPES).map((type) => (
              <div 
                key={type.value}
                onClick={() => setForm({...form, merchant_type: type.value})}
                style={{
                  padding: '16px',
                  borderRadius: '12px',
                  border: form.merchant_type === type.value ? '2px solid #047857' : '1px solid #e2e8f0',
                  backgroundColor: form.merchant_type === type.value ? '#f0fdf4' : '#f8fafc',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  textAlign: 'center'
                }}
              >
                <div style={{ fontSize: '24px', marginBottom: '8px' }}>
                  {type.value === 'personal' ? '👤' : type.value === 'private_company' ? '🏪' : '🏢'}
                </div>
                <div style={{ fontWeight: '600', color: '#1e293b', fontSize: '14px' }}>{type.label}</div>
                <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>{type.description}</div>
              </div>
            ))}
          </div>

          {/* Satıcı Türüne Göre Dinamik Alanlar */}
          {form.merchant_type && (
            <>
              <div style={{...styles.subtitle, textAlign: 'left', marginTop: '24px', marginBottom: '16px', fontWeight: '600', color: '#047857'}}>
                📋 {form.merchant_type === 'personal' ? 'Kişisel Bilgiler' : 'Şirket Bilgileri'}
              </div>

              {/* TC Kimlik - Personal ve Private Company için zorunlu */}
              {(form.merchant_type === 'personal' || form.merchant_type === 'private_company') && (
                <div style={styles.formGroup}>
                  <label style={styles.label}>TC Kimlik Numarası *</label>
                  <div style={styles.inputWrapper}>
                    <FaIdCard style={styles.inputIcon} />
                    <input 
                      style={styles.input} 
                      onFocus={handleFocus} 
                      onBlur={handleBlur}
                      value={form.identity_number} 
                      onChange={(e) => setForm({...form, identity_number: e.target.value.replace(/\D/g, '').slice(0, 11)})} 
                      maxLength={11}
                      required 
                      placeholder="11 haneli TC Kimlik No" 
                    />
                  </div>
                </div>
              )}

              {/* İletişim Kişisi - Sadece Personal için zorunlu */}
              {form.merchant_type === 'personal' && (
                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px'}}>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>İletişim Kişisi Adı *</label>
                    <div style={styles.inputWrapper}>
                      <FaUserTie style={styles.inputIcon} />
                      <input 
                        style={styles.input} 
                        onFocus={handleFocus} 
                        onBlur={handleBlur}
                        value={form.contact_name} 
                        onChange={(e) => setForm({...form, contact_name: e.target.value})} 
                        required 
                        placeholder="Ad" 
                      />
                    </div>
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>İletişim Kişisi Soyadı *</label>
                    <div style={styles.inputWrapper}>
                      <FaUserTie style={styles.inputIcon} />
                      <input 
                        style={styles.input} 
                        onFocus={handleFocus} 
                        onBlur={handleBlur}
                        value={form.contact_surname} 
                        onChange={(e) => setForm({...form, contact_surname: e.target.value})} 
                        required 
                        placeholder="Soyad" 
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Vergi Numarası - Sadece Limited için zorunlu */}
              {form.merchant_type === 'limited_company' && (
                <div style={styles.formGroup}>
                  <label style={styles.label}>Vergi Numarası *</label>
                  <div style={styles.inputWrapper}>
                    <FaFileInvoice style={styles.inputIcon} />
                    <input 
                      style={styles.input} 
                      onFocus={handleFocus} 
                      onBlur={handleBlur}
                      value={form.tax_id} 
                      onChange={(e) => setForm({...form, tax_id: e.target.value.replace(/\D/g, '').slice(0, 10)})} 
                      maxLength={10}
                      required 
                      placeholder="10 haneli Vergi No" 
                    />
                  </div>
                </div>
              )}

              {/* Vergi Dairesi ve Yasal Ünvan - Private ve Limited için zorunlu */}
              {(form.merchant_type === 'private_company' || form.merchant_type === 'limited_company') && (
                <>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Vergi Dairesi *</label>
                    <div style={styles.inputWrapper}>
                      <FaBuilding style={styles.inputIcon} />
                      <input 
                        style={styles.input} 
                        onFocus={handleFocus} 
                        onBlur={handleBlur}
                        value={form.tax_office} 
                        onChange={(e) => setForm({...form, tax_office: e.target.value})} 
                        required 
                        placeholder="Örn: Kadıköy Vergi Dairesi" 
                      />
                    </div>
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Yasal Şirket Ünvanı *</label>
                    <div style={styles.inputWrapper}>
                      <FaBuilding style={styles.inputIcon} />
                      <input 
                        style={styles.input} 
                        onFocus={handleFocus} 
                        onBlur={handleBlur}
                        value={form.legal_company_title} 
                        onChange={(e) => setForm({...form, legal_company_title: e.target.value})} 
                        required 
                        placeholder="Ticaret sicilindeki tam ünvan" 
                      />
                    </div>
                  </div>
                </>
              )}
            </>
          )}

          {/* Adres Bilgileri */}
          <div style={{...styles.subtitle, textAlign: 'left', marginTop: '32px', marginBottom: '16px', fontWeight: '600', color: '#047857'}}>
            📍 Adres Bilgileri
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Adres *</label>
            <div style={styles.inputWrapper}>
              <FaMapMarkerAlt style={styles.inputIcon} />
              <input 
                style={styles.input} 
                onFocus={handleFocus} 
                onBlur={handleBlur}
                value={form.address} 
                onChange={(e) => setForm({...form, address: e.target.value})} 
                required 
                placeholder="Mahalle, cadde, sokak, bina no, daire no" 
              />
            </div>
          </div>

          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px'}}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Şehir *</label>
              <div style={styles.inputWrapper}>
                <FaCity style={styles.inputIcon} />
                <select 
                  style={styles.input} 
                  onFocus={handleFocus} 
                  onBlur={handleBlur}
                  value={form.city} 
                  onChange={(e) => {
                    const city = e.target.value;
                    const postalCode = city && cityPlateCodes[city] ? cityPlateCodes[city] + '000' : '';
                    setForm({...form, city: city, postal_code: postalCode});
                  }} 
                  required 
                >
                  <option value="">Şehir Seçiniz</option>
                  {cities.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>İlçe</label>
              <div style={styles.inputWrapper}>
                <FaCity style={styles.inputIcon} />
                <input 
                  style={styles.input} 
                  onFocus={handleFocus} 
                  onBlur={handleBlur}
                  value={form.district} 
                  onChange={(e) => setForm({...form, district: e.target.value})} 
                  placeholder="İlçe adı" 
                />
              </div>
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Posta Kodu</label>
            <div style={styles.inputWrapper}>
              <FaMailBulk style={styles.inputIcon} />
              <input 
                style={styles.input} 
                onFocus={handleFocus} 
                onBlur={handleBlur}
                value={form.postal_code} 
                onChange={(e) => setForm({...form, postal_code: e.target.value})} 
                placeholder="34000" 
              />
            </div>
          </div>

          {/* Banka Hesap Bilgileri */}
          <div style={{...styles.subtitle, textAlign: 'left', marginTop: '32px', marginBottom: '16px', fontWeight: '600', color: '#047857'}}>
            🏦 Banka Hesap Bilgileri
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Banka Adı *</label>
            <div style={styles.inputWrapper}>
              <FaUniversity style={styles.inputIcon} />
              <input 
                style={styles.input} 
                onFocus={handleFocus} 
                onBlur={handleBlur}
                value={form.bank_name} 
                onChange={(e) => setForm({...form, bank_name: e.target.value})} 
                required 
                placeholder="Örn: Ziraat Bankası, Garanti BBVA" 
              />
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Hesap Sahibi *</label>
            <div style={styles.inputWrapper}>
              <FaUser style={styles.inputIcon} />
              <input 
                style={styles.input} 
                onFocus={handleFocus} 
                onBlur={handleBlur}
                value={form.account_holder} 
                onChange={(e) => setForm({...form, account_holder: e.target.value})} 
                required 
                placeholder="Hesap sahibinin adı soyadı" 
              />
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>IBAN *</label>
            <div style={styles.inputWrapper}>
              <FaCreditCard style={styles.inputIcon} />
              <input 
                style={styles.input} 
                onFocus={handleFocus} 
                onBlur={handleBlur}
                value={form.iban} 
                onChange={(e) => setForm({...form, iban: e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '')})} 
                required 
                placeholder="TR00 0000 0000 0000 0000 0000 00"
                maxLength={26}
              />
            </div>
            <small style={{color: '#64748b', fontSize: '12px', marginTop: '4px', display: 'block'}}>
              Ödemeleriniz bu hesaba aktarılacaktır. IBAN "TR" ile başlamalıdır.
            </small>
          </div>

          {/* Bilgilendirme Kutusu */}
          <div style={{ marginTop: '24px', marginBottom: '16px', padding: '16px', backgroundColor: '#fffbeb', borderRadius: '12px', border: '1px solid #fde68a' }}>
            <div style={{ fontSize: '14px', color: '#92400e', lineHeight: '1.6' }}>
              <strong>⚠️ Önemli:</strong> Girdiğiniz bilgiler ödeme sistemine (iyzico) kaydedilecektir. 
              Lütfen TC Kimlik, Vergi Numarası ve IBAN bilgilerinizin doğruluğundan emin olun.
            </div>
          </div>

          <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '16px', backgroundColor: '#f0fdf4', borderRadius: '12px', border: '1px solid #dcfce7' }}>
            <input 
              id="acceptTerms" 
              type="checkbox" 
              checked={acceptTerms} 
              onChange={(e) => setAcceptTerms(e.target.checked)} 
              style={{ marginTop: '4px', width: '18px', height: '18px', accentColor: '#047857', cursor: 'pointer' }} 
            />
            <label htmlFor="acceptTerms" style={{ fontSize: '14px', color: '#334155', lineHeight: '1.5', cursor: 'pointer' }}>
              Tüm bilgilerin doğruluğunu kabul ediyorum ve <span style={{fontWeight: '600', color: '#047857'}}>Satıcı Sözleşmesi</span>'ni okudum.
            </label>
          </div>

          <button 
            type="submit" 
            disabled={submitMutation.isPending || !acceptTerms || !form.merchant_type} 
            style={{ ...styles.buttonPrimary, opacity: (submitMutation.isPending || !acceptTerms || !form.merchant_type) ? 0.7 : 1 }}
          >
            {submitMutation.isPending ? 'Gönderiliyor...' : 'Başvuruyu Tamamla'} <FaCheckCircle />
          </button>
        </form>
      </div>
    </div>
  );
};

export default VendorFullApplication;
