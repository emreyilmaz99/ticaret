// src/pages/admin/Categories/index.jsx
import React from 'react';
import { FaPlus } from 'react-icons/fa';
import ConfirmModal from '../../../components/modals/ConfirmModal';

// Alt Bileşenler
import CategoryStats from './CategoryStats';
import CategoryToolbar from './CategoryToolbar';
import CategoryTree from './CategoryTree';
import CategoryFormModal from './CategoryFormModal';

// Custom Hook
import useCategoriesPage from './useCategoriesPage';

// Stiller
import { getStyles } from './styles';

/**
 * Kategori Yönetimi Ana Sayfası
 * Modüler yapıda, kolay bakım ve test edilebilir
 */
const CategoriesPage = () => {
  const {
    // Data
    filteredTree,
    stats,
    treeLoading,
    
    // UI State
    searchTerm,
    setSearchTerm,
    expandedCategories,
    isMobile,
    
    // Tree Actions
    toggleExpand,
    expandAll,
    collapseAll,
    
    // Modal State
    isModalOpen,
    modalMode,
    
    // Modal Actions
    openCreateModal,
    openEditModal,
    closeModal,
    
    // Form
    formData,
    imagePreview,
    handleFormChange,
    handleImageChange,
    handleSubmit,
    getParentOptions,
    
    // Delete
    deleteConfirmOpen,
    categoryToDelete,
    confirmDelete,
    handleDelete,
    cancelDelete,
    
    // Mutation States
    isCreating,
    isUpdating,
    isDeleting
  } = useCategoriesPage();

  const styles = getStyles(isMobile);

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Kategori Yönetimi</h1>
          <p style={styles.subtitle}>Ürün kategorilerini oluşturun ve yönetin</p>
        </div>
        <button onClick={() => openCreateModal()} style={styles.btnPrimary}>
          <FaPlus size={14} /> Yeni Kategori
        </button>
      </div>

      {/* Stats */}
      <CategoryStats stats={stats} styles={styles} />

      {/* Toolbar */}
      <CategoryToolbar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        expandAll={expandAll}
        collapseAll={collapseAll}
        styles={styles}
      />

      {/* Category Tree */}
      <CategoryTree
        categories={filteredTree}
        loading={treeLoading}
        searchTerm={searchTerm}
        expandedCategories={expandedCategories}
        toggleExpand={toggleExpand}
        openCreateModal={openCreateModal}
        openEditModal={openEditModal}
        confirmDelete={confirmDelete}
        styles={styles}
      />

      {/* Create/Edit Modal */}
      <CategoryFormModal
        isOpen={isModalOpen}
        mode={modalMode}
        formData={formData}
        imagePreview={imagePreview}
        parentOptions={getParentOptions()}
        onFormChange={handleFormChange}
        onImageChange={handleImageChange}
        onSubmit={handleSubmit}
        onClose={closeModal}
        isSubmitting={isCreating || isUpdating}
        styles={styles}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteConfirmOpen}
        onClose={cancelDelete}
        onConfirm={handleDelete}
        title="Kategoriyi Sil"
        message={categoryToDelete ? `"${categoryToDelete.name}" kategorisini silmek istediğinizden emin misiniz?` : 'Bu kategoriyi silmek istediğinizden emin misiniz?'}
        confirmText={isDeleting ? 'Siliniyor...' : 'Evet, Sil'}
        cancelText="İptal"
        type="danger"
        isLoading={isDeleting}
      />
    </div>
  );
};

export default CategoriesPage;
