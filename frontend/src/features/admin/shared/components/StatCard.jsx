// src/features/admin/shared/components/StatCard.jsx
import React from 'react';
import PropTypes from 'prop-types';

/**
 * Merkezi StatCard bileşeni - İstatistik kartları için
 * Tüm admin modüllerinde kullanılabilir
 */
const StatCard = ({ 
  icon, 
  title, 
  value, 
  description, 
  color = '#059669',
  onClick,
  isActive = false,
  gradient = false,
  size = 'medium',
  style = {} 
}) => {
  // Size variations
  const sizeConfig = {
    small: { 
      padding: '16px', 
      iconSize: '40px', 
      titleSize: '12px', 
      valueSize: '20px',
      descSize: '11px' 
    },
    medium: { 
      padding: '20px', 
      iconSize: '48px', 
      titleSize: '13px', 
      valueSize: '28px',
      descSize: '12px' 
    },
    large: { 
      padding: '24px', 
      iconSize: '56px', 
      titleSize: '14px', 
      valueSize: '32px',
      descSize: '13px' 
    },
  };

  const currentSize = sizeConfig[size] || sizeConfig.medium;

  // Gradient background
  const getBackground = () => {
    if (gradient) {
      return `linear-gradient(135deg, ${color} 0%, ${color}CC 100%)`;
    }
    if (isActive) {
      return `linear-gradient(135deg, ${color}15 0%, ${color}08 100%)`;
    }
    return 'white';
  };

  const cardStyle = {
    background: getBackground(),
    padding: currentSize.padding,
    borderRadius: '16px',
    border: isActive ? `2px solid ${color}` : '1px solid #e5e7eb',
    cursor: onClick ? 'pointer' : 'default',
    transition: 'all 0.3s ease',
    boxShadow: isActive
      ? `0 4px 12px ${color}30`
      : '0 1px 3px rgba(0, 0, 0, 0.1)',
    ...style,
  };

  const textColor = gradient ? 'white' : '#1e293b';
  const titleColor = gradient ? 'rgba(255,255,255,0.9)' : '#64748b';

  return (
    <div
      style={cardStyle}
      onClick={onClick}
      onMouseEnter={(e) => {
        if (onClick) {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = `0 8px 16px ${color}30`;
        }
      }}
      onMouseLeave={(e) => {
        if (onClick) {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = isActive
            ? `0 4px 12px ${color}30`
            : '0 1px 3px rgba(0, 0, 0, 0.1)';
        }
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
        {icon && (
          <div
            style={{
              fontSize: '24px',
              width: currentSize.iconSize,
              height: currentSize.iconSize,
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: gradient ? 'rgba(255,255,255,0.2)' : `${color}15`,
              color: gradient ? 'white' : color,
              flexShrink: 0,
            }}
          >
            {icon}
          </div>
        )}
        
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontSize: currentSize.titleSize,
              fontWeight: '500',
              color: titleColor,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              marginBottom: '8px',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {title}
          </div>
          
          <div
            style={{
              fontSize: currentSize.valueSize,
              fontWeight: '700',
              color: textColor,
              letterSpacing: '-0.02em',
              lineHeight: '1',
            }}
          >
            {value}
          </div>
          
          {description && (
            <div
              style={{
                fontSize: currentSize.descSize,
                color: gradient ? 'rgba(255,255,255,0.8)' : '#94a3b8',
                marginTop: '4px',
              }}
            >
              {description}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

StatCard.propTypes = {
  icon: PropTypes.node,
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  description: PropTypes.string,
  color: PropTypes.string,
  onClick: PropTypes.func,
  isActive: PropTypes.bool,
  gradient: PropTypes.bool,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  style: PropTypes.object,
};

export default React.memo(StatCard);
