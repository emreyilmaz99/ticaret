// src/features/vendor/components/VendorList/index.jsx
import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getVendors } from '../../api/vendorApi';
import { useVendorFilters } from '../../hooks/useVendorFilters';
import { useVendorModal } from '../../hooks/useVendorModal';
import { useVendorMutations } from '../../hooks/useVendorMutations';
import VendorFilters from './VendorFilters';
import VendorTable from './VendorTable';
import VendorEditModal from './modals/VendorEditModal';
import VendorCategoryModal from '../../../admin/components/VendorCategoryModal';
import { VENDOR_STATUS, VENDOR_MODES } from '../../shared/constants';
import { styles } from '../../shared/styles';

const VendorList = React.memo(({ mode = VENDOR_MODES.ALL }) => {
  const queryClient = useQueryClient();
  const isActiveMode = mode === VENDOR_MODES.ACTIVE_ONLY;

  // Custom hooks
  const {
    currentPage,
    itemsPerPage,
    searchTerm,
    activeTab,
    handlePageChange,
    handleSearchChange,
    handleTabChange,
  } = useVendorFilters();

  const {
    isEditModalOpen,
    isCategoryModalOpen,
    selectedVendor,
    openEditModal,
    closeEditModal,
    openCategoryModal,
    closeCategoryModal,
  } = useVendorModal();

  const { updateStatusMutation } = useVendorMutations();

  // React Query - fetch vendors
  const queryKey = isActiveMode ? ['active-vendors', currentPage] : ['vendors', currentPage];
  
  const { data: responseData, isLoading } = useQuery({
    queryKey,
    queryFn: async () => {
      const params = {
        page: currentPage,
        per_page: itemsPerPage,
      };
      
      if (isActiveMode) {
        params.status = VENDOR_STATUS.ACTIVE;
      } else if (activeTab !== 'all') {
        params.status = activeTab;
      }

      const response = await getVendors(params);
      return response.data;
    },
    keepPreviousData: true,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const vendors = responseData?.data || [];
  const meta = responseData?.meta || {};

  // Handlers
  const handleApprove = useCallback(
    (vendor) => {
      updateStatusMutation.mutate({ id: vendor.id, status: VENDOR_STATUS.ACTIVE });
    },
    [updateStatusMutation]
  );

  const handleReject = useCallback(
    (vendor) => {
      updateStatusMutation.mutate({ id: vendor.id, status: VENDOR_STATUS.REJECTED });
    },
    [updateStatusMutation]
  );

  const handleBan = useCallback(
    (vendor) => {
      updateStatusMutation.mutate({ id: vendor.id, status: VENDOR_STATUS.BANNED });
    },
    [updateStatusMutation]
  );

  if (isLoading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingContainer}>Yükleniyor...</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <VendorFilters
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        showTabs={!isActiveMode}
        title={isActiveMode ? 'Aktif Satıcılar' : undefined}
      />

      <VendorTable
        vendors={vendors}
        isLoading={isLoading}
        searchTerm={searchTerm}
        meta={meta}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        onPageChange={handlePageChange}
        onEdit={openEditModal}
        onApprove={handleApprove}
        onReject={handleReject}
        onBan={handleBan}
        onCategory={openCategoryModal}
        showCategoryButton={isActiveMode}
      />

      {isEditModalOpen && selectedVendor && (
        <VendorEditModal
          vendor={selectedVendor}
          isOpen={isEditModalOpen}
          onClose={closeEditModal}
        />
      )}

      {isActiveMode && isCategoryModalOpen && selectedVendor && (
        <VendorCategoryModal
          isOpen={isCategoryModalOpen}
          onClose={closeCategoryModal}
          vendor={selectedVendor}
        />
      )}
    </div>
  );
});

VendorList.displayName = 'VendorList';

VendorList.propTypes = {
  mode: PropTypes.oneOf([VENDOR_MODES.ALL, VENDOR_MODES.ACTIVE_ONLY]),
};

export default VendorList;
