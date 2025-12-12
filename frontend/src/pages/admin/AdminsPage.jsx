import React from 'react';
import { FaUserShield } from 'react-icons/fa';
import AdminList from '../../features/admin/components/AdminList';
import PageHeader from '../../components/admin/PageHeader';

const AdminsPage = () => {
  return (
    <div style={{ padding: '32px', backgroundColor: '#F3F4F6', minHeight: '100vh' }}>
      <PageHeader
        icon={FaUserShield}
        title="Kullanıcılar"
        subtitle="Sistemdeki kayıtlı kullanıcıları görüntüleyin ve yönetin."
      />
      
      <AdminList />
    </div>
  );
};

export default AdminsPage;
