// src/components/admin/PageHeader.jsx
import React from 'react';

/**
 * Admin Sayfa Başlık Komponenti
 * Tüm admin sayfalarında tutarlı başlık stili sağlar
 * Siparişler sayfasındaki gibi gradient çerçeveli modern tasarım
 * 
 * @param {string} title - Sayfa başlığı
 * @param {string} subtitle - Açıklama metni
 * @param {React.ReactNode} action - Sağ taraftaki aksiyon butonu (opsiyonel)
 * @param {React.ReactNode} icon - Başlık ikonu (opsiyonel)
 */
const PageHeader = ({ title, subtitle, action, icon: Icon }) => {
  const styles = {
    container: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '32px',
      background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
      padding: '28px 32px',
      borderRadius: '16px',
      border: '1px solid #e2e8f0',
      gap: '24px',
      flexWrap: 'wrap',
    },
    leftSection: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      flex: 1,
    },
    iconWrapper: {
      width: '52px',
      height: '52px',
      borderRadius: '14px',
      backgroundColor: 'rgba(5, 150, 105, 0.12)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#059669',
      flexShrink: 0,
    },
    textContent: {
      display: 'flex',
      flexDirection: 'column',
      gap: '6px',
    },
    title: {
      fontSize: '26px',
      fontWeight: '800',
      color: '#0f172a',
      margin: 0,
      fontFamily: '"Plus Jakarta Sans", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      letterSpacing: '-0.02em',
      lineHeight: '1.2',
    },
    subtitle: {
      fontSize: '15px',
      fontWeight: '400',
      color: '#64748b',
      margin: 0,
      fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      lineHeight: '1.5',
    },
    actionWrapper: {
      flexShrink: 0,
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.leftSection}>
        {Icon && (
          <div style={styles.iconWrapper}>
            <Icon size={24} />
          </div>
        )}
        <div style={styles.textContent}>
          <h1 style={styles.title}>{title}</h1>
          {subtitle && <p style={styles.subtitle}>{subtitle}</p>}
        </div>
      </div>
      
      {action && (
        <div style={styles.actionWrapper}>
          {action}
        </div>
      )}
    </div>
  );
};

export default PageHeader;
