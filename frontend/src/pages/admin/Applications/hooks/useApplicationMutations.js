// src/pages/admin/Applications/hooks/useApplicationMutations.js
import { useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  approvePreApplication, 
  rejectApplication,
} from '../api/applicationApi';
import { useToast } from '../../../../components/common/Toast';

/**
 * Application mutations for approve/reject operations
 * Handles both pre-applications and full applications (vendor activation)
 */
const useApplicationMutations = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  // ============ PRE-APPLICATION MUTATIONS ============

  // Approve Pre-Application
  const approvePreMutation = useMutation({
    mutationFn: approvePreApplication,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['preApplications'] });
      queryClient.invalidateQueries({ queryKey: ['pendingActivationVendors'] });
      toast.success('Ön Başvuru Onaylandı!', 'Satıcı hesabı oluşturuldu. Satıcı tam başvurusunu tamamlaması için bilgilendirilecek.');
    },
    onError: (err) => {
      toast.error('Hata', err.response?.data?.message || 'Ön başvuru onaylanırken hata oluştu');
    }
  });

  // Reject Pre-Application
  const rejectPreMutation = useMutation({
    mutationFn: ({ id, reason }) => rejectApplication(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['preApplications'] });
      toast.success('Başvuru Reddedildi', 'Ön başvuru başarıyla reddedildi.');
    },
    onError: (err) => {
      toast.error('Hata', err.response?.data?.message || 'Başvuru reddedilirken hata oluştu');
    }
  });

  // ============ FULL APPLICATION MUTATIONS (VENDOR) ============

  // Approve Full Application (Vendor Activation)
  const approveFullMutation = useMutation({
    mutationFn: async ({ vendorId, commissionPlanId }) => {
      const response = await import('@lib/apiClient').then(mod => mod.default.post(
        `/v1/admin/vendors/${vendorId}/approve`,
        { commission_plan_id: commissionPlanId }
      ));
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pendingActivationVendors'] });
      queryClient.invalidateQueries({ queryKey: ['active-vendors'] });
      toast.success('Satıcı Aktifleştirildi', 'Satıcı başarıyla aktif edildi ve iyzico\'ya kaydedildi.');
    },
    onError: (err) => {
      toast.error('Hata', err.response?.data?.message || 'Satıcı aktifleştirilirken hata oluştu');
    }
  });

  // Reject Full Application (Vendor)
  const rejectFullMutation = useMutation({
    mutationFn: async ({ vendorId, reason }) => {
      const response = await import('@lib/apiClient').then(mod => mod.default.post(
        `/v1/admin/vendors/${vendorId}/reject`,
        { reason }
      ));
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pendingActivationVendors'] });
      toast.success('Başvuru Reddedildi', 'Tam başvuru reddedildi.');
    },
    onError: (err) => {
      toast.error('Hata', err.response?.data?.message || 'Başvuru reddedilirken hata oluştu');
    }
  });

  // ============ SUBMISSION HANDLERS ============

  /**
   * Submit pre-application approval
   */
  const submitApprovePre = useCallback((applicationId) => {
    approvePreMutation.mutate(applicationId);
  }, [approvePreMutation]);

  /**
   * Submit pre-application rejection
   */
  const submitRejectPre = useCallback((applicationId, reason) => {
    if (reason.length < 10) {
      toast.warning('Uyarı', 'Red nedeni en az 10 karakter olmalıdır.');
      return false;
    }
    rejectPreMutation.mutate({ id: applicationId, reason });
    return true;
  }, [rejectPreMutation, toast]);

  /**
   * Submit vendor approval (full application)
   */
  const submitApproveVendor = useCallback((vendorId, commissionPlanId) => {
    if (!commissionPlanId) {
      toast.warning('Uyarı', 'Lütfen bir komisyon planı seçin.');
      return false;
    }
    approveFullMutation.mutate({ vendorId, commissionPlanId });
    return true;
  }, [approveFullMutation, toast]);

  /**
   * Submit vendor rejection (full application)
   */
  const submitRejectVendor = useCallback((vendorId, reason) => {
    if (reason.length < 10) {
      toast.warning('Uyarı', 'Red nedeni en az 10 karakter olmalıdır.');
      return false;
    }
    rejectFullMutation.mutate({ vendorId, reason });
    return true;
  }, [rejectFullMutation, toast]);

  return {
    // Pre-Application
    submitApprovePre,
    submitRejectPre,
    isApprovingPre: approvePreMutation.isPending,
    isRejectingPre: rejectPreMutation.isPending,
    
    // Full Application (Vendor)
    submitApproveVendor,
    submitRejectVendor,
    isApprovingVendor: approveFullMutation.isPending,
    isRejectingVendor: rejectFullMutation.isPending,
    
    // Raw mutations (for advanced usage)
    approvePreMutation,
    rejectPreMutation,
    approveFullMutation,
    rejectFullMutation,
  };
};

export default useApplicationMutations;
