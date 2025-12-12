import React from 'react';
import { useNavigate } from 'react-router-dom';
import { styles } from '../styles';

/**
 * Top selling products widget
 */
const TopProducts = ({ products }) => {
  const navigate = useNavigate();

  const handleViewAllProducts = () => {
    navigate('/vendor/products');
  };

  return (
    <div style={{ ...styles.card, display: 'flex', flexDirection: 'column' }}>
      <h3 style={styles.cardTitle}>Çok Satanlar</h3>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {products.map((product, index) => (
          <div 
            key={index} 
            style={{
              ...styles.productItem,
              borderBottom: index !== products.length - 1 ? '1px solid #f1f5f9' : 'none'
            }}
          >
            <img 
              src={product.image} 
              alt={product.name} 
              style={styles.productImage} 
            />
            <div style={styles.productInfo}>
              <h4 style={styles.productName}>{product.name}</h4>
              <p style={styles.productSales}>{product.sales} Satış</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={styles.productRevenue}>{product.revenue}</span>
            </div>
          </div>
        ))}
        <button 
          style={{ ...styles.viewAllButton, cursor: 'pointer' }}
          onClick={handleViewAllProducts}
        >
          Tümünü Gör
        </button>
      </div>
    </div>
  );
};

export default TopProducts;
