// src/pages/public/Home/components/ProductGrid.jsx
import React from 'react';
import { FaSpinner } from 'react-icons/fa';
import ProductCard from '../../../../components/ProductCard';

/**
 * Product grid with loading, error, and empty states
 */
const ProductGrid = ({ 
  products, 
  isLoading, 
  error, 
  favorites,
  toggleFavorite,
  setQuickViewProduct,
  addToCart,
  clearFilters,
  styles 
}) => {
  if (isLoading) {
    return (
      <div style={{ 
        textAlign: 'center', 
        padding: '60px', 
        backgroundColor: 'white', 
        borderRadius: '24px', 
        boxShadow: '0 10px 30px -10px rgba(0,0,0,0.05)' 
      }}>
        <FaSpinner style={{ 
          fontSize: '48px', 
          color: '#059669', 
          animation: 'spin 1s linear infinite' 
        }} />
        <p style={{ color: '#64748b', marginTop: '16px' }}>
          Ürünler yükleniyor...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        textAlign: 'center', 
        padding: '60px', 
        backgroundColor: 'white', 
        borderRadius: '24px', 
        boxShadow: '0 10px 30px -10px rgba(0,0,0,0.05)' 
      }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
        <h3 style={{ 
          fontSize: '20px', 
          fontWeight: '700', 
          color: '#1e293b', 
          marginBottom: '8px' 
        }}>
          Bir Hata Oluştu
        </h3>
        <p style={{ color: '#64748b' }}>
          Ürünler yüklenirken bir hata oluştu. Lütfen tekrar deneyin.
        </p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div style={{ 
        textAlign: 'center', 
        padding: '60px', 
        backgroundColor: 'white', 
        borderRadius: '24px', 
        boxShadow: '0 10px 30px -10px rgba(0,0,0,0.05)' 
      }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
        <h3 style={{ 
          fontSize: '20px', 
          fontWeight: '700', 
          color: '#1e293b', 
          marginBottom: '8px' 
        }}>
          Ürün Bulunamadı
        </h3>
        <p style={{ color: '#64748b' }}>
          Seçtiğiniz kriterlere uygun ürün bulunmamaktadır. Filtreleri temizleyip tekrar deneyin.
        </p>
        <button 
          onClick={clearFilters}
          style={{ 
            marginTop: '20px', 
            padding: '10px 24px', 
            backgroundColor: '#059669', 
            color: 'white', 
            border: 'none', 
            borderRadius: '12px', 
            cursor: 'pointer', 
            fontWeight: '600' 
          }}
        >
          Filtreleri Temizle
        </button>
      </div>
    );
  }

  return (
    <div style={styles.grid}>
      {products.map(product => (
        <ProductCard 
          key={product.id} 
          product={{
            ...product,
            reviews: product.reviews_count || 0,
          }} 
          favorites={favorites}
          toggleFavorite={toggleFavorite}
          setQuickViewProduct={setQuickViewProduct}
          addToCart={addToCart}
        />
      ))}
    </div>
  );
};

export default ProductGrid;
