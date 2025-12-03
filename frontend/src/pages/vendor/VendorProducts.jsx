import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaPlus, FaSearch, FaFilter, FaEdit, FaTrash, FaEye, 
  FaBox, FaTag, FaImages, FaList, FaCog, FaSave, FaTimes, FaCheck,
  FaThLarge, FaSortAmountDown, FaSortAmountUp, FaFolder, FaLayerGroup,
  FaPause, FaPlay
} from 'react-icons/fa';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getVendorProducts, createVendorProduct, deleteVendorProduct, updateVendorProduct, deleteVendorProductPhoto, updateVendorProductStatus } from '../../features/vendor/api/productApi';
import { getMyCategoriesForProducts } from '../../features/vendor/api/categoryApi';
import { getUnits } from '../../features/public/api/unitsApi';
import { useToast } from '../../components/Toast';
import Pagination from '../../components/ui/Pagination';
import axios from '../../lib/axios';

const VendorProducts = () => {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const toast = useToast();

  useEffect(() => {
    const token = localStorage.getItem('vendor_token');
    if (!token) {
      navigate('/vendor/login');
    }
  }, [navigate]);
  
  // State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' | 'edit' | 'view'
  const [activeTab, setActiveTab] = useState('general');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [filterText, setFilterText] = useState('');
  const [lightboxImage, setLightboxImage] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [sortOrder, setSortOrder] = useState('name_asc'); // 'name_asc', 'name_desc', 'price_asc', 'price_desc', 'date_desc', 'date_asc'
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: null
  });
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(12);
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    category_id: '',
    price: '',
    stock: 0,
    description: '',
    short_description: '',
    type: 'simple',
    sku: '',
    unit_id: '',
    is_featured: false,
    tags: [], // array of tag strings
    variants: [],
    images: []
  });
  const [tagInput, setTagInput] = useState('');

  // Queries
  const { data: productsData, isLoading } = useQuery({
    queryKey: ['vendorProducts', currentPage, perPage],
    queryFn: () => getVendorProducts({ page: currentPage, per_page: perPage }),
    keepPreviousData: true
  });
  const products = productsData?.data ?? [];
  const paginationMeta = productsData?.meta ?? null;

  const { data: categoriesData, isLoading: categoriesLoading } = useQuery({ 
    queryKey: ['myCategoriesForProducts'], 
    queryFn: getMyCategoriesForProducts 
  });
  const categories = categoriesData?.data?.categories ?? [];
  const hasFetchedCategories = !categoriesLoading && categoriesData !== undefined;

  // Group categories by parent for better UX
  const groupedCategories = useMemo(() => {
    // Separate root categories and child categories
    const rootCategories = categories.filter(c => !c.parent_id);
    const childCategories = categories.filter(c => c.parent_id);
    
    // Group children by parent
    const groups = [];
    
    rootCategories.forEach(root => {
      const children = childCategories.filter(c => c.parent_id === root.id);
      groups.push({
        parent: root,
        children: children
      });
    });
    
    // Add orphan children (whose parent is not in root but exists)
    const orphanChildren = childCategories.filter(c => 
      !rootCategories.find(r => r.id === c.parent_id)
    );
    
    if (orphanChildren.length > 0) {
      // Group by their parent name
      const orphanGroups = {};
      orphanChildren.forEach(c => {
        const parentName = c.parent?.name || 'Diğer';
        if (!orphanGroups[parentName]) {
          orphanGroups[parentName] = [];
        }
        orphanGroups[parentName].push(c);
      });
      
      Object.entries(orphanGroups).forEach(([parentName, children]) => {
        groups.push({
          parent: { name: parentName, id: null },
          children: children
        });
      });
    }
    
    return groups;
  }, [categories]);

  const { data: unitsData } = useQuery({ 
    queryKey: ['units'], 
    queryFn: getUnits 
  });
  const units = unitsData?.data ?? [];

  const filteredProducts = products.filter(p => {
    if (!filterText) return true;
    const search = filterText.toLowerCase();
    return (
      p.name?.toLowerCase().includes(search) ||
      p.sku?.toLowerCase().includes(search) ||
      categories.find(c => c.id === p.category_id)?.name?.toLowerCase().includes(search)
    );
  });

  // Reset to page 1 when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filterText]);

  const sortedProducts = [...filteredProducts].sort((a, b) => {
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

  // Mutations
  const createMutation = useMutation({
    mutationFn: (payload) => createVendorProduct(payload),
    onSuccess: () => {
      qc.invalidateQueries(['vendorProducts']);
      setCurrentPage(1); // Reset to first page after create
      closeModal();
      toast.success('Başarılı', 'Ürün başarıyla oluşturuldu.');
    },
    onError: (err) => {
      console.error(err);
      const message = err.response?.data?.message || 'Ürün oluşturulurken bir hata oluştu.';
      toast.error('Hata', message);
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }) => updateVendorProduct(id, payload),
    onSuccess: () => {
      qc.invalidateQueries(['vendorProducts']);
      closeModal();
      toast.success('Başarılı', 'Ürün başarıyla güncellendi.');
    },
    onError: (err) => {
      console.error(err);
      const message = err.response?.data?.message || 'Ürün güncellenirken bir hata oluştu.';
      toast.error('Hata', message);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteVendorProduct(id),
    onSuccess: () => {
      qc.invalidateQueries(['vendorProducts']);
      toast.success('Başarılı', 'Ürün silindi.');
    }
  });

  const deletePhotoMutation = useMutation({
    mutationFn: ({ productId, photoId }) => deleteVendorProductPhoto(productId, photoId),
    onSuccess: () => {
      qc.invalidateQueries(['vendorProducts']);
      // Update selected product photos locally to reflect change immediately in modal
      if (selectedProduct) {
        setSelectedProduct(prev => ({
          ...prev,
          photos: prev.photos.filter(p => p.id !== deletePhotoMutation.variables.photoId)
        }));
      }
      toast.success('Başarılı', 'Fotoğraf silindi.');
    },
    onError: (err) => {
      console.error(err);
      toast.error('Hata', 'Fotoğraf silinemedi.');
    }
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }) => updateVendorProductStatus(id, status),
    onSuccess: (data) => {
      qc.invalidateQueries(['vendorProducts']);
      toast.success('Başarılı', data.message || 'Ürün durumu güncellendi.');
    },
    onError: (err) => {
      console.error(err);
      toast.error('Hata', err.response?.data?.message || 'Durum güncellenemedi.');
    }
  });

  // Helpers
  const backendOrigin = (axios.defaults.baseURL || '').replace(/\/api\/?$/i, '');
  const toFullUrl = (u) => {
    if (!u) return null;
    if (u.startsWith('http')) return u;
    return `${backendOrigin}${u.startsWith('/') ? '' : '/'}${u}`;
  };

  const getCategoryName = (id) => categories.find(c => String(c.id) === String(id))?.name || '-';

  const openConfirmModal = (title, message, onConfirm) => {
    setConfirmModal({ isOpen: true, title, message, onConfirm });
  };

  const closeConfirmModal = () => {
    setConfirmModal({ isOpen: false, title: '', message: '', onConfirm: null });
  };

  const openCreateModal = () => {
    setModalMode('create');
    setFormData({
      name: '',
      category_id: '',
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
    });
    setTagInput('');
    setActiveTab('general');
    setIsModalOpen(true);
  };

  const openEditModal = (product) => {
    setModalMode('edit');
    setSelectedProduct(product);
    setFormData({
      name: product.name || '',
      category_id: product.category_id || '',
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
      images: [] // New images only
    });
    setActiveTab('general');
    setIsModalOpen(true);
  };

  const openViewModal = (product) => {
    setModalMode('view');
    setSelectedProduct(product);
    setFormData({
      name: product.name || '',
      category_id: product.category_id || '',
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
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const handleImageChange = (e) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      const maxSize = 5 * 1024 * 1024; // 5MB
      const validFiles = [];
      const invalidFiles = [];
      
      newFiles.forEach(file => {
        if (file.size > maxSize) {
          invalidFiles.push(file.name);
        } else {
          validFiles.push(file);
        }
      });
      
      if (invalidFiles.length > 0) {
        toast.warning('Uyarı', `Şu dosyalar 5MB'dan büyük olduğu için eklenmedi: ${invalidFiles.join(', ')}`);
      }
      
      if (validFiles.length > 0) {
        setFormData(prev => ({ ...prev, images: [...prev.images, ...validFiles] }));
      }
    }
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validasyonlar
    if (!formData.name || formData.name.trim().length < 2) {
      toast.warning('Uyarı', 'Ürün adı en az 2 karakter olmalıdır.');
      return;
    }
    
    if (!formData.category_id) {
      toast.warning('Uyarı', 'Lütfen bir kategori seçiniz.');
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

    // Tags
    if (formData.tags && formData.tags.length > 0) {
      formData.tags.forEach((t, i) => fd.append(`tags[${i}]`, t));
    }

    // Variants
    if (formData.type === 'variable' && formData.variants.length > 0) {
      formData.variants.forEach((v, i) => {
        if (v.id) fd.append(`variants[${i}][id]`, v.id);
        if (v.title) fd.append(`variants[${i}][title]`, v.title);
        if (v.sku) fd.append(`variants[${i}][sku]`, v.sku);
        if (v.price !== undefined && v.price !== '') fd.append(`variants[${i}][price]`, v.price);
        if (v.stock !== undefined && v.stock !== '') fd.append(`variants[${i}][stock]`, v.stock);
        if (v.unit_id) fd.append(`variants[${i}][unit_id]`, v.unit_id);
      });
    }

    // Images
    if (formData.images && formData.images.length > 0) {
      Array.from(formData.images).forEach((file) => {
        fd.append('images[]', file);
      });
    }

    if (modalMode === 'create') {
      createMutation.mutate(fd);
    } else {
      // Güncelleme için de FormData kullanıyoruz (resim yükleyebilmek için)
      // API tarafında FormData gelirse POST + _method: PUT olarak işlenecek.
      updateMutation.mutate({ id: selectedProduct.id, payload: fd });
    }
  };

  const handleVariantChange = (index, field, value) => {
    const newVariants = [...formData.variants];
    newVariants[index] = { ...newVariants[index], [field]: value };
    setFormData({ ...formData, variants: newVariants });
  };

  const addVariant = () => {
    setFormData({
      ...formData,
      variants: [...formData.variants, { title: '', sku: '', price: '', stock: 0, unit_id: '' }]
    });
  };

  const removeVariant = (index) => {
    const newVariants = formData.variants.filter((_, i) => i !== index);
    setFormData({ ...formData, variants: newVariants });
  };

  // Styles
  const styles = {
    container: { padding: '24px', fontFamily: "'Inter', sans-serif", color: '#1e293b' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' },
    title: { fontSize: '24px', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.5px' },
    subtitle: { color: '#64748b', fontSize: '14px', marginTop: '4px' },
    btnPrimary: { backgroundColor: '#059669', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' },
    filterContainer: { backgroundColor: 'white', padding: '16px', borderRadius: '12px', marginBottom: '24px', display: 'flex', gap: '16px', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' },
    inputWrapper: { flex: 1, position: 'relative' },
    inputIcon: { position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' },
    input: { width: '100%', padding: '10px 10px 10px 40px', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none', fontSize: '14px' },
    btnSecondary: { padding: '0 20px', backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '8px', color: '#475569', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' },
    tableContainer: { backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.02)' },
    table: { width: '100%', borderCollapse: 'collapse' },
    th: { padding: '16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' },
    td: { padding: '16px', borderBottom: '1px solid #f1f5f9', color: '#334155' },
    modalOverlay: { position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1200, backdropFilter: 'blur(4px)' },
    modalContent: { backgroundColor: 'white', width: '100%', maxWidth: '900px', borderRadius: '16px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)', display: 'flex', flexDirection: 'column', maxHeight: '90vh' },
    modalHeader: { padding: '20px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    modalTitle: { fontSize: '18px', fontWeight: '700', color: '#0f172a' },
    modalBody: { flex: 1, overflow: 'hidden', display: 'flex' },
    sidebar: { width: '240px', backgroundColor: '#f8fafc', borderRight: '1px solid #f1f5f9', padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px', overflowY: 'auto' },
    tabBtn: (active) => ({
      display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '8px', fontSize: '14px', fontWeight: '500', cursor: 'pointer',
      backgroundColor: active ? 'white' : 'transparent',
      color: active ? '#059669' : '#64748b',
      boxShadow: active ? '0 1px 2px rgba(0,0,0,0.05)' : 'none',
      border: active ? '1px solid #e2e8f0' : '1px solid transparent',
      width: '100%', textAlign: 'left'
    }),
    contentArea: { flex: 1, padding: '32px', overflowY: 'auto' },
    formGroup: { marginBottom: '20px' },
    label: { display: 'block', fontSize: '14px', fontWeight: '500', color: '#334155', marginBottom: '8px' },
    formInput: { width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none', fontSize: '14px', transition: 'border-color 0.2s' },
    modalFooter: { padding: '20px 24px', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'flex-end', gap: '12px', backgroundColor: '#f8fafc', borderBottomLeftRadius: '16px', borderBottomRightRadius: '16px' },
    grid2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' },
    grid4: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' },
    variantCard: { padding: '16px', border: '1px solid #e2e8f0', borderRadius: '8px', backgroundColor: '#f8fafc', position: 'relative', marginBottom: '12px' },
    uploadBox: { border: '2px dashed #cbd5e1', borderRadius: '12px', padding: '32px', textAlign: 'center', cursor: 'pointer', position: 'relative', backgroundColor: '#f8fafc' },
    statBadge: { display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: '600' },
    gridCard: { backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden', transition: 'transform 0.2s, box-shadow 0.2s', display: 'flex', flexDirection: 'column' },
    gridCardImg: { width: '100%', aspectRatio: '1/1', objectFit: 'cover', backgroundColor: '#f1f5f9' },
    gridCardBody: { padding: '16px', flex: 1, display: 'flex', flexDirection: 'column' },
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Ürün Yönetimi</h1>
          <p style={styles.subtitle}>
            {!hasFetchedCategories 
              ? 'Kategoriler yükleniyor...'
              : categories.length > 0 
                ? 'Ürünlerinizi buradan yönetebilirsiniz. Seçtiğiniz kategorilerde ürün ekleyebilirsiniz.'
                : 'Ürün eklemek için önce Kategoriler sayfasından satış yapacağınız kategorileri seçin.'}
          </p>
        </div>
        <button 
          onClick={openCreateModal} 
          style={{
            ...styles.btnPrimary,
            opacity: (!hasFetchedCategories || categories.length === 0) ? 0.5 : 1,
            cursor: (!hasFetchedCategories || categories.length === 0) ? 'not-allowed' : 'pointer'
          }}
          disabled={!hasFetchedCategories || categories.length === 0}
          title={!hasFetchedCategories ? 'Yükleniyor...' : categories.length === 0 ? 'Önce kategori seçmelisiniz' : 'Yeni ürün ekle'}
        >
          <FaPlus size={14} /> Yeni Ürün Ekle
        </button>
      </div>

      {/* Stats Bar */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <div style={{
          ...styles.statBadge, 
          backgroundColor: !hasFetchedCategories ? '#f1f5f9' : categories.length > 0 ? '#ecfdf5' : '#fef3c7', 
          color: !hasFetchedCategories ? '#64748b' : categories.length > 0 ? '#059669' : '#92400e'
        }}>
          <FaFolder /> {categoriesLoading ? '...' : categories.length} Seçili Kategori
        </div>
        <div style={{...styles.statBadge, backgroundColor: '#f1f5f9', color: '#475569'}}>
          <FaBox /> {products.length} Ürün
        </div>
      </div>

      {/* No Category Warning - Only show after data is loaded */}
      {hasFetchedCategories && categories.length === 0 && (
        <div style={{
          padding: '20px 24px',
          backgroundColor: '#fef3c7',
          border: '1px solid #fcd34d',
          borderRadius: '12px',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px'
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            backgroundColor: '#fde68a',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px'
          }}>
            ⚠️
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: '600', color: '#92400e', marginBottom: '4px' }}>
              Kategori Seçimi Gerekli
            </div>
            <p style={{ margin: 0, color: '#a16207', fontSize: '14px', lineHeight: '1.5' }}>
              Ürün ekleyebilmek için önce satış yapmak istediğiniz kategorileri seçmeniz gerekiyor.
            </p>
          </div>
          <a 
            href="/vendor/categories" 
            style={{
              padding: '10px 20px',
              backgroundColor: '#f59e0b',
              color: 'white',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: '600',
              fontSize: '14px',
              whiteSpace: 'nowrap'
            }}
          >
            Kategori Seç
          </a>
        </div>
      )}

      {/* Filters & Toolbar */}
      <div style={{...styles.filterContainer, alignItems: 'center', justifyContent: 'space-between'}}>
        <div style={{...styles.inputWrapper, maxWidth: '400px'}}>
          <FaSearch style={styles.inputIcon} />
          <input 
            type="text" 
            placeholder="Ürün ara..." 
            style={styles.input} 
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
          />
        </div>
        
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', fontSize: '14px' }}>
            <span>Sırala:</span>
            <select 
              value={sortOrder} 
              onChange={(e) => setSortOrder(e.target.value)}
              style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none', color: '#334155', cursor: 'pointer' }}
            >
              <option value="name_asc">İsim (A-Z)</option>
              <option value="name_desc">İsim (Z-A)</option>
              <option value="price_asc">Fiyat (Artan)</option>
              <option value="price_desc">Fiyat (Azalan)</option>
              <option value="date_desc">En Yeni</option>
              <option value="date_asc">En Eski</option>
            </select>
            <button 
              onClick={() => setSortOrder(prev => prev.endsWith('_asc') ? prev.replace('_asc', '_desc') : prev.replace('_desc', '_asc'))}
              style={{ padding: '8px', borderRadius: '8px', border: '1px solid #e2e8f0', backgroundColor: 'white', cursor: 'pointer', color: '#64748b' }}
            >
              {sortOrder.endsWith('_asc') ? <FaSortAmountUp /> : <FaSortAmountDown />}
            </button>
          </div>

          <div style={{ display: 'flex', backgroundColor: '#f1f5f9', padding: '4px', borderRadius: '8px', gap: '4px' }}>
            <button 
              onClick={() => setViewMode('grid')}
              style={{ 
                padding: '8px', borderRadius: '6px', border: 'none', cursor: 'pointer',
                backgroundColor: viewMode === 'grid' ? 'white' : 'transparent',
                color: viewMode === 'grid' ? '#059669' : '#64748b',
                boxShadow: viewMode === 'grid' ? '0 1px 2px rgba(0,0,0,0.05)' : 'none'
              }}
            >
              <FaThLarge /> Grid
            </button>
            <button 
              onClick={() => setViewMode('list')}
              style={{ 
                padding: '8px', borderRadius: '6px', border: 'none', cursor: 'pointer',
                backgroundColor: viewMode === 'list' ? 'white' : 'transparent',
                color: viewMode === 'list' ? '#059669' : '#64748b',
                boxShadow: viewMode === 'list' ? '0 1px 2px rgba(0,0,0,0.05)' : 'none'
              }}
            >
              <FaList /> Liste
            </button>
          </div>
        </div>
      </div>

      {/* Product List */}
      {viewMode === 'list' ? (
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Ürün</th>
                <th style={styles.th}>Kategori</th>
                <th style={styles.th}>Fiyat</th>
                <th style={styles.th}>Stok</th>
                <th style={styles.th}>Durum</th>
                <th style={{...styles.th, textAlign: 'right'}}>İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={6} style={{ padding: '32px', textAlign: 'center', color: '#64748b' }}>Yükleniyor...</td></tr>
              ) : sortedProducts.length === 0 ? (
                <tr><td colSpan={6} style={{ padding: '32px', textAlign: 'center', color: '#64748b' }}>Henüz ürün bulunmuyor.</td></tr>
              ) : (
                sortedProducts.map((product) => (
                  <tr key={product.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={styles.td}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{ width: '48px', height: '48px', borderRadius: '8px', backgroundColor: '#f1f5f9', border: '1px solid #e2e8f0', overflow: 'hidden', flexShrink: 0 }}>
                          <img 
                            src={toFullUrl(product.thumbnail || (product.photos?.[0]?.url)) || 'https://placehold.co/100x100?text=No+Img'} 
                            alt={product.name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            onError={(e) => { e.target.src = 'https://placehold.co/100x100?text=No+Img'; }}
                          />
                        </div>
                        <div>
                          <div style={{ fontWeight: '600', color: '#0f172a' }}>{product.name}</div>
                          <div style={{ fontSize: '12px', color: '#64748b' }}>SKU: {product.sku || '-'}</div>
                        </div>
                      </div>
                    </td>
                    <td style={styles.td}>{getCategoryName(product.category_id)}</td>
                    <td style={{...styles.td, fontWeight: '600', color: '#0f172a'}}>
                      {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(product.price || 0)}
                    </td>
                    <td style={styles.td}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: product.stock > 10 ? '#10b981' : product.stock > 0 ? '#f59e0b' : '#ef4444' }}></div>
                        <span style={{ fontSize: '14px', color: '#475569' }}>{product.stock} adet</span>
                      </div>
                    </td>
                    <td style={styles.td}>
                      <span style={{ 
                        padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600',
                        backgroundColor: product.status === 'active' ? '#d1fae5' : product.status === 'pending' ? '#fef3c7' : product.status === 'rejected' ? '#fee2e2' : product.status === 'inactive' ? '#e2e8f0' : product.status === 'banned' ? '#fecaca' : '#f1f5f9',
                        color: product.status === 'active' ? '#047857' : product.status === 'pending' ? '#b45309' : product.status === 'rejected' ? '#dc2626' : product.status === 'inactive' ? '#64748b' : product.status === 'banned' ? '#991b1b' : '#475569'
                      }}>
                        {product.status === 'active' ? 'Yayında' : product.status === 'pending' ? 'Onay Bekliyor' : product.status === 'rejected' ? 'Reddedildi' : product.status === 'inactive' ? 'Pasif' : product.status === 'banned' ? 'Yasaklı' : 'Taslak'}
                      </span>
                    </td>
                    <td style={{...styles.td, textAlign: 'right'}}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                        <button onClick={() => openViewModal(product)} style={{ padding: '8px', borderRadius: '6px', border: 'none', backgroundColor: '#f1f5f9', color: '#64748b', cursor: 'pointer' }} title="Görüntüle"><FaEye /></button>
                        <button onClick={() => openEditModal(product)} style={{ padding: '8px', borderRadius: '6px', border: 'none', backgroundColor: '#eff6ff', color: '#2563eb', cursor: 'pointer' }} title="Düzenle"><FaEdit /></button>
                        {product.status === 'active' && (
                          <button 
                            onClick={() => statusMutation.mutate({ id: product.id, status: 'inactive' })} 
                            style={{ padding: '8px', borderRadius: '6px', border: 'none', backgroundColor: '#fef3c7', color: '#b45309', cursor: 'pointer' }} 
                            title="Pasife Al"
                          >
                            <FaPause />
                          </button>
                        )}
                        {product.status === 'inactive' && (
                          <button 
                            onClick={() => statusMutation.mutate({ id: product.id, status: 'active' })} 
                            style={{ padding: '8px', borderRadius: '6px', border: 'none', backgroundColor: '#d1fae5', color: '#059669', cursor: 'pointer' }} 
                            title="Aktif Et"
                          >
                            <FaPlay />
                          </button>
                        )}
                        <button 
                          onClick={() => openConfirmModal(
                            'Ürünü Sil',
                            'Bu ürünü silmek istediğinize emin misiniz? Bu işlem geri alınamaz.',
                            () => deleteMutation.mutate(product.id)
                          )} 
                          style={{ padding: '8px', borderRadius: '6px', border: 'none', backgroundColor: '#fef2f2', color: '#dc2626', cursor: 'pointer' }} 
                          title="Sil"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '24px' }}>
          {isLoading ? (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: '#64748b' }}>Yükleniyor...</div>
          ) : sortedProducts.length === 0 ? (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: '#64748b' }}>Henüz ürün bulunmuyor.</div>
          ) : (
            sortedProducts.map((product) => (
              <div key={product.id} style={styles.gridCard}>
                <div style={{ position: 'relative' }}>
                  <img 
                    src={toFullUrl(product.thumbnail || (product.photos?.[0]?.url)) || 'https://placehold.co/300x300?text=No+Img'} 
                    alt={product.name}
                    style={styles.gridCardImg}
                    onError={(e) => { e.target.src = 'https://placehold.co/300x300?text=No+Img'; }}
                  />
                  <div style={{ position: 'absolute', top: '12px', right: '12px', display: 'flex', gap: '8px' }}>
                    <span style={{ 
                      padding: '4px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: '600',
                      backdropFilter: 'blur(4px)',
                      backgroundColor: product.status === 'active' ? 'rgba(209, 250, 229, 0.95)' : product.status === 'pending' ? 'rgba(254, 243, 199, 0.95)' : product.status === 'rejected' ? 'rgba(254, 226, 226, 0.95)' : product.status === 'inactive' ? 'rgba(226, 232, 240, 0.95)' : product.status === 'banned' ? 'rgba(254, 202, 202, 0.95)' : 'rgba(241, 245, 249, 0.95)',
                      color: product.status === 'active' ? '#047857' : product.status === 'pending' ? '#b45309' : product.status === 'rejected' ? '#dc2626' : product.status === 'inactive' ? '#475569' : product.status === 'banned' ? '#991b1b' : '#475569'
                    }}>
                      {product.status === 'active' ? 'Yayında' : product.status === 'pending' ? 'Onay Bekliyor' : product.status === 'rejected' ? 'Reddedildi' : product.status === 'inactive' ? 'Pasif' : product.status === 'banned' ? 'Yasaklı' : 'Taslak'}
                    </span>
                  </div>
                </div>
                <div style={styles.gridCardBody}>
                  <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>{getCategoryName(product.category_id)}</div>
                  <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#0f172a', marginBottom: '8px', lineHeight: '1.4' }}>{product.name}</h3>
                  <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: '18px', fontWeight: '700', color: '#059669' }}>
                      {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(product.price || 0)}
                    </div>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>Stok: {product.stock}</div>
                  </div>
                  <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #f1f5f9', display: 'flex', gap: '8px' }}>
                    <button onClick={() => openEditModal(product)} style={{ flex: 1, padding: '8px', borderRadius: '6px', border: '1px solid #e2e8f0', backgroundColor: 'white', color: '#334155', cursor: 'pointer', fontSize: '13px', fontWeight: '500' }}>Düzenle</button>
                    {product.status === 'active' && (
                      <button 
                        onClick={() => statusMutation.mutate({ id: product.id, status: 'inactive' })} 
                        style={{ padding: '8px', borderRadius: '6px', border: '1px solid #fef3c7', backgroundColor: '#fffbeb', color: '#b45309', cursor: 'pointer' }}
                        title="Pasife Al"
                      >
                        <FaPause />
                      </button>
                    )}
                    {product.status === 'inactive' && (
                      <button 
                        onClick={() => statusMutation.mutate({ id: product.id, status: 'active' })} 
                        style={{ padding: '8px', borderRadius: '6px', border: '1px solid #d1fae5', backgroundColor: '#ecfdf5', color: '#059669', cursor: 'pointer' }}
                        title="Aktif Et"
                      >
                        <FaPlay />
                      </button>
                    )}
                    <button 
                      onClick={() => openConfirmModal(
                        'Ürünü Sil',
                        'Bu ürünü silmek istediğinize emin misiniz?',
                        () => deleteMutation.mutate(product.id)
                      )} 
                      style={{ padding: '8px', borderRadius: '6px', border: '1px solid #fee2e2', backgroundColor: '#fef2f2', color: '#dc2626', cursor: 'pointer' }}
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Pagination */}
      {paginationMeta && paginationMeta.last_page > 1 && (
        <Pagination
          currentPage={paginationMeta.current_page}
          totalPages={paginationMeta.last_page}
          totalItems={paginationMeta.total}
          perPage={paginationMeta.per_page}
          onPageChange={(page) => setCurrentPage(page)}
          showInfo={true}
          showFirstLast={true}
        />
      )}

      {/* Modal */}
      {isModalOpen && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            {/* Modal Header */}
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>
                {modalMode === 'create' ? 'Yeni Ürün Ekle' : modalMode === 'edit' ? 'Ürünü Düzenle' : 'Ürün Detayı'}
              </h2>
              <button onClick={closeModal} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}><FaTimes size={20} /></button>
            </div>

            {/* Modal Body */}
            <div style={styles.modalBody}>
              {/* Sidebar Tabs */}
              <div style={styles.sidebar}>
                <button onClick={() => setActiveTab('general')} style={styles.tabBtn(activeTab === 'general')}>
                  <FaBox /> Genel Bilgiler
                </button>
                <button onClick={() => setActiveTab('pricing')} style={styles.tabBtn(activeTab === 'pricing')}>
                  <FaTag /> Fiyat & Stok
                </button>
                <button onClick={() => setActiveTab('media')} style={styles.tabBtn(activeTab === 'media')}>
                  <FaImages /> Medya
                </button>
                <button onClick={() => setActiveTab('variants')} style={styles.tabBtn(activeTab === 'variants')}>
                  <FaList /> Varyantlar
                </button>
                <button onClick={() => setActiveTab('settings')} style={styles.tabBtn(activeTab === 'settings')}>
                  <FaCog /> Ayarlar
                </button>
              </div>

              {/* Content Area */}
              <div style={styles.contentArea}>
                <form id="product-form" onSubmit={handleSubmit}>
                  {/* General Tab */}
                  {activeTab === 'general' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                      <div style={styles.grid2}>
                        <div style={{ gridColumn: '1 / -1' }}>
                          <label style={styles.label}>Ürün Adı *</label>
                          <input 
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            disabled={modalMode === 'view'}
                            style={styles.formInput}
                            placeholder="Örn: Kablosuz Kulaklık"
                            minLength={2}
                          />
                        </div>
                        <div>
                          <label style={styles.label}>Kategori *</label>
                          {categories.length === 0 ? (
                            <div style={{
                              padding: '12px 16px',
                              backgroundColor: '#fef3c7',
                              border: '1px solid #fcd34d',
                              borderRadius: '8px',
                              fontSize: '14px',
                              color: '#92400e'
                            }}>
                              ⚠️ Henüz kategori seçmediniz. Ürün eklemeden önce{' '}
                              <a href="/vendor/categories" style={{ color: '#d97706', fontWeight: '600' }}>
                                Kategoriler
                              </a>{' '}
                              sayfasından satış yapacağınız kategorileri seçin.
                            </div>
                          ) : (
                            <select 
                              required
                              value={formData.category_id}
                              onChange={(e) => setFormData({...formData, category_id: e.target.value})}
                              disabled={modalMode === 'view'}
                              style={{...styles.formInput, borderColor: !formData.category_id && modalMode !== 'view' ? '#fca5a5' : '#e2e8f0'}}
                            >
                              <option value="">Kategori Seçiniz</option>
                              {groupedCategories.map(group => (
                                group.children.length > 0 ? (
                                  <optgroup key={group.parent.id || group.parent.name} label={`📁 ${group.parent.name}`}>
                                    {/* Parent category itself if selectable */}
                                    {group.parent.id && (
                                      <option value={group.parent.id}>
                                        {group.parent.name} (Ana Kategori)
                                      </option>
                                    )}
                                    {/* Child categories */}
                                    {group.children.map(child => (
                                      <option key={child.id} value={child.id}>
                                        ↳ {child.name}
                                      </option>
                                    ))}
                                  </optgroup>
                                ) : (
                                  // Single category without children
                                  <option key={group.parent.id} value={group.parent.id}>
                                    📁 {group.parent.name}
                                  </option>
                                )
                              ))}
                            </select>
                          )}
                          {/* Show selected category path */}
                          {formData.category_id && categories.length > 0 && (() => {
                            const selected = categories.find(c => c.id == formData.category_id);
                            if (!selected) return null;
                            return (
                              <div style={{
                                marginTop: '8px',
                                padding: '8px 12px',
                                backgroundColor: '#f0fdf4',
                                border: '1px solid #bbf7d0',
                                borderRadius: '6px',
                                fontSize: '13px',
                                color: '#166534',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px'
                              }}>
                                <FaCheck size={12} />
                                <span>
                                  {selected.parent 
                                    ? <><strong>{selected.parent.name}</strong> → {selected.name}</>
                                    : <strong>{selected.name}</strong>
                                  }
                                </span>
                              </div>
                            );
                          })()}
                        </div>
                        <div>
                          <label style={styles.label}>Ürün Tipi</label>
                          <select 
                            value={formData.type}
                            onChange={(e) => setFormData({...formData, type: e.target.value})}
                            disabled={modalMode === 'view'}
                            style={styles.formInput}
                          >
                            <option value="simple">Basit Ürün</option>
                            <option value="variable">Varyantlı Ürün</option>
                          </select>
                        </div>
                        <div style={{ gridColumn: '1 / -1' }}>
                          <label style={styles.label}>Kısa Açıklama</label>
                          <textarea 
                            value={formData.short_description}
                            onChange={(e) => setFormData({...formData, short_description: e.target.value})}
                            disabled={modalMode === 'view'}
                            rows={2}
                            style={{...styles.formInput, resize: 'none'}}
                          />
                        </div>
                        <div style={{ gridColumn: '1 / -1' }}>
                          <label style={styles.label}>Detaylı Açıklama</label>
                          <textarea 
                            value={formData.description}
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                            disabled={modalMode === 'view'}
                            rows={5}
                            style={styles.formInput}
                          />
                        </div>
                        <div style={{ gridColumn: '1 / -1' }}>
                          <label style={styles.label}>Etiketler <span style={{fontWeight: 400, color: '#94a3b8'}}>(Opsiyonel)</span></label>
                          <div style={{
                            border: '1px solid #e2e8f0',
                            borderRadius: '8px',
                            padding: '8px 12px',
                            minHeight: '44px',
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: '8px',
                            alignItems: 'center',
                            backgroundColor: modalMode === 'view' ? '#f8fafc' : 'white'
                          }}>
                            {formData.tags.map((tag, i) => (
                              <span key={i} style={{ 
                                backgroundColor: '#059669', 
                                color: 'white', 
                                padding: '4px 10px', 
                                borderRadius: '16px', 
                                fontSize: '13px', 
                                fontWeight: '500',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px'
                              }}>
                                #{tag}
                                {modalMode !== 'view' && (
                                  <button
                                    type="button"
                                    onClick={() => setFormData(prev => ({...prev, tags: prev.tags.filter((_, idx) => idx !== i)}))}
                                    style={{
                                      background: 'rgba(255,255,255,0.3)',
                                      border: 'none',
                                      borderRadius: '50%',
                                      width: '16px',
                                      height: '16px',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      cursor: 'pointer',
                                      color: 'white',
                                      fontSize: '10px',
                                      padding: 0,
                                      lineHeight: 1
                                    }}
                                  >
                                    ×
                                  </button>
                                )}
                              </span>
                            ))}
                            {modalMode !== 'view' && (
                              <input 
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                onKeyDown={(e) => {
                                  if ((e.key === 'Enter' || e.key === ',') && tagInput.trim()) {
                                    e.preventDefault();
                                    const newTag = tagInput.trim().replace(/,/g, '');
                                    if (newTag && !formData.tags.includes(newTag)) {
                                      setFormData(prev => ({...prev, tags: [...prev.tags, newTag]}));
                                    }
                                    setTagInput('');
                                  }
                                  if (e.key === 'Backspace' && !tagInput && formData.tags.length > 0) {
                                    setFormData(prev => ({...prev, tags: prev.tags.slice(0, -1)}));
                                  }
                                }}
                                style={{
                                  border: 'none',
                                  outline: 'none',
                                  flex: 1,
                                  minWidth: '120px',
                                  fontSize: '14px',
                                  padding: '4px 0'
                                }}
                                placeholder={formData.tags.length === 0 ? "Etiket yazıp Enter'a basın..." : ''}
                              />
                            )}
                          </div>
                          <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>Enter veya virgül ile etiket ekleyin, Backspace ile son etiketi silin</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Pricing Tab */}
                  {activeTab === 'pricing' && (
                    <div>
                      {formData.type === 'variable' ? (
                        <div style={{ padding: '16px', backgroundColor: '#fffbeb', color: '#92400e', borderRadius: '8px', fontSize: '14px' }}>
                          ℹ️ Bu ürün varyantlı olduğu için fiyat ve stok bilgileri <strong>Varyantlar</strong> sekmesinden yönetilir.
                        </div>
                      ) : (
                        <div style={styles.grid2}>
                          <div>
                            <label style={styles.label}>Satış Fiyatı *</label>
                            <div style={{ position: 'relative' }}>
                              <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>₺</span>
                              <input 
                                type="number"
                                required
                                min="0.01"
                                step="0.01"
                                value={formData.price}
                                onChange={(e) => setFormData({...formData, price: e.target.value})}
                                disabled={modalMode === 'view'}
                                style={{...styles.formInput, paddingLeft: '32px', borderColor: (!formData.price || parseFloat(formData.price) <= 0) && modalMode !== 'view' ? '#fca5a5' : '#e2e8f0'}}
                                placeholder="0.00"
                              />
                            </div>
                          </div>
                          <div>
                            <label style={styles.label}>
                              Stok Sayısı *
                              <span style={{fontWeight: 400, color: '#64748b', fontSize: '12px', marginLeft: '8px'}}>
                                (Mevcut stok adedi)
                              </span>
                            </label>
                            <input 
                              type="number"
                              required
                              min="0"
                              value={formData.stock}
                              onChange={(e) => setFormData({...formData, stock: e.target.value})}
                              disabled={modalMode === 'view'}
                              style={styles.formInput}
                              placeholder="Örn: 100"
                            />
                          </div>
                          <div>
                            <label style={styles.label}>
                              Birim
                              <span style={{fontWeight: 400, color: '#64748b', fontSize: '12px', marginLeft: '8px'}}>
                                (Ürün satış birimi)
                              </span>
                            </label>
                            <select 
                              value={formData.unit_id}
                              onChange={(e) => setFormData({...formData, unit_id: e.target.value})}
                              disabled={modalMode === 'view'}
                              style={styles.formInput}
                            >
                              <option value="">Adet (Varsayılan)</option>
                              {units.map(u => <option key={u.id} value={u.id}>{u.name} ({u.symbol})</option>)}
                            </select>
                            <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>
                              Örn: Adet, Kg, Litre, Metre vb.
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Media Tab */}
                  {activeTab === 'media' && (
                    <div>
                      {/* Existing Images (Edit/View Mode) */}
                      {(modalMode === 'view' || modalMode === 'edit') && selectedProduct?.photos?.length > 0 && (
                        <div style={{ marginBottom: '24px' }}>
                           <h4 style={{fontSize: '14px', fontWeight: '600', marginBottom: '12px'}}>Mevcut Görseller</h4>
                           <div style={styles.grid4}>
                            {selectedProduct.photos.map((photo, idx) => (
                              <div key={photo.id || idx} style={{ position: 'relative', aspectRatio: '1/1', borderRadius: '8px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                                <img 
                                  src={toFullUrl(photo.url)} 
                                  alt="" 
                                  style={{ width: '100%', height: '100%', objectFit: 'cover', cursor: 'pointer' }} 
                                  onClick={() => setLightboxImage(toFullUrl(photo.url))}
                                />
                                {modalMode === 'edit' && (
                                  <button 
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      openConfirmModal(
                                        'Fotoğrafı Sil',
                                        'Bu fotoğrafı silmek istediğinize emin misiniz? Bu işlem geri alınamaz.',
                                        () => deletePhotoMutation.mutate({ productId: selectedProduct.id, photoId: photo.id })
                                      );
                                    }}
                                    style={{
                                      position: 'absolute', top: '4px', right: '4px', 
                                      backgroundColor: 'rgba(255,255,255,0.9)', color: '#ef4444', 
                                      border: 'none', borderRadius: '50%', width: '24px', height: '24px', 
                                      display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                                      zIndex: 10
                                    }}
                                  >
                                    <FaTimes size={12} />
                                  </button>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {modalMode !== 'view' && (
                        <div>
                          <div style={styles.uploadBox}>
                            <input 
                              type="file" 
                              multiple 
                              accept="image/*"
                              onChange={handleImageChange}
                              style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }}
                            />
                            <FaImages size={40} color="#cbd5e1" style={{ marginBottom: '16px' }} />
                            <p style={{ color: '#475569', fontWeight: '500' }}>Fotoğrafları buraya sürükleyin veya seçin</p>
                            <p style={{ color: '#94a3b8', fontSize: '12px', marginTop: '4px' }}>PNG, JPG, WEBP (Max 5MB)</p>
                          </div>

                          {/* New Images Preview */}
                          {formData.images.length > 0 && (
                            <div style={{ marginTop: '24px' }}>
                              <h4 style={{fontSize: '14px', fontWeight: '600', marginBottom: '12px'}}>Seçilen Görseller ({formData.images.length})</h4>
                              <div style={styles.grid4}>
                                {formData.images.map((file, idx) => (
                                  <div key={idx} style={{ position: 'relative', aspectRatio: '1/1', borderRadius: '8px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                                    <img 
                                      src={URL.createObjectURL(file)} 
                                      alt={`preview-${idx}`} 
                                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                                    />
                                    <button 
                                      type="button"
                                      onClick={() => removeImage(idx)}
                                      style={{
                                        position: 'absolute', top: '4px', right: '4px', 
                                        backgroundColor: 'rgba(255,255,255,0.9)', color: '#ef4444', 
                                        border: 'none', borderRadius: '50%', width: '24px', height: '24px', 
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
                                      }}
                                    >
                                      <FaTimes size={12} />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Variants Tab */}
                  {activeTab === 'variants' && (
                    <div>
                      {formData.type !== 'variable' ? (
                        <div style={{ padding: '16px', backgroundColor: '#f1f5f9', color: '#475569', borderRadius: '8px', fontSize: '14px' }}>
                          ℹ️ Varyant eklemek için <strong>Genel Bilgiler</strong> sekmesinden ürün tipini "Varyantlı Ürün" olarak seçmelisiniz.
                        </div>
                      ) : (
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                            <div>
                              <h3 style={{ fontWeight: '600', color: '#0f172a', marginBottom: '4px' }}>Ürün Varyantları</h3>
                              <p style={{ fontSize: '13px', color: '#64748b' }}>
                                Renk, beden gibi farklı seçenekler için varyant ekleyin. Her varyantın kendi fiyatı ve stoğu olabilir.
                              </p>
                            </div>
                            {modalMode !== 'view' && (
                              <button 
                                type="button" 
                                onClick={addVariant}
                                style={{ fontSize: '14px', color: '#059669', fontWeight: '600', background: 'none', border: 'none', cursor: 'pointer' }}
                              >
                                + Varyant Ekle
                              </button>
                            )}
                          </div>
                          
                          {/* Column Headers */}
                          {formData.variants.length > 0 && (
                            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr', gap: '8px', marginBottom: '8px', paddingLeft: '8px', paddingRight: '32px' }}>
                              <span style={{ fontSize: '12px', fontWeight: '600', color: '#64748b' }}>Varyant Adı</span>
                              <span style={{ fontSize: '12px', fontWeight: '600', color: '#64748b' }}>SKU (Stok Kodu)</span>
                              <span style={{ fontSize: '12px', fontWeight: '600', color: '#64748b' }}>Fiyat (₺)</span>
                              <span style={{ fontSize: '12px', fontWeight: '600', color: '#64748b' }}>Stok Sayısı</span>
                              <span style={{ fontSize: '12px', fontWeight: '600', color: '#64748b' }}>Birim</span>
                            </div>
                          )}
                          
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {formData.variants.map((variant, idx) => (
                              <div key={idx} style={styles.variantCard}>
                                {modalMode !== 'view' && (
                                  <button 
                                    type="button" 
                                    onClick={() => removeVariant(idx)}
                                    style={{ position: 'absolute', top: '8px', right: '8px', color: '#94a3b8', background: 'none', border: 'none', cursor: 'pointer' }}
                                  >
                                    <FaTimes />
                                  </button>
                                )}
                                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr', gap: '8px' }}>
                                  <input 
                                    placeholder="Örn: Kırmızı - L"
                                    value={variant.title}
                                    onChange={(e) => handleVariantChange(idx, 'title', e.target.value)}
                                    disabled={modalMode === 'view'}
                                    style={styles.formInput}
                                  />
                                  <input 
                                    placeholder="Örn: PRD-RED-L"
                                    value={variant.sku}
                                    onChange={(e) => handleVariantChange(idx, 'sku', e.target.value)}
                                    disabled={modalMode === 'view'}
                                    style={styles.formInput}
                                  />
                                  <input 
                                    placeholder="0.00"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={variant.price}
                                    onChange={(e) => handleVariantChange(idx, 'price', e.target.value)}
                                    disabled={modalMode === 'view'}
                                    style={styles.formInput}
                                  />
                                  <input 
                                    placeholder="0"
                                    type="number"
                                    min="0"
                                    value={variant.stock}
                                    onChange={(e) => handleVariantChange(idx, 'stock', e.target.value)}
                                    disabled={modalMode === 'view'}
                                    style={styles.formInput}
                                  />
                                  <select 
                                    value={variant.unit_id || ''}
                                    onChange={(e) => handleVariantChange(idx, 'unit_id', e.target.value)}
                                    disabled={modalMode === 'view'}
                                    style={styles.formInput}
                                  >
                                    <option value="">Adet</option>
                                    {units.map(u => <option key={u.id} value={u.id}>{u.symbol}</option>)}
                                  </select>
                                </div>
                              </div>
                            ))}
                            
                            {formData.variants.length === 0 && (
                              <div style={{ 
                                padding: '32px', 
                                textAlign: 'center', 
                                backgroundColor: '#f8fafc', 
                                borderRadius: '8px',
                                border: '2px dashed #e2e8f0'
                              }}>
                                <p style={{ color: '#64748b', marginBottom: '12px' }}>Henüz varyant eklenmemiş</p>
                                {modalMode !== 'view' && (
                                  <button 
                                    type="button" 
                                    onClick={addVariant}
                                    style={{ 
                                      padding: '8px 16px',
                                      backgroundColor: '#059669',
                                      color: 'white',
                                      border: 'none',
                                      borderRadius: '6px',
                                      cursor: 'pointer',
                                      fontWeight: '500'
                                    }}
                                  >
                                    + İlk Varyantı Ekle
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Settings Tab */}
                  {activeTab === 'settings' && (
                    <div>
                      <div style={{ padding: '16px', backgroundColor: '#f1f5f9', color: '#475569', borderRadius: '8px', fontSize: '14px', marginBottom: '20px' }}>
                        <p style={{ marginBottom: '8px' }}><strong>Ürün Ayarları ve Metadata</strong></p>
                        <p>Bu özellikler şu anda geliştirme aşamasındadır. İlerleyen güncellemelerde buradan ürününüze özel ayarları ve meta verileri yönetebileceksiniz.</p>
                      </div>
                      {/* Placeholder for future implementation */}
                      <div style={{ opacity: 0.5, pointerEvents: 'none' }}>
                        <div style={styles.grid2}>
                          <div>
                            <label style={styles.label}>Öne Çıkar</label>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <input 
                                type="checkbox" 
                                checked={formData.is_featured}
                                onChange={(e) => setFormData({...formData, is_featured: e.target.checked})}
                                style={{ width: '16px', height: '16px' }}
                              />
                              <span style={{ fontSize: '14px', color: '#475569' }}>Bu ürünü mağaza vitrininde öne çıkar</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </form>
              </div>
            </div>

            {/* Modal Footer */}
            <div style={styles.modalFooter}>
              <button 
                onClick={closeModal}
                style={styles.btnSecondary}
              >
                Kapat
              </button>
              {modalMode !== 'view' && (
                <button 
                  onClick={handleSubmit}
                  style={styles.btnPrimary}
                >
                  <FaSave /> {modalMode === 'create' ? 'Kaydet' : 'Güncelle'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
      {/* Confirm Modal */}
      {confirmModal.isOpen && (
        <div style={{
          position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1400,
          display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)'
        }}>
          <div style={{
            backgroundColor: 'white', width: '100%', maxWidth: '400px', borderRadius: '12px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)', overflow: 'hidden', padding: '24px'
          }}>
            <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#0f172a', marginBottom: '8px' }}>{confirmModal.title}</h3>
            <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '24px', lineHeight: '1.5' }}>{confirmModal.message}</p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button 
                onClick={closeConfirmModal}
                style={{
                  padding: '8px 16px', borderRadius: '8px', border: '1px solid #e2e8f0',
                  backgroundColor: 'white', color: '#64748b', fontWeight: '600', cursor: 'pointer'
                }}
              >
                İptal
              </button>
              <button 
                onClick={() => {
                  confirmModal.onConfirm();
                  closeConfirmModal();
                }}
                style={{
                  padding: '8px 16px', borderRadius: '8px', border: 'none',
                  backgroundColor: '#ef4444', color: 'white', fontWeight: '600', cursor: 'pointer'
                }}
              >
                Sil
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox */}
      {lightboxImage && (
        <div 
          style={{
            position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.9)', zIndex: 1300,
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px'
          }}
          onClick={() => setLightboxImage(null)}
        >
          <button 
            style={{
              position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', 
              color: 'white', cursor: 'pointer'
            }}
            onClick={() => setLightboxImage(null)}
          >
            <FaTimes size={32} />
          </button>
          <img 
            src={lightboxImage} 
            alt="Full size" 
            style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} 
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
};

export default VendorProducts;
