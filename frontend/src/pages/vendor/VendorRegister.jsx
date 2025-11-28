import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { vendorRegister } from '../../features/vendor/api/vendorAuthApi';
import { FaStore, FaUser, FaEnvelope, FaLock, FaPhone } from 'react-icons/fa';

const VendorRegister = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    store_name: '',
    tax_id: '',
    email: '',
    password: '',
    password_confirmation: '',
    phone: ''
  });
  const [acceptTerms, setAcceptTerms] = useState(false);

  const registerMutation = useMutation({
    mutationFn: (data) => vendorRegister(data),
    onSuccess: (data) => {
      alert(data.message || 'Kayıt başarılı. Admin onayı bekleniyor.');
      navigate('/vendor/login');
    },
    onError: (err) => {
      alert('Kayıt başarısız: ' + (err.response?.data?.message || err.message));
    }
  });

  const next = () => setStep((s) => Math.min(2, s + 1));
  const back = () => setStep((s) => Math.max(1, s - 1));

  const handleSubmit = (e) => {
    e.preventDefault();
    // Basic client-side checks
    if (form.password !== form.password_confirmation) {
      alert('Şifreler eşleşmiyor');
      return;
    }

    // Build payload: backend expects `name` and `company_name`
    const payload = {
      name: `${form.first_name} ${form.last_name}`.trim(),
      email: form.email,
      password: form.password,
      company_name: form.store_name || null,
      phone: form.phone || null,
      tax_id: form.tax_id || null
    };

    registerMutation.mutate(payload);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f7fdf6' }}>
      <div style={{ width: '760px', maxWidth: '95%', background: 'white', padding: '36px', borderRadius: '16px', boxShadow: '0 30px 60px rgba(0,0,0,0.06)' }}>
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <div style={{ width: 68, height: 68, margin: '0 auto 8px', borderRadius: 12, background: '#16a34a', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32 }}>
            <FaStore />
          </div>
          <h2 style={{ margin: 0, color: '#14532d' }}>Satıcı Başvurusu</h2>
          <p style={{ color: '#6b7280' }}>Adım {step} / 2 — Lütfen bilgilerinizi doldurun</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {step === 1 && (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 13, color: '#334155' }}>İsim</label>
                  <div style={{ position: 'relative' }}>
                    <FaUser style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <input value={form.first_name} onChange={(e) => setForm({...form, first_name: e.target.value})} required placeholder="Ad" style={{ padding: '14px 12px 14px 44px', borderRadius: 10, border: '1px solid #e5e7eb', width: '100%' }} />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: 13, color: '#334155' }}>Soyisim</label>
                  <input value={form.last_name} onChange={(e) => setForm({...form, last_name: e.target.value})} required placeholder="Soyad" style={{ padding: '14px', borderRadius: 10, border: '1px solid #e5e7eb', width: '100%' }} />
                </div>
              </div>

              <label style={{ fontSize: 13, color: '#334155' }}>E-posta</label>
              <div style={{ position: 'relative' }}>
                <FaEnvelope style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input type="email" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} required placeholder="email@ornek.com" style={{ padding: '12px 12px 12px 44px', borderRadius: 10, border: '1px solid #e5e7eb' }} />
              </div>

              <label style={{ fontSize: 13, color: '#334155' }}>Şifre</label>
              <div style={{ position: 'relative' }}>
                <FaLock style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input type="password" value={form.password} onChange={(e) => setForm({...form, password: e.target.value})} required placeholder="Parola" style={{ padding: '12px 12px 12px 44px', borderRadius: 10, border: '1px solid #e5e7eb' }} />
              </div>

              <label style={{ fontSize: 13, color: '#334155' }}>Şifre (Tekrar)</label>
              <input type="password" value={form.password_confirmation} onChange={(e) => setForm({...form, password_confirmation: e.target.value})} required placeholder="Parolayı tekrar girin" style={{ padding: '12px', borderRadius: 10, border: '1px solid #e5e7eb' }} />

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                <button type="button" onClick={next} disabled={!form.first_name || !form.last_name || !form.email || !form.password} style={{ background: '#16a34a', color: 'white', padding: '10px 14px', borderRadius: 10, border: 'none' }}>İleri</button>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <label style={{ fontSize: 13, color: '#334155' }}>Mağaza Adı (zorunlu)</label>
              <input value={form.store_name} onChange={(e) => setForm({...form, store_name: e.target.value})} required placeholder="Mağaza / Şirket adı" style={{ padding: '14px', borderRadius: 10, border: '1px solid #e5e7eb', width: '100%' }} />

              <label style={{ fontSize: 13, color: '#334155', marginTop: 8 }}>Vergi Numarası (opsiyonel)</label>
              <input value={form.tax_id} onChange={(e) => setForm({...form, tax_id: e.target.value})} placeholder="Vergi Numarası" style={{ padding: '12px', borderRadius: 10, border: '1px solid #e5e7eb', width: '100%' }} />

              <label style={{ fontSize: 13, color: '#334155' }}>Telefon (opsiyonel)</label>
              <div style={{ position: 'relative' }}>
                <FaPhone style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input value={form.phone} onChange={(e) => setForm({...form, phone: e.target.value})} placeholder="05xx xxx xx xx" style={{ padding: '12px 12px 12px 44px', borderRadius: 10, border: '1px solid #e5e7eb', width: '100%' }} />
              </div>

              <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                <input id="acceptTerms" type="checkbox" checked={acceptTerms} onChange={(e) => setAcceptTerms(e.target.checked)} style={{ width: 18, height: 18 }} />
                <label htmlFor="acceptTerms" style={{ fontSize: 13, color: '#334155' }}>
                  Kullanım şartlarını ve <a href="/terms" target="_blank" rel="noreferrer" style={{ color: '#16a34a', fontWeight: 700 }}>gizlilik politikasını</a> kabul ediyorum
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                <button type="button" onClick={back} style={{ background: '#f3f4f6', color: '#111827', padding: '10px 14px', borderRadius: 10, border: '1px solid #e5e7eb' }}>Geri</button>
                <button type="submit" disabled={registerMutation.isPending || !acceptTerms || !form.store_name} style={{ background: '#16a34a', color: 'white', padding: '10px 14px', borderRadius: 10, border: 'none', opacity: (registerMutation.isPending || !acceptTerms || !form.store_name) ? 0.6 : 1 }}>{registerMutation.isPending ? 'Gönderiliyor...' : 'Başvuruyu Tamamla'}</button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default VendorRegister;
