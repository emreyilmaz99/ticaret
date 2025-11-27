import React from 'react';
import UserList from '../../features/users/components/UserList';

const UsersPage = () => {
  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '700', color: 'var(--text-main)', marginBottom: '8px' }}>Kullanıcı Yönetimi</h1>
        <p style={{ color: 'var(--text-muted)' }}>Sistemdeki kayıtlı kullanıcıları görüntüleyin ve yönetin.</p>
      </div>
      <UserList />
    </div>
  );
};

export default UsersPage;
