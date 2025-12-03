import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  FaPlus, FaEdit, FaTrash, FaSearch, FaFolder, FaFolderOpen,
  FaChevronRight, FaChevronDown, FaTimes, FaSave, FaCheck, FaBan,
  FaLayerGroup, FaTag, FaImage, FaEye, FaEyeSlash
} from 'react-icons/fa';
import { 
  getCategories, 
  getCategoryTree, 
  getCategoryStatistics, 
  createCategory, 
  updateCategory, 
  deleteCategory,
  bulkUpdateCategoryStatus 
} from '../../features/admin/api/categoryApi';
import { useToast } from '../../components/Toast';
import axios from '../../lib/axios';

// React-icons mapping for category icons
const iconMap = {
  FaMobileAlt: '📱', FaMobile: '📱', FaApple: '🍎', FaLaptop: '💻', FaDesktop: '🖥️',
  FaTabletAlt: '📱', FaMicrochip: '🔧', FaTv: '📺', FaVolumeUp: '🔊', FaHeadphones: '🎧',
  FaCamera: '📷', FaCameraRetro: '📸', FaVideo: '🎥', FaGamepad: '🎮', FaPlaystation: '🎮',
  FaXbox: '🎮', FaTshirt: '👕', FaFemale: '👩', FaMale: '👨', FaChild: '👶', FaBaby: '👶',
  FaShoePrints: '👟', FaRunning: '🏃', FaGem: '💎', FaShoppingBag: '👜', FaClock: '⏰',
  FaGlasses: '👓', FaHome: '🏠', FaCouch: '🛋️', FaBed: '🛏️', FaChair: '🪑', FaArchive: '📦',
  FaPalette: '🎨', FaLightbulb: '💡', FaImage: '🖼️', FaSquare: '⬜', FaUtensils: '🍴',
  FaGlassMartini: '🍸', FaBlender: '🔌', FaBox: '📦', FaBath: '🛁', FaSoap: '🧼',
  FaShower: '🚿', FaLeaf: '🍃', FaSeedling: '🌱', FaDumbbell: '💪', FaSpa: '💆',
  FaBicycle: '🚲', FaFutbol: '⚽', FaBasketballBall: '🏀', FaVolleyballBall: '🏐',
  FaTableTennis: '🏓', FaCampground: '⛺', FaFire: '🔥', FaMountain: '⛰️', FaSwimmer: '🏊',
  FaWater: '💧', FaPaintBrush: '🖌️', FaEye: '👁️', FaKissWinkHeart: '💋', FaHandSparkles: '✨',
  FaTint: '💧', FaSun: '☀️', FaCut: '✂️', FaPumpSoap: '🧴', FaSprayCan: '🧴',
  FaPuzzlePiece: '🧩', FaDog: '🐕', FaBook: '📚', FaBrain: '🧠', FaBookOpen: '📖',
  FaGraduationCap: '🎓', FaMusic: '🎵', FaGuitar: '🎸', FaDrum: '🥁', FaPen: '✒️',
  FaPaperclip: '📎', FaCubes: '🧊', FaCar: '🚗', FaOilCan: '🛢️', FaCogs: '⚙️',
  FaCircle: '⭕', FaSnowflake: '❄️', FaCircleNotch: '⭕', FaMotorcycle: '🏍️', FaHardHat: '⛑️',
  FaPaw: '🐾', FaBone: '🦴', FaFirstAid: '🩹', FaCat: '🐱', FaFish: '🐟', FaDove: '🕊️',
  FaShoppingCart: '🛒', FaBreadSlice: '🍞', FaCookie: '🍪', FaCoffee: '☕', FaBroom: '🧹',
  FaToiletPaper: '🧻', FaScroll: '📜'
};

const getIconEmoji = (iconName) => {
  return iconMap[iconName] || '📁';
};

