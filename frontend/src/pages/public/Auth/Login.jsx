// src/pages/public/Auth/Login.jsx
import React, { useState } from 'react';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import { getStyles } from './styles';
import { useAuthForm } from './hooks/useAuth';
import {
  AuthLayout,
  AuthHeader,
  InputField,
  SocialButtons,
  AuthFooter,
  SubmitButton
} from './components';

/**
 * Login Page
 */
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const { isLoading, setIsLoading, isMobile, auth, toast, handlePostAuth } = useAuthForm();
  const styles = getStyles(isMobile);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.warning('Uyarı', 'Lütfen tüm alanları doldurun.');
      return;
    }

    setIsLoading(true);

    try {
      const result = await auth.login(email, password);
      if (result.success) {
        toast.success('Giriş Başarılı', 'Yönlendiriliyorsunuz...');
        await handlePostAuth();
      } else {
        toast.error('Hata', result.message);
      }
    } catch (error) {
      toast.error('Hata', error.message || 'Giriş yapılamadı.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout styles={styles}>
      <AuthHeader
        title="Tekrar Hoş Geldiniz"
        subtitle="Alışveriş deneyiminize kaldığınız yerden devam etmek için lütfen giriş yapın."
        styles={styles}
      />

      <form style={styles.form} onSubmit={handleSubmit}>
        <InputField
          type="email"
          name="email"
          placeholder="E-posta Adresiniz"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          icon={FaEnvelope}
          required
          styles={styles}
        />

        <InputField
          type="password"
          name="password"
          placeholder="Şifreniz"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          icon={FaLock}
          showPasswordToggle
          showPassword={showPassword}
          onTogglePassword={() => setShowPassword(!showPassword)}
          required
          styles={styles}
        />

        <div style={styles.optionsRow}>
          <label style={styles.checkboxLabel}>
            <input
              type="checkbox"
              style={styles.checkbox}
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            Beni Hatırla
          </label>
          <a href="#" style={styles.forgotLink}>Şifremi Unuttum?</a>
        </div>

        <SubmitButton
          isLoading={isLoading}
          loadingText="Giriş Yapılıyor..."
          text="Giriş Yap"
          styles={styles}
        />
      </form>

      <SocialButtons
        dividerText="veya şununla devam et"
        styles={styles}
      />

      <AuthFooter
        text="Hesabınız yok mu?"
        linkText="Hemen Kayıt Ol"
        linkTo="/register"
        styles={styles}
      />
    </AuthLayout>
  );
};

export default Login;
