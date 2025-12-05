// src/pages/public/Home/components/FeaturesSection.jsx
import React from 'react';
import { FaShieldAlt, FaTruck, FaStar } from 'react-icons/fa';
import { FEATURES_DATA } from '../styles';

const iconMap = {
  FaShieldAlt: FaShieldAlt,
  FaTruck: FaTruck,
  FaStar: FaStar,
};

/**
 * Features section - why choose us
 */
const FeaturesSection = ({ styles }) => {
  return (
    <section style={styles.featuresSection}>
      <h2 style={styles.sectionTitle}>Neden Bizi Tercih Etmelisiniz?</h2>
      <p style={styles.sectionSubtitle}>
        Alışveriş deneyiminizi en üst seviyeye çıkarmak için sürekli çalışıyoruz.
      </p>
      <div style={styles.featuresGrid}>
        {FEATURES_DATA.map((feature, index) => {
          const IconComponent = iconMap[feature.icon];
          return (
            <div key={index} style={styles.featureCard}>
              <div style={styles.featureIcon}>
                <IconComponent />
              </div>
              <h3 style={styles.featureTitle}>{feature.title}</h3>
              <p style={styles.featureDescription}>{feature.description}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default FeaturesSection;
