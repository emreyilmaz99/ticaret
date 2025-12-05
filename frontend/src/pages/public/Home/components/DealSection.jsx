// src/pages/public/Home/components/DealSection.jsx
import React from 'react';
import { FaShoppingCart, FaClock } from 'react-icons/fa';
import CountdownTimer from './CountdownTimer';

/**
 * Deal of the day section
 */
const DealSection = ({ addToCart, styles, isMobile }) => {
  const handleAddToCart = () => {
    addToCart({ id: 99, name: 'Premium Kulaklık', price: 1299 });
  };

  return (
    <div style={styles.dealSection}>
      <div style={{ 
        position: 'relative', 
        zIndex: 2, 
        maxWidth: isMobile ? '100%' : '500px', 
        textAlign: isMobile ? 'center' : 'left' 
      }}>
        <div style={{ 
          display: 'inline-block', 
          padding: '8px 16px', 
          backgroundColor: '#ef4444', 
          borderRadius: '50px', 
          fontSize: isMobile ? '12px' : '14px', 
          fontWeight: '700', 
          marginBottom: isMobile ? '16px' : '24px' 
        }}>
          Günün Fırsatı
        </div>
        <h2 style={{ 
          fontFamily: '"DM Sans", sans-serif', 
          fontSize: isMobile ? '28px' : '48px', 
          fontWeight: '800', 
          marginBottom: isMobile ? '16px' : '24px', 
          lineHeight: 1.1 
        }}>
          Premium Kablosuz Kulaklık
        </h2>
        <p style={{ 
          fontSize: isMobile ? '14px' : '18px', 
          opacity: 0.8, 
          marginBottom: isMobile ? '20px' : '32px', 
          lineHeight: 1.6 
        }}>
          Üstün ses kalitesi ve gürültü engelleme özelliği ile müziğin keyfini çıkarın. 
          Sınırlı süre için özel indirim.
        </p>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: isMobile ? '16px' : '24px', 
          marginBottom: isMobile ? '24px' : '40px', 
          justifyContent: isMobile ? 'center' : 'flex-start' 
        }}>
          <div style={{ 
            fontSize: isMobile ? '28px' : '36px', 
            fontWeight: '700', 
            color: '#34d399' 
          }}>
            1.299 TL
          </div>
          <div style={{ 
            fontSize: isMobile ? '18px' : '24px', 
            textDecoration: 'line-through', 
            opacity: 0.5 
          }}>
            1.899 TL
          </div>
        </div>
        <div style={{ 
          display: 'flex', 
          flexDirection: isMobile ? 'column' : 'row', 
          gap: '16px', 
          alignItems: 'center', 
          justifyContent: isMobile ? 'center' : 'flex-start' 
        }}>
          <button 
            onClick={handleAddToCart} 
            style={{ 
              ...styles.heroBtn, 
              backgroundColor: '#34d399', 
              color: '#0f172a', 
              width: isMobile ? '100%' : 'auto' 
            }}
          >
            <FaShoppingCart /> Sepete Ekle
          </button>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '12px', 
            backgroundColor: 'rgba(255,255,255,0.1)', 
            padding: isMobile ? '10px 20px' : '12px 24px', 
            borderRadius: '50px' 
          }}>
            <FaClock /> <CountdownTimer />
          </div>
        </div>
      </div>
      
      {/* Product Image - Desktop only */}
      {!isMobile && (
        <div style={{ position: 'relative', zIndex: 2 }}>
          <img 
            src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80" 
            alt="Deal Product" 
            style={{ 
              width: '400px', 
              height: '400px', 
              objectFit: 'cover', 
              borderRadius: '24px', 
              transform: 'rotate(-10deg)', 
              boxShadow: '0 20px 50px rgba(0,0,0,0.3)' 
            }} 
          />
        </div>
      )}
      
      {/* Background Pattern */}
      <div style={{ 
        position: 'absolute', 
        top: 0, 
        right: 0, 
        width: '600px', 
        height: '100%', 
        background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.05) 100%)', 
        transform: 'skewX(-20deg)' 
      }} />
    </div>
  );
};

export default DealSection;
