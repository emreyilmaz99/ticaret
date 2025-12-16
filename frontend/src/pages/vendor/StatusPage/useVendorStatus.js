import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import apiClient from '@lib/apiClient';
import { getStatusConfig } from './styles';

/**
 * Custom hook for vendor status page
 * Handles status data fetching and configuration
 */
export const useVendorStatus = () => {
  const navigate = useNavigate();

  // Fetch vendor application status
  const { data, isLoading, error } = useQuery({
    queryKey: ['vendor-application-status'],
    queryFn: async () => {
      const response = await apiClient.get('/v1/vendor/application/status');
      return response.data.data;
    },
  });

  // Get status configuration
  const config = data ? getStatusConfig(data.vendor_status) : null;

  // Check if rejection should be shown
  const showRejection = data?.latest_rejection_reason && data?.vendor_status === 'pre_approved';

  // Navigation handler
  const handleAction = () => {
    if (config?.actionPath) {
      navigate(config.actionPath);
    }
  };

  return {
    // Data
    status: data,
    config,
    showRejection,
    
    // Loading & Error
    isLoading,
    error,
    
    // Actions
    handleAction
  };
};

export default useVendorStatus;
