// src/pages/admin/Applications/api/applicationApi.js
import apiClient from '@lib/apiClient';

/**
 * Get pre-pending applications
 */
export const getPreApplications = async ({ page = 1, per_page = 10 } = {}) => {
  const response = await apiClient.get('/v1/admin/vendors', {
    params: { status: 'pre_pending', page, per_page },
  });
  return response.data;
};

/**
 * Get full approval pending applications
 */
export const getFullApplications = async ({ page = 1, per_page = 10 } = {}) => {
  const response = await apiClient.get('/v1/admin/vendors', {
    params: { status: 'pending_full_approval', page, per_page },
  });
  return response.data;
};

/**
 * Get all applications with optional status filter
 */
export const getApplications = async ({ status, page = 1, per_page = 10 } = {}) => {
  const params = { page, per_page };
  if (status && status !== 'all') {
    params.status = status;
  }
  const response = await apiClient.get('/v1/admin/vendors', { params });
  return response.data;
};

/**
 * Approve pre-application (pre_pending -> pre_approved)
 */
export const approvePreApplication = async (vendorId) => {
  const response = await apiClient.put(`/v1/admin/vendors/${vendorId}/status`, {
    status: 'pre_approved',
  });
  return response.data;
};

/**
 * Approve full application with commission plan
 */
export const approveFullApplication = async (vendorId, commissionPlanId) => {
  const response = await apiClient.post(`/v1/admin/vendors/${vendorId}/approve`, {
    commission_plan_id: commissionPlanId,
  });
  return response.data;
};

/**
 * Reject application with reason
 */
export const rejectApplication = async (vendorId, reason) => {
  const response = await apiClient.put(`/v1/admin/vendors/${vendorId}/status`, {
    status: 'rejected',
    reason,
  });
  return response.data;
};

/**
 * Update vendor status
 */
export const updateApplicationStatus = async (vendorId, status, options = {}) => {
  const response = await apiClient.put(`/v1/admin/vendors/${vendorId}/status`, {
    status,
    ...options,
  });
  return response.data;
};

/**
 * Get application detail
 */
export const getApplicationDetail = async (vendorId) => {
  const response = await apiClient.get(`/v1/admin/vendors/${vendorId}`);
  return response.data;
};

/**
 * Update admin notes
 */
export const updateAdminNotes = async (vendorId, notes) => {
  const response = await apiClient.put(`/v1/admin/vendors/${vendorId}`, {
    admin_notes: notes,
  });
  return response.data;
};
