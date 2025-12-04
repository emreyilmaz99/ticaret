import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { FaStar, FaShoppingCart, FaHeart, FaRegHeart, FaTruck, FaShieldAlt, FaUndo, FaShareAlt } from 'react-icons/fa';
import { getProduct } from '../../api/publicApi'; // We might need to implement getProduct by ID or slug
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../components/Toast';

const ProductDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState('black');

  // Mock product data if API fails or for static testing
  const staticProduct = {
    id: 'static-1',
    name: 'Premium Kablosuz Kulaklık (Örnek Ürün)',
    price: 3499.90,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    rating: 4.8,
    reviews: 124,
    discount: 15,
    category: { name: 'Elektronik' },
    description: 'Yüksek kaliteli ses deneyimi ve uzun pil ömrü. Aktif gürültü engelleme özelliği ile dış dünyadan kopun.',
    specs: {
      'Bağlantı': 'Bluetooth 5.2',
      'Pil Ömrü': '30 Saat',
      'Şarj Süresi': '2 Saat',
      'Suya Dayanıklılık': 'IPX4',
      'Ağırlık': '250g'
    }
  };

  // In a real app, use useQuery to fetch product details
  // const { data, isLoading } = useQuery(['product', slug], () => getProduct(slug));
  // const product = data || staticProduct;
  const product = staticProduct; // Using static for now as requested/safe fallback

  const handleAddToCart = () => {
    addToCart({ ...product, quantity });
    showToast('Ürün sepete eklendi', 'success');
  };

  const styles = {
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '40px 20px',
      fontFamily: '"Inter", sans-serif',
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '60px',
      marginBottom: '80px',
    },
    imageContainer: {
      backgroundColor: '#f8fafc',
      borderRadius: '32px',
      padding: '40px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    image: {
      width: '100%',
      maxHeight: '500px',
      objectFit: 'contain',
      mixBlendMode: 'multiply',
    },
    info: {
      display: 'flex',
      flexDirection: 'column',
      gap: '24px',
    },
    category: {
      color: '#059669',
      fontWeight: '600',
      textTransform: 'uppercase',
      fontSize: '14px',
      letterSpacing: '1px',
    },
    title: {
      fontSize: '42px',
      fontWeight: '800',
      color: '#1e293b',
      lineHeight: 1.1,
    },
    rating: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      color: '#f59e0b',
      fontSize: '16px',
    },
    price: {
      fontSize: '36px',
      fontWeight: '700',
      color: '#059669',
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
    },
    oldPrice: {
      fontSize: '24px',
      color: '#94a3b8',
      textDecoration: 'line-through',
      fontWeight: '400',
    },
    description: {
      color: '#64748b',
      lineHeight: 1.8,
      fontSize: '16px',
    },
    actions: {
      display: 'flex',
      gap: '20px',
      marginTop: '20px',
    },
    addToCartBtn: {
      flex: 1,
      backgroundColor: '#0f172a',
      color: 'white',
      border: 'none',
      padding: '20px',
      borderRadius: '16px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '12px',
      transition: 'transform 0.2s',
    },
    features: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '20px',
      marginTop: '40px',
      padding: '30px',
      backgroundColor: '#f8fafc',
      borderRadius: '24px',
    },
    featureItem: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
      gap: '12px',
      color: '#475569',
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.grid}>
        <div style={styles.imageContainer}>
          <img src={product.image} alt={product.name} style={styles.image} />
        </div>
        
        <div style={styles.info}>
          <div>
            <span style={styles.category}>{product.category.name}</span>
            <h1 style={styles.title}>{product.name}</h1>
          </div>
          
          <div style={styles.rating}>
            <div style={{ display: 'flex' }}>
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} color={i < Math.floor(product.rating) ? '#f59e0b' : '#cbd5e1'} />
              ))}
            </div>
            <span style={{ color: '#64748b' }}>({product.reviews} Değerlendirme)</span>
          </div>

          <div style={styles.price}>
            {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(product.price)}
            {product.discount > 0 && (
              <span style={styles.oldPrice}>
                {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(product.price * 1.2)}
              </span>
            )}
          </div>

          <p style={styles.description}>{product.description}</p>

          {/* Color Selection Mock */}
          <div>
            <span style={{ display: 'block', marginBottom: '12px', fontWeight: '600', color: '#334155' }}>Renk Seçimi</span>
            <div style={{ display: 'flex', gap: '12px' }}>
              {['black', 'white', 'blue'].map(color => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: color,
                    border: selectedColor === color ? '3px solid #059669' : '1px solid #e2e8f0',
                    cursor: 'pointer',
                    padding: 0,
                  }}
                />
              ))}
            </div>
          </div>

          <div style={styles.actions}>
            <div style={{ 
              display: 'flex', alignItems: 'center', border: '1px solid #e2e8f0', 
              borderRadius: '16px', padding: '0 20px', height: '60px' 
            }}>
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#64748b' }}
              >-</button>
              <span style={{ width: '40px', textAlign: 'center', fontWeight: '600' }}>{quantity}</span>
              <button 
                onClick={() => setQuantity(quantity + 1)}
                style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#64748b' }}
              >+</button>
            </div>
            
            <button style={styles.addToCartBtn} onClick={handleAddToCart}>
              <FaShoppingCart /> Sepete Ekle
            </button>
            
            <button style={{ 
              width: '60px', height: '60px', borderRadius: '16px', border: '1px solid #e2e8f0',
              backgroundColor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '20px', color: '#64748b', cursor: 'pointer'
            }}>
              <FaRegHeart />
            </button>
          </div>

          <div style={styles.features}>
            <div style={styles.featureItem}>
              <FaTruck size={24} color="#059669" />
              <span style={{ fontSize: '14px', fontWeight: '600' }}>Hızlı Teslimat</span>
              <span style={{ fontSize: '12px' }}>24 saatte kargoda</span>
            </div>
            <div style={styles.featureItem}>
              <FaShieldAlt size={24} color="#059669" />
              <span style={{ fontSize: '14px', fontWeight: '600' }}>Güvenli Ödeme</span>
              <span style={{ fontSize: '12px' }}>256-bit SSL koruması</span>
            </div>
            <div style={styles.featureItem}>
              <FaUndo size={24} color="#059669" />
              <span style={{ fontSize: '14px', fontWeight: '600' }}>Kolay İade</span>
              <span style={{ fontSize: '12px' }}>14 gün içinde iade</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
