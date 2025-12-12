import React from 'react';
import { ProductCard } from '../../../../components/common/ProductCard';

export const ProductsGrid = ({ 
  products, 
  onAddToCart, 
  onQuickView,
  viewMode,
  compareList = [],
  onToggleCompare,
  isLoading,
  isFetchingNextPage,
  hasNextPage,
  loadMoreRef,
  styles 
}) => {
  
  if (isLoading) {
    return (
      <div style={{ padding: '60px', textAlign: 'center', width: '100%' }}>
        <p style={{ color: '#6B7280', fontSize: '16px' }}>Yükleniyor...</p>
      </div>
    );
  }
  
  if (!products || products.length === 0) {
    return (
      <div style={{ padding: '60px', textAlign: 'center', width: '100%' }}>
        <p style={{ color: '#6B7280', fontSize: '16px' }}>Ürün bulunamadı.</p>
      </div>
    );
  }

  return (
    <>
      <div style={viewMode === 'list' ? {
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      } : styles.grid}>
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={onAddToCart}
            onQuickView={onQuickView}
            isInCompareList={compareList.includes(product.id)}
            onToggleCompare={onToggleCompare}
            viewMode={viewMode}
          />
        ))}
      </div>
      
      {/* Infinite Scroll Indicator */}
      {isFetchingNextPage && (
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <p style={{ color: '#6B7280', fontSize: '14px' }}>Daha fazla ürün yükleniyor...</p>
        </div>
      )}
      
      {/* Load More Trigger */}
      <div ref={loadMoreRef} style={{ height: '20px', width: '100%' }} />
    </>
  );
};

export default ProductsGrid;