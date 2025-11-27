import React from 'react';
import { Outlet } from 'react-router-dom'; // Sayfa içeriği buraya gelecek
import AdminSidebar from './AdminSidebar';

const AdminLayout = () => {
  return (
    <div style={{ display: 'flex', backgroundColor: 'var(--bg-body)', minHeight: '100vh' }}>
      {/* Sol taraf: Sidebar */}
      <AdminSidebar />

      {/* Sağ taraf: İçerik Alanı */}
      {/* Sidebar 260px olduğu için içeriği o kadar sağa itiyoruz */}
      <div style={{ 
        marginLeft: '260px', 
        width: '100%', 
        padding: '32px', 
        backgroundColor: 'var(--bg-body)', 
        minHeight: '100vh' 
      }}>
        <Outlet /> 
      </div>
    </div>
  );
};

export default AdminLayout;