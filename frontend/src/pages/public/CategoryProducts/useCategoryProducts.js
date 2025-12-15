// src/pages/public/CategoryProducts/useCategoryProducts.js
import { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useInfiniteQuery, useQuery, useMutation } from '@tanstack/react-query';
import { useCart } from '../../../context/CartContext';
import { useToast } from '../../../components/common/Toast';
import { useAuth } from '../../../context/AuthContext';
import { getProducts, getMainCategories } from '../../../api/publicApi';
import { toggleFavorite as toggleFavoriteApi, getFavorites } from '../../../api/favoriteApi';
import { CATEGORY_BANNERS } from './styles';

/**
 * Custom hook for CategoryProducts page
 */
export const useCategoryProducts = () => {
  const [searchParams] = useSearchParams();
  const categoryId = searchParams.get('category');
  const subcategoryName = searchParams.get('subcategory');

  // Responsive state
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  
  // UI State
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('featured');
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  
  // Comparison State
  const [compareList, setCompareList] = useState([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  
  // Favorites State
  const [favorites, setFavorites] = useState([]);

  const { addToCart } = useCart();
  const { showToast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const loadMoreRef = useRef();

  // Handle resize
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetch user favorites on mount (if logged in)
  useEffect(() => {
    const fetchUserFavorites = async () => {
      if (user) {
        try {
          const response = await getFavorites();
          if (response.success && response.data?.favorites) {
            const favoriteIds = response.data.favorites.map(fav => Number(fav.product_id || fav.id));
            setFavorites(favoriteIds);
          }
        } catch (error) {
          console.error('Error fetching favorites:', error);
        }
      }
    };
    fetchUserFavorites();
  }, [user]);

  // Get current banner
  const currentBanner = CATEGORY_BANNERS[categoryId] || CATEGORY_BANNERS['default'];

  // Breadcrumbs
  const breadcrumbs = [
    { name: 'Anasayfa', path: '/' },
    { name: 'Kategoriler', path: '/' },
    ...(subcategoryName ? [{ name: subcategoryName, path: '#' }] : [])
  ];

  // Fetch main categories
  const { data: categoriesData } = useQuery({
    queryKey: ['mainCategories'],
    queryFn: getMainCategories,
    staleTime: 5 * 60 * 1000, // 5 minutes cache
  });

  const availableCategories = categoriesData?.data?.categories || [];

  // Infinite Query
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading
  } = useInfiniteQuery({
    queryKey: ['products', categoryId, subcategoryName, sortBy, selectedCategories, priceRange, searchQuery],
    queryFn: ({ pageParam = 1 }) => {
      const params = {
        per_page: 12,
        page: pageParam
      };
      
      // Sıralama parametresi
      console.log('Aktif sortBy:', sortBy);
      if (sortBy && sortBy !== 'featured') {
        params.sort_by = sortBy;
      }
      
      // Arama parametresi
      if (searchQuery && searchQuery.trim() !== '') {
        params.search = searchQuery.trim();
        console.log('Arama yapılıyor:', searchQuery);
      }
      
      // Kategori filtresi: önce kullanıcı seçimi, sonra URL parametresi
      const selectedCategoryId = selectedCategories.length > 0 ? selectedCategories[0] : categoryId;
      if (selectedCategoryId) {
        params.category_id = selectedCategoryId;
      }
      
      if (subcategoryName) {
        params.subcategory = subcategoryName;
      }
      
      // Fiyat aralığı filtresi
      if (priceRange.min && priceRange.min !== '') {
        params.min_price = priceRange.min;
      }
      if (priceRange.max && priceRange.max !== '') {
        params.max_price = priceRange.max;
      }
      
      console.log('API parametreleri:', params);
      return getProducts(params);
    },
    getNextPageParam: (lastPage, allPages) => {
      console.log('lastPage:', lastPage);
      console.log('allPages:', allPages);
      const currentPage = lastPage.meta?.current_page || allPages.length;
      const lastPageNum = lastPage.meta?.last_page || 5; 
      return currentPage < lastPageNum ? currentPage + 1 : undefined;
    }
  });

  // Parse products from API response
  const products = data?.pages.flatMap(page => {
    console.log('Page data:', page);
    return page.data || [];
  }) || [];
  
  console.log('Total products:', products.length);
  console.log('Products:', products);

  // Intersection Observer for infinite scroll
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

  // Handlers
  const handleAddToCart = useCallback((product) => {
    addToCart(product); // CartContext zaten toast gösteriyor
    setQuickViewProduct(null);
  }, [addToCart]);

  const toggleCompare = useCallback((product) => {
    if (compareList.find(p => p.id === product.id)) {
      setCompareList(compareList.filter(p => p.id !== product.id));
      showToast('Ürün karşılaştırma listesinden çıkarıldı.', 'info');
    } else {
      if (compareList.length >= 3) {
        showToast('En fazla 3 ürün karşılaştırabilirsiniz.', 'warning');
        return;
      }
      const newCompareList = [...compareList, product];
      setCompareList(newCompareList);
      showToast('Ürün karşılaştırma listesine eklendi.', 'success');
      
      // 2 veya daha fazla ürün varsa otomatik modal aç
      if (newCompareList.length >= 2) {
        setTimeout(() => {
          setIsCompareModalOpen(true);
        }, 500); // Toast gösterildikten sonra modal açılsın
      }
    }
  }, [compareList, showToast]);

  const toggleCategory = useCallback((categoryId) => {
    if (categoryId === null) {
      setSelectedCategories([]);
    } else {
      setSelectedCategories([categoryId]);
    }
  }, []);

  // Mutation for toggling favorite
  const toggleFavoriteMutation = useMutation({
    mutationFn: toggleFavoriteApi,
    onSuccess: (data) => {
      if (data.success) {
        const productId = Number(data.data.product_id);
        // API yanıtından favorilere eklenip eklenmediğini öğren
        if (data.data.is_favorite) {
          setFavorites(prev => [...prev, productId]);
          showToast('Ürün favorilere eklendi!', 'success');
        } else {
          setFavorites(prev => prev.filter(id => Number(id) !== productId));
          showToast('Ürün favorilerden çıkarıldı.', 'info');
        }
      }
    },
    onError: (error) => {
      console.error('Favorite toggle error:', error);
      showToast(error.response?.data?.message || 'Favorilere eklenirken bir hata oluştu.', 'error');
    }
  });

  const toggleFavorite = useCallback((e, productId) => {
    e.stopPropagation();
    e.preventDefault();
    if (!user) {
      showToast('Favorilere eklemek için lütfen giriş yapın.', 'warning');
      navigate('/login');
      return;
    }
    // API çağrısı yap
    toggleFavoriteMutation.mutate(productId);
  }, [user, showToast, navigate, toggleFavoriteMutation]);

  return {
    // URL params
    categoryId,
    subcategoryName,

    // State
    isMobile,
    viewMode,
    sortBy,
    priceRange,
    searchQuery,
    selectedCategories,
    quickViewProduct,
    showMobileFilters,
    compareList,
    isCompareModalOpen,
    favorites,

    // Data
    products,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    currentBanner,
    breadcrumbs,
    availableCategories,

    // Refs
    loadMoreRef,

    // Setters
    setViewMode,
    setSortBy,
    setPriceRange,
    setSearchQuery,
    setQuickViewProduct,
    setShowMobileFilters,
    setIsCompareModalOpen,

    // Handlers
    handleAddToCart,
    toggleCompare,
    toggleCategory,
    toggleFavorite,
  };
};
