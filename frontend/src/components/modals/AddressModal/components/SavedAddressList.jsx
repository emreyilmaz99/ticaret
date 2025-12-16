// src/components/modals/AddressModal/components/SavedAddressList.jsx
import React from 'react';
import PropTypes from 'prop-types';
import { FaTrash } from 'react-icons/fa';
import { styles } from '../styles';
import { useHoverEffect } from '../../../../hooks/useHoverEffect';

const SavedAddressList = React.memo(({ addresses, selectedId, onSelect, onDelete }) => {
  const deleteHover = useHoverEffect({ scale: 1.1 });

  if (!addresses || addresses.length === 0) {
    return null;
  }

  return (
    <div style={styles.addressList}>
      {addresses.map((address) => (
        <div
          key={address.id}
          style={styles.addressCard(selectedId === address.id)}
          onClick={() => onSelect(address)}
        >
          <div style={styles.addressCardHeader}>
            <div>
              <div style={styles.addressLabel}>{address.label}</div>
              <div style={styles.addressName}>{address.full_name}</div>
            </div>
            <button
              style={{
                ...styles.deleteButton,
                transform: deleteHover.style.transform,
              }}
              onClick={(e) => {
                e.stopPropagation();
                onDelete(address.id);
              }}
              onMouseEnter={deleteHover.onMouseEnter}
              onMouseLeave={deleteHover.onMouseLeave}
            >
              <FaTrash size={14} />
            </button>
          </div>
          <div style={styles.addressText}>
            {address.neighborhood}, {address.district}/{address.city}
            <br />
            {address.address_line}
          </div>
        </div>
      ))}
    </div>
  );
});

SavedAddressList.displayName = 'SavedAddressList';

SavedAddressList.propTypes = {
  addresses: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      label: PropTypes.string.isRequired,
      full_name: PropTypes.string.isRequired,
      neighborhood: PropTypes.string.isRequired,
      district: PropTypes.string.isRequired,
      city: PropTypes.string.isRequired,
      address_line: PropTypes.string.isRequired,
    })
  ),
  selectedId: PropTypes.number,
  onSelect: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default SavedAddressList;
