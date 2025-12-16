// src/pages/admin/Applications/components/modals/VendorDetailModal/index.jsx
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ModalHeader from './ModalHeader';
import TabNavigation from './TabNavigation';
import GeneralTab from './GeneralTab';
import AddressTab from './AddressTab';
import BankTab from './BankTab';
import ModalFooter from './ModalFooter';
import { styles, modalAnimations } from '../../../styles';

/**
 * Vendor Detail Modal - Main Component
 * Displays full vendor application details with tabs
 */
const VendorDetailModal = React.memo(({
  vendor,
  onClose,
  onApprove,
  onReject,
  showApproveButton = false,
  showRejectButton = false,
}) => {
  const [activeTab, setActiveTab] = useState('general');

  // Handle overlay click
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Render active tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return <GeneralTab vendor={vendor} />;
      case 'address':
        return <AddressTab vendor={vendor} />;
      case 'bank':
        return <BankTab vendor={vendor} />;
      default:
        return <GeneralTab vendor={vendor} />;
    }
  };

  return (
    <div onClick={handleOverlayClick} style={styles.vendorModal.overlay}>
      <div style={styles.vendorModal.content}>
        {/* Header */}
        <ModalHeader vendor={vendor} onClose={onClose} />

        {/* Tab Navigation */}
        <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Content */}
        <div style={styles.vendorModal.bodyContent}>
          {renderTabContent()}
        </div>

        {/* Footer */}
        <ModalFooter
          onClose={onClose}
          onApprove={onApprove}
          onReject={onReject}
          showApproveButton={showApproveButton}
          showRejectButton={showRejectButton}
        />
      </div>

      {/* CSS Animations */}
      <style>{modalAnimations}</style>
    </div>
  );
});

VendorDetailModal.displayName = 'VendorDetailModal';

VendorDetailModal.propTypes = {
  vendor: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  onApprove: PropTypes.func,
  onReject: PropTypes.func,
  showApproveButton: PropTypes.bool,
  showRejectButton: PropTypes.bool,
};

export default VendorDetailModal;
