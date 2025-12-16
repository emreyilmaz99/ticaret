// src/features/users/shared/constants.js

export const GENDER_MAP = {
  male: 'Erkek',
  female: 'Kadın',
  other: 'Diğer',
};

export const STATUS_COLORS = {
  active: 'green',
  inactive: 'red',
  verified: 'green',
  pending: 'yellow',
};

export const ORDER_STATUS_MAP = {
  pending: { label: 'Beklemede', color: 'yellow' },
  processing: { label: 'İşleniyor', color: 'blue' },
  shipped: { label: 'Kargoda', color: 'blue' },
  delivered: { label: 'Teslim Edildi', color: 'green' },
  cancelled: { label: 'İptal Edildi', color: 'red' },
};

export const PAYMENT_STATUS_MAP = {
  paid: { label: 'Ödendi', color: '#059669' },
  pending: { label: 'Beklemede', color: '#f59e0b' },
  failed: { label: 'Başarısız', color: '#dc2626' },
  refunded: { label: 'İade Edildi', color: '#dc2626' },
};

export const DEFAULT_FILTERS = {
  is_active: null,
  gender: '',
  email_verified: null,
};

export const DEFAULT_SORT = {
  sortBy: 'created_at',
  sortOrder: 'desc',
};

export const DEFAULT_PAGINATION = {
  currentPage: 1,
  perPage: 15,
};

export const MODAL_TABS = {
  DETAILS: 'details',
  ORDERS: 'orders',
};
