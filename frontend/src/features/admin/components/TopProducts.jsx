import React from 'react';
import { FaTrophy, FaArrowUp } from 'react-icons/fa';

const MOCK_TOP_PRODUCTS = [
  { id: 1, name: 'Kablosuz Kulaklık Pro', category: 'Elektronik', price: '₺1,299', sales: 1240, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&q=80' },
  { id: 2, name: 'Akıllı Saat Series 5', category: 'Elektronik', price: '₺3,499', sales: 850, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&q=80' },
  { id: 3, name: 'Ergonomik Ofis Sandalyesi', category: 'Mobilya', price: '₺2,150', sales: 620, image: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=100&q=80' },
  { id: 4, name: 'Organik Pamuk T-Shirt', category: 'Giyim', price: '₺250', sales: 450, image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=100&q=80' },
  { id: 5, name: 'Deri Cüzdan', category: 'Aksesuar', price: '₺450', sales: 380, image: 'https://images.unsplash.com/photo-1627123424574-181ce5171c98?w=100&q=80' },
];

export const TopProducts = () => {
  return (
    <div style={{ 
      backgroundColor: 'var(--bg-card)', 
      padding: '24px', 
      borderRadius: 'var(--radius)', 
      boxShadow: 'var(--shadow-sm)',
      border: '1px solid #e2e8f0',
      height: '100%'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-main)' }}>En Çok Satan Ürünler</h3>
        <FaTrophy style={{ color: '#f59e0b' }} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {MOCK_TOP_PRODUCTS.map((product, index) => (
          <div key={product.id} style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '16px',
            paddingBottom: index !== MOCK_TOP_PRODUCTS.length - 1 ? '16px' : '0',
            borderBottom: index !== MOCK_TOP_PRODUCTS.length - 1 ? '1px solid #f1f5f9' : 'none'
          }}>
            {/* Sıra Numarası */}
            <div style={{ 
              width: '24px', 
              height: '24px', 
              borderRadius: '50%', 
              backgroundColor: index < 3 ? '#fef3c7' : '#f1f5f9', 
              color: index < 3 ? '#d97706' : '#64748b',
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              fontWeight: '700',
              fontSize: '12px'
            }}>
              {index + 1}
            </div>

            {/* Ürün Resmi */}
            <img 
              src={product.image} 
              alt={product.name} 
              style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover' }}
            />

            {/* Ürün Bilgisi */}
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: '600', color: 'var(--text-main)', fontSize: '14px' }}>{product.name}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{product.category}</div>
            </div>

            {/* Satış Bilgisi */}
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontWeight: '700', color: 'var(--text-main)', fontSize: '14px' }}>{product.price}</div>
              <div style={{ fontSize: '11px', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '2px' }}>
                <FaArrowUp size={10} /> {product.sales} satış
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
