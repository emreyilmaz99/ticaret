// src/pages/admin/Applications/components/modals/VendorDetailModal/ModalFooter.jsx
import React from 'react';
import PropTypes from 'prop-types';
import { FaTimes, FaCheck, FaBan } from 'react-icons/fa';
import { styles } from '../../../styles';

/**
 * Modal Footer Component
 * Displays action buttons (Close, Reject, Approve)
 */
const ModalFooter = React.memo(({
  onClose,
  onApprove,
  onReject,
  showApproveButton,
  showRejectButton,
}) => {
  return (
    <div style={styles.vendorModal.footer}>
      {/* Close Button */}
      <button
        onClick={onClose}
        style={styles.vendorModal.footerButton('default')}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = '#f9fafb';
          e.currentTarget.style.borderColor = '#9ca3af';
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'white';
          e.currentTarget.style.borderColor = '#d1d5db';
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = 'none';
        }}
      >
        <FaTimes />
        Kapat
      </button>

      {/* Reject Button */}
      {showRejectButton && (
        <button
          onClick={onReject}
          style={styles.vendorModal.footerButton('reject')}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 8px 20px rgba(239, 68, 68, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.3)';
          }}
        >
          <FaBan />
          Reddet
        </button>
      )}

      {/* Approve Button */}
      {showApproveButton && (
        <button
          onClick={onApprove}
          style={styles.vendorModal.footerButton('approve')}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 8px 20px rgba(16, 185, 129, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.3)';
          }}
        >
          <FaCheck />
          Onayla
        </button>
      )}
    </div>
  );
});

ModalFooter.displayName = 'ModalFooter';

ModalFooter.propTypes = {
  onClose: PropTypes.func.isRequired,
  onApprove: PropTypes.func,
  onReject: PropTypes.func,
  showApproveButton: PropTypes.bool,
  showRejectButton: PropTypes.bool,
};

ModalFooter.defaultProps = {
  showApproveButton: false,
  showRejectButton: false,
};

export default ModalFooter;
