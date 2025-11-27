import React from 'react';
import VendorList from '../../features/vendors/components/VendorList';
import { FaPlus } from 'react-icons/fa';

const VendorsPage = () => {
  return (
    <div>
      {/* SAYFA BAŞLIĞI VE AKSİYON BUTONU */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: '700', color: 'var(--text-main)' }}>Satıcı Yönetimi</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '4px' }}>Platformdaki tüm mağazaları buradan yönetebilirsiniz.</p>
        </div>
        
        <button style={{
          backgroundColor: 'var(--primary)',
          color: 'white',
          border: 'none',
          padding: '12px 24px',
          borderRadius: 'var(--radius)',
          fontWeight: '600',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          cursor: 'pointer',
          boxShadow: '0 4px 6px -1px rgba(79, 70, 229, 0.2)'
        }}>
          <FaPlus /> Yeni Satıcı Ekle
        </button>
      </div>

      {/* LİSTE BİLEŞENİ */}
      <VendorList />
    </div>
  );
};

export default VendorsPage;
