import React from 'react';
import { FaPlus, FaFilter, FaExclamationTriangle } from 'react-icons/fa';
import { useFeaturedDeals } from './useFeaturedDeals';
import DealFormModal from './DealFormModal';
import DealCard from './DealCard';

const FeaturedDealsPage = () => {
  const {
    deals,
    stats,
    products,
    isLoading,
    filterStatus,
    setFilterStatus,
    currentPage,
    totalPages,
    setCurrentPage,
    totalDeals,
    isModalOpen,
    modalMode,
    selectedDeal,
    openCreateModal,
    openEditModal,
    closeModal,
    handleSubmit,
    handleDelete,
    handleToggle,
    isCreating,
    isUpdating,
    isDeleting,
    isToggling,
    togglingId,
    deletingId,
    refetchDeals,
    deleteConfirmId,
    confirmDelete,
    cancelDelete,
  } = useFeaturedDeals();

  const filterOptions = [
    { value: 'all', label: 'Tümü', count: stats.total || 0 },
    { value: 'active', label: 'Aktif', count: stats.active || 0 },
    { value: 'current', label: 'Şu Anda Geçerli', count: stats.current || 0 },
    { value: 'upcoming', label: 'Yaklaşan', count: stats.upcoming || 0 },
    { value: 'expired', label: 'Süresi Dolmuş', count: stats.expired || 0 },
    { value: 'inactive', label: 'Pasif', count: stats.inactive || 0 },
  ];

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Öne Çıkan Ürünler</h1>
          <p style={styles.subtitle}>Anasayfa carousel'inde gösterilecek kampanyalı ürünleri yönetin</p>
        </div>
        <button onClick={openCreateModal} style={styles.btnPrimary}>
          <FaPlus size={14} /> Yeni Kampanya
        </button>
      </div>

      {/* Stats Cards */}
      <div style={styles.statsGrid}>
        <StatCard
          label="Toplam Kampanya"
          value={stats.total || 0}
          color="#3b82f6"
          filterValue="all"
          isActive={filterStatus === 'all'}
          onClick={() => setFilterStatus('all')}
        />
        <StatCard
          label="Aktif"
          value={stats.active || 0}
          color="#059669"
          filterValue="active"
          isActive={filterStatus === 'active'}
          onClick={() => setFilterStatus('active')}
        />
        <StatCard
          label="Şu Anda Geçerli"
          value={stats.current || 0}
          color="#8b5cf6"
          filterValue="current"
          isActive={filterStatus === 'current'}
          onClick={() => setFilterStatus('current')}
        />
        <StatCard
          label="Pasif"
          value={stats.inactive || 0}
          color="#ef4444"
          filterValue="inactive"
          isActive={filterStatus === 'inactive'}
          onClick={() => setFilterStatus('inactive')}
        />
      </div>

      {/* Filter Tabs */}
      <div style={styles.filterContainer}>
        <div style={styles.filterTabs}>
          {filterOptions.map(option => (
            <button
              key={option.value}
              onClick={() => setFilterStatus(option.value)}
              style={{
                ...styles.filterTab,
                ...(filterStatus === option.value ? styles.filterTabActive : {}),
              }}
            >
              {option.label}
              <span style={styles.filterBadge}>{option.count}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Deals List */}
      {isLoading ? (
        <div style={styles.loading}>
          <div style={styles.spinner}></div>
          <p>Yükleniyor...</p>
        </div>
      ) : deals.length === 0 ? (
        <div style={styles.empty}>
          <FaFilter size={48} color="#d1d5db" />
          <p style={styles.emptyText}>Henüz kampanya oluşturulmadı</p>
          <button onClick={openCreateModal} style={styles.btnSecondary}>
            <FaPlus size={14} /> İlk Kampanyayı Oluştur
          </button>
        </div>
      ) : (
        <>
          <div style={styles.dealsGrid}>
            {deals.map((deal) => (
              <DealCard
                key={deal.id}
                deal={deal}
                onEdit={() => openEditModal(deal)}
                onDelete={() => handleDelete(deal.id)}
                onToggle={() => handleToggle(deal.id)}
                isDeleting={deletingId === deal.id}
                isToggling={togglingId === deal.id}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={styles.pagination}>
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                style={{
                  ...styles.paginationButton,
                  ...(currentPage === 1 ? styles.paginationButtonDisabled : {})
                }}
              >
                Önceki
              </button>
              
              <div style={styles.paginationNumbers}>
                {[...Array(totalPages)].map((_, index) => {
                  const pageNum = index + 1;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      style={{
                        ...styles.paginationNumber,
                        ...(currentPage === pageNum ? styles.paginationNumberActive : {})
                      }}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                style={{
                  ...styles.paginationButton,
                  ...(currentPage === totalPages ? styles.paginationButtonDisabled : {})
                }}
              >
                Sonraki
              </button>
            </div>
          )}
        </>
      )}

      {/* Modal */}
      <DealFormModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={handleSubmit}
        mode={modalMode}
        deal={selectedDeal}
        deals={deals}
        products={products}
        isSubmitting={isCreating || isUpdating}
      />

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div style={styles.deleteModalOverlay}>
          <div style={styles.deleteModal}>
            <div style={styles.deleteModalIcon}>
              <FaExclamationTriangle size={48} color="#ef4444" />
            </div>
            <h3 style={styles.deleteModalTitle}>Silmek istediğinize emin misiniz?</h3>
            <p style={styles.deleteModalText}>
              Bu öne çıkan ürünü silmek üzeresiniz. Bu işlem geri alınamaz!
            </p>
            <div style={styles.deleteModalActions}>
              <button
                onClick={cancelDelete}
                style={styles.deleteModalCancelBtn}
              >
                Vazgeç
              </button>
              <button
                onClick={confirmDelete}
                disabled={isDeleting}
                style={styles.deleteModalConfirmBtn}
              >
                {isDeleting ? '⏳ Siliniyor...' : '🗑️ Evet, Sil'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const StatCard = ({ label, value, color, filterValue, isActive, onClick }) => (
  <div 
    onClick={onClick}
    style={{
      ...styles.statCard,
      backgroundColor: 'white',
      cursor: 'pointer',
      border: isActive ? `2px solid ${color}` : '1px solid #e2e8f0',
      transform: isActive ? 'translateY(-2px)' : 'none',
      boxShadow: isActive ? `0 4px 12px ${color}40` : '0 1px 3px rgba(0,0,0,0.1)',
      transition: 'all 0.2s ease'
    }}
    onMouseEnter={(e) => {
      if (!isActive) {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
      }
    }}
    onMouseLeave={(e) => {
      if (!isActive) {
        e.currentTarget.style.transform = 'none';
        e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
      }
    }}
  >
    <p style={styles.statLabel}>{label}</p>
    <p style={{ ...styles.statValue, color }}>{value}</p>
  </div>
);

const styles = {
  container: {
    padding: '32px',
    fontFamily: "'Inter', sans-serif",
    color: '#1e293b',
    backgroundColor: '#F3F4F6',
    minHeight: '100vh',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '32px',
    background: 'linear-gradient(135deg, rgb(248, 250, 252) 0%, rgb(241, 245, 249) 100%)',
    padding: '28px 32px',
    borderRadius: '16px',
    border: '1px solid rgb(226, 232, 240)',
    flexWrap: 'wrap',
    gap: '24px'
  },
  title: {
    fontSize: '26px',
    fontWeight: '800',
    color: 'rgb(15, 23, 42)',
    letterSpacing: '-0.02em',
    margin: 0
  },
  subtitle: {
    color: 'rgb(100, 116, 139)',
    fontSize: '15px',
    margin: '6px 0 0 0',
  },
  btnPrimary: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 24px',
    backgroundColor: '#059669',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    fontWeight: '600',
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    boxShadow: '0 4px 12px rgba(5, 150, 105, 0.3)',
  },
  btnSecondary: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 20px',
    backgroundColor: 'white',
    color: '#059669',
    border: '2px solid #059669',
    borderRadius: '8px',
    fontWeight: '600',
    fontSize: '14px',
    cursor: 'pointer',
    marginTop: '16px',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px',
    marginBottom: '32px',
  },
  statCard: {
    padding: '20px',
    borderRadius: '12px',
    border: '1px solid #e5e7eb',
  },
  statLabel: {
    fontSize: '13px',
    color: '#6b7280',
    fontWeight: '500',
    marginBottom: '8px',
  },
  statValue: {
    fontSize: '28px',
    fontWeight: '700',
  },
  filterContainer: {
    marginBottom: '24px',
  },
  filterTabs: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
    backgroundColor: 'white',
    padding: '8px',
    borderRadius: '12px',
    border: '1px solid #e5e7eb',
  },
  filterTab: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 16px',
    backgroundColor: 'transparent',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500',
    color: '#6b7280',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  filterTabActive: {
    backgroundColor: '#059669',
    color: 'white',
  },
  filterBadge: {
    padding: '2px 8px',
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '600',
  },
  dealsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '20px',
  },
  loading: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '64px 0',
    color: '#6b7280',
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '4px solid #e5e7eb',
    borderTop: '4px solid #059669',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginBottom: '16px',
  },
  empty: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '64px 0',
    backgroundColor: 'white',
    borderRadius: '12px',
    border: '1px solid #e5e7eb',
  },
  emptyText: {
    fontSize: '16px',
    color: '#6b7280',
    marginTop: '16px',
  },
  pagination: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '12px',
    marginTop: '32px',
    padding: '20px',
    backgroundColor: 'white',
    borderRadius: '12px',
    border: '1px solid #e5e7eb',
  },
  paginationButton: {
    padding: '10px 20px',
    backgroundColor: 'white',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500',
    color: '#059669',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  paginationButtonDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
  paginationNumbers: {
    display: 'flex',
    gap: '8px',
  },
  paginationNumber: {
    width: '40px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500',
    color: '#6b7280',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  paginationNumberActive: {
    backgroundColor: '#059669',
    borderColor: '#059669',
    color: 'white',
  },
  // Delete Confirmation Modal Styles
  deleteModalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10000,
    backdropFilter: 'blur(4px)',
  },
  deleteModal: {
    backgroundColor: 'white',
    borderRadius: '20px',
    padding: '40px',
    maxWidth: '420px',
    width: '90%',
    textAlign: 'center',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    animation: 'modalSlideIn 0.3s ease-out',
  },
  deleteModalIcon: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    backgroundColor: '#fef2f2',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 24px auto',
  },
  deleteModalTitle: {
    fontSize: '22px',
    fontWeight: '700',
    color: '#111827',
    marginBottom: '12px',
  },
  deleteModalText: {
    fontSize: '15px',
    color: '#6b7280',
    lineHeight: '1.6',
    marginBottom: '28px',
  },
  deleteModalActions: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'center',
  },
  deleteModalCancelBtn: {
    padding: '12px 28px',
    backgroundColor: '#f3f4f6',
    border: 'none',
    borderRadius: '12px',
    fontSize: '15px',
    fontWeight: '600',
    color: '#374151',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  deleteModalConfirmBtn: {
    padding: '12px 28px',
    backgroundColor: '#ef4444',
    border: 'none',
    borderRadius: '12px',
    fontSize: '15px',
    fontWeight: '600',
    color: 'white',
    cursor: 'pointer',
    transition: 'all 0.2s',
    boxShadow: '0 4px 14px rgba(239, 68, 68, 0.4)',
  },
};

export default FeaturedDealsPage;
