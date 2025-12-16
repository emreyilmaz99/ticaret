// src/pages/public/ProductDetail/useProductDetail.js
import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getProduct, getRelatedProducts } from '../../../api/publicApi';
import { useCart } from '../../../context/CartContext';
import { useFavorites } from '../../../context/FavoritesContext';
import { useToast } from '../../../components/common/Toast';
import { useAuth } from '../../../context/AuthContext';

/**
 * Custom hook for ProductDetail page
 */
export const useProductDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();
  const toast = useToast();

  // Responsive state
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Product view state
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState('description');
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [showLightbox, setShowLightbox] = useState(false);

  // Handle resize
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetch product data
  const { data, isLoading, error } = useQuery({
    queryKey: ['product', slug],
    queryFn: () => getProduct(slug),
    enabled: !!slug,
  });

  // Fetch related products
  const { data: relatedData } = useQuery({
    queryKey: ['relatedProducts', slug],
    queryFn: () => getRelatedProducts(slug, 4),
    enabled: !!slug,
  });

  const product = data?.data?.product;
  const relatedProducts = relatedData?.data?.products || [];

  // Set default variant when product loads
  useEffect(() => {
    if (product?.variants?.length > 0 && !selectedVariant) {
      setSelectedVariant(product.variants[0]);
    }
  }, [product, selectedVariant]);

  // Load recently viewed products from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('recentlyViewed');
    if (stored) {
      setRecentlyViewed(JSON.parse(stored).filter(p => p.slug !== slug));
    }
  }, [slug]);

  // Save current product to recently viewed
  useEffect(() => {
    if (product) {
      const stored = localStorage.getItem('recentlyViewed');
      let items = stored ? JSON.parse(stored) : [];
      items = items.filter(p => p.slug !== product.slug);
      items.unshift({
        id: product.id,
        slug: product.slug,
        name: product.name,
        price: product.price,
        image: product.images?.[0]?.url
      });
      items = items.slice(0, 10);
      localStorage.setItem('recentlyViewed', JSON.stringify(items));
    }
  }, [product]);

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!showLightbox) return;
      
      if (e.key === 'Escape') {
        setShowLightbox(false);
      } else if (e.key === 'ArrowLeft' && product?.images?.length > 1) {
        setSelectedImage(prev => prev === 0 ? product.images.length - 1 : prev - 1);
      } else if (e.key === 'ArrowRight' && product?.images?.length > 1) {
        setSelectedImage(prev => prev === product.images.length - 1 ? 0 : prev + 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showLightbox, product]);

  // Prevent body scroll when lightbox is open
  useEffect(() => {
    if (showLightbox) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showLightbox]);

  // Calculated values
  // If product has deal, use deal price; otherwise use variant/product price
  const currentPrice = product?.has_deal ? product?.price : (selectedVariant?.price || product?.price || 0);
  const currentStock = selectedVariant?.stock ?? product?.stock ?? 0;
  const isInStock = currentStock > 0;
  const showLowStockWarning = product?.low_stock_warning || (selectedVariant?.low_stock);

  // Social sharing
  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareText = product?.name || '';

  // Handlers
  const handleAddToCart = useCallback(() => {
    if (!user) {
      toast.warning('Dikkat', 'Sepete eklemek için lütfen giriş yapın.');
      navigate('/register');
      return;
    }

    if (!isInStock) {
      toast.error('Hata', 'Bu ürün şu anda stokta yok.');
      return;
    }

    addToCart({
      id: product.id,
      variantId: selectedVariant?.id,
    }, quantity, selectedVariant);
  }, [user, isInStock, product, selectedVariant, quantity, addToCart, toast, navigate]);

  const handleShare = useCallback((platform) => {
    const urls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`,
    };
    if (urls[platform]) {
      window.open(urls[platform], '_blank', 'width=600,height=400');
    }
    setShowShareMenu(false);
  }, [shareUrl, shareText]);

  const copyToClipboard = useCallback(() => {
    navigator.clipboard.writeText(shareUrl);
    toast.success('Kopyalandı', 'Ürün linki panoya kopyalandı!');
    setShowShareMenu(false);
  }, [shareUrl, toast]);

  const handleToggleFavorite = useCallback(() => {
    toggleFavorite({
      id: product?.id,
      name: product?.name,
      slug: product?.slug,
      image: product?.images?.[0]?.url || product?.image,
      price: currentPrice,
      compare_price: product?.compare_price,
      stock: currentStock,
      in_stock: isInStock
    });
  }, [product, currentPrice, currentStock, isInStock, toggleFavorite]);

  return {
    // State
    isMobile,
    quantity,
    selectedVariant,
    selectedImage,
    activeTab,
    showShareMenu,
    recentlyViewed,
    showLightbox,

    // Data
    product,
    relatedProducts,
    isLoading,
    error,

    // Calculated
    currentPrice,
    currentStock,
    isInStock,
    showLowStockWarning,

    // Context
    isFavorite,

    // Setters
    setQuantity,
    setSelectedVariant,
    setSelectedImage,
    setActiveTab,
    setShowShareMenu,
    setShowLightbox,

    // Handlers
    handleAddToCart,
    handleShare,
    copyToClipboard,
    handleToggleFavorite,
  };
};
