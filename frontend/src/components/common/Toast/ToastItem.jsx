// src/components/common/Toast/ToastItem.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { FaTimes } from 'react-icons/fa';
import { toastConfig } from './config';
import { useHoverEffect } from '../../../hooks/useHoverEffect';

const ToastItem = React.memo(({ toast, onRemove }) => {
  const [isExiting, setIsExiting] = useState(false);
  const config = toastConfig[toast.type] || toastConfig.info;
  const Icon = config.icon;
  const { isHovered, handleMouseEnter, handleMouseLeave } = useHoverEffect();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => onRemove(toast.id), 400);
    }, toast.duration || 4000);

    return () => clearTimeout(timer);
  }, [toast.id, toast.duration, onRemove]);

  const handleClose = useCallback(() => {
    setIsExiting(true);
    setTimeout(() => onRemove(toast.id), 400);
  }, [toast.id, onRemove]);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '16px',
        padding: '20px 24px',
        borderRadius: '16px',
        background: config.bgColor,
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.15), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        border: `1px solid ${config.borderColor}`,
        minWidth: '340px',
        maxWidth: '480px',
        animation: isExiting 
          ? 'toastSlideOut 0.4s ease-in-out forwards' 
          : 'toastSlideIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        color: 'white',
        fontFamily: '"Plus Jakarta Sans", sans-serif',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Animated background shine effect */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: '-100%',
          width: '100%',
          height: '100%',
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
          animation: 'toastShine 2s ease-in-out infinite',
        }}
      />

      {/* Icon */}
      <div
        style={{
          width: '44px',
          height: '44px',
          borderRadius: '12px',
          backgroundColor: config.iconBg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          animation: 'toastIconPop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 0.2s forwards',
          transform: 'scale(0)',
        }}
      >
        <Icon size={22} />
      </div>

      {/* Content */}
      <div style={{ flex: 1, paddingRight: '16px' }}>
        {toast.title && (
          <div
            style={{
              fontWeight: '700',
              fontSize: '16px',
              marginBottom: '4px',
              letterSpacing: '-0.01em',
            }}
          >
            {toast.title}
          </div>
        )}
        <div
          style={{
            fontSize: '14px',
            opacity: 0.95,
            lineHeight: '1.5',
          }}
        >
          {toast.message}
        </div>
      </div>

      {/* Close button */}
      <button
        onClick={handleClose}
        style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          background: isHovered ? 'rgba(255, 255, 255, 0.25)' : 'rgba(255, 255, 255, 0.15)',
          border: 'none',
          borderRadius: '8px',
          width: '28px',
          height: '28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          color: 'white',
          transition: 'all 0.2s',
          transform: isHovered ? 'scale(1.1)' : 'scale(1)',
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <FaTimes size={12} />
      </button>

      {/* Progress bar */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          height: '3px',
          backgroundColor: 'rgba(255, 255, 255, 0.3)',
          animation: `toastProgress ${toast.duration || 4000}ms linear forwards`,
          borderRadius: '0 0 16px 16px',
        }}
      />
    </div>
  );
});

ToastItem.displayName = 'ToastItem';

export default ToastItem;
