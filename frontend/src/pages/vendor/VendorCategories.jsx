import React, { useState, useMemo } from 'react';
import { FaPlus, FaTrash, FaSearch, FaEdit, FaTags, FaLayerGroup, FaTimes, FaSortAmountDown, FaSortAmountUp, FaCheck, FaToggleOn, FaToggleOff, FaChevronRight, FaBox, FaFolderOpen } from 'react-icons/fa';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getVendorCategories, createVendorCategory, updateVendorCategory, deleteVendorCategory, toggleVendorCategoryActive } from '../../features/vendor/api/categoryApi';
import { useToast } from '../../components/Toast';

export default function VendorCategories() {
  const qc = useQueryClient();
  const toast = useToast();
  const { data, isLoading, isError } = useQuery({ queryKey: ['vendorCategories'], queryFn: getVendorCategories });
  
  // State'ler
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [parentId, setParentId] = useState('');
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editParentId, setEditParentId] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('name'); // name, date
  const [sortOrder, setSortOrder] = useState('asc');
  const [viewMode, setViewMode] = useState('grid'); // grid, list

  const createMutation = useMutation({
    mutationFn: (payload) => createVendorCategory(payload),
    onSuccess: () => {
      qc.invalidateQueries(['vendorCategories']);
      setName('');
      setDescription('');
      setParentId('');
      setModalOpen(false);
      toast.success('Kategori Oluşturuldu', 'Yeni kategori başarıyla eklendi.', 3000);
    },
    onError: (err) => {
      toast.error('Kategori Oluşturulamadı', err?.response?.data?.message || 'Bir hata oluştu', 4000);
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }) => updateVendorCategory(id, payload),
    onSuccess: () => {
      qc.invalidateQueries(['vendorCategories']);
      setEditModalOpen(false);
      setSelectedCategory(null);
      toast.success('Kategori Güncellendi', 'Kategori başarıyla güncellendi.', 3000);
    },
    onError: (err) => {
      toast.error('Güncellenemedi', err?.response?.data?.message || 'Kategori güncellenirken hata oluştu', 4000);
    }
  });

  const toggleActiveMutation = useMutation({
    mutationFn: (id) => toggleVendorCategoryActive(id),
    onSuccess: () => {
      qc.invalidateQueries(['vendorCategories']);
      toast.success('Durum Güncellendi', 'Kategori durumu değiştirildi.', 3000);
    },
    onError: (err) => {
      toast.error('Hata', err?.response?.data?.message || 'Durum değiştirilemedi', 4000);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteVendorCategory(id),
    onSuccess: () => {
      qc.invalidateQueries(['vendorCategories']);
      setDeleteModalOpen(false);
      setSelectedCategory(null);
      toast.success('Kategori Silindi', 'Kategori başarıyla silindi.', 3000);
    },
    onError: (err) => {
      toast.error('Silinemedi', err?.response?.data?.message || 'Kategori silinirken hata oluştu', 4000);
    }
  });

  const handleCreate = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.warning('Uyarı', 'Kategori adı boş olamaz', 3000);
      return;
    }
    createMutation.mutate({ 
      name, 
      description,
      parent_id: parentId || null
    });
  };

  const handleEditClick = (category) => {
    setSelectedCategory(category);
    setEditName(category.name);
    setEditDescription(category.description || '');
    setEditParentId(category.parent_id || '');
    setEditModalOpen(true);
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    if (!editName.trim()) {
      toast.warning('Uyarı', 'Kategori adı boş olamaz', 3000);
      return;
    }
    updateMutation.mutate({
      id: selectedCategory.id,
      payload: {
        name: editName,
        description: editDescription,
        parent_id: editParentId || null
      }
    });
  };

  const handleDeleteClick = (category) => {
    setSelectedCategory(category);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (selectedCategory) {
      deleteMutation.mutate(selectedCategory.id);
    }
  };

  const handleToggleActive = (category) => {
    toggleActiveMutation.mutate(category.id);
  };

  const items = data?.data?.data ?? data?.data ?? [];

  // Get root categories for parent selection
  const rootCategories = useMemo(() => {
    return items.filter(item => !item.parent_id);
  }, [items]);

  // Get available parents for edit (exclude self and children)
  const getAvailableParents = (categoryId) => {
    const getChildIds = (id) => {
      const children = items.filter(item => item.parent_id === id);
      let ids = [id];
      children.forEach(child => {
        ids = [...ids, ...getChildIds(child.id)];
      });
      return ids;
    };
    
    const excludeIds = getChildIds(categoryId);
    return items.filter(item => !excludeIds.includes(item.id));
  };

  // Arama ve sıralama
  const filteredAndSortedItems = useMemo(() => {
    let result = [...items];
    
    // Arama filtresi
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(item => 
        item.name?.toLowerCase().includes(query) ||
        item.slug?.toLowerCase().includes(query) ||
        item.description?.toLowerCase().includes(query)
      );
    }
    
    // Sıralama
    result.sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'name') {
        comparison = (a.name || '').localeCompare(b.name || '');
      } else if (sortBy === 'date') {
        comparison = new Date(a.created_at) - new Date(b.created_at);
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });
    
    return result;
  }, [items, searchQuery, sortBy, sortOrder]);

  // Stats
  const stats = useMemo(() => {
    const total = items.length;
    const active = items.filter(i => i.is_active !== false).length;
    const inactive = total - active;
    const parents = items.filter(i => !i.parent_id).length;
    const children = items.filter(i => i.parent_id).length;
    const totalProducts = items.reduce((sum, i) => sum + (i.products_count || 0), 0);
    return { total, active, inactive, parents, children, totalProducts };
  }, [items]);

  // Stiller
  const styles = {
    container: {
      padding: '32px',
      maxWidth: '1400px',
      margin: '0 auto',
    },
    header: {
      marginBottom: '32px',
    },
    headerTop: {
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      marginBottom: '24px',
      flexWrap: 'wrap',
      gap: '16px',
    },
    titleSection: {},
    title: {
      fontSize: '28px',
      fontWeight: '700',
      color: '#1f2937',
      marginBottom: '8px',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
    },
    titleIcon: {
      width: '40px',
      height: '40px',
      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      borderRadius: '12px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
    },
    subtitle: {
      fontSize: '15px',
      color: '#6b7280',
      lineHeight: '1.5',
    },
    statsRow: {
      display: 'flex',
      gap: '12px',
      marginTop: '16px',
      flexWrap: 'wrap',
    },
    statBadge: (color = 'green') => ({
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      padding: '6px 12px',
      background: color === 'green' ? '#ecfdf5' : color === 'blue' ? '#eff6ff' : color === 'orange' ? '#fff7ed' : '#f3f4f6',
      color: color === 'green' ? '#059669' : color === 'blue' ? '#2563eb' : color === 'orange' ? '#ea580c' : '#6b7280',
      borderRadius: '20px',
      fontSize: '13px',
      fontWeight: '500',
    }),
    addButton: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '12px 24px',
      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      color: 'white',
      border: 'none',
      borderRadius: '12px',
      fontSize: '15px',
      fontWeight: '600',
      cursor: 'pointer',
      boxShadow: '0 4px 14px rgba(16, 185, 129, 0.35)',
      transition: 'all 0.2s ease',
    },
    toolbar: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '16px 20px',
      background: 'white',
      borderRadius: '16px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
      flexWrap: 'wrap',
    },
    searchWrapper: {
      flex: '1',
      minWidth: '250px',
      position: 'relative',
    },
    searchIcon: {
      position: 'absolute',
      left: '14px',
      top: '50%',
      transform: 'translateY(-50%)',
      color: '#9ca3af',
      fontSize: '14px',
    },
    searchInput: {
      width: '100%',
      padding: '12px 14px 12px 42px',
      border: '2px solid #e5e7eb',
      borderRadius: '10px',
      fontSize: '14px',
      transition: 'all 0.2s ease',
      outline: 'none',
    },
    filterGroup: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    filterLabel: {
      fontSize: '13px',
      color: '#6b7280',
      fontWeight: '500',
    },
    select: {
      padding: '10px 14px',
      border: '2px solid #e5e7eb',
      borderRadius: '10px',
      fontSize: '14px',
      color: '#374151',
      background: 'white',
      cursor: 'pointer',
      outline: 'none',
    },
    sortButton: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '40px',
      height: '40px',
      border: '2px solid #e5e7eb',
      borderRadius: '10px',
      background: 'white',
      cursor: 'pointer',
      color: '#6b7280',
      transition: 'all 0.2s ease',
    },
    viewToggle: {
      display: 'flex',
      border: '2px solid #e5e7eb',
      borderRadius: '10px',
      overflow: 'hidden',
    },
    viewButton: (active) => ({
      padding: '10px 14px',
      border: 'none',
      background: active ? '#10b981' : 'white',
      color: active ? 'white' : '#6b7280',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
    }),
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
      gap: '20px',
      marginTop: '24px',
    },
    list: {
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      marginTop: '24px',
    },
    card: (isActive = true) => ({
      background: 'white',
      borderRadius: '16px',
      padding: '24px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
      transition: 'all 0.2s ease',
      border: isActive ? '1px solid #f3f4f6' : '2px solid #fecaca',
      opacity: isActive ? 1 : 0.7,
    }),
    cardHeader: {
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      marginBottom: '16px',
    },
    cardIcon: (isChild = false) => ({
      width: '48px',
      height: '48px',
      background: isChild 
        ? 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)'
        : 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)',
      borderRadius: '12px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: isChild ? '#d97706' : '#059669',
      fontSize: '20px',
    }),
    cardActions: {
      display: 'flex',
      gap: '8px',
    },
    actionButton: (color) => ({
      width: '36px',
      height: '36px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      border: 'none',
      borderRadius: '10px',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      background: color === 'red' ? '#fef2f2' : color === 'blue' ? '#eff6ff' : color === 'green' ? '#ecfdf5' : '#f3f4f6',
      color: color === 'red' ? '#dc2626' : color === 'blue' ? '#2563eb' : color === 'green' ? '#059669' : '#6b7280',
    }),
    cardName: {
      fontSize: '18px',
      fontWeight: '600',
      color: '#1f2937',
      marginBottom: '4px',
    },
    cardSlug: {
      fontSize: '13px',
      color: '#9ca3af',
      fontFamily: 'monospace',
      background: '#f9fafb',
      padding: '4px 8px',
      borderRadius: '6px',
      display: 'inline-block',
    },
    cardDescription: {
      fontSize: '14px',
      color: '#6b7280',
      marginTop: '12px',
      lineHeight: '1.5',
    },
    cardMeta: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      marginTop: '12px',
      flexWrap: 'wrap',
    },
    metaBadge: (color = 'gray') => ({
      display: 'inline-flex',
      alignItems: 'center',
      gap: '4px',
      padding: '4px 10px',
      background: color === 'blue' ? '#eff6ff' : color === 'orange' ? '#fff7ed' : color === 'green' ? '#ecfdf5' : '#f9fafb',
      color: color === 'blue' ? '#2563eb' : color === 'orange' ? '#ea580c' : color === 'green' ? '#059669' : '#6b7280',
      borderRadius: '6px',
      fontSize: '12px',
      fontWeight: '500',
    }),
    cardFooter: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: '16px',
      paddingTop: '16px',
      borderTop: '1px solid #f3f4f6',
    },
    cardDate: {
      fontSize: '12px',
      color: '#9ca3af',
    },
    statusBadge: (isActive) => ({
      display: 'inline-flex',
      alignItems: 'center',
      gap: '4px',
      padding: '4px 10px',
      background: isActive ? '#ecfdf5' : '#fef2f2',
      color: isActive ? '#059669' : '#dc2626',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: '500',
    }),
    listCard: (isActive = true) => ({
      background: 'white',
      borderRadius: '12px',
      padding: '16px 24px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      border: isActive ? '1px solid #f3f4f6' : '2px solid #fecaca',
      transition: 'all 0.2s ease',
      opacity: isActive ? 1 : 0.7,
    }),
    listCardLeft: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      flex: 1,
    },
    listCardInfo: {
      display: 'flex',
      flexDirection: 'column',
      gap: '4px',
    },
    listCardMeta: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
    },
    emptyState: {
      textAlign: 'center',
      padding: '60px 24px',
      background: 'white',
      borderRadius: '16px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
      marginTop: '24px',
    },
    emptyIcon: {
      width: '80px',
      height: '80px',
      background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)',
      borderRadius: '20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto 24px',
      color: '#059669',
      fontSize: '32px',
    },
    emptyTitle: {
      fontSize: '20px',
      fontWeight: '600',
      color: '#1f2937',
      marginBottom: '8px',
    },
    emptyText: {
      fontSize: '15px',
      color: '#6b7280',
      marginBottom: '24px',
    },
    modal: {
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.5)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px',
    },
    modalContent: {
      background: 'white',
      borderRadius: '20px',
      padding: '32px',
      width: '100%',
      maxWidth: '480px',
      boxShadow: '0 25px 50px rgba(0,0,0,0.15)',
    },
    modalHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '24px',
    },
    modalTitle: {
      fontSize: '20px',
      fontWeight: '700',
      color: '#1f2937',
    },
    modalClose: {
      width: '36px',
      height: '36px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      border: 'none',
      borderRadius: '10px',
      background: '#f3f4f6',
      color: '#6b7280',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
    },
    formGroup: {
      marginBottom: '20px',
    },
    label: {
      display: 'block',
      fontSize: '14px',
      fontWeight: '600',
      color: '#374151',
      marginBottom: '8px',
    },
    input: {
      width: '100%',
      padding: '14px 16px',
      border: '2px solid #e5e7eb',
      borderRadius: '12px',
      fontSize: '15px',
      outline: 'none',
      transition: 'all 0.2s ease',
      boxSizing: 'border-box',
    },
    textarea: {
      width: '100%',
      padding: '14px 16px',
      border: '2px solid #e5e7eb',
      borderRadius: '12px',
      fontSize: '15px',
      outline: 'none',
      transition: 'all 0.2s ease',
      minHeight: '100px',
      resize: 'vertical',
      boxSizing: 'border-box',
      fontFamily: 'inherit',
    },
    modalActions: {
      display: 'flex',
      gap: '12px',
      marginTop: '24px',
    },
    cancelButton: {
      flex: '1',
      padding: '14px',
      border: '2px solid #e5e7eb',
      borderRadius: '12px',
      background: 'white',
      color: '#6b7280',
      fontSize: '15px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
    },
    submitButton: {
      flex: '1',
      padding: '14px',
      border: 'none',
      borderRadius: '12px',
      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      color: 'white',
      fontSize: '15px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
    },
    deleteModalContent: {
      background: 'white',
      borderRadius: '20px',
      padding: '32px',
      width: '100%',
      maxWidth: '400px',
      textAlign: 'center',
    },
    deleteIcon: {
      width: '64px',
      height: '64px',
      background: '#fef2f2',
      borderRadius: '16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto 20px',
      color: '#dc2626',
      fontSize: '28px',
    },
    deleteTitle: {
      fontSize: '20px',
      fontWeight: '700',
      color: '#1f2937',
      marginBottom: '8px',
    },
    deleteText: {
      fontSize: '15px',
      color: '#6b7280',
      marginBottom: '24px',
    },
    deleteName: {
      fontWeight: '600',
      color: '#1f2937',
    },
    deleteActions: {
      display: 'flex',
      gap: '12px',
    },
    deleteButton: {
      flex: '1',
      padding: '14px',
      border: 'none',
      borderRadius: '12px',
      background: '#dc2626',
      color: 'white',
      fontSize: '15px',
      fontWeight: '600',
      cursor: 'pointer',
    },
    loadingCard: {
      background: 'white',
      borderRadius: '16px',
      padding: '24px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
      border: '1px solid #f3f4f6',
    },
    skeleton: {
      background: 'linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%)',
      backgroundSize: '200% 100%',
      animation: 'shimmer 1.5s infinite',
      borderRadius: '8px',
    },
  };

  return (
    <div style={styles.container}>
      {/* Shimmer Animation */}
      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>

      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerTop}>
          <div style={styles.titleSection}>
            <h1 style={styles.title}>
              <div style={styles.titleIcon}>
                <FaLayerGroup />
              </div>
              Kategorilerim
            </h1>
            <p style={styles.subtitle}>
              Ürünlerinizi düzenlemek için kategoriler oluşturun ve yönetin. 
              Kategoriler sayesinde müşterileriniz ürünlerinizi daha kolay bulabilir.
            </p>
            <div style={styles.statsRow}>
              <span style={styles.statBadge('green')}>
                <FaTags /> {stats.total} Kategori
              </span>
              <span style={styles.statBadge('blue')}>
                <FaFolderOpen /> {stats.parents} Ana Kategori
              </span>
              <span style={styles.statBadge('orange')}>
                <FaChevronRight /> {stats.children} Alt Kategori
              </span>
              <span style={styles.statBadge('gray')}>
                <FaBox /> {stats.totalProducts} Ürün
              </span>
              {stats.inactive > 0 && (
                <span style={styles.statBadge('gray')}>
                  <FaToggleOff /> {stats.inactive} Pasif
                </span>
              )}
            </div>
          </div>
          <button 
            onClick={() => setModalOpen(true)} 
            style={styles.addButton}
            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <FaPlus /> Yeni Kategori
          </button>
        </div>

        {/* Toolbar */}
        <div style={styles.toolbar}>
          <div style={styles.searchWrapper}>
            <FaSearch style={styles.searchIcon} />
            <input
              type="text"
              placeholder="Kategori ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={styles.searchInput}
              onFocus={(e) => e.target.style.borderColor = '#10b981'}
              onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
            />
          </div>

          <div style={styles.filterGroup}>
            <span style={styles.filterLabel}>Sırala:</span>
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              style={styles.select}
            >
              <option value="name">İsim</option>
              <option value="date">Tarih</option>
            </select>
            <button 
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              style={styles.sortButton}
              title={sortOrder === 'asc' ? 'Artan' : 'Azalan'}
            >
              {sortOrder === 'asc' ? <FaSortAmountUp /> : <FaSortAmountDown />}
            </button>
          </div>

          <div style={styles.viewToggle}>
            <button 
              onClick={() => setViewMode('grid')}
              style={styles.viewButton(viewMode === 'grid')}
            >
              Grid
            </button>
            <button 
              onClick={() => setViewMode('list')}
              style={styles.viewButton(viewMode === 'list')}
            >
              Liste
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div style={styles.grid}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} style={styles.loadingCard}>
              <div style={{ ...styles.skeleton, width: '48px', height: '48px', marginBottom: '16px' }} />
              <div style={{ ...styles.skeleton, width: '70%', height: '20px', marginBottom: '8px' }} />
              <div style={{ ...styles.skeleton, width: '50%', height: '16px', marginBottom: '16px' }} />
              <div style={{ ...styles.skeleton, width: '100%', height: '40px' }} />
            </div>
          ))}
        </div>
      ) : isError ? (
        <div style={{ ...styles.emptyState, background: '#fef2f2' }}>
          <div style={{ ...styles.emptyIcon, background: '#fef2f2', color: '#dc2626' }}>
            <FaTimes />
          </div>
          <div style={{ ...styles.emptyTitle, color: '#dc2626' }}>Bir Hata Oluştu</div>
          <div style={styles.emptyText}>Kategoriler yüklenirken bir sorun oluştu. Lütfen sayfayı yenileyin.</div>
        </div>
      ) : filteredAndSortedItems.length === 0 ? (
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>
            <FaLayerGroup />
          </div>
          {searchQuery ? (
            <>
              <div style={styles.emptyTitle}>Sonuç Bulunamadı</div>
              <div style={styles.emptyText}>"{searchQuery}" aramasına uygun kategori bulunamadı.</div>
              <button onClick={() => setSearchQuery('')} style={styles.cancelButton}>
                Aramayı Temizle
              </button>
            </>
          ) : (
            <>
              <div style={styles.emptyTitle}>Henüz Kategori Yok</div>
              <div style={styles.emptyText}>
                İlk kategorinizi oluşturarak ürünlerinizi düzenlemeye başlayın.
              </div>
              <button onClick={() => setModalOpen(true)} style={styles.addButton}>
                <FaPlus /> İlk Kategoriyi Oluştur
              </button>
            </>
          )}
        </div>
      ) : viewMode === 'grid' ? (
        <div style={styles.grid}>
          {filteredAndSortedItems.map((category) => {
            const isActive = category.is_active !== false;
            return (
              <div 
                key={category.id} 
                style={styles.card(isActive)}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.1)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.08)';
                }}
              >
                <div style={styles.cardHeader}>
                  <div style={styles.cardIcon(!!category.parent_id)}>
                    {category.parent_id ? <FaFolderOpen /> : <FaTags />}
                  </div>
                  <div style={styles.cardActions}>
                    <button 
                      onClick={() => handleToggleActive(category)}
                      style={styles.actionButton(isActive ? 'green' : 'gray')}
                      title={isActive ? 'Pasif Yap' : 'Aktif Yap'}
                    >
                      {isActive ? <FaToggleOn size={16} /> : <FaToggleOff size={16} />}
                    </button>
                    <button 
                      onClick={() => handleEditClick(category)}
                      style={styles.actionButton('blue')}
                      title="Düzenle"
                    >
                      <FaEdit size={14} />
                    </button>
                    <button 
                      onClick={() => handleDeleteClick(category)}
                      style={styles.actionButton('red')}
                      title="Sil"
                    >
                      <FaTrash size={14} />
                    </button>
                  </div>
                </div>
                <div style={styles.cardName}>{category.name}</div>
                {category.slug && (
                  <div style={styles.cardSlug}>{category.slug}</div>
                )}
                {category.description && (
                  <div style={styles.cardDescription}>{category.description}</div>
                )}
                <div style={styles.cardMeta}>
                  <span style={styles.metaBadge('blue')}>
                    <FaBox size={10} /> {category.products_count || 0} ürün
                  </span>
                  {category.children_count > 0 && (
                    <span style={styles.metaBadge('orange')}>
                      <FaFolderOpen size={10} /> {category.children_count} alt kategori
                    </span>
                  )}
                  {category.parent && (
                    <span style={styles.metaBadge('gray')}>
                      ↳ {category.parent.name}
                    </span>
                  )}
                </div>
                <div style={styles.cardFooter}>
                  <span style={styles.cardDate}>
                    {category.created_at ? new Date(category.created_at).toLocaleDateString('tr-TR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    }) : ''}
                  </span>
                  <span style={styles.statusBadge(isActive)}>
                    {isActive ? <><FaCheck size={10} /> Aktif</> : <><FaTimes size={10} /> Pasif</>}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div style={styles.list}>
          {filteredAndSortedItems.map((category) => {
            const isActive = category.is_active !== false;
            return (
              <div 
                key={category.id} 
                style={styles.listCard(isActive)}
                onMouseOver={(e) => e.currentTarget.style.background = '#fafafa'}
                onMouseOut={(e) => e.currentTarget.style.background = 'white'}
              >
                <div style={styles.listCardLeft}>
                  <div style={{ ...styles.cardIcon(!!category.parent_id), width: '44px', height: '44px', fontSize: '18px' }}>
                    {category.parent_id ? <FaFolderOpen /> : <FaTags />}
                  </div>
                  <div style={styles.listCardInfo}>
                    <span style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937' }}>
                      {category.name}
                      {category.parent && (
                        <span style={{ fontSize: '13px', fontWeight: '400', color: '#9ca3af', marginLeft: '8px' }}>
                          ↳ {category.parent.name}
                        </span>
                      )}
                    </span>
                    <span style={{ fontSize: '13px', color: '#9ca3af' }}>
                      {category.slug} • {category.created_at ? new Date(category.created_at).toLocaleDateString('tr-TR') : ''} 
                      • {category.products_count || 0} ürün
                      {category.children_count > 0 && ` • ${category.children_count} alt kategori`}
                    </span>
                  </div>
                </div>
                <div style={styles.listCardMeta}>
                  <span style={styles.statusBadge(isActive)}>
                    {isActive ? <><FaCheck size={10} /> Aktif</> : <><FaTimes size={10} /> Pasif</>}
                  </span>
                  <div style={styles.cardActions}>
                    <button 
                      onClick={() => handleToggleActive(category)}
                      style={styles.actionButton(isActive ? 'green' : 'gray')}
                      title={isActive ? 'Pasif Yap' : 'Aktif Yap'}
                    >
                      {isActive ? <FaToggleOn size={16} /> : <FaToggleOff size={16} />}
                    </button>
                    <button 
                      onClick={() => handleEditClick(category)}
                      style={styles.actionButton('blue')}
                      title="Düzenle"
                    >
                      <FaEdit size={14} />
                    </button>
                    <button 
                      onClick={() => handleDeleteClick(category)}
                      style={styles.actionButton('red')}
                      title="Sil"
                    >
                      <FaTrash size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Modal */}
      {modalOpen && (
        <div style={styles.modal} onClick={() => setModalOpen(false)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>Yeni Kategori Oluştur</h2>
              <button onClick={() => setModalOpen(false)} style={styles.modalClose}>
                <FaTimes />
              </button>
            </div>
            <form onSubmit={handleCreate}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Kategori Adı *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Örneğin: Elektronik"
                  style={styles.input}
                  onFocus={(e) => e.target.style.borderColor = '#10b981'}
                  onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                  autoFocus
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Üst Kategori (Opsiyonel)</label>
                <select
                  value={parentId}
                  onChange={(e) => setParentId(e.target.value)}
                  style={styles.input}
                >
                  <option value="">Ana Kategori (Üst kategori yok)</option>
                  {rootCategories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Açıklama (Opsiyonel)</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Kategori hakkında kısa bir açıklama..."
                  style={styles.textarea}
                  onFocus={(e) => e.target.style.borderColor = '#10b981'}
                  onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                />
              </div>
              <div style={styles.modalActions}>
                <button type="button" onClick={() => setModalOpen(false)} style={styles.cancelButton}>
                  İptal
                </button>
                <button 
                  type="submit" 
                  style={{
                    ...styles.submitButton,
                    opacity: createMutation.isLoading ? 0.7 : 1,
                    cursor: createMutation.isLoading ? 'not-allowed' : 'pointer',
                  }}
                  disabled={createMutation.isLoading}
                >
                  {createMutation.isLoading ? 'Oluşturuluyor...' : 'Kategori Oluştur'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editModalOpen && selectedCategory && (
        <div style={styles.modal} onClick={() => setEditModalOpen(false)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>Kategori Düzenle</h2>
              <button onClick={() => setEditModalOpen(false)} style={styles.modalClose}>
                <FaTimes />
              </button>
            </div>
            <form onSubmit={handleUpdate}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Kategori Adı *</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Örneğin: Elektronik"
                  style={styles.input}
                  onFocus={(e) => e.target.style.borderColor = '#10b981'}
                  onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                  autoFocus
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Üst Kategori (Opsiyonel)</label>
                <select
                  value={editParentId}
                  onChange={(e) => setEditParentId(e.target.value)}
                  style={styles.input}
                >
                  <option value="">Ana Kategori (Üst kategori yok)</option>
                  {getAvailableParents(selectedCategory.id)
                    .filter(cat => !cat.parent_id) // Only show root categories as parents
                    .map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                </select>
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Açıklama (Opsiyonel)</label>
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  placeholder="Kategori hakkında kısa bir açıklama..."
                  style={styles.textarea}
                  onFocus={(e) => e.target.style.borderColor = '#10b981'}
                  onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                />
              </div>
              <div style={styles.modalActions}>
                <button type="button" onClick={() => setEditModalOpen(false)} style={styles.cancelButton}>
                  İptal
                </button>
                <button 
                  type="submit" 
                  style={{
                    ...styles.submitButton,
                    opacity: updateMutation.isLoading ? 0.7 : 1,
                    cursor: updateMutation.isLoading ? 'not-allowed' : 'pointer',
                  }}
                  disabled={updateMutation.isLoading}
                >
                  {updateMutation.isLoading ? 'Güncelleniyor...' : 'Kaydet'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && selectedCategory && (
        <div style={styles.modal} onClick={() => setDeleteModalOpen(false)}>
          <div style={styles.deleteModalContent} onClick={(e) => e.stopPropagation()}>
            <div style={styles.deleteIcon}>
              <FaTrash />
            </div>
            <h2 style={styles.deleteTitle}>Kategoriyi Sil</h2>
            <p style={styles.deleteText}>
              <span style={styles.deleteName}>"{selectedCategory.name}"</span> kategorisini silmek istediğinize emin misiniz? 
              {selectedCategory.children_count > 0 && (
                <><br /><span style={{ color: '#dc2626' }}>⚠️ Bu kategorinin {selectedCategory.children_count} alt kategorisi var. Önce onları silmeniz gerekiyor.</span></>
              )}
              {!selectedCategory.children_count && ' Bu işlem geri alınamaz.'}
            </p>
            <div style={styles.deleteActions}>
              <button 
                onClick={() => setDeleteModalOpen(false)} 
                style={styles.cancelButton}
              >
                İptal
              </button>
              <button 
                onClick={confirmDelete}
                style={{
                  ...styles.deleteButton,
                  opacity: deleteMutation.isLoading ? 0.7 : 1,
                }}
                disabled={deleteMutation.isLoading || selectedCategory.children_count > 0}
              >
                {deleteMutation.isLoading ? 'Siliniyor...' : 'Evet, Sil'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
