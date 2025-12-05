// src/pages/public/CategoryProducts/styles.js

// Category banners
export const CATEGORY_BANNERS = {
  'elektronik': {
    image: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80',
    title: 'Elektronik Dünyası',
    description: 'En yeni teknoloji ürünleri, bilgisayarlar, telefonlar ve daha fazlası burada.'
  },
  'moda': {
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80',
    title: 'Moda & Giyim',
    description: 'Sezonun en trend parçaları ve kombin önerileri.'
  },
  'ev-yasam': {
    image: 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80',
    title: 'Ev & Yaşam',
    description: 'Eviniz için aradığınız her şey, dekorasyondan mobilyaya.'
  },
  'default': {
    image: 'https://images.unsplash.com/photo-1472851294608-415522f96319?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80',
    title: 'Alışverişin Keyfini Çıkarın',
    description: 'Binlerce ürün, uygun fiyatlar ve hızlı teslimat.'
  }
};

// Mock brands
export const MOCK_BRANDS = ['Apple', 'Samsung', 'Lenovo', 'Asus', 'HP', 'Dell', 'Huawei'];

export const getStyles = (isMobile) => ({
  container: {
    backgroundColor: '#f8fafc',
    paddingBottom: isMobile ? '60px' : '80px',
    fontFamily: '"Inter", sans-serif',
  },
  banner: {
    height: isMobile ? '140px' : '200px',
    width: '100%',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white',
    textAlign: 'center',
    marginBottom: isMobile ? '20px' : '32px',
    padding: isMobile ? '0 16px' : '0',
  },
  bannerTitle: {
    fontSize: isMobile ? '22px' : '32px',
    fontWeight: '800',
    marginBottom: '8px',
  },
  bannerDesc: {
    fontSize: isMobile ? '13px' : '16px',
    opacity: 0.9,
    maxWidth: '600px',
  },
  wrapper: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: isMobile ? '0 12px' : '0 20px',
  },
  breadcrumb: {
    display: isMobile ? 'none' : 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '13px',
    color: '#64748b',
    marginBottom: '16px',
  },
  content: {
    display: 'flex',
    gap: isMobile ? '16px' : '32px',
    alignItems: 'flex-start',
    flexDirection: isMobile ? 'column' : 'row',
  },
  sidebar: {
    width: isMobile ? '100%' : '260px',
    flexShrink: 0,
    backgroundColor: 'white',
    borderRadius: isMobile ? '12px' : '16px',
    border: '1px solid #e2e8f0',
    padding: isMobile ? '16px' : '24px',
    position: isMobile ? 'relative' : 'sticky',
    top: isMobile ? 'auto' : '20px',
  },
  main: {
    flex: 1,
    width: '100%',
  },
  filterSection: {
    marginBottom: isMobile ? '16px' : '24px',
    borderBottom: '1px solid #f1f5f9',
    paddingBottom: isMobile ? '16px' : '24px',
  },
  filterTitle: {
    fontSize: isMobile ? '13px' : '14px',
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: isMobile ? '12px' : '16px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: isMobile ? '8px' : '10px',
    fontSize: isMobile ? '13px' : '14px',
    color: '#475569',
    marginBottom: isMobile ? '10px' : '12px',
    cursor: 'pointer',
  },
  priceInputs: {
    display: 'flex',
    gap: isMobile ? '8px' : '10px',
    alignItems: 'center',
  },
  priceInput: {
    width: '100%',
    padding: isMobile ? '8px 10px' : '8px 12px',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    fontSize: isMobile ? '12px' : '13px',
    outline: 'none',
  },
  sortBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: isMobile ? '16px' : '24px',
    backgroundColor: 'white',
    padding: isMobile ? '12px 14px' : '16px 24px',
    borderRadius: isMobile ? '10px' : '12px',
    border: '1px solid #e2e8f0',
    flexWrap: isMobile ? 'wrap' : 'nowrap',
    gap: isMobile ? '10px' : '0',
  },
  mobileFilterBtn: {
    display: isMobile ? 'flex' : 'none',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 14px',
    backgroundColor: '#f1f5f9',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '500',
    color: '#475569',
    cursor: 'pointer',
  },
  select: {
    padding: isMobile ? '6px 10px' : '8px 12px',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    fontSize: isMobile ? '12px' : '14px',
    color: '#475569',
    outline: 'none',
    cursor: 'pointer',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(auto-fill, minmax(240px, 1fr))',
    gap: isMobile ? '12px' : '24px',
  },
  emptyState: {
    textAlign: 'center',
    padding: isMobile ? '40px 20px' : '60px',
    backgroundColor: 'white',
    borderRadius: isMobile ? '12px' : '16px',
    border: '1px solid #e2e8f0',
    color: '#64748b',
  },
  // Compare bar
  compareBar: {
    position: 'fixed',
    bottom: isMobile ? '10px' : '20px',
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: 'white',
    padding: isMobile ? '12px 16px' : '16px 24px',
    borderRadius: isMobile ? '12px' : '16px',
    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    alignItems: 'center',
    gap: isMobile ? '12px' : '24px',
    zIndex: 1000,
    border: '1px solid #e2e8f0',
    animation: 'slideUp 0.3s ease',
    maxWidth: isMobile ? '95%' : 'auto',
  },
  compareBtn: {
    padding: isMobile ? '8px 14px' : '10px 20px',
    backgroundColor: '#059669',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: isMobile ? '6px' : '8px',
    fontSize: isMobile ? '12px' : '14px',
  },
  compareItem: {
    position: 'relative',
    width: isMobile ? '32px' : '40px',
    height: isMobile ? '32px' : '40px',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    overflow: 'hidden',
  },
  viewBtn: (isActive) => ({
    padding: '8px', 
    borderRadius: '6px', 
    border: 'none', 
    backgroundColor: isActive ? '#ecfdf5' : 'transparent',
    color: isActive ? '#059669' : '#64748b',
    cursor: 'pointer'
  }),
});
