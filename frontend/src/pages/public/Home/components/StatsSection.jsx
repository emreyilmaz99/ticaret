// src/pages/public/Home/components/StatsSection.jsx
import React from 'react';
import { FaUsers, FaStore, FaBox, FaStar } from 'react-icons/fa';
import { STATS_DATA } from '../styles';

const iconMap = {
  FaUsers: FaUsers,
  FaStore: FaStore,
  FaBox: FaBox,
  FaStar: FaStar,
};

/**
 * Statistics section displaying key metrics
 */
const StatsSection = ({ styles }) => {
  return (
    <section style={styles.statsSection}>
      {STATS_DATA.map((stat, index) => {
        const IconComponent = iconMap[stat.icon];
        return (
          <div key={index} style={styles.statCard}>
            <div style={{ 
              ...styles.statIcon, 
              background: stat.bgGradient, 
              color: stat.color 
            }}>
              <IconComponent />
            </div>
            <div style={styles.statNumber}>{stat.number}</div>
            <div style={styles.statLabel}>{stat.label}</div>
          </div>
        );
      })}
    </section>
  );
};

export default StatsSection;
