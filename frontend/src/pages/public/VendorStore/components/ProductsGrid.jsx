// src/pages/public/VendorStore/components/ProductsGrid.jsx
import React from 'react';
import { ProductCard } from '../../../../components/common/ProductCard';
import { FaSpinner } from 'react-icons/fa';

const ProductsGrid = ({ 
  products, 
  isLoading, 
  hasMore, 
  loadMoreRef, 
  onAddToCart,
  isMobile 
}) => {
  if (isLoading && products.length === 0) {
    return (
      <div style={styles.loadingState}>
        <FaSpinner style={styles.spinner} />
        <span>Ürünler yükleniyor...</span>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div style={styles.emptyState}>
        <div style={styles.emptyIcon}>📦</div>
        <h3 style={styles.emptyTitle}>Ürün bulunamadı</h3>
        <p style={styles.emptyText}>
          Bu kriterlere uygun ürün bulunamadı. Filtrelerinizi değiştirmeyi deneyin.
        </p>
      </div>
    );
  }

  return (
    <>
      <div style={{
        ...styles.grid,
        gridTemplateColumns: isMobile 
          ? 'repeat(2, 1fr)' 
          : 'repeat(auto-fill, minmax(280px, 1fr))',
      }}>
        {products.map(product => (
          <ProductCard
            key={product.id}
            product={product}
            viewMode="grid"
            onAddToCart={onAddToCart}
            onQuickView={null}
            isInCompareList={false}
            onToggleCompare={null}
          />
        ))}
      </div>

      {/* Load More Trigger */}
      <div ref={loadMoreRef} style={styles.loadMore}>
        {isLoading && (
          <div style={styles.loadingMore}>
            <FaSpinner style={styles.spinnerSmall} />
            <span>Daha fazla yükleniyor...</span>
          </div>
        )}
        {!hasMore && products.length > 0 && (
          <div style={styles.endMessage}>
            Tüm ürünler yüklendi
          </div>
        )}
      </div>
    </>
  );
};

const styles = {
  grid: {
    display: 'grid',
    gap: '20px',
  },
  loadingState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '80px 20px',
    color: '#64748b',
    fontSize: '15px',
    gap: '16px',
  },
  spinner: {
    fontSize: '32px',
    color: '#059669',
    animation: 'spin 1s linear infinite',
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '80px 20px',
    textAlign: 'center',
  },
  emptyIcon: {
    fontSize: '64px',
    marginBottom: '16px',
  },
  emptyTitle: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#1e293b',
    margin: '0 0 8px 0',
  },
  emptyText: {
    fontSize: '14px',
    color: '#64748b',
    margin: 0,
    maxWidth: '300px',
  },
  loadMore: {
    padding: '40px 20px',
    display: 'flex',
    justifyContent: 'center',
  },
  loadingMore: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    color: '#64748b',
    fontSize: '14px',
  },
  spinnerSmall: {
    fontSize: '16px',
    color: '#059669',
    animation: 'spin 1s linear infinite',
  },
  endMessage: {
    fontSize: '13px',
    color: '#94a3b8',
    fontWeight: '500',
  },
};

// Add keyframes for spinner
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;
document.head.appendChild(styleSheet);

export default ProductsGrid;
