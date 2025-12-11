import React from 'react';
import { FaUserShield } from 'react-icons/fa';
import AdminList from '../../features/admin/components/AdminList';
import PageHeader from '../../components/admin/PageHeader';

const AdminsPage = () => {
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <PageHeader
        icon={FaUserShield}
        title="Yöneticiler"
        subtitle="Sistem yöneticilerini ve yetkilerini buradan yönetebilirsiniz."
      />
      
      <AdminList />
    </div>
  );
};

export default AdminsPage;
