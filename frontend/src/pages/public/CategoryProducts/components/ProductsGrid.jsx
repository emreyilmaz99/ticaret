// src/pages/public/CategoryProducts/components/ProductsGrid.jsx
import React from 'react';
import { ProductCard } from './ProductCard';

/**
 * Products grid/list container component
 */
export const ProductsGrid = ({
  products,
  viewMode,
  compareList,
  onToggleCompare,
  onAddToCart,
  onQuickView,
  isLoading,
  isFetchingNextPage,
  hasNextPage,
  loadMoreRef,
  styles
}) => {
  // Loading skeleton
  if (isLoading) {
    return (
      <div style={styles.productsGrid}>
        {[...Array(8)].map((_, i) => (
          <div key={i} style={styles.skeletonCard}>
            <div style={styles.skeletonImage} />
            <div style={styles.skeletonText} />
            <div style={{ ...styles.skeletonText, width: '60%' }} />
            <div style={{ ...styles.skeletonText, width: '40%' }} />
          </div>
        ))}
      </div>
    );
  }

  // No products
  if (!products || products.length === 0) {
    return (
      <div style={styles.emptyState}>
        <p style={styles.emptyText}>Bu kategoride henüz ürün bulunmamaktadır.</p>
      </div>
    );
  }

  return (
    <>
      <div style={viewMode === 'list' ? styles.productsList : styles.productsGrid}>
        {products.map(product => (
          <ProductCard
            key={product.id}
            product={product}
            viewMode={viewMode}
            isInCompareList={compareList.some(p => p.id === product.id)}
            onToggleCompare={onToggleCompare}
            onAddToCart={onAddToCart}
            onQuickView={onQuickView}
            styles={styles}
          />
        ))}
      </div>

      {/* Load More Trigger */}
      <div 
        ref={loadMoreRef} 
        style={styles.loadMoreTrigger}
      >
        {isFetchingNextPage && (
          <div style={styles.loadingMore}>
            <div style={styles.spinner} />
            <span>Daha fazla ürün yükleniyor...</span>
          </div>
        )}
        {!hasNextPage && products.length > 0 && (
          <p style={styles.endMessage}>Tüm ürünler yüklendi</p>
        )}
      </div>
    </>
  );
};
