// Mock data - will be replaced with API data when backend is connected
export const MOCK_STATS = [
  { title: 'Toplam Kazanç', value: '₺124,500', change: '+12.5%', isPositive: true, color: '#10b981', iconType: 'wallet' },
  { title: 'Toplam Sipariş', value: '1,240', change: '+8.2%', isPositive: true, color: '#3b82f6', iconType: 'shopping' },
  { title: 'Aktif Ürünler', value: '48', change: '-2.4%', isPositive: false, color: '#f59e0b', iconType: 'box' },
  { title: 'Mağaza Puanı', value: '4.8', change: '+0.1', isPositive: true, color: '#8b5cf6', iconType: 'star' },
];

export const MOCK_TOP_PRODUCTS = [
  { name: 'Kablosuz Kulaklık Pro', sales: 124, revenue: '₺161,076', image: 'https://placehold.co/40' },
  { name: 'Akıllı Saat Series 5', sales: 89, revenue: '₺311,411', image: 'https://placehold.co/40' },
  { name: 'Mekanik Klavye RGB', sales: 56, revenue: '₺120,400', image: 'https://placehold.co/40' },
];

export const MOCK_REVENUE_DATA = [
  { name: 'Pzt', value: 4000 },
  { name: 'Sal', value: 3000 },
  { name: 'Çar', value: 2000 },
  { name: 'Per', value: 2780 },
  { name: 'Cum', value: 1890 },
  { name: 'Cmt', value: 2390 },
  { name: 'Paz', value: 3490 },
];

export const MOCK_RECENT_ORDERS = [
  { id: '#SIP-1024', customer: 'Ahmet Yılmaz', product: 'Kablosuz Kulaklık', date: '10 Dakika önce', amount: '₺1,299', status: 'Bekliyor' },
  { id: '#SIP-1023', customer: 'Ayşe Demir', product: 'Akıllı Saat', date: '2 Saat önce', amount: '₺3,499', status: 'Hazırlanıyor' },
  { id: '#SIP-1022', customer: 'Mehmet Kaya', product: 'Laptop Çantası', date: '5 Saat önce', amount: '₺450', status: 'Kargolandı' },
  { id: '#SIP-1021', customer: 'Zeynep Çelik', product: 'USB Hub', date: '1 Gün önce', amount: '₺299', status: 'Teslim Edildi' },
];

// Status color mappings
export const STATUS_STYLES = {
  'Bekliyor': { backgroundColor: '#fef3c7', color: '#d97706' },
  'Hazırlanıyor': { backgroundColor: '#dbeafe', color: '#2563eb' },
  'Kargolandı': { backgroundColor: '#e0e7ff', color: '#4f46e5' },
  'Teslim Edildi': { backgroundColor: '#dcfce7', color: '#16a34a' },
  'default': { backgroundColor: '#f3f4f6', color: '#4b5563' }
};

/**
 * Get status style for order status badge
 */
export const getStatusStyle = (status) => {
  return STATUS_STYLES[status] || STATUS_STYLES['default'];
};

/**
 * Generates all styles for the dashboard page
 */
