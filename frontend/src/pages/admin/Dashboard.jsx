import React from 'react';
import { DashboardStats } from '../../features/admin/components/DashboardStats';

const Dashboard = () => {
  return (
    <div>
      {/* Başlık kısmını kaldırdık çünkü DashboardStats içinde zaten hoş geldin mesajı var */}
      <DashboardStats />
    </div>
  );
};

export default Dashboard;