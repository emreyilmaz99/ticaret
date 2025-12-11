import React from 'react';
import { FaPlus, FaFilter } from 'react-icons/fa';
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
          <p style={styles.subtitle}>
            Anasayfa carousel'inde gösterilecek kampanyalı ürünleri yönetin
          </p>
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
          bgColor="#eff6ff"
        />
        <StatCard
          label="Aktif"
          value={stats.active || 0}
          color="#059669"
          bgColor="#d1fae5"
        />
        <StatCard
          label="Şu Anda Geçerli"
          value={stats.current || 0}
          color="#8b5cf6"
          bgColor="#f3e8ff"
        />
        <StatCard
          label="Toplam Görüntülenme"
          value={stats.total_views || 0}
          color="#f59e0b"
          bgColor="#fef3c7"
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
        <div style={styles.dealsGrid}>
          {deals.map((deal) => (
            <DealCard
              key={deal.id}
              deal={deal}
              onEdit={() => openEditModal(deal)}
              onDelete={() => handleDelete(deal.id)}
              onToggle={() => handleToggle(deal.id)}
              isDeleting={isDeleting}
              isToggling={isToggling}
            />
          ))}
        </div>
      )}

      {/* Modal */}
      <DealFormModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={handleSubmit}
        mode={modalMode}
        deal={selectedDeal}
        products={products}
        isSubmitting={isCreating || isUpdating}
      />
    </div>
  );
};

const StatCard = ({ label, value, color, bgColor }) => (
  <div style={{ ...styles.statCard, backgroundColor: bgColor }}>
    <p style={styles.statLabel}>{label}</p>
    <p style={{ ...styles.statValue, color }}>{value}</p>
  </div>
);

const styles = {
  container: {
    padding: '32px',
    backgroundColor: '#F8FAFC',
    minHeight: '100vh',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '32px',
  },
  title: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#111827',
    marginBottom: '4px',
  },
  subtitle: {
    fontSize: '14px',
    color: '#6b7280',
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
};

export default FeaturedDealsPage;
