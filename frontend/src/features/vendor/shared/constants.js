// src/features/vendor/shared/constants.js

export const VENDOR_STATUS = {
  PRE_PENDING: 'pre_pending',
  PRE_APPROVED: 'pre_approved',
  PRE_REJECTED: 'pre_rejected',
  PENDING: 'pending',
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  BANNED: 'banned',
  REJECTED: 'rejected',
};

export const VENDOR_STATUS_LABELS = {
  [VENDOR_STATUS.PRE_PENDING]: 'Ön Başvuru - Beklemede',
  [VENDOR_STATUS.PRE_APPROVED]: 'Ön Başvuru - Onaylandı',
  [VENDOR_STATUS.PRE_REJECTED]: 'Ön Başvuru - Reddedildi',
  [VENDOR_STATUS.PENDING]: 'Bekleyen',
  [VENDOR_STATUS.ACTIVE]: 'Aktif',
  [VENDOR_STATUS.INACTIVE]: 'Pasif',
  [VENDOR_STATUS.BANNED]: 'Yasaklı',
  [VENDOR_STATUS.REJECTED]: 'Reddedildi',
};

export const VENDOR_STATUS_COLORS = {
  [VENDOR_STATUS.PRE_PENDING]: 'yellow',
  [VENDOR_STATUS.PRE_APPROVED]: 'blue',
  [VENDOR_STATUS.PRE_REJECTED]: 'red',
  [VENDOR_STATUS.PENDING]: 'yellow',
  [VENDOR_STATUS.ACTIVE]: 'green',
  [VENDOR_STATUS.INACTIVE]: 'gray',
  [VENDOR_STATUS.REJECTED]: 'red',
  [VENDOR_STATUS.BANNED]: 'red',
};

export const VENDOR_TABS = [
  { key: 'all', label: 'Tümü' },
  { key: VENDOR_STATUS.PRE_PENDING, label: VENDOR_STATUS_LABELS[VENDOR_STATUS.PRE_PENDING] },
  { key: VENDOR_STATUS.PRE_APPROVED, label: VENDOR_STATUS_LABELS[VENDOR_STATUS.PRE_APPROVED] },
  { key: VENDOR_STATUS.PENDING, label: VENDOR_STATUS_LABELS[VENDOR_STATUS.PENDING] },
  { key: VENDOR_STATUS.ACTIVE, label: VENDOR_STATUS_LABELS[VENDOR_STATUS.ACTIVE] },
  { key: VENDOR_STATUS.BANNED, label: VENDOR_STATUS_LABELS[VENDOR_STATUS.BANNED] },
];

export const DEFAULT_PAGINATION = {
  currentPage: 1,
  itemsPerPage: 10,
};

export const VENDOR_MODES = {
  ALL: 'all',
  ACTIVE_ONLY: 'active_only',
};
