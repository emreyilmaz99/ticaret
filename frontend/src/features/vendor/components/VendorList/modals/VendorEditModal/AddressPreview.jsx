// src/features/vendor/components/VendorList/modals/VendorEditModal/AddressPreview.jsx
import React from 'react';
import PropTypes from 'prop-types';

const AddressPreview = React.memo(({ addresses }) => {
  if (!addresses || addresses.length === 0) {
    return <div style={{ color: '#64748b' }}>Adres bulunmuyor</div>;
  }

  return (
    <div>
      {addresses.map((address, idx) => (
        <div
          key={idx}
          style={{
            padding: '10px',
            border: '1px solid #e6eef8',
            borderRadius: '8px',
            marginBottom: '8px',
          }}
        >
          <div style={{ fontWeight: '600' }}>
            {address.label || `Adres ${idx + 1}`}
            {address.is_primary && ' (Varsayılan)'}
          </div>
          <div style={{ fontSize: '13px', color: '#475569' }}>
            {address.address_line || ''} {address.city || ''} {address.district || ''}
          </div>
        </div>
      ))}
    </div>
  );
});

AddressPreview.displayName = 'AddressPreview';

AddressPreview.propTypes = {
  addresses: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      address_line: PropTypes.string,
      city: PropTypes.string,
      district: PropTypes.string,
      is_primary: PropTypes.bool,
    })
  ),
};

export default AddressPreview;
