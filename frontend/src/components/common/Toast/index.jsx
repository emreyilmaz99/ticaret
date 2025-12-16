// src/components/common/Toast/index.jsx
import React, { useState, createContext, useContext, useCallback, useMemo } from 'react';
import ToastContainer from './ToastContainer';

const ToastContext = createContext(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};

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

  const showToast = useCallback((message, type = 'success', duration = 4000) => {
    return addToast(type, '', message, duration);
  }, [addToast]);

  const contextValue = useMemo(() => ({
    success: (title, message, duration) => addToast('success', title, message, duration),
    error: (title, message, duration) => addToast('error', title, message, duration),
    warning: (title, message, duration) => addToast('warning', title, message, duration),
    info: (title, message, duration) => addToast('info', title, message, duration),
    showToast,
    showSuccess: (message, duration) => addToast('success', 'Başarılı', message, duration),
    showError: (message, duration) => addToast('error', 'Hata', message, duration),
    showWarning: (message, duration) => addToast('warning', 'Uyarı', message, duration),
    showInfo: (message, duration) => addToast('info', 'Bilgi', message, duration),
  }), [addToast, showToast]);

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
};


export default ToastProvider;
