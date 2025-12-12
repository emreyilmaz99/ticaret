import React from 'react';
import { FaStore, FaPlus, FaFileExcel, FaPrint } from 'react-icons/fa';
import ActiveVendorList from '../../features/vendor/components/ActiveVendorList';

const ActiveVendorsPage = () => {
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
          <h1 style={styles.title}>Satıcılar</h1>
          <p style={styles.subtitle}>Platformdaki aktif mağazaları buradan yönetebilirsiniz.</p>
        </div>
        <div style={styles.headerActions}>
          <button style={styles.exportBtn} onClick={handlePrint}>
            <FaPrint /> Rapor Yazdır
          </button>
          <button style={styles.exportBtn} onClick={handleDownloadExcel}>
            <FaFileExcel /> Excel İndir
          </button>
          <button style={styles.addBtn}>
            <FaPlus /> Yeni Satıcı Ekle
          </button>
        </div>
      </div>

      <ActiveVendorList />
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
    background: '#ffffff',
    padding: '28px 32px',
    borderRadius: '16px',
    border: '1px solid rgb(226, 232, 240)',
  },
  title: {
    fontSize: '26px',
    fontWeight: '800',
    color: '#0f172a',
    letterSpacing: '-0.02em',
    margin: 0,
  },
  subtitle: {
    fontSize: '15px',
    color: '#64748b',
    marginTop: '6px',
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
  addBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 16px',
    backgroundColor: '#059669',
    border: 'none',
    borderRadius: '10px',
    color: '#fff',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
    boxShadow: '0 4px 12px rgba(5, 150, 105, 0.25)',
  },
};

export default ActiveVendorsPage;
