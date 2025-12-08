// src/pages/user/PaymentFailed/styles.js
export const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f8fafc', // var(--bg-body)
    padding: '48px 16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '24px',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1)',
    padding: '40px',
    maxWidth: '480px',
    width: '100%',
    textAlign: 'center',
  },
  iconWrapper: {
    width: '80px',
    height: '80px',
    backgroundColor: '#fee2e2', // var(--danger-light)
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 24px',
  },
  icon: {
    width: '48px',
    height: '48px',
    color: '#dc2626', // var(--danger)
  },
  title: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#111827', // var(--text-main)
    marginBottom: '8px',
  },
  subtitle: {
    fontSize: '16px',
    color: '#6b7280', // var(--text-muted)
    marginBottom: '24px',
    lineHeight: '1.5',
  },
  errorBox: {
    backgroundColor: '#fee2e2', // var(--danger-light)
    border: '1px solid #fecaca',
    borderRadius: '12px',
    padding: '16px',
    marginBottom: '24px',
    textAlign: 'left',
  },
  errorHeader: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
  },
  errorTitle: {
    fontWeight: '600',
    color: '#991b1b',
    fontSize: '14px',
    marginBottom: '4px',
  },
  errorText: {
    fontSize: '14px',
    color: '#b91c1c',
    lineHeight: '1.4',
  },
  orderBox: {
    backgroundColor: '#f8fafc', // var(--bg-body)
    borderRadius: '16px',
    padding: '20px',
    marginBottom: '24px',
    textAlign: 'left',
  },
  orderRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px 0',
  },
  orderLabel: {
    fontSize: '14px',
    color: '#6b7280', // var(--text-muted)
  },
  orderValue: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#111827', // var(--text-main)
  },
  statusBadge: {
    display: 'inline-block',
    padding: '4px 12px',
    backgroundColor: '#fee2e2', // var(--danger-light)
    color: '#dc2626', // var(--danger)
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600',
  },
  actions: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  primaryButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    width: '100%',
    padding: '14px',
    backgroundColor: '#2563eb', // var(--primary)
    color: 'white',
    borderRadius: '12px',
    fontWeight: '600',
    fontSize: '16px',
    border: 'none',
    cursor: 'pointer',
    textDecoration: 'none',
    transition: 'all 0.2s',
  },
  secondaryButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    width: '100%',
    padding: '14px',
    backgroundColor: 'transparent',
    color: '#6b7280', // var(--text-muted)
    borderRadius: '12px',
    fontWeight: '600',
    fontSize: '16px',
    border: '1px solid #e2e8f0',
    cursor: 'pointer',
    textDecoration: 'none',
    transition: 'all 0.2s',
  },
  loadingContainer: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8fafc',
  },
};
