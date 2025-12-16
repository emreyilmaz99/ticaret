// src/hooks/useProductImage.js
import { useMemo } from 'react';

const FALLBACK_IMAGE = 'https://via.placeholder.com/300x300?text=No+Image';

/**
 * Custom hook for getting product image URL with fallback
 * @param {Object} product - Product object
 * @returns {string} - Image URL
 */
export const useProductImage = (product) => {
  return useMemo(() => {
    if (!product) return FALLBACK_IMAGE;

    // Try different image fields
    const imageFromAPI = product.image || product.thumbnail || product.image_url;
    if (imageFromAPI) {
      return imageFromAPI.startsWith('http') 
        ? imageFromAPI 
        : `http://127.0.0.1:8000${imageFromAPI}`;
    }

    // Try images array
    if (product.images && Array.isArray(product.images) && product.images.length > 0) {
      const firstImage = product.images[0];
      return typeof firstImage === 'string'
        ? (firstImage.startsWith('http') ? firstImage : `http://127.0.0.1:8000${firstImage}`)
        : (firstImage.url || firstImage.path || FALLBACK_IMAGE);
    }

    return FALLBACK_IMAGE;
  }, [product]);
};
