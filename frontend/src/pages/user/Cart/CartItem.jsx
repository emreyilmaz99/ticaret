// src/pages/user/Cart/CartItem.jsx
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag } from 'react-icons/fi';

/**
 * Tek bir sepet ürünü satırı
 */
const CartItem = ({ 
  item, 
  onRemove, 
  onUpdateQuantity, 
  loading, 
  isMobile, 
  styles 
}) => {
  const handleDecrease = () => {
    if (item.quantity > 1) {
      onUpdateQuantity(item.id, item.quantity - 1);
    }
  };

  const handleIncrease = () => {
    onUpdateQuantity(item.id, item.quantity + 1);
  };

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
          <button 
            onClick={() => onRemove(item.id)}
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
          <span style={{ fontWeight: '700', color: '#059669' }}>
            {item.unit_price?.toLocaleString('tr-TR')} TL
          </span>
          <QuantityControl 
            quantity={item.quantity}
            onDecrease={handleDecrease}
            onIncrease={handleIncrease}
            loading={loading}
            styles={styles}
          />
        </div>
      )}

      {/* Desktop Kolonlar */}
      <div style={{
        textAlign: 'center', 
        display: isMobile ? 'none' : 'block', 
        ...styles.priceText
      }}>
        {item.unit_price?.toLocaleString('tr-TR')} TL
      </div>

      <div style={{ display: isMobile ? 'none' : 'flex', justifyContent: 'center' }}>
        <QuantityControl 
          quantity={item.quantity}
          onDecrease={handleDecrease}
          onIncrease={handleIncrease}
          loading={loading}
          styles={styles}
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
const QuantityControl = ({ quantity, onDecrease, onIncrease, loading, styles }) => (
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
        opacity: loading ? 0.5 : 1
      }}
      disabled={loading}
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
  styles: PropTypes.object.isRequired,
};

QuantityControl.propTypes = {
  quantity: PropTypes.number.isRequired,
  onDecrease: PropTypes.func.isRequired,
  onIncrease: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  styles: PropTypes.object.isRequired,
};

export default CartItem;
