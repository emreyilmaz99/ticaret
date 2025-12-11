import React, { useState, useEffect } from 'react';
import { FaTimes, FaImage, FaPercentage, FaTag, FaCalendarAlt, FaPalette, FaExclamationTriangle } from 'react-icons/fa';
import ProductSelectorDrawer from './components/ProductSelectorDrawer';

const BACKEND_URL = 'http://127.0.0.1:8000';

// Helper function to get full image URL
const getImageUrl = (product) => {
  if (!product) return null;
  
  let url = null;
  
  if (product.photos?.[0]?.url) {
    url = product.photos[0].url;
  } else if (product.photos?.[0]?.file_path) {
    url = product.photos[0].file_path;
  } else if (product.main_image) {
    url = product.main_image;
  } else if (product.image) {
    url = product.image;
  } else if (product.images?.[0]) {
    url = product.images[0];
  }
  
  // If URL exists and doesn't start with http, add backend URL
  if (url && !url.startsWith('http')) {
    return `${BACKEND_URL}${url.startsWith('/') ? '' : '/'}${url}`;
  }
  
  return url;
};

const DealFormModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  mode, 
  deal, 
  deals = [],
  products, 
  isSubmitting 
}) => {
  const [formData, setFormData] = useState({
    product_id: '',
    variant_id: '',
    deal_price: '',
    original_price: '',
    title: '',
    description: '',
    background_color: '#10b981',
    badge_text: 'ÖZEL FIRSAT',
    badge_color: '#ef4444',
    starts_at: '',
    ends_at: '',
    is_active: true,
    sort_order: 1,
  });

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [variants, setVariants] = useState([]);
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const [isProductDrawerOpen, setIsProductDrawerOpen] = useState(false);
  const [priceError, setPriceError] = useState('');
  const [sortOrderError, setSortOrderError] = useState('');
  const [dateError, setDateError] = useState('');

  useEffect(() => {
    if (mode === 'edit' && deal) {
      setFormData({
        product_id: deal.product_id,
        variant_id: deal.variant_id || '',
        deal_price: deal.deal_price,
        original_price: deal.original_price,
        title: deal.title || '',
        description: deal.description || '',
        background_color: deal.background_color || '#10b981',
        badge_text: deal.badge_text || 'ÖZEL FIRSAT',
        badge_color: deal.badge_color || '#ef4444',
        starts_at: deal.starts_at ? deal.starts_at.slice(0, 16) : '',
        ends_at: deal.ends_at ? deal.ends_at.slice(0, 16) : '',
        is_active: deal.is_active,
        sort_order: deal.sort_order || 1,
      });

      // Set product and variants for edit mode
      // First try to use deal.product (from API), then fallback to products array
      if (deal.product) {
        setSelectedProduct(deal.product);
        setVariants(deal.product.variants || []);
      } else {
        const product = products.find(p => p.id === deal.product_id);
        if (product) {
          setSelectedProduct(product);
          setVariants(product.variants || []);
        }
      }
    } else {
      // Reset for create mode
      setFormData({
        product_id: '',
        variant_id: '',
        deal_price: '',
        original_price: '',
        title: '',
        description: '',
        background_color: '#10b981',
        badge_text: 'ÖZEL FIRSAT',
        badge_color: '#ef4444',
        starts_at: '',
        ends_at: '',
        is_active: true,
        sort_order: 1,
      });
      setSelectedProduct(null);
      setVariants([]);
      setPriceError('');
      setSortOrderError('');
    }
  }, [mode, deal, products, isOpen]);

  // Validate sort order
  useEffect(() => {
    if (formData.sort_order && deals.length > 0) {
      const sortOrder = parseInt(formData.sort_order);
      const existingDeal = deals.find(d => 
        d.sort_order === sortOrder && 
        (mode === 'create' || d.id !== deal?.id)
      );
      
      if (existingDeal) {
        setSortOrderError(`Sıra ${sortOrder} zaten "${existingDeal.title || existingDeal.product?.name || 'Başka bir kampanya'}" tarafından kullanılıyor!`);
      } else {
        setSortOrderError('');
      }
    } else {
      setSortOrderError('');
    }
  }, [formData.sort_order, deals, mode, deal]);

  // Calculate discount percentage and validate prices
  useEffect(() => {
    if (formData.original_price && formData.deal_price) {
      const original = parseFloat(formData.original_price);
      const dealPrice = parseFloat(formData.deal_price);
      
      if (dealPrice >= original) {
        setPriceError('İndirimli fiyat orijinal fiyattan düşük olmalıdır!');
        setDiscountPercentage(0);
      } else if (dealPrice <= 0) {
        setPriceError('İndirimli fiyat 0\'dan büyük olmalıdır!');
        setDiscountPercentage(0);
      } else {
        setPriceError('');
        const discount = ((original - dealPrice) / original) * 100;
        setDiscountPercentage(Math.round(discount));
      }
    } else {
      setDiscountPercentage(0);
      setPriceError('');
    }
  }, [formData.original_price, formData.deal_price]);

  // Validate dates
  useEffect(() => {
    const now = new Date();
    // Set time to start of current minute for comparison
    now.setSeconds(0, 0);
    
    if (formData.starts_at) {
      const startsAt = new Date(formData.starts_at);
      
      // Validate start date - past dates not allowed for both create and edit
      if (startsAt < now) {
        setDateError('Başlangıç tarihi geçmiş bir tarih olamaz!');
        return;
      }
      
      if (formData.ends_at) {
        const endsAt = new Date(formData.ends_at);
        
        if (endsAt <= startsAt) {
          setDateError('Bitiş tarihi başlangıç tarihinden sonra olmalıdır!');
          return;
        }
        
        if (endsAt < now) {
          setDateError('Bitiş tarihi geçmiş bir tarih olamaz!');
          return;
        }
      }
    }
    
    setDateError('');
  }, [formData.starts_at, formData.ends_at, mode]);

  const handleProductSelect = (selection) => {
    const { product, variant } = selection;
    
    setSelectedProduct(product);
    setVariants(product?.variants || []);
    
    // Only auto-fill product_id, variant_id and original_price
    // Title and description should be entered by admin (campaign info, not product info)
    setFormData({
      ...formData,
      product_id: product.id,
      variant_id: variant?.id || '',
      original_price: variant?.price || product?.price || '',
      // Don't auto-fill title - it's for campaign title, not product name
    });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate price
    if (priceError) {
      return;
    }
    
    // Validate sort order
    if (sortOrderError) {
      return;
    }
    
    // Validate dates
    if (dateError) {
      return;
    }
    
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div style={modalStyles.overlay}>
      <div style={modalStyles.container}>
        {/* Header */}
        <div style={modalStyles.header}>
          <div>
            <h2 style={modalStyles.title}>
              {mode === 'create' ? '✨ Yeni Kampanya Oluştur' : '✏️ Kampanyayı Düzenle'}
            </h2>
            <p style={modalStyles.subtitle}>
              Anasayfa carousel'inde gösterilecek öne çıkan ürünü ayarlayın
            </p>
          </div>
          <button onClick={onClose} style={modalStyles.closeBtn}>
            <FaTimes size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={modalStyles.form}>
          
          {/* Section: Ürün Seçimi */}
          <div style={modalStyles.section}>
            <div style={modalStyles.sectionHeader}>
              <FaTag style={{ color: '#6366f1' }} />
              <span>Ürün Bilgileri</span>
            </div>
            
            <button
              type="button"
              onClick={() => setIsProductDrawerOpen(true)}
              style={{
                ...modalStyles.productSelectBtn,
                borderColor: selectedProduct ? '#10b981' : '#e5e7eb',
                backgroundColor: selectedProduct ? '#f0fdf4' : '#fafafa',
              }}
            >
              {selectedProduct ? (
                <div style={modalStyles.selectedProduct}>
                  {getImageUrl(selectedProduct) ? (
                    <img src={getImageUrl(selectedProduct)} alt="" style={modalStyles.productThumb} />
                  ) : (
                    <div style={modalStyles.productThumbPlaceholder}>
                      <FaImage color="#9ca3af" />
                    </div>
                  )}
                  <div>
                    <p style={modalStyles.productName}>{selectedProduct.name}</p>
                    <p style={modalStyles.productPrice}>{formData.original_price} TL</p>
                  </div>
                </div>
              ) : (
                <span style={{ color: '#9ca3af' }}>Ürün seçmek için tıklayın →</span>
              )}
            </button>
          </div>

          {/* Section: Fiyatlandırma */}
          <div style={modalStyles.section}>
            <div style={modalStyles.sectionHeader}>
              <FaPercentage style={{ color: '#10b981' }} />
              <span>Fiyatlandırma</span>
            </div>
            
            <div style={modalStyles.priceGrid}>
              <div style={modalStyles.inputGroup}>
                <label style={modalStyles.label}>Orijinal Fiyat *</label>
                <div style={modalStyles.priceInputWrapper}>
                  <input
                    type="number"
                    name="original_price"
                    value={formData.original_price}
                    onChange={handleChange}
                    required
                    step="0.01"
                    min="0"
                    style={modalStyles.priceInput}
                    placeholder="0.00"
                  />
                  <span style={modalStyles.currency}>₺</span>
                </div>
              </div>
              
              <div style={modalStyles.inputGroup}>
                <label style={modalStyles.label}>İndirimli Fiyat *</label>
                <div style={modalStyles.priceInputWrapper}>
                  <input
                    type="number"
                    name="deal_price"
                    value={formData.deal_price}
                    onChange={handleChange}
                    required
                    step="0.01"
                    min="0"
                    style={{
                      ...modalStyles.priceInput,
                      borderColor: priceError ? '#ef4444' : '#e5e7eb',
                      backgroundColor: priceError ? '#fef2f2' : 'white',
                    }}
                    placeholder="0.00"
                  />
                  <span style={modalStyles.currency}>₺</span>
                </div>
              </div>
              
              <div style={modalStyles.inputGroup}>
                <label style={modalStyles.label}>İndirim Oranı</label>
                <div style={{
                  ...modalStyles.discountBadge,
                  backgroundColor: discountPercentage > 0 ? '#10b981' : '#e5e7eb',
                  color: discountPercentage > 0 ? 'white' : '#6b7280',
                }}>
                  %{discountPercentage}
                </div>
              </div>
            </div>
            
            {/* Price Error Alert */}
            {priceError && (
              <div style={modalStyles.errorAlert}>
                <FaExclamationTriangle size={14} />
                <span>{priceError}</span>
              </div>
            )}
          </div>

          {/* Section: Kampanya Detayları */}
          <div style={modalStyles.section}>
            <div style={modalStyles.sectionHeader}>
              <FaPalette style={{ color: '#f59e0b' }} />
              <span>Kampanya Detayları</span>
            </div>
            
            <div style={modalStyles.inputGroup}>
              <label style={modalStyles.label}>Kampanya Başlığı</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                style={modalStyles.input}
                placeholder="Örn: Yaz İndirimi, Black Friday..."
              />
            </div>
            
            <div style={modalStyles.inputGroup}>
              <label style={modalStyles.label}>Kampanya Açıklaması</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                style={modalStyles.textarea}
                placeholder="Kampanya hakkında kısa açıklama..."
                rows={3}
              />
            </div>
            
            <div style={modalStyles.colorGrid}>
              <div style={modalStyles.inputGroup}>
                <label style={modalStyles.label}>Arkaplan Rengi</label>
                <div style={modalStyles.colorInputWrapper}>
                  <input
                    type="color"
                    name="background_color"
                    value={formData.background_color}
                    onChange={handleChange}
                    style={modalStyles.colorPicker}
                  />
                  <input
                    type="text"
                    value={formData.background_color}
                    onChange={(e) => setFormData({...formData, background_color: e.target.value})}
                    style={modalStyles.colorText}
                  />
                </div>
              </div>
              
              <div style={modalStyles.inputGroup}>
                <label style={modalStyles.label}>Badge Rengi</label>
                <div style={modalStyles.colorInputWrapper}>
                  <input
                    type="color"
                    name="badge_color"
                    value={formData.badge_color}
                    onChange={handleChange}
                    style={modalStyles.colorPicker}
                  />
                  <input
                    type="text"
                    value={formData.badge_color}
                    onChange={(e) => setFormData({...formData, badge_color: e.target.value})}
                    style={modalStyles.colorText}
                  />
                </div>
              </div>
            </div>
            
            <div style={modalStyles.inputGroup}>
              <label style={modalStyles.label}>Badge Yazısı</label>
              <input
                type="text"
                name="badge_text"
                value={formData.badge_text}
                onChange={handleChange}
                style={modalStyles.input}
                placeholder="ÖZEL FIRSAT"
              />
              {formData.badge_text && (
                <div style={{
                  ...modalStyles.badgePreview,
                  backgroundColor: formData.badge_color,
                }}>
                  {formData.badge_text}
                </div>
              )}
            </div>

            {/* Background Color Preview - Carousel Card Style (only when product is selected) */}
            {selectedProduct && (
              <div style={modalStyles.inputGroup}>
                <label style={modalStyles.label}>🎨 Arkaplan Rengi Önizleme</label>
                <div style={{
                  ...modalStyles.carouselPreview,
                  background: `linear-gradient(135deg, ${formData.background_color} 0%, ${adjustColor(formData.background_color, 20)} 100%)`,
                }}>
                  {/* Left Content */}
                  <div style={modalStyles.carouselLeft}>
                    {/* Badge */}
                    <div style={{ 
                      display: 'inline-block', 
                      padding: '4px 10px', 
                      backgroundColor: formData.badge_color || '#ef4444', 
                      borderRadius: '50px', 
                      fontSize: '9px', 
                      fontWeight: '700',
                      color: 'white',
                      marginBottom: '8px' 
                    }}>
                      {formData.badge_text || 'Özel Fırsat'}
                    </div>

                    {/* Title */}
                    <h4 style={{ 
                      fontFamily: '"DM Sans", sans-serif', 
                      fontSize: '16px', 
                      fontWeight: '800', 
                      color: 'white',
                      marginBottom: '6px', 
                      lineHeight: 1.1,
                      margin: '0 0 6px 0',
                    }}>
                      {formData.title || selectedProduct.name}
                    </h4>

                    {/* Description */}
                    <p style={{ 
                      fontSize: '10px', 
                      color: 'rgba(255,255,255,0.8)',
                      marginBottom: '10px', 
                      lineHeight: 1.4,
                      margin: '0 0 10px 0',
                    }}>
                      {formData.description || 'Kampanya açıklaması...'}
                    </p>

                    {/* Prices */}
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '8px', 
                      marginBottom: '12px',
                      flexWrap: 'wrap',
                    }}>
                      <div style={{ 
                        fontSize: '14px', 
                        fontWeight: '700', 
                        color: '#34d399' 
                      }}>
                        {formData.deal_price ? parseFloat(formData.deal_price).toLocaleString('tr-TR') : '0'} TL
                      </div>
                      <div style={{ 
                        fontSize: '11px', 
                        textDecoration: 'line-through', 
                        color: 'rgba(255,255,255,0.5)',
                      }}>
                        {formData.original_price ? parseFloat(formData.original_price).toLocaleString('tr-TR') : '0'} TL
                      </div>
                      {discountPercentage > 0 && (
                        <div style={{
                          backgroundColor: '#ef4444',
                          color: 'white',
                          padding: '2px 6px',
                          borderRadius: '10px',
                          fontSize: '8px',
                          fontWeight: '700',
                        }}>
                          %{discountPercentage} İndirim
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div style={{ 
                      display: 'flex', 
                      gap: '6px',
                    }}>
                      <div style={{ 
                        backgroundColor: '#34d399', 
                        color: '#0f172a', 
                        padding: '5px 10px',
                        borderRadius: '6px',
                        fontSize: '8px',
                        fontWeight: '600',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}>
                        🛒 Sepete Ekle
                      </div>
                      <div style={{ 
                        backgroundColor: 'rgba(255,255,255,0.2)', 
                        color: 'white',
                        padding: '5px 10px',
                        borderRadius: '6px',
                        fontSize: '8px',
                        fontWeight: '600',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}>
                        👁️ İncele
                      </div>
                    </div>
                  </div>

                  {/* Right - Product Image */}
                  <div style={modalStyles.carouselRight}>
                    {getImageUrl(selectedProduct) ? (
                      <img 
                        src={getImageUrl(selectedProduct)} 
                        alt={selectedProduct.name}
                        style={{
                          width: '90px',
                          height: '90px',
                          objectFit: 'cover',
                          borderRadius: '10px',
                          transform: 'rotate(-8deg)',
                          boxShadow: '0 8px 20px rgba(0,0,0,0.25)',
                        }}
                      />
                    ) : (
                      <div style={{
                        width: '90px',
                        height: '90px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: 'rgba(255,255,255,0.2)',
                        borderRadius: '10px',
                        transform: 'rotate(-8deg)',
                      }}>
                        <FaImage size={24} color="rgba(255,255,255,0.5)" />
                      </div>
                    )}
                  </div>

                  {/* Background Pattern */}
                  <div style={{ 
                    position: 'absolute', 
                    top: 0, 
                    right: 0, 
                    width: '100px', 
                    height: '100%', 
                    background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.05) 100%)', 
                    transform: 'skewX(-20deg)',
                    pointerEvents: 'none',
                  }} />
                </div>
              </div>
            )}
          </div>

          {/* Section: Zamanlama */}
          <div style={modalStyles.section}>
            <div style={modalStyles.sectionHeader}>
              <FaCalendarAlt style={{ color: '#8b5cf6' }} />
              <span>Zamanlama</span>
            </div>
            
            <div style={modalStyles.dateGrid}>
              <div style={modalStyles.inputGroup}>
                <label style={modalStyles.label}>Başlangıç Tarihi</label>
                <input
                  type="datetime-local"
                  name="starts_at"
                  value={formData.starts_at}
                  onChange={handleChange}
                  min={new Date().toISOString().slice(0, 16)}
                  style={{
                    ...modalStyles.input,
                    borderColor: dateError && dateError.includes('Başlangıç') ? '#ef4444' : '#e5e7eb',
                    backgroundColor: dateError && dateError.includes('Başlangıç') ? '#fef2f2' : 'white',
                  }}
                />
              </div>
              
              <div style={modalStyles.inputGroup}>
                <label style={modalStyles.label}>Bitiş Tarihi</label>
                <input
                  type="datetime-local"
                  name="ends_at"
                  value={formData.ends_at}
                  onChange={handleChange}
                  min={formData.starts_at || new Date().toISOString().slice(0, 16)}
                  style={{
                    ...modalStyles.input,
                    borderColor: dateError && dateError.includes('Bitiş') ? '#ef4444' : '#e5e7eb',
                    backgroundColor: dateError && dateError.includes('Bitiş') ? '#fef2f2' : 'white',
                  }}
                />
              </div>
            </div>
            
            {/* Date Error */}
            {dateError && (
              <div style={modalStyles.errorAlert}>
                <FaExclamationTriangle size={14} />
                <span>{dateError}</span>
              </div>
            )}
            
            <div style={modalStyles.bottomRow}>
              <div style={modalStyles.inputGroup}>
                <label style={modalStyles.label}>Sıra</label>
                <input
                  type="number"
                  name="sort_order"
                  value={formData.sort_order}
                  onChange={handleChange}
                  min="1"
                  style={{ 
                    ...modalStyles.input, 
                    width: '100px',
                    borderColor: sortOrderError ? '#ef4444' : '#e5e7eb',
                    backgroundColor: sortOrderError ? '#fef2f2' : 'white',
                  }}
                />
              </div>
              
              {/* Modern Toggle Switch */}
              <div 
                style={modalStyles.toggleWrapper}
                onClick={() => setFormData({...formData, is_active: !formData.is_active})}
              >
                <div style={{
                  ...modalStyles.toggleTrack,
                  backgroundColor: formData.is_active ? '#10b981' : '#cbd5e1',
                }}>
                  <div style={{
                    ...modalStyles.toggleThumb,
                    transform: formData.is_active ? 'translateX(20px)' : 'translateX(0)',
                  }} />
                </div>
                <span style={{
                  ...modalStyles.toggleLabel,
                  color: formData.is_active ? '#10b981' : '#64748b',
                }}>
                  {formData.is_active ? 'Aktif' : 'Pasif'}
                </span>
              </div>
            </div>
            
            {/* Sort Order Error */}
            {sortOrderError && (
              <div style={modalStyles.errorAlert}>
                <FaExclamationTriangle size={14} />
                <span>{sortOrderError}</span>
              </div>
            )}
          </div>

          {/* Actions */}
          <div style={modalStyles.actions}>
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              style={modalStyles.cancelBtn}
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !!priceError || !!sortOrderError || !!dateError}
              style={{
                ...modalStyles.submitBtn,
                opacity: (isSubmitting || priceError || sortOrderError || dateError) ? 0.6 : 1,
                cursor: (isSubmitting || priceError || sortOrderError || dateError) ? 'not-allowed' : 'pointer',
              }}
            >
              {isSubmitting ? '⏳ Kaydediliyor...' : mode === 'create' ? '✨ Oluştur' : '💾 Güncelle'}
            </button>
          </div>
        </form>
      </div>

      {/* Product Selector Drawer */}
      <ProductSelectorDrawer
        isOpen={isProductDrawerOpen}
        onClose={() => setIsProductDrawerOpen(false)}
        onSelect={handleProductSelect}
      />
    </div>
  );
};

