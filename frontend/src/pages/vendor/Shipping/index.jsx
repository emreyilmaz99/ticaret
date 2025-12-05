import React from 'react';
import { FaSpinner } from 'react-icons/fa';
import { useVendorShipping } from './useVendorShipping';
import { styles, globalStyles } from './styles';
import {
  ShippingHeader,
  InfoCard,
  ShippingToggle,
  ShippingFields,
  ShippingPreview,
  ActionButtons
} from './components';

/**
 * VendorShipping - Shipping settings page
 * Allows vendors to configure shipping costs and free shipping threshold
 */
const VendorShipping = () => {
  const {
    // State
    form,
    
    // Loading states
    isLoading,
    isSaving,
    
    // Computed
    previewValues,
    
    // Actions
    handleSubmit,
    handleInputChange,
    toggleShipping,
    resetToDefaults
  } = useVendorShipping();

  // Loading state
  if (isLoading) {
    return (
      <div style={styles.loadingContainer}>
        <FaSpinner style={styles.loadingSpinner} />
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <style>{globalStyles}</style>
      
      <ShippingHeader />
      
      <InfoCard />

      <form onSubmit={handleSubmit}>
        <div style={styles.mainCard}>
          <ShippingToggle 
            isEnabled={form.is_shipping_enabled}
            onToggle={toggleShipping}
          />

          <ShippingFields
            form={form}
            onChange={handleInputChange}
            isEnabled={form.is_shipping_enabled}
          />

          <ShippingPreview
            previewValues={previewValues}
            isEnabled={form.is_shipping_enabled}
          />
        </div>

        <ActionButtons
          onReset={resetToDefaults}
          isSaving={isSaving}
        />
      </form>
    </div>
  );
};

export default VendorShipping;
