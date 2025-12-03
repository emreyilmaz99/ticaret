import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaGoogle, FaFacebookF, FaArrowRight } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/Toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.warning('Uyarı', 'Lütfen tüm alanları doldurun.');
      return;
    }
    
    setIsLoading(true);

    try {
      const result = await login(email, password);
      if (result.success) {
        toast.success('Giriş Başarılı', 'Yönlendiriliyorsunuz...');
        navigate('/account/profile');
      } else {
        toast.error('Hata', result.message);
      }
    } catch (error) {
      toast.error('Hata', error.message || 'Giriş yapılamadı.');
    } finally {
      setIsLoading(false);
    }
  };

  const styles = {
    container: {
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
      fontFamily: '"Inter", sans-serif',
      padding: '20px',
      position: 'relative',
      overflow: 'hidden',
    },
    backgroundShape1: {
      position: 'absolute',
      top: '-10%',
      right: '-5%',
      width: '500px',
      height: '500px',
      borderRadius: '50%',
      background: 'linear-gradient(135deg, rgba(5, 150, 105, 0.1) 0%, rgba(16, 185, 129, 0.05) 100%)',
      zIndex: 0,
    },
    backgroundShape2: {
      position: 'absolute',
      bottom: '-10%',
      left: '-5%',
      width: '400px',
      height: '400px',
      borderRadius: '50%',
      background: 'linear-gradient(135deg, rgba(5, 150, 105, 0.1) 0%, rgba(16, 185, 129, 0.05) 100%)',
      zIndex: 0,
    },
    card: {
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      backdropFilter: 'blur(20px)',
      borderRadius: '32px',
      boxShadow: '0 20px 50px -10px rgba(0, 0, 0, 0.1)',
      width: '100%',
      maxWidth: '480px',
      padding: '48px',
      position: 'relative',
      zIndex: 1,
      border: '1px solid rgba(255, 255, 255, 0.5)',
    },
    header: {
      textAlign: 'center',
      marginBottom: '40px',
    },
    title: {
      fontFamily: '"DM Sans", sans-serif',
      fontSize: '32px',
      fontWeight: '800',
      color: '#064e3b',
      marginBottom: '12px',
      letterSpacing: '-1px',
    },
    subtitle: {
      color: '#64748b',
      fontSize: '15px',
      lineHeight: '1.5',
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '24px',
    },
    inputGroup: {
      position: 'relative',
    },
    inputIcon: {
      position: 'absolute',
      left: '20px',
      top: '50%',
      transform: 'translateY(-50%)',
      color: '#94a3b8',
      fontSize: '18px',
      transition: 'color 0.3s',
    },
    input: {
      width: '100%',
      padding: '16px 20px 16px 52px',
      borderRadius: '16px',
      border: '1px solid #e2e8f0',
      backgroundColor: '#f8fafc',
      fontSize: '15px',
      color: '#1e293b',
      outline: 'none',
      transition: 'all 0.3s ease',
      fontFamily: 'inherit',
    },
    passwordToggle: {
      position: 'absolute',
      right: '20px',
      top: '50%',
      transform: 'translateY(-50%)',
      color: '#94a3b8',
      cursor: 'pointer',
      background: 'none',
      border: 'none',
      fontSize: '18px',
    },
    optionsRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      fontSize: '14px',
    },
    checkboxLabel: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      color: '#64748b',
      cursor: 'pointer',
      userSelect: 'none',
    },
    checkbox: {
      width: '18px',
      height: '18px',
      borderRadius: '4px',
      accentColor: '#059669',
      cursor: 'pointer',
    },
    forgotLink: {
      color: '#059669',
      textDecoration: 'none',
      fontWeight: '600',
      transition: 'color 0.2s',
    },
    submitBtn: {
      backgroundColor: '#059669',
      color: 'white',
      border: 'none',
      padding: '18px',
      borderRadius: '16px',
      fontSize: '16px',
      fontWeight: '700',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '10px',
      boxShadow: '0 10px 20px -5px rgba(5, 150, 105, 0.3)',
    },
    divider: {
      display: 'flex',
      alignItems: 'center',
      margin: '32px 0',
      color: '#94a3b8',
      fontSize: '14px',
    },
    dividerLine: {
      flex: 1,
      height: '1px',
      backgroundColor: '#e2e8f0',
    },
    dividerText: {
      padding: '0 16px',
    },
    socialButtons: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '16px',
    },
    socialBtn: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '10px',
      padding: '14px',
      borderRadius: '16px',
      border: '1px solid #e2e8f0',
      backgroundColor: 'white',
      color: '#475569',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s',
    },
    footer: {
      textAlign: 'center',
      marginTop: '32px',
      fontSize: '15px',
      color: '#64748b',
    },
    registerLink: {
      color: '#059669',
      fontWeight: '700',
      textDecoration: 'none',
      marginLeft: '5px',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.backgroundShape1}></div>
      <div style={styles.backgroundShape2}></div>

      <div style={styles.card}>
        <div style={styles.header}>
          <h1 style={styles.title}>Tekrar Hoş Geldiniz</h1>
          <p style={styles.subtitle}>
            Alışveriş deneyiminize kaldığınız yerden devam etmek için lütfen giriş yapın.
          </p>
        </div>

        <form style={styles.form} onSubmit={handleSubmit}>
          <div style={styles.inputGroup}>
            <FaEnvelope style={styles.inputIcon} />
            <input 
              type="email" 
              placeholder="E-posta Adresiniz" 
              style={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={(e) => {
                e.target.style.borderColor = '#059669';
                e.target.style.backgroundColor = 'white';
                e.target.previousSibling.style.color = '#059669';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e2e8f0';
                e.target.style.backgroundColor = '#f8fafc';
                e.target.previousSibling.style.color = '#94a3b8';
              }}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <FaLock style={styles.inputIcon} />
            <input 
              type={showPassword ? "text" : "password"} 
              placeholder="Şifreniz" 
              style={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={(e) => {
                e.target.style.borderColor = '#059669';
                e.target.style.backgroundColor = 'white';
                e.target.previousSibling.style.color = '#059669';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e2e8f0';
                e.target.style.backgroundColor = '#f8fafc';
                e.target.previousSibling.style.color = '#94a3b8';
              }}
              required
            />
            <button 
              type="button"
              style={styles.passwordToggle}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <div style={styles.optionsRow}>
            <label style={styles.checkboxLabel}>
              <input type="checkbox" style={styles.checkbox} />
              Beni Hatırla
            </label>
            <a href="#" style={styles.forgotLink}>Şifremi Unuttum?</a>
          </div>

          <button 
            type="submit" 
            style={{ 
              ...styles.submitBtn, 
              opacity: isLoading ? 0.7 : 1,
              transform: isLoading ? 'scale(0.98)' : 'scale(1)'
            }}
            disabled={isLoading}
          >
            {isLoading ? 'Giriş Yapılıyor...' : (
              <>Giriş Yap <FaArrowRight /></>
            )}
          </button>
        </form>

        <div style={styles.divider}>
          <div style={styles.dividerLine}></div>
          <span style={styles.dividerText}>veya şununla devam et</span>
          <div style={styles.dividerLine}></div>
        </div>

        <div style={styles.socialButtons}>
          <button style={styles.socialBtn}>
            <FaGoogle color="#DB4437" /> Google
          </button>
          <button style={styles.socialBtn}>
            <FaFacebookF color="#4267B2" /> Facebook
          </button>
        </div>

        <div style={styles.footer}>
          Hesabınız yok mu? 
          <Link to="/register" style={styles.registerLink}>Hemen Kayıt Ol</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
