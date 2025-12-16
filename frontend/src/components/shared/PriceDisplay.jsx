// src/components/shared/PriceDisplay.jsx
import React from 'react';
import { formatPrice } from '../../utils/formatters';

const PriceDisplay = React.memo(({ 
  price, 
  originalPrice = null, 
  hasDiscount = false,
  isMobile = false,
  showOldPrice = true
}) => {
  return (
    <div style={{ 
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      marginBottom: '10px'
    }}>
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column',
        gap: '2px',
        flex: 1,
      }}>
        {/* Original Price (crossed out) */}
        {showOldPrice && originalPrice && originalPrice > price && (
          <span style={{
            fontSize: '11px', 
            color: '#94a3b8', 
            textDecoration: 'line-through',
            fontWeight: '500',
          }}>
            {formatPrice(originalPrice)}
          </span>
        )}
        
        {/* Current Price */}
        <div style={{
          fontSize: isMobile ? '17px' : '20px', 
          fontWeight: '800', 
          color: hasDiscount ? '#059669' : '#0f172a',
          letterSpacing: '-0.5px',
        }}>
          {formatPrice(price)}
        </div>
      </div>
    </div>
  );
});

PriceDisplay.displayName = 'PriceDisplay';

export default PriceDisplay;
