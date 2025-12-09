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
                src={product.image || product.main_photo?.file_path || '/placeholder.jpg'}
                alt={product.name}
                style={styles.compareProductImage}
              />
              <button
                onClick={() => onRemove(product)}
                style={styles.compareRemoveBtn}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#B91C1C';
                  e.currentTarget.style.transform = 'scale(1.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#DC2626';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                <FaTimes />
              </button>
            </div>
          ))}
          
          {/* Empty slots */}
          {[...Array(3 - compareList.length)].map((_, i) => (
            <div key={`empty-${i}`} style={styles.compareEmptySlot}>
              <span style={{ fontSize: '24px', color: '#D1D5DB' }}>+</span>
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
          onMouseEnter={(e) => {
            if (compareList.length >= 2) {
              e.currentTarget.style.backgroundColor = '#047857';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(5, 150, 105, 0.4)';
            }
          }}
          onMouseLeave={(e) => {
            if (compareList.length >= 2) {
              e.currentTarget.style.backgroundColor = '#059669';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }
          }}
        >
          <FaExchangeAlt />
          Karşılaştır ({compareList.length}/3)
        </button>
      </div>
    </div>
  );
};
