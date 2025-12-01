import React, { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { FaCheckCircle, FaTimesCircle, FaInfoCircle, FaExclamationTriangle, FaTimes } from 'react-icons/fa';

// Toast Context
const ToastContext = createContext(null);

// Toast types configuration
const toastConfig = {
  success: {
    icon: FaCheckCircle,
    bgColor: 'linear-gradient(135deg, #047857 0%, #059669 100%)',
    borderColor: '#10b981',
    iconBg: 'rgba(255, 255, 255, 0.2)',
  },
  error: {
    icon: FaTimesCircle,
    bgColor: 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)',
    borderColor: '#f87171',
    iconBg: 'rgba(255, 255, 255, 0.2)',
  },
  warning: {
    icon: FaExclamationTriangle,
    bgColor: 'linear-gradient(135deg, #d97706 0%, #f59e0b 100%)',
    borderColor: '#fbbf24',
    iconBg: 'rgba(255, 255, 255, 0.2)',
  },
  info: {
    icon: FaInfoCircle,
    bgColor: 'linear-gradient(135deg, #0369a1 0%, #0ea5e9 100%)',
    borderColor: '#38bdf8',
    iconBg: 'rgba(255, 255, 255, 0.2)',
  },
};

// Single Toast Component
const ToastItem = ({ toast, onRemove }) => {
  const [isExiting, setIsExiting] = useState(false);
  const config = toastConfig[toast.type] || toastConfig.info;
  const Icon = config.icon;

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => onRemove(toast.id), 400);
    }, toast.duration || 4000);

    return () => clearTimeout(timer);
  }, [toast.id, toast.duration, onRemove]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => onRemove(toast.id), 400);
  };

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
          background: 'rgba(255, 255, 255, 0.15)',
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
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)';
          e.currentTarget.style.transform = 'scale(1.1)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
          e.currentTarget.style.transform = 'scale(1)';
        }}
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
};

// Toast Container Component
export const ToastContainer = ({ toasts, removeToast }) => {
  return (
    <>
      <style>{`
        @keyframes toastSlideIn {
          0% {
            opacity: 0;
            transform: translateX(100%) scale(0.8);
          }
          100% {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
        }
        
        @keyframes toastSlideOut {
          0% {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
          100% {
            opacity: 0;
            transform: translateX(100%) scale(0.8);
          }
        }
        
        @keyframes toastIconPop {
          0% {
            transform: scale(0) rotate(-180deg);
          }
          100% {
            transform: scale(1) rotate(0deg);
          }
        }
        
        @keyframes toastShine {
          0% {
            left: -100%;
          }
          50%, 100% {
            left: 100%;
          }
        }
        
        @keyframes toastProgress {
          0% {
            width: 100%;
          }
          100% {
            width: 0%;
          }
        }
      `}</style>
      <div
        style={{
          position: 'fixed',
          top: '24px',
          right: '24px',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}
      >
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
        ))}
      </div>
    </>
  );
};

// Toast Provider Component
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((type, title, message, duration = 4000) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, type, title, message, duration }]);
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const toast = {
    success: (title, message, duration) => addToast('success', title, message, duration),
    error: (title, message, duration) => addToast('error', title, message, duration),
    warning: (title, message, duration) => addToast('warning', title, message, duration),
    info: (title, message, duration) => addToast('info', title, message, duration),
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
};

// Custom hook to use toast
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export default ToastProvider;