export const getStyles = () => ({
  container: {
    fontFamily: "'Inter', sans-serif",
    color: '#1e293b',
    padding: '24px'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '24px',
    background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
    padding: '28px 32px',
    borderRadius: '16px',
    border: '1px solid #e2e8f0',
    flexWrap: 'wrap',
    gap: '16px'
  },
  title: {
    fontSize: '26px',
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: '-0.02em',
    margin: 0
  },
  subtitle: {
    color: '#ffffff',
    fontSize: '15px',
    margin: '6px 0 0 0',
    opacity: 0.9
  },
  headerActions: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center'
  },
  dateFilter: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: 'white',
    padding: '10px 16px',
    borderRadius: '10px',
    border: '1px solid #e2e8f0',
    color: '#475569',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer'
  },
  notificationButton: {
    width: '42px',
    height: '42px',
    backgroundColor: 'white',
    borderRadius: '10px',
    border: '1px solid #e2e8f0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#64748b',
    cursor: 'pointer',
    position: 'relative'
  },
  notificationDot: {
    position: 'absolute',
    top: '8px',
    right: '8px',
    width: '8px',
    height: '8px',
    backgroundColor: '#ef4444',
    borderRadius: '50%'
  },
  addButton: {
    padding: '10px 20px',
    backgroundColor: '#14532d',
    border: 'none',
    borderRadius: '10px',
    fontWeight: '600',
    color: 'white',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(20, 83, 45, 0.2)',
    transition: 'all 0.2s'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '24px',
    marginBottom: '32px'
  },
  statCard: {
    backgroundColor: 'white',
    padding: '24px',
    borderRadius: '16px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px -1px rgba(0, 0, 0, 0.02)',
    border: '1px solid #f1f5f9'
  },
  statHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '16px'
  },
  statIcon: {
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px'
  },
  statChange: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '12px',
    fontWeight: '600',
    padding: '4px 8px',
    borderRadius: '20px'
  },
  statValue: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: '4px'
  },
  statTitle: {
    color: '#64748b',
    fontSize: '13px',
    fontWeight: '500'
  },
  chartsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '24px',
    marginBottom: '32px'
  },
  card: {
    backgroundColor: 'white',
    padding: '24px',
    borderRadius: '16px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.02)',
    border: '1px solid #f1f5f9'
  },
  cardTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: '24px'
  },
  chartContainer: {
    height: '300px',
    width: '100%'
  },
  productItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    paddingBottom: '16px'
  },
  productImage: {
    width: '48px',
    height: '48px',
    borderRadius: '8px',
    backgroundColor: '#f1f5f9'
  },
  productInfo: {
    flex: 1
  },
  productName: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#0f172a',
    margin: 0
  },
  productSales: {
    fontSize: '12px',
    color: '#64748b',
    margin: '4px 0 0 0'
  },
  productRevenue: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#10b981'
  },
  viewAllButton: {
    marginTop: 'auto',
    width: '100%',
    padding: '12px',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    backgroundColor: 'white',
    color: '#475569',
    fontWeight: '600',
    cursor: 'pointer'
  },
  tableCard: {
    backgroundColor: 'white',
    padding: '24px',
    borderRadius: '16px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.02)',
    border: '1px solid #f1f5f9'
  },
  tableHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px'
  },
  tableViewAll: {
    color: '#3b82f6',
    background: 'none',
    border: 'none',
    fontWeight: '600',
    cursor: 'pointer'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse'
  },
  tableHeaderCell: {
    textAlign: 'left',
    padding: '12px',
    color: '#64748b',
    fontSize: '12px',
    fontWeight: '600',
    textTransform: 'uppercase'
  },
  tableCell: {
    padding: '16px 12px'
  },
  statusBadge: {
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600'
  },
  // Status screens
  pendingContainer: {
    padding: 24
  },
  pendingCard: {
    backgroundColor: '#fef3c7',
    border: '1px solid #f59e0b',
    borderRadius: 16,
    padding: 32,
    marginBottom: 24,
    textAlign: 'center'
  },
  pendingIcon: {
    fontSize: 48,
    marginBottom: 16
  },
  pendingTitle: {
    fontSize: 24,
    fontWeight: 700,
    color: '#92400e',
    marginBottom: 8
  },
  pendingText: {
    color: '#a16207',
    fontSize: 16
  },
  bannedCard: {
    backgroundColor: '#fef2f2',
    border: '1px solid #ef4444',
    borderRadius: 16,
    padding: 32,
    textAlign: 'center'
  },
  bannedTitle: {
    fontSize: 24,
    fontWeight: 700,
    color: '#991b1b',
    marginBottom: 8
  },
  bannedText: {
    color: '#b91c1c',
    fontSize: 16
  },
  infoGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 24
  },
  infoCard: {
    background: 'white',
    padding: 24,
    borderRadius: 16,
    border: '1px solid #e2e8f0'
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 600,
    marginBottom: 16,
    color: '#0f172a'
  },
  infoRow: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  infoLabel: {
    color: '#64748b'
  },
  infoValue: {
    fontWeight: 500
  }
});

export const styles = getStyles();
