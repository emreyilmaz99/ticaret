// src/components/modals/AddressModal/index.jsx
import React, { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  ModalOverlay,
  ModalContainer,
  ModalHeader,
  ModalCloseButton,
} from '../shared';
import SavedAddressList from './components/SavedAddressList';
import AddressFormFields from './components/AddressFormFields';
import { useAddressForm } from './hooks/useAddressForm';
import { useAddressValidation } from './hooks/useAddressValidation';
import { useHoverEffect } from '../../../hooks/useHoverEffect';
import { styles } from './styles';

const AddressModal = React.memo(({
  isOpen,
  onClose,
  onSave,
  onDelete,
  addresses = [],
  initialAddress = null,
  user,
  mode = 'new',
}) => {
  const {
    formData,
    updateField,
    handleCityChange,
    handleDistrictChange,
    loadAddress,
    resetForm,
  } = useAddressForm(initialAddress, user);

  const { validateForm, formatPhone, formatIdentityNumber } = useAddressValidation();

  const [validationErrors, setValidationErrors] = React.useState([]);

  const saveHover = useHoverEffect({ scale: 1.02 });
  const cancelHover = useHoverEffect({ scale: 1.02 });
  const closeHover = useHoverEffect({ scale: 1.1 });

  const handleSave = useCallback(() => {
    const { isValid, errors } = validateForm(formData);

    if (!isValid) {
      setValidationErrors(errors);
      return;
    }

    setValidationErrors([]);

    const addressData = {
      full_name: formData.fullName,
      phone: formData.phone,
      city: formData.city,
      district: formData.district,
      neighborhood: formData.neighborhood,
      postal_code: formData.postalCode,
      address_line: formData.addressLine,
      label: formData.addressLabel,
    };

    if (formData.selectedId) {
      addressData.id = formData.selectedId;
    }

    onSave(addressData);
    onClose();
  }, [formData, validateForm, onSave, onClose]);

  const handleAddressSelect = useCallback(
    (address) => {
      loadAddress(address);
    },
    [loadAddress]
  );

  const handleDelete = useCallback(
    (addressId) => {
      if (window.confirm('Bu adresi silmek istediğinizden emin misiniz?')) {
        onDelete(addressId);
        if (formData.selectedId === addressId) {
          resetForm();
        }
      }
    },
    [onDelete, formData.selectedId, resetForm]
  );

  const handleOverlayClick = useCallback(() => {
    onClose();
  }, [onClose]);

  const hasErrors = useMemo(() => validationErrors.length > 0, [validationErrors.length]);

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={handleOverlayClick}>
      <ModalContainer width="800px" onClick={(e) => e.stopPropagation()}>
        <ModalHeader 
          title={mode === 'edit' ? 'Adresi Düzenle' : 'Yeni Adres Ekle'}
          icon="📍"
        />

        <ModalCloseButton
          onClose={onClose}
          hoverStyle={closeHover.style}
          onMouseEnter={closeHover.onMouseEnter}
          onMouseLeave={closeHover.onMouseLeave}
        />

        <div style={styles.scrollContainer}>
          {mode === 'new' && addresses.length > 0 && (
            <SavedAddressList
              addresses={addresses}
              selectedId={formData.selectedId}
              onSelect={handleAddressSelect}
              onDelete={handleDelete}
            />
          )}

          {hasErrors && (
            <div style={styles.errorBox}>
              <ul style={styles.errorList}>
                {validationErrors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          <AddressFormFields
            formData={formData}
            onFieldChange={updateField}
            onCityChange={handleCityChange}
            onDistrictChange={handleDistrictChange}
            formatPhone={formatPhone}
            formatIdentityNumber={formatIdentityNumber}
          />

          <div style={styles.buttonGroup}>
            <button
              style={{
                ...styles.actionButton('secondary'),
                transform: cancelHover.style.transform,
              }}
              onClick={onClose}
              onMouseEnter={cancelHover.onMouseEnter}
              onMouseLeave={cancelHover.onMouseLeave}
            >
              İptal
            </button>
            <button
              style={{
                ...styles.actionButton('primary'),
                transform: saveHover.style.transform,
              }}
              onClick={handleSave}
              onMouseEnter={saveHover.onMouseEnter}
              onMouseLeave={saveHover.onMouseLeave}
            >
              Kaydet
            </button>
          </div>
        </div>
      </ModalContainer>
    </ModalOverlay>
  );
});

AddressModal.displayName = 'AddressModal';

AddressModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  addresses: PropTypes.array,
  initialAddress: PropTypes.object,
  user: PropTypes.object,
  mode: PropTypes.oneOf(['new', 'edit']),
};

export default AddressModal;
