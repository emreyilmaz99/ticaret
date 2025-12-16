import React from 'react';
import { FaStore, FaEnvelope, FaLock, FaArrowRight } from 'react-icons/fa';
import useVendorLogin from './useVendorLogin';
import { getStyles } from './styles';

const VendorLogin = () => {
  const { email, setEmail, password, setPassword, isLoading, handleSubmit } = useVendorLogin();
  const styles = getStyles();

  return (
    <div style={styles.container}>
      <div style={styles.backgroundPattern} />
      <div style={styles.contentWrapper}>
        <div style={styles.card}>
          {/* Brand Section */}
          <div style={styles.brandSection}>
            <div style={styles.iconBox}>
              <FaStore />
            </div>
            <h1 style={styles.title}>Satıcı Paneli</h1>
            <p style={styles.subtitle}>Mağazanızı yönetmek için giriş yapın</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} style={styles.form}>
            {/* Email Field */}
            <div style={styles.formGroup}>
              <label style={styles.label}>E-posta Adresi</label>
              <div style={styles.inputWrapper}>
                <FaEnvelope style={styles.inputIcon} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="magaza@ornek.com"
                  required
                  style={styles.input}
                />
              </div>
            </div>

            {/* Password Field */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Şifre</label>
              <div style={styles.inputWrapper}>
                <FaLock style={styles.inputIcon} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  style={styles.input}
                />
              </div>
            </div>

            {/* Submit Button */}
            <button type="submit" disabled={isLoading} style={styles.submitBtn}>
              {isLoading ? (
                'Giriş Yapılıyor...'
              ) : (
                <>
                  Giriş Yap <FaArrowRight size={14} />
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div style={styles.footer}>
            <p style={styles.footerText}>
              Henüz satıcı hesabınız yok mu?
              <a href="/vendor/register" style={styles.footerLink}>
                Hemen Başvurun
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorLogin;
