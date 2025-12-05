import React from 'react';
import { useFullApplication } from './useFullApplication';
import { styles } from './styles';
import {
  LoadingState,
  ErrorState,
  AccessDeniedState,
  FormHeader,
  BasicInfoSection,
  MerchantTypeSelector,
  MerchantTypeFields,
  AddressSection,
  BankSection,
  FormFooter
} from './components';

/**
 * VendorFullApplication - Complete application form page
 * Collects all required vendor information for iyzico SubMerchant registration
 */
const VendorFullApplication = () => {
  const {
    // State
    form,
    acceptTerms,
    setAcceptTerms,
    
    // Data
    vendorName,
    vendorStatus,
    canSubmit,
    
    // Loading states
    isLoading,
    isSubmitting,
    statusError,
    
    // Validity
    isFormValid,
    
    // Field handlers
    updateField,
    handleCompanyNameChange,
    handleSlugChange,
    handlePhoneChange,
    handleIdentityChange,
    handleTaxIdChange,
    handleIbanChange,
    handleCityChange,
    
    // Input styling
    handleFocus,
    handleBlur,
    
    // Actions
    handleSubmit,
    goToStatus,
    goToLogin
  } = useFullApplication();

  // Loading state
  if (isLoading) {
    return <LoadingState />;
  }

  // Error state
  if (statusError) {
    return <ErrorState onLogin={goToLogin} />;
  }

  // Access denied state
  if (!canSubmit) {
    return <AccessDeniedState statusLabel={vendorStatus} onGoBack={goToStatus} />;
  }

  // Main form
  return (
    <div style={styles.container}>
      <div style={{ ...styles.card, ...styles.cardWide }}>
        <FormHeader vendorName={vendorName} onGoBack={goToStatus} />

        <form onSubmit={handleSubmit}>
          <BasicInfoSection
            form={form}
            updateField={updateField}
            onCompanyNameChange={handleCompanyNameChange}
            onSlugChange={handleSlugChange}
            onPhoneChange={handlePhoneChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />

          <MerchantTypeSelector
            selectedType={form.merchant_type}
            onSelect={(type) => updateField('merchant_type', type)}
          />

          <MerchantTypeFields
            merchantType={form.merchant_type}
            form={form}
            updateField={updateField}
            onIdentityChange={handleIdentityChange}
            onTaxIdChange={handleTaxIdChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />

          <AddressSection
            form={form}
            updateField={updateField}
            onCityChange={handleCityChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />

          <BankSection
            form={form}
            updateField={updateField}
            onIbanChange={handleIbanChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />

          <FormFooter
            acceptTerms={acceptTerms}
            setAcceptTerms={setAcceptTerms}
            isFormValid={isFormValid}
            isSubmitting={isSubmitting}
          />
        </form>
      </div>
    </div>
  );
};

export default VendorFullApplication;
