import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaTimes, 
  FaStar, 
  FaShoppingCart, 
  FaArrowRight, 
  FaCheckCircle, 
  FaHeart,
  FaRegHeart,
  FaMinus,
  FaPlus
} from 'react-icons/fa';

export const QuickViewModal = ({ product, onClose, onAddToCart, favorites = [], toggleFavorite }) => {
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);

  if (!product) return null;

  const productId = Number(product.id);
  const isFavorite = favorites.map(id => Number(id)).includes(productId);

  const handleGoToDetail = () => {
    onClose();
    navigate(`/product/${product.slug || product.id}`);
  };

  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart({ ...product, quantity });
    }
  };

  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => setQuantity(prev => prev > 1 ? prev - 1 : 1);

  // Get product image with fallback
  const productImage = product.image || product.thumbnail || product.image_url || 
    'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%23f0f0f0" width="400" height="400"/%3E%3Ctext fill="%23999" font-family="Arial" font-size="18" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3EÜrün Görseli%3C/text%3E%3C/svg%3E';

  const categoryName = (typeof product.category === 'object' && product.category !== null) 
    ? product.category.name 
    : (product.category || 'GENEL');

  const rating = parseFloat(product.rating || product.rating_avg || 4.8).toFixed(1);
  const reviewCount = product.review_count || product.reviews_count || 124;

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '20px',
      }} 
      onClick={onClose}
    >
      <div 
        style={{
          backgroundColor: '#fff',
          borderRadius: '24px',
          maxWidth: '1100px',
          width: '100%',
          maxHeight: '90vh',
          display: 'flex',
          overflow: 'hidden',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          position: 'relative',
        }} 
        onClick={e => e.stopPropagation()}
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            fontSize: '18px',
            color: '#6b7280',
            zIndex: 10,
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#f3f4f6';
            e.currentTarget.style.transform = 'scale(1.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          <FaTimes />
        </button>

        {/* Left Side - Product Image */}
        <div 
          style={{
            flex: '0 0 45%',
            backgroundColor: '#fafafa',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px',
            position: 'relative',
          }}
        >
          <img 
            src={productImage}
            alt={product.name}
            style={{
              maxWidth: '100%',
              maxHeight: '500px',
              objectFit: 'contain',
            }}
            onError={(e) => {
              e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%23f0f0f0" width="400" height="400"/%3E%3Ctext fill="%23999" font-family="Arial" font-size="18" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3EÜrün Görseli%3C/text%3E%3C/svg%3E';
            }}
          />
        </div>

        {/* Right Side - Product Info */}
        <div 
          style={{
            flex: 1,
            padding: '40px',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'auto',
          }}
        >
          {/* Category Badge */}
          <div 
            style={{
              display: 'inline-block',
              alignSelf: 'flex-start',
              padding: '4px 12px',
              backgroundColor: '#059669',
              color: '#fff',
              fontSize: '11px',
              fontWeight: '800',
              letterSpacing: '0.5px',
              borderRadius: '6px',
              textTransform: 'uppercase',
              marginBottom: '16px',
            }}
          >
            {categoryName}
          </div>

          {/* Product Title */}
          <h2 
            style={{
              fontSize: '28px',
              fontWeight: '700',
              color: '#0f172a',
              marginBottom: '16px',
              lineHeight: '1.3',
              margin: '0 0 16px 0',
            }}
          >
            {product.name}
          </h2>

          {/* Rating & Stock */}
          <div 
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '24px',
              marginBottom: '24px',
              paddingBottom: '24px',
              borderBottom: '1px solid #e5e7eb',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FaStar style={{ color: '#f59e0b', fontSize: '16px' }} />
              <span style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a' }}>
                {rating}
              </span>
              <span style={{ fontSize: '14px', color: '#6b7280' }}>
                {reviewCount} Değerlendirme
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <FaCheckCircle style={{ color: '#059669', fontSize: '16px' }} />
              <span style={{ fontSize: '14px', fontWeight: '600', color: '#059669' }}>
                Stokta Var
              </span>
            </div>
          </div>

          {/* Price */}
          <div style={{ marginBottom: '32px' }}>
            {product.original_price && product.original_price > product.price && (
              <div 
                style={{
                  fontSize: '16px',
                  color: '#9ca3af',
                  textDecoration: 'line-through',
                  marginBottom: '4px',
                }}
              >
                ₺{(parseFloat(product.original_price) * quantity).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
              </div>
            )}
            <div 
              style={{
                fontSize: '36px',
                fontWeight: '800',
                color: '#0f172a',
                letterSpacing: '-0.5px',
              }}
            >
              ₺{(parseFloat(product.price || 0) * quantity).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
            </div>
            {quantity > 1 && (
              <div 
                style={{
                  fontSize: '14px',
                  color: '#6b7280',
                  marginTop: '8px',
                }}
              >
                Birim Fiyat: ₺{parseFloat(product.price || 0).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
              </div>
            )}
          </div>

          {/* Technical Specifications */}
          <div style={{ marginBottom: '32px' }}>
            <h3 
              style={{
                fontSize: '14px',
                fontWeight: '700',
                color: '#0f172a',
                marginBottom: '16px',
                margin: '0 0 16px 0',
              }}
            >
              Teknik Özellikler
            </h3>
            <div 
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '12px',
              }}
            >
              <SpecRow label="Bağlantı" value="Bluetooth 5.2" />
              <SpecRow label="Pil Ömrü" value="30 Saat" />
              <SpecRow label="Garanti" value="2 Yıl" />
              <SpecRow label="Renk" value="Siyah" />
            </div>
          </div>

          {/* Quantity & Actions */}
          <div style={{ marginTop: 'auto' }}>
            {/* Quantity Selector */}
            <div 
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                marginBottom: '20px',
              }}
            >
              <div 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  border: '2px solid #e5e7eb',
                  borderRadius: '12px',
                  overflow: 'hidden',
                }}
              >
                <button
                  onClick={decrementQuantity}
                  style={{
                    width: '48px',
                    height: '48px',
                    border: 'none',
                    backgroundColor: '#fff',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#6b7280',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#fff'}
                >
                  <FaMinus />
                </button>
                <div 
                  style={{
                    width: '60px',
                    height: '48px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '18px',
                    fontWeight: '700',
                    borderLeft: '2px solid #e5e7eb',
                    borderRight: '2px solid #e5e7eb',
                  }}
                >
                  {quantity}
                </div>
                <button
                  onClick={incrementQuantity}
                  style={{
                    width: '48px',
                    height: '48px',
                    border: 'none',
                    backgroundColor: '#fff',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#6b7280',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#fff'}
                >
                  <FaPlus />
                </button>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                style={{
                  flex: 1,
                  height: '52px',
                  backgroundColor: '#1e293b',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '15px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  transition: 'all 0.3s',
                  boxShadow: '0 4px 12px rgba(30, 41, 59, 0.3)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#0f172a';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 16px rgba(30, 41, 59, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#1e293b';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(30, 41, 59, 0.3)';
                }}
              >
                <FaShoppingCart size={18} />
                Sepete Ekle
              </button>

              {/* Favorite Button */}
              <button
                onClick={(e) => toggleFavorite && toggleFavorite(e, product.id)}
                style={{
                  width: '52px',
                  height: '52px',
                  backgroundColor: isFavorite ? '#fee2e2' : '#f9fafb',
                  border: `2px solid ${isFavorite ? '#fca5a5' : '#e5e7eb'}`,
                  borderRadius: '12px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                {isFavorite ? 
                  <FaHeart size={20} color="#ef4444" /> : 
                  <FaRegHeart size={20} color="#6b7280" />
                }
              </button>
            </div>

            {/* View Details Link */}
            <button
              onClick={handleGoToDetail}
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: 'transparent',
                border: 'none',
                color: '#059669',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                transition: 'all 0.2s',
                borderRadius: '8px',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#047857';
                e.currentTarget.style.backgroundColor = '#f0fdf4';
                e.currentTarget.style.gap = '10px';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#059669';
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.gap = '6px';
              }}
            >
              Ürün Detaylarına Git
              <FaArrowRight size={12} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Spec Row Component
const SpecRow = ({ label, value }) => (
  <div 
    style={{
      display: 'flex',
      justifyContent: 'space-between',
      padding: '10px 12px',
      backgroundColor: '#f9fafb',
      borderRadius: '8px',
      fontSize: '13px',
    }}
  >
    <span style={{ color: '#6b7280', fontWeight: '500' }}>{label}</span>
    <span style={{ color: '#0f172a', fontWeight: '600' }}>{value}</span>
  </div>
);

export default QuickViewModal;