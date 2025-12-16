// src/pages/admin/Applications/useFullApplications.js
import { useState, useMemo, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  approveFullApplication, 
  rejectFullApplication 
} from '../../../features/vendor-application/api/vendorApplicationApi';
import { getActiveCommissionPlans } from '../../../features/commission/api/commissionApi';
import { useToast } from '../../../components/common/Toast';
import apiClient from '@lib/apiClient';

/**
 * Full Applications sayfası için custom hook
 */
const useFullApplications = () => {
  const queryClient = useQueryClient();
  const toast = useToast();
  
  // UI State
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [approveModalOpen, setApproveModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [selectedCommissionPlan, setSelectedCommissionPlan] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [hoveredRow, setHoveredRow] = useState(null);

  // Pending full approval vendors query
  const { data: vendorsData, isLoading, error } = useQuery({
    queryKey: ['pendingFullApprovalVendors'],
    queryFn: async () => {
      const response = await apiClient.get('/v1/admin/vendors', { 
        params: { status: 'pending_full_approval' } 
      });
      return response.data;
    },
    keepPreviousData: true
  });

  // Komisyon planlarını getir
  const { data: commissionPlansData } = useQuery({
    queryKey: ['activeCommissionPlans'],
    queryFn: getActiveCommissionPlans,
  });

  const commissionPlans = commissionPlansData?.data?.data || [];
  const vendors = vendorsData?.data || [];

  // Filtrelenmiş vendorlar
  const filteredVendors = useMemo(() => {
    if (!searchTerm.trim()) return vendors;
    
    const term = searchTerm.toLowerCase();
    return vendors.filter(vendor => 
      vendor.full_name?.toLowerCase().includes(term) ||
      vendor.email?.toLowerCase().includes(term) ||
      vendor.company_name?.toLowerCase().includes(term) ||
      vendor.phone?.includes(term) ||
      vendor.tax_id?.includes(term)
    );
  }, [vendors, searchTerm]);

  // Mutations
  const approveFullMutation = useMutation({
    mutationFn: ({ vendorId, commissionPlanId }) => approveFullApplication(vendorId, commissionPlanId),
    onSuccess: () => {
      queryClient.invalidateQueries(['pendingFullApprovalVendors']);
      queryClient.invalidateQueries(['active-vendors']);
      setSelectedVendor(null);
      setApproveModalOpen(false);
      setSelectedCommissionPlan(null);
      toast.success('Başarılı', 'Satıcı başvurusu onaylandı ve aktif edildi.');
    },
    onError: (err) => toast.error('Hata', err.response?.data?.message || 'Hata oluştu')
  });

  const rejectMutation = useMutation({
    mutationFn: ({ vendorId, reason }) => rejectFullApplication(vendorId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries(['pendingFullApprovalVendors']);
      setRejectModalOpen(false);
      setSelectedVendor(null);
      setRejectionReason('');
      toast.info('Bilgi', 'Başvuru reddedildi.');
    },
    onError: (err) => toast.error('Hata', err.response?.data?.message || 'Hata oluştu')
  });

  // Handlers
  const handleApproveClick = useCallback((vendor) => {
    setSelectedVendor(vendor);
    const defaultPlan = commissionPlans.find(p => p.is_default);
    setSelectedCommissionPlan(defaultPlan?.id || null);
    setApproveModalOpen(true);
  }, [commissionPlans]);

  const handleRejectClick = useCallback((vendor) => {
    setSelectedVendor(vendor);
    setRejectionReason('');
    setRejectModalOpen(true);
  }, []);

  const openDetailModal = useCallback((vendor) => {
    setSelectedVendor(vendor);
  }, []);

  const closeDetailModal = useCallback(() => {
    setSelectedVendor(null);
  }, []);

  const closeApproveModal = useCallback(() => {
    setApproveModalOpen(false);
  }, []);

  const closeRejectModal = useCallback(() => {
    setRejectModalOpen(false);
  }, []);

  const submitApprove = useCallback(() => {
    if (!selectedCommissionPlan) {
      toast.warning('Uyarı', 'Lütfen bir komisyon planı seçin.');
      return;
    }
    approveFullMutation.mutate({ 
      vendorId: selectedVendor.id, 
      commissionPlanId: selectedCommissionPlan 
    });
  }, [selectedVendor, selectedCommissionPlan, approveFullMutation, toast]);

  const submitReject = useCallback(() => {
    if (rejectionReason.length < 10) {
      toast.warning('Uyarı', 'Red nedeni en az 10 karakter olmalıdır.');
      return;
    }
    rejectMutation.mutate({ 
      vendorId: selectedVendor.id, 
      reason: rejectionReason 
    });
  }, [selectedVendor, rejectionReason, rejectMutation, toast]);

  return {
    // Data
    vendors: filteredVendors,
    totalVendors: vendors.length,
    commissionPlans,
    isLoading,
    error,
    
    // UI State
    hoveredRow,
    setHoveredRow,
    searchTerm,
    setSearchTerm,
    
    // Selected Vendor
    selectedVendor,
    setSelectedVendor,
    openDetailModal,
    closeDetailModal,
    
    // Approve Modal
    approveModalOpen,
    selectedCommissionPlan,
    setSelectedCommissionPlan,
    handleApproveClick,
    closeApproveModal,
    submitApprove,
    isApproving: approveFullMutation.isPending,
    
    // Reject Modal
    rejectModalOpen,
    rejectionReason,
    setRejectionReason,
    handleRejectClick,
    closeRejectModal,
    submitReject,
    isRejecting: rejectMutation.isPending
  };
};

export default useFullApplications;
