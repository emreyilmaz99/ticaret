// src/pages/public/Auth/Register.jsx
import React, { useState } from 'react';
import { FaUser, FaEnvelope, FaLock, FaPhone } from 'react-icons/fa';
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
 * Register Page
 */
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

  const { isLoading, setIsLoading, isMobile, auth, toast, handlePostAuth } = useAuthForm();
  const styles = getStyles(isMobile);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePhoneChange = (e) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 10);
    setFormData(prev => ({ ...prev, phone: val }));
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
      const result = await auth.register(formData);

      if (result.success) {
        toast.success('Başarılı', 'Kayıt başarılı! Hoş geldiniz.');
        await handlePostAuth();
      } else {
        toast.error('Hata', result.message);
      }
    } catch (error) {
      toast.error('Hata', error.message || 'Kayıt yapılamadı.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout styles={styles}>
      <AuthHeader
        title="Aramıza Katılın"
        subtitle="Ayrıcalıklı alışveriş dünyasına adım atmak için hemen ücretsiz üye olun."
        styles={styles}
      />

      <form style={styles.form} onSubmit={handleSubmit}>
        <InputField
          type="text"
          name="name"
          placeholder="Adınız Soyadınız *"
          value={formData.name}
          onChange={handleChange}
          icon={FaUser}
          required
          styles={styles}
        />

        <InputField
          type="email"
          name="email"
          placeholder="E-posta Adresiniz *"
          value={formData.email}
          onChange={handleChange}
          icon={FaEnvelope}
          required
          styles={styles}
        />

        <InputField
          type="tel"
          name="phone"
          placeholder="Telefon Numaranız (İsteğe bağlı)"
          value={formData.phone}
          onChange={handlePhoneChange}
          icon={FaPhone}
          maxLength={10}
          styles={styles}
        />

        <InputField
          type="password"
          name="password"
          placeholder="Şifre Belirleyin (Min. 8 karakter) *"
          value={formData.password}
          onChange={handleChange}
          icon={FaLock}
          showPasswordToggle
          showPassword={showPassword}
          onTogglePassword={() => setShowPassword(!showPassword)}
          required
          styles={styles}
        />

        <InputField
          type="password"
          name="password_confirmation"
          placeholder="Şifrenizi Tekrar Girin *"
          value={formData.password_confirmation}
          onChange={handleChange}
          icon={FaLock}
          showPasswordToggle
          showPassword={showConfirmPassword}
          onTogglePassword={() => setShowConfirmPassword(!showConfirmPassword)}
          required
          styles={styles}
        />

        <SubmitButton
          isLoading={isLoading}
          loadingText="Kayıt Yapılıyor..."
          text="Kayıt Ol"
          styles={styles}
        />
      </form>

      <SocialButtons
        dividerText="veya şununla kayıt olun"
        styles={styles}
      />

      <AuthFooter
        text="Zaten hesabınız var mı?"
        linkText="Giriş Yap"
        linkTo="/login"
        styles={styles}
      />
    </AuthLayout>
  );
};

export default Register;
