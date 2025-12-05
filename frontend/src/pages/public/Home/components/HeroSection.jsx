// src/pages/public/Home/components/HeroSection.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FaShoppingCart, FaStore } from 'react-icons/fa';

/**
 * Hero section with title, subtitle and CTA buttons
 */
const HeroSection = ({ styles, isMobile }) => {
  return (
    <div style={styles.hero}>
      <div style={styles.heroContent}>
        <div style={styles.heroText}>
          <h1 style={styles.heroTitle}>
            Tarzını Keşfet,<br/>Fırsatları Yakala.
          </h1>
          <p style={styles.heroSubtitle}>
            En yeni koleksiyonlar, özel indirimler ve binlerce ürün seçeneği ile alışverişin keyfini çıkarın.
          </p>
          <div style={styles.heroButtons}>
            <Link to="/products" style={styles.heroBtn}>
              <FaShoppingCart /> Alışverişe Başla
            </Link>
            <Link to="/vendor/register" style={styles.secondaryButton}>
              <FaStore /> Satıcı Ol
            </Link>
          </div>
        </div>
        {/* Hero Image - Hidden on mobile */}
        {!isMobile && (
          <div style={{ 
            width: '400px', 
            height: '300px', 
            backgroundColor: 'rgba(255,255,255,0.1)', 
            borderRadius: '24px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center' 
          }}>
            <span style={{ fontSize: '80px', opacity: 0.5 }}>🛍️</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default HeroSection;
