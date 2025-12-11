import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaToggleOn, FaToggleOff, FaEye, FaMousePointer, FaShoppingCart, FaClock, FaImage, FaFire } from 'react-icons/fa';

const BACKEND_URL = 'http://127.0.0.1:8000';

const DealCard = ({ deal, onEdit, onDelete, onToggle, isDeleting, isToggling }) => {
  const [hoveredBtn, setHoveredBtn] = useState(null);
  const [isCardHovered, setIsCardHovered] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isExpired, setIsExpired] = useState(false);

  // Countdown timer effect
  useEffect(() => {
    if (!deal.ends_at || !deal.is_active) return;

    const calculateTimeLeft = () => {
      const endTime = new Date(deal.ends_at).getTime();
      const now = new Date().getTime();
      const difference = endTime - now;

      if (difference > 0) {
        setIsExpired(false);
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      } else {
        setIsExpired(true);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [deal.ends_at, deal.is_active]);

  const formatTime = (num) => num.toString().padStart(2, '0');
  
  const getStatusBadge = () => {
    if (!deal.is_active) {
      return { text: 'Pasif', color: '#6b7280', bgColor: '#f3f4f6' };
    }
    
    const now = new Date();
    const startsAt = deal.starts_at ? new Date(deal.starts_at) : null;
    const endsAt = deal.ends_at ? new Date(deal.ends_at) : null;
    
    // Check if currently active based on dates
    if (startsAt && startsAt > now) {
      return { text: 'Yaklaşan', color: '#f59e0b', bgColor: '#fef3c7' };
    }
    if (endsAt && endsAt < now) {
      return { text: 'Süresi Dolmuş', color: '#ef4444', bgColor: '#fee2e2' };
    }
    
    // If is_active_now is explicitly set, use it
    if (deal.is_active_now !== undefined) {
      if (deal.is_active_now) {
        return { text: 'Aktif', color: '#059669', bgColor: '#d1fae5' };
      }
    }
    
    // If active and within date range (or no dates set), consider it active
    if (deal.is_active) {
      return { text: 'Aktif', color: '#059669', bgColor: '#d1fae5' };
    }
    
    return { text: 'Pasif', color: '#6b7280', bgColor: '#f3f4f6' };
  };

  const status = getStatusBadge();

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Get product image URL - check multiple possible paths
  const getImageUrl = () => {
    let url = null;
    
    if (deal.product?.photos?.[0]?.url) {
      url = deal.product.photos[0].url;
    } else if (deal.product?.photos?.[0]?.file_path) {
      url = deal.product.photos[0].file_path;
    } else if (deal.product?.main_image) {
      url = deal.product.main_image;
    } else if (deal.product?.image) {
      url = deal.product.image;
    } else if (deal.product?.images?.[0]) {
      url = deal.product.images[0];
    }
    
    // If URL exists and doesn't start with http, add backend URL
    if (url && !url.startsWith('http')) {
      return `${BACKEND_URL}${url.startsWith('/') ? '' : '/'}${url}`;
    }
    
    return url;
  };

  const imageUrl = getImageUrl();

  return (
    <div 
      style={{
        ...styles.card,
        transform: isCardHovered ? 'translateY(-8px)' : 'translateY(0)',
        boxShadow: isCardHovered 
          ? '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' 
          : '0 1px 3px rgba(0, 0, 0, 0.06)',
      }}
      onMouseEnter={() => setIsCardHovered(true)}
      onMouseLeave={() => setIsCardHovered(false)}
    >
      {/* Card Header with Image */}
      <div style={styles.imageContainer}>
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={deal.product?.name || 'Ürün'}
            style={{
              ...styles.image,
              transform: isCardHovered ? 'scale(1.05)' : 'scale(1)',
            }}
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}
        <div style={{...styles.noImage, display: imageUrl ? 'none' : 'flex'}}>
          <FaImage size={40} color="#cbd5e1" />
        </div>
        
        {/* Status Badge Overlay */}
        <div style={{
          ...styles.statusOverlay,
          backgroundColor: status.bgColor,
          color: status.color,
        }}>
          {status.text}
        </div>

        {/* Discount Badge */}
        <div style={styles.discountOverlay}>
          %{Math.round(deal.discount_percentage || 0)}
        </div>
      </div>

      {/* Card Body */}
      <div style={styles.cardBody}>
        {/* Product Title */}
        <h3 style={styles.title}>
          {deal.title || deal.product?.name || 'Ürün Adı'}
        </h3>

        {/* Variant Info */}
        {deal.variant && (
          <div style={styles.variantBadge}>
            Varyant: {deal.variant.sku || deal.variant.title}
          </div>
        )}

        {/* Vendor */}
        <p style={styles.vendor}>
          {deal.product?.vendor?.business_name || deal.product?.vendor?.store_name || 'Satıcı'}
        </p>

        {/* Pricing */}
        <div style={styles.pricingBox}>
          <div style={styles.priceContainer}>
            <span style={styles.originalPrice}>{parseFloat(deal.original_price).toFixed(2)} TL</span>
            <span style={styles.dealPrice}>{parseFloat(deal.deal_price).toFixed(2)} TL</span>
          </div>
          {deal.badge_text && (
            <div style={{
              ...styles.badge,
              backgroundColor: deal.badge_color || '#ef4444',
            }}>
              {deal.badge_text}
            </div>
          )}
        </div>

        {/* Dates */}
        <div style={styles.dateInfo}>
          <div style={styles.dateItem}>
            <FaClock size={11} color="#94a3b8" />
            <span style={styles.dateLabel}>Başlangıç:</span>
            <span style={styles.dateValue}>{formatDate(deal.starts_at)}</span>
          </div>
          <div style={styles.dateItem}>
            <FaClock size={11} color="#94a3b8" />
            <span style={styles.dateLabel}>Bitiş:</span>
            <span style={styles.dateValue}>{formatDate(deal.ends_at)}</span>
          </div>
        </div>

        {/* Countdown Timer */}
        {deal.is_active && deal.ends_at && !isExpired && (
          <div style={styles.countdownContainer}>
            <div style={styles.countdownHeader}>
              <FaFire size={12} color="#ef4444" />
              <span style={styles.countdownLabel}>Kalan Süre</span>
            </div>
            <div style={styles.countdownTimer}>
              <div style={styles.timeUnit}>
                <span style={styles.timeValue}>{formatTime(timeLeft.days)}</span>
                <span style={styles.timeLabel}>Gün</span>
              </div>
              <span style={styles.timeSeparator}>:</span>
              <div style={styles.timeUnit}>
                <span style={styles.timeValue}>{formatTime(timeLeft.hours)}</span>
                <span style={styles.timeLabel}>Saat</span>
              </div>
              <span style={styles.timeSeparator}>:</span>
              <div style={styles.timeUnit}>
                <span style={styles.timeValue}>{formatTime(timeLeft.minutes)}</span>
                <span style={styles.timeLabel}>Dk</span>
              </div>
              <span style={styles.timeSeparator}>:</span>
              <div style={styles.timeUnit}>
                <span style={{...styles.timeValue, color: '#ef4444'}}>{formatTime(timeLeft.seconds)}</span>
                <span style={styles.timeLabel}>Sn</span>
              </div>
            </div>
          </div>
        )}

        {/* Expired Notice */}
        {isExpired && deal.ends_at && (
          <div style={styles.expiredNotice}>
            <FaClock size={12} color="#ef4444" />
            <span>Kampanya süresi doldu</span>
          </div>
        )}

        {/* Analytics */}
        <div style={styles.stats}>
          <div style={styles.statItem}>
            <FaEye size={13} color="#64748b" />
            <span>{deal.view_count || 0}</span>
          </div>
          <div style={styles.statDivider} />
          <div style={styles.statItem}>
            <FaMousePointer size={13} color="#64748b" />
            <span>{deal.click_count || 0}</span>
          </div>
          <div style={styles.statDivider} />
          <div style={styles.statItem}>
            <FaShoppingCart size={13} color="#64748b" />
            <span>{deal.conversion_count || 0}</span>
          </div>
        </div>
      </div>

      {/* Card Footer - Actions */}
      <div style={styles.footer}>
        <div style={styles.sortInfo}>
          Sıra: {deal.sort_order}
        </div>
        <div style={styles.actions}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (!isToggling) {
                onToggle();
              }
            }}
            onMouseEnter={() => setHoveredBtn('toggle')}
            onMouseLeave={() => setHoveredBtn(null)}
            disabled={isToggling}
            style={{
              ...styles.toggleBtn,
              transform: hoveredBtn === 'toggle' ? 'scale(1.1)' : 'scale(1)',
              opacity: isToggling ? 0.5 : 1,
              cursor: isToggling ? 'wait' : 'pointer',
            }}
            title={deal.is_active ? 'Pasif Yap' : 'Aktif Yap'}
          >
            {isToggling ? (
              <span style={{ fontSize: '14px' }}>⏳</span>
            ) : deal.is_active ? (
              <FaToggleOn size={22} color="#059669" />
            ) : (
              <FaToggleOff size={22} color="#94a3b8" />
            )}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            onMouseEnter={() => setHoveredBtn('edit')}
            onMouseLeave={() => setHoveredBtn(null)}
            style={{
              ...styles.editBtn,
              backgroundColor: hoveredBtn === 'edit' ? '#dbeafe' : '#eff6ff',
              transform: hoveredBtn === 'edit' ? 'translateY(-2px)' : 'translateY(0)',
              boxShadow: hoveredBtn === 'edit' ? '0 4px 12px rgba(59, 130, 246, 0.3)' : 'none',
              cursor: 'pointer',
            }}
            title="Düzenle"
          >
            <FaEdit size={15} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (!isDeleting) {
                onDelete();
              }
            }}
            onMouseEnter={() => setHoveredBtn('delete')}
            onMouseLeave={() => setHoveredBtn(null)}
            disabled={isDeleting}
            style={{
              ...styles.deleteBtn,
              backgroundColor: hoveredBtn === 'delete' ? '#fee2e2' : '#fef2f2',
              transform: hoveredBtn === 'delete' ? 'translateY(-2px)' : 'translateY(0)',
              boxShadow: hoveredBtn === 'delete' ? '0 4px 12px rgba(239, 68, 68, 0.3)' : 'none',
              opacity: isDeleting ? 0.5 : 1,
              cursor: isDeleting ? 'wait' : 'pointer',
            }}
            title="Sil"
          >
            {isDeleting ? (
              <span style={{ fontSize: '14px' }}>⏳</span>
            ) : (
              <FaTrash size={15} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  card: {
    backgroundColor: 'white',
    borderRadius: '16px',
    overflow: 'hidden',
    border: '1px solid #e2e8f0',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.06)',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: '200px',
    backgroundColor: '#f8fafc',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.3s',
  },
  noImage: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f1f5f9',
  },
  statusOverlay: {
    position: 'absolute',
    top: '12px',
    left: '12px',
    padding: '6px 14px',
    borderRadius: '20px',
    fontSize: '11px',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    backdropFilter: 'blur(8px)',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  discountOverlay: {
    position: 'absolute',
    top: '12px',
    right: '12px',
    backgroundColor: '#dc2626',
    color: 'white',
    padding: '8px 14px',
    borderRadius: '12px',
    fontSize: '15px',
    fontWeight: '800',
    boxShadow: '0 4px 12px rgba(220, 38, 38, 0.4)',
  },
  cardBody: {
    padding: '20px',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  title: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#0f172a',
    lineHeight: '1.4',
    margin: 0,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    minHeight: '44px',
  },
  variantBadge: {
    display: 'inline-block',
    padding: '4px 10px',
    backgroundColor: '#f0f9ff',
    color: '#0369a1',
    borderRadius: '6px',
    fontSize: '11px',
    fontWeight: '600',
    alignSelf: 'flex-start',
  },
  vendor: {
    fontSize: '13px',
    color: '#64748b',
    fontWeight: '500',
    margin: 0,
  },
  pricingBox: {
    backgroundColor: '#f8fafc',
    padding: '14px',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
  },
  priceContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '8px',
  },
  originalPrice: {
    fontSize: '14px',
    color: '#94a3b8',
    textDecoration: 'line-through',
    fontWeight: '500',
  },
  dealPrice: {
    fontSize: '26px',
    fontWeight: '800',
    color: '#059669',
    letterSpacing: '-0.5px',
  },
  badge: {
    padding: '6px 12px',
    borderRadius: '8px',
    color: 'white',
    fontSize: '11px',
    fontWeight: '700',
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  dateInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    paddingTop: '8px',
    borderTop: '1px solid #f1f5f9',
  },
  dateItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '11px',
  },
  dateLabel: {
    color: '#94a3b8',
    fontWeight: '500',
  },
  dateValue: {
    color: '#475569',
    fontWeight: '600',
  },
  stats: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
    padding: '12px 0',
    borderTop: '1px solid #f1f5f9',
  },
  statItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '13px',
    fontWeight: '600',
    color: '#334155',
  },
  statDivider: {
    width: '1px',
    height: '20px',
    backgroundColor: '#e2e8f0',
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '14px 20px',
    borderTop: '1px solid #f1f5f9',
    backgroundColor: '#fafbfc',
  },
  sortInfo: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#64748b',
  },
  actions: {
    display: 'flex',
    gap: '8px',
  },
  toggleBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '6px',
    borderRadius: '8px',
    transition: 'all 0.2s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  editBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '8px 10px',
    borderRadius: '8px',
    color: '#3b82f6',
    transition: 'all 0.2s',
    backgroundColor: '#eff6ff',
  },
  deleteBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '8px 10px',
    borderRadius: '8px',
    color: '#ef4444',
    transition: 'all 0.2s',
    backgroundColor: '#fef2f2',
  },
  // Countdown Timer Styles
  countdownContainer: {
    backgroundColor: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
    background: 'linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)',
    padding: '12px',
    borderRadius: '12px',
    marginTop: '8px',
    border: '1px solid #fed7aa',
  },
  countdownHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    marginBottom: '8px',
    justifyContent: 'center',
  },
  countdownLabel: {
    fontSize: '11px',
    fontWeight: '700',
    color: '#c2410c',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  countdownTimer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '4px',
  },
  timeUnit: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: '6px 10px',
    borderRadius: '8px',
    minWidth: '42px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  timeValue: {
    fontSize: '18px',
    fontWeight: '800',
    color: '#ea580c',
    lineHeight: 1,
  },
  timeLabel: {
    fontSize: '9px',
    fontWeight: '600',
    color: '#9a3412',
    textTransform: 'uppercase',
    marginTop: '2px',
  },
  timeSeparator: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#ea580c',
  },
  expiredNotice: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    backgroundColor: '#fee2e2',
    color: '#dc2626',
    padding: '10px',
    borderRadius: '8px',
    fontSize: '12px',
    fontWeight: '600',
    marginTop: '8px',
    border: '1px solid #fecaca',
  },
};

export default DealCard;
