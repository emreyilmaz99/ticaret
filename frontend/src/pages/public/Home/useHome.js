// src/pages/public/Home/useHome.js
import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useToast } from '../../../components/common/Toast';
import { useAuth } from '../../../context/AuthContext';
import { useCart } from '../../../context/CartContext';
import { getProducts, getCategories } from '../../../api/publicApi';
import apiClient from '@lib/apiClient';

/**
 * Custom hook for Home page state and logic
 */
export const useHome = () => {
  const [searchParams] = useSearchParams();
  const { showToast } = useToast();
  const { user } = useAuth();
  const { fetchCart } = useCart();
  const navigate = useNavigate();
  
  // Responsive state
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  
  // UI States
  const [showCookieBanner, setShowCookieBanner] = useState(true);
  const [favorites, setFavorites] = useState([]);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [compareList, setCompareList] = useState([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  
  // Filter States
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [minRating, setMinRating] = useState(0);
  const [sortOrder, setSortOrder] = useState('featured');

  // Handle resize
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Sync category with URL params
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [searchParams]);

  // Fetch categories
  const { data: categoriesData } = useQuery({
    queryKey: ['public-categories'],
    queryFn: getCategories,
    staleTime: 5 * 60 * 1000,
  });

  // Fetch products
  const { 
    data: productsData, 
    isLoading: productsLoading, 
    error: productsError 
  } = useQuery({
    queryKey: ['public-products', selectedCategory, priceRange, sortOrder],
    queryFn: () => getProducts({
      category_id: selectedCategory !== 'all' ? selectedCategory : undefined,
      min_price: priceRange[0] > 0 ? priceRange[0] : undefined,
      max_price: priceRange[1] < 100000 ? priceRange[1] : undefined,
      sort_by: sortOrder === 'price-asc' ? 'price_asc' : sortOrder === 'price-desc' ? 'price_desc' : 'featured',
      per_page: 12,
    }),
    staleTime: 1 * 60 * 1000,
  });

  // Transform categories
  const categories = [
    { id: 'all', name: 'Tüm Ürünler' },
    ...(categoriesData?.data || []).map(cat => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      icon: cat.icon,
      image: cat.image,
    })),
  ];

  // Get products from API response
  const products = productsData?.data || [];

  // Filter by rating (client-side)
  const filteredProducts = products.filter(product => {
    return (product.rating || 0) >= minRating;
  });

  // Add to cart handler
  const addToCart = useCallback(async (product) => {
    if (!user) {
      showToast('Sepete eklemek için lütfen giriş yapın.', 'warning');
      navigate('/register');
      return;
    }

    try {
      const payload = {
        product_id: product.product_id || product.id,
        variant_id: product.variant_id || null,
        quantity: product.quantity || 1,
      };

      console.log('Adding to cart:', payload);

      const response = await apiClient.post('/v1/cart/items', payload);

      if (response.data.success) {
        showToast(`${product.name} sepete eklendi!`, 'success');
        // Sepet state'ini güncelle - bu sayede badge otomatik güncellenecek
        await fetchCart();
        if (quickViewProduct) setQuickViewProduct(null);
      } else {
        showToast(response.data.message || 'Sepete eklenirken bir hata oluştu.', 'error');
      }
    } catch (error) {
      console.error('Add to cart error:', error);
      const errorMessage = error.response?.data?.message || 'Sepete eklenirken bir hata oluştu.';
      showToast(errorMessage, 'error');
    }
  }, [user, showToast, navigate, quickViewProduct, fetchCart]);

  // Toggle favorite handler
  const toggleFavorite = useCallback((e, productId) => {
    e.stopPropagation();
    e.preventDefault();
    if (!user) {
      showToast('Favorilere eklemek için lütfen giriş yapın.', 'warning');
      navigate('/login');
      return;
    }
    if (favorites.includes(productId)) {
      setFavorites(favorites.filter(id => id !== productId));
      showToast('Ürün favorilerden çıkarıldı.', 'info');
    } else {
      setFavorites([...favorites, productId]);
      showToast('Ürün favorilere eklendi!', 'success');
    }
  }, [user, favorites, showToast, navigate]);

  // Category change handler
  const handleCategoryChange = useCallback((categoryId) => {
    setSelectedCategory(categoryId);
  }, []);

  // Compare handler
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
        }, 500);
      }
    }
  }, [compareList, showToast]);

  // Clear filters
  const clearFilters = useCallback(() => {
    setSelectedCategory('all');
    setPriceRange([0, 100000]);
    setMinRating(0);
  }, []);

  return {
    // State
    isMobile,
    showCookieBanner,
    favorites,
    quickViewProduct,
    compareList,
    isCompareModalOpen,
    selectedCategory,
    priceRange,
    minRating,
    sortOrder,
    
    // Data
    categories,
    filteredProducts,
    productsLoading,
    productsError,
    
    // Setters
    setShowCookieBanner,
    setQuickViewProduct,
    setIsCompareModalOpen,
    setPriceRange,
    setMinRating,
    setSortOrder,
    
    // Handlers
    addToCart,
    toggleFavorite,
    toggleCompare,
    handleCategoryChange,
    clearFilters,
  };
};
