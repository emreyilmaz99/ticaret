import React from 'react';
import { DashboardStats } from '../../features/admin/components/DashboardStats';
import { DashboardChart } from '../../features/admin/components/DashboardChart';
import { RecentOrders } from '../../features/admin/components/RecentOrders';
import { TopProducts } from '../../features/admin/components/TopProducts';
import { ActivityTimeline } from '../../features/admin/components/ActivityTimeline';
import { PendingApprovals } from '../../features/admin/components/PendingApprovals';

const Dashboard = () => {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      gap: '24px',
      padding: '32px',
      backgroundColor: '#F3F4F6',
      minHeight: '100vh',
    }}>
      {/* 1. İstatistik Kartları */}
      <DashboardStats />
      
      {/* 2. Grafikler (Satış & Ziyaretçi) */}
      <DashboardChart />
      
      {/* 3. Orta Bölüm: Siparişler ve Ürünler */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        <RecentOrders />
        <TopProducts />
      </div>

      {/* 4. Alt Bölüm: Aktiviteler ve Onaylar */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        <ActivityTimeline />
        <PendingApprovals />
      </div>
    </div>
  );
};

export default Dashboard;