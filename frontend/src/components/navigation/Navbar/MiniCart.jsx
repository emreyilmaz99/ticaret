import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { FaShoppingBag } from 'react-icons/fa';
import { getStyles } from './styles';

/**
 * Mini sepet dropdown bileşeni
 * @param {Array} cartItems - Sepetteki ürünler
 * @param {Object} totals - Sepet toplam bilgileri
 */
const MiniCart = ({ cartItems, totals }) => {
  const styles = getStyles(false); // Default to desktop styles for mini cart dropdown

  return (
    <div style={styles.miniCart}>
      <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '16px', color: '#334155' }}>
        Sepetim ({cartItems.length} Ürün)
      </div>

      {cartItems.slice(0, 3).map((item, index) => (
        <div key={item.id || index} style={styles.miniCartItem}>
          {item.product?.image ? (
            <img src={item.product.image} alt={item.product?.name} style={styles.miniCartImg} />
          ) : (
            <div style={{ ...styles.miniCartImg, backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FaShoppingBag size={16} color="#cbd5e1" />
            </div>
          )}
          <div style={styles.miniCartInfo}>
            <div style={styles.miniCartTitle}>{item.product?.name}</div>
            <div style={styles.miniCartPrice}>{item.unit_price?.toLocaleString('tr-TR')} TL</div>
            <div style={{ fontSize: '12px', color: '#64748b' }}>Adet: {item.quantity}</div>
          </div>
        </div>
      ))}

      {cartItems.length > 3 && (
        <div style={{ textAlign: 'center', fontSize: '12px', color: '#64748b', marginBottom: '10px' }}>
          ve {cartItems.length - 3} ürün daha...
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <span style={{ fontSize: '14px', color: '#64748b' }}>Toplam:</span>
        <span style={{ fontSize: '18px', fontWeight: '700', color: '#059669' }}>
          {(totals?.subtotal || 0).toLocaleString('tr-TR')} TL
        </span>
      </div>

      <Link to="/cart" style={styles.checkoutBtn}>Sepete Git</Link>
    </div>
  );
};

MiniCart.propTypes = {
  cartItems: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      product: PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        name: PropTypes.string,
        image: PropTypes.string,
      }),
      unit_price: PropTypes.number,
      quantity: PropTypes.number,
    })
  ).isRequired,
  totals: PropTypes.shape({
    subtotal: PropTypes.number,
    discount: PropTypes.number,
    shipping: PropTypes.number,
    total: PropTypes.number,
  }),
};

MiniCart.defaultProps = {
  cartItems: [],
  totals: { subtotal: 0 },
};

export default MiniCart;