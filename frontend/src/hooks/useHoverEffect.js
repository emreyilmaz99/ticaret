// src/hooks/useHoverEffect.js
import { useState, useCallback } from 'react';

/**
 * Custom hook for managing hover effects on elements
 * @param {Object} normalStyle - Default style object
 * @param {Object} hoverStyle - Style to apply on hover
 * @returns {Object} - isHovered state and event handlers
 */
export const useHoverEffect = (normalStyle, hoverStyle) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = useCallback((e) => {
    setIsHovered(true);
    if (e?.currentTarget && hoverStyle) {
      Object.assign(e.currentTarget.style, hoverStyle);
    }
  }, [hoverStyle]);

  const handleMouseLeave = useCallback((e) => {
    setIsHovered(false);
    if (e?.currentTarget && normalStyle) {
      Object.assign(e.currentTarget.style, normalStyle);
    }
  }, [normalStyle]);

  return { 
    isHovered,
    handleMouseEnter, 
    handleMouseLeave,
    // Backward compatibility
    onMouseEnter: handleMouseEnter, 
    onMouseLeave: handleMouseLeave 
  };
};
