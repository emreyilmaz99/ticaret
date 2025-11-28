import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { vendorLogin, getVendorProfile } from '../../features/vendor/api/vendorAuthApi';
import { FaStore, FaEnvelope, FaLock, FaArrowRight } from 'react-icons/fa';

const VendorLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const loginMutation = useMutation({
    mutationFn: vendorLogin,
    onSuccess: (data) => {
      localStorage.setItem('vendor_token', data.data.token);
      // Hemen profil bilgisini alıp onboarding gerekip gerekmediğine bak
      getVendorProfile().then(res => {
        const v = res.data.vendor;
        const hasCompany = !!v.company_name;
        const hasAddress = (v.addresses && v.addresses.length > 0);
        const hasBank = (v.bank_accounts && v.bank_accounts.length > 0);

        if (!hasCompany || !hasAddress || !hasBank || v.status !== 'active') {
          navigate('/vendor/onboarding');
        } else {
          navigate('/vendor/dashboard');
        }
      }).catch(err => {
        // Profil alınamazsa yine dashboard'a gönder (veya onboarding)
        navigate('/vendor/dashboard');
      });
    },
    onError: (error) => {
      alert('Giriş başarısız: ' + (error.response?.data?.message || error.message));
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    loginMutation.mutate({ email, password });
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f0fdf4', // Light Green background
      backgroundImage: 'radial-gradient(#dcfce7 1px, transparent 1px)',
      backgroundSize: '24px 24px'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '48px',
        borderRadius: '24px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1)',
        width: '100%',
        maxWidth: '440px',
        border: '1px solid #bbf7d0'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ 
            width: '64px', 
            height: '64px', 
            backgroundColor: '#16a34a', 
            borderRadius: '16px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            margin: '0 auto 16px',
            color: 'white',
            fontSize: '32px',
            boxShadow: '0 10px 15px -3px rgba(22, 163, 74, 0.3)'
          }}>
            <FaStore />
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#14532d', marginBottom: '8px' }}>Satıcı Paneli</h1>
          <p style={{ color: '#64748b', fontSize: '14px' }}>Mağazanızı yönetmek için giriş yapın</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#334155', marginBottom: '8px' }}>E-posta Adresi</label>
            <div style={{ position: 'relative' }}>
              <FaEnvelope style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="magaza@ornek.com"
                required
                style={{
                  width: '100%',
                  padding: '12px 12px 12px 44px',
                  borderRadius: '12px',
                  border: '1px solid #cbd5e1',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'all 0.2s',
                  backgroundColor: '#f8fafc'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#16a34a';
                  e.target.style.backgroundColor = 'white';
                  e.target.style.boxShadow = '0 0 0 3px rgba(22, 163, 74, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#cbd5e1';
                  e.target.style.backgroundColor = '#f8fafc';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#334155', marginBottom: '8px' }}>Şifre</label>
            <div style={{ position: 'relative' }}>
              <FaLock style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                style={{
                  width: '100%',
                  padding: '12px 12px 12px 44px',
                  borderRadius: '12px',
                  border: '1px solid #cbd5e1',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'all 0.2s',
                  backgroundColor: '#f8fafc'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#16a34a';
                  e.target.style.backgroundColor = 'white';
                  e.target.style.boxShadow = '0 0 0 3px rgba(22, 163, 74, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#cbd5e1';
                  e.target.style.backgroundColor = '#f8fafc';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', color: '#475569' }}>
              <input type="checkbox" style={{ accentColor: '#16a34a' }} />
              Beni Hatırla
            </label>
            <a href="#" style={{ color: '#16a34a', fontWeight: '600', textDecoration: 'none' }}>Şifremi Unuttum</a>
          </div>

          <button
            type="submit"
            disabled={loginMutation.isPending}
            style={{
              backgroundColor: '#16a34a',
              color: 'white',
              padding: '14px',
              borderRadius: '12px',
              border: 'none',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'all 0.2s',
              boxShadow: '0 4px 6px -1px rgba(22, 163, 74, 0.2)'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#15803d'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#16a34a'}
          >
            {loginMutation.isPending ? 'Giriş Yapılıyor...' : (
              <>
                Giriş Yap <FaArrowRight size={14} />
              </>
            )}
          </button>
        </form>

        <div style={{ marginTop: '32px', textAlign: 'center', fontSize: '14px', color: '#64748b' }}>
          Henüz satıcı hesabınız yok mu? <br />
          <a href="/vendor/register" style={{ color: '#16a34a', fontWeight: '700', textDecoration: 'none', marginTop: '4px', display: 'inline-block' }}>
            Hemen Başvurun
          </a>
        </div>
      </div>
    </div>
  );
};

export default VendorLogin;
