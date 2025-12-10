// src/pages/vendor/Products/components/ProductModal.jsx
import React from 'react';
import ModalHeader from './modal/ModalHeader';
import ModalTabs from './modal/ModalTabs';
import GeneralTab from './modal/GeneralTab';
import PricingTab from './modal/PricingTab';
import MediaTab from './modal/MediaTab';
import VariantsTab from './modal/VariantsTab';
import SettingsTab from './modal/SettingsTab';
import ModalFooter from './modal/ModalFooter';
import { styles } from '../styles';

const ProductModal = ({
  isOpen,
  mode,
  activeTab,
  setActiveTab,
  formData,
  setFormData,
  groupedCategories,
  units,
  taxClasses,
  selectedProduct,
  tagInput,
  setTagInput,
  onClose,
  onSubmit,
  handleImageChange,
  removeImage,
  handleVariantChange,
  addVariant,
  removeVariant,
  addTag,
  removeTag,
  removeLastTag,
  deletePhotoMutation,
  toFullUrl,
  onImageClick,
  openConfirmModal,
  isSubmitting
}) => {
  if (!isOpen) return null;

  const readOnly = mode === 'view';

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return (
          <GeneralTab
            formData={formData}
            setFormData={setFormData}
            groupedCategories={groupedCategories}
            taxClasses={taxClasses}
            readOnly={readOnly}
          />
        );
      case 'pricing':
        return (
          <PricingTab
            formData={formData}
            setFormData={setFormData}
            units={units}
            readOnly={readOnly}
          />
        );
      case 'media':
        return (
          <MediaTab
            formData={formData}
            handleImageChange={handleImageChange}
            removeImage={removeImage}
            selectedProduct={selectedProduct}
            deletePhotoMutation={deletePhotoMutation}
            toFullUrl={toFullUrl}
            onImageClick={onImageClick}
            openConfirmModal={openConfirmModal}
            readOnly={readOnly}
          />
        );
      case 'variants':
        return (
          <VariantsTab
            formData={formData}
            handleVariantChange={handleVariantChange}
            addVariant={addVariant}
            removeVariant={removeVariant}
            units={units}
            readOnly={readOnly}
          />
        );
      case 'settings':
        return (
          <SettingsTab
            formData={formData}
            setFormData={setFormData}
            tagInput={tagInput}
            setTagInput={setTagInput}
            addTag={addTag}
            removeTag={removeTag}
            removeLastTag={removeLastTag}
            readOnly={readOnly}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <ModalHeader mode={mode} onClose={onClose} />
        
        <ModalTabs 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
          formType={formData.type}
        />
        
        <div style={styles.modalBody}>
          {renderTabContent()}
        </div>
        
        <ModalFooter
          mode={mode}
          onClose={onClose}
          onSubmit={onSubmit}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
};

export default ProductModal;
