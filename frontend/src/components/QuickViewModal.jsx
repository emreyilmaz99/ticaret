import React from 'react';
import { FaTimes, FaStar, FaShoppingCart, FaHeart, FaRegHeart } from 'react-icons/fa';

const QuickViewModal = ({ product, onClose, addToCart, toggleFavorite, favorites }) => {
  if (!product) return null;
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
      backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 3000, display: 'flex',
      alignItems: 'center', justifyContent: 'center', padding: '20px'
    }} onClick={onClose}>
      <div style={{
        backgroundColor: 'white', borderRadius: '20px', maxWidth: '900px', width: '100%',
        display: 'flex', overflow: 'hidden', position: 'relative',
        animation: 'fadeIn 0.3s ease'
      }} onClick={e => e.stopPropagation()}>
        <button onClick={onClose} style={{
          position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none',
          fontSize: '24px', cursor: 'pointer', color: '#64748b', zIndex: 10
        }}><FaTimes /></button>
        
        <div style={{ width: '50%', backgroundColor: '#f8fafc' }}>
          <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
        
        <div style={{ width: '50%', padding: '40px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ fontSize: '14px', color: '#059669', fontWeight: '600', textTransform: 'uppercase' }}>
            {product.category}
          </div>
          <h2 style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '32px', fontWeight: '700', color: '#1e293b', lineHeight: 1.2 }}>
            {product.name}
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ display: 'flex', color: '#f59e0b' }}>
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} color={i < Math.floor(product.rating) ? '#f59e0b' : '#cbd5e1'} />
              ))}
            </div>
            <span style={{ color: '#64748b', fontSize: '14px' }}>({product.reviews} Değerlendirme)</span>
          </div>
          <div style={{ fontSize: '32px', fontWeight: '700', color: '#059669' }}>
            {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(product.price)}
          </div>
          <p style={{ color: '#64748b', lineHeight: '1.6' }}>
            Bu ürün yüksek kaliteli malzemelerden üretilmiştir. Günlük kullanım için idealdir ve uzun ömürlüdür.
            Stoklarla sınırlıdır, kaçırmayın!
          </p>
          <div style={{ marginTop: 'auto', display: 'flex', gap: '16px' }}>
            <button onClick={() => addToCart(product)} style={{
              flex: 1, backgroundColor: '#059669', color: 'white', border: 'none',
              padding: '16px', borderRadius: '12px', fontWeight: '600', fontSize: '16px',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
            }}>
              <FaShoppingCart /> Sepete Ekle
            </button>
            <button onClick={(e) => toggleFavorite(e, product.id)} style={{
              width: '56px', backgroundColor: '#f1f5f9', border: 'none', borderRadius: '12px',
              display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
              fontSize: '20px', color: favorites.includes(product.id) ? '#ef4444' : '#64748b'
            }}>
              {favorites.includes(product.id) ? <FaHeart /> : <FaRegHeart />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickViewModal;
