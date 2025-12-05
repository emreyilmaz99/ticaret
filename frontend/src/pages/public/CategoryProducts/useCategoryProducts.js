// src/pages/public/CategoryProducts/useCategoryProducts.js
import { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useCart } from '../../../context/CartContext';
import { useToast } from '../../../components/Toast';
import { getProducts } from '../../../api/publicApi';
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
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  
  // Comparison State
  const [compareList, setCompareList] = useState([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

  const { addToCart } = useCart();
  const { showToast } = useToast();
  const loadMoreRef = useRef();

  // Handle resize
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Get current banner
  const currentBanner = CATEGORY_BANNERS[categoryId] || CATEGORY_BANNERS['default'];

  // Breadcrumbs
  const breadcrumbs = [
    { name: 'Anasayfa', path: '/' },
    { name: 'Kategoriler', path: '/' },
    ...(subcategoryName ? [{ name: subcategoryName, path: '#' }] : [])
  ];

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
    addToCart(product);
    showToast(`${product.name} sepete eklendi!`, 'success');
    setQuickViewProduct(null);
  }, [addToCart, showToast]);

  const toggleCompare = useCallback((product) => {
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
  }, [compareList, showToast]);

  const toggleBrand = useCallback((brand, isChecked) => {
    if (isChecked) {
      setSelectedBrands(prev => [...prev, brand]);
    } else {
      setSelectedBrands(prev => prev.filter(b => b !== brand));
    }
  }, []);

  return {
    // URL params
    categoryId,
    subcategoryName,

    // State
    isMobile,
    viewMode,
    sortBy,
    priceRange,
    selectedBrands,
    quickViewProduct,
    showMobileFilters,
    compareList,
    isCompareModalOpen,

    // Data
    products,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    currentBanner,
    breadcrumbs,

    // Refs
    loadMoreRef,

    // Setters
    setViewMode,
    setSortBy,
    setPriceRange,
    setQuickViewProduct,
    setShowMobileFilters,
    setIsCompareModalOpen,

    // Handlers
    handleAddToCart,
    toggleCompare,
    toggleBrand,
  };
};
