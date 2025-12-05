// src/pages/admin/Products/index.jsx
import React from 'react';
import Pagination from '../../../components/ui/Pagination';

// Alt Bileşenler
import ProductStats from './ProductStats';
import ProductFilterBar from './ProductFilterBar';
import ProductTable from './ProductTable';
import ProductDetailModal from './ProductDetailModal';
import RejectModal from './RejectModal';
import ImageLightbox from './ImageLightbox';

// Custom Hook
import useProductsPage from './useProductsPage';

// Stiller
import { getStyles } from './styles';

/**
 * Ürün Yönetimi Ana Sayfası
 */
const ProductsPage = () => {
  const {
    // Data
    products,
    pagination,
    stats,
    isLoading,
    
    // Filters
    filters,
    updateFilter,
    setStatusFilter,
    
    // Selection
    selectedProducts,
    toggleSelectAll,
    toggleSelect,
    
    // Status Actions
    handleStatusChange,
    handleBulkAction,
    handleRejectSubmit,
    
    // View Modal
    viewProduct,
    openViewModal,
    closeViewModal,
    
    // Reject Modal
    rejectModal,
    rejectionReason,
    setRejectionReason,
    closeRejectModal,
    
    // Images
    selectedImage,
    setSelectedImage,
    lightboxImage,
    openLightbox,
    closeLightbox,
    
    // Mutation States
    isUpdating,
    isBulkUpdating
  } = useProductsPage();

  const styles = getStyles();

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>Ürün Yönetimi</h1>
        <p style={styles.subtitle}>Satıcıların eklediği ürünleri onaylayın veya reddedin</p>
      </div>

      {/* Stats */}
      <ProductStats 
        stats={stats} 
        currentFilter={filters.status}
        onFilterChange={setStatusFilter}
        styles={styles}
      />

      {/* Filter Bar */}
      <ProductFilterBar
        searchValue={filters.search}
        onSearchChange={(value) => updateFilter('search', value)}
        selectedCount={selectedProducts.length}
        onBulkApprove={() => handleBulkAction('active')}
        onBulkReject={() => handleBulkAction('rejected')}
        styles={styles}
      />

      {/* Products Table */}
      <ProductTable
        products={products}
        isLoading={isLoading}
        selectedProducts={selectedProducts}
        onToggleSelectAll={toggleSelectAll}
        onToggleSelect={toggleSelect}
        onView={openViewModal}
        onStatusChange={handleStatusChange}
        styles={styles}
      />

      {/* Pagination */}
      <Pagination
        currentPage={filters.page}
        totalPages={pagination.last_page || 1}
        totalItems={pagination.total || 0}
        perPage={20}
        onPageChange={(page) => updateFilter('page', page)}
      />

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={viewProduct}
        selectedImage={selectedImage}
        onSelectImage={setSelectedImage}
        onOpenLightbox={openLightbox}
        onStatusChange={handleStatusChange}
        onClose={closeViewModal}
        styles={styles}
      />

      {/* Reject Modal */}
      <RejectModal
        isOpen={rejectModal.isOpen}
        productName={rejectModal.productName}
        isBulk={rejectModal.isBulk}
        rejectionReason={rejectionReason}
        onReasonChange={setRejectionReason}
        onSubmit={handleRejectSubmit}
        onClose={closeRejectModal}
        isSubmitting={isUpdating || isBulkUpdating}
        styles={styles}
      />

      {/* Lightbox */}
      <ImageLightbox
        imageUrl={lightboxImage}
        onClose={closeLightbox}
        styles={styles}
      />
    </div>
  );
};

export default ProductsPage;
