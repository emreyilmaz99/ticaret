// src/pages/public/Home/components/HeroSection.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FaShoppingCart, FaStore, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const slides = [
  {
    id: 1,
    title: "Tarzını Keşfet,\nFırsatları Yakala.",
    subtitle: "En yeni koleksiyonlar, özel indirimler ve binlerce ürün seçeneği ile alışverişin keyfini çıkarın.",
    primaryBtn: { text: "Alışverişe Başla", link: "/products", icon: <FaShoppingCart /> },
    secondaryBtn: { text: "Satıcı Ol", link: "/vendor/register", icon: <FaStore /> },
    bgColor: "linear-gradient(135deg, #059669 0%, #047857 100%)",
    emoji: "🛍️"
  },
  {
    id: 2,
    title: "Elektronikte\nDev İndirimler",
    subtitle: "Akıllı telefonlardan laptoplara, en yeni teknoloji ürünlerinde kaçırılmayacak fırsatlar.",
    primaryBtn: { text: "İncele", link: "/products?category=elektronik", icon: <FaShoppingCart /> },
    secondaryBtn: null,
    bgColor: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
    emoji: "📱"
  },
  {
    id: 3,
    title: "Eviniz İçin\nEn İyisi",
    subtitle: "Mobilyadan dekorasyona, evinizin havasını değiştirecek şık ve modern tasarımlar.",
    primaryBtn: { text: "Keşfet", link: "/products?category=ev-yasam", icon: <FaShoppingCart /> },
    secondaryBtn: null,
    bgColor: "linear-gradient(135deg, #d97706 0%, #b45309 100%)",
    emoji: "🏠"
  }
];

/**
 * Hero section with slider and swipe support
 */
const HeroSection = ({ styles, isMobile }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const timeoutRef = useRef(null);

  const resetTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  useEffect(() => {
    resetTimeout();
    timeoutRef.current = setTimeout(
      () => setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1)),
      5000
    );

    return () => resetTimeout();
  }, [currentSlide]);

  // Touch Handlers for Swipe
  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }
    if (isRightSwipe) {
      setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
    }
  };

  const slide = slides[currentSlide];

  return (
    <div 
      style={{ ...styles.hero, background: slide.bgColor, transition: 'background 0.5s ease', position: 'relative', overflow: 'hidden' }}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <div style={styles.heroContent}>
        <div style={{ ...styles.heroText, animation: 'fadeIn 0.5s ease-in-out' }} key={slide.id}>
          <h1 style={{ ...styles.heroTitle, whiteSpace: 'pre-line' }}>
            {slide.title}
          </h1>
          <p style={styles.heroSubtitle}>
            {slide.subtitle}
          </p>
          <div style={styles.heroButtons}>
            <Link to={slide.primaryBtn.link} style={styles.heroBtn}>
              {slide.primaryBtn.icon} {slide.primaryBtn.text}
            </Link>
            {slide.secondaryBtn && (
              <Link to={slide.secondaryBtn.link} style={styles.secondaryButton}>
                {slide.secondaryBtn.icon} {slide.secondaryBtn.text}
              </Link>
            )}
          </div>
        </div>
        
        {/* Hero Image - Hidden on mobile */}
        {!isMobile && (
          <div style={{ 
            width: '400px', 
            height: '300px', 
            backgroundColor: 'rgba(255,255,255,0.1)', 
            borderRadius: '24px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            animation: 'float 6s ease-in-out infinite'
          }}>
            <span style={{ fontSize: '120px', filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.2))' }}>
              {slide.emoji}
            </span>
          </div>
        )}
      </div>

      {/* Indicators */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: '8px',
        zIndex: 10
      }}>
        {slides.map((_, idx) => (
          <div 
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            style={{
              width: currentSlide === idx ? '24px' : '8px',
              height: '8px',
              borderRadius: '4px',
              backgroundColor: 'white',
              opacity: currentSlide === idx ? 1 : 0.4,
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}
          />
        ))}
      </div>

      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
            100% { transform: translateY(0px); }
          }
        `}
      </style>
    </div>
  );
};

export default HeroSection;
