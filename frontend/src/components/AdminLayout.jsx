import React from 'react';
import { Outlet } from 'react-router-dom'; // Sayfa içeriği buraya gelecek
import AdminSidebar from './AdminSidebar';

const AdminLayout = () => {
  return (
    <div style={{ display: 'flex' }}>
      {/* Sol taraf: Sidebar */}
      <AdminSidebar />

      {/* Sağ taraf: İçerik Alanı */}
      {/* Sidebar 250px olduğu için içeriği o kadar sağa itiyoruz */}
      <div style={{ marginLeft: '250px', width: '100%', padding: '20px', backgroundColor: '#f4f6f9', minHeight: '100vh' }}>
        <Outlet /> 
      </div>
    </div>
  );
};

export default AdminLayout;