import React from 'react';
import { FaInfoCircle } from 'react-icons/fa';
import { styles } from '../styles';

/**
 * Info box component for category page
 * Shows helpful information about category selection
 */
const CategoryInfo = () => {
  return (
    <div style={styles.infoBox}>
      <FaInfoCircle style={styles.infoIcon} />
      <div style={styles.infoContent}>
        <strong>Kategori Seçimi Hakkında</strong>
        <p style={styles.infoText}>
          Ürünlerinizi listelemek istediğiniz kategorileri seçin. 
          Birden fazla kategori seçebilirsiniz. Seçtiğiniz kategoriler 
          ürün ekleme ekranında görünecektir.
        </p>
      </div>
    </div>
  );
};

export default CategoryInfo;
