// src/pages/admin/Applications/hooks/useApplicationModals.js
import { useState, useCallback } from 'react';

/**
 * Modal state management for applications
 * Handles approve, reject, and detail modals for both pre and full applications
 */
const useApplicationModals = () => {
  // Selected Items
  const [selectedApp, setSelectedApp] = useState(null);
  const [selectedVendor, setSelectedVendor] = useState(null);
  
  // Modal States
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [approveModalOpen, setApproveModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  
  // Form States
  const [rejectionReason, setRejectionReason] = useState('');
  const [selectedCommissionPlan, setSelectedCommissionPlan] = useState(null);

  // ============ APPROVE MODAL ============

  const openApproveModal = useCallback((item, isVendor = false, defaultPlanId = null) => {
    if (isVendor) {
      setSelectedVendor(item);
      setSelectedCommissionPlan(defaultPlanId);
    } else {
      setSelectedApp(item);
    }
    setApproveModalOpen(true);
  }, []);

  const closeApproveModal = useCallback(() => {
    setApproveModalOpen(false);
    setSelectedApp(null);
    setSelectedVendor(null);
    setSelectedCommissionPlan(null);
  }, []);

  // ============ REJECT MODAL ============

  const openRejectModal = useCallback((item, isVendor = false) => {
    if (isVendor) {
      setSelectedVendor(item);
    } else {
      setSelectedApp(item);
    }
    setRejectModalOpen(true);
  }, []);

  const closeRejectModal = useCallback(() => {
    setRejectModalOpen(false);
    setRejectionReason('');
    setSelectedApp(null);
    setSelectedVendor(null);
  }, []);

  // ============ DETAIL MODAL ============

  const openDetailModal = useCallback((item, isVendor = false) => {
    if (isVendor) {
      setSelectedVendor(item);
    } else {
      setSelectedApp(item);
    }
    setDetailModalOpen(true);
  }, []);

  const closeDetailModal = useCallback(() => {
    setDetailModalOpen(false);
    setSelectedApp(null);
    setSelectedVendor(null);
  }, []);

  // ============ RESET ALL ============

  const closeAllModals = useCallback(() => {
    setApproveModalOpen(false);
    setRejectModalOpen(false);
    setDetailModalOpen(false);
    setSelectedApp(null);
    setSelectedVendor(null);
    setRejectionReason('');
    setSelectedCommissionPlan(null);
  }, []);

  return {
    // Selected Items
    selectedApp,
    selectedVendor,
    setSelectedApp,
    setSelectedVendor,
    
    // Approve Modal
    approveModalOpen,
    openApproveModal,
    closeApproveModal,
    selectedCommissionPlan,
    setSelectedCommissionPlan,
    
    // Reject Modal
    rejectModalOpen,
    openRejectModal,
    closeRejectModal,
    rejectionReason,
    setRejectionReason,
    
    // Detail Modal
    detailModalOpen,
    openDetailModal,
    closeDetailModal,
    
    // Utils
    closeAllModals,
  };
};

export default useApplicationModals;
