// src/pages/public/Home/components/CtaSection.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FaStore, FaArrowRight } from 'react-icons/fa';

/**
 * Call to action section for vendor registration
 */
const CtaSection = ({ styles }) => {
  return (
    <section style={styles.ctaSection}>
      <h2 style={styles.ctaTitle}>Satıcı Olmak İster misiniz?</h2>
      <p style={styles.ctaText}>
        Ürünlerinizi milyonlarca müşteriye ulaştırın. Hemen başvurun, satışa başlayın!
      </p>
      <Link to="/vendor/register" style={styles.ctaButton}>
        <FaStore /> Hemen Başvur <FaArrowRight />
      </Link>
    </section>
  );
};

export default CtaSection;
