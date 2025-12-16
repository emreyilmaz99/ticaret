// src/pages/admin/Applications/VendorApplications/index.jsx
import React from 'react';
import useVendorApplications from '../useVendorApplications';
import { styles } from '../styles';
import { useToast } from '../../../../components/common/Toast';
import {
  ApplicationTabs,
  SearchBar,
  StatsCards,
  PreApplicationTable,
  VendorTable,
  VendorDetailModal,
  PreApplicationDetailModal,
  ApproveModal,
  RejectModal
} from '../components';

/**
 * Vendor Applications - Birleşik Başvuru Yönetimi
 * Hem Pre Applications hem de Full Applications'u yönetir
 */
const VendorApplicationsPage = () => {
  const toast = useToast();
  
  const {
    // Tab State
    activeTab,
    handleTabChange,
    
    // Data
    applications,
    allApplications,
    vendors,
    allVendors,
    commissionPlans,
    isLoading,
    
    // Stats
    preStats,
    vendorStats,
    
    // Search & Filter
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    hoveredRow,
    setHoveredRow,
    
    // Selected Items
    selectedApp,
    selectedVendor,
    
    // Detail Modal
    detailModalOpen,
    openDetailModal,
    closeDetailModal,
    
    // Approve Modal
    approveModalOpen,
    selectedCommissionPlan,
    setSelectedCommissionPlan,
    closeApproveModal,
    
    // Pre Application handlers
    handleApprovePreClick,
    submitApprovePre,
    isApprovingPre,
    
    // Vendor handlers
    handleApproveVendorClick,
    submitApproveVendor,
    isApprovingVendor,
    
    // Reject Modal
    rejectModalOpen,
    rejectionReason,
    setRejectionReason,
    closeRejectModal,
    
    // Pre Application reject
    handleRejectPreClick,
    submitRejectPre,
    isRejectingPre,
    
    // Vendor reject
    handleRejectVendorClick,
    submitRejectVendor,
    isRejectingVendor,
  } = useVendorApplications();

  // Email kopyalama
  const handleCopyEmail = (email) => {
    navigator.clipboard.writeText(email);
    toast.success('Kopyalandı', 'E-posta adresi panoya kopyalandı.');
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>📋 Satıcı Başvuruları</h1>
          <p style={styles.subtitle}>
            Ön başvuruları inceleyin ve onaylayın, aktivasyon bekleyen satıcıları aktifleştirin.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <ApplicationTabs
        activeTab={activeTab}
        onTabChange={handleTabChange}
        preCount={preStats.pending}
        fullCount={vendorStats.total}
      />

      {/* Pre Applications Tab */}
      {activeTab === 'pre' && (
        <>
          {/* Stats */}
          <StatsCards
            stats={preStats}
            activeFilter={statusFilter}
            onFilterChange={setStatusFilter}
          />

          {/* Search */}
          <SearchBar 
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="İsim, e-posta, şirket veya telefon ara..."
          />

          {/* Table */}
          <PreApplicationTable
            applications={applications}
            isLoading={isLoading}
            searchTerm={searchTerm}
            hoveredRow={hoveredRow}
            setHoveredRow={setHoveredRow}
            onView={openDetailModal}
            onApprove={handleApprovePreClick}
            onReject={handleRejectPreClick}
            onCopyEmail={handleCopyEmail}
          />
        </>
      )}

      {/* Full Applications Tab */}
      {activeTab === 'full' && (
        <>
          {/* Info */}
          <div style={{ 
            background: '#f0fdf4', 
            padding: '16px 20px', 
            borderRadius: '12px', 
            marginBottom: '24px',
            border: '1px solid #86efac',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <span style={{ fontSize: '20px' }}>⏳</span>
            <div style={{ fontSize: '14px', color: '#065f46' }}>
              <strong>Toplam {vendorStats.total} satıcı</strong> aktivasyon bekliyor.
            </div>
          </div>

          {/* Search */}
          <SearchBar 
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="İsim, e-posta, şirket veya telefon ara..."
          />

          {/* Table */}
          <VendorTable
            vendors={vendors}
            isLoading={isLoading}
            searchTerm={searchTerm}
            hoveredRow={hoveredRow}
            setHoveredRow={setHoveredRow}
            onView={openDetailModal}
            onApprove={handleApproveVendorClick}
            onReject={handleRejectVendorClick}
            showMerchantType={true}
            emptyMessage="Aktivasyon bekleyen satıcı yok"
          />
        </>
      )}

      {/* Approve Modal - Pre Application */}
      {activeTab === 'pre' && approveModalOpen && selectedApp && (
        <div style={styles.modalOverlay} onClick={closeApproveModal}>
          <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2 style={{margin: 0, fontSize: '20px', fontWeight: '700', color: '#064e3b'}}>
                ✅ Ön Başvuruyu Onayla
              </h2>
            </div>
            <div style={styles.modalBody}>
              <p style={{ marginBottom: '16px', lineHeight: '1.6', color: '#374151' }}>
                <strong>{selectedApp.full_name}</strong> için ön başvuruyu onaylamak üzeresiniz.
              </p>
              <div style={{ 
                background: '#f0fdf4', 
                padding: '16px', 
                borderRadius: '12px', 
                border: '1px solid #d1fae5',
                fontSize: '14px',
                color: '#065f46'
              }}>
                ✓ Satıcı hesabı oluşturulacak<br />
                ✓ Satıcıya e-posta gönderilecek<br />
                ✓ Tam başvuru formu doldurabilecek
              </div>
            </div>
            <div style={styles.modalFooter}>
              <button 
                onClick={closeApproveModal} 
                style={{
                  padding: '12px 24px', 
                  borderRadius: '10px', 
                  border: '2px solid #e5e7eb', 
                  background: 'white', 
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '14px',
                  color: '#6b7280'
                }}
              >
                İptal
              </button>
              <button 
                onClick={submitApprovePre}
                disabled={isApprovingPre}
                style={{
                  padding: '12px 24px', 
                  borderRadius: '10px', 
                  border: 'none', 
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', 
                  color: 'white', 
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '14px',
                  boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                  opacity: isApprovingPre ? 0.7 : 1
                }}
              >
                {isApprovingPre ? 'Onaylanıyor...' : 'Onayla'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Approve Modal - Vendor (Full Application) */}
      {activeTab === 'full' && (
        <ApproveModal
          isOpen={approveModalOpen}
          vendor={selectedVendor}
          commissionPlans={commissionPlans}
          selectedPlan={selectedCommissionPlan}
          onSelectPlan={setSelectedCommissionPlan}
          onClose={closeApproveModal}
          onSubmit={submitApproveVendor}
          isSubmitting={isApprovingVendor}
        />
      )}

      {/* Reject Modal */}
      <RejectModal
        isOpen={rejectModalOpen}
        vendor={activeTab === 'pre' ? selectedApp : selectedVendor}
        reason={rejectionReason}
        onReasonChange={setRejectionReason}
        onClose={closeRejectModal}
        onSubmit={activeTab === 'pre' ? submitRejectPre : submitRejectVendor}
        isSubmitting={activeTab === 'pre' ? isRejectingPre : isRejectingVendor}
        minLength={10}
      />

      {/* Detail Modal - Pre Application */}
      {activeTab === 'pre' && detailModalOpen && selectedApp && (
        <VendorDetailModal
          vendor={selectedApp}
          onClose={closeDetailModal}
          onApprove={() => {
            closeDetailModal();
            handleApprovePreClick(selectedApp);
          }}
          onReject={() => {
            closeDetailModal();
            handleRejectPreClick(selectedApp);
          }}
          showApproveButton={selectedApp.status === 'pending'}
          showRejectButton={selectedApp.status === 'pending'}
        />
      )}

      {/* Detail Modal - Full Application (Vendor) */}
      {activeTab === 'full' && detailModalOpen && selectedVendor && (
        <VendorDetailModal
          vendor={selectedVendor}
          onClose={closeDetailModal}
          onApprove={() => {
            closeDetailModal();
            handleApproveVendorClick(selectedVendor);
          }}
          onReject={() => {
            closeDetailModal();
            handleRejectVendorClick(selectedVendor);
          }}
          showApproveButton={true}
          showRejectButton={true}
        />
      )}
    </div>
  );
};

export default VendorApplicationsPage;
