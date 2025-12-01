import axios from '../../../lib/axios';

// --- ADMIN ENDPOINTS ---

// Tüm başvuruları listele
export const getApplications = (params) => {
  return axios.get('/v1/admin/vendor-applications', { params });
};

// Bekleyen ön başvuruları listele
export const getPendingPreApplications = () => {
  return axios.get('/v1/admin/vendor-applications/pending-pre');
};

// Başvuru detayı
export const getApplicationDetail = (id) => {
  return axios.get(`/v1/admin/vendor-applications/${id}`);
};

// Ön başvuru onayla
export const approvePreApplication = (id) => {
  return axios.post(`/v1/admin/vendor-applications/${id}/approve-pre`);
};

// Tam başvuru onayla (Vendor aktifleştir) - komisyon planı ile
export const approveFullApplication = (id, commissionPlanId = null) => {
  return axios.post(`/v1/admin/vendor-applications/${id}/approve-full`, {
    commission_plan_id: commissionPlanId
  });
};

// Başvuruyu reddet
export const rejectApplication = (id, reason) => {
  return axios.post(`/v1/admin/vendor-applications/${id}/reject`, {
    rejection_reason: reason
  });
};

// --- PUBLIC ENDPOINTS ---

// Yeni başvuru gönder
export const submitApplication = (data) => {
  return axios.post('/v1/vendor-applications', data);
};