// Helper function to adjust color brightness
function adjustColor(color, percent) {
  if (!color) return '#10b981';
  
  // Remove # if present
  const hex = color.replace('#', '');
  
  // Parse RGB values
  let r = parseInt(hex.substring(0, 2), 16);
  let g = parseInt(hex.substring(2, 4), 16);
  let b = parseInt(hex.substring(4, 6), 16);
  
  // Adjust brightness
  r = Math.min(255, Math.max(0, r + (r * percent / 100)));
  g = Math.min(255, Math.max(0, g + (g * percent / 100)));
  b = Math.min(255, Math.max(0, b + (b * percent / 100)));
  
  // Convert back to hex
  const toHex = (n) => {
    const hex = Math.round(n).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

// Modal Styles
const modalStyles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
    padding: '20px',
    backdropFilter: 'blur(4px)',
  },
  container: {
    backgroundColor: 'white',
    borderRadius: '24px',
    width: '100%',
    maxWidth: '640px',
    maxHeight: '90vh',
    overflow: 'hidden',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    padding: '28px 32px',
    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  title: {
    fontSize: '22px',
    fontWeight: '700',
    color: 'white',
    margin: 0,
  },
  subtitle: {
    fontSize: '14px',
    color: 'rgba(255,255,255,0.8)',
    marginTop: '6px',
  },
  closeBtn: {
    background: 'rgba(255,255,255,0.2)',
    border: 'none',
    borderRadius: '12px',
    padding: '10px',
    cursor: 'pointer',
    color: 'white',
    transition: 'all 0.2s',
  },
  form: {
    padding: '24px 32px 32px',
    overflowY: 'auto',
    flex: 1,
  },
  section: {
    marginBottom: '28px',
    padding: '20px',
    backgroundColor: '#f8fafc',
    borderRadius: '16px',
    border: '1px solid #e2e8f0',
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontSize: '15px',
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: '16px',
    paddingBottom: '12px',
    borderBottom: '1px solid #e2e8f0',
  },
  productSelectBtn: {
    width: '100%',
    padding: '16px',
    border: '2px dashed',
    borderRadius: '12px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s',
    fontSize: '14px',
  },
  selectedProduct: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    width: '100%',
  },
  productThumb: {
    width: '56px',
    height: '56px',
    borderRadius: '10px',
    objectFit: 'cover',
  },
  productThumbPlaceholder: {
    width: '56px',
    height: '56px',
    borderRadius: '10px',
    backgroundColor: '#e5e7eb',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  productName: {
    fontSize: '15px',
    fontWeight: '600',
    color: '#1e293b',
    margin: 0,
  },
  productPrice: {
    fontSize: '13px',
    color: '#64748b',
    marginTop: '4px',
  },
  priceGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr auto',
    gap: '16px',
    alignItems: 'end',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#475569',
  },
  input: {
    padding: '12px 14px',
    border: '1px solid #e5e7eb',
    borderRadius: '10px',
    fontSize: '14px',
    outline: 'none',
    transition: 'all 0.2s',
    backgroundColor: 'white',
  },
  priceInputWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  priceInput: {
    padding: '12px 40px 12px 14px',
    border: '1px solid #e5e7eb',
    borderRadius: '10px',
    fontSize: '16px',
    fontWeight: '600',
    outline: 'none',
    width: '100%',
    transition: 'all 0.2s',
  },
  currency: {
    position: 'absolute',
    right: '14px',
    color: '#64748b',
    fontWeight: '600',
  },
  discountBadge: {
    padding: '12px 20px',
    borderRadius: '10px',
    fontSize: '18px',
    fontWeight: '800',
    textAlign: 'center',
    minWidth: '80px',
  },
  errorAlert: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginTop: '12px',
    padding: '12px 16px',
    backgroundColor: '#fef2f2',
    border: '1px solid #fecaca',
    borderRadius: '10px',
    color: '#dc2626',
    fontSize: '13px',
    fontWeight: '500',
  },
  textarea: {
    padding: '12px 14px',
    border: '1px solid #e5e7eb',
    borderRadius: '10px',
    fontSize: '14px',
    outline: 'none',
    resize: 'vertical',
    minHeight: '80px',
    fontFamily: 'inherit',
  },
  colorGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
    marginBottom: '16px',
  },
  colorInputWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '8px 12px',
    border: '1px solid #e5e7eb',
    borderRadius: '10px',
    backgroundColor: 'white',
  },
  colorPicker: {
    width: '36px',
    height: '36px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    padding: 0,
  },
  colorText: {
    flex: 1,
    border: 'none',
    outline: 'none',
    fontSize: '14px',
    fontFamily: 'monospace',
    color: '#475569',
  },
  badgePreview: {
    display: 'inline-block',
    marginTop: '10px',
    padding: '8px 16px',
    borderRadius: '8px',
    color: 'white',
    fontSize: '12px',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  dateGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
    marginBottom: '16px',
  },
  bottomRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    cursor: 'pointer',
  },
  checkbox: {
    width: '20px',
    height: '20px',
    cursor: 'pointer',
  },
  checkboxText: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#1e293b',
  },
  actions: {
    display: 'flex',
    gap: '14px',
    justifyContent: 'flex-end',
    paddingTop: '20px',
    borderTop: '1px solid #e5e7eb',
    marginTop: '8px',
  },
  cancelBtn: {
    padding: '14px 28px',
    border: '1px solid #e5e7eb',
    borderRadius: '12px',
    backgroundColor: 'white',
    color: '#475569',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  submitBtn: {
    padding: '14px 32px',
    border: 'none',
    borderRadius: '12px',
    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    color: 'white',
    fontSize: '15px',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.2s',
    boxShadow: '0 4px 14px rgba(16, 185, 129, 0.4)',
  },
  // Carousel Preview Styles (matching DealSection)
  carouselPreview: {
    position: 'relative',
    padding: '16px',
    borderRadius: '16px',
    marginTop: '8px',
    minHeight: '140px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '16px',
    overflow: 'hidden',
    boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
  },
  carouselLeft: {
    flex: 1,
    zIndex: 2,
  },
  carouselRight: {
    zIndex: 2,
    flexShrink: 0,
  },
  // Modern Toggle Switch Styles
  toggleWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    cursor: 'pointer',
    padding: '8px 16px',
    borderRadius: '12px',
    backgroundColor: '#f8fafc',
    border: '1px solid #e2e8f0',
    transition: 'all 0.2s',
  },
  toggleTrack: {
    position: 'relative',
    width: '44px',
    height: '24px',
    borderRadius: '12px',
    transition: 'background-color 0.3s ease',
  },
  toggleThumb: {
    position: 'absolute',
    top: '2px',
    left: '2px',
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    backgroundColor: 'white',
    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
    transition: 'transform 0.3s ease',
  },
  toggleLabel: {
    fontSize: '14px',
    fontWeight: '600',
    transition: 'color 0.2s',
    userSelect: 'none',
  },
};

export default DealFormModal;
