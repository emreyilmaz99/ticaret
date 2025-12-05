// src/pages/vendor/Products/components/modal/ModalTabs.jsx
import React from 'react';
import { styles } from '../../styles';

const tabs = [
  { id: 'general', label: 'Genel Bilgiler' },
  { id: 'pricing', label: 'Fiyat & Stok' },
  { id: 'media', label: 'Görseller' },
  { id: 'variants', label: 'Varyantlar' },
  { id: 'settings', label: 'Ayarlar' }
];

const ModalTabs = ({ activeTab, onTabChange, formType }) => {
  return (
    <div style={styles.modalTabs}>
      {tabs.map(tab => {
        // Hide variants tab for simple products
        if (tab.id === 'variants' && formType === 'simple') {
          return null;
        }
        
        return (
          <button
            key={tab.id}
            style={{
              ...styles.modalTab,
              ...(activeTab === tab.id ? styles.modalTabActive : {})
            }}
            onClick={() => onTabChange(tab.id)}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
};

export default ModalTabs;
