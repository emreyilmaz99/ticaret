import React from 'react';
import { FaInfoCircle } from 'react-icons/fa';
import { styles } from '../styles';

/**
 * Info card explaining how shipping works
 */
const InfoCard = () => {
  return (
    <div style={styles.infoCard}>
      <FaInfoCircle style={styles.infoIcon} />
      <div>
        <p style={styles.infoTitle}>Nasıl Çalışır?</p>
        <p style={styles.infoText}>
          Müşteriler sepetlerinde sizin mağazanızdan alışveriş yaptığında, belirlediğiniz kargo ücreti uygulanır.
          Sepet toplamı ücretsiz kargo limitinizi geçerse, kargo otomatik olarak ücretsiz olur.
        </p>
      </div>
    </div>
  );
};

export default InfoCard;
