import apiClient from '@lib/apiClient';

// --- ADMIN ENDPOINTS ---

// Tüm başvuruları listele
export const getApplications = (params) => {
  return apiClient.get('/v1/admin/vendor-applications', { params });
};

// Bekleyen ön başvuruları listele
export const getPendingPreApplications = () => {
  return apiClient.get('/v1/admin/vendor-applications/pending-pre');
};

// Başvuru detayı
export const getApplicationDetail = (id) => {
  return apiClient.get(`/v1/admin/vendor-applications/${id}`);
};

// Ön başvuru onayla (creates Vendor with pending_full_application status)
export const approvePreApplication = (id) => {
  return apiClient.post(`/v1/admin/vendor-applications/${id}/approve-pre`);
};

// Ön başvuru reddet
export const rejectPreApplication = (id, reason) => {
  return apiClient.post(`/v1/admin/vendor-applications/${id}/reject-pre`, {
    rejection_reason: reason
  });
};

// Tam başvuru onayla (Vendor aktifleştir) - komisyon planı ile
export const approveFullApplication = (vendorId, commissionPlanId = null) => {
  return apiClient.post(`/v1/admin/vendors/${vendorId}/approve-full`, {
    commission_plan_id: commissionPlanId
  });
};

// Tam başvuru reddet
export const rejectFullApplication = (vendorId, reason) => {
  return apiClient.post(`/v1/admin/vendors/${vendorId}/reject-full`, {
    rejection_reason: reason
  });
};

// Deprecated: Use rejectPreApplication or rejectFullApplication
export const rejectApplication = (id, reason) => {
  return apiClient.post(`/v1/admin/vendor-applications/${id}/reject-pre`, {
    rejection_reason: reason
  });
};

// --- PUBLIC ENDPOINTS ---

// Yeni ön başvuru gönder
export const submitApplication = (data) => {
  return apiClient.post('/v1/vendor-applications', data);
};

// --- VENDOR AUTHENTICATED ENDPOINTS ---

// Vendor durumunu getir
export const getVendorStatus = () => {
  return apiClient.get('/v1/vendor/status');
};

// Tam başvuru gönder (authenticated vendor)
export const submitFullApplication = (data) => {
  return apiClient.post('/v1/vendor/application', data);
};
