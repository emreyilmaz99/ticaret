import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { vendorRegister } from '../../features/vendor/api/vendorAuthApi';
import { useToast } from '../../components/Toast';
import { FaStore, FaUser, FaEnvelope, FaLock, FaPhone, FaArrowRight, FaArrowLeft, FaCheckCircle } from 'react-icons/fa';

const VendorRegister = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    full_name: '',
    company_name: '',
    email: '',
    phone: '',
    tax_id: '',
    password: '',
    password_confirmation: ''
  });
  const [acceptTerms, setAcceptTerms] = useState(false);

  const registerMutation = useMutation({
    mutationFn: (data) => vendorRegister(data),
    onSuccess: (response) => {
      toast.success('Ön Başvurunuz Alındı!', 'Admin onayından sonra e-posta adresinize bilgilendirme gönderilecektir.', 5000);
      setTimeout(() => {
        navigate('/', { state: { message: 'Ön başvurunuz başarıyla alındı. Lütfen e-postanızı kontrol edin.' } });
      }, 600);
    },
    onError: (err) => {
      const errorMsg = err.response?.data?.message || err.message || 'Bir hata oluştu';
      toast.error('Başvuru Başarısız', errorMsg, 5000);
    }
  });

  const next = () => setStep((s) => Math.min(2, s + 1));
  const back = () => setStep((s) => Math.max(1, s - 1));

  const handleSubmit = (e) => {
    e.preventDefault();

    if (form.password !== form.password_confirmation) {
      toast.warning('Uyarı', 'Şifreler eşleşmiyor!', 4000);
      return;
    }

    if (form.password.length < 8) {
      toast.warning('Uyarı', 'Şifre en az 8 karakter olmalıdır!', 4000);
      return;
    }

    const payload = {
      full_name: form.full_name,
      email: form.email,
      company_name: form.company_name || null,
      phone: form.phone || null,
      tax_id: form.tax_id || null,
      password: form.password,
      password_confirmation: form.password_confirmation,
    };

    registerMutation.mutate(payload);
  };

  // Styles
  const styles = {
    container: {
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f0fdf4', // Emerald 50
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
      backgroundColor: '#d1fae5', // Emerald 100
      color: '#047857', // Emerald 700
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
      color: '#064e3b', // Emerald 900
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
      borderColor: '#059669', // Emerald 600
      boxShadow: '0 0 0 4px rgba(5, 150, 105, 0.1)',
      backgroundColor: 'white'
    },
    row: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '20px'
    },
    buttonPrimary: {
      width: '100%',
      padding: '16px',
      backgroundColor: '#047857', // Emerald 700
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
    },
    buttonSecondary: {
      padding: '16px 24px',
      backgroundColor: 'white',
      color: '#475569',
      border: '1px solid #e2e8f0',
      borderRadius: '12px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s'
    },
    stepIndicator: {
      display: 'flex',
      justifyContent: 'center',
      gap: '8px',
      marginBottom: '32px'
    },
    stepDot: (isActive) => ({
      width: isActive ? '32px' : '10px',
      height: '10px',
      borderRadius: '5px',
      backgroundColor: isActive ? '#047857' : '#e2e8f0',
      transition: 'all 0.3s ease'
    })
  };

  // Helper for input focus state
  const handleFocus = (e) => {
    Object.assign(e.target.style, styles.inputFocus);
  };
  const handleBlur = (e) => {
    e.target.style.borderColor = '#e2e8f0';
    e.target.style.boxShadow = 'none';
    e.target.style.backgroundColor = '#f8fafc';
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        
        <div style={styles.header}>
          <div style={styles.iconWrapper}>
            <FaStore />
          </div>
          <h1 style={styles.title}>Satıcı Başvurusu</h1>
          <p style={styles.subtitle}>
            Platformumuzda mağazanızı açın ve satışa başlayın.<br/>
            <span style={{ fontSize: '14px', color: '#059669', fontWeight: '600' }}>
              {step === 1 ? 'Hesap Bilgileri' : 'Mağaza Detayları'}
            </span>
          </p>
        </div>

        <div style={styles.stepIndicator}>
          <div style={styles.stepDot(step === 1)}></div>
          <div style={styles.stepDot(step === 2)}></div>
        </div>

        <form onSubmit={handleSubmit}>
          {step === 1 && (
            <div style={{ animation: 'fadeIn 0.5s ease' }}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Ad Soyad</label>
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
                <label style={styles.label}>E-posta Adresi</label>
                <div style={styles.inputWrapper}>
                  <FaEnvelope style={styles.inputIcon} />
                  <input 
                    type="email"
                    style={styles.input} 
                    onFocus={handleFocus} 
                    onBlur={handleBlur}
                    value={form.email} 
                    onChange={(e) => setForm({...form, email: e.target.value})} 
                    required 
                    placeholder="ornek@sirket.com" 
                  />
                </div>
              </div>

              <button 
                type="button" 
                onClick={next} 
                disabled={!form.full_name || !form.email}
                style={{ ...styles.buttonPrimary, opacity: (!form.full_name || !form.email) ? 0.7 : 1 }}
              >
                Devam Et <FaArrowRight />
              </button>
            </div>
          )}

          {step === 2 && (
            <div style={{ animation: 'fadeIn 0.5s ease' }}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Mağaza / Şirket Adı <span style={{fontWeight: 400, color: '#94a3b8'}}>(Opsiyonel)</span></label>
                <div style={styles.inputWrapper}>
                  <FaStore style={styles.inputIcon} />
                  <input 
                    style={styles.input} 
                    onFocus={handleFocus} 
                    onBlur={handleBlur}
                    value={form.company_name} 
                    onChange={(e) => setForm({...form, company_name: e.target.value})} 
                    placeholder="Mağaza adınız" 
                  />
                </div>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Telefon Numarası <span style={{fontWeight: 400, color: '#94a3b8'}}>(Opsiyonel)</span></label>
                <div style={styles.inputWrapper}>
                  <FaPhone style={styles.inputIcon} />
                  <input 
                    style={styles.input} 
                    onFocus={handleFocus} 
                    onBlur={handleBlur}
                    value={form.phone} 
                    onChange={(e) => {
                      // Sadece rakam kabul et ve 11 haneden fazla yazdırma
                      const value = e.target.value.replace(/\D/g, '').slice(0, 11);
                      setForm({...form, phone: value});
                    }} 
                    placeholder="05xxxxxxxxx"
                    maxLength={11}
                  />
                </div>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Vergi Numarası <span style={{fontWeight: 400, color: '#94a3b8'}}>(Opsiyonel)</span></label>
                <div style={styles.inputWrapper}>
                  <span style={{...styles.inputIcon, fontSize: '14px', fontWeight: 'bold'}}>#</span>
                  <input 
                    style={styles.input} 
                    onFocus={handleFocus} 
                    onBlur={handleBlur}
                    value={form.tax_id} 
                    onChange={(e) => {
                      // Sadece rakam kabul et ve 10 haneden fazla yazdırma (Türk vergi numarası 10 hane)
                      const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                      setForm({...form, tax_id: value});
                    }} 
                    placeholder="Vergi numaranız"
                    maxLength={10}
                  />
                </div>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Şifre</label>
                <div style={styles.inputWrapper}>
                  <FaLock style={styles.inputIcon} />
                  <input 
                    type="password"
                    style={styles.input} 
                    onFocus={handleFocus} 
                    onBlur={handleBlur}
                    value={form.password} 
                    onChange={(e) => setForm({...form, password: e.target.value})} 
                    required
                    placeholder="En az 8 karakter" 
                    minLength={8}
                  />
                </div>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Şifre Tekrar</label>
                <div style={styles.inputWrapper}>
                  <FaLock style={styles.inputIcon} />
                  <input 
                    type="password"
                    style={styles.input} 
                    onFocus={handleFocus} 
                    onBlur={handleBlur}
                    value={form.password_confirmation} 
                    onChange={(e) => setForm({...form, password_confirmation: e.target.value})} 
                    required
                    placeholder="Şifrenizi tekrar girin" 
                  />
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
                  <span style={{ fontWeight: '600', color: '#047857' }}>Kullanım Şartları</span> ve <span style={{ fontWeight: '600', color: '#047857' }}>Gizlilik Politikası</span>'nı okudum ve kabul ediyorum.
                </label>
              </div>

              <div style={{ display: 'flex', gap: '16px' }}>
                <button 
                  type="button" 
                  onClick={back} 
                  style={styles.buttonSecondary}
                >
                  <FaArrowLeft />
                </button>
                <button 
                  type="submit" 
                  disabled={registerMutation.isPending || !acceptTerms} 
                  style={{ ...styles.buttonPrimary, flex: 1, opacity: (registerMutation.isPending || !acceptTerms) ? 0.7 : 1 }}
                >
                  {registerMutation.isPending ? 'İşleniyor...' : 'Başvuruyu Tamamla'} <FaCheckCircle />
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default VendorRegister;
