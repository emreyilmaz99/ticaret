// src/pages/user/Cart/CartItem.jsx
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag } from 'react-icons/fi';

/**
 * Default styles for CartItem - used when styles prop is not provided
 */
const defaultStyles = {
  cartItem: {
    display: 'grid',
    alignItems: 'center',
    padding: '16px 20px',
    gap: '16px',
  },
  productInfo: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
  },
  productImage: {
    width: '80px',
    height: '80px',
    borderRadius: '12px',
    objectFit: 'cover',
    flexShrink: 0,
  },
  productDetails: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    minWidth: 0,
  },
  productName: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#1e293b',
    textDecoration: 'none',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
  },
  variantText: {
    fontSize: '12px',
    color: '#64748b',
    margin: 0,
  },
  removeBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '12px',
    color: '#ef4444',
    background: 'none',
    border: 'none',
    padding: '4px 0',
    cursor: 'pointer',
    marginTop: '4px',
  },
  stockInfo: {
    fontSize: '11px',
    color: '#64748b',
    marginTop: '4px',
  },
  lowStockWarning: {
    fontSize: '11px',
    color: '#f59e0b',
    fontWeight: '600',
    marginTop: '4px',
  },
  outOfStockWarning: {
    fontSize: '11px',
    color: '#ef4444',
    fontWeight: '600',
    marginTop: '4px',
  },
  dealBadge: {
    display: 'inline-block',
    fontSize: '10px',
    fontWeight: '700',
    padding: '2px 6px',
    borderRadius: '4px',
    marginTop: '4px',
  },
  originalPrice: {
    fontSize: '12px',
    color: '#94a3b8',
    textDecoration: 'line-through',
    marginRight: '8px',
  },
  discountedPrice: {
    fontWeight: '700',
    color: '#ef4444',
  },
  priceText: {
    fontWeight: '500',
    color: '#475569',
  },
  totalText: {
    textAlign: 'right',
    fontWeight: '700',
    color: '#059669',
  },
  quantityControl: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: '#f8fafc',
    borderRadius: '8px',
    padding: '4px',
  },
  qtyBtn: {
    width: '28px',
    height: '28px',
    borderRadius: '6px',
    border: '1px solid #e2e8f0',
    backgroundColor: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  qtyText: {
    minWidth: '24px',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: '14px',
  },
};

/**
 * Tek bir sepet ürünü satırı
 */
