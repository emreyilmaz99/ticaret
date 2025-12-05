// src/pages/public/CategoryProducts/components/CompareBar.jsx
import React from 'react';
import { FaTimes, FaExchangeAlt } from 'react-icons/fa';

/**
 * Comparison bar component shown at bottom of page
 */
export const CompareBar = ({
  compareList,
  onRemove,
  onOpenModal,
  styles
}) => {
  if (compareList.length === 0) return null;

  return (
    <div style={styles.compareBar}>
      <div style={styles.compareBarContent}>
        <div style={styles.compareProducts}>
          {compareList.map(product => (
            <div key={product.id} style={styles.compareProduct}>
              <img
                src={product.main_photo?.file_path || '/placeholder.jpg'}
                alt={product.name}
                style={styles.compareProductImage}
              />
              <button
                onClick={() => onRemove(product)}
                style={styles.compareRemoveBtn}
              >
                <FaTimes />
              </button>
            </div>
          ))}
          
          {/* Empty slots */}
          {[...Array(3 - compareList.length)].map((_, i) => (
            <div key={`empty-${i}`} style={styles.compareEmptySlot}>
              <span style={{ fontSize: '12px', color: '#999' }}>+</span>
            </div>
          ))}
        </div>

        <button
          onClick={onOpenModal}
          disabled={compareList.length < 2}
          style={{
            ...styles.compareButton,
            opacity: compareList.length < 2 ? 0.5 : 1,
            cursor: compareList.length < 2 ? 'not-allowed' : 'pointer'
          }}
        >
          <FaExchangeAlt style={{ marginRight: '8px' }} />
          Karşılaştır ({compareList.length}/3)
        </button>
      </div>
    </div>
  );
};
