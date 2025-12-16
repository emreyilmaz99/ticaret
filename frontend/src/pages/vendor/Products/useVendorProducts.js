// src/pages/vendor/Products/useVendorProducts.js
import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getVendorProducts, 
  createVendorProduct, 
  deleteVendorProduct, 
  updateVendorProduct, 
  deleteVendorProductPhoto, 
  updateVendorProductStatus 
} from '../../../features/vendor/api/productApi';
import { getMyCategoriesForProducts } from '../../../features/vendor/api/categoryApi';
import { getUnits } from '../../../features/public/api/unitsApi';
import { useToast } from '../../../components/common/Toast';
import apiClient from '@lib/apiClient';

// Initial form state
const initialFormState = {
  name: '',
  category_id: '',
  tax_class_id: '',
  price: '',
  stock: 0,
  description: '',
  short_description: '',
  type: 'simple',
  sku: '',
  unit_id: '',
  is_featured: false,
  tags: [],
  variants: [],
  images: []
};

const useVendorProducts = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const toast = useToast();

  // Auth check
  useEffect(() => {
    const token = localStorage.getItem('vendor_token');
    if (!token) navigate('/vendor/login');
  }, [navigate]);

  // ============ STATE ============
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [activeTab, setActiveTab] = useState('general');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [filterText, setFilterText] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [lightboxImage, setLightboxImage] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [sortOrder, setSortOrder] = useState('name_asc');
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, title: '', message: '', onConfirm: null });
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(12);
  const [formData, setFormData] = useState(initialFormState);
  const [tagInput, setTagInput] = useState('');

  // ============ QUERIES ============
  const { data: productsData, isLoading } = useQuery({
    queryKey: ['vendorProducts', currentPage, perPage],
    queryFn: () => getVendorProducts({ page: currentPage, per_page: perPage }),
    keepPreviousData: true
  });

  const { data: categoriesData, isLoading: categoriesLoading } = useQuery({
    queryKey: ['myCategoriesForProducts'],
    queryFn: getMyCategoriesForProducts
  });

  const { data: unitsData } = useQuery({
    queryKey: ['units'],
    queryFn: getUnits
  });

  // Derived data
  const products = productsData?.data ?? [];
  const paginationMeta = productsData?.meta ?? null;
  const categories = categoriesData?.data?.categories ?? [];
  const units = unitsData?.data ?? [];
  const hasFetchedCategories = !categoriesLoading && categoriesData !== undefined;

  // Group categories by parent
  const groupedCategories = useMemo(() => {
    const rootCategories = categories.filter(c => !c.parent_id);
    const childCategories = categories.filter(c => c.parent_id);
    const groups = [];

    rootCategories.forEach(root => {
      const children = childCategories.filter(c => c.parent_id === root.id);
      groups.push({ parent: root, children });
    });

    const orphanChildren = childCategories.filter(c => 
      !rootCategories.find(r => r.id === c.parent_id)
    );

    if (orphanChildren.length > 0) {
      const orphanGroups = {};
      orphanChildren.forEach(c => {
        const parentName = c.parent?.name || 'Diğer';
        if (!orphanGroups[parentName]) orphanGroups[parentName] = [];
        orphanGroups[parentName].push(c);
      });

      Object.entries(orphanGroups).forEach(([parentName, children]) => {
        groups.push({ parent: { name: parentName, id: null }, children });
      });
    }

    return groups;
  }, [categories]);

  // Filtered & sorted products
  const filteredProducts = useMemo(() => {
    let filtered = products;

    // Status filter
    if (statusFilter === 'low_stock') {
      // Düşük stoklu ürünler (kritik ≤5 veya düşük 6-9)
      filtered = filtered.filter(p => (p.stock || 0) < 10);
    } else if (statusFilter === 'stock') {
      // Stok paneli açıkken ürün listesi boş olsun
      filtered = [];
    } else if (statusFilter !== 'all') {
      filtered = filtered.filter(p => p.status === statusFilter);
    }

    // Text filter
    if (filterText) {
      const search = filterText.toLowerCase();
      filtered = filtered.filter(p =>
        p.name?.toLowerCase().includes(search) ||
        p.sku?.toLowerCase().includes(search) ||
        categories.find(c => c.id === p.category_id)?.name?.toLowerCase().includes(search)
      );
    }

    return filtered;
  }, [products, filterText, statusFilter, categories]);

  const sortedProducts = useMemo(() => {
    return [...filteredProducts].sort((a, b) => {
      switch (sortOrder) {
        case 'name_asc': return a.name.localeCompare(b.name);
        case 'name_desc': return b.name.localeCompare(a.name);
        case 'price_asc': return (a.price || 0) - (b.price || 0);
        case 'price_desc': return (b.price || 0) - (a.price || 0);
        case 'date_asc': return new Date(a.created_at) - new Date(b.created_at);
        case 'date_desc': return new Date(b.created_at) - new Date(a.created_at);
        default: return 0;
      }
    });
  }, [filteredProducts, sortOrder]);

  // Reset page on filter change
  useEffect(() => { setCurrentPage(1); }, [filterText, statusFilter]);

  // ============ MUTATIONS ============
  const createMutation = useMutation({
    mutationFn: createVendorProduct,
    onSuccess: () => {
      queryClient.invalidateQueries(['vendorProducts']);
      setCurrentPage(1);
      closeModal();
      toast.success('Başarılı', 'Ürün başarıyla oluşturuldu.');
    },
    onError: (err) => {
      toast.error('Hata', err.response?.data?.message || 'Ürün oluşturulurken bir hata oluştu.');
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }) => updateVendorProduct(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries(['vendorProducts']);
      closeModal();
      toast.success('Başarılı', 'Ürün başarıyla güncellendi.');
    },
    onError: (err) => {
      toast.error('Hata', err.response?.data?.message || 'Ürün güncellenirken bir hata oluştu.');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteVendorProduct,
    onSuccess: () => {
      queryClient.invalidateQueries(['vendorProducts']);
      toast.success('Başarılı', 'Ürün silindi.');
    }
  });

  const deletePhotoMutation = useMutation({
    mutationFn: ({ productId, photoId }) => deleteVendorProductPhoto(productId, photoId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(['vendorProducts']);
      if (selectedProduct) {
        setSelectedProduct(prev => ({
          ...prev,
          photos: prev.photos.filter(p => p.id !== variables.photoId)
        }));
      }
      toast.success('Başarılı', 'Fotoğraf silindi.');
    },
    onError: () => toast.error('Hata', 'Fotoğraf silinemedi.')
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }) => updateVendorProductStatus(id, status),
    onSuccess: (data) => {
      queryClient.invalidateQueries(['vendorProducts']);
      toast.success('Başarılı', data.message || 'Ürün durumu güncellendi.');
    },
    onError: (err) => toast.error('Hata', err.response?.data?.message || 'Durum güncellenemedi.')
  });

  // ============ HELPERS ============
  const backendOrigin = (apiClient.defaults.baseURL || '').replace(/\/api\/?$/i, '');
  const toFullUrl = useCallback((u) => {
    if (!u) return null;
    if (u.startsWith('http')) return u;
    return `${backendOrigin}${u.startsWith('/') ? '' : '/'}${u}`;
  }, [backendOrigin]);

  const getCategoryName = useCallback((id) => 
    categories.find(c => String(c.id) === String(id))?.name || '-'
  , [categories]);

  // ============ MODAL HANDLERS ============
  const openConfirmModal = useCallback((title, message, onConfirm) => {
    setConfirmModal({ isOpen: true, title, message, onConfirm });
  }, []);

  const closeConfirmModal = useCallback(() => {
    setConfirmModal({ isOpen: false, title: '', message: '', onConfirm: null });
  }, []);

  const openCreateModal = useCallback(() => {
    setModalMode('create');
    setFormData(initialFormState);
    setTagInput('');
    setActiveTab('general');
    setIsModalOpen(true);
  }, []);

  const openEditModal = useCallback((product) => {
    setModalMode('edit');
    setSelectedProduct(product);
    setFormData({
      name: product.name || '',
      category_id: product.category_id || '',
      tax_class_id: product.tax_class_id || '',
      price: product.price || '',
      stock: product.stock || 0,
      description: product.description || '',
      short_description: product.short_description || '',
      type: product.type || 'simple',
      sku: product.sku || '',
      unit_id: product.variants?.[0]?.unit_id || '',
      is_featured: product.is_featured || false,
      tags: product.tags ? product.tags.map(t => t.name) : [],
      variants: product.variants || [],
      images: []
    });
    setActiveTab('general');
    setIsModalOpen(true);
  }, []);

  const openViewModal = useCallback((product) => {
    setModalMode('view');
    setSelectedProduct(product);
    setFormData({
      name: product.name || '',
      category_id: product.category_id || '',
      tax_class_id: product.tax_class_id || '',
      price: product.price || '',
      stock: product.stock || 0,
      description: product.description || '',
      short_description: product.short_description || '',
      type: product.type || 'simple',
      sku: product.sku || '',
      unit_id: product.variants?.[0]?.unit_id || '',
      is_featured: product.is_featured || false,
      tags: product.tags ? product.tags.map(t => t.name) : [],
      variants: product.variants || [],
      images: []
    });
    setActiveTab('general');
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  }, []);

  // ============ FORM HANDLERS ============
  const handleImageChange = useCallback((e) => {
    if (!e.target.files) return;
    const newFiles = Array.from(e.target.files);
    const maxSize = 5 * 1024 * 1024;
    const validFiles = [];
    const invalidFiles = [];

    newFiles.forEach(file => {
      if (file.size > maxSize) invalidFiles.push(file.name);
      else validFiles.push(file);
    });

    if (invalidFiles.length > 0) {
      toast.warning('Uyarı', `Şu dosyalar 5MB'dan büyük: ${invalidFiles.join(', ')}`);
    }
    if (validFiles.length > 0) {
      setFormData(prev => ({ ...prev, images: [...prev.images, ...validFiles] }));
    }
  }, [toast]);

  const removeImage = useCallback((index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  }, []);

  const handleVariantChange = useCallback((index, field, value) => {
    setFormData(prev => {
      const newVariants = [...prev.variants];
      newVariants[index] = { ...newVariants[index], [field]: value };
      return { ...prev, variants: newVariants };
    });
  }, []);

  const addVariant = useCallback(() => {
    setFormData(prev => ({
      ...prev,
      variants: [...prev.variants, { title: '', sku: '', price: '', stock: 0, unit_id: '' }]
    }));
  }, []);

  const removeVariant = useCallback((index) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index)
    }));
  }, []);

  const addTag = useCallback((tag) => {
    if (tag && !formData.tags.includes(tag)) {
      setFormData(prev => ({ ...prev, tags: [...prev.tags, tag] }));
    }
    setTagInput('');
  }, [formData.tags]);

  const removeTag = useCallback((index) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index)
    }));
  }, []);

  const removeLastTag = useCallback(() => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.slice(0, -1)
    }));
  }, []);

  // ============ SUBMIT ============
  const handleSubmit = useCallback((e) => {
    e?.preventDefault();

    // Validations
    if (!formData.name || formData.name.trim().length < 2) {
      toast.warning('Uyarı', 'Ürün adı en az 2 karakter olmalıdır.');
      return;
    }
    if (!formData.category_id) {
      toast.warning('Uyarı', 'Lütfen bir kategori seçiniz.');
      return;
    }
    if (!formData.tax_class_id) {
      toast.warning('Uyarı', 'Lütfen bir vergi sınıfı seçiniz.');
      return;
    }
    if (formData.type === 'simple') {
      if (!formData.price || parseFloat(formData.price) <= 0) {
        toast.warning('Uyarı', 'Lütfen geçerli bir satış fiyatı giriniz.');
        return;
      }
      if (formData.stock === '' || formData.stock === null || parseInt(formData.stock) < 0) {
        toast.warning('Uyarı', 'Lütfen geçerli bir stok adedi giriniz.');
        return;
      }
    }
    if (formData.type === 'variable' && formData.variants.length === 0) {
      toast.warning('Uyarı', 'Varyantlı ürün için en az bir varyant eklemelisiniz.');
      return;
    }

    const fd = new FormData();
    fd.append('name', formData.name);
    fd.append('category_id', formData.category_id);
    fd.append('tax_class_id', formData.tax_class_id);
    fd.append('type', formData.type);
    fd.append('description', formData.description);
    fd.append('short_description', formData.short_description);
    fd.append('is_featured', formData.is_featured ? '1' : '0');

    if (formData.type === 'simple') {
      fd.append('price', formData.price);
      fd.append('stock', formData.stock);
      fd.append('sku', formData.sku);
      if (formData.unit_id) fd.append('unit_id', formData.unit_id);
    }

    formData.tags.forEach((t, i) => fd.append(`tags[${i}]`, t));

    if (formData.type === 'variable') {
      formData.variants.forEach((v, i) => {
        if (v.id) fd.append(`variants[${i}][id]`, v.id);
        if (v.title) fd.append(`variants[${i}][title]`, v.title);
        if (v.sku) fd.append(`variants[${i}][sku]`, v.sku);
        if (v.price !== undefined && v.price !== '') fd.append(`variants[${i}][price]`, v.price);
        if (v.stock !== undefined && v.stock !== '') fd.append(`variants[${i}][stock]`, v.stock);
        if (v.unit_id) fd.append(`variants[${i}][unit_id]`, v.unit_id);
      });
    }

    formData.images.forEach(file => fd.append('images[]', file));

    if (modalMode === 'create') {
      createMutation.mutate(fd);
    } else {
      updateMutation.mutate({ id: selectedProduct.id, payload: fd });
    }
  }, [formData, modalMode, selectedProduct, createMutation, updateMutation, toast]);

  return {
    // Data
    products: sortedProducts,
    allProducts: products,
    categories,
    groupedCategories,
    units,
    paginationMeta,
    isLoading,
    categoriesLoading,
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
    isSubmitting: createMutation.isPending || updateMutation.isPending
  };
};

export default useVendorProducts;
