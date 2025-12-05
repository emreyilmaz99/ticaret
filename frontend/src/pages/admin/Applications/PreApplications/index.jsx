// src/pages/admin/Applications/PreApplications/index.jsx
import React from 'react';
import usePreApplications from '../usePreApplications';
import { styles } from '../styles';
import Pagination from '../../../../components/ui/Pagination';
import {
  VendorTable,
  PreApplicationDetailModal,
  RejectModal,
  SearchBar,
  InfoBox
} from '../components';

/**
 * Ön Başvurular Sayfası
 * pre_pending durumundaki satıcıları listeler
 */
const PreApplicationsPage = () => {
  const {
    // Data
    vendors,
    allVendors,
    meta,
    isLoading,
    
    // Pagination & Filter
    currentPage,
    setCurrentPage,
    perPage,
    searchTerm,
    setSearchTerm,
    
    // UI State
    hoveredRow,
    setHoveredRow,
    
    // Detail Modal
    selectedVendor,
    isDetailModalOpen,
    activeTab,
    setActiveTab,
    adminNote,
    setAdminNote,
    openDetailModal,
    closeDetailModal,
    
    // Approve
    handleApproveClick,
    submitApprove,
    isApproving,
    
    // Reject Modal
    rejectModalOpen,
    rejectionReason,
    setRejectionReason,
    handleRejectClick,
    closeRejectModal,
    submitReject,
    isRejecting
  } = usePreApplications();

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>📋 Ön Başvurular</h1>
          <p style={styles.subtitle}>
            Satıcı olmak için ön başvuru yapan kişileri inceleyin.<br />
            Onaylanan başvurular tam başvuru formunu doldurmaya yönlendirilir.
          </p>
        </div>
      </div>

      {/* Info Box */}
      <InfoBox count={allVendors.length} message="ön başvuru bekliyor." />

      {/* Search Bar */}
      <SearchBar 
        value={searchTerm}
        onChange={setSearchTerm}
        placeholder="Mağaza adı, yetkili veya e-posta ara..."
      />

      {/* Table */}
      <VendorTable
        vendors={vendors}
        isLoading={isLoading}
        searchTerm={searchTerm}
        hoveredRow={hoveredRow}
        setHoveredRow={setHoveredRow}
        onView={openDetailModal}
        onApprove={handleApproveClick}
        onReject={handleRejectClick}
        showMerchantType={false}
        emptyMessage="Ön başvuru bekleyen satıcı yok"
      />

      {/* Pagination */}
      {meta && meta.last_page > 1 && (
        <div style={{ marginTop: '16px' }}>
          <Pagination
            currentPage={currentPage}
            totalPages={meta.last_page}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      {/* Detail Modal with Tabs */}
      {isDetailModalOpen && selectedVendor && (
        <PreApplicationDetailModal
          vendor={selectedVendor}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          adminNote={adminNote}
          setAdminNote={setAdminNote}
          onClose={closeDetailModal}
          onApprove={() => submitApprove()}
          onReject={handleRejectClick}
          isApproving={isApproving}
          isRejecting={isRejecting}
        />
      )}

      {/* Reject Modal */}
      <RejectModal
        isOpen={rejectModalOpen}
        vendor={selectedVendor}
        reason={rejectionReason}
        onReasonChange={setRejectionReason}
        onClose={closeRejectModal}
        onSubmit={submitReject}
        isSubmitting={isRejecting}
        minLength={5}
      />
    </div>
  );
};

export default PreApplicationsPage;
