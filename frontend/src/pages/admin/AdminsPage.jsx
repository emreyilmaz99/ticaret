import React from 'react';
import AdminList from '../../features/admins/components/AdminList';

const AdminsPage = () => {
  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '700', color: 'var(--text-main)', marginBottom: '8px' }}>Yöneticiler</h1>
        <p style={{ color: 'var(--text-muted)' }}>Sistem yöneticilerini ve yetkilerini buradan yönetebilirsiniz.</p>
      </div>
      
      <AdminList />
    </div>
  );
};

export default AdminsPage;
