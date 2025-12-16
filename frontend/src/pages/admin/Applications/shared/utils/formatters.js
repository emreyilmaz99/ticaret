// src/pages/admin/Applications/shared/utils/formatters.js

/**
 * Format date to Turkish locale
 */
export const formatDate = (dateString) => {
  if (!dateString) return '-';
  
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  } catch {
    return dateString;
  }
};

/**
 * Format datetime to Turkish locale
 */
export const formatDateTime = (dateString) => {
  if (!dateString) return '-';
  
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  } catch {
    return dateString;
  }
};

/**
 * Format phone number (0XXX XXX XX XX)
 */
export const formatPhone = (phone) => {
  if (!phone) return '-';
  
  // Remove all non-digits
  const cleaned = phone.replace(/\D/g, '');
  
  // Format: 0XXX XXX XX XX
  if (cleaned.length === 10 || cleaned.length === 11) {
    const match = cleaned.match(/^(\d{4})(\d{3})(\d{2})(\d{2})$/);
    if (match) {
      return `${match[1]} ${match[2]} ${match[3]} ${match[4]}`;
    }
  }
  
  return phone;
};

/**
 * Format IBAN (TR** **** **** **** **** **** **)
 */
export const formatIBAN = (iban) => {
  if (!iban) return '-';
  
  // Remove spaces
  const cleaned = iban.replace(/\s/g, '');
  
  // Format in groups of 4
  return cleaned.match(/.{1,4}/g)?.join(' ') || iban;
};

/**
 * Format Tax ID / VKN (XX-XXX-XXX)
 */
export const formatTaxId = (taxId) => {
  if (!taxId) return '-';
  
  const cleaned = taxId.replace(/\D/g, '');
  
  // Turkish tax ID format: 10 or 11 digits
  if (cleaned.length === 10) {
    const match = cleaned.match(/^(\d{2})(\d{3})(\d{3})(\d{2})$/);
    if (match) {
      return `${match[1]}-${match[2]}-${match[3]}-${match[4]}`;
    }
  }
  
  return taxId;
};

/**
 * Format merchant type label
 */
export const formatMerchantType = (type) => {
  if (!type) return '-';
  
  const types = {
    personal: 'Şahıs Şirketi',
    private_company: 'Şahıs Şirketi',
    limited_or_joint_stock_company: 'Limited veya Anonim Şirket',
  };
  
  return types[type] || type;
};

/**
 * Format currency (Turkish Lira)
 */
export const formatCurrency = (amount) => {
  if (amount === null || amount === undefined) return '-';
  
  try {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
    }).format(amount);
  } catch {
    return `${amount} ₺`;
  }
};

/**
 * Truncate text with ellipsis
 */
export const truncate = (text, maxLength = 50) => {
  if (!text) return '-';
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};

/**
 * Get initials from full name
 */
export const getInitials = (fullName) => {
  if (!fullName) return '??';
  
  const parts = fullName.trim().split(' ');
  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase();
  }
  
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
};

/**
 * Format file size
 */
export const formatFileSize = (bytes) => {
  if (!bytes || bytes === 0) return '0 B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};
