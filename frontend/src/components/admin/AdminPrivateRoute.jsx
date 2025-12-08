import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const AdminPrivateRoute = () => {
  // Token var mı kontrol et
  const token = localStorage.getItem('admin_token');

  // Token varsa <Outlet /> (istenen sayfayı göster)
  // Token yoksa <Navigate /> (Login'e şutla)
  return token ? <Outlet /> : <Navigate to="/admin/login" />;
};

export default AdminPrivateRoute;