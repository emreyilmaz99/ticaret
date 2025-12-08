// src/pages/public/Auth/hooks/useAuth.js
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth as useAuthContext } from '../../../../context/AuthContext';
import { useCart } from '../../../../context/CartContext';
import { useToast } from '../../../../components/common/Toast';

/**
 * Custom hook for shared auth logic (login/register)
 */
export const useAuthForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  
  const auth = useAuthContext();
  const { mergeGuestCart, fetchCart } = useCart();
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handlePostAuth = async () => {
    try {
      await mergeGuestCart();
      await fetchCart();
    } catch (cartError) {
      console.error('Sepet aktarılırken hata:', cartError);
    }
    navigate('/account/profile');
  };

  return {
    isLoading,
    setIsLoading,
    isMobile,
    auth,
    toast,
    handlePostAuth,
  };
};
