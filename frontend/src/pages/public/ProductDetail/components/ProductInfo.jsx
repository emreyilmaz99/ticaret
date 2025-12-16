// src/pages/public/ProductDetail/components/ProductInfo.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FaStar, FaStore, FaCheck, FaBox, FaExclamationTriangle, 
  FaMinus, FaPlus, FaShoppingCart, FaHeart, FaRegHeart, 
  FaShareAlt, FaTruck, FaShieldAlt, FaUndo 
} from 'react-icons/fa';
import ShareMenu from './ShareMenu';
import VendorCard from './VendorCard';
import { formatPrice } from '../styles';

/**
 * Product information section
 */
const ProductInfo = ({
  product,
  selectedVariant,
  setSelectedVariant,
  quantity,
  setQuantity,
  currentPrice,
  currentStock,
  isInStock,
  showLowStockWarning,
  isFavorite,
  showShareMenu,
  setShowShareMenu,
  handleAddToCart,
  handleToggleFavorite,
  handleShare,
  copyToClipboard,
  styles,
}) => {
  return (
    <div style={styles.infoSection}>
      {/* Vendor Link */}
      {product.vendor && (
        <Link to={`/store/${product.vendor.slug}`} style={styles.vendorLink}>
          <FaStore />
          {product.vendor.name}
          {product.vendor.rating > 0 && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#f59e0b' }}>
              <FaStar size={12} /> {parseFloat(product.vendor.rating).toFixed(1)}
            </span>
          )}
        </Link>
      )}

      {/* Title */}
      <h1 style={styles.title}>{product.name}</h1>

      {/* Deal Badge */}
      {product.has_deal && product.deal_badge && (
        <div style={{
          display: 'inline-block',
          backgroundColor: product.deal_badge.color || '#ef4444',
          color: 'white',
          fontSize: '14px',
          fontWeight: '700',
          padding: '6px 16px',
          borderRadius: '20px',
          marginBottom: '12px'
        }}>
          {product.deal_badge.text}
        </div>
      )}

      {/* Rating */}
      <div style={styles.rating}>
        <div style={styles.stars}>
          {[...Array(5)].map((_, i) => {
            const rating = parseFloat(product.rating_avg || product.rating || 0);
            const isFilled = i < Math.floor(rating);
            return (
              <FaStar 
                key={i} 
                size={16} 
                color={isFilled ? '#f59e0b' : '#e2e8f0'} 
              />
            );
          })}
        </div>
        <span style={styles.reviewsText}>
          {parseFloat(product.rating_avg || product.rating || 0).toFixed(1)} ({product.review_count || product.reviews_count || 0} değerlendirme)
        </span>
      </div>

      {/* Price */}
      <div style={styles.priceSection}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {/* Original price if deal exists */}
          {product.has_deal && product.original_price && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{
                fontSize: '20px',
                color: '#94a3b8',
                textDecoration: 'line-through',
                fontWeight: '500'
              }}>
                {formatPrice(product.original_price * (typeof quantity === 'number' ? quantity : 1))}
              </span>
              {product.discount_percentage && (
                <span style={{
                  backgroundColor: '#ef4444',
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: '700',
                  padding: '4px 12px',
                  borderRadius: '12px'
                }}>
                  %{Math.round(product.discount_percentage)} İNDİRİM
                </span>
              )}
            </div>
          )}
          
          {/* Current/Deal price */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{
              ...styles.price,
              color: product.has_deal ? '#ef4444' : '#059669'
            }}>
              {formatPrice(currentPrice * (typeof quantity === 'number' ? quantity : 1))}
            </span>
            {quantity > 1 && (
              <span style={{ fontSize: '16px', color: '#64748b', fontWeight: '500' }}>
                ({formatPrice(currentPrice)} / adet)
              </span>
            )}
          </div>

          {product.price_range && quantity === 1 && !product.has_deal && (
            <span style={styles.priceRange}>
              {formatPrice(product.price_range.min)} - {formatPrice(product.price_range.max)}
            </span>
          )}
        </div>
      </div>

      {/* Short Description */}
      {product.short_description && (
        <p style={styles.shortDescription}>{product.short_description}</p>
      )}

      {/* Variants */}
      {product.variants?.length > 1 && (
        <div style={styles.variantsSection}>
          <div style={styles.variantLabel}>Seçenekler</div>
          <div style={styles.variantOptions}>
            {product.variants.map((variant) => (
              <button
                key={variant.id}
                style={styles.variantBtn(selectedVariant?.id === variant.id, !variant.in_stock)}
                onClick={() => variant.in_stock && setSelectedVariant(variant)}
                disabled={!variant.in_stock}
              >
                {selectedVariant?.id === variant.id && <FaCheck size={12} />}
                {variant.title || 'Varsayılan'}
                {!variant.in_stock && ' (Tükendi)'}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Stock Status */}
      <div style={styles.stockBadge(isInStock)}>
        {isInStock ? (
          <>
            <FaCheck /> Stokta ({currentStock} adet)
          </>
        ) : (
          <>
            <FaBox /> Stokta Yok
          </>
        )}
      </div>

      {/* Low Stock Warning */}
      {showLowStockWarning && (
        <div style={styles.lowStockWarning}>
          <FaExclamationTriangle />
          Son {currentStock} adet kaldı! Acele edin!
        </div>
      )}

      {/* Quantity */}
      <div style={styles.quantitySection}>
        <span style={styles.quantityLabel}>Adet:</span>
        <div style={styles.quantityControls}>
          <button 
            style={styles.quantityBtn}
            onClick={() => setQuantity(Math.max(1, (typeof quantity === 'number' ? quantity : 1) - 1))}
          >
            <FaMinus size={12} />
          </button>
          <input 
            type="number"
            min="1"
            max={currentStock || 99}
            value={quantity}
            onChange={(e) => {
              const val = e.target.value;
              if (val === '') {
                setQuantity('');
              } else {
                const numVal = parseInt(val);
                if (!isNaN(numVal)) {
                  setQuantity(numVal);
                }
              }
            }}
            onBlur={() => {
              let val = typeof quantity === 'number' ? quantity : parseInt(quantity);
              if (isNaN(val) || val < 1) val = 1;
              if (currentStock && val > currentStock) val = currentStock;
              setQuantity(val);
            }}
            style={styles.quantityValue}
          />
          <button 
            style={styles.quantityBtn}
            onClick={() => setQuantity(Math.min(currentStock || 99, (typeof quantity === 'number' ? quantity : 1) + 1))}
          >
            <FaPlus size={12} />
          </button>
        </div>
      </div>

      {/* Actions */}
      <div style={styles.actionsSection}>
        <button 
          style={{
            ...styles.addToCartBtn,
            ...(isInStock ? {} : styles.addToCartBtnDisabled)
          }}
          onClick={handleAddToCart}
          disabled={!isInStock}
        >
          <FaShoppingCart />
          {isInStock ? 'Sepete Ekle' : 'Stokta Yok'}
        </button>
        <button 
          style={{
            ...styles.iconBtn,
            backgroundColor: isFavorite(product?.id) ? '#fef2f2' : '#f8fafc',
          }}
          onClick={handleToggleFavorite}
        >
          {isFavorite(product?.id) ? <FaHeart color="#ef4444" /> : <FaRegHeart />}
        </button>
        <ShareMenu 
          showShareMenu={showShareMenu}
          setShowShareMenu={setShowShareMenu}
          handleShare={handleShare}
          copyToClipboard={copyToClipboard}
          styles={styles}
        />
      </div>

      {/* Features */}
      <div style={styles.features}>
        <div style={styles.featureItem}>
          <div style={styles.featureIcon}><FaTruck size={18} /></div>
          <span style={styles.featureTitle}>Hızlı Teslimat</span>
          <span style={styles.featureText}>24 saatte kargoda</span>
        </div>
        <div style={styles.featureItem}>
          <div style={styles.featureIcon}><FaShieldAlt size={18} /></div>
          <span style={styles.featureTitle}>Güvenli Ödeme</span>
          <span style={styles.featureText}>256-bit SSL</span>
        </div>
        <div style={styles.featureItem}>
          <div style={styles.featureIcon}><FaUndo size={18} /></div>
          <span style={styles.featureTitle}>Kolay İade</span>
          <span style={styles.featureText}>14 gün iade hakkı</span>
        </div>
      </div>

      {/* Vendor Card */}
      {product.vendor && (
        <VendorCard vendor={product.vendor} styles={styles} />
      )}
    </div>
  );
};

export default ProductInfo;
