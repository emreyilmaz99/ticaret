import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaLayerGroup, FaChevronRight, FaChevronDown, FaInfoCircle, FaCheck, FaSave } from 'react-icons/fa';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getVendorCategoryTree, getMySelectedCategories, updateMyCategories } from '../../features/vendor/api/categoryApi';
import { useToast } from '../../components/Toast';

// Icon mapping - emojiler kullanıyoruz
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

const BACKEND_URL = 'http://127.0.0.1:8000';
const toFullUrl = (u) => {
  if (!u) return null;
  if (u.startsWith('http')) return u;
  return `${BACKEND_URL}${u.startsWith('/') ? '' : '/'}${u}`;
};

export default function VendorCategories() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const toast = useToast();

  useEffect(() => {
    const token = localStorage.getItem('vendor_token');
    if (!token) {
      navigate('/vendor/login');
    }
  }, [navigate]);

  // All categories
  const { data: allCategoriesData, isLoading: loadingAll } = useQuery({ 
    queryKey: ['vendorCategoryTree'], 
    queryFn: getVendorCategoryTree 
  });

  // My selected categories
  const { data: myCategories, isLoading: loadingMy } = useQuery({
    queryKey: ['mySelectedCategories'],
    queryFn: getMySelectedCategories
  });
  
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategories, setExpandedCategories] = useState({});
  const [selectedIds, setSelectedIds] = useState([]);
  const [hasChanges, setHasChanges] = useState(false);

  const categories = allCategoriesData?.data || [];
  const initialSelectedIds = useMemo(() => 
    (myCategories?.data?.categories || []).map(c => c.id), 
    [myCategories]
  );

  // Initialize selected IDs when data loads
  useEffect(() => {
    if (initialSelectedIds.length > 0 || (myCategories && selectedIds.length === 0)) {
      setSelectedIds(initialSelectedIds);
    }
  }, [initialSelectedIds, myCategories]);

  // Check for changes
  useEffect(() => {
    const sortedInitial = [...initialSelectedIds].sort((a, b) => a - b);
    const sortedSelected = [...selectedIds].sort((a, b) => a - b);
    const changed = JSON.stringify(sortedInitial) !== JSON.stringify(sortedSelected);
    setHasChanges(changed);
  }, [selectedIds, initialSelectedIds]);

  // Save mutation
  const saveMutation = useMutation({
    mutationFn: updateMyCategories,
    onSuccess: () => {
      queryClient.invalidateQueries(['mySelectedCategories']);
      toast.success('Başarılı', 'Kategorileriniz güncellendi.');
      setHasChanges(false);
    },
    onError: (err) => {
      toast.error('Hata', err.response?.data?.message || 'Kategoriler kaydedilemedi.');
    }
  });

  const handleSave = () => {
    if (selectedIds.length === 0) {
      toast.warning('Uyarı', 'En az bir kategori seçmelisiniz.');
      return;
    }
    saveMutation.mutate(selectedIds);
  };

  // Toggle category selection
  const toggleCategory = (categoryId) => {
    setSelectedIds(prev => 
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  // Toggle category expand/collapse
  const toggleExpand = (categoryId, e) => {
    e.stopPropagation();
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  // Expand all
  const expandAll = () => {
    const allExpanded = {};
    const setAllExpanded = (cats) => {
      cats.forEach(cat => {
        allExpanded[cat.id] = true;
        if (cat.active_children?.length > 0) {
          setAllExpanded(cat.active_children);
        }
      });
    };
    setAllExpanded(categories);
    setExpandedCategories(allExpanded);
  };

  // Collapse all
  const collapseAll = () => {
    setExpandedCategories({});
  };

  // Filter categories by search
  const filterCategories = (cats) => {
    if (!searchQuery) return cats;
    
    const search = searchQuery.toLowerCase();
    
    const filterRecursive = (categories) => {
      return categories.reduce((acc, cat) => {
        const matches = cat.name.toLowerCase().includes(search);
        const children = cat.active_children || [];
        const filteredChildren = filterRecursive(children);
        
        if (matches || filteredChildren.length > 0) {
          acc.push({
            ...cat,
            active_children: filteredChildren.length > 0 ? filteredChildren : children
          });
        }
        
        return acc;
      }, []);
    };
    
    return filterRecursive(cats);
  };

  const filteredCategories = filterCategories(categories);

  // Count total categories
  const countCategories = (cats) => {
    let count = cats.length;
    cats.forEach(cat => {
      if (cat.active_children?.length > 0) {
        count += countCategories(cat.active_children);
      }
    });
    return count;
  };

  // Render category item
  const renderCategory = (category, level = 0) => {
    const isExpanded = expandedCategories[category.id];
    const hasChildren = category.active_children && category.active_children.length > 0;
    const isSelected = selectedIds.includes(category.id);
    
    return (
      <div key={category.id}>
        <div 
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '14px 16px',
            paddingLeft: `${16 + level * 28}px`,
            backgroundColor: isSelected ? '#f0fdf4' : (level === 0 ? '#f8fafc' : 'white'),
            borderBottom: '1px solid #e2e8f0',
            borderLeft: isSelected ? '3px solid #22c55e' : '3px solid transparent',
            transition: 'all 0.15s',
            cursor: 'pointer',
          }}
          onClick={() => toggleCategory(category.id)}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = isSelected ? '#dcfce7' : '#f1f5f9'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = isSelected ? '#f0fdf4' : (level === 0 ? '#f8fafc' : 'white')}
        >
          {/* Checkbox */}
          <div style={{
            width: '22px',
            height: '22px',
            borderRadius: '6px',
            border: isSelected ? '2px solid #22c55e' : '2px solid #cbd5e1',
            backgroundColor: isSelected ? '#22c55e' : 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: '12px',
            flexShrink: 0,
            transition: 'all 0.15s'
          }}>
            {isSelected && <FaCheck size={12} color="white" />}
          </div>

          {/* Expand/Collapse Icon */}
          {hasChildren && (
            <div 
              onClick={(e) => toggleExpand(category.id, e)}
              style={{
                width: '24px',
                height: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#64748b',
                marginRight: '8px',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              {isExpanded ? <FaChevronDown size={12} /> : <FaChevronRight size={12} />}
            </div>
          )}
          {!hasChildren && <div style={{ width: '32px' }} />}

          {/* Icon or Image */}
          <span style={{ fontSize: '22px', marginRight: '14px', display: 'flex', alignItems: 'center' }}>
            {category.image ? (
              <img 
                src={toFullUrl(category.image)} 
                alt={category.name}
                style={{ width: '28px', height: '28px', borderRadius: '6px', objectFit: 'cover' }}
                onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'inline'; }}
              />
            ) : null}
            <span style={{ display: category.image ? 'none' : 'inline' }}>
              {getIconEmoji(category.icon)}
            </span>
          </span>

          {/* Name */}
          <div style={{ flex: 1 }}>
            <div style={{ 
              fontWeight: level === 0 ? '600' : '500', 
              color: isSelected ? '#166534' : '#1e293b',
              fontSize: level === 0 ? '15px' : '14px'
            }}>
              {category.name}
            </div>
            {category.description && (
              <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                {category.description.substring(0, 60)}{category.description.length > 60 ? '...' : ''}
              </div>
            )}
          </div>

          {/* Children count */}
          {hasChildren && (
            <span style={{
              padding: '4px 10px',
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: '500',
              backgroundColor: '#e0f2fe',
              color: '#0369a1'
            }}>
              {category.active_children.length} alt
            </span>
          )}
        </div>

        {/* Children */}
        {hasChildren && isExpanded && (
          <div style={{ backgroundColor: '#fafafa' }}>
            {category.active_children.map(child => renderCategory(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  const isLoading = loadingAll || loadingMy;

  // Styles
  const styles = {
    container: { 
      padding: '24px', 
      fontFamily: "'Inter', sans-serif", 
      color: '#1e293b',
      maxWidth: '1200px',
      margin: '0 auto'
    },
    header: { 
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: '24px'
    },
    title: { 
      fontSize: '24px', 
      fontWeight: '700', 
      color: '#0f172a',
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    },
    subtitle: { 
      color: '#64748b', 
      fontSize: '14px', 
      marginTop: '8px',
      lineHeight: '1.6'
    },
    infoBox: {
      backgroundColor: '#eff6ff',
      border: '1px solid #bfdbfe',
      borderRadius: '12px',
      padding: '16px 20px',
      marginBottom: '24px',
      display: 'flex',
      alignItems: 'flex-start',
      gap: '12px'
    },
    toolbar: { 
      backgroundColor: 'white', 
      padding: '14px 16px', 
      borderRadius: '12px', 
      marginBottom: '16px', 
      border: '1px solid #e2e8f0', 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      gap: '12px',
      flexWrap: 'wrap'
    },
    searchInput: { 
      padding: '10px 16px', 
      paddingLeft: '40px', 
      borderRadius: '8px', 
      border: '1px solid #e2e8f0', 
      width: '300px', 
      outline: 'none', 
      fontSize: '14px' 
    },
    categoryContainer: { 
      backgroundColor: 'white', 
      borderRadius: '12px', 
      border: '1px solid #e2e8f0', 
      overflow: 'hidden',
      boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
    },
    btnSecondary: { 
      backgroundColor: 'white', 
      color: '#64748b', 
      border: '1px solid #e2e8f0', 
      padding: '8px 16px', 
      borderRadius: '8px', 
      fontWeight: '500', 
      cursor: 'pointer',
      fontSize: '13px',
      display: 'flex',
      alignItems: 'center',
      gap: '6px'
    },
    btnPrimary: {
      backgroundColor: '#059669',
      color: 'white',
      border: 'none',
      padding: '12px 24px',
      borderRadius: '8px',
      fontWeight: '600',
      cursor: 'pointer',
      fontSize: '14px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    },
    statsCard: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      backgroundColor: 'white',
      padding: '16px 20px',
      borderRadius: '12px',
      border: '1px solid #e2e8f0'
    }
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>
            <FaLayerGroup color="#059669" />
            Kategori Seçimi
          </h1>
          <p style={styles.subtitle}>
            Satış yapmak istediğiniz kategorileri seçin. 
            Seçtiğiniz kategorilerde ürün ekleyebilirsiniz.
          </p>
        </div>
        <button 
          onClick={handleSave}
          disabled={!hasChanges || saveMutation.isLoading}
          style={{
            ...styles.btnPrimary,
            opacity: (!hasChanges || saveMutation.isLoading) ? 0.5 : 1,
            cursor: (!hasChanges || saveMutation.isLoading) ? 'not-allowed' : 'pointer'
          }}
        >
          <FaSave /> {saveMutation.isLoading ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
        </button>
      </div>

      {/* Info Box */}
      <div style={styles.infoBox}>
        <FaInfoCircle size={20} color="#2563eb" style={{ marginTop: '2px', flexShrink: 0 }} />
        <div>
          <div style={{ fontWeight: '600', color: '#1e40af', marginBottom: '4px' }}>
            Kategori Seçimi Hakkında
          </div>
          <p style={{ fontSize: '14px', color: '#3b82f6', lineHeight: '1.5', margin: 0 }}>
            İstediğiniz kategorileri seçebilirsiniz. Seçtiğiniz kategoriler mağazanızın profili olarak görüntülenecektir.
            Tüm kategorilerde ürün ekleyebilirsiniz.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <div style={styles.statsCard}>
          <div style={{ 
            width: '40px', 
            height: '40px', 
            borderRadius: '10px', 
            backgroundColor: '#dcfce7', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center' 
          }}>
            <FaCheck size={18} color="#16a34a" />
          </div>
          <div>
            <div style={{ fontSize: '20px', fontWeight: '700', color: '#0f172a' }}>
              {selectedIds.length}
            </div>
            <div style={{ fontSize: '13px', color: '#64748b' }}>Seçili Kategori</div>
          </div>
        </div>
        <div style={styles.statsCard}>
          <div style={{ 
            width: '40px', 
            height: '40px', 
            borderRadius: '10px', 
            backgroundColor: '#e0f2fe', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center' 
          }}>
            <FaLayerGroup size={18} color="#0284c7" />
          </div>
          <div>
            <div style={{ fontSize: '20px', fontWeight: '700', color: '#0f172a' }}>
              {countCategories(categories)}
            </div>
            <div style={{ fontSize: '13px', color: '#64748b' }}>Toplam Kategori</div>
          </div>
        </div>
        {hasChanges && (
          <div style={{
            ...styles.statsCard,
            backgroundColor: '#fef3c7',
            borderColor: '#fcd34d'
          }}>
            <div style={{ fontSize: '14px', color: '#92400e', fontWeight: '500' }}>
              ⚠️ Kaydedilmemiş değişiklikler var
            </div>
          </div>
        )}
      </div>

      {/* Toolbar */}
      <div style={styles.toolbar}>
        <div style={{ position: 'relative' }}>
          <FaSearch style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input
            type="text"
            placeholder="Kategori ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={styles.searchInput}
          />
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={expandAll} style={styles.btnSecondary}>
            <FaChevronDown size={12} /> Tümünü Aç
          </button>
          <button onClick={collapseAll} style={styles.btnSecondary}>
            <FaChevronRight size={12} /> Tümünü Kapat
          </button>
        </div>
      </div>

      {/* Category List */}
      <div style={styles.categoryContainer}>
        {isLoading ? (
          <div style={{ padding: '48px', textAlign: 'center', color: '#64748b' }}>
            Kategoriler yükleniyor...
          </div>
        ) : filteredCategories.length === 0 ? (
          <div style={{ padding: '48px', textAlign: 'center', color: '#64748b' }}>
            {searchQuery ? 'Arama sonucu bulunamadı.' : 'Henüz kategori eklenmemiş.'}
          </div>
        ) : (
          filteredCategories.map(category => renderCategory(category))
        )}
      </div>
    </div>
  );
}
