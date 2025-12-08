// src/pages/admin/Products/useProductsPage.js
import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getProducts, 
  getProductStatistics, 
  updateProductStatus, 
  bulkUpdateProductStatus, 
  deleteProduct 
} from '../../../features/admin/api/productApi';
import { useToast } from '../../../components/common/Toast';

/**
 * Products sayfası için custom hook
 */
const useProductsPage = () => {
  const queryClient = useQueryClient();
  const toast = useToast();
  
  // Filters & Pagination
  const [filters, setFilters] = useState({
    status: 'all',
    search: '',
    page: 1
  });
  
  // Selection
  const [selectedProducts, setSelectedProducts] = useState([]);
  
  // Modals
  const [viewProduct, setViewProduct] = useState(null);
  const [rejectModal, setRejectModal] = useState({ 
    isOpen: false, 
    productId: null, 
    productName: '', 
    isBulk: false 
  });
  const [rejectionReason, setRejectionReason] = useState('');
  
  // Image states
  const [selectedImage, setSelectedImage] = useState(null);
  const [lightboxImage, setLightboxImage] = useState(null);

  // Queries
  const { data: productsData, isLoading } = useQuery({
    queryKey: ['adminProducts', filters],
    queryFn: () => getProducts({ 
      status: filters.status !== 'all' ? filters.status : undefined,
      search: filters.search || undefined,
      page: filters.page,
      per_page: 20
    })
  });

  const { data: statsData } = useQuery({
    queryKey: ['adminProductStats'],
    queryFn: getProductStatistics
  });

  const products = productsData?.data ?? [];
  const pagination = productsData?.meta ?? {};
  const stats = statsData?.data ?? {};

  // Mutations
  const statusMutation = useMutation({
    mutationFn: ({ id, status, rejectionReason }) => updateProductStatus(id, status, rejectionReason),
    onSuccess: (data) => {
      queryClient.invalidateQueries(['adminProducts']);
      queryClient.invalidateQueries(['adminProductStats']);
      toast.success('Başarılı', data.message || 'Ürün durumu güncellendi');
      closeRejectModal();
    },
    onError: (err) => {
      toast.error('Hata', err.response?.data?.message || 'İşlem başarısız');
    }
  });

  const bulkStatusMutation = useMutation({
    mutationFn: ({ productIds, status, rejectionReason }) => bulkUpdateProductStatus(productIds, status, rejectionReason),
    onSuccess: (data) => {
      queryClient.invalidateQueries(['adminProducts']);
      queryClient.invalidateQueries(['adminProductStats']);
      setSelectedProducts([]);
      toast.success('Başarılı', data.message || 'Ürünler güncellendi');
      closeRejectModal();
    },
    onError: (err) => {
      toast.error('Hata', err.response?.data?.message || 'İşlem başarısız');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['adminProducts']);
      queryClient.invalidateQueries(['adminProductStats']);
      toast.success('Başarılı', 'Ürün silindi');
    },
    onError: (err) => {
      toast.error('Hata', err.response?.data?.message || 'Silme işlemi başarısız');
    }
  });

  // Filter Handlers
  const updateFilter = useCallback((key, value) => {
    setFilters(prev => ({ ...prev, [key]: value, page: key !== 'page' ? 1 : value }));
  }, []);

  const setStatusFilter = useCallback((status) => {
    updateFilter('status', status);
  }, [updateFilter]);

  // Selection Handlers
  const toggleSelectAll = useCallback(() => {
    if (selectedProducts.length === products.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(products.map(p => p.id));
    }
  }, [selectedProducts.length, products]);

  const toggleSelect = useCallback((id) => {
    setSelectedProducts(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  }, []);

  // Status Handlers
  const handleStatusChange = useCallback((id, status, productName = '') => {
    if (status === 'rejected') {
      setRejectModal({ isOpen: true, productId: id, productName, isBulk: false });
    } else {
      statusMutation.mutate({ id, status });
    }
  }, [statusMutation]);

  const handleBulkAction = useCallback((status) => {
    if (selectedProducts.length === 0) {
      toast.warning('Uyarı', 'Lütfen en az bir ürün seçin');
      return;
    }
    if (status === 'rejected') {
      setRejectModal({ 
        isOpen: true, 
        productId: null, 
        productName: `${selectedProducts.length} ürün`, 
        isBulk: true 
      });
    } else {
      bulkStatusMutation.mutate({ productIds: selectedProducts, status });
    }
  }, [selectedProducts, bulkStatusMutation, toast]);

  const handleRejectSubmit = useCallback(() => {
    if (!rejectionReason.trim()) {
      toast.warning('Uyarı', 'Lütfen red sebebini belirtin');
      return;
    }
    if (rejectModal.isBulk) {
      bulkStatusMutation.mutate({ 
        productIds: selectedProducts, 
        status: 'rejected', 
        rejectionReason 
      });
    } else {
      statusMutation.mutate({ 
        id: rejectModal.productId, 
        status: 'rejected', 
        rejectionReason 
      });
    }
    setViewProduct(null);
  }, [rejectionReason, rejectModal, selectedProducts, bulkStatusMutation, statusMutation, toast]);

  // Modal Handlers
  const openViewModal = useCallback((product) => {
    setSelectedImage(null);
    setViewProduct(product);
  }, []);

  const closeViewModal = useCallback(() => {
    setSelectedImage(null);
    setViewProduct(null);
  }, []);

  const closeRejectModal = useCallback(() => {
    setRejectModal({ isOpen: false, productId: null, productName: '', isBulk: false });
    setRejectionReason('');
  }, []);

  // Lightbox
  const openLightbox = useCallback((imageUrl) => {
    setLightboxImage(imageUrl);
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxImage(null);
  }, []);

  return {
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
    isUpdating: statusMutation.isPending,
    isBulkUpdating: bulkStatusMutation.isPending
  };
};

export default useProductsPage;
