import { useState, useEffect } from 'react';
import { FaTimes, FaSearch, FaCheck } from 'react-icons/fa';
import apiClient from '@lib/apiClient';

const BACKEND_URL = 'http://127.0.0.1:8000';

export default function ProductSelectorDrawer({ isOpen, onClose, onSelect }) {
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setError(null);
      fetchProducts();
    }
  }, [isOpen]);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get('/v1/admin/featured-deals/create');
      console.log('Products Response:', response.data);
      // Backend returns data directly as array
      const products = response.data.data || [];
      console.log('Parsed products:', products);
      setAllProducts(products);
    } catch (err) {
      console.error('Ürünler yüklenemedi:', err);
      console.error('Error details:', err.response?.data);
      setError(err.response?.data?.message || 'Ürünler yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  // Filter products based on search term
  const filteredProducts = Array.isArray(allProducts) ? allProducts.filter(product => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      product.name?.toLowerCase().includes(search) ||
      product.sku?.toLowerCase().includes(search) ||
      product.vendor?.business_name?.toLowerCase().includes(search)
    );
  }) : [];

  const handleProductSelect = (product) => {
    setSelectedProduct(product);
    setSelectedVariant(null);
  };

  const handleVariantSelect = (variant) => {
    setSelectedVariant(variant);
  };

  const handleConfirm = () => {
    if (selectedProduct) {
      onSelect({
        product: selectedProduct,
        variant: selectedVariant
      });
      handleClose();
    }
  };

  const handleClose = () => {
    setSelectedProduct(null);
    setSelectedVariant(null);
    setSearchTerm('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        onClick={handleClose}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 10000,
        }}
      />

      {/* Drawer */}
      <div 
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          width: '100%',
          maxWidth: '500px',
          backgroundColor: '#fafafa',
          boxShadow: '-8px 0 30px rgba(0, 0, 0, 0.15)',
          zIndex: 10001,
          display: 'flex',
          flexDirection: 'column',
          animation: 'slideIn 0.3s ease-out',
        }}
      >
        <style>{`
          @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
          }
          @keyframes spin { to { transform: rotate(360deg); } }
        `}</style>
        
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          padding: '24px',
          color: 'white',
          borderRadius: '0 0 24px 24px',
          boxShadow: '0 4px 20px rgba(16, 185, 129, 0.3)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '22px', fontWeight: '700', margin: 0, letterSpacing: '-0.5px' }}>Ürün Seç</h2>
            <button
              type="button"
              onClick={handleClose}
              style={{
                background: 'rgba(255,255,255,0.2)',
                border: 'none',
                color: 'white',
                cursor: 'pointer',
                padding: '10px',
                borderRadius: '12px',
                transition: 'all 0.2s',
              }}
            >
              <FaTimes size={18} />
            </button>
          </div>
          
          {/* Search */}
          <div style={{ marginTop: '20px', position: 'relative' }}>
            <FaSearch style={{ 
              position: 'absolute', 
              left: '16px', 
              top: '50%', 
              transform: 'translateY(-50%)',
              color: '#9ca3af',
              fontSize: '16px'
            }} />
            <input
              type="text"
              placeholder="Ürün ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '14px 16px 14px 48px',
                borderRadius: '14px',
                border: 'none',
                fontSize: '15px',
                outline: 'none',
                backgroundColor: 'white',
                boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
              }}
            />
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {error ? (
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center', 
              padding: '48px 16px' 
            }}>
              <div style={{ color: '#ef4444', textAlign: 'center' }}>
                <p style={{ fontWeight: '500' }}>Hata!</p>
                <p style={{ fontSize: '14px', marginTop: '8px' }}>{error}</p>
              </div>
              <button
                onClick={fetchProducts}
                style={{
                  marginTop: '16px',
                  padding: '12px 24px',
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  boxShadow: '0 4px 14px rgba(16, 185, 129, 0.3)',
                }}
              >
                Tekrar Dene
              </button>
            </div>
          ) : loading ? (
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              padding: '48px' 
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                border: '4px solid #e5e7eb',
                borderTopColor: '#10b981',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
              }} />
            </div>
          ) : (
            <div>
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  style={{
                    padding: '16px 20px',
                    margin: '8px 12px',
                    borderRadius: '16px',
                    backgroundColor: selectedProduct?.id === product.id ? '#ecfdf5' : 'white',
                    border: selectedProduct?.id === product.id ? '2px solid #10b981' : '1px solid #e5e7eb',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    boxShadow: selectedProduct?.id === product.id 
                      ? '0 4px 12px rgba(16, 185, 129, 0.15)' 
                      : '0 2px 8px rgba(0,0,0,0.04)',
                  }}
                  onClick={() => handleProductSelect(product)}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                    {/* Product Image */}
                    <div style={{
                      width: '72px',
                      height: '72px',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      border: '1px solid #e5e7eb',
                      flexShrink: 0,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                    }}>
                      {product.photos && product.photos[0] ? (
                        <img
                          src={product.photos[0].url.startsWith('http') ? product.photos[0].url : `${BACKEND_URL}${product.photos[0].url}`}
                          alt={product.name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      ) : (
                        <div style={{
                          width: '100%',
                          height: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: '#f3f4f6',
                          color: '#9ca3af',
                          fontSize: '12px',
                        }}>
                          Resim Yok
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div style={{ flex: 1 }}>
                      <h3 style={{ margin: 0, fontSize: '15px', fontWeight: '600', color: '#1e293b' }}>
                        {product.name}
                      </h3>
                      <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#94a3b8' }}>
                        SKU: {product.sku}
                      </p>
                      <p style={{ margin: '6px 0 0', fontSize: '15px', fontWeight: '700', color: '#10b981' }}>
                        ₺{parseFloat(product.price || 0).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                      </p>
                      {product.vendor && (
                        <p style={{ margin: '4px 0 0', fontSize: '11px', color: '#94a3b8' }}>
                          Satıcı: {product.vendor.business_name}
                        </p>
                      )}
                    </div>

                    {/* Selection Indicator */}
                    {selectedProduct?.id === product.id && (
                      <div style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 2px 8px rgba(16, 185, 129, 0.4)',
                      }}>
                        <FaCheck style={{ color: 'white', fontSize: '12px' }} />
                      </div>
                    )}
                  </div>

                  {/* Variants */}
                  {selectedProduct?.id === product.id && product.variants && product.variants.length > 0 && (
                    <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #e5e7eb' }}>
                      <p style={{ margin: '0 0 8px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                        Varyantlar:
                      </p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {product.variants.map((variant) => (
                          <button
                            key={variant.id}
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleVariantSelect(variant);
                            }}
                            style={{
                              padding: '12px 14px',
                              borderRadius: '12px',
                              border: selectedVariant?.id === variant.id 
                                ? '2px solid #10b981' 
                                : '1px solid #e5e7eb',
                              backgroundColor: selectedVariant?.id === variant.id ? '#ecfdf5' : 'white',
                              cursor: 'pointer',
                              textAlign: 'left',
                              transition: 'all 0.2s',
                            }}
                          >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <div>
                                <p style={{ margin: 0, fontSize: '14px', fontWeight: '500', color: '#111827' }}>
                                  {variant.attribute_values?.map(av => av.value).join(' / ') || variant.sku}
                                </p>
                                <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#6b7280' }}>
                                  SKU: {variant.sku}
                                </p>
                              </div>
                              <p style={{ margin: 0, fontSize: '14px', fontWeight: '600', color: '#059669' }}>
                                ₺{parseFloat(variant.price || 0).toFixed(2)}
                              </p>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {!loading && filteredProducts.length === 0 && (
                <div style={{ padding: '48px', textAlign: 'center', color: '#6b7280' }}>
                  Ürün bulunamadı
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: '20px 24px',
          borderTop: '1px solid #e5e7eb',
          backgroundColor: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          gap: '12px',
          boxShadow: '0 -4px 20px rgba(0,0,0,0.05)',
        }}>
          <button
            type="button"
            onClick={handleClose}
            style={{
              padding: '14px 28px',
              borderRadius: '12px',
              border: '1px solid #e5e7eb',
              backgroundColor: 'white',
              color: '#64748b',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s',
              fontSize: '15px',
            }}
          >
            İptal
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={!selectedProduct}
            style={{
              padding: '14px 28px',
              borderRadius: '12px',
              border: 'none',
              background: selectedProduct 
                ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' 
                : '#e5e7eb',
              color: selectedProduct ? 'white' : '#9ca3af',
              fontWeight: '600',
              cursor: selectedProduct ? 'pointer' : 'not-allowed',
              opacity: selectedProduct ? 1 : 0.7,
              boxShadow: selectedProduct ? '0 4px 14px rgba(16, 185, 129, 0.4)' : 'none',
              transition: 'all 0.2s',
              fontSize: '15px',
            }}
          >
            {selectedProduct ? (selectedVariant ? 'Varyantı Seç' : 'Ürün Seçin') : 'Ürün Seçin'}
          </button>
        </div>
      </div>
    </>
  );
}
