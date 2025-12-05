// src/pages/admin/CommissionPlans/index.jsx
import React from 'react';
import { FaPlus } from 'react-icons/fa';

// Alt Bileşenler
import PlanTable from './PlanTable';
import PlanFormModal from './PlanFormModal';
import Toast from './Toast';

// Custom Hook
import useCommissionPlans from './useCommissionPlans';

// Stiller
import { getStyles } from './styles';

/**
 * Komisyon Planları Ana Sayfası
 */
const CommissionPlans = () => {
  const {
    // Data
    plans,
    isLoading,
    error,
    
    // Modal
    isModalOpen,
    editingPlan,
    openCreateModal,
    openEditModal,
    closeModal,
    
    // Form
    formData,
    handleFormChange,
    handleSubmit,
    
    // Actions
    handleDelete,
    handleToggleActive,
    handleSetDefault,
    
    // Toast
    toast,
    clearToast
  } = useCommissionPlans();

  const styles = getStyles();

  // Loading State
  if (isLoading) {
    return <div style={styles.loadingState}>Yükleniyor...</div>;
  }

  // Error State
  if (error) {
    return <div style={styles.errorState}>Hata: {error.message}</div>;
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Komisyon Planları</h1>
          <p style={styles.subtitle}>Satıcılar için komisyon oranlarını yönetin.</p>
        </div>
        <button style={styles.createBtn} onClick={openCreateModal}>
          <FaPlus /> Yeni Plan Ekle
        </button>
      </div>

      {/* Table */}
      <PlanTable
        plans={plans}
        onEdit={openEditModal}
        onDelete={handleDelete}
        onToggleActive={handleToggleActive}
        onSetDefault={handleSetDefault}
        styles={styles}
      />

      {/* Modal */}
      <PlanFormModal
        isOpen={isModalOpen}
        isEditing={!!editingPlan}
        formData={formData}
        onFormChange={handleFormChange}
        onSubmit={handleSubmit}
        onClose={closeModal}
        styles={styles}
      />

      {/* Toast */}
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={clearToast} 
        />
      )}
    </div>
  );
};

export default CommissionPlans;
