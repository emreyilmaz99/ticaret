// src/components/modals/CompareModal/index.jsx
import React, { useCallback, useMemo } from 'react';
import { FaTimes } from 'react-icons/fa';
import { useHoverEffect } from '../../../hooks/useHoverEffect';
import CompareCard from './CompareCard';
import { getCompareModalStyles } from './styles';

const CompareModal = ({ compareList, onClose, onRemove }) => {
  const { isHovered, handleMouseEnter, handleMouseLeave } = useHoverEffect();
  
  const compareCount = useMemo(() => compareList?.length || 0, [compareList]);
  const styles = useMemo(() => getCompareModalStyles(compareCount), [compareCount]);

  const handleOverlayClick = useCallback((e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }, [onClose]);

  if (!compareList || compareCount === 0) return null;

  const closeBtnStyle = {
    width: '40px',
    height: '40px',
    backgroundColor: isHovered ? '#F3F4F6' : '#FFFFFF',
    color: '#374151',
    border: '1px solid #E5E7EB',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    fontSize: '16px',
    transition: 'all 0.2s ease',
    transform: isHovered ? 'scale(1.05)' : 'scale(1)',
  };

  return (
    <div style={styles.overlay} onClick={handleOverlayClick}>
      <div style={styles.container} onClick={(e) => e.stopPropagation()}>
        <div style={styles.header}>
          <h2 style={styles.title}>
            Ürün Karşılaştırma ({compareCount})
          </h2>
          <button
            style={closeBtnStyle}
            onClick={onClose}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <FaTimes />
          </button>
        </div>

        <div style={styles.scrollContent}>
          <div style={styles.grid}>
            {compareList.map((product) => (
              <CompareCard
                key={product.id}
                product={product}
                onRemove={onRemove}
                isSingleProduct={compareCount === 1}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(CompareModal);
