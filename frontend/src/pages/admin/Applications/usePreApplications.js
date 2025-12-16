// src/pages/admin/Applications/usePreApplications.js
import { useState, useCallback, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getVendors, updateVendorStatus } from '../../../features/vendor/api/vendorApi';
import { getActiveCommissionPlans } from '../../../features/commission/api/commissionApi';
import { useToast } from '../../../components/common/Toast';

/**
 * Pre Applications sayfası için custom hook
 * Ön başvuruları (pre_pending) listeler ve yönetir
 */
const usePreApplications = () => {
  const queryClient = useQueryClient();
  const toast = useToast();
  
  // Pagination & Filter
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // UI State
  const [hoveredRow, setHoveredRow] = useState(null);
  
  // Modal State
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const [adminNote, setAdminNote] = useState('');
  
  // Action Modal State
  const [approveModalOpen, setApproveModalOpen] = useState(false);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [selectedCommissionPlan, setSelectedCommissionPlan] = useState(null);

  // Status Tabs
  const statusTabs = [
    { id: 'all', label: 'Tümü' },
    { id: 'pre_pending', label: 'Ön Başvuru - Beklemede' },
    { id: 'pre_approved', label: 'Ön Başvuru - Onaylandı' },
    { id: 'pending', label: 'Bekleyen' },
    { id: 'active', label: 'Aktif' },
    { id: 'rejected', label: 'Yasaklı' },
  ];

  // Query - Pre Pending Vendors
  const { data, isLoading, error } = useQuery({
    queryKey: ['preApplications', currentPage, perPage],
    queryFn: async () => {
      const res = await getVendors({ status: 'pre_pending', per_page: perPage, page: currentPage });
      return res.data; 
    },
    keepPreviousData: true,
    staleTime: 1000 * 60
  });

  // Komisyon planlarını getir
  const { data: commissionPlansData } = useQuery({
    queryKey: ['activeCommissionPlans'],
    queryFn: getActiveCommissionPlans,
  });

  const commissionPlans = commissionPlansData?.data?.data || [];
  const vendors = data?.data || [];
  const meta = data?.meta || null;

  // Approve Mutation (pre_pending -> pre_approved)
  const approveMutation = useMutation({
    mutationFn: ({ id }) => updateVendorStatus(id, 'pre_approved'),
    onSuccess: () => {
      queryClient.invalidateQueries(['preApplications']);
      queryClient.invalidateQueries(['vendors']);
      setIsDetailModalOpen(false);
      closeApproveModal();
      toast.success('Başarılı', 'Ön başvuru onaylandı. Satıcı tam başvuru formunu doldurabilir.');
    },
    onError: (err) => {
      toast.error('Hata', err.response?.data?.message || err.message);
    }
  });

  // Reject Mutation
  const rejectMutation = useMutation({
    mutationFn: ({ id, reason }) => updateVendorStatus(id, 'rejected', { reason }),
    onSuccess: () => {
      queryClient.invalidateQueries(['preApplications']);
      queryClient.invalidateQueries(['vendors']);
      setIsDetailModalOpen(false);
      closeRejectModal();
      toast.info('Bilgi', 'Başvuru reddedildi.');
    },
    onError: (err) => {
      toast.error('Hata', err.response?.data?.message || err.message);
    }
  });

  // Filtered Vendors
  const filteredVendors = useMemo(() => {
    return vendors.filter(v => {
      const matchesSearch = 
        v.storeName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.store_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.owner?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.email?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' ? true : v.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [vendors, searchTerm, statusFilter]);

  // Handlers
  const openDetailModal = useCallback((vendor) => {
    console.log('openDetailModal called with:', vendor);
    setSelectedVendor(vendor);
    setAdminNote(vendor.admin_notes || vendor.adminNotes || '');
    setActiveTab('general');
    setIsDetailModalOpen(true);
  }, []);

  const closeDetailModal = useCallback(() => {
    setIsDetailModalOpen(false);
    setSelectedVendor(null);
  }, []);

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

  const closeApproveModal = useCallback(() => {
    setApproveModalOpen(false);
  }, []);

  const closeRejectModal = useCallback(() => {
    setRejectModalOpen(false);
  }, []);

  const submitApprove = useCallback(() => {
    if (!selectedVendor) return;
    approveMutation.mutate({ id: selectedVendor.id });
  }, [selectedVendor, approveMutation]);

  const submitReject = useCallback(() => {
    if (!rejectionReason.trim()) {
      toast.warning('Uyarı', 'Lütfen bir reddetme nedeni giriniz.');
      return;
    }
    rejectMutation.mutate({ id: selectedVendor.id, reason: rejectionReason });
  }, [selectedVendor, rejectionReason, rejectMutation, toast]);

  return {
    // Data
    vendors: filteredVendors,
    allVendors: vendors,
    meta,
    commissionPlans,
    isLoading,
    error,
    
    // Pagination & Filter
    currentPage,
    setCurrentPage,
    perPage,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    statusTabs,
    
    // UI State
    hoveredRow,
    setHoveredRow,
    
    // Detail Modal
    selectedVendor,
    isDetailModalOpen,
    activeTab,
    setActiveTab,
    adminNote,
    setAdminNote,
    openDetailModal,
    closeDetailModal,
    
    // Approve Modal
    approveModalOpen,
    selectedCommissionPlan,
    setSelectedCommissionPlan,
    handleApproveClick,
    closeApproveModal,
    submitApprove,
    isApproving: approveMutation.isPending,
    
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

export default usePreApplications;
