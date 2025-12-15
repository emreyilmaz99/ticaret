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
      <div style={{ 
        padding: '80px 20px', 
        textAlign: 'center', 
        width: '100%',
        backgroundColor: '#fff',
        borderRadius: '16px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <div style={{ 
          fontSize: '48px', 
          marginBottom: '16px',
          animation: 'pulse 1.5s ease-in-out infinite'
        }}>
          🔄
        </div>
        <p style={{ 
          color: '#1F2937', 
          fontSize: '18px',
          fontWeight: '600',
          marginBottom: '8px'
        }}>
          Ürünler Yükleniyor...
        </p>
        <p style={{ 
          color: '#6B7280', 
          fontSize: '14px' 
        }}>
          Lütfen bekleyin
        </p>
      </div>
    );
  }
  
  if (!products || products.length === 0) {
    return (
      <div style={{ 
        padding: '80px 20px', 
        textAlign: 'center', 
        width: '100%',
        backgroundColor: '#fff',
        borderRadius: '16px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <div style={{ 
          fontSize: '64px', 
          marginBottom: '24px',
          opacity: '0.5'
        }}>
          🔍
        </div>
        <h3 style={{ 
          color: '#1F2937', 
          fontSize: '20px',
          fontWeight: '700',
          marginBottom: '8px',
          margin: '0 0 8px 0'
        }}>
          Sonuç Bulunamadı
        </h3>
        <p style={{ 
          color: '#6B7280', 
          fontSize: '15px',
          marginBottom: '24px',
          lineHeight: '1.6'
        }}>
          Aradığınız kriterlere uygun ürün bulunamadı.<br />
          Farklı filtreler deneyebilir veya arama teriminizi değiştirebilirsiniz.
        </p>
        <button
          onClick={() => window.location.reload()}
          style={{
            padding: '12px 24px',
            backgroundColor: '#059669',
            color: '#fff',
            border: 'none',
            borderRadius: '10px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s',
            boxShadow: '0 2px 8px rgba(5, 150, 105, 0.25)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#047857';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#059669';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          Filtreleri Temizle
        </button>
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