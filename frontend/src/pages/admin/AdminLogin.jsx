import React from 'react';
import { LoginForm } from '../../features/auth/components/LoginForm';

const AdminLogin = () => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f5f5f5' }}>
      <LoginForm />
    </div>
  );
};

export default AdminLogin;