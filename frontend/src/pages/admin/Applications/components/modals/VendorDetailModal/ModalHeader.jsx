// src/pages/admin/Applications/components/modals/VendorDetailModal/ModalHeader.jsx
import React from 'react';
import PropTypes from 'prop-types';
import { FaTimes, FaStore } from 'react-icons/fa';
import { StatusBadge } from '../../../shared/components';
import { styles } from '../../../styles';

/**
 * Modal Header Component
 * Displays company name, status, and close button
 */
const ModalHeader = React.memo(({ vendor, onClose }) => {
  return (
    <div style={styles.vendorModal.header}>
      {/* Background Pattern */}
      <div style={styles.vendorModal.headerPattern} />

      {/* Content */}
      <div style={styles.vendorModal.headerContent}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {/* Company Name & Icon */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={styles.vendorModal.companyIcon}>
              <FaStore style={{ color: 'white' }} />
            </div>
            <div>
              <h2 style={styles.vendorModal.companyName}>
                {vendor.company_name || vendor.storeName}
              </h2>
              <div style={{ marginTop: '6px' }}>
                <StatusBadge 
                  status={vendor.status}
                  style={{
                    background: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid rgba(255, 255, 255, 0.5)',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                  }}
                />
              </div>
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            style={styles.vendorModal.closeButton}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <FaTimes style={{ color: 'white', fontSize: '20px' }} />
          </button>
        </div>
      </div>
    </div>
  );
});

ModalHeader.displayName = 'ModalHeader';

ModalHeader.propTypes = {
  vendor: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ModalHeader;
