/**
 * VendorFinance Styles - Merkezi stil yönetimi
 */

export const getStyles = () => ({
  // Container
  container: {
    fontFamily: "'Inter', sans-serif",
    color: '#1e293b',
  },

  // Header
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '24px',
    background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
    padding: '28px 32px',
    borderRadius: '16px',
    border: '1px solid #e2e8f0',
    flexWrap: 'wrap',
    gap: '16px',
  },
  headerTitle: {
    fontSize: '26px',
    fontWeight: '800',
    color: '#0f172a',
    letterSpacing: '-0.02em',
    margin: 0,
  },
  headerSubtitle: {
    color: '#64748b',
    fontSize: '15px',
    margin: '6px 0 0 0',
  },

  // Cards Grid
  cardsGrid: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr 1fr',
    gap: '24px',
    marginBottom: '32px',
  },

  // Main Wallet Card
  walletCard: {
    backgroundColor: '#14532d',
    backgroundImage: 'linear-gradient(135deg, #14532d 0%, #064e3b 100%)',
    borderRadius: '24px',
    padding: '32px',
    color: 'white',
    position: 'relative',
    overflow: 'hidden',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  },
  walletIcon: {
    position: 'absolute',
    right: '-20px',
    top: '-20px',
    opacity: 0.1,
  },
  walletContent: {
    position: 'relative',
    zIndex: 1,
  },
  walletLabel: {
    fontSize: '14px',
    opacity: 0.8,
    marginBottom: '8px',
  },
  walletAmount: {
    fontSize: '42px',
    fontWeight: '800',
    marginBottom: '24px',
    letterSpacing: '-1px',
  },
  walletActions: {
    display: 'flex',
    gap: '12px',
  },
  withdrawBtn: {
    backgroundColor: 'white',
    color: '#14532d',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '12px',
    fontWeight: '700',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
  },
  settingsBtn: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    color: 'white',
    border: '1px solid rgba(255,255,255,0.3)',
    padding: '12px 24px',
    borderRadius: '12px',
    fontWeight: '600',
    cursor: 'pointer',
  },

  // Secondary Stat Card
  statCard: {
    backgroundColor: 'white',
    padding: '24px',
    borderRadius: '20px',
    border: '1px solid #f1f5f9',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  statIconBox: (bgColor, textColor) => ({
    width: '48px',
    height: '48px',
    backgroundColor: bgColor,
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: textColor,
    marginBottom: '16px',
  }),
  statLabel: {
    color: '#64748b',
    fontSize: '13px',
    fontWeight: '600',
  },
  statValue: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#0f172a',
  },
  statDescription: {
    fontSize: '12px',
    color: '#94a3b8',
    marginTop: '4px',
  },
  statTrend: {
    fontSize: '12px',
    color: '#10b981',
    marginTop: '4px',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },

  // Transaction Table
  tableContainer: {
    backgroundColor: 'white',
    borderRadius: '20px',
    border: '1px solid #f1f5f9',
    padding: '24px',
  },
  tableTitle: {
    fontSize: '18px',
    fontWeight: '700',
    marginBottom: '24px',
    color: '#0f172a',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    textAlign: 'left',
    padding: '12px',
    color: '#94a3b8',
    fontSize: '12px',
    fontWeight: '600',
    borderBottom: '1px solid #f1f5f9',
  },
  thRight: {
    textAlign: 'right',
    padding: '12px',
    color: '#94a3b8',
    fontSize: '12px',
    fontWeight: '600',
    borderBottom: '1px solid #f1f5f9',
  },
  tr: (isLast) => ({
    borderBottom: isLast ? 'none' : '1px solid #f8fafc',
  }),
  tdId: {
    padding: '16px 12px',
    fontWeight: '600',
    color: '#475569',
    fontSize: '13px',
  },
  tdDate: {
    padding: '16px 12px',
    color: '#64748b',
    fontSize: '13px',
  },
  tdDescription: {
    padding: '16px 12px',
    color: '#0f172a',
    fontWeight: '500',
  },
  tdAmount: (isNegative) => ({
    padding: '16px 12px',
    textAlign: 'right',
    fontWeight: '700',
    color: isNegative ? '#ef4444' : '#10b981',
  }),
  tdStatus: {
    padding: '16px 12px',
    textAlign: 'right',
  },
  statusBadge: (isCompleted) => ({
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '11px',
    fontWeight: '700',
    backgroundColor: isCompleted ? '#dcfce7' : '#fef3c7',
    color: isCompleted ? '#16a34a' : '#d97706',
    textTransform: 'uppercase',
  }),
});

export default getStyles;
