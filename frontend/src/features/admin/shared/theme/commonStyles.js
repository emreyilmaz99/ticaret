/**
 * Common Styles - Tüm admin modüllerinde kullanılan ortak stiller
 * Theme değişkenlerini kullanarak tutarlı stil sağlar
 */

import theme from './theme';

/**
 * Page Header Styles
 */
export const headerStyles = {
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing['4xl'],
    flexWrap: 'wrap',
    gap: theme.spacing.lg,
    background: theme.gradients.gray,
    padding: `${theme.spacing['3xl']} ${theme.spacing['4xl']}`,
    borderRadius: theme.borderRadius.xl,
    border: `1px solid ${theme.colors.border.default}`,
  },
  titleSection: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.lg,
  },
  icon: {
    fontSize: '32px',
    color: theme.colors.primary[600],
  },
  textWrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing.xs,
  },
  title: {
    fontSize: theme.typography.fontSize['3xl'],
    fontWeight: theme.typography.fontWeight.extrabold,
    color: theme.colors.text.primary,
    letterSpacing: '-0.02em',
    margin: 0,
  },
  subtitle: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.secondary,
    margin: 0,
  },
  actions: {
    display: 'flex',
    gap: theme.spacing.md,
  },
};

/**
 * Button Styles
 */
export const buttonStyles = {
  base: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.sm,
    padding: `${theme.spacing.md} ${theme.spacing.lg}`,
    borderRadius: theme.borderRadius.lg,
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.semibold,
    cursor: 'pointer',
    transition: theme.transitions.normal,
    border: 'none',
    outline: 'none',
  },
  primary: {
    background: theme.gradients.primary,
    color: 'white',
    boxShadow: theme.shadows.sm,
  },
  secondary: {
    background: theme.colors.bg.card,
    color: theme.colors.text.primary,
    border: `1px solid ${theme.colors.border.default}`,
    boxShadow: theme.shadows.sm,
  },
  danger: {
    background: theme.gradients.danger,
    color: 'white',
    boxShadow: theme.shadows.sm,
  },
  ghost: {
    background: 'transparent',
    color: theme.colors.text.secondary,
    border: `1px solid ${theme.colors.border.light}`,
  },
};

/**
 * Modal Styles
 */
export const modalStyles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: theme.spacing.xl,
    animation: 'fadeIn 0.2s ease',
  },
  content: {
    background: theme.colors.bg.card,
    borderRadius: theme.borderRadius['2xl'],
    maxWidth: '900px',
    width: '100%',
    maxHeight: '90vh',
    overflow: 'hidden',
    boxShadow: theme.shadows['2xl'],
    animation: 'slideUp 0.3s ease',
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    background: theme.gradients.primary,
    padding: `${theme.spacing['2xl']} ${theme.spacing['3xl']}`,
    color: 'white',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    margin: 0,
    fontSize: theme.typography.fontSize['2xl'],
    fontWeight: theme.typography.fontWeight.bold,
  },
  closeBtn: {
    background: 'rgba(255, 255, 255, 0.2)',
    border: 'none',
    width: '36px',
    height: '36px',
    borderRadius: theme.borderRadius.md,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    color: 'white',
    fontSize: theme.typography.fontSize.lg,
    transition: theme.transitions.fast,
  },
  body: {
    padding: theme.spacing['3xl'],
    flex: 1,
    overflow: 'auto',
  },
  footer: {
    padding: `${theme.spacing.lg} ${theme.spacing['3xl']}`,
    borderTop: `1px solid ${theme.colors.border.default}`,
    display: 'flex',
    justifyContent: 'flex-end',
    gap: theme.spacing.md,
  },
};

/**
 * Table Styles
 */
export const tableStyles = {
  container: {
    background: theme.colors.bg.card,
    borderRadius: theme.borderRadius.xl,
    boxShadow: theme.shadows.sm,
    overflow: 'hidden',
    border: `1px solid ${theme.colors.border.default}`,
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  thead: {
    background: theme.colors.gray[50],
    borderBottom: `1px solid ${theme.colors.border.default}`,
  },
  th: {
    padding: `${theme.spacing.lg} ${theme.spacing['2xl']}`,
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.muted,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    textAlign: 'left',
  },
  td: {
    padding: `${theme.spacing.lg} ${theme.spacing['2xl']}`,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.primary,
    borderBottom: `1px solid ${theme.colors.border.light}`,
  },
  tr: {
    transition: theme.transitions.fast,
  },
  emptyState: {
    padding: `${theme.spacing['5xl']} ${theme.spacing.xl}`,
    textAlign: 'center',
    color: theme.colors.text.muted,
  },
};

/**
 * Form Styles
 */
export const formStyles = {
  fieldGroup: {
    marginBottom: theme.spacing.xl,
  },
  label: {
    display: 'block',
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  input: {
    width: '100%',
    padding: `${theme.spacing.md} ${theme.spacing.lg}`,
    border: `1px solid ${theme.colors.border.default}`,
    borderRadius: theme.borderRadius.md,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.primary,
    outline: 'none',
    transition: theme.transitions.fast,
    fontFamily: theme.typography.fontFamily.sans,
  },
  textarea: {
    width: '100%',
    padding: `${theme.spacing.md} ${theme.spacing.lg}`,
    border: `1px solid ${theme.colors.border.default}`,
    borderRadius: theme.borderRadius.md,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.primary,
    outline: 'none',
    transition: theme.transitions.fast,
    fontFamily: theme.typography.fontFamily.sans,
    resize: 'vertical',
    minHeight: '100px',
  },
  select: {
    width: '100%',
    padding: `${theme.spacing.md} ${theme.spacing.lg}`,
    border: `1px solid ${theme.colors.border.default}`,
    borderRadius: theme.borderRadius.md,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.primary,
    outline: 'none',
    cursor: 'pointer',
    background: theme.colors.bg.card,
    transition: theme.transitions.fast,
  },
  error: {
    color: theme.colors.danger,
    fontSize: theme.typography.fontSize.xs,
    marginTop: theme.spacing.xs,
    fontWeight: theme.typography.fontWeight.medium,
  },
  helpText: {
    color: theme.colors.text.muted,
    fontSize: theme.typography.fontSize.xs,
    marginTop: theme.spacing.xs,
  },
};

/**
 * Stats Grid
 */
export const statsStyles = {
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: theme.spacing.xl,
    marginBottom: theme.spacing['4xl'],
  },
};

/**
 * Search & Filter Toolbar
 */
export const toolbarStyles = {
  container: {
    display: 'flex',
    gap: theme.spacing.lg,
    marginBottom: theme.spacing['2xl'],
    flexWrap: 'wrap',
  },
  searchWrapper: {
    position: 'relative',
    flex: 1,
    minWidth: '300px',
  },
  searchIcon: {
    position: 'absolute',
    left: theme.spacing.lg,
    top: '50%',
    transform: 'translateY(-50%)',
    color: theme.colors.text.muted,
    fontSize: theme.typography.fontSize.sm,
    pointerEvents: 'none',
  },
  searchInput: {
    width: '100%',
    padding: `${theme.spacing.md} ${theme.spacing.lg} ${theme.spacing.md} 40px`,
    border: `1px solid ${theme.colors.border.default}`,
    borderRadius: theme.borderRadius.lg,
    fontSize: theme.typography.fontSize.sm,
    outline: 'none',
    transition: theme.transitions.fast,
  },
  filterGroup: {
    display: 'flex',
    gap: theme.spacing.md,
    alignItems: 'center',
  },
};

/**
 * CSS Animations
 */
export const animations = `
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;
