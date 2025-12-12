// src/pages/vendor/Promotions/components/PromotionsHeader.jsx
import React from 'react';
import { FaGift, FaInfoCircle } from 'react-icons/fa';
import { styles } from '../styles';

const PromotionsHeader = () => {
  return (
    <>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>
            <FaGift style={styles.titleIcon} /> Promosyonlar
          </h1>
          <p style={styles.subtitle}>
            Kupon kodları ve kampanyalar oluşturarak müşterilerinize özel indirimler sunun
          </p>
        </div>
      </div>

      <div style={styles.infoCard}>
        <FaInfoCircle style={styles.infoIcon} />
        <div>
          <p style={styles.infoTitle}>Nasıl Çalışır?</p>
          <p style={styles.infoText}>
            <strong>Kuponlar:</strong> Müşteriler sepette kupon kodunu girerek sabit tutar indirimi alır. Minimum sepet tutarı belirleyebilirsiniz.<br/>
            <strong>Kampanyalar:</strong> "3 al 2 öde" gibi kampanyalar için ürün seçerek otomatik indirim sağlayın.
          </p>
        </div>
      </div>
    </>
  );
};

export default PromotionsHeader;
