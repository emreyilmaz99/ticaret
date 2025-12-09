import React from 'react';
import { FaShoppingCart, FaStar, FaRegHeart } from 'react-icons/fa';
import { resolveImage, formatPrice } from '../styles'; 

export const ProductsGrid = ({ 
  products, 
  onAddToCart, 
  onQuickView, 
  styles 
}) => {
  
  if (!products || products.length === 0) {
    return (
      <div style={{ padding: '60px', textAlign: 'center', width: '100%' }}>
        <p style={{ color: '#6B7280', fontSize: '16px' }}>Ürün bulunamadı.</p>
      </div>
    );
  }

  return (
    <div style={styles.grid}>
      {products.map((product) => (
        <div 
          key={product.id} 
          style={styles.card}
          onClick={() => onQuickView && onQuickView(product)}
          // Klas Hover Efekti
          onMouseEnter={(e) => {
             e.currentTarget.style.transform = 'translateY(-5px)';
             e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1)';
             // Buton Rengini Koyulaştır
             const btn = e.currentTarget.querySelector('button');
             if(btn) btn.style.backgroundColor = '#047857';
          }}
          onMouseLeave={(e) => {
             e.currentTarget.style.transform = 'translateY(0)';
             e.currentTarget.style.boxShadow = 'none';
             e.currentTarget.style.border = '1px solid #E5E7EB';
             // Buton Rengini Normale Döndür
             const btn = e.currentTarget.querySelector('button');
             if(btn) btn.style.backgroundColor = '#059669';
          }}
        >
          {/* GÖRSEL */}
          <div style={styles.imgWrap}>
            {product.oldPrice && product.oldPrice > product.price && (
               <span style={styles.badge}>
                 %{Math.round((1 - product.price / product.oldPrice) * 100)} İndirim
               </span>
            )}
            
            {/* Minimal Favori İkonu */}
            <div style={{
              position: 'absolute', top: '12px', right: '12px', 
              background: 'rgba(255,255,255,0.9)', padding: '8px', borderRadius: '50%',
              boxShadow: '0 2px 5px rgba(0,0,0,0.05)', color: '#9CA3AF', zIndex: 5
            }}>
              <FaRegHeart size={16} />
            </div>

            <img 
              src={resolveImage(product)} 
              alt={product.title} 
              style={styles.img} 
              loading="lazy"
            />
          </div>

          {/* İÇERİK */}
          <div style={styles.content}>
            <span style={styles.brand}>{product.brand_name || 'Marka'}</span>
            <h3 style={styles.title}>{product.title}</h3>
            
            <div style={{display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#6B7280', marginBottom: '12px'}}>
              <FaStar color="#F59E0B" size={12} />
              <span style={{fontWeight:600, color:'#374151'}}>{product.rating || '4.5'}</span> 
              <span>({product.reviews || 0})</span>
            </div>

            {/* Fiyatlar */}
            <div style={styles.priceRow}>
               <span style={styles.price}>{formatPrice(product.price)}</span>
               {product.oldPrice && product.oldPrice > product.price && (
                  <span style={styles.priceOld}>{formatPrice(product.oldPrice)}</span>
               )}
            </div>

            {/* MODERN BUTON (En Alta) */}
            <div style={{ marginTop: 'auto' }}>
              <button 
                style={styles.addToCartBtn}
                onClick={(e) => {
                  e.stopPropagation(); 
                  onAddToCart && onAddToCart(product);
                }}
              >
                <FaShoppingCart size={14} />
                Sepete Ekle
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductsGrid; // Eğer index.jsx içinde named import kullanıyorsan bunu kaldırabilirsinw