import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaTimes, 
  FaStar, 
  FaShoppingCart, 
  FaArrowRight, 
  FaCheckCircle, 
  FaTag, 
  FaBoxOpen, 
  FaBarcode,
  FaTruck,
  FaShieldAlt
} from 'react-icons/fa';

import { styles, formatPrice, resolveImage } from '../styles'; 

export const QuickViewModal = ({ product, onClose, onAddToCart }) => {
  const navigate = useNavigate();

  // Eğer ürün yoksa render etme
  if (!product) return null;

  // Detay sayfasına gitme fonksiyonu
  const handleGoToDetail = () => {
    onClose(); // Modalı kapat
    navigate(`/product/${product.slug || product.id}`); // Detaya git
  };

  // Sepete ekle fonksiyonu
  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart(product); // Parent'tan gelen fonksiyon zaten toast gösteriyor ve modalı kapatıyor
    }
  };

  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      
      {/* Modal İçeriği (tıklayınca kapanmasın diye stopPropagation) */}
      <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
        
        {/* Kapat Butonu */}
        <button 
          style={styles.modalClose} 
          onClick={onClose}
          aria-label="Kapat"
        >
          <FaTimes />
        </button>

        {/* --- SOL TARAF: BÜYÜK GÖRSEL --- */}
        <div style={styles.modalImageContainer}>
          <img 
            src={resolveImage(product)} 
            alt={product.name} 
            style={styles.modalMainImage} 
          />
          {/* İndirim Rozeti Varsa */}
          {product.discount_percent > 0 && (
            <div style={{
              position: 'absolute', top: 20, left: 20,
              backgroundColor: '#DC2626', color: 'white',
              padding: '6px 12px', borderRadius: '8px',
              fontWeight: '700', fontSize: '13px'
            }}>
              %{product.discount_percent} İndirim
            </div>
          )}
        </div>

        {/* --- SAĞ TARAF: BİLGİ VE AKSİYON --- */}
        <div style={styles.modalInfoContainer}>
          
          {/* 1. Header (Sabit Üst Kısım) */}
          <div style={styles.modalHeader}>
            <div style={styles.modalBrand}>
              {product.vendor_name || product.brand || 'MAĞAZA'}
            </div>
            <h2 style={styles.modalTitle}>{product.name}</h2>
            
            <div style={styles.modalMetaRow}>
              <div style={styles.modalPrice}>
                {formatPrice(product.price)}
                {product.original_price > product.price && (
                  <span style={styles.modalOldPrice}>
                    {formatPrice(product.original_price)}
                  </span>
                )}
              </div>
              
              {/* Puanlama */}
              <div style={styles.modalRating}>
                <FaStar style={{fontSize: '14px'}}/> 
                <span style={styles.modalRatingScore}>{product.rating || '4.9'}</span>
                <span style={styles.modalRatingCount}>
                  ({product.review_count || 12})
                </span>
              </div>
            </div>
          </div>

          {/* 2. Scroll Edilebilir Orta Alan (İçerik) */}
          <div style={styles.modalScrollContent}>
            
            <p style={styles.modalDescription}>
              {product.short_description || "Bu ürün için kısa açıklama henüz eklenmemiş. Detaylı teknik özellikler ve kullanıcı yorumları için ürün detay sayfasına gidebilirsiniz."}
            </p>

            {/* Ürün Özellikleri Başlık */}
            <h3 style={styles.infoSectionTitle}>Ürün Bilgileri</h3>

            {/* --- Modern Bilgi Tablosu --- */}
            <div style={styles.infoGrid}>
              
              <div style={styles.infoItem}>
                <div style={styles.infoIconWrapper}>
                  <FaTag style={styles.infoIcon}/>
                </div>
                <div style={styles.infoContent}>
                  <span style={styles.infoLabel}>Kategori</span>
                  <span style={styles.infoValue}>
                    {(typeof product.category === 'object' && product.category !== null) 
                      ? product.category.name 
                      : (product.category || 'Genel')}
                  </span>
                </div>
              </div>

              <div style={styles.infoItem}>
                <div style={styles.infoIconWrapper}>
                  <FaBoxOpen style={styles.infoIcon}/>
                </div>
                <div style={styles.infoContent}>
                  <span style={styles.infoLabel}>Ürün Tipi</span>
                  <span style={styles.infoValue}>{product.type || 'Standart Ürün'}</span>
                </div>
              </div>

              <div style={styles.infoItem}>
                <div style={styles.infoIconWrapper}>
                  <FaBarcode style={styles.infoIcon}/>
                </div>
                <div style={styles.infoContent}>
                  <span style={styles.infoLabel}>Stok Kodu</span>
                  <span style={styles.infoValue}>{product.sku || '#TR-8854'}</span>
                </div>
              </div>

              <div style={styles.infoItem}>
                <div style={{...styles.infoIconWrapper, backgroundColor: '#DCFCE7'}}>
                  <FaCheckCircle style={{...styles.infoIcon, color: '#059669'}}/>
                </div>
                <div style={styles.infoContent}>
                  <span style={styles.infoLabel}>Stok Durumu</span>
                  <span style={{...styles.infoValue, color: '#059669', fontWeight: '700'}}>
                    Stokta Var
                  </span>
                </div>
              </div>

              <div style={styles.infoItem}>
                <div style={{...styles.infoIconWrapper, backgroundColor: '#DBEAFE'}}>
                  <FaTruck style={{...styles.infoIcon, color: '#2563EB'}}/>
                </div>
                <div style={styles.infoContent}>
                  <span style={styles.infoLabel}>Teslimat</span>
                  <span style={styles.infoValue}>1-3 İş Günü</span>
                </div>
              </div>

              <div style={styles.infoItem}>
                <div style={{...styles.infoIconWrapper, backgroundColor: '#FEF3C7'}}>
                  <FaShieldAlt style={{...styles.infoIcon, color: '#D97706'}}/>
                </div>
                <div style={styles.infoContent}>
                  <span style={styles.infoLabel}>Garanti</span>
                  <span style={styles.infoValue}>2 Yıl</span>
                </div>
              </div>

            </div>

          </div>

          {/* 3. Footer (Sabit Alt Kısım - Sticky) */}
          <div style={styles.modalFooter}>
            <button 
              style={styles.modalBtnPrimary} 
              onClick={handleAddToCart}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#047857';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#059669';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <FaShoppingCart /> Sepete Ekle
            </button>
            
            <button 
              style={styles.modalBtnSecondary} 
              onClick={handleGoToDetail}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#E5E7EB';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#F9FAFB';
              }}
            >
              Detaya Git <FaArrowRight size={12}/>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};

// Hem Named hem Default export ekledik, hata riskini sıfıra indirdik.
export default QuickViewModal;