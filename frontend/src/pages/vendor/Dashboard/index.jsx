import React from 'react';
import { useVendorDashboard } from './useVendorDashboard';
import { styles } from './styles';
import {
  DashboardHeader,
  StatsGrid,
  RevenueChart,
  TopProducts,
  RecentOrders,
  PendingScreen,
  BannedScreen
} from './components';

/**
 * VendorDashboard - Main vendor dashboard page
 * Shows performance stats, charts, and recent orders
 */
const VendorDashboard = () => {
  const {
    // Data
    vendor,
    stats,
    topProducts,
    revenueData,
    recentOrders,
    
    // Loading
    isLoading,
    
    // Status checks
    isPending,
    isBanned
  } = useVendorDashboard();

  // Loading state
  if (isLoading) {
    return <div style={{ padding: 24 }}>Yükleniyor...</div>;
  }

  // Pending approval state
  if (isPending) {
    return <PendingScreen vendor={vendor} />;
  }

  // Banned/Suspended state
  if (isBanned) {
    return <BannedScreen vendor={vendor} />;
  }

  // Active vendor dashboard
  return (
    <div style={styles.container}>
      <DashboardHeader />

      <StatsGrid stats={stats} />

      <div style={styles.chartsGrid}>
        <RevenueChart data={revenueData} />
        <TopProducts products={topProducts} />
      </div>

      <RecentOrders orders={recentOrders} />
    </div>
  );
};

export default VendorDashboard;
