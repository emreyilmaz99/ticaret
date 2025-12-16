import React from 'react';
import { useVendorStatus } from './useVendorStatus';
import { styles, globalStyles } from './styles';
import {
  LoadingState,
  ErrorState,
  StatusHeader,
  RejectionWarning,
  StatusDetails,
  ActionButton
} from './components';

/**
 * VendorStatusPage - Shows vendor application status
 * Displays current status, rejection warnings, and action buttons
 */
const VendorStatusPage = () => {
  const {
    // Data
    status,
    config,
    showRejection,
    
    // Loading & Error
    isLoading,
    error,
    
    // Actions
    handleAction
  } = useVendorStatus();

  // Loading state
  if (isLoading) {
    return <LoadingState />;
  }

  // Error state
  if (error) {
    return <ErrorState error={error} />;
  }

  return (
    <div style={styles.container}>
      <div style={styles.wrapper}>
        {/* Main Status Card */}
        <div style={{
          ...styles.card,
          ...(config.border && { border: config.border })
        }}>
          <StatusHeader config={config} />

          <div style={styles.content}>
            {showRejection && (
              <RejectionWarning reason={status.latest_rejection_reason} />
            )}

            <StatusDetails status={status} config={config} />

            {config.showAction && (
              <ActionButton 
                text={config.actionText} 
                onClick={handleAction} 
              />
            )}
          </div>
        </div>

        {/* Help Text */}
        <p style={styles.helpText}>
          Sorularınız mı var?{' '}
          <a href="mailto:destek@example.com" style={styles.helpLink}>
            Destek ile iletişime geçin
          </a>
        </p>
      </div>

      <style>{globalStyles}</style>
    </div>
  );
};

export default VendorStatusPage;
