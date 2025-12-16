// src/components/modals/CompareModal.jsx
import React from 'react';
import { FaTimes, FaStar, FaShoppingCart, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

// Utility function
const formatPrice = (price) => new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(price || 0);

export const CompareModal = ({ compareList, onClose, onRemove, styles }) => {
  const navigate = useNavigate();

  if (!compareList || compareList.length === 0) return null;

  const compareAttributes = [
    { key: 'price', label: 'Fiyat', icon: '💰', format: (val) => formatPrice(val) },
    { key: 'discount_percentage', label: 'İndirim', icon: '🏷️', format: (val) => val ? `%${val}` : 'Yok' },
    { key: 'rating', label: 'Puan', icon: '⭐', format: (val) => val ? `${val}/5` : '-' },
    { key: 'reviews_count', label: 'Değerlendirme', icon: '💬', format: (val) => `${val || 0} yorum` },
    { key: 'stock_quantity', label: 'Stok', icon: '📦', format: (val) => val > 0 ? `${val} adet` : 'Tükendi' },
    { key: 'vendor_name', label: 'Satıcı', icon: '🏪', format: (val) => val || 'Mağaza' },
  ];

  const modalStyles = {
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2000,
      padding: '20px',
    },
    container: {
      backgroundColor: '#FFFFFF',
      borderRadius: '24px',
      width: '100%',
      maxWidth: '1100px',
      maxHeight: '90vh',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    },
    header: {
      padding: '28px 32px',
      borderBottom: '1px solid #E5E7EB',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: '#F9FAFB',
    },
    title: {
      fontSize: '24px',
      fontWeight: '700',
      color: '#111827',
      margin: 0,
      fontFamily: '"Inter", sans-serif',
      letterSpacing: '-0.5px',
    },
    closeBtn: {
      width: '40px',
      height: '40px',
      backgroundColor: '#FFFFFF',
      color: '#374151',
      border: '1px solid #E5E7EB',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      fontSize: '16px',
      transition: 'all 0.2s ease',
    },
    scrollContent: {
      flex: 1,
      overflowY: 'auto',
      overflowX: 'hidden',
      padding: compareList.length === 1 ? '32px 120px' : '32px',
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: compareList.length === 1 ? '1fr' : `repeat(${compareList.length}, 1fr)`,
      gap: '20px',
      maxWidth: compareList.length === 1 ? '500px' : '100%',
      margin: compareList.length === 1 ? '0 auto' : '0',
    },
    productCard: {
      backgroundColor: '#FFFFFF',
      borderRadius: '16px',
      border: '1px solid #E5E7EB',
      overflow: 'hidden',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
      position: 'relative',
    },
    removeCardBtn: {
      position: 'absolute',
      top: '12px',
      right: '12px',
      width: '32px',
      height: '32px',
      backgroundColor: '#FFFFFF',
      border: '1px solid #E5E7EB',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      color: '#DC2626',
      fontSize: '14px',
      zIndex: 10,
      transition: 'all 0.2s ease',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    },
    imageContainer: {
      width: '100%',
      height: compareList.length === 1 ? '250px' : '200px',
      backgroundColor: '#F9FAFB',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      borderBottom: '1px solid #E5E7EB',
    },
    productImage: {
      maxWidth: '100%',
      maxHeight: '100%',
      objectFit: 'contain',
    },
    productInfo: {
      padding: '20px',
    },
    productName: {
      fontSize: '15px',
      fontWeight: '700',
      color: '#111827',
      marginBottom: '16px',
      lineHeight: '1.4',
      minHeight: '42px',
      fontFamily: '"Inter", sans-serif',
    },
    attributeRow: {
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      padding: compareList.length === 1 ? '10px 0' : '12px 0',
      borderBottom: '1px solid #F3F4F6',
    },
    attributeLabel: {
      fontSize: '12px',
      fontWeight: '600',
      color: '#6B7280',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      fontFamily: '"Inter", sans-serif',
    },
    attributeValue: {
      fontSize: '14px',
      fontWeight: '600',
      color: '#111827',
      textAlign: 'right',
      fontFamily: '"Inter", sans-serif',
    },
    actionBtn: {
      width: '100%',
      padding: '12px',
      backgroundColor: '#059669',
      color: '#FFFFFF',
      border: 'none',
      borderRadius: '10px',
      fontSize: '14px',
      fontWeight: '700',
      cursor: 'pointer',
      marginTop: '16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      transition: 'all 0.2s ease',
      fontFamily: '"Inter", sans-serif',
    },
  };

  return (
    <div style={modalStyles.overlay} onClick={onClose}>
      <div style={modalStyles.container} onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div style={modalStyles.header}>
          <h2 style={modalStyles.title}>Ürün Karşılaştırma ({compareList.length})</h2>
          <button
            style={modalStyles.closeBtn}
            onClick={onClose}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#F3F4F6';
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#FFFFFF';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <FaTimes />
          </button>
        </div>

        {/* Products Grid */}
        <div style={modalStyles.scrollContent}>
          <div style={modalStyles.grid}>
            {compareList.map((product) => (
              <div key={product.id} style={modalStyles.productCard}>
                
                {/* Remove Button */}
                {onRemove && (
                  <button
                    style={modalStyles.removeCardBtn}
                    onClick={() => onRemove(product)}
                    title="Listeden Çıkar"
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#DC2626';
                      e.currentTarget.style.color = '#FFFFFF';
                      e.currentTarget.style.transform = 'scale(1.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#FFFFFF';
                      e.currentTarget.style.color = '#DC2626';
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  >
                    <FaTimes />
                  </button>
                )}
                
                {/* Product Image */}
                <div style={modalStyles.imageContainer}>
                  <img
                    src={product.image || product.main_photo?.file_path || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="300"%3E%3Crect fill="%23f1f5f9" width="300" height="300"/%3E%3Ctext fill="%2394a3b8" font-family="Arial" font-size="16" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3EÜrün Görseli%3C/text%3E%3C/svg%3E'}
                    alt={product.name}
                    style={modalStyles.productImage}
                  />
                </div>

                {/* Product Info */}
                <div style={modalStyles.productInfo}>
                  <h3 style={modalStyles.productName}>{product.name || product.title}</h3>

                  {/* Attributes */}
                  {compareAttributes.map((attr) => {
                    const value = product[attr.key];
                    const formattedValue = attr.format ? attr.format(value) : value || '-';
                    
                    return (
                      <div key={attr.key} style={modalStyles.attributeRow}>
                        <span style={modalStyles.attributeLabel}>
                          <span>{attr.icon}</span>
                          {attr.label}
                        </span>
                        <span style={modalStyles.attributeValue}>{formattedValue}</span>
                      </div>
                    );
                  })}

                  {/* Action Button */}
                  <button
                    style={modalStyles.actionBtn}
                    onClick={() => navigate(`/product/${product.slug || product.id}`)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#047857';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 8px 16px rgba(5, 150, 105, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#059669';
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <FaShoppingCart />
                    Detaya Git
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default CompareModal;
