import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaPhone, FaGoogle, FaFacebookF, FaArrowRight } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../components/Toast';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    password_confirmation: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { register } = useAuth();
  const { mergeGuestCart, fetchCart } = useCart();
  const navigate = useNavigate();
  const toast = useToast();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!formData.name || !formData.email || !formData.password) {
      toast.warning('Uyarı', 'Lütfen zorunlu alanları doldurun.');
      return;
    }

    if (formData.password !== formData.password_confirmation) {
      toast.error('Hata', 'Şifreler eşleşmiyor.');
      return;
    }

    if (formData.password.length < 8) {
      toast.warning('Uyarı', 'Şifre en az 8 karakter olmalıdır.');
      return;
    }

    // Phone validation (optional but if provided must be valid)
    if (formData.phone && !/^[0-9]{10,11}$/.test(formData.phone.replace(/\s/g, ''))) {
      toast.warning('Uyarı', 'Geçerli bir telefon numarası giriniz.');
      return;
    }

    setIsLoading(true);

    try {
      const result = await register(formData);
      
      if (result.success) {
        toast.success('Başarılı', 'Kayıt başarılı! Hoş geldiniz.');
        
        // Misafir sepetini kullanıcıya aktar ve sepeti yenile
        try {
          await mergeGuestCart();
          await fetchCart();
        } catch (cartError) {
          console.error('Sepet aktarılırken hata:', cartError);
        }
        
        navigate('/account/profile');
      } else {
        toast.error('Hata', result.message);
      }
    } catch (error) {
      toast.error('Hata', error.message || 'Kayıt yapılamadı.');
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
      marginBottom: '32px',
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
      gap: '20px',
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
      marginTop: '10px',
    },
    divider: {
      display: 'flex',
      alignItems: 'center',
      margin: '24px 0',
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
      marginTop: '24px',
      fontSize: '15px',
      color: '#64748b',
    },
    loginLink: {
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
          <h1 style={styles.title}>Aramıza Katılın</h1>
          <p style={styles.subtitle}>
            Ayrıcalıklı alışveriş dünyasına adım atmak için hemen ücretsiz üye olun.
          </p>
        </div>

        <form style={styles.form} onSubmit={handleSubmit}>
          <div style={styles.inputGroup}>
            <FaUser style={styles.inputIcon} />
            <input 
              type="text" 
              name="name"
              placeholder="Adınız Soyadınız *" 
              style={styles.input}
              value={formData.name}
              onChange={handleChange}
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
            <FaEnvelope style={styles.inputIcon} />
            <input 
              type="email" 
              name="email"
              placeholder="E-posta Adresiniz *" 
              style={styles.input}
              value={formData.email}
              onChange={handleChange}
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
            <FaPhone style={styles.inputIcon} />
            <input 
              type="tel" 
              name="phone"
              placeholder="Telefon Numaranız (İsteğe bağlı)" 
              style={styles.input}
              value={formData.phone}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                setFormData(prev => ({ ...prev, phone: val }));
              }}
              maxLength={10}
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
            />
          </div>

          <div style={styles.inputGroup}>
            <FaLock style={styles.inputIcon} />
            <input 
              type={showPassword ? "text" : "password"} 
              name="password"
              placeholder="Şifre Belirleyin (Min. 8 karakter) *" 
              style={styles.input}
              value={formData.password}
              onChange={handleChange}
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

          <div style={styles.inputGroup}>
            <FaLock style={styles.inputIcon} />
            <input 
              type={showConfirmPassword ? "text" : "password"} 
              name="password_confirmation"
              placeholder="Şifrenizi Tekrar Girin *" 
              style={styles.input}
              value={formData.password_confirmation}
              onChange={handleChange}
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
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <button 
            type="submit" 
            style={{
              ...styles.submitBtn,
              opacity: isLoading ? 0.7 : 1,
              cursor: isLoading ? 'not-allowed' : 'pointer',
            }}
            disabled={isLoading}
            onMouseEnter={(e) => !isLoading && (e.target.style.transform = 'translateY(-2px)')}
            onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
          >
            {isLoading ? 'Kayıt Yapılıyor...' : (
              <>
                Kayıt Ol <FaArrowRight />
              </>
            )}
          </button>
        </form>

        <div style={styles.divider}>
          <div style={styles.dividerLine}></div>
          <span style={styles.dividerText}>veya şununla kayıt olun</span>
          <div style={styles.dividerLine}></div>
        </div>

        <div style={styles.socialButtons}>
          <button style={styles.socialBtn}>
            <FaGoogle color="#DB4437" size={20} />
            Google
          </button>
          <button style={styles.socialBtn}>
            <FaFacebookF color="#4267B2" size={20} />
            Facebook
          </button>
        </div>

        <div style={styles.footer}>
          Zaten hesabınız var mı? 
          <Link to="/login" style={styles.loginLink}>Giriş Yap</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
