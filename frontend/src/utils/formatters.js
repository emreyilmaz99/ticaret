// src/utils/formatters.js

/**
 * Format price in Turkish locale
 * @param {number|string} price - Price value
 * @returns {string} - Formatted price string
 */
export const formatPrice = (price) => {
  return parseFloat(price || 0).toLocaleString('tr-TR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};

/**
 * Format rating to 1 decimal place
 * @param {number|string} rating - Rating value
 * @returns {string} - Formatted rating string
 */
export const formatRating = (rating) => {
  return parseFloat(rating || 0).toFixed(1);
};

/**
 * Calculate discount percentage
 * @param {number} originalPrice - Original price
 * @param {number} discountedPrice - Discounted price
 * @returns {number} - Discount percentage
 */
export const calculateDiscountPercentage = (originalPrice, discountedPrice) => {
  if (!originalPrice || !discountedPrice || originalPrice <= discountedPrice) return 0;
  return Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);
};
