// src/components/modals/shared/styles/modalBase.js
import { modalColors } from './colors';

export const getModalBaseStyles = (isMobile = false) => ({
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: modalColors.overlayBg,
    backdropFilter: 'blur(4px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
    padding: isMobile ? '0' : '20px',
    animation: 'modalFadeIn 0.2s ease',
  },
  
  container: {
    backgroundColor: modalColors.white,
    borderRadius: isMobile ? '0' : '24px',
    maxWidth: '100%',
    maxHeight: isMobile ? '100vh' : '90vh',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    position: 'relative',
    animation: 'modalSlideUp 0.3s ease',
  },
  
  header: {
    padding: '24px',
    borderBottom: `1px solid ${modalColors.border}`,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: modalColors.lightGray,
    flexShrink: 0,
  },
  
  title: {
    fontSize: isMobile ? '18px' : '20px',
    fontWeight: '700',
    color: modalColors.darkText,
    margin: 0,
    fontFamily: '"Inter", sans-serif',
  },
  
  content: {
    flex: 1,
    overflowY: 'auto',
    overflowX: 'hidden',
  },
  
  footer: {
    padding: '20px 24px',
    borderTop: `1px solid ${modalColors.border}`,
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
    backgroundColor: modalColors.lightGray,
    flexShrink: 0,
  },
});

export const buttonStyles = {
  base: {
    padding: '12px 24px',
    borderRadius: '12px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    border: 'none',
    fontFamily: '"Inter", sans-serif',
  },
  
  primary: {
    backgroundColor: modalColors.primary,
    color: modalColors.white,
    boxShadow: `0 4px 6px -1px rgba(5, 150, 105, 0.2)`,
  },
  
  primaryHover: {
    backgroundColor: modalColors.primaryHover,
    transform: 'translateY(-1px)',
    boxShadow: `0 6px 8px -1px rgba(5, 150, 105, 0.3)`,
  },
  
  secondary: {
    backgroundColor: modalColors.white,
    color: modalColors.mediumText,
    border: `1px solid ${modalColors.border}`,
  },
  
  secondaryHover: {
    backgroundColor: modalColors.lightGray,
  },
  
  danger: {
    backgroundColor: modalColors.danger,
    color: modalColors.white,
  },
  
  dangerHover: {
    backgroundColor: modalColors.dangerHover,
    transform: 'translateY(-1px)',
  },
};
