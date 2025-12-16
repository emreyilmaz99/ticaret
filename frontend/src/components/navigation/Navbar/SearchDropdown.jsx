import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { FaSearch, FaClock } from 'react-icons/fa';

/**
 * Arama dropdown bileşeni - Popüler aramalar ve ürün önerileri
 */
const SearchDropdown = ({ 
  isOpen, 
  searchResults, 
  popularSearches, 
  isLoading,
  onClose 
}) => {
  if (!isOpen) return null;

  const styles = {
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 998,
    },
    dropdown: {
      position: 'absolute',
      top: '100%',
      left: 0,
      right: 0,
      backgroundColor: '#fff',
      borderRadius: '0 0 12px 12px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
      maxHeight: '500px',
      overflowY: 'auto',
      zIndex: 999,
      marginTop: '4px',
    },
    section: {
      padding: '16px',
      borderBottom: '1px solid #e5e7eb',
    },
    sectionTitle: {
      fontSize: '14px',
      fontWeight: '600',
      color: '#6b7280',
      marginBottom: '12px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    popularItem: {
      padding: '10px 12px',
      cursor: 'pointer',
      borderRadius: '8px',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      transition: 'background-color 0.2s',
      color: '#374151',
      textDecoration: 'none',
      ':hover': {
        backgroundColor: '#f3f4f6',
      }
    },
    productItem: {
      padding: '12px',
      cursor: 'pointer',
      borderRadius: '8px',
      display: 'flex',
      gap: '12px',
      alignItems: 'center',
      transition: 'background-color 0.2s',
      textDecoration: 'none',
      color: '#374151',
    },
    productImage: {
      width: '60px',
      height: '60px',
      objectFit: 'cover',
      borderRadius: '8px',
      backgroundColor: '#f3f4f6',
    },
    productInfo: {
      flex: 1,
    },
    productName: {
      fontSize: '14px',
      fontWeight: '500',
      color: '#111827',
      marginBottom: '4px',
      display: '-webkit-box',
      WebkitLineClamp: 2,
      WebkitBoxOrient: 'vertical',
      overflow: 'hidden',
    },
    productPrice: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#059669',
    },
    originalPrice: {
      fontSize: '14px',
      color: '#9ca3af',
      textDecoration: 'line-through',
      marginLeft: '8px',
    },
    vendorName: {
      fontSize: '12px',
      color: '#6b7280',
      marginTop: '4px',
    },
    emptyState: {
      padding: '40px 16px',
      textAlign: 'center',
      color: '#9ca3af',
    },
    loading: {
      padding: '40px 16px',
      textAlign: 'center',
      color: '#9ca3af',
    }
  };

  return (
    <>
      {/* Overlay - dışarı tıklandığında kapanır */}
      <div style={styles.overlay} onClick={onClose} />
      
      {/* Dropdown içeriği */}
      <div style={styles.dropdown}>
        
        {isLoading ? (
          <div style={styles.loading}>
            Aranıyor...
          </div>
        ) : searchResults && searchResults.length > 0 ? (
          // Ürün sonuçları varsa
          <div style={styles.section}>
            <div style={styles.sectionTitle}>
              <FaSearch size={14} />
              Ürünler
            </div>
            {searchResults.map(product => (
              <Link
                key={product.id}
                to={`/products/${product.slug}`}
                style={styles.productItem}
                onClick={onClose}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <img 
                  src={product.main_image || '/placeholder.png'} 
                  alt={product.name}
                  style={styles.productImage}
                  onError={(e) => e.target.src = '/placeholder.png'}
                />
                <div style={styles.productInfo}>
                  <div style={styles.productName}>{product.name}</div>
                  <div>
                    <span style={styles.productPrice}>
                      {product.discount_price 
                        ? `${product.discount_price.toFixed(2)} ₺`
                        : `${product.price.toFixed(2)} ₺`
                      }
                    </span>
                    {product.discount_price && (
                      <span style={styles.originalPrice}>
                        {product.price.toFixed(2)} ₺
                      </span>
                    )}
                  </div>
                  {product.vendor?.name && (
                    <div style={styles.vendorName}>
                      {product.vendor.name}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          // Popüler aramalar
          <div style={styles.section}>
            <div style={styles.sectionTitle}>
              <FaClock size={14} />
              Popüler Aramalar
            </div>
            {popularSearches.map((search, index) => (
              <Link
                key={index}
                to={`/products?q=${encodeURIComponent(search)}`}
                style={styles.popularItem}
                onClick={onClose}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <FaSearch size={14} color="#9ca3af" />
                <span>{search}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

SearchDropdown.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  searchResults: PropTypes.array,
  popularSearches: PropTypes.array,
  isLoading: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
};

SearchDropdown.defaultProps = {
  searchResults: [],
  popularSearches: [],
  isLoading: false,
};

export default SearchDropdown;