const CartItem = ({ 
  item, 
  onRemove, 
  onUpdateQuantity, 
  loading, 
  isMobile, 
  styles: customStyles,
  showVendor = true,
}) => {
  // Merge default styles with custom styles
  const styles = customStyles || defaultStyles;
  const handleDecrease = () => {
    if (item.quantity > 1) {
      onUpdateQuantity(item.quantity - 1);
    }
  };

  const handleIncrease = () => {
    // Stok durumu kontrolü
    const productStock = item.stock ?? item.product?.stock_quantity ?? 0;
    
    // Stok kontrolü - stoktan fazla eklenemesin
    if (productStock > 0 && item.quantity >= productStock) {
      return;
    }
    onUpdateQuantity(item.quantity + 1);
  };

  // Stok durumu kontrolü
  const productStock = item.stock ?? item.product?.stock_quantity ?? 0;
  const isOutOfStock = productStock === 0;
  const isLowStock = productStock > 0 && productStock < 5;
  const isAtMaxStock = productStock > 0 && item.quantity >= productStock;

  return (
    <div style={{
      ...styles.cartItem,
      gridTemplateColumns: isMobile ? '1fr' : '2fr 1fr 1fr 1fr',
    }}>
      {/* Ürün Bilgisi */}
      <div style={styles.productInfo}>
        {item.product?.image ? (
          <img 
            src={item.product.image} 
            alt={item.product?.name} 
            style={styles.productImage}
          />
        ) : (
          <div style={{
            ...styles.productImage, 
            backgroundColor: '#f1f5f9', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center'
          }}>
            <FiShoppingBag size={24} color="#cbd5e1" />
          </div>
        )}
        <div style={styles.productDetails}>
          <Link 
            to={`/product/${item.product?.slug}`} 
            style={styles.productName}
          >
            {item.product?.name}
          </Link>
          {item.variant && (
            <p style={styles.variantText}>
              {item.variant.title || item.variant.sku}
            </p>
          )}
          {/* Stok bilgisi ve uyarıları */}
          {isOutOfStock ? (
            <p style={styles.outOfStockWarning}>
              ⚠️ Stokta yok
            </p>
          ) : isLowStock ? (
            <p style={styles.lowStockWarning}>
              ⚠️ Sadece {productStock} adet kaldı!
            </p>
          ) : productStock > 0 && (
            <p style={styles.stockInfo}>
              {productStock} adet stokta
            </p>
          )}
          {item.has_deal && item.deal_badge && (
            <span style={{
              ...styles.dealBadge,
              backgroundColor: item.deal_badge.color || '#ef4444',
              color: 'white'
            }}>
              {item.deal_badge.text}
            </span>
          )}
          <button 
            onClick={onRemove}
            style={styles.removeBtn}
            disabled={loading}
          >
            <FiTrash2 /> Sil
          </button>
        </div>
      </div>

      {/* Mobil Fiyat ve Adet Kontrolü */}
      {isMobile && (
        <div style={{
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          width: '100%'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {item.has_deal && item.original_price && (
              <span style={styles.originalPrice}>
                {item.original_price?.toLocaleString('tr-TR')} TL
              </span>
            )}
            <span style={{
              fontWeight: '700',
              color: item.has_deal ? '#ef4444' : '#059669'
            }}>
              {item.unit_price?.toLocaleString('tr-TR')} TL
            </span>
          </div>
          <QuantityControl 
            quantity={item.quantity}
            onDecrease={handleDecrease}
            onIncrease={handleIncrease}
            loading={loading}
            styles={styles}
            isAtMaxStock={isAtMaxStock}
          />
        </div>
      )}

      {/* Desktop Kolonlar */}
      <div style={{
        textAlign: 'center', 
        display: isMobile ? 'none' : 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '4px',
        ...styles.priceText
      }}>
        {item.has_deal && item.original_price && (
          <span style={styles.originalPrice}>
            {item.original_price?.toLocaleString('tr-TR')} TL
          </span>
        )}
        <span style={{
          fontWeight: item.has_deal ? '700' : '500',
          color: item.has_deal ? '#ef4444' : '#475569'
        }}>
          {item.unit_price?.toLocaleString('tr-TR')} TL
        </span>
      </div>

      <div style={{ display: isMobile ? 'none' : 'flex', justifyContent: 'center' }}>
        <QuantityControl 
          quantity={item.quantity}
          onDecrease={handleDecrease}
          onIncrease={handleIncrease}
          loading={loading}
          styles={styles}
          isAtMaxStock={isAtMaxStock}
        />
      </div>

      <div style={{
        ...styles.totalText, 
        display: isMobile ? 'none' : 'block'
      }}>
        {item.line_total?.toLocaleString('tr-TR')} TL
      </div>
    </div>
  );
};

/**
 * Miktar kontrol bileşeni
 */
const QuantityControl = ({ quantity, onDecrease, onIncrease, loading, styles, isAtMaxStock }) => (
  <div style={styles.quantityControl}>
    <button 
      onClick={onDecrease}
      style={{
        ...styles.qtyBtn, 
        opacity: quantity <= 1 || loading ? 0.5 : 1
      }}
      disabled={quantity <= 1 || loading}
    >
      <FiMinus size={12} />
    </button>
    <span style={styles.qtyText}>{quantity}</span>
    <button 
      onClick={onIncrease}
      style={{
        ...styles.qtyBtn, 
        opacity: loading || isAtMaxStock ? 0.5 : 1,
        cursor: isAtMaxStock ? 'not-allowed' : 'pointer'
      }}
      disabled={loading || isAtMaxStock}
      title={isAtMaxStock ? 'Maksimum stok miktarına ulaşıldı' : ''}
    >
      <FiPlus size={12} />
    </button>
  </div>
);

CartItem.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    quantity: PropTypes.number.isRequired,
    unit_price: PropTypes.number,
    line_total: PropTypes.number,
    product: PropTypes.shape({
      name: PropTypes.string,
      slug: PropTypes.string,
      image: PropTypes.string,
    }),
    variant: PropTypes.shape({
      title: PropTypes.string,
      sku: PropTypes.string,
    }),
  }).isRequired,
  onRemove: PropTypes.func.isRequired,
  onUpdateQuantity: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  isMobile: PropTypes.bool,
  styles: PropTypes.object,
  showVendor: PropTypes.bool,
};

CartItem.defaultProps = {
  loading: false,
  isMobile: false,
  styles: null,
  showVendor: true,
};

QuantityControl.propTypes = {
  quantity: PropTypes.number.isRequired,
  onDecrease: PropTypes.func.isRequired,
  onIncrease: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  styles: PropTypes.object.isRequired,
  isAtMaxStock: PropTypes.bool,
};

export default CartItem;
