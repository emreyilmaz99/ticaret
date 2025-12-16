// src/features/users/utils/formatters.js

export const formatDate = (dateStr) => {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleDateString('tr-TR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

export const formatDateTime = (dateStr) => {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleString('tr-TR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatDateTimeLong = (dateStr) => {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleDateString('tr-TR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatPrice = (price) => {
  if (!price && price !== 0) return '-';
  return `₺${parseFloat(price).toFixed(2)}`;
};

export const getGenderText = (gender) => {
  const genderMap = {
    male: 'Erkek',
    female: 'Kadın',
    other: 'Diğer',
  };
  return genderMap[gender] || '-';
};
