import React from 'react';
import VendorList from '../../features/vendor/components/VendorList';

const VendorsPage = () => {
  return (
    <div>
      {/* SAYFA BAŞLIĞI */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '700', color: 'var(--text-main)' }}>Satıcı Başvuruları</h1>
        <p style={{ color: 'var(--text-muted)', marginTop: '4px' }}>Platformdaki tüm mağazaları buradan yönetebilirsiniz.</p>
      </div>

      {/* LİSTE BİLEŞENİ */}
      <VendorList />
    </div>
  );
};

export default VendorsPage;
