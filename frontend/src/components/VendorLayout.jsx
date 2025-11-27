import React from 'react';
import { Outlet } from 'react-router-dom';
import VendorSidebar from './VendorSidebar';

const VendorLayout = () => {
  return (
    <div style={{ display: 'flex', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      {/* Sol taraf: Sidebar */}
      <VendorSidebar />

      {/* Sağ taraf: İçerik Alanı */}
      {/* Sidebar 280px olduğu için içeriği o kadar sağa itiyoruz */}
      <div style={{ 
        marginLeft: '280px', 
        width: 'calc(100% - 280px)', 
        padding: '32px', 
        backgroundColor: '#f8fafc', // Slate-50
        minHeight: '100vh' 
      }}>
        <Outlet /> 
      </div>
    </div>
  );
};

export default VendorLayout;
