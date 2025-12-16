// src/pages/admin/Applications/components/modals/VendorDetailModal/AddressTab.jsx
import React from 'react';
import PropTypes from 'prop-types';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { DetailField, DetailSection } from '../../../shared/components';

/**
 * Address Information Tab for Vendor Detail Modal
 */
const AddressTab = React.memo(({ vendor }) => {
  return (
    <div style={{ animation: 'fadeInContent 0.3s ease' }}>
      <DetailSection title="Adres Bilgileri" icon={<FaMapMarkerAlt />}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '20px',
            marginBottom: '20px',
          }}
        >
          <DetailField label="Şehir" value={vendor.city} />
          <DetailField label="İlçe" value={vendor.district} />
          <DetailField label="Posta Kodu" value={vendor.postal_code} />
        </div>

        <div>
          <label
            style={{
              display: 'block',
              fontSize: '12px',
              fontWeight: '600',
              color: '#6b7280',
              marginBottom: '8px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}
          >
            Detaylı Adres
          </label>
          <div
            style={{
              fontSize: '15px',
              color: '#111827',
              fontWeight: '500',
              padding: '14px 16px',
              background: '#f9fafb',
              borderRadius: '10px',
              border: '1px solid #e5e7eb',
              minHeight: '80px',
              lineHeight: '1.6',
            }}
          >
            {vendor.address || 'Adres bilgisi girilmemiş'}
          </div>
        </div>
      </DetailSection>
    </div>
  );
});

AddressTab.displayName = 'AddressTab';

AddressTab.propTypes = {
  vendor: PropTypes.object.isRequired,
};

export default AddressTab;
