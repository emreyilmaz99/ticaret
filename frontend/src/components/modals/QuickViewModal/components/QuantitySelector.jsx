// src/components/modals/QuickViewModal/components/QuantitySelector.jsx
import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { FaMinus, FaPlus } from 'react-icons/fa';
import { quantityConfig } from '../config';
import { useHoverEffect } from '../../../../hooks/useHoverEffect';
import { styles } from '../styles';

const QuantitySelector = React.memo(({ quantity, onQuantityChange, max = quantityConfig.max }) => {
  const minusHover = useHoverEffect({ backgroundColor: '#e0e0e0' });
  const plusHover = useHoverEffect({ backgroundColor: '#e0e0e0' });

  const handleDecrease = useCallback(() => {
    if (quantity > quantityConfig.min) {
      onQuantityChange(quantity - 1);
    }
  }, [quantity, onQuantityChange]);

  const handleIncrease = useCallback(() => {
    if (quantity < max) {
      onQuantityChange(quantity + 1);
    }
  }, [quantity, max, onQuantityChange]);

  const handleInputChange = useCallback(
    (e) => {
      const value = parseInt(e.target.value) || quantityConfig.min;
      const clampedValue = Math.max(quantityConfig.min, Math.min(max, value));
      onQuantityChange(clampedValue);
    },
    [max, onQuantityChange]
  );

  return (
    <div style={styles.quantitySection}>
      <span style={styles.quantityLabel}>Adet:</span>
      <div style={styles.quantityControl}>
        <button
          style={{
            ...styles.quantityButton,
            backgroundColor: minusHover.style.backgroundColor,
          }}
          onClick={handleDecrease}
          disabled={quantity <= quantityConfig.min}
          onMouseEnter={minusHover.onMouseEnter}
          onMouseLeave={minusHover.onMouseLeave}
        >
          <FaMinus size={12} />
        </button>
        <input
          style={styles.quantityInput}
          type="number"
          min={quantityConfig.min}
          max={max}
          value={quantity}
          onChange={handleInputChange}
        />
        <button
          style={{
            ...styles.quantityButton,
            backgroundColor: plusHover.style.backgroundColor,
          }}
          onClick={handleIncrease}
          disabled={quantity >= max}
          onMouseEnter={plusHover.onMouseEnter}
          onMouseLeave={plusHover.onMouseLeave}
        >
          <FaPlus size={12} />
        </button>
      </div>
    </div>
  );
});

QuantitySelector.displayName = 'QuantitySelector';

QuantitySelector.propTypes = {
  quantity: PropTypes.number.isRequired,
  onQuantityChange: PropTypes.func.isRequired,
  max: PropTypes.number,
};

export default QuantitySelector;
