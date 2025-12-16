/**
 * Format Utilities - Merkezi format fonksiyonları
 * Para, tarih, durum vb. formatlamalar için tekrar kullanılabilir yardımcılar
 */

/**
 * Para birimi formatla (TL)
 */
export const formatCurrency = (amount) => {
  if (amount === null || amount === undefined) return '0,00 ₺';
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

/**
 * Tarih formatla
 */
export const formatDate = (date, options = {}) => {
  if (!date) return '-';
  const defaultOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    ...options
  };
  return new Date(date).toLocaleDateString('tr-TR', defaultOptions);
};

/**
 * Tarih ve saat formatla
 */
export const formatDateTime = (date) => {
  if (!date) return '-';
  return new Date(date).toLocaleString('tr-TR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Göreceli tarih (2 gün önce, 3 saat önce)
 */
export const formatRelativeDate = (date) => {
  if (!date) return '-';
  
  const now = new Date();
  const past = new Date(date);
  const diffMs = now - past;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Az önce';
  if (diffMins < 60) return `${diffMins} dakika önce`;
  if (diffHours < 24) return `${diffHours} saat önce`;
  if (diffDays < 7) return `${diffDays} gün önce`;
  
  return formatDate(date);
};

/**
 * Sayı formatla (binlik ayraç)
 */
export const formatNumber = (num) => {
  if (num === null || num === undefined) return '0';
  return new Intl.NumberFormat('tr-TR').format(num);
};

/**
 * Yüzde formatla
 */
export const formatPercent = (value, decimals = 0) => {
  if (value === null || value === undefined) return '0%';
  return `${value.toFixed(decimals)}%`;
};

/**
 * Telefon numarası formatla
 */
export const formatPhone = (phone) => {
  if (!phone) return '-';
  // 05551234567 -> (555) 123-4567
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 11 && cleaned.startsWith('0')) {
    return `(${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
  }
  return phone;
};

/**
 * Email maskele (GDPR)
 */
export const maskEmail = (email) => {
  if (!email) return '-';
  const [name, domain] = email.split('@');
  if (name.length <= 2) return email;
  return `${name[0]}${'*'.repeat(name.length - 2)}${name[name.length - 1]}@${domain}`;
};

/**
 * Metin kısalt
 */
export const truncate = (text, maxLength = 50) => {
  if (!text) return '-';
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};

/**
 * Durum metni formatla (uppercase first letter)
 */
export const formatStatus = (status) => {
  if (!status) return '-';
  return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
};

/**
 * Dosya boyutu formatla
 */
export const formatFileSize = (bytes) => {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
};
