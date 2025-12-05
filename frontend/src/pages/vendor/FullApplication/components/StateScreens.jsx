import React from 'react';
import { FaStore, FaExclamationTriangle, FaArrowLeft } from 'react-icons/fa';
import { styles } from '../styles';

/**
 * Loading state component
 */
export const LoadingState = () => (
  <div style={styles.container}>
    <div style={styles.card}>
      <div style={styles.header}>
        <div style={styles.iconWrapper}>
          <FaStore />
        </div>
        <h1 style={styles.title}>Yükleniyor...</h1>
        <p style={styles.subtitle}>Hesap bilgileriniz getiriliyor.</p>
      </div>
    </div>
  </div>
);

/**
 * Error state component
 */
export const ErrorState = ({ onLogin }) => (
  <div style={styles.container}>
    <div style={styles.card}>
      <div style={styles.header}>
        <div style={{ ...styles.iconWrapper, ...styles.iconWrapperError }}>
          <FaExclamationTriangle />
        </div>
        <h1 style={{ ...styles.title, ...styles.titleError }}>Hata Oluştu</h1>
        <p style={styles.subtitle}>Hesap bilgileriniz yüklenemedi. Lütfen giriş yapın.</p>
        <button 
          onClick={onLogin}
          style={{ ...styles.buttonPrimary, ...styles.buttonCentered }}
        >
          Giriş Yap
        </button>
      </div>
    </div>
  </div>
);

/**
 * Access denied state component
 */
export const AccessDeniedState = ({ statusLabel, onGoBack }) => (
  <div style={styles.container}>
    <div style={styles.card}>
      <div style={styles.header}>
        <div style={{ ...styles.iconWrapper, ...styles.iconWrapperWarning }}>
          <FaExclamationTriangle />
        </div>
        <h1 style={{ ...styles.title, ...styles.titleWarning }}>Erişim Engellendi</h1>
        <p style={styles.subtitle}>
          Mevcut hesap durumunuz: <strong>{statusLabel}</strong>
          <br />
          Bu aşamada tam başvuru yapamazsınız.
        </p>
        <button 
          onClick={onGoBack}
          style={{ ...styles.buttonPrimary, ...styles.buttonCentered }}
        >
          <FaArrowLeft /> Duruma Dön
        </button>
      </div>
    </div>
  </div>
);

export default { LoadingState, ErrorState, AccessDeniedState };
