import React from 'react';
import ActiveVendorList from '../../features/vendor/components/ActiveVendorList';
import { FaPlus } from 'react-icons/fa';

const ActiveVendorsPage = () => {
  return (
    <div>
      {/* SAYFA BAŞLIĞI VE AKSİYON BUTONU */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: '700', color: 'var(--text-main)' }}>Satıcılar</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '4px' }}>Platformdaki aktif mağazaları buradan yönetebilirsiniz.</p>
        </div>
        
        {/* Yeni satıcı ekleme butonu opsiyonel, belki admin direkt ekleyebilir */}
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
      <ActiveVendorList />
    </div>
  );
};

export default ActiveVendorsPage;
