import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { submitFullApplication } from '../../features/vendor/api/vendorAuthApi';
import axios from '../../lib/axios';
import { FaStore, FaPhone, FaIdCard, FaCheckCircle, FaUser, FaLink, FaMapMarkerAlt, FaCity, FaGlobe, FaMailBulk } from 'react-icons/fa';

const VendorFullApplication = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    full_name: '',
    company_name: '',
    slug: '',
    phone: '',
    tax_id: '',
    address_line: '',
    city: '',
    country: 'Türkiye',
    postal_code: ''
  });
  const [acceptTerms, setAcceptTerms] = useState(false);

  // Fetch pre-application data
  useEffect(() => {
    const fetchPreApplication = async () => {
      try {
        const response = await axios.get(`/v1/vendor-applications/${id}`);
        const app = response.data.data;
        
        // Pre-fill form with existing data
        setForm({
          full_name: app.full_name || '',
          company_name: app.company_name || '',
          slug: app.company_name ? app.company_name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : '',
          phone: app.phone || '',
          tax_id: app.tax_id || '',
          address_line: '',
          city: '',
          country: 'Türkiye',
          postal_code: ''
        });
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch pre-application:', error);
        const response = error.response?.data;
        
        // Check if vendor is already active
        if (response?.data?.redirect_to_dashboard) {
          alert('✅ Hesabınız Zaten Aktif\n\nDashboard sayfasına yönlendiriliyorsunuz.');
          navigate('/vendor/dashboard');
        } else {
          alert('Ön başvuru bilgileri yüklenemedi. Lütfen tekrar deneyin.');
          navigate('/vendor/login');
        }
      }
    };

    fetchPreApplication();
  }, [id, navigate]);

  const submitMutation = useMutation({
    mutationFn: (data) => submitFullApplication(id, data),
    onSuccess: (data) => {
      alert('✅ Tam Başvurunuz Tamamlandı!\n\nVendor hesabınız oluşturuldu.\nAdmin onayından sonra aktifleştirilecektir.\n\nE-posta adresinize bilgilendirme gönderilecektir.');
      navigate('/vendor/login');
    },
    onError: (err) => {
      const response = err.response?.data;
      
      // Check if vendor is already active
      if (response?.data?.redirect_to_dashboard) {
        alert('✅ Hesabınız Zaten Aktif\n\nDashboard sayfasına yönlendiriliyorsunuz.');
        navigate('/vendor/dashboard');
      } else {
        const errorMsg = response?.message || err.message || 'Bir hata oluştu';
        alert('❌ Tam Başvuru Başarısız:\n' + errorMsg);
      }
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

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.header}>
            <div style={styles.iconWrapper}>
              <FaStore />
            </div>
            <h1 style={styles.title}>Yükleniyor...</h1>
            <p style={styles.subtitle}>Ön başvuru bilgileriniz getiriliyor.</p>
          </div>
        </div>
      </div>
    );
  }

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
                onChange={(e) => setForm({...form, phone: e.target.value})} 
                required 
                placeholder="05xx xxx xx xx" 
              />
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Vergi Numarası <span style={{fontWeight: 400, color: '#94a3b8'}}>(Opsiyonel)</span></label>
            <div style={styles.inputWrapper}>
              <FaIdCard style={styles.inputIcon} />
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
                value={form.address_line} 
                onChange={(e) => setForm({...form, address_line: e.target.value})} 
                required 
                placeholder="Cadde, sokak, bina no" 
              />
            </div>
          </div>

          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px'}}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Şehir *</label>
              <div style={styles.inputWrapper}>
                <FaCity style={styles.inputIcon} />
                <input 
                  style={styles.input} 
                  onFocus={handleFocus} 
                  onBlur={handleBlur}
                  value={form.city} 
                  onChange={(e) => setForm({...form, city: e.target.value})} 
                  required 
                  placeholder="İstanbul" 
                />
              </div>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Posta Kodu <span style={{fontWeight: 400, color: '#94a3b8'}}>(Opsiyonel)</span></label>
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
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Ülke *</label>
            <div style={styles.inputWrapper}>
              <FaGlobe style={styles.inputIcon} />
              <input 
                style={styles.input} 
                onFocus={handleFocus} 
                onBlur={handleBlur}
                value={form.country} 
                onChange={(e) => setForm({...form, country: e.target.value})} 
                required 
                placeholder="Türkiye" 
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
              Tüm bilgilerin doğruluğunu kabul ediyorum ve <span style={{fontWeight: '600', color: '#047857'}}>Satıcı Sözleşmesi</span>'ni okudum.
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
