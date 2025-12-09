// src/pages/public/CategoryProducts/components/CompareModal.jsx
import React from 'react';
import { FaTimes, FaCheck, FaTimes as FaX } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { formatPrice } from '../styles';

export const CompareModal = ({ compareList, onClose, styles }) => {
  const navigate = useNavigate();

  if (!compareList || compareList.length === 0) return null;

  const compareAttributes = [
    { key: 'price', label: 'Fiyat', format: (val) => formatPrice(val) },
    { key: 'final_price', label: 'İndirimli Fiyat', format: (val) => formatPrice(val) },
    { key: 'discount_percentage', label: 'İndirim', format: (val) => val ? `%${val}` : '-' },
    { key: 'rating', label: 'Puan', format: (val) => val || '-' },
    { key: 'reviews_count', label: 'Yorum Sayısı', format: (val) => val || '0' },
    { key: 'stock_quantity', label: 'Stok', format: (val) => val > 0 ? `${val} adet` : 'Tükendi' },
    { key: 'brand_name', label: 'Marka', format: (val) => val || '-' },
    { key: 'vendor_name', label: 'Satıcı', format: (val) => val || '-' },
  ];

  return (
    <div 
      style={styles.modalOverlay}
      onClick={onClose}
    >
      <div 
        style={{
          ...styles.modalContent,
          maxWidth: '1200px',
          maxHeight: '80vh',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          padding: '24px',
          borderBottom: `1px solid #E5E7EB`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: '700',
            color: '#111827',
            margin: 0,
          }}>
            Ürün Karşılaştırma
          </h2>
          <button
            onClick={onClose}
            style={{
              ...styles.modalClose,
              position: 'static',
            }}
          >
            <FaTimes />
          </button>
        </div>

        {/* Content */}
        <div style={{
          padding: '24px',
          overflowX: 'auto',
        }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
          }}>
            <thead>
              <tr>
                <th style={{
                  padding: '16px',
                  textAlign: 'left',
                  fontWeight: '600',
                  fontSize: '14px',
                  color: '#6B7280',
                  borderBottom: '2px solid #E5E7EB',
                  position: 'sticky',
                  left: 0,
                  backgroundColor: '#fff',
                  minWidth: '150px',
                }}>
                  Özellik
                </th>
                {compareList.map((product) => (
                  <th key={product.id} style={{
                    padding: '16px',
                    textAlign: 'center',
                    fontWeight: '600',
                    fontSize: '14px',
                    borderBottom: '2px solid #E5E7EB',
                    minWidth: '200px',
                  }}>
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '12px',
                    }}>
                      <img
                        src={product.image || product.main_photo?.file_path || '/placeholder.jpg'}
                        alt={product.name}
                        style={{
                          width: '100px',
                          height: '100px',
                          objectFit: 'contain',
                          borderRadius: '12px',
                          border: '1px solid #E5E7EB',
                          padding: '8px',
                          backgroundColor: '#F9FAFB',
                        }}
                      />
                      <div style={{
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#111827',
                        textAlign: 'center',
                        lineHeight: '1.4',
                      }}>
                        {product.name || product.title}
                      </div>
                      <button
                        onClick={() => navigate(`/product/${product.slug}`)}
                        style={{
                          padding: '8px 16px',
                          backgroundColor: '#059669',
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          fontSize: '12px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#047857';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = '#059669';
                        }}
                      >
                        Detaya Git
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {compareAttributes.map((attr, index) => (
                <tr key={attr.key} style={{
                  backgroundColor: index % 2 === 0 ? '#fff' : '#F9FAFB',
                }}>
                  <td style={{
                    padding: '16px',
                    fontWeight: '600',
                    fontSize: '14px',
                    color: '#374151',
                    borderBottom: '1px solid #E5E7EB',
                    position: 'sticky',
                    left: 0,
                    backgroundColor: index % 2 === 0 ? '#fff' : '#F9FAFB',
                  }}>
                    {attr.label}
                  </td>
                  {compareList.map((product) => {
                    const value = product[attr.key];
                    const formattedValue = attr.format ? attr.format(value) : value || '-';
                    
                    return (
                      <td key={product.id} style={{
                        padding: '16px',
                        textAlign: 'center',
                        fontSize: '14px',
                        color: '#111827',
                        borderBottom: '1px solid #E5E7EB',
                      }}>
                        {formattedValue}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div style={{
          padding: '20px 24px',
          borderTop: `1px solid #E5E7EB`,
          display: 'flex',
          justifyContent: 'flex-end',
        }}>
          <button
            onClick={onClose}
            style={{
              padding: '10px 24px',
              backgroundColor: '#F3F4F6',
              color: '#374151',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#E5E7EB';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#F3F4F6';
            }}
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
};
