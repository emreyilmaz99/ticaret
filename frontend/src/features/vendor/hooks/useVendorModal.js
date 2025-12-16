// src/features/vendor/hooks/useVendorModal.js
import { useState, useCallback } from 'react';

export const useVendorModal = () => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState(null);

  const openEditModal = useCallback((vendor) => {
    setSelectedVendor(vendor);
    setIsEditModalOpen(true);
  }, []);

  const closeEditModal = useCallback(() => {
    setIsEditModalOpen(false);
    setSelectedVendor(null);
  }, []);

  const openCategoryModal = useCallback((vendor) => {
    setSelectedVendor(vendor);
    setIsCategoryModalOpen(true);
  }, []);

  const closeCategoryModal = useCallback(() => {
    setIsCategoryModalOpen(false);
    setSelectedVendor(null);
  }, []);

  const closeAllModals = useCallback(() => {
    setIsEditModalOpen(false);
    setIsCategoryModalOpen(false);
    setSelectedVendor(null);
  }, []);

  return {
    // State
    isEditModalOpen,
    isCategoryModalOpen,
    selectedVendor,
    // Actions
    openEditModal,
    closeEditModal,
    openCategoryModal,
    closeCategoryModal,
    closeAllModals,
  };
};
