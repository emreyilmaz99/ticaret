import React from 'react';
import { useVendorRegister } from './useVendorRegister';
import { globalStyles } from './styles';
import {
  RegisterHeader,
  StepIndicator,
  Step1Form,
  Step2Form
} from './components';

/**
 * VendorRegister - Multi-step vendor registration page
 * Collects account and store information for new vendors
 */
const VendorRegister = () => {
  const {
    // State
    step,
    form,
    acceptTerms,
    setAcceptTerms,
    styles,
    
    // Loading
    isSubmitting,
    
    // Validity
    isStep1Valid,
    isStep2Valid,
    
    // Actions
    next,
    back,
    updateField,
    handlePhoneChange,
    handleTaxIdChange,
    handleFocus,
    handleBlur,
    handleSubmit
  } = useVendorRegister();

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <RegisterHeader step={step} styles={styles} />

        <StepIndicator step={step} styles={styles} />

        <form onSubmit={handleSubmit}>
          {step === 1 && (
            <Step1Form
              form={form}
              updateField={updateField}
              onNext={next}
              isValid={isStep1Valid}
              styles={styles}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
          )}

          {step === 2 && (
            <Step2Form
              form={form}
              updateField={updateField}
              onPhoneChange={handlePhoneChange}
              onTaxIdChange={handleTaxIdChange}
              acceptTerms={acceptTerms}
              setAcceptTerms={setAcceptTerms}
              onBack={back}
              isValid={isStep2Valid}
              isSubmitting={isSubmitting}
              styles={styles}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
          )}
        </form>
      </div>
      <style>{globalStyles}</style>
    </div>
  );
};

export default VendorRegister;
