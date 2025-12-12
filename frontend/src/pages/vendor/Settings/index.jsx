// src/pages/vendor/Settings/index.jsx
import React from 'react';
import { FaSpinner } from 'react-icons/fa';
import useVendorSettings from './useVendorSettings';
import { styles } from './styles';
import { GeneralTab, AddressTab, BankTab } from './components';

const VendorSettingsPage = () => {
  const {
    // Data
    vendor,
    isLoading,

    // UI State
    activeTab,
    setActiveTab,
    isSaving,

    // Profile Form
    form,
    setForm,
    logoPreview,
    handleLogoChange,
    removeLogo,
    handleProfileSubmit,

    // Address Form
    addressForm,
    setAddressForm,
    editingAddressId,
    handleAddressSubmit,
    editAddress,
    deleteAddress,
    resetAddressForm,
    isAddressSaving,

    // Bank Form
    bankForm,
    setBankForm,
    editingBankId,
    handleBankSubmit,
    editBank,
    deleteBank,
    resetBankForm,
    isBankSaving
  } = useVendorSettings();

  if (isLoading) {
    return (
      <div style={styles.loadingContainer}>
        <FaSpinner className="spin" style={styles.spinner} />
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <style>{styles.globalStyles}</style>

      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Mağaza Ayarları</h1>
          <p style={styles.subtitle}>Mağaza profilinizi ve görünümünüzü özelleştirin</p>
        </div>
      </div>

      {/* Tabs */}
      <div style={styles.tabsContainer}>
        <button
          onClick={() => setActiveTab('general')}
          style={{
            ...styles.tab,
            ...(activeTab === 'general' ? styles.tabActive : {})
          }}
        >
          Genel Bilgiler
        </button>
        <button
          onClick={() => setActiveTab('address')}
          style={{
            ...styles.tab,
            ...(activeTab === 'address' ? styles.tabActive : {})
          }}
        >
          Adresler
        </button>
        <button
          onClick={() => setActiveTab('bank')}
          style={{
            ...styles.tab,
            ...(activeTab === 'bank' ? styles.tabActive : {})
          }}
        >
          Banka Hesapları
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'general' && (
        <GeneralTab
          vendor={vendor}
          form={form}
          setForm={setForm}
          logoPreview={logoPreview}
          handleLogoChange={handleLogoChange}
          removeLogo={removeLogo}
          onSubmit={handleProfileSubmit}
          isSaving={isSaving}
        />
      )}

      {activeTab === 'address' && (
        <AddressTab
          vendor={vendor}
          addressForm={addressForm}
          setAddressForm={setAddressForm}
          editingAddressId={editingAddressId}
          onSubmit={handleAddressSubmit}
          onEdit={editAddress}
          onDelete={deleteAddress}
          onCancel={resetAddressForm}
          isSaving={isAddressSaving}
        />
      )}

      {activeTab === 'bank' && (
        <BankTab
          vendor={vendor}
          bankForm={bankForm}
          setBankForm={setBankForm}
          editingBankId={editingBankId}
          onSubmit={handleBankSubmit}
          onEdit={editBank}
          onDelete={deleteBank}
          onCancel={resetBankForm}
          isSaving={isBankSaving}
        />
      )}
    </div>
  );
};

export default VendorSettingsPage;
