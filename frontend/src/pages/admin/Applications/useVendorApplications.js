// src/pages/admin/Applications/useVendorApplications.js
import { useState, useMemo, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getApplications, 
  approvePreApplication, 
  rejectPreApplication,
  approveFullApplication,
  rejectFullApplication
} from '../../../features/vendor-application/api/vendorApplicationApi';
import { getActiveCommissionPlans } from '../../../features/commission/api/commissionApi';
import { useToast } from '../../../components/common/Toast';
import apiClient from '@lib/apiClient';

/**
 * Vendor Applications sayfası için custom hook
 * Hem Pre Applications hem de Full Applications'u yönetir
 */
const useVendorApplications = () => {
  const queryClient = useQueryClient();
  const toast = useToast();
  
  // Tab state: 'pre' for pre-applications, 'full' for pending activation vendors
  const [activeTab, setActiveTab] = useState('pre');
  const [filters, setFilters] = useState({ type: 'pre_application' });
  
  // Selection State
  const [selectedApp, setSelectedApp] = useState(null);
  const [selectedVendor, setSelectedVendor] = useState(null);
  
  // Modal State
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [approveModalOpen, setApproveModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [selectedCommissionPlan, setSelectedCommissionPlan] = useState(null);
  
  // Search & Filter
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [hoveredRow, setHoveredRow] = useState(null);

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

  // Komisyon planlarını getir
  const { data: commissionPlansData } = useQuery({
    queryKey: ['activeCommissionPlans'],
    queryFn: getActiveCommissionPlans,
  });

  const commissionPlans = commissionPlansData?.data?.data || [];
  const applications = preAppData?.data?.data?.data || [];
  const pendingVendors = pendingVendorsData?.data?.data || pendingVendorsData?.data || [];
  
  const isLoading = activeTab === 'pre' ? preAppLoading : pendingVendorsLoading;

  // ============ FILTERED DATA ============

  // Filtreleme - Pre Applications
  const filteredApplications = useMemo(() => {
    return applications.filter(app => {
      const matchesSearch = !searchTerm || 
        app.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.phone?.includes(searchTerm);
      
      const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [applications, searchTerm, statusFilter]);

  // Filtreleme - Pending Vendors
  const filteredVendors = useMemo(() => {
    return pendingVendors.filter(vendor => {
      const matchesSearch = !searchTerm || 
        vendor.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vendor.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vendor.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vendor.phone?.includes(searchTerm);
      
      return matchesSearch;
    });
  }, [pendingVendors, searchTerm]);

  // ============ STATS ============

  const preStats = useMemo(() => ({
    total: applications.length,
    pending: applications.filter(a => a.status === 'pending').length,
    approved: applications.filter(a => a.status === 'approved').length,
    rejected: applications.filter(a => a.status === 'rejected').length,
  }), [applications]);

  const vendorStats = useMemo(() => ({
    total: pendingVendors.length,
  }), [pendingVendors]);

  // ============ MUTATIONS ============

  // Approve Pre Application
  const approvePreMutation = useMutation({
    mutationFn: approvePreApplication,
    onSuccess: () => {
      queryClient.invalidateQueries(['preApplications']);
      queryClient.invalidateQueries(['pendingActivationVendors']);
      setSelectedApp(null);
      setApproveModalOpen(false);
      toast.success('Ön Başvuru Onaylandı!', 'Satıcı hesabı oluşturuldu. Satıcı tam başvurusunu tamamlaması için bilgilendirilecek.');
    },
    onError: (err) => toast.error('Hata', err.response?.data?.message || 'Hata oluştu')
  });

  // Approve Full Application (Vendor Activation)
  const approveFullMutation = useMutation({
    mutationFn: ({ vendorId, commissionPlanId }) => approveFullApplication(vendorId, commissionPlanId),
    onSuccess: () => {
      queryClient.invalidateQueries(['pendingActivationVendors']);
      queryClient.invalidateQueries(['active-vendors']);
      setSelectedVendor(null);
      setApproveModalOpen(false);
      setSelectedCommissionPlan(null);
      toast.success('Satıcı Aktifleştirildi', 'Satıcı başarıyla aktif edildi ve iyzico\'ya kaydedildi.');
    },
    onError: (err) => toast.error('Hata', err.response?.data?.message || 'Hata oluştu')
  });

  // Reject Pre Application
  const rejectPreMutation = useMutation({
    mutationFn: ({ id, reason }) => rejectPreApplication(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries(['preApplications']);
      setRejectModalOpen(false);
      setSelectedApp(null);
      setRejectionReason('');
      toast.success('Başvuru Reddedildi', 'Ön başvuru başarıyla reddedildi.');
    },
    onError: (err) => toast.error('Hata', err.response?.data?.message || 'Hata oluştu')
  });

  // Reject Full Application (Vendor)
  const rejectFullMutation = useMutation({
    mutationFn: ({ vendorId, reason }) => rejectFullApplication(vendorId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries(['pendingActivationVendors']);
      setRejectModalOpen(false);
      setSelectedVendor(null);
      setRejectionReason('');
      toast.success('Başvuru Reddedildi', 'Tam başvuru reddedildi.');
    },
    onError: (err) => toast.error('Hata', err.response?.data?.message || 'Hata oluştu')
  });

  // ============ HANDLERS - PRE APPLICATION ============

  const handleApprovePreClick = useCallback((app) => {
    setSelectedApp(app);
    setApproveModalOpen(true);
  }, []);

  const handleRejectPreClick = useCallback((app) => {
    setSelectedApp(app);
    setRejectModalOpen(true);
  }, []);

  const submitApprovePre = useCallback(() => {
    approvePreMutation.mutate(selectedApp.id);
  }, [selectedApp, approvePreMutation]);

  const submitRejectPre = useCallback(() => {
    if (rejectionReason.length < 10) {
      toast.warning('Uyarı', 'Red nedeni en az 10 karakter olmalıdır.');
      return;
    }
    rejectPreMutation.mutate({ id: selectedApp.id, reason: rejectionReason });
  }, [selectedApp, rejectionReason, rejectPreMutation, toast]);

  // ============ HANDLERS - VENDOR (FULL) ============

  const handleApproveVendorClick = useCallback((vendor) => {
    setSelectedVendor(vendor);
    const defaultPlan = commissionPlans.find(p => p.is_default);
    setSelectedCommissionPlan(defaultPlan?.id || (commissionPlans[0]?.id || null));
    setApproveModalOpen(true);
  }, [commissionPlans]);

  const handleRejectVendorClick = useCallback((vendor) => {
    setSelectedVendor(vendor);
    setRejectModalOpen(true);
  }, []);

  const submitApproveVendor = useCallback(() => {
    if (!selectedCommissionPlan) {
      toast.warning('Uyarı', 'Lütfen bir komisyon planı seçin.');
      return;
    }
    approveFullMutation.mutate({ vendorId: selectedVendor.id, commissionPlanId: selectedCommissionPlan });
  }, [selectedVendor, selectedCommissionPlan, approveFullMutation, toast]);

  const submitRejectVendor = useCallback(() => {
    if (rejectionReason.length < 10) {
      toast.warning('Uyarı', 'Red nedeni en az 10 karakter olmalıdır.');
      return;
    }
    rejectFullMutation.mutate({ vendorId: selectedVendor.id, reason: rejectionReason });
  }, [selectedVendor, rejectionReason, rejectFullMutation, toast]);

  // ============ TAB HANDLERS ============

  const handleTabChange = useCallback((tab) => {
    setActiveTab(tab);
    setSearchTerm('');
    setStatusFilter('all');
    setSelectedApp(null);
    setSelectedVendor(null);
    setApproveModalOpen(false);
    setRejectModalOpen(false);
  }, []);

  // ============ MODAL HANDLERS ============

  const closeApproveModal = useCallback(() => {
    setApproveModalOpen(false);
    setSelectedApp(null);
    setSelectedVendor(null);
  }, []);

  const closeRejectModal = useCallback(() => {
    setRejectModalOpen(false);
    setRejectionReason('');
    setSelectedApp(null);
    setSelectedVendor(null);
  }, []);

  const openDetailModal = useCallback((item) => {
    console.log('openDetailModal called with:', item);
    if (activeTab === 'pre') {
      setSelectedApp(item);
    } else {
      setSelectedVendor(item);
    }
    setDetailModalOpen(true);
  }, [activeTab]);

  const closeDetailModal = useCallback(() => {
    setDetailModalOpen(false);
    setSelectedApp(null);
    setSelectedVendor(null);
  }, []);

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
    openDetailModal,
    closeDetailModal,
    
    // Approve Modal
    approveModalOpen,
    selectedCommissionPlan,
    setSelectedCommissionPlan,
    closeApproveModal,
    
    // Pre Application handlers
    handleApprovePreClick,
    submitApprovePre,
    isApprovingPre: approvePreMutation.isPending,
    
    // Vendor handlers
    handleApproveVendorClick,
    submitApproveVendor,
    isApprovingVendor: approveFullMutation.isPending,
    
    // Reject Modal
    rejectModalOpen,
    rejectionReason,
    setRejectionReason,
    closeRejectModal,
    
    // Pre Application reject
    handleRejectPreClick,
    submitRejectPre,
    isRejectingPre: rejectPreMutation.isPending,
    
    // Vendor reject
    handleRejectVendorClick,
    submitRejectVendor,
    isRejectingVendor: rejectFullMutation.isPending,
  };
};

export default useVendorApplications;
