// src/hooks/useResponsive.js
import { useState, useEffect } from 'react';

/**
 * Custom hook for responsive breakpoint detection
 * @param {number} breakpoint - Breakpoint width in pixels (default: 768)
 * @returns {boolean} - True if screen is below breakpoint
 */
export const useResponsive = (breakpoint = 768) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= breakpoint);

  useEffect(() => {
    let timeoutId;
    
    const handleResize = () => {
      // Debounce resize events
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setIsMobile(window.innerWidth <= breakpoint);
      }, 150);
    };

    window.addEventListener('resize', handleResize);
    
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', handleResize);
    };
  }, [breakpoint]);

  return isMobile;
};
