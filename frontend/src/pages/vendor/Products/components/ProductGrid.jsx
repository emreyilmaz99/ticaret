// src/pages/vendor/Products/components/ProductGrid.jsx
import React from 'react';
import ProductCard from './ProductCard';
import { styles } from '../styles';

const ProductGrid = ({ 
  products, 
  getCategoryName, 
  toFullUrl, 
  onEdit, 
  onView, 
  onDelete, 
  onToggleStatus,
  onImageClick 
}) => {
  if (products.length === 0) {
    return (
      <div style={styles.emptyState}>
        <p>Henüz ürün eklenmemiş.</p>
      </div>
    );
  }

  return (
    <div style={styles.grid}>
      {products.map(product => (
        <ProductCard
          key={product.id}
          product={product}
          getCategoryName={getCategoryName}
          toFullUrl={toFullUrl}
          onEdit={onEdit}
          onView={onView}
          onDelete={onDelete}
          onToggleStatus={onToggleStatus}
          onImageClick={onImageClick}
        />
      ))}
    </div>
  );
};

export default ProductGrid;
