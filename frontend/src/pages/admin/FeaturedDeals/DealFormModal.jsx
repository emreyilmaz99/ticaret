import React, { useState, useEffect } from 'react';
import { FaTimes, FaImage } from 'react-icons/fa';
import ProductSelectorDrawer from './components/ProductSelectorDrawer';

const DealFormModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  mode, 
  deal, 
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
      const product = products.find(p => p.id === deal.product_id);
      if (product) {
        setSelectedProduct(product);
        setVariants(product.variants || []);
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
    }
  }, [mode, deal, products, isOpen]);

  // Calculate discount percentage
  useEffect(() => {
    if (formData.original_price && formData.deal_price) {
      const original = parseFloat(formData.original_price);
      const deal = parseFloat(formData.deal_price);
      if (original > 0 && deal > 0) {
        const discount = ((original - deal) / original) * 100;
        setDiscountPercentage(Math.round(discount));
      }
    } else {
      setDiscountPercentage(0);
    }
  }, [formData.original_price, formData.deal_price]);

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
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '20px',
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '16px',
        width: '100%',
        maxWidth: '700px',
        maxHeight: '90vh',
        overflow: 'auto',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
      }}>
        {/* Header */}
        <div style={{
          padding: '24px',
          borderBottom: '1px solid #e5e7eb',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'sticky',
          top: 0,
          backgroundColor: 'white',
          zIndex: 10,
        }}>
          <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#111827' }}>
            {mode === 'create' ? 'Yeni Öne Çıkan Ürün' : 'Öne Çıkan Ürünü Düzenle'}
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '8px',
              color: '#6b7280',
            }}
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Product Selection Button */}
            <div>
              <label style={labelStyle}>Ürün *</label>
              <button
                type="button"
                onClick={() => setIsProductDrawerOpen(true)}
                style={{
                  ...inputStyle,
                  cursor: 'pointer',
                  textAlign: 'left',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  backgroundColor: selectedProduct ? '#f0fdf4' : 'white',
                  border: selectedProduct ? '2px solid #10b981' : '1px solid #d1d5db',
                }}
              >
                <span style={{ color: selectedProduct ? '#111827' : '#9ca3af' }}>
                  {selectedProduct ? selectedProduct.name : 'Ürün seçmek için tıklayın'}
                </span>
                <span style={{ color: '#6b7280', fontSize: '14px' }}>➜</span>
              </button>
            </div>

            {/* Product Preview */}
            {selectedProduct && (
              <div style={{
                padding: '16px',
                backgroundColor: '#f9fafb',
                borderRadius: '8px',
                display: 'flex',
                gap: '12px',
                alignItems: 'center',
              }}>
                {selectedProduct.photos?.[0] ? (
                  <img
                    src={selectedProduct.photos[0].url}
                    alt={selectedProduct.name}
                    style={{
                      width: '60px',
                      height: '60px',
                      objectFit: 'cover',
                      borderRadius: '8px',
                    }}
                  />
                ) : (
                  <div style={{
                    width: '60px',
                    height: '60px',
                    backgroundColor: '#e5e7eb',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <FaImage size={24} color="#9ca3af" />
                  </div>
                )}
                <div>
                  <p style={{ fontSize: '14px', fontWeight: '600', color: '#111827' }}>
                    {selectedProduct.name}
                  </p>
                  <p style={{ fontSize: '12px', color: '#6b7280' }}>
                    Stok: {selectedProduct.stock_quantity} | Fiyat: {selectedProduct.final_price} TL
                  </p>
                </div>
              </div>
            )}

            {/* Pricing */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
              <div>
                <label style={labelStyle}>Orijinal Fiyat *</label>
                <input
                  type="number"
                  name="original_price"
                  value={formData.original_price}
                  onChange={handleChange}
                  required
                  step="0.01"
                  min="0"
                  style={inputStyle}
                  placeholder="0.00"
                />
              </div>
              <div>
                <label style={labelStyle}>İndirimli Fiyat *</label>
                <input
                  type="number"
                  name="deal_price"
                  value={formData.deal_price}
                  onChange={handleChange}
                  required
                  step="0.01"
                  min="0"
                  style={inputStyle}
                  placeholder="0.00"
                />
              </div>
              <div>
                <label style={labelStyle}>İndirim Oranı</label>
                <div style={{
                  ...inputStyle,
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: '#f3f4f6',
                  color: '#059669',
                  fontWeight: '700',
                  fontSize: '16px',
                }}>
                  %{discountPercentage}
                </div>
              </div>
            </div>

            {/* Title & Description */}
            <div>
              <label style={labelStyle}>Kampanya Başlığı</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                style={inputStyle}
                placeholder="Örn: Süper Fırsat!, %50 İndirim, Sınırlı Stok..."
              />
            </div>

            <div>
              <label style={labelStyle}>Kampanya Açıklaması</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                style={inputStyle}
                placeholder="Kampanya detayları, koşullar vb..."
              />
            </div>

            {/* Colors */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={labelStyle}>Arkaplan Rengi</label>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input
                    type="color"
                    name="background_color"
                    value={formData.background_color}
                    onChange={handleChange}
                    style={{ width: '50px', height: '40px', border: '1px solid #d1d5db', borderRadius: '6px' }}
                  />
                  <input
                    type="text"
                    value={formData.background_color}
                    onChange={(e) => handleChange({ target: { name: 'background_color', value: e.target.value } })}
                    style={{ ...inputStyle, flex: 1 }}
                  />
                </div>
              </div>
              <div>
                <label style={labelStyle}>Badge Rengi</label>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input
                    type="color"
                    name="badge_color"
                    value={formData.badge_color}
                    onChange={handleChange}
                    style={{ width: '50px', height: '40px', border: '1px solid #d1d5db', borderRadius: '6px' }}
                  />
                  <input
                    type="text"
                    value={formData.badge_color}
                    onChange={(e) => handleChange({ target: { name: 'badge_color', value: e.target.value } })}
                    style={{ ...inputStyle, flex: 1 }}
                  />
                </div>
              </div>
            </div>

            {/* Badge Text */}
            <div>
              <label style={labelStyle}>Badge Yazısı</label>
              <input
                type="text"
                name="badge_text"
                value={formData.badge_text}
                onChange={handleChange}
                style={inputStyle}
                placeholder="ÖZEL FIRSAT"
              />
            </div>

            {/* Dates */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={labelStyle}>Başlangıç Tarihi</label>
                <input
                  type="datetime-local"
                  name="starts_at"
                  value={formData.starts_at}
                  onChange={handleChange}
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Bitiş Tarihi</label>
                <input
                  type="datetime-local"
                  name="ends_at"
                  value={formData.ends_at}
                  onChange={handleChange}
                  style={inputStyle}
                />
              </div>
            </div>

            {/* Sort Order & Active */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '12px', alignItems: 'end' }}>
              <div>
                <label style={labelStyle}>Sıra</label>
                <input
                  type="number"
                  name="sort_order"
                  value={formData.sort_order}
                  onChange={handleChange}
                  min="1"
                  style={inputStyle}
                />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingBottom: '10px' }}>
                <input
                  type="checkbox"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleChange}
                  id="is_active"
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
                <label htmlFor="is_active" style={{ fontSize: '14px', fontWeight: '500', cursor: 'pointer' }}>
                  Aktif
                </label>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div style={{
            marginTop: '24px',
            display: 'flex',
            gap: '12px',
            justifyContent: 'flex-end',
            borderTop: '1px solid #e5e7eb',
            paddingTop: '20px',
          }}>
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              style={{
                padding: '10px 24px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                backgroundColor: 'white',
                color: '#374151',
                fontWeight: '500',
                cursor: 'pointer',
              }}
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                padding: '10px 24px',
                border: 'none',
                borderRadius: '8px',
                backgroundColor: '#059669',
                color: 'white',
                fontWeight: '600',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                opacity: isSubmitting ? 0.6 : 1,
              }}
            >
              {isSubmitting ? 'Kaydediliyor...' : mode === 'create' ? 'Oluştur' : 'Güncelle'}
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

const labelStyle = {
  display: 'block',
  fontSize: '14px',
  fontWeight: '600',
  color: '#374151',
  marginBottom: '6px',
};

const inputStyle = {
  width: '100%',
  padding: '10px 12px',
  border: '1px solid #d1d5db',
  borderRadius: '8px',
  fontSize: '14px',
  outline: 'none',
  transition: 'border-color 0.2s',
};

export default DealFormModal;
