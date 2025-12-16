import apiClient from '@lib/apiClient';

// Tüm komisyon planlarını listele
export const getCommissionPlans = () => {
  return apiClient.get('/v1/admin/commission-plans');
};

// Aktif komisyon planlarını getir
export const getActiveCommissionPlans = () => {
  return apiClient.get('/v1/admin/commission-plans/active');
};

// Varsayılan komisyon planını getir
export const getDefaultCommissionPlan = () => {
  return apiClient.get('/v1/admin/commission-plans/default');
};

// Tek bir komisyon planını getir
export const getCommissionPlan = (id) => {
  return apiClient.get(`/v1/admin/commission-plans/${id}`);
};

// Yeni komisyon planı oluştur
export const createCommissionPlan = (data) => {
  return apiClient.post('/v1/admin/commission-plans', data);
};

// Komisyon planını güncelle
export const updateCommissionPlan = (id, data) => {
  return apiClient.put(`/v1/admin/commission-plans/${id}`, data);
};

// Komisyon planını sil
export const deleteCommissionPlan = (id) => {
  return apiClient.delete(`/v1/admin/commission-plans/${id}`);
};

// Planı varsayılan olarak ayarla
export const setDefaultCommissionPlan = (id) => {
  return apiClient.post(`/v1/admin/commission-plans/${id}/set-default`);
};

// Aktiflik durumunu değiştir
export const toggleActiveCommissionPlan = (id) => {
  return apiClient.post(`/v1/admin/commission-plans/${id}/toggle-active`);
};

// Planı satıcıya ata
export const assignCommissionPlanToVendor = (vendorId, planId) => {
  return apiClient.post(`/v1/admin/vendors/${vendorId}/assign-commission-plan`, { commission_plan_id: planId });
};
