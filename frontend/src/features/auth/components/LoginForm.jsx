import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginAdmin } from '../api/authApi';

export const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  
  const navigate = useNavigate(); 

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await loginAdmin({ email, password });

      if (response.data.success) {
        const token = response.data.data.token;
        localStorage.setItem('admin_token', token);
        navigate('/admin/dashboard');
      }
    } catch (err) {
      console.error("Login hatası:", err);
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Giriş başarısız. Lütfen bilgilerinizi kontrol edin.");
      }
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = (fieldName) => ({
    width: '100%',
    padding: '14px 16px',
    border: `2px solid ${focusedField === fieldName ? '#10b981' : 'rgba(255,255,255,0.2)'}`,
    borderRadius: '12px',
    boxSizing: 'border-box',
    fontSize: '15px',
    backgroundColor: 'rgba(255,255,255,0.1)',
    color: '#1f2937',
    transition: 'all 0.3s ease',
    outline: 'none'
  });

  return (
    <form 
      onSubmit={handleLogin} 
      style={{ 
        padding: '48px 40px', 
        backgroundColor: 'rgba(255, 255, 255, 0.95)', 
        backdropFilter: 'blur(20px)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255,255,255,0.1)',
        borderRadius: '24px', 
        width: '400px',
        maxWidth: '90vw'
      }}
    >
      {/* Logo/Icon */}
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <div style={{
          width: '72px',
          height: '72px',
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          borderRadius: '20px',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '16px',
          boxShadow: '0 10px 40px rgba(16, 185, 129, 0.3)'
        }}>
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L2 7l10 5 10-5-10-5z"/>
            <path d="M2 17l10 5 10-5"/>
            <path d="M2 12l10 5 10-5"/>
          </svg>
        </div>
        <h2 style={{ 
          fontSize: '28px',
          fontWeight: '700', 
          marginBottom: '8px', 
          color: '#1f2937',
          letterSpacing: '-0.5px'
        }}>
          Admin Paneli
        </h2>
        <p style={{ color: '#6b7280', fontSize: '15px' }}>
          Yönetim paneline giriş yapın
        </p>
      </div>
      
      {error && (
        <div style={{ 
          backgroundColor: '#fef2f2', 
          color: '#dc2626', 
          padding: '14px 16px', 
          borderRadius: '12px', 
          marginBottom: '20px', 
          fontSize: '14px',
          border: '1px solid #fecaca',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="15" y1="9" x2="9" y2="15"/>
            <line x1="9" y1="9" x2="15" y2="15"/>
          </svg>
          {error}
        </div>
      )}

      <div style={{ marginBottom: '20px' }}>
        <label style={{ 
          display: 'block', 
          marginBottom: '8px', 
          fontSize: '14px', 
          color: '#374151',
          fontWeight: '600'
        }}>
          E-posta Adresi
        </label>
        <input 
          type="email" 
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onFocus={() => setFocusedField('email')}
          onBlur={() => setFocusedField(null)}
          placeholder="admin@example.com"
          style={inputStyle('email')}
        />
      </div>
      
      <div style={{ marginBottom: '28px' }}>
        <label style={{ 
          display: 'block', 
          marginBottom: '8px', 
          fontSize: '14px', 
          color: '#374151',
          fontWeight: '600'
        }}>
          Şifre
        </label>
        <input 
          type="password" 
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onFocus={() => setFocusedField('password')}
          onBlur={() => setFocusedField(null)}
          placeholder="••••••••"
          style={inputStyle('password')}
        />
      </div>
      
      <button 
        type="submit" 
        disabled={loading}
        style={{ 
          width: '100%', 
          padding: '16px', 
          background: loading 
            ? 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)' 
            : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          color: 'white', 
          border: 'none', 
          borderRadius: '12px', 
          cursor: loading ? 'not-allowed' : 'pointer',
          fontWeight: '600',
          fontSize: '16px',
          boxShadow: loading ? 'none' : '0 10px 40px rgba(16, 185, 129, 0.3)',
          transition: 'all 0.3s ease',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px'
        }}
      >
        {loading ? (
          <>
            <svg 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2"
              style={{ animation: 'spin 1s linear infinite' }}
            >
              <circle cx="12" cy="12" r="10" strokeOpacity="0.25"/>
              <path d="M12 2a10 10 0 0 1 10 10" strokeOpacity="1"/>
            </svg>
            Giriş Yapılıyor...
          </>
        ) : (
          <>
            Giriş Yap
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </>
        )}
      </button>

      <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </form>
  );
};
