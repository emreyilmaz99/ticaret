// src/pages/vendor/Promotions/components/PromotionsTabs.jsx
import React from 'react';
import { FaTag, FaBox } from 'react-icons/fa';
import { styles } from '../styles';

const PromotionsTabs = ({ activeTab, onTabChange, couponsCount, campaignsCount }) => {
  return (
    <div style={styles.tabsContainer}>
      <button 
        style={{ 
          ...styles.tab, 
          ...(activeTab === 'coupons' ? styles.tabActive : {}) 
        }} 
        onClick={() => onTabChange('coupons')}
      >
        <FaTag /> Kuponlar ({couponsCount})
      </button>
      <button 
        style={{ 
          ...styles.tab, 
          ...(activeTab === 'campaigns' ? styles.tabActive : {}) 
        }} 
        onClick={() => onTabChange('campaigns')}
      >
        <FaBox /> Kampanyalar ({campaignsCount})
      </button>
    </div>
  );
};

export default PromotionsTabs;
