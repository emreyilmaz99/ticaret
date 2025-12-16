// src/pages/admin/Applications/useVendorApplications.js
import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getApplications } from '../../../features/vendor-application/api/vendorApplicationApi';
import { getActiveCommissionPlans } from '../../../features/commission/api/commissionApi';
import apiClient from '@lib/apiClient';
import useApplicationFilters from './hooks/useApplicationFilters';
import useApplicationModals from './hooks/useApplicationModals';
import useApplicationMutations from './hooks/useApplicationMutations';

/**
 * Vendor Applications sayfası için orchestrator hook
 * Üç modüler hook'u birleştirir: filters, modals, mutations
 */
const useVendorApplications = () => {
  // Tab state: 'pre' for pre-applications, 'full' for pending activation vendors
  const [activeTab, setActiveTab] = useState('pre');
  const [filters, setFilters] = useState({ type: 'pre_application' });

  // ============ QUERIES ============

  // Pre-applications query
  const { data: preAppData, isLoading: preAppLoading } = useQuery({
    queryKey: ['preApplications', filters],
    queryFn: () => getApplications(filters),
    enabled: activeTab === 'pre',
    keepPreviousData: true
  });

  // Pending activation vendors query
  const { data: pendingVendorsData, isLoading: pendingVendorsLoading } = useQuery({
    queryKey: ['pendingActivationVendors'],
    queryFn: async () => {
      const response = await apiClient.get('/v1/admin/vendors', { 
        params: { status: 'pending_full_approval' } 
      });
      return response.data;
    },
    enabled: activeTab === 'full',
    keepPreviousData: true
  });

  // Commission plans query
  const { data: commissionPlansData } = useQuery({
    queryKey: ['activeCommissionPlans'],
    queryFn: getActiveCommissionPlans,
  });

  const commissionPlans = commissionPlansData?.data?.data || [];
  const applications = preAppData?.data?.data?.data || [];
  const pendingVendors = pendingVendorsData?.data?.data || pendingVendorsData?.data || [];
  const isLoading = activeTab === 'pre' ? preAppLoading : pendingVendorsLoading;

  // ============ MODULAR HOOKS ============

  // Filter hook
  const {
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    hoveredRow,
    setHoveredRow,
    filteredApplications,
    filteredVendors,
    preStats,
    vendorStats,
    resetFilters,
  } = useApplicationFilters(applications, pendingVendors);

  // Modal hook
  const {
    selectedApp,
    selectedVendor,
    setSelectedApp,
    setSelectedVendor,
    approveModalOpen,
    openApproveModal,
    closeApproveModal,
    selectedCommissionPlan,
    setSelectedCommissionPlan,
    rejectModalOpen,
    openRejectModal,
    closeRejectModal,
    rejectionReason,
    setRejectionReason,
    detailModalOpen,
    openDetailModal,
    closeDetailModal,
    closeAllModals,
  } = useApplicationModals();

  // Mutation hook
  const {
    submitApprovePre,
    submitRejectPre,
    isApprovingPre,
    isRejectingPre,
    submitApproveVendor,
    submitRejectVendor,
    isApprovingVendor,
    isRejectingVendor,
  } = useApplicationMutations();

  // ============ HANDLERS - PRE APPLICATION ============

  const handleApprovePreClick = useCallback((app) => {
    openApproveModal(app, false);
  }, [openApproveModal]);

  const handleRejectPreClick = useCallback((app) => {
    openRejectModal(app, false);
  }, [openRejectModal]);

  const handleSubmitApprovePre = useCallback(() => {
    submitApprovePre(selectedApp.id);
    closeApproveModal();
  }, [selectedApp, submitApprovePre, closeApproveModal]);

  const handleSubmitRejectPre = useCallback(() => {
    const success = submitRejectPre(selectedApp.id, rejectionReason);
    if (success) {
      closeRejectModal();
    }
  }, [selectedApp, rejectionReason, submitRejectPre, closeRejectModal]);

  // ============ HANDLERS - VENDOR (FULL) ============

  const handleApproveVendorClick = useCallback((vendor) => {
    const defaultPlan = commissionPlans.find(p => p.is_default);
    const planId = defaultPlan?.id || (commissionPlans[0]?.id || null);
    openApproveModal(vendor, true, planId);
  }, [commissionPlans, openApproveModal]);

  const handleRejectVendorClick = useCallback((vendor) => {
    openRejectModal(vendor, true);
  }, [openRejectModal]);

  const handleSubmitApproveVendor = useCallback(() => {
    const success = submitApproveVendor(selectedVendor.id, selectedCommissionPlan);
    if (success) {
      closeApproveModal();
    }
  }, [selectedVendor, selectedCommissionPlan, submitApproveVendor, closeApproveModal]);

  const handleSubmitRejectVendor = useCallback(() => {
    const success = submitRejectVendor(selectedVendor.id, rejectionReason);
    if (success) {
      closeRejectModal();
    }
  }, [selectedVendor, rejectionReason, submitRejectVendor, closeRejectModal]);

  // ============ TAB HANDLERS ============

  const handleTabChange = useCallback((tab) => {
    setActiveTab(tab);
    resetFilters();
    closeAllModals();
  }, [resetFilters, closeAllModals]);

  // ============ DETAIL MODAL HANDLERS ============

  const handleOpenDetailModal = useCallback((item) => {
    openDetailModal(item, activeTab === 'full');
  }, [activeTab, openDetailModal]);

  return {
    // Tab State
    activeTab,
    handleTabChange,
    
    // Data
    applications: filteredApplications,
    allApplications: applications,
    vendors: filteredVendors,
    allVendors: pendingVendors,
    commissionPlans,
    isLoading,
    
    // Stats
    preStats,
    vendorStats,
    
    // Search & Filter
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    hoveredRow,
    setHoveredRow,
    
    // Selected Items
    selectedApp,
    selectedVendor,
    
    // Detail Modal
    detailModalOpen,
    openDetailModal: handleOpenDetailModal,
    closeDetailModal,
    
    // Approve Modal
    approveModalOpen,
    selectedCommissionPlan,
    setSelectedCommissionPlan,
    closeApproveModal,
    
    // Pre Application handlers
    handleApprovePreClick,
    submitApprovePre: handleSubmitApprovePre,
    isApprovingPre,
    
    // Vendor handlers
    handleApproveVendorClick,
    submitApproveVendor: handleSubmitApproveVendor,
    isApprovingVendor,
    
    // Reject Modal
    rejectModalOpen,
    rejectionReason,
    setRejectionReason,
    closeRejectModal,
    
    // Pre Application reject
    handleRejectPreClick,
    submitRejectPre: handleSubmitRejectPre,
    isRejectingPre,
    
    // Vendor reject
    handleRejectVendorClick,
    submitRejectVendor: handleSubmitRejectVendor,
    isRejectingVendor,
  };
};

export default useVendorApplications;
