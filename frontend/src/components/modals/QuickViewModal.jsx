import React, { useState } from 'react';
import { FaTimes, FaStar, FaShoppingCart, FaHeart, FaRegHeart, FaCheck, FaArrowRight } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const QuickViewModal = ({ product, onClose, addToCart, toggleFavorite, favorites }) => {
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState('black');

  if (!product) return null;

  const handleViewDetails = () => {
    onClose();
    navigate(`/product/${product.slug || product.id}`);
  };

  // Mock specs if not present
  const specs = product.specs || {
    'Bağlantı': 'Bluetooth 5.2',
    'Pil Ömrü': '30 Saat',
    'Garanti': '2 Yıl',
    'Renk': 'Siyah'
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
      backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)', zIndex: 3000, display: 'flex',
      alignItems: 'center', justifyContent: 'center', padding: '20px'
    }} onClick={onClose}>
      <div style={{
        backgroundColor: 'white', borderRadius: '24px', maxWidth: '1000px', width: '100%',
        maxHeight: '90vh', overflowY: 'auto', display: 'flex', position: 'relative',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        animation: 'slideUp 0.3s ease-out'
      }} onClick={e => e.stopPropagation()}>
        
        <button onClick={onClose} style={{
          position: 'absolute', top: '24px', right: '24px', background: 'white', border: '1px solid #e2e8f0',
          width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '16px', cursor: 'pointer', color: '#64748b', zIndex: 10, transition: 'all 0.2s',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        }}><FaTimes /></button>
        
        <div style={{ display: 'flex', width: '100%', flexDirection: 'row', flexWrap: 'wrap' }}>
          {/* Left Side: Image */}
          <div style={{ 
            flex: '1 1 400px', 
            backgroundColor: '#f8fafc', 
            padding: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '400px'
          }}>
            <img src={product.image} alt={product.name} style={{ 
              width: '100%', maxHeight: '400px', objectFit: 'contain', mixBlendMode: 'multiply' 
            }} />
          </div>
          
          {/* Right Side: Details */}
          <div style={{ flex: '1 1 400px', padding: '40px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div>
              <div style={{ fontSize: '13px', color: '#059669', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
                {typeof product.category === 'object' ? product.category.name : product.category}
              </div>
              <h2 style={{ fontFamily: '"Inter", sans-serif', fontSize: '28px', fontWeight: '800', color: '#1e293b', lineHeight: 1.2, marginBottom: '12px' }}>
                {product.name}
              </h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', backgroundColor: '#fffbeb', padding: '4px 8px', borderRadius: '6px' }}>
                  <FaStar color="#f59e0b" size={14} />
                  <span style={{ fontSize: '14px', fontWeight: '700', color: '#b45309' }}>{product.rating || 4.8}</span>
                </div>
                <span style={{ color: '#64748b', fontSize: '14px' }}>{product.reviews || 124} Değerlendirme</span>
                <span style={{ color: '#cbd5e1' }}>|</span>
                <span style={{ color: '#059669', fontSize: '14px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <FaCheck size={12} /> Stokta Var
                </span>
              </div>
            </div>

            <div style={{ fontSize: '32px', fontWeight: '800', color: '#0f172a', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(product.price * quantity)}
                {product.discount && (
                  <span style={{ fontSize: '18px', color: '#94a3b8', textDecoration: 'line-through', fontWeight: '500' }}>
                    {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(product.price * 1.2 * quantity)}
                  </span>
                )}
              </div>
              {quantity > 1 && (
                <div style={{ fontSize: '14px', color: '#6b7280', fontWeight: '500' }}>
                  Birim Fiyat: {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(product.price)}
                </div>
              )}
            </div>

            {/* Specs Table */}
            <div style={{ backgroundColor: '#f8fafc', borderRadius: '16px', padding: '20px', border: '1px solid #e2e8f0' }}>
              <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#334155', marginBottom: '12px' }}>Teknik Özellikler</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                {Object.entries(specs).map(([key, value]) => (
                  <div key={key} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', borderBottom: '1px dashed #cbd5e1', paddingBottom: '4px' }}>
                    <span style={{ color: '#64748b' }}>{key}</span>
                    <span style={{ fontWeight: '600', color: '#334155' }}>{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{ 
                  display: 'flex', alignItems: 'center', border: '1px solid #e2e8f0', 
                  borderRadius: '12px', padding: '0 12px', height: '56px' 
                }}>
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', color: '#64748b', padding: '0 8px' }}
                  >-</button>
                  <span style={{ width: '32px', textAlign: 'center', fontWeight: '600' }}>{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', color: '#64748b', padding: '0 8px' }}
                  >+</button>
                </div>

                <button onClick={() => addToCart({ ...product, quantity })} style={{
                  flex: 1, backgroundColor: '#0f172a', color: 'white', border: 'none',
                  height: '56px', borderRadius: '12px', fontWeight: '600', fontSize: '15px',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                  transition: 'background-color 0.2s'
                }}>
                  <FaShoppingCart /> Sepete Ekle
                </button>
                
                <button onClick={(e) => toggleFavorite && toggleFavorite(e, product.id)} style={{
                  width: '56px', height: '56px', backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '12px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                  fontSize: '20px', color: favorites && favorites.includes(product.id) ? '#ef4444' : '#64748b',
                  transition: 'all 0.2s'
                }}>
                  {favorites && favorites.includes(product.id) ? <FaHeart /> : <FaRegHeart />}
                </button>
              </div>

              <button 
                onClick={handleViewDetails}
                style={{
                  width: '100%', padding: '12px', backgroundColor: 'transparent', border: 'none',
                  color: '#059669', fontWeight: '600', fontSize: '14px', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                  transition: 'all 0.2s',
                  borderRadius: '8px'
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
                Ürün Detaylarına Git <FaArrowRight size={12} />
              </button>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default QuickViewModal;
