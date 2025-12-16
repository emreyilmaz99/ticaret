// src/components/common/ProductCard/styles.js
export const getCardStyles = (isMobile, viewMode, isInCompareList = false, isFavorite = false) => ({
  card: {
    backgroundColor: 'white',
    borderRadius: isMobile ? '20px' : '24px',
    overflow: 'hidden',
    border: '1px solid #e5e7eb',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    textDecoration: 'none',
    color: 'inherit',
    height: '100%',
    ...(viewMode === 'list' && !isMobile ? { flexDirection: 'row', maxHeight: '280px' } : {}),
  },
  
  cardHover: {
    transform: 'translateY(-8px)',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.12)',
  },
  
  imageContainer: {
    width: viewMode === 'list' && !isMobile ? '280px' : '100%',
    height: viewMode === 'list' && !isMobile ? '100%' : isMobile ? '220px' : '280px',
    backgroundColor: '#fafafa',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'relative',
    flexShrink: 0,
  },
  
  cardImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
  },
  
  cardImageHover: {
    transform: 'scale(1.08)',
  },
  
  cardBody: {
    padding: isMobile ? '14px' : '18px',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  
  cardCategory: {
    fontSize: '10px',
    color: '#059669',
    textTransform: 'uppercase',
    fontWeight: '800',
    letterSpacing: '1px',
    marginBottom: '2px',
  },
  
  cardTitle: {
    fontSize: isMobile ? '13px' : '14px',
    fontWeight: '600',
    color: '#0f172a',
    lineHeight: '1.3',
    height: isMobile ? '34px' : '36px',
    overflow: 'hidden',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    marginBottom: '4px',
  },
  
  rating: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '11px',
    color: '#f59e0b',
    marginBottom: '6px',
  },
  
  priceSection: {
    marginTop: 'auto',
    paddingTop: '8px',
    borderTop: '1px solid #f1f5f9',
  },
  
  priceRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '10px',
  },
  
  priceGroup: { 
    display: 'flex', 
    flexDirection: 'column',
    gap: '2px',
    flex: 1,
  },
  
  price: { 
    fontSize: isMobile ? '17px' : '20px', 
    fontWeight: '800', 
    color: '#0f172a',
    letterSpacing: '-0.5px',
  },
  
  oldPrice: { 
    fontSize: '11px', 
    color: '#94a3b8', 
    textDecoration: 'line-through',
    fontWeight: '500',
  },
  
  buttonsRow: {
    display: 'flex',
    gap: '8px',
    width: '100%',
  },
  
  buyNowBtn: {
    flex: 1,
    height: '38px',
    borderRadius: '10px',
    backgroundColor: '#059669',
    color: 'white',
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    fontSize: '12px',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: '0 2px 8px rgba(5, 150, 105, 0.25)',
  },
  
  buyNowBtnHover: {
    backgroundColor: '#047857',
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 16px rgba(5, 150, 105, 0.35)',
  },
  
  addToCartBtn: {
    width: '38px',
    height: '38px',
    borderRadius: '10px',
    backgroundColor: '#f0fdf4',
    color: '#059669',
    border: '1px solid #d1fae5',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    flexShrink: 0,
  },
  
  addToCartBtnHover: {
    backgroundColor: '#059669',
    color: 'white',
    borderColor: '#059669',
    transform: 'scale(1.05)',
  },
  
  discountBadge: {
    position: 'absolute',
    top: '12px',
    left: '12px',
    backgroundColor: '#dc2626',
    color: 'white',
    fontSize: '10px',
    fontWeight: '800',
    padding: '5px 10px',
    borderRadius: '8px',
    zIndex: 3,
    boxShadow: '0 4px 12px rgba(220, 38, 38, 0.4)',
    letterSpacing: '0.5px',
  },
  
  actionOverlay: {
    position: 'absolute',
    top: '12px',
    right: '12px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    zIndex: 10,
  },
  
  cardActionBtn: {
    width: '36px',
    height: '36px',
    borderRadius: '10px',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(0, 0, 0, 0.06)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    color: '#64748b',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
  },
  
  cardActionBtnFavorite: {
    backgroundColor: isFavorite ? '#fee2e2' : 'rgba(255, 255, 255, 0.95)',
    borderColor: isFavorite ? '#fca5a5' : 'rgba(0, 0, 0, 0.06)',
  },
  
  cardActionBtnFavoriteHover: {
    backgroundColor: isFavorite ? '#fee2e2' : 'white',
    transform: 'scale(1.1)',
    borderColor: isFavorite ? '#fca5a5' : '#e5e7eb',
  },
  
  cardActionBtnQuickViewHover: {
    backgroundColor: '#f0fdf4',
    transform: 'scale(1.1)',
    color: '#059669',
    borderColor: '#d1fae5',
  },
  
  cardActionBtnCompare: {
    backgroundColor: isInCompareList ? '#059669' : 'rgba(255, 255, 255, 0.95)',
    color: isInCompareList ? 'white' : '#64748b',
    borderColor: isInCompareList ? '#059669' : 'rgba(0, 0, 0, 0.06)',
  },
  
  cardActionBtnCompareHover: {
    backgroundColor: isInCompareList ? '#059669' : '#f0fdf4',
    color: isInCompareList ? 'white' : '#059669',
    borderColor: isInCompareList ? '#059669' : '#d1fae5',
    transform: 'scale(1.1)',
  },
});
