// src/pages/public/VendorStore/components/ErrorState.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FaExclamationTriangle, FaHome, FaArrowLeft } from 'react-icons/fa';

const ErrorState = ({ error }) => {
  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <div style={styles.iconWrapper}>
          <FaExclamationTriangle style={styles.icon} />
        </div>
        <h1 style={styles.title}>Mağaza Bulunamadı</h1>
        <p style={styles.message}>
          {error || 'Aradığınız mağaza bulunamadı veya artık aktif değil.'}
        </p>
        <div style={styles.actions}>
          <button 
            onClick={() => window.history.back()}
            style={styles.backBtn}
          >
            <FaArrowLeft size={14} />
            <span>Geri Dön</span>
          </button>
          <Link to="/" style={styles.homeBtn}>
            <FaHome size={14} />
            <span>Ana Sayfa</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8fafc',
    padding: '20px',
  },
  content: {
    textAlign: 'center',
    maxWidth: '400px',
  },
  iconWrapper: {
    width: '80px',
    height: '80px',
    margin: '0 auto 24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fef2f2',
    borderRadius: '50%',
  },
  icon: {
    fontSize: '36px',
    color: '#ef4444',
  },
  title: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#1e293b',
    margin: '0 0 12px 0',
  },
  message: {
    fontSize: '15px',
    color: '#64748b',
    lineHeight: '1.6',
    margin: '0 0 32px 0',
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
  },
  backBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 24px',
    backgroundColor: '#fff',
    color: '#475569',
    border: '1px solid #e2e8f0',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    textDecoration: 'none',
  },
  homeBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 24px',
    backgroundColor: '#059669',
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    textDecoration: 'none',
  },
};

export default ErrorState;
