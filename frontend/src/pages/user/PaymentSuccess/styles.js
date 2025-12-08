// src/pages/user/PaymentSuccess/styles.js
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
    backgroundColor: '#dcfce7', // var(--primary-lighter)
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 24px',
  },
  icon: {
    width: '48px',
    height: '48px',
    color: '#16a34a', // var(--primary)
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
  },
  orderBox: {
    backgroundColor: '#f8fafc', // var(--bg-body)
    borderRadius: '16px',
    padding: '20px',
    marginBottom: '24px',
    textAlign: 'left',
  },
  orderHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '16px',
    paddingBottom: '12px',
    borderBottom: '1px solid #e2e8f0',
  },
  orderHeaderText: {
    fontWeight: '600',
    color: '#111827', // var(--text-main)
    fontSize: '15px',
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
    backgroundColor: '#dcfce7', // var(--primary-light)
    color: '#15803d', // var(--primary-dark)
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600',
  },
  infoBox: {
    backgroundColor: '#f0fdf4', // var(--primary-lighter)
    border: '1px solid #dcfce7', // var(--primary-light)
    borderRadius: '12px',
    padding: '16px',
    marginBottom: '24px',
  },
  infoText: {
    fontSize: '14px',
    color: '#15803d', // var(--primary-dark)
    lineHeight: '1.5',
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
