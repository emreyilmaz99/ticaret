import { useState, useEffect } from 'react';
import { FaTimes, FaSearch, FaCheck } from 'react-icons/fa';
import axiosInstance from '../../../../lib/axios';

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
      const response = await axiosInstance.get('/v1/admin/featured-deals/create');
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
          maxWidth: '600px',
          backgroundColor: 'white',
          boxShadow: '-4px 0 20px rgba(0, 0, 0, 0.15)',
          zIndex: 10001,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Header */}
        <div style={{
          backgroundColor: '#4f46e5',
          padding: '20px',
          color: 'white',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '600', margin: 0 }}>Ürün Seç</h2>
            <button
              type="button"
              onClick={handleClose}
              style={{
                background: 'none',
                border: 'none',
                color: 'white',
                cursor: 'pointer',
                padding: '8px',
              }}
            >
              <FaTimes size={20} />
            </button>
          </div>
          
          {/* Search */}
          <div style={{ marginTop: '16px', position: 'relative' }}>
            <FaSearch style={{ 
              position: 'absolute', 
              left: '12px', 
              top: '50%', 
              transform: 'translateY(-50%)',
              color: '#9ca3af',
              fontSize: '14px'
            }} />
            <input
              type="text"
              placeholder="Ürün ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px 10px 40px',
                borderRadius: '8px',
                border: 'none',
                fontSize: '14px',
                outline: 'none',
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
                  padding: '10px 20px',
                  backgroundColor: '#4f46e5',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '500',
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
                width: '32px',
                height: '32px',
                border: '4px solid #e5e7eb',
                borderTopColor: '#4f46e5',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
              }} />
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
          ) : (
            <div>
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  style={{
                    padding: '16px',
                    borderBottom: '1px solid #e5e7eb',
                    backgroundColor: selectedProduct?.id === product.id ? '#eef2ff' : 'white',
                    cursor: 'pointer',
                  }}
                  onClick={() => handleProductSelect(product)}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                    {/* Product Image */}
                    <div style={{
                      width: '80px',
                      height: '80px',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      border: '1px solid #e5e7eb',
                      flexShrink: 0,
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
                      <h3 style={{ margin: 0, fontSize: '15px', fontWeight: '500', color: '#111827' }}>
                        {product.name}
                      </h3>
                      <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#6b7280' }}>
                        SKU: {product.sku}
                      </p>
                      <p style={{ margin: '4px 0 0', fontSize: '14px', fontWeight: '600', color: '#059669' }}>
                        ₺{parseFloat(product.price || 0).toFixed(2)}
                      </p>
                      {product.vendor && (
                        <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#9ca3af' }}>
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
                        backgroundColor: '#4f46e5',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
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
                              padding: '12px',
                              borderRadius: '8px',
                              border: selectedVariant?.id === variant.id 
                                ? '2px solid #4f46e5' 
                                : '1px solid #e5e7eb',
                              backgroundColor: selectedVariant?.id === variant.id ? '#eef2ff' : 'white',
                              cursor: 'pointer',
                              textAlign: 'left',
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
          padding: '16px 20px',
          borderTop: '1px solid #e5e7eb',
          backgroundColor: '#f9fafb',
          display: 'flex',
          justifyContent: 'space-between',
          gap: '12px',
        }}>
          <button
            type="button"
            onClick={handleClose}
            style={{
              padding: '10px 20px',
              borderRadius: '8px',
              border: '1px solid #d1d5db',
              backgroundColor: 'white',
              color: '#374151',
              fontWeight: '500',
              cursor: 'pointer',
            }}
          >
            İptal
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={!selectedProduct}
            style={{
              padding: '10px 20px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: selectedProduct ? '#4f46e5' : '#9ca3af',
              color: 'white',
              fontWeight: '500',
              cursor: selectedProduct ? 'pointer' : 'not-allowed',
              opacity: selectedProduct ? 1 : 0.6,
            }}
          >
            {selectedProduct ? (selectedVariant ? 'Varyantı Seç' : 'Ürünü Seç') : 'Ürün Seçin'}
          </button>
        </div>
      </div>
    </>
  );
}
