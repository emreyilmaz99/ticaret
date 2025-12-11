// src/pages/admin/Applications/FullApplications/index.jsx
import React from 'react';
import { FaFileExcel, FaPrint } from 'react-icons/fa';
import useFullApplications from '../useFullApplications';
import { styles } from '../styles';
import {
  VendorTable,
  VendorDetailModal,
  ApproveModal,
  RejectModal,
  SearchBar,
  InfoBox
} from '../components';

/**
 * Aktivasyon Bekleyen Satıcılar (Full Applications)
 * Tam başvurusunu tamamlamış ve onay bekleyen satıcılar
 */
const FullApplicationsPage = () => {
  const {
    // Data
    vendors,
    totalVendors,
    commissionPlans,
    isLoading,
    
    // UI State
    hoveredRow,
    setHoveredRow,
    searchTerm,
    setSearchTerm,
    
    // Selected Vendor
    selectedVendor,
    openDetailModal,
    closeDetailModal,
    
    // Approve Modal
    approveModalOpen,
    selectedCommissionPlan,
    setSelectedCommissionPlan,
    handleApproveClick,
    closeApproveModal,
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
  } = useFullApplications();

  // Detail modal açık mı kontrolü
  const isDetailModalOpen = selectedVendor && !rejectModalOpen && !approveModalOpen;

  const handleDownloadExcel = () => {
    alert('Excel indirme özelliği yakında eklenecek');
  };

  const handlePrint = () => {
    alert('Yazdırma özelliği yakında eklenecek');
  };

  return (
    <div style={styles.container}>
      {/* Header - Siparişler sayfasındaki gibi */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Aktivasyon Bekleyen Satıcılar</h1>
          <p style={styles.subtitle}>
            Tam başvurularını tamamlayan satıcıları inceleyin ve onaylayın.<br />
            Onaylanan satıcılar iyzico'ya kaydedilecek ve aktifleştirilecek.
          </p>
        </div>
        <div style={styles.headerActions}>
          <button style={styles.exportBtn} onClick={handlePrint}>
            <FaPrint /> Rapor Yazdır
          </button>
          <button style={styles.exportBtn} onClick={handleDownloadExcel}>
            <FaFileExcel /> Excel İndir
          </button>
        </div>
      </div>

      {/* Info Box */}
      <InfoBox count={totalVendors} message="aktivasyon bekliyor." />

      {/* Search Bar */}
      <SearchBar 
        value={searchTerm}
        onChange={setSearchTerm}
        placeholder="İsim, e-posta, şirket veya vergi no ara..."
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
        showMerchantType={true}
        emptyMessage="Aktivasyon bekleyen satıcı yok"
      />

      {/* Approve Modal - Komisyon Planı Seçimi */}
      <ApproveModal
        isOpen={approveModalOpen}
        vendor={selectedVendor}
        commissionPlans={commissionPlans}
        selectedPlan={selectedCommissionPlan}
        onSelectPlan={setSelectedCommissionPlan}
        onClose={closeApproveModal}
        onSubmit={submitApprove}
        isSubmitting={isApproving}
      />

      {/* Detail Modal */}
      {isDetailModalOpen && (
        <VendorDetailModal
          vendor={selectedVendor}
          onClose={closeDetailModal}
          onApprove={handleApproveClick}
          onReject={handleRejectClick}
          showApproveButton={true}
          showRejectButton={true}
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
        minLength={10}
      />
    </div>
  );
};

export default FullApplicationsPage;
