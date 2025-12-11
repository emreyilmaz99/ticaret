import React from 'react';
import { FaClipboardList, FaFileExcel, FaPrint } from 'react-icons/fa';
import VendorList from '../../features/vendor/components/VendorList';

const VendorsPage = () => {
  const handleDownloadExcel = () => {
    alert('Excel indirme özelliği yakında eklenecek');
  };

  const handlePrint = () => {
    alert('Yazdırma özelliği yakında eklenecek');
  };

  return (
    <div style={styles.container}>
      {/* Header - Siparişler sayfasındaki gibi */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Satıcı Başvuruları</h1>
          <p style={styles.subtitle}>Platformdaki tüm mağaza başvurularını buradan yönetebilirsiniz.</p>
        </div>
        <div style={styles.headerActions}>
          <button style={styles.exportBtn} onClick={handlePrint}>
            <FaPrint /> Rapor Yazdır
          </button>
          <button style={styles.exportBtn} onClick={handleDownloadExcel}>
            <FaFileExcel /> Excel İndir
          </button>
        </div>
      </div>

      <VendorList />
    </div>
  );
};

const styles = {
  container: {
    padding: '32px',
    backgroundColor: '#F3F4F6',
    minHeight: '100vh',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '32px',
    background: 'linear-gradient(135deg, rgb(248, 250, 252) 0%, rgb(241, 245, 249) 100%)',
    padding: '28px 32px',
    borderRadius: '16px',
    border: '1px solid rgb(226, 232, 240)',
  },
  title: {
    fontSize: '26px',
    fontWeight: '800',
    color: 'rgb(15, 23, 42)',
    letterSpacing: '-0.02em',
    margin: 0,
  },
  subtitle: {
    fontSize: '15px',
    color: 'rgb(100, 116, 139)',
    margin: '6px 0 0 0',
  },
  headerActions: {
    display: 'flex',
    gap: '12px',
  },
  exportBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 16px',
    backgroundColor: 'rgb(255, 255, 255)',
    border: '1px solid rgb(229, 231, 235)',
    borderRadius: '10px',
    color: 'rgb(17, 24, 39)',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
    boxShadow: 'rgba(0, 0, 0, 0.05) 0px 1px 2px 0px',
  },
};

export default VendorsPage;
