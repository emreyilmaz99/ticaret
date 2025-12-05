import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getVendorProfile } from '../../../features/vendor/api/vendorAuthApi';
import { 
  MOCK_STATS, 
  MOCK_TOP_PRODUCTS, 
  MOCK_REVENUE_DATA, 
  MOCK_RECENT_ORDERS 
} from './styles';

/**
 * Custom hook for vendor dashboard
 * Handles vendor data, responsive state, and mock data
 */
export const useVendorDashboard = () => {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Handle resize for mobile detection
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Auth check
  useEffect(() => {
    const token = localStorage.getItem('vendor_token');
    if (!token) {
      navigate('/vendor/login');
    }
  }, [navigate]);

  // Fetch vendor profile
  const { data: meData, isLoading } = useQuery({
    queryKey: ['vendor', 'me'],
    queryFn: () => getVendorProfile(),
    staleTime: 1000 * 60
  });

  const vendor = meData?.data?.vendor;

  // Check vendor status
  const isPending = vendor && vendor.status === 'inactive';
  const isBanned = vendor && (vendor.status === 'suspended' || vendor.status === 'banned');
  const isActive = vendor && vendor.status === 'active';

  return {
    // Data
    vendor,
    stats: MOCK_STATS,
    topProducts: MOCK_TOP_PRODUCTS,
    revenueData: MOCK_REVENUE_DATA,
    recentOrders: MOCK_RECENT_ORDERS,
    
    // State
    isMobile,
    
    // Loading
    isLoading,
    
    // Status checks
    isPending,
    isBanned,
    isActive
  };
};

export default useVendorDashboard;
