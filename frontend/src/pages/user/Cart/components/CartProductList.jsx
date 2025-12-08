// src/pages/user/Cart/CartProductList.jsx
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import CartItem from './CartItem';

/**
 * Sepetteki ürünlerin listesi
 */
const CartProductList = ({ 
  cartItems, 
  onRemoveItem, 
  onUpdateQuantity, 
  onClearCart,
  loading, 
  isMobile, 
  styles 
}) => {
  return (
    <div style={styles.card}>
      {/* Tablo Başlığı (Sadece Desktop) */}
      <div style={{
        ...styles.tableHeader, 
        display: isMobile ? 'none' : 'grid'
      }}>
        <div>Ürün</div>
        <div style={{ textAlign: 'center' }}>Birim Fiyat</div>
        <div style={{ textAlign: 'center' }}>Adet</div>
        <div style={{ textAlign: 'right' }}>Toplam</div>
      </div>

      {/* Ürün Listesi */}
      <div>
        {cartItems.map((item) => (
          <CartItem
            key={item.id}
            item={item}
            onRemove={() => onRemoveItem(item.id)}
            onUpdateQuantity={(qty) => onUpdateQuantity(item.id, qty)}
            loading={loading}
            isMobile={isMobile}
            styles={styles}
          />
        ))}
      </div>

      {/* Alt Aksiyonlar */}
      <CartFooter 
          onClearCart={onClearCart}
          styles={styles}
        />
    </div>
  );
};

/**
 * Sepet alt footer bileşeni
 */
const CartFooter = ({ onClearCart, styles }) => (
  <div style={styles.footer}>
    <Link to="/" style={styles.continueLink}>
      <FiArrowRight style={{ transform: 'rotate(180deg)' }} /> 
      Alışverişe Devam Et
    </Link>
    <button 
      onClick={onClearCart}
      style={styles.clearBtn}
    >
      Sepeti Temizle
    </button>
  </div>
);

CartProductList.propTypes = {
  cartItems: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      quantity: PropTypes.number.isRequired,
      unit_price: PropTypes.number,
      line_total: PropTypes.number,
      product: PropTypes.object,
      variant: PropTypes.object,
    })
  ).isRequired,
  onRemoveItem: PropTypes.func.isRequired,
  onUpdateQuantity: PropTypes.func.isRequired,
  onClearCart: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  isMobile: PropTypes.bool,
  styles: PropTypes.object.isRequired,
};

CartFooter.propTypes = {
  onClearCart: PropTypes.func.isRequired,
  styles: PropTypes.object.isRequired,
};

export default CartProductList;
