// src/pages/public/Home/components/DealSection.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { FaShoppingCart, FaClock, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import axios from 'axios';

const BACKEND_URL = 'http://127.0.0.1:8000';

/**
 * Dynamic Deal Section - Shows featured deals from database
 */
const DealSection = ({ addToCart, styles, isMobile }) => {
  const [deals, setDeals] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

  // Fetch featured deals from API
  useEffect(() => {
    const fetchDeals = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/v1/featured-deals`);
        console.log('Featured Deals Response:', response.data);
        if (response.data.success && response.data.data && response.data.data.deals) {
          setDeals(response.data.data.deals);
        }
      } catch (error) {
        console.error('Featured deals yüklenemedi:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDeals();
  }, []);

  // Current deal
  const currentDeal = deals[currentIndex];

  // Countdown timer
  useEffect(() => {
    if (!currentDeal?.ends_at) return;

    const calculateTimeLeft = () => {
      const endTime = new Date(currentDeal.ends_at).getTime();
      const now = new Date().getTime();
      const difference = endTime - now;

      if (difference > 0) {
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / (1000 * 60)) % 60);
        const seconds = Math.floor((difference / 1000) % 60);
        setTimeLeft({ hours, minutes, seconds });
      } else {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [currentDeal]);

  // Navigation
  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? deals.length - 1 : prev - 1));
  }, [deals.length]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === deals.length - 1 ? 0 : prev + 1));
  }, [deals.length]);

  // Auto-slide every 5 seconds
  useEffect(() => {
    if (deals.length <= 1) return;
    const interval = setInterval(goToNext, 5000);
    return () => clearInterval(interval);
  }, [deals.length, goToNext]);

  // Track click
  const handleClick = async () => {
    if (!currentDeal) return;
    try {
      await axios.post(`${BACKEND_URL}/api/v1/featured-deals/${currentDeal.id}/click`);
    } catch (error) {
      console.error('Click tracking failed:', error);
    }
  };

  // Add to cart
  const handleAddToCart = async () => {
    if (!currentDeal) return;
    
    handleClick();
    
    // Track conversion
    try {
      await axios.post(`${BACKEND_URL}/api/v1/featured-deals/${currentDeal.id}/conversion`);
    } catch (error) {
      console.error('Conversion tracking failed:', error);
    }

    addToCart({
      id: currentDeal.variant_id || currentDeal.product_id,
      product_id: currentDeal.product_id,
      variant_id: currentDeal.variant_id,
      name: currentDeal.product?.name,
      price: parseFloat(currentDeal.deal_price),
    });
  };

  // Format time
  const formatTime = (num) => num.toString().padStart(2, '0');

  // Loading state
  if (loading) {
    return (
      <div style={{
        ...styles.dealSection,
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '400px',
      }}>
        <div style={{
          width: '48px',
          height: '48px',
          border: '4px solid rgba(255,255,255,0.2)',
          borderTopColor: '#34d399',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // No deals
  if (!deals.length || !currentDeal) {
    return null; // Don't show section if no deals
  }

  // Get product image - API returns it in product.image or product.images[0]
  const productImage = currentDeal.product?.image || 
    currentDeal.product?.images?.[0] ||
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80';

  // Dynamic background color
  const bgColor = currentDeal.background_color || '#0f172a';

  return (
    <div style={{
      ...styles.dealSection,
      background: `linear-gradient(135deg, ${bgColor} 0%, ${adjustColor(bgColor, 20)} 100%)`,
      position: 'relative',
    }}>
      {/* Navigation Arrows */}
      {deals.length > 1 && !isMobile && (
        <>
          <button
            onClick={goToPrevious}
            style={{
              position: 'absolute',
              left: '20px',
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 10,
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              borderRadius: '50%',
              width: '48px',
              height: '48px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'white',
              fontSize: '20px',
              transition: 'all 0.3s',
            }}
            onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.3)'}
            onMouseLeave={(e) => e.target.style.background = 'rgba(255,255,255,0.2)'}
          >
            <FaChevronLeft />
          </button>
          <button
            onClick={goToNext}
            style={{
              position: 'absolute',
              right: '20px',
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 10,
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              borderRadius: '50%',
              width: '48px',
              height: '48px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'white',
              fontSize: '20px',
              transition: 'all 0.3s',
            }}
            onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.3)'}
            onMouseLeave={(e) => e.target.style.background = 'rgba(255,255,255,0.2)'}
          >
            <FaChevronRight />
          </button>
        </>
      )}

      {/* Deal Content */}
      <div style={{ 
        position: 'relative', 
        zIndex: 2, 
        maxWidth: isMobile ? '100%' : '500px', 
        textAlign: isMobile ? 'center' : 'left' 
      }}>
        {/* Badge */}
        <div style={{ 
          display: 'inline-block', 
          padding: '8px 16px', 
          backgroundColor: currentDeal.badge_color || '#ef4444', 
          borderRadius: '50px', 
          fontSize: isMobile ? '12px' : '14px', 
          fontWeight: '700', 
          marginBottom: isMobile ? '16px' : '24px' 
        }}>
          {currentDeal.badge_text || 'Özel Fırsat'}
        </div>

        {/* Title */}
        <h2 style={{ 
          fontFamily: '"DM Sans", sans-serif', 
          fontSize: isMobile ? '28px' : '48px', 
          fontWeight: '800', 
          marginBottom: isMobile ? '16px' : '24px', 
          lineHeight: 1.1 
        }}>
          {currentDeal.title || currentDeal.product?.name}
        </h2>

        {/* Description */}
        <p style={{ 
          fontSize: isMobile ? '14px' : '18px', 
          opacity: 0.8, 
          marginBottom: isMobile ? '20px' : '32px', 
          lineHeight: 1.6 
        }}>
          {currentDeal.description || 'Sınırlı süre için özel indirim fırsatı!'}
        </p>

        {/* Prices */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: isMobile ? '16px' : '24px', 
          marginBottom: isMobile ? '24px' : '40px', 
          justifyContent: isMobile ? 'center' : 'flex-start' 
        }}>
          <div style={{ 
            fontSize: isMobile ? '28px' : '36px', 
            fontWeight: '700', 
            color: '#34d399' 
          }}>
            {parseFloat(currentDeal.deal_price).toLocaleString('tr-TR')} TL
          </div>
          <div style={{ 
            fontSize: isMobile ? '18px' : '24px', 
            textDecoration: 'line-through', 
            opacity: 0.5 
          }}>
            {parseFloat(currentDeal.original_price).toLocaleString('tr-TR')} TL
          </div>
          {currentDeal.discount_percentage && (
            <div style={{
              backgroundColor: '#ef4444',
              color: 'white',
              padding: '4px 12px',
              borderRadius: '20px',
              fontSize: '14px',
              fontWeight: '700',
            }}>
              %{Math.round(currentDeal.discount_percentage)} İndirim
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div style={{ 
          display: 'flex', 
          flexDirection: isMobile ? 'column' : 'row', 
          gap: '16px', 
          alignItems: 'center', 
          justifyContent: isMobile ? 'center' : 'flex-start' 
        }}>
          <button 
            onClick={handleAddToCart} 
            style={{ 
              ...styles.heroBtn, 
              backgroundColor: '#34d399', 
              color: '#0f172a', 
              width: isMobile ? '100%' : 'auto' 
            }}
          >
            <FaShoppingCart /> Sepete Ekle
          </button>
          
          {/* Countdown Timer */}
          {currentDeal.ends_at && (
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '12px', 
              backgroundColor: 'rgba(255,255,255,0.1)', 
              padding: isMobile ? '10px 20px' : '12px 24px', 
              borderRadius: '50px' 
            }}>
              <FaClock /> 
              <div style={{ 
                display: 'flex', 
                gap: '8px', 
                fontSize: '20px', 
                fontWeight: '700', 
                color: '#ef4444' 
              }}>
                <span>{formatTime(timeLeft.hours)}</span>:
                <span>{formatTime(timeLeft.minutes)}</span>:
                <span>{formatTime(timeLeft.seconds)}</span>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Product Image - Desktop only */}
      {!isMobile && (
        <div style={{ position: 'relative', zIndex: 2 }}>
          <img 
            src={productImage} 
            alt={currentDeal.product?.name || 'Deal Product'} 
            style={{ 
              width: '400px', 
              height: '400px', 
              objectFit: 'cover', 
              borderRadius: '24px', 
              transform: 'rotate(-10deg)', 
              boxShadow: '0 20px 50px rgba(0,0,0,0.3)' 
            }} 
          />
        </div>
      )}
      
      {/* Background Pattern */}
      <div style={{ 
        position: 'absolute', 
        top: 0, 
        right: 0, 
        width: '600px', 
        height: '100%', 
        background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.05) 100%)', 
        transform: 'skewX(-20deg)' 
      }} />

      {/* Dots Indicator */}
      {deals.length > 1 && (
        <div style={{
          position: 'absolute',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: '8px',
          zIndex: 10,
        }}>
          {deals.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              style={{
                width: currentIndex === index ? '24px' : '8px',
                height: '8px',
                borderRadius: '4px',
                backgroundColor: currentIndex === index ? '#34d399' : 'rgba(255,255,255,0.4)',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.3s',
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// Helper function to adjust color brightness
function adjustColor(color, percent) {
  // If color is hex, convert and adjust
  if (color.startsWith('#')) {
    const num = parseInt(color.slice(1), 16);
    const r = Math.min(255, Math.max(0, (num >> 16) + percent));
    const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00FF) + percent));
    const b = Math.min(255, Math.max(0, (num & 0x0000FF) + percent));
    return `rgb(${r}, ${g}, ${b})`;
  }
  return color;
}

export default DealSection;