const CategoriesPage = () => {
  const toast = useToast();
  const queryClient = useQueryClient();
  
  // State
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCategories, setExpandedCategories] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // create | edit
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    parent_id: '',
    icon: '',
    description: '',
    is_active: true,
    sort_order: 0,
    image: null
  });
  const [imagePreview, setImagePreview] = useState(null);

  // Queries
  const { data: treeData, isLoading: treeLoading } = useQuery({
    queryKey: ['adminCategoryTree'],
    queryFn: getCategoryTree
  });

  const { data: statsData } = useQuery({
    queryKey: ['adminCategoryStats'],
    queryFn: getCategoryStatistics
  });

  const { data: categoriesData } = useQuery({
    queryKey: ['adminCategories'],
    queryFn: () => getCategories()
  });

  const categories = categoriesData?.data || [];
  const categoryTree = treeData?.data || [];
  const stats = statsData?.data || {};

  // Mutations
  const createMutation = useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries(['adminCategoryTree']);
      queryClient.invalidateQueries(['adminCategories']);
      queryClient.invalidateQueries(['adminCategoryStats']);
      closeModal();
      toast.success('Başarılı', 'Kategori başarıyla oluşturuldu.');
    },
    onError: (err) => {
      toast.error('Hata', err.response?.data?.message || 'Kategori oluşturulamadı.');
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updateCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['adminCategoryTree']);
      queryClient.invalidateQueries(['adminCategories']);
      queryClient.invalidateQueries(['adminCategoryStats']);
      closeModal();
      toast.success('Başarılı', 'Kategori başarıyla güncellendi.');
    },
    onError: (err) => {
      toast.error('Hata', err.response?.data?.message || 'Kategori güncellenemedi.');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries(['adminCategoryTree']);
      queryClient.invalidateQueries(['adminCategories']);
      queryClient.invalidateQueries(['adminCategoryStats']);
      setDeleteConfirmOpen(false);
      setCategoryToDelete(null);
      toast.success('Başarılı', 'Kategori başarıyla silindi.');
    },
    onError: (err) => {
      toast.error('Hata', err.response?.data?.message || 'Kategori silinemedi.');
    }
  });

  // Helpers
  const BACKEND_URL = 'http://127.0.0.1:8000';
  const toFullUrl = (u) => {
    if (!u) return null;
    if (u.startsWith('http')) return u;
    return `${BACKEND_URL}${u.startsWith('/') ? '' : '/'}${u}`;
  };

  const toggleExpand = (categoryId) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  const expandAll = () => {
    const allExpanded = {};
    const setAllExpanded = (cats) => {
      cats.forEach(cat => {
        allExpanded[cat.id] = true;
        if (cat.children?.length > 0) {
          setAllExpanded(cat.children);
        }
      });
    };
    setAllExpanded(categoryTree);
    setExpandedCategories(allExpanded);
  };

  const collapseAll = () => {
    setExpandedCategories({});
  };

  const openCreateModal = (parentId = null) => {
    setModalMode('create');
    setFormData({
      name: '',
      parent_id: parentId || '',
      icon: '',
      description: '',
      is_active: true,
      sort_order: 0,
      image: null
    });
    setImagePreview(null);
    setSelectedCategory(null);
    setIsModalOpen(true);
  };

  const openEditModal = (category) => {
    setModalMode('edit');
    setSelectedCategory(category);
    setFormData({
      name: category.name || '',
      parent_id: category.parent_id || '',
      icon: category.icon || '',
      description: category.description || '',
      is_active: category.is_active ?? true,
      sort_order: category.sort_order || 0,
      image: null
    });
    setImagePreview(category.image ? toFullUrl(category.image) : null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCategory(null);
    setFormData({
      name: '',
      parent_id: '',
      icon: '',
      description: '',
      is_active: true,
      sort_order: 0,
      image: null
    });
    setImagePreview(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.warning('Uyarı', 'Görsel 2MB\'dan küçük olmalıdır.');
        return;
      }
      setFormData({ ...formData, image: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.warning('Uyarı', 'Kategori adı zorunludur.');
      return;
    }

    const fd = new FormData();
    fd.append('name', formData.name);
    if (formData.parent_id) fd.append('parent_id', formData.parent_id);
    if (formData.icon) fd.append('icon', formData.icon);
    if (formData.description) fd.append('description', formData.description);
    fd.append('is_active', formData.is_active ? '1' : '0');
    fd.append('sort_order', formData.sort_order);
    if (formData.image) fd.append('image', formData.image);

    if (modalMode === 'create') {
      createMutation.mutate(fd);
    } else {
      updateMutation.mutate({ id: selectedCategory.id, data: fd });
    }
  };

  const confirmDelete = (category) => {
    setCategoryToDelete(category);
    setDeleteConfirmOpen(true);
  };

  const handleDelete = () => {
    if (categoryToDelete) {
      deleteMutation.mutate(categoryToDelete.id);
    }
  };

  // Get parent categories for dropdown (only root + first level)
  const getParentOptions = () => {
    const options = [{ id: '', name: 'Ana Kategori (Üst kategori yok)' }];
    
    const addOptions = (cats, level = 0) => {
      cats.forEach(cat => {
        // Skip the currently edited category and its children
        if (selectedCategory && cat.id === selectedCategory.id) return;
        
        options.push({
          id: cat.id,
          name: `${'—'.repeat(level)} ${cat.name}`,
          level
        });
        
        // Only allow 2 levels deep
        if (cat.children?.length > 0 && level < 1) {
          addOptions(cat.children, level + 1);
        }
      });
    };
    
    addOptions(categoryTree);
    return options;
  };

  // Filter categories by search
  const filterCategories = (cats) => {
    if (!searchTerm) return cats;
    
    const search = searchTerm.toLowerCase();
    
    const filterRecursive = (categories) => {
      return categories.reduce((acc, cat) => {
        const matches = cat.name.toLowerCase().includes(search);
        const filteredChildren = cat.children ? filterRecursive(cat.children) : [];
        
        if (matches || filteredChildren.length > 0) {
          acc.push({
            ...cat,
            children: filteredChildren.length > 0 ? filteredChildren : cat.children
          });
        }
        
        return acc;
      }, []);
    };
    
    return filterRecursive(cats);
  };

  const filteredTree = filterCategories(categoryTree);

  // Render category tree item
  const renderCategoryItem = (category, level = 0) => {
    const isExpanded = expandedCategories[category.id];
    const hasChildren = category.children && category.children.length > 0;
    
    return (
      <div key={category.id}>
        <div 
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '12px 16px',
            paddingLeft: `${16 + level * 24}px`,
            backgroundColor: level === 0 ? '#f8fafc' : 'white',
            borderBottom: '1px solid #e2e8f0',
            transition: 'background-color 0.15s',
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = level === 0 ? '#f8fafc' : 'white'}
        >
          {/* Expand/Collapse */}
          <button
            onClick={() => toggleExpand(category.id)}
            style={{
              width: '24px',
              height: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: 'none',
              background: 'none',
              cursor: hasChildren ? 'pointer' : 'default',
              color: hasChildren ? '#64748b' : 'transparent',
              marginRight: '8px'
            }}
          >
            {hasChildren && (isExpanded ? <FaChevronDown size={12} /> : <FaChevronRight size={12} />)}
          </button>

          {/* Icon or Image */}
          <span style={{ fontSize: '20px', marginRight: '12px', display: 'flex', alignItems: 'center' }}>
            {category.image ? (
              <img 
                src={toFullUrl(category.image)} 
                alt={category.name}
                style={{ width: '24px', height: '24px', borderRadius: '4px', objectFit: 'cover' }}
                onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'inline'; }}
              />
            ) : null}
            <span style={{ display: category.image ? 'none' : 'inline' }}>
              {getIconEmoji(category.icon)}
            </span>
          </span>

          {/* Name & Info */}
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: level === 0 ? '600' : '500', color: '#1e293b' }}>
              {category.name}
            </div>
            <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
              {category.direct_products_count || 0} ürün
              {hasChildren && ` • ${category.children.length} alt kategori`}
            </div>
          </div>

          {/* Status Badge */}
          <span style={{
            padding: '4px 8px',
            borderRadius: '12px',
            fontSize: '11px',
            fontWeight: '600',
            backgroundColor: category.is_active ? '#dcfce7' : '#fee2e2',
            color: category.is_active ? '#166534' : '#991b1b',
            marginRight: '12px'
          }}>
            {category.is_active ? 'Aktif' : 'Pasif'}
          </span>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => openCreateModal(category.id)}
              title="Alt kategori ekle"
              style={{
                padding: '6px 10px',
                borderRadius: '6px',
                border: '1px solid #e2e8f0',
                backgroundColor: 'white',
                color: '#059669',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '12px'
              }}
            >
              <FaPlus size={10} /> Alt
            </button>
            <button
              onClick={() => openEditModal(category)}
              title="Düzenle"
              style={{
                padding: '6px',
                borderRadius: '6px',
                border: '1px solid #e2e8f0',
                backgroundColor: 'white',
                color: '#2563eb',
                cursor: 'pointer'
              }}
            >
              <FaEdit size={14} />
            </button>
            <button
              onClick={() => confirmDelete(category)}
              title="Sil"
              style={{
                padding: '6px',
                borderRadius: '6px',
                border: '1px solid #fee2e2',
                backgroundColor: '#fef2f2',
                color: '#dc2626',
                cursor: 'pointer'
              }}
            >
              <FaTrash size={14} />
            </button>
          </div>
        </div>

        {/* Children */}
        {hasChildren && isExpanded && (
          <div>
            {category.children.map(child => renderCategoryItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  // Styles
  const styles = {
    container: { padding: '24px', fontFamily: "'Inter', sans-serif", color: '#1e293b' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' },
    title: { fontSize: '24px', fontWeight: '700', color: '#0f172a' },
    subtitle: { color: '#64748b', fontSize: '14px', marginTop: '4px' },
    statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' },
    statCard: { backgroundColor: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' },
    toolbar: { backgroundColor: 'white', padding: '16px', borderRadius: '12px', marginBottom: '16px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' },
    searchInput: { padding: '10px 16px', paddingLeft: '40px', borderRadius: '8px', border: '1px solid #e2e8f0', width: '300px', outline: 'none', fontSize: '14px' },
    treeContainer: { backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' },
    btnPrimary: { backgroundColor: '#7c3aed', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' },
    btnSecondary: { backgroundColor: 'white', color: '#64748b', border: '1px solid #e2e8f0', padding: '8px 16px', borderRadius: '8px', fontWeight: '500', cursor: 'pointer' },
    modalOverlay: { position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
    modalContent: { backgroundColor: 'white', width: '100%', maxWidth: '600px', borderRadius: '16px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' },
    modalHeader: { padding: '20px 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    modalBody: { padding: '24px', maxHeight: '60vh', overflowY: 'auto' },
    modalFooter: { padding: '16px 24px', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end', gap: '12px', backgroundColor: '#f8fafc' },
    formGroup: { marginBottom: '20px' },
    label: { display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' },
    input: { width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none', fontSize: '14px' },
  };

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
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#f3e8ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FaLayerGroup size={24} color="#7c3aed" />
            </div>
            <div>
              <div style={{ fontSize: '24px', fontWeight: '700', color: '#0f172a' }}>{stats.total || 0}</div>
              <div style={{ fontSize: '13px', color: '#64748b' }}>Toplam Kategori</div>
            </div>
          </div>
        </div>
        <div style={styles.statCard}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FaCheck size={24} color="#16a34a" />
            </div>
            <div>
              <div style={{ fontSize: '24px', fontWeight: '700', color: '#0f172a' }}>{stats.active || 0}</div>
              <div style={{ fontSize: '13px', color: '#64748b' }}>Aktif Kategori</div>
            </div>
          </div>
        </div>
        <div style={styles.statCard}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FaFolder size={24} color="#d97706" />
            </div>
            <div>
              <div style={{ fontSize: '24px', fontWeight: '700', color: '#0f172a' }}>{stats.root_categories || 0}</div>
              <div style={{ fontSize: '13px', color: '#64748b' }}>Ana Kategori</div>
            </div>
          </div>
        </div>
        <div style={styles.statCard}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#e0f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FaFolderOpen size={24} color="#0284c7" />
            </div>
            <div>
              <div style={{ fontSize: '24px', fontWeight: '700', color: '#0f172a' }}>{stats.sub_categories || 0}</div>
              <div style={{ fontSize: '13px', color: '#64748b' }}>Alt Kategori</div>
            </div>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div style={styles.toolbar}>
        <div style={{ position: 'relative' }}>
          <FaSearch style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input
            type="text"
            placeholder="Kategori ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.searchInput}
          />
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={expandAll} style={styles.btnSecondary}>
            <FaChevronDown size={12} style={{ marginRight: '6px' }} /> Tümünü Aç
          </button>
          <button onClick={collapseAll} style={styles.btnSecondary}>
            <FaChevronRight size={12} style={{ marginRight: '6px' }} /> Tümünü Kapat
          </button>
        </div>
      </div>

      {/* Category Tree */}
      <div style={styles.treeContainer}>
        {treeLoading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>Yükleniyor...</div>
        ) : filteredTree.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
            {searchTerm ? 'Sonuç bulunamadı.' : 'Henüz kategori eklenmemiş.'}
          </div>
        ) : (
          filteredTree.map(category => renderCategoryItem(category))
        )}
      </div>

      {/* Create/Edit Modal */}
      {isModalOpen && (
        <div style={styles.modalOverlay} onClick={closeModal}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#0f172a' }}>
                {modalMode === 'create' ? 'Yeni Kategori Oluştur' : 'Kategori Düzenle'}
              </h2>
              <button onClick={closeModal} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                <FaTimes size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div style={styles.modalBody}>
                {/* Name */}
                <div style={styles.formGroup}>
                  <label style={styles.label}>Kategori Adı *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    style={styles.input}
                    placeholder="Örn: Elektronik"
                    required
                  />
                </div>

                {/* Parent Category */}
                <div style={styles.formGroup}>
                  <label style={styles.label}>Üst Kategori</label>
                  <select
                    value={formData.parent_id}
                    onChange={(e) => setFormData({ ...formData, parent_id: e.target.value })}
                    style={styles.input}
                  >
                    {getParentOptions().map(opt => (
                      <option key={opt.id} value={opt.id}>{opt.name}</option>
                    ))}
                  </select>
                </div>

                {/* Icon */}
                <div style={styles.formGroup}>
                  <label style={styles.label}>İkon (React Icon Adı)</label>
                  <input
                    type="text"
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    style={styles.input}
                    placeholder="Örn: FaMobileAlt"
                  />
                  <p style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                    Önizleme: {getIconEmoji(formData.icon)}
                  </p>
                </div>

                {/* Description */}
                <div style={styles.formGroup}>
                  <label style={styles.label}>Açıklama</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    style={{ ...styles.input, minHeight: '80px', resize: 'vertical' }}
                    placeholder="Kategori açıklaması..."
                  />
                </div>

                {/* Image */}
                <div style={styles.formGroup}>
                  <label style={styles.label}>Görsel</label>
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                    {imagePreview && (
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #e2e8f0' }} 
                      />
                    )}
                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        style={{ display: 'none' }}
                        id="category-image"
                      />
                      <label 
                        htmlFor="category-image"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '8px 16px',
                          borderRadius: '8px',
                          border: '1px dashed #cbd5e1',
                          cursor: 'pointer',
                          fontSize: '14px',
                          color: '#64748b'
                        }}
                      >
                        <FaImage size={14} /> Görsel Seç
                      </label>
                      <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>Max 2MB (JPG, PNG, WEBP)</p>
                    </div>
                  </div>
                </div>

                {/* Sort Order */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Sıra Numarası</label>
                    <input
                      type="number"
                      value={formData.sort_order}
                      onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
                      style={styles.input}
                      min="0"
                    />
                  </div>

                  {/* Status */}
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Durum</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingTop: '8px' }}>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, is_active: true })}
                        style={{
                          padding: '8px 16px',
                          borderRadius: '8px',
                          border: '1px solid',
                          borderColor: formData.is_active ? '#16a34a' : '#e2e8f0',
                          backgroundColor: formData.is_active ? '#dcfce7' : 'white',
                          color: formData.is_active ? '#166534' : '#64748b',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        <FaEye size={12} /> Aktif
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, is_active: false })}
                        style={{
                          padding: '8px 16px',
                          borderRadius: '8px',
                          border: '1px solid',
                          borderColor: !formData.is_active ? '#dc2626' : '#e2e8f0',
                          backgroundColor: !formData.is_active ? '#fee2e2' : 'white',
                          color: !formData.is_active ? '#991b1b' : '#64748b',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        <FaEyeSlash size={12} /> Pasif
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div style={styles.modalFooter}>
                <button type="button" onClick={closeModal} style={styles.btnSecondary}>
                  İptal
                </button>
                <button 
                  type="submit" 
                  style={styles.btnPrimary}
                  disabled={createMutation.isLoading || updateMutation.isLoading}
                >
                  <FaSave size={14} /> {modalMode === 'create' ? 'Oluştur' : 'Güncelle'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmOpen && (
        <div style={styles.modalOverlay} onClick={() => setDeleteConfirmOpen(false)}>
          <div style={{ ...styles.modalContent, maxWidth: '400px' }} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#0f172a' }}>Kategori Sil</h2>
              <button onClick={() => setDeleteConfirmOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                <FaTimes size={20} />
              </button>
            </div>
            <div style={{ padding: '24px' }}>
              <p style={{ color: '#475569', lineHeight: '1.6' }}>
                <strong>"{categoryToDelete?.name}"</strong> kategorisini silmek istediğinize emin misiniz?
              </p>
              {categoryToDelete?.children_count > 0 && (
                <p style={{ color: '#dc2626', marginTop: '12px', fontSize: '14px' }}>
                  ⚠️ Bu kategorinin {categoryToDelete.children_count} alt kategorisi var. Önce alt kategorileri silmelisiniz.
                </p>
              )}
            </div>
            <div style={styles.modalFooter}>
              <button onClick={() => setDeleteConfirmOpen(false)} style={styles.btnSecondary}>
                İptal
              </button>
              <button 
                onClick={handleDelete}
                disabled={deleteMutation.isLoading}
                style={{
                  ...styles.btnPrimary,
                  backgroundColor: '#dc2626'
                }}
              >
                <FaTrash size={14} /> Sil
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoriesPage;
