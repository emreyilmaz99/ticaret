import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaHome, FaBox, FaUsers, FaSignOutAlt } from 'react-icons/fa';

const AdminSidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    navigate('/admin/login');
  };

  return (
    <div style={{
      width: '250px',
      height: '100vh', // Tam ekran boyu
      backgroundColor: '#2c3e50',
      color: 'white',
      display: 'flex',
      flexDirection: 'column',
      padding: '20px',
      position: 'fixed', // Sayfa kaydırılsa da sabit kalsın
      left: 0,
      top: 0
    }}>
      <h2 style={{ marginBottom: '30px', textAlign: 'center', borderBottom: '1px solid #34495e', paddingBottom: '10px' }}>
        Yönetici Paneli
      </h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <Link to="/admin/dashboard" style={{ color: 'white', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', borderRadius: '5px', backgroundColor: '#34495e' }}>
          <FaHome /> Özet (Dashboard)
        </Link>
        
        <Link to="/admin/products" style={{ color: 'white', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', borderRadius: '5px' }}>
          <FaBox /> Ürün Yönetimi
        </Link>
        
        <Link to="/admin/users" style={{ color: 'white', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', borderRadius: '5px' }}>
          <FaUsers /> Kullanıcılar
        </Link>
      </div>

      <button 
        onClick={handleLogout}
        style={{ 
          marginTop: 'auto', // En alta it
          backgroundColor: '#e74c3c', 
          color: 'white', 
          border: 'none', 
          padding: '10px', 
          borderRadius: '5px', 
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px'
        }}
      >
        <FaSignOutAlt /> Çıkış Yap
      </button>
    </div>
  );
};

export default AdminSidebar;