import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useInfiniteQuery } from '@tanstack/react-query';
import { 
  FaFilter, FaChevronDown, FaThLarge, FaList, FaSortAmountDown, 
  FaStar, FaHeart, FaShoppingCart, FaRegHeart, FaCheck, FaExchangeAlt, FaTimes 
} from 'react-icons/fa';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import ProductCard from '../../components/ProductCard';
import QuickViewModal from '../../components/QuickViewModal';
import ComparisonModal from '../../components/ComparisonModal';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../components/Toast';
import { getProducts } from '../../api/publicApi';

const CategoryProducts = () => {
  const [searchParams] = useSearchParams();
  const categoryId = searchParams.get('category');
  const subcategoryName = searchParams.get('subcategory');
  
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('featured');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  
  // Comparison State
  const [compareList, setCompareList] = useState([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

  const { addToCart } = useCart();
  const { showToast } = useToast();
  const loadMoreRef = useRef();

  // Mock Banners
  const categoryBanners = {
    'elektronik': {
      image: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80',
      title: 'Elektronik Dünyası',
      description: 'En yeni teknoloji ürünleri, bilgisayarlar, telefonlar ve daha fazlası burada.'
    },
    'moda': {
      image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80',
      title: 'Moda & Giyim',
      description: 'Sezonun en trend parçaları ve kombin önerileri.'
    },
    'ev-yasam': {
      image: 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80',
      title: 'Ev & Yaşam',
      description: 'Eviniz için aradığınız her şey, dekorasyondan mobilyaya.'
    },
    'default': {
      image: 'https://images.unsplash.com/photo-1472851294608-415522f96319?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80',
      title: 'Alışverişin Keyfini Çıkarın',
      description: 'Binlerce ürün, uygun fiyatlar ve hızlı teslimat.'
    }
  };

  const currentBanner = categoryBanners[categoryId] || categoryBanners['default'];

  // Mock filters
  const brands = ['Apple', 'Samsung', 'Lenovo', 'Asus', 'HP', 'Dell', 'Huawei'];
  
  // Infinite Query
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading
  } = useInfiniteQuery({
    queryKey: ['products', categoryId, subcategoryName, sortBy],
    queryFn: ({ pageParam = 1 }) => getProducts({
      category_id: categoryId,
      subcategory: subcategoryName, 
      sort_by: sortBy,
      per_page: 12,
      page: pageParam
    }),
    getNextPageParam: (lastPage, allPages) => {
      const currentPage = lastPage.meta?.current_page || allPages.length;
      const lastPageNum = lastPage.meta?.last_page || 5; 
      return currentPage < lastPageNum ? currentPage + 1 : undefined;
    }
  });

  const products = data?.pages.flatMap(page => page.data?.products || []) || [];

  // Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 1.0 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current);
      }
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleAddToCart = (product) => {
    addToCart(product);
    showToast(`${product.name} sepete eklendi!`, 'success');
    setQuickViewProduct(null);
  };

  const toggleCompare = (product) => {
    if (compareList.find(p => p.id === product.id)) {
      setCompareList(compareList.filter(p => p.id !== product.id));
      showToast('Ürün karşılaştırma listesinden çıkarıldı.', 'info');
    } else {
      if (compareList.length >= 3) {
        showToast('En fazla 3 ürün karşılaştırabilirsiniz.', 'warning');
        return;
      }
      setCompareList([...compareList, product]);
      showToast('Ürün karşılaştırma listesine eklendi.', 'success');
    }
  };
  
  // Breadcrumbs
  const breadcrumbs = [
    { name: 'Anasayfa', path: '/' },
    { name: 'Kategoriler', path: '/' },
    ...(subcategoryName ? [{ name: subcategoryName, path: '#' }] : [])
  ];

  const styles = {
    container: {
      backgroundColor: '#f8fafc',
      minHeight: '100vh',
      paddingBottom: '80px',
      fontFamily: '"Inter", sans-serif',
    },
    banner: {
      height: '200px',
      width: '100%',
      backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${currentBanner.image})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      color: 'white',
      textAlign: 'center',
      marginBottom: '32px',
    },
    bannerTitle: {
      fontSize: '32px',
      fontWeight: '800',
      marginBottom: '8px',
    },
    bannerDesc: {
      fontSize: '16px',
      opacity: 0.9,
      maxWidth: '600px',
    },
    wrapper: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 20px',
    },
    breadcrumb: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      fontSize: '13px',
      color: '#64748b',
      marginBottom: '16px',
    },
    content: {
      display: 'flex',
      gap: '32px',
      alignItems: 'flex-start',
    },
    sidebar: {
      width: '260px',
      flexShrink: 0,
      backgroundColor: 'white',
      borderRadius: '16px',
      border: '1px solid #e2e8f0',
      padding: '24px',
      position: 'sticky',
      top: '20px',
    },
    main: {
      flex: 1,
    },
    filterSection: {
      marginBottom: '24px',
      borderBottom: '1px solid #f1f5f9',
      paddingBottom: '24px',
    },
    filterTitle: {
      fontSize: '14px',
      fontWeight: '700',
      color: '#1e293b',
      marginBottom: '16px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    checkboxLabel: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      fontSize: '14px',
      color: '#475569',
      marginBottom: '12px',
      cursor: 'pointer',
    },
    priceInputs: {
      display: 'flex',
      gap: '10px',
      alignItems: 'center',
    },
    priceInput: {
      width: '100%',
      padding: '8px 12px',
      borderRadius: '8px',
      border: '1px solid #e2e8f0',
      fontSize: '13px',
      outline: 'none',
    },
    sortBar: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '24px',
      backgroundColor: 'white',
      padding: '16px 24px',
      borderRadius: '12px',
      border: '1px solid #e2e8f0',
    },
    select: {
      padding: '8px 12px',
      borderRadius: '8px',
      border: '1px solid #e2e8f0',
      fontSize: '14px',
      color: '#475569',
      outline: 'none',
      cursor: 'pointer',
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
      gap: '24px',
    },
    emptyState: {
      textAlign: 'center',
      padding: '60px',
      backgroundColor: 'white',
      borderRadius: '16px',
      border: '1px solid #e2e8f0',
      color: '#64748b',
    },
    compareBar: {
      position: 'fixed',
      bottom: '20px',
      left: '50%',
      transform: 'translateX(-50%)',
      backgroundColor: 'white',
      padding: '16px 24px',
      borderRadius: '16px',
      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
      display: 'flex',
      alignItems: 'center',
      gap: '24px',
      zIndex: 1000,
      border: '1px solid #e2e8f0',
      animation: 'slideUp 0.3s ease',
    },
    compareBtn: {
      padding: '10px 20px',
      backgroundColor: '#059669',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontWeight: '600',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    compareItem: {
      position: 'relative',
      width: '40px',
      height: '40px',
      borderRadius: '8px',
      border: '1px solid #e2e8f0',
      overflow: 'hidden',
    }
  };

  return (
    <div style={styles.container}>
      <Navbar />
      
      {/* Category Banner */}
      <div style={styles.banner}>
        <h1 style={styles.bannerTitle}>{subcategoryName || currentBanner.title}</h1>
        <p style={styles.bannerDesc}>{currentBanner.description}</p>
      </div>

      <div style={styles.wrapper}>
        <div style={styles.breadcrumb}>
          {breadcrumbs.map((crumb, index) => (
            <React.Fragment key={index}>
              {index > 0 && <span style={{ color: '#cbd5e1' }}>/</span>}
              <Link to={crumb.path} style={{ textDecoration: 'none', color: 'inherit' }}>
                {crumb.name}
              </Link>
            </React.Fragment>
          ))}
        </div>

        <div style={styles.content}>
          
          {/* Sidebar Filters */}
          <aside style={styles.sidebar}>
            <div style={styles.filterSection}>
              <div style={styles.filterTitle}>Fiyat Aralığı</div>
              <div style={styles.priceInputs}>
                <input 
                  type="number" 
                  placeholder="Min TL" 
                  style={styles.priceInput}
                  value={priceRange.min}
                  onChange={(e) => setPriceRange({...priceRange, min: e.target.value})}
                />
                <span style={{ color: '#94a3b8' }}>-</span>
                <input 
                  type="number" 
                  placeholder="Max TL" 
                  style={styles.priceInput}
                  value={priceRange.max}
                  onChange={(e) => setPriceRange({...priceRange, max: e.target.value})}
                />
              </div>
            </div>

            <div style={styles.filterSection}>
              <div style={styles.filterTitle}>Markalar</div>
              {brands.map((brand) => (
                <label key={brand} style={styles.checkboxLabel}>
                  <input 
                    type="checkbox" 
                    checked={selectedBrands.includes(brand)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedBrands([...selectedBrands, brand]);
                      } else {
                        setSelectedBrands(selectedBrands.filter(b => b !== brand));
                      }
                    }}
                    style={{ accentColor: '#059669' }}
                  />
                  {brand}
                </label>
              ))}
            </div>

            <div style={{ ...styles.filterSection, borderBottom: 'none' }}>
              <div style={styles.filterTitle}>Değerlendirme Puanı</div>
              {[4, 3, 2, 1].map((rating) => (
                <label key={rating} style={styles.checkboxLabel}>
                  <input type="checkbox" style={{ accentColor: '#059669' }} />
                  <div style={{ display: 'flex', color: '#fbbf24' }}>
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} style={{ opacity: i < rating ? 1 : 1 }} />
                    ))}
                  </div>
                  <span style={{ fontSize: '12px', color: '#94a3b8' }}>& Üzeri</span>
                </label>
              ))}
            </div>
          </aside>

          {/* Main Content */}
          <main style={styles.main}>
            {/* Sort & View Bar */}
            <div style={styles.sortBar}>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button 
                  onClick={() => setViewMode('grid')}
                  style={{ 
                    padding: '8px', 
                    borderRadius: '6px', 
                    border: 'none', 
                    backgroundColor: viewMode === 'grid' ? '#ecfdf5' : 'transparent',
                    color: viewMode === 'grid' ? '#059669' : '#64748b',
                    cursor: 'pointer'
                  }}
                >
                  <FaThLarge />
                </button>
                <button 
                  onClick={() => setViewMode('list')}
                  style={{ 
                    padding: '8px', 
                    borderRadius: '6px', 
                    border: 'none', 
                    backgroundColor: viewMode === 'list' ? '#ecfdf5' : 'transparent',
                    color: viewMode === 'list' ? '#059669' : '#64748b',
                    cursor: 'pointer'
                  }}
                >
                  <FaList />
                </button>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '14px', color: '#64748b' }}>Sıralama:</span>
                <select 
                  style={styles.select}
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="featured">Önerilen</option>
                  <option value="price_asc">En Düşük Fiyat</option>
                  <option value="price_desc">En Yüksek Fiyat</option>
                  <option value="newest">En Yeniler</option>
                </select>
              </div>
            </div>

            {/* Products Grid */}
            {isLoading ? (
              <div style={{ textAlign: 'center', padding: '40px' }}>Yükleniyor...</div>
            ) : products.length > 0 ? (
              <>
                <div style={styles.grid}>
                  {products.map((product) => (
                    <ProductCard 
                      key={product.id} 
                      product={product} 
                      setQuickViewProduct={setQuickViewProduct}
                      isCompared={!!compareList.find(p => p.id === product.id)}
                      onToggleCompare={toggleCompare}
                    />
                  ))}
                </div>
                
                {/* Infinite Scroll Loader */}
                <div ref={loadMoreRef} style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                  {isFetchingNextPage ? (
                    <span>Daha fazla ürün yükleniyor...</span>
                  ) : hasNextPage ? (
                    <span>Aşağı kaydırın</span>
                  ) : (
                    <span>Tüm ürünler görüntülendi</span>
                  )}
                </div>
              </>
            ) : (
              <div style={styles.emptyState}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
                <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px', color: '#1e293b' }}>Ürün Bulunamadı</h3>
                <p>Seçtiğiniz kriterlere uygun ürün bulunmamaktadır.</p>
              </div>
            )}
          </main>
        </div>
      </div>
      
      {/* Comparison Bar */}
      {compareList.length > 0 && (
        <div style={styles.compareBar}>
          <div style={{ display: 'flex', gap: '12px' }}>
            {compareList.map(p => (
              <div key={p.id} style={styles.compareItem}>
                <img src={p.image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <button 
                  onClick={() => toggleCompare(p)}
                  style={{
                    position: 'absolute', top: 0, right: 0, background: 'rgba(0,0,0,0.5)', 
                    color: 'white', border: 'none', width: '100%', height: '100%', 
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    opacity: 0, transition: 'opacity 0.2s', cursor: 'pointer'
                  }}
                  onMouseEnter={e => e.currentTarget.style.opacity = 1}
                  onMouseLeave={e => e.currentTarget.style.opacity = 0}
                >
                  <FaTimes />
                </button>
              </div>
            ))}
            {[...Array(3 - compareList.length)].map((_, i) => (
              <div key={i} style={{ ...styles.compareItem, border: '1px dashed #cbd5e1', backgroundColor: '#f8fafc' }}></div>
            ))}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '14px', fontWeight: '600', color: '#1e293b' }}>{compareList.length} Ürün Seçildi</span>
            <span style={{ fontSize: '12px', color: '#64748b' }}>Maksimum 3 ürün</span>
          </div>
          <button 
            style={styles.compareBtn}
            onClick={() => setIsCompareModalOpen(true)}
            disabled={compareList.length < 2}
          >
            <FaExchangeAlt /> Karşılaştır
          </button>
        </div>
      )}

      {/* Modals */}
      {quickViewProduct && (
        <QuickViewModal 
          product={quickViewProduct} 
          onClose={() => setQuickViewProduct(null)} 
          onAddToCart={() => handleAddToCart(quickViewProduct)}
        />
      )}

      {isCompareModalOpen && (
        <ComparisonModal 
          products={compareList} 
          onClose={() => setIsCompareModalOpen(false)} 
        />
      )}

      <Footer />
    </div>
  );
};

export default CategoryProducts;
