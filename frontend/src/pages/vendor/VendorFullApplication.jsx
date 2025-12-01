import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { submitFullApplication } from '../../features/vendor/api/vendorAuthApi';
import { FaStore, FaLock, FaPhone, FaCheckCircle } from 'react-icons/fa';

const VendorFullApplication = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    company_name: '',
    tax_id: '',
    phone: '',
    password: '',
    password_confirmation: ''
  });
  const [acceptTerms, setAcceptTerms] = useState(false);

  const submitMutation = useMutation({
    mutationFn: (data) => submitFullApplication(id, data),
    onSuccess: (data) => {
      alert('Tam başvurunuz alındı! Admin onayı sonrası hesabınız aktif edilecektir.');
      navigate('/vendor/login');
    },
    onError: (err) => {
      alert('Başvuru başarısız: ' + (err.response?.data?.message || err.message));
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.password !== form.password_confirmation) {
      alert('Şifreler eşleşmiyor');
      return;
    }

    submitMutation.mutate({
      company_name: form.company_name,
      tax_id: form.tax_id,
      phone: form.phone,
      password: form.password
    });
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

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <div style={styles.iconWrapper}>
            <FaStore />
          </div>
          <h1 style={styles.title}>Tam Başvuru Formu</h1>
          <p style={styles.subtitle}>
            Ön başvurunuz onaylandı! Lütfen hesabınızı oluşturmak için kalan bilgileri tamamlayın.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Şirket / Mağaza Adı</label>
            <div style={styles.inputWrapper}>
              <FaStore style={styles.inputIcon} />
              <input 
                style={styles.input} 
                onFocus={handleFocus} 
                onBlur={handleBlur}
                value={form.company_name} 
                onChange={(e) => setForm({...form, company_name: e.target.value})} 
                required 
                placeholder="Resmi şirket adı" 
              />
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Vergi Numarası</label>
            <div style={styles.inputWrapper}>
              <span style={{...styles.inputIcon, fontSize: '14px', fontWeight: 'bold'}}>#</span>
              <input 
                style={styles.input} 
                onFocus={handleFocus} 
                onBlur={handleBlur}
                value={form.tax_id} 
                onChange={(e) => setForm({...form, tax_id: e.target.value})} 
                placeholder="Vergi numaranız" 
              />
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Telefon</label>
            <div style={styles.inputWrapper}>
              <FaPhone style={styles.inputIcon} />
              <input 
                style={styles.input} 
                onFocus={handleFocus} 
                onBlur={handleBlur}
                value={form.phone} 
                onChange={(e) => setForm({...form, phone: e.target.value})} 
                required 
                placeholder="05xx xxx xx xx" 
              />
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Şifre Belirleyin</label>
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
                placeholder="Güçlü bir şifre" 
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
                placeholder="Şifreyi doğrulayın" 
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
              Tüm bilgilerin doğruluğunu kabul ediyorum.
            </label>
          </div>

          <button 
            type="submit" 
            disabled={submitMutation.isPending || !acceptTerms} 
            style={{ ...styles.buttonPrimary, opacity: (submitMutation.isPending || !acceptTerms) ? 0.7 : 1 }}
          >
            {submitMutation.isPending ? 'Gönderiliyor...' : 'Başvuruyu Tamamla'} <FaCheckCircle />
          </button>
        </form>
      </div>
    </div>
  );
};

export default VendorFullApplication;
