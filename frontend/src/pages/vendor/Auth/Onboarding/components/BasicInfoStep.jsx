import React from 'react';
import PropTypes from 'prop-types';

const BasicInfoStep = ({ basic, setBasic, logoFile, setLogoFile, coverFile, setCoverFile, styles }) => {
  return (
    <div style={styles.formSection}>
      <h4 style={styles.sectionTitle}>Mağaza Bilgileri</h4>

      <label style={styles.label}>Mağaza / Şirket Adı</label>
      <input
        value={basic.company_name}
        onChange={(e) => setBasic({ ...basic, company_name: e.target.value })}
        style={styles.input}
        placeholder="Örn: ABC Mağazacılık Ltd. Şti."
      />

      <label style={styles.label}>Vergi Numarası</label>
      <input
        value={basic.tax_id}
        onChange={(e) => setBasic({ ...basic, tax_id: e.target.value })}
        style={styles.input}
        placeholder="10 haneli vergi numarası"
      />

      <label style={styles.label}>Telefon</label>
      <input
        value={basic.phone}
        onChange={(e) => setBasic({ ...basic, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
        maxLength={10}
        style={styles.input}
        placeholder="5XXXXXXXXX"
      />

      <label style={styles.label}>Logo (opsiyonel)</label>
      <input type="file" accept="image/*" onChange={(e) => setLogoFile(e.target.files[0])} style={styles.fileInput} />

      <label style={styles.label}>Kapak Görseli (opsiyonel)</label>
      <input type="file" accept="image/*" onChange={(e) => setCoverFile(e.target.files[0])} style={styles.fileInput} />
    </div>
  );
};

BasicInfoStep.propTypes = {
  basic: PropTypes.shape({
    company_name: PropTypes.string,
    tax_id: PropTypes.string,
    phone: PropTypes.string,
  }).isRequired,
  setBasic: PropTypes.func.isRequired,
  logoFile: PropTypes.object,
  setLogoFile: PropTypes.func.isRequired,
  coverFile: PropTypes.object,
  setCoverFile: PropTypes.func.isRequired,
  styles: PropTypes.object.isRequired,
};

export default BasicInfoStep;
