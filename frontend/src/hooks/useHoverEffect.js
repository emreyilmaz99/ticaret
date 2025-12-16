// src/hooks/useHoverEffect.js
import { useCallback } from 'react';

/**
 * Custom hook for managing hover effects on elements
 * @param {Object} normalStyle - Default style object
 * @param {Object} hoverStyle - Style to apply on hover
 * @returns {Object} - Event handlers for mouse enter/leave
 */
export const useHoverEffect = (normalStyle, hoverStyle) => {
  const handleMouseEnter = useCallback((e) => {
    if (!e.currentTarget) return;
    Object.assign(e.currentTarget.style, hoverStyle);
  }, [hoverStyle]);

  const handleMouseLeave = useCallback((e) => {
    if (!e.currentTarget) return;
    Object.assign(e.currentTarget.style, normalStyle);
  }, [normalStyle]);

  return { onMouseEnter: handleMouseEnter, onMouseLeave: handleMouseLeave };
};
