// src/pages/vendor/Products/index.jsx
import React from 'react';
import useVendorProducts from './useVendorProducts';
import { useTaxClasses } from './hooks/useTaxClasses';
import { styles } from './styles';
import {
  ProductHeader,
  ProductStats,
  ProductToolbar,
  ProductGrid,
  ProductTable,
  Pagination,
  ProductModal,
  ConfirmModal,
  Lightbox
} from './components';

const VendorProductsPage = () => {
  const { taxClasses } = useTaxClasses();
  
  const {
    // Data
    products,
    allProducts,
    categories,
    groupedCategories,
    units,
    paginationMeta,
    isLoading,
    hasFetchedCategories,

    // UI State
    viewMode,
    setViewMode,
    sortOrder,
    setSortOrder,
    filterText,
    setFilterText,
    statusFilter,
    setStatusFilter,
    currentPage,
    setCurrentPage,

    // Modal State
    isModalOpen,
    modalMode,
    activeTab,
    setActiveTab,
    selectedProduct,

    // Form State
    formData,
    setFormData,
    tagInput,
    setTagInput,

    // Lightbox
    lightboxImage,
    setLightboxImage,

    // Confirm Modal
    confirmModal,
    openConfirmModal,
    closeConfirmModal,

    // Handlers
    openCreateModal,
    openEditModal,
    openViewModal,
    closeModal,
    handleSubmit,
    handleImageChange,
    removeImage,
    handleVariantChange,
    addVariant,
    removeVariant,
    addTag,
    removeTag,
    removeLastTag,
    toFullUrl,
    getCategoryName,

    // Mutations
    deleteMutation,
    deletePhotoMutation,
    statusMutation,
    isSubmitting
  } = useVendorProducts();

  // Handle delete product
  const handleDeleteProduct = (product) => {
    openConfirmModal(
      'Ürünü Sil',
      `"${product.name}" ürününü silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.`,
      () => deleteMutation.mutate(product.id)
    );
  };

  // Handle toggle status
  const handleToggleStatus = (product) => {
    const newStatus = product.status === 'active' ? 'draft' : 'active';
    const statusText = newStatus === 'active' ? 'aktif' : 'pasif';
    
    openConfirmModal(
      'Durum Değiştir',
      `"${product.name}" ürününü ${statusText} yapmak istediğinizden emin misiniz?`,
      () => statusMutation.mutate({ id: product.id, status: newStatus })
    );
  };

  // Loading state
  if (isLoading && !hasFetchedCategories) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingContainer}>
          <div style={styles.spinner} />
          <p>Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <ProductHeader onCreateClick={openCreateModal} />
      
      <ProductStats 
        products={allProducts} 
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />
      
      {statusFilter !== 'stock' && (
        <ProductToolbar
          filterText={filterText}
          onFilterChange={setFilterText}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          sortOrder={sortOrder}
          onSortChange={setSortOrder}
        />
      )}

      {statusFilter !== 'stock' && (
        <>
          {viewMode === 'grid' ? (
            <ProductGrid
              products={products}
              getCategoryName={getCategoryName}
              toFullUrl={toFullUrl}
              onEdit={openEditModal}
              onView={openViewModal}
              onDelete={handleDeleteProduct}
              onToggleStatus={handleToggleStatus}
              onImageClick={setLightboxImage}
            />
          ) : (
            <ProductTable
              products={products}
              getCategoryName={getCategoryName}
              toFullUrl={toFullUrl}
              onEdit={openEditModal}
              onView={openViewModal}
              onDelete={handleDeleteProduct}
              onToggleStatus={handleToggleStatus}
              onImageClick={setLightboxImage}
            />
          )}

          <Pagination
            meta={paginationMeta}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        </>
      )}

      <ProductModal
        isOpen={isModalOpen}
        mode={modalMode}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        formData={formData}
        setFormData={setFormData}
        groupedCategories={groupedCategories}
        units={units}
        taxClasses={taxClasses}
        selectedProduct={selectedProduct}
        tagInput={tagInput}
        setTagInput={setTagInput}
        onClose={closeModal}
        onSubmit={handleSubmit}
        handleImageChange={handleImageChange}
        removeImage={removeImage}
        handleVariantChange={handleVariantChange}
        addVariant={addVariant}
        removeVariant={removeVariant}
        addTag={addTag}
        removeTag={removeTag}
        removeLastTag={removeLastTag}
        deletePhotoMutation={deletePhotoMutation}
        toFullUrl={toFullUrl}
        onImageClick={setLightboxImage}
        openConfirmModal={openConfirmModal}
        isSubmitting={isSubmitting}
      />

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        onConfirm={confirmModal.onConfirm}
        onCancel={closeConfirmModal}
      />

      <Lightbox
        imageUrl={lightboxImage}
        onClose={() => setLightboxImage(null)}
      />
    </div>
  );
};

export default VendorProductsPage;
