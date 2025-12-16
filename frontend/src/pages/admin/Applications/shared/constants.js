// src/pages/admin/Applications/shared/constants.js

/**
 * Application Status Enum
 */
export const APPLICATION_STATUS = {
  PRE_PENDING: 'pre_pending',
  PRE_APPROVED: 'pre_approved',
  PRE_REJECTED: 'pre_rejected',
  PENDING_FULL_APPROVAL: 'pending_full_approval',
  PENDING: 'pending',
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  REJECTED: 'rejected',
  BANNED: 'banned',
};

/**
 * Status Labels
 */
export const STATUS_LABELS = {
  [APPLICATION_STATUS.PRE_PENDING]: 'Ön Başvuru - Beklemede',
  [APPLICATION_STATUS.PRE_APPROVED]: 'Ön Başvuru - Onaylandı',
  [APPLICATION_STATUS.PRE_REJECTED]: 'Ön Başvuru - Reddedildi',
  [APPLICATION_STATUS.PENDING_FULL_APPROVAL]: 'Aktivasyon Bekliyor',
  [APPLICATION_STATUS.PENDING]: 'Onay Bekliyor',
  [APPLICATION_STATUS.ACTIVE]: 'Aktif',
  [APPLICATION_STATUS.INACTIVE]: 'Pasif',
  [APPLICATION_STATUS.REJECTED]: 'Reddedildi',
  [APPLICATION_STATUS.BANNED]: 'Yasaklı',
};

/**
 * Status Colors
 */
export const STATUS_COLORS = {
  [APPLICATION_STATUS.PRE_PENDING]: { background: '#fef3c7', color: '#92400e' },
  [APPLICATION_STATUS.PRE_APPROVED]: { background: '#dcfce7', color: '#047857' },
  [APPLICATION_STATUS.PRE_REJECTED]: { background: '#fee2e2', color: '#991b1b' },
  [APPLICATION_STATUS.PENDING_FULL_APPROVAL]: { background: '#fef3c7', color: '#92400e' },
  [APPLICATION_STATUS.PENDING]: { background: '#fef3c7', color: '#92400e' },
  [APPLICATION_STATUS.ACTIVE]: { background: '#dcfce7', color: '#047857' },
  [APPLICATION_STATUS.INACTIVE]: { background: '#f3f4f6', color: '#374151' },
  [APPLICATION_STATUS.REJECTED]: { background: '#fee2e2', color: '#991b1b' },
  [APPLICATION_STATUS.BANNED]: { background: '#fee2e2', color: '#991b1b' },
};

/**
 * Merchant Types
 */
export const MERCHANT_TYPES = {
  PERSONAL: 'personal',
  PRIVATE_COMPANY: 'private_company',
  LIMITED_OR_JOINT_STOCK_COMPANY: 'limited_or_joint_stock_company',
};

/**
 * Merchant Type Labels
 */
export const MERCHANT_TYPE_LABELS = {
  [MERCHANT_TYPES.PERSONAL]: 'Şahıs Şirketi',
  [MERCHANT_TYPES.PRIVATE_COMPANY]: 'Şahıs Şirketi',
  [MERCHANT_TYPES.LIMITED_OR_JOINT_STOCK_COMPANY]: 'Limited veya Anonim Şirket',
};

/**
 * Tab Configuration
 */
export const TAB_CONFIGS = {
  PRE_APPLICATIONS: [
    { id: 'all', label: 'Tümü' },
    { id: APPLICATION_STATUS.PRE_PENDING, label: STATUS_LABELS[APPLICATION_STATUS.PRE_PENDING] },
    { id: APPLICATION_STATUS.PRE_APPROVED, label: STATUS_LABELS[APPLICATION_STATUS.PRE_APPROVED] },
    { id: APPLICATION_STATUS.PENDING, label: STATUS_LABELS[APPLICATION_STATUS.PENDING] },
    { id: APPLICATION_STATUS.ACTIVE, label: STATUS_LABELS[APPLICATION_STATUS.ACTIVE] },
    { id: APPLICATION_STATUS.REJECTED, label: 'Reddedilenler' },
  ],
  DETAIL_MODAL: [
    { id: 'general', label: 'Genel Bilgiler', icon: '📋' },
    { id: 'addresses', label: 'Adresler', icon: '📍' },
    { id: 'bank', label: 'Banka Bilgileri', icon: '🏦' },
  ],
};

/**
 * Pagination Defaults
 */
export const PAGINATION_DEFAULTS = {
  perPage: 10,
  currentPage: 1,
};

/**
 * Validation Rules
 */
export const VALIDATION_RULES = {
  MIN_REJECTION_REASON_LENGTH: 10,
  MIN_ADMIN_NOTE_LENGTH: 5,
};
