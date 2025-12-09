// src/components/layouts/AdminLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../admin/AdminSidebar'; // Sidebar yolunun doğru olduğundan emin ol

const AdminLayout = () => {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F8FAFC' }}>
      
      {/* Sol Taraf: Sidebar (Sabit) */}
      <AdminSidebar />

      {/* Sağ Taraf: İçerik Alanı */}
      <div style={{ 
        marginLeft: '260px', // Sidebar genişliği kadar boşluk
        width: 'calc(100% - 260px)', // Kalan genişlik
        padding: '0', // İçerik padding'ini sayfalara bırakıyoruz (daha esnek)
        backgroundColor: '#F8FAFC', 
        minHeight: '100vh' 
      }}>
        {/* Sayfaların render edildiği yer */}
        <Outlet /> 
      </div>
      
    </div>
  );
};

export default AdminLayout;