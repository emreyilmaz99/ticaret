import React from 'react';
import useVendorOnboarding from './useVendorOnboarding';
import { getStyles } from './styles';
import { BasicInfoStep, AddressStep, BankAccountStep } from './components';

const VendorOnboarding = () => {
  const {
    step,
    setStep,
    loadingSave,
    loadingMe,
    basic,
    setBasic,
    logoFile,
    setLogoFile,
    coverFile,
    setCoverFile,
    address,
    setAddress,
    bank,
    setBank,
    handleSaveBasic,
    handleSaveAddress,
    handleSaveBank,
  } = useVendorOnboarding();

  const styles = getStyles();

  if (loadingMe) {
    return <div style={styles.loadingText}>Yükleniyor...</div>;
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Satıcı Onboarding</h2>
      <p style={styles.stepIndicator}>Adım {step} / 3</p>

      {step === 1 && (
        <>
          <BasicInfoStep
            basic={basic}
            setBasic={setBasic}
            logoFile={logoFile}
            setLogoFile={setLogoFile}
            coverFile={coverFile}
            setCoverFile={setCoverFile}
            styles={styles}
          />
          <div style={styles.buttonGroup}>
            <button onClick={handleSaveBasic} disabled={loadingSave} style={styles.primaryButton}>
              {loadingSave ? 'Kaydediliyor...' : 'Kaydet ve İleri'}
            </button>
          </div>
        </>
      )}

      {step === 2 && (
        <>
          <AddressStep address={address} setAddress={setAddress} styles={styles} />
          <div style={styles.buttonGroup}>
            <button onClick={() => setStep(1)} style={styles.secondaryButton}>
              Geri
            </button>
            <button onClick={handleSaveAddress} disabled={loadingSave} style={styles.primaryButton}>
              {loadingSave ? 'Kaydediliyor...' : 'Adres Kaydet ve İleri'}
            </button>
          </div>
        </>
      )}

      {step === 3 && (
        <>
          <BankAccountStep bank={bank} setBank={setBank} styles={styles} />
          <div style={styles.buttonGroup}>
            <button onClick={() => setStep(2)} style={styles.secondaryButton}>
              Geri
            </button>
            <button onClick={handleSaveBank} disabled={loadingSave} style={styles.primaryButton}>
              {loadingSave ? 'Kaydediliyor...' : 'Banka Hesabını Kaydet'}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default VendorOnboarding;
