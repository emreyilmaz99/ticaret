// src/pages/public/Home/components/FloatingCircle.jsx
import React from 'react';

/**
 * Animated floating circle for background decoration
 */
const FloatingCircle = ({ size, top, left, delay, duration }) => (
  <div
    style={{
      position: 'absolute',
      width: size,
      height: size,
      borderRadius: '50%',
      background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.05) 100%)',
      top,
      left,
      animation: `float ${duration}s ease-in-out infinite`,
      animationDelay: `${delay}s`,
    }}
  />
);

export default FloatingCircle;
