// src/components/common/Toast/ToastContainer.jsx
import React from 'react';
import ToastItem from './ToastItem';
import './animations.css';

const ToastContainer = React.memo(({ toasts, removeToast }) => {
  return (
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
  );
});

ToastContainer.displayName = 'ToastContainer';

export default ToastContainer;
