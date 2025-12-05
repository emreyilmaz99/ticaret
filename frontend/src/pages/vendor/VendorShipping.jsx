import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '../../components/Toast';
import { FaTruck, FaSave, FaSpinner, FaInfoCircle, FaToggleOn, FaToggleOff, FaGift, FaBox, FaShippingFast } from 'react-icons/fa';
import axios from '../../lib/axios';

const VendorShipping = () => {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const toast = useToast();
  
  const [form, setForm] = useState({
    shipping_cost: 29.90,
    free_shipping_threshold: 300.00,
    is_shipping_enabled: true
  });
  
  const [defaults, setDefaults] = useState({
    shipping_cost: 29.90,
    free_shipping_threshold: 300.00
  });

  useEffect(() => {
    const token = localStorage.getItem('vendor_token');
    if (!token) {
      navigate('/vendor/login');
    }
  }, [navigate]);

  // Fetch shipping settings
  const { data: settingsData, isLoading } = useQuery({
    queryKey: ['vendor', 'shipping-settings'],
    queryFn: async () => {
      const res = await axios.get('/v1/vendor/shipping-settings');
      return res.data;
    }
  });

  // Update form when settings loaded
  useEffect(() => {
    if (settingsData?.data) {
      setForm({
        shipping_cost: settingsData.data.shipping_cost,
        free_shipping_threshold: settingsData.data.free_shipping_threshold,
        is_shipping_enabled: settingsData.data.is_shipping_enabled
      });
    }
    if (settingsData?.defaults) {
      setDefaults(settingsData.defaults);
    }
  }, [settingsData]);

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async (data) => {
      const res = await axios.put('/v1/vendor/shipping-settings', data);
      return res.data;
    },
    onSuccess: (data) => {
      toast.success('Başarılı', data.message || 'Kargo ayarları kaydedildi');
      qc.invalidateQueries({ queryKey: ['vendor', 'shipping-settings'] });
    },
    onError: (err) => {
      toast.error('Hata', err.response?.data?.message || 'Kaydetme başarısız');
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    updateMutation.mutate(form);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: parseFloat(value) || 0
    }));
  };

  const toggleShipping = () => {
    setForm(prev => ({
      ...prev,
      is_shipping_enabled: !prev.is_shipping_enabled
    }));
  };

  const resetToDefaults = () => {
    setForm(prev => ({
      ...prev,
      shipping_cost: defaults.shipping_cost,
      free_shipping_threshold: defaults.free_shipping_threshold
    }));
    toast.success('Bilgi', 'Varsayılan değerler yüklendi');
  };

  const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    paddingRight: '50px',
    borderRadius: '10px',
    border: '1px solid #e2e8f0',
    outline: 'none',
    fontSize: '14px',
    transition: 'all 0.2s',
    boxSizing: 'border-box'
  };

  const labelStyle = {
    display: 'block',
    fontSize: '14px',
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: '8px'
  };

  if (isLoading) {
    return (
      <div style={{ padding: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 400 }}>
        <FaSpinner className="spin" style={{ fontSize: 32, color: '#64748b' }} />
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", color: '#1e293b', maxWidth: '900px' }}>
      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .spin { animation: spin 1s linear infinite; }
        input:focus { border-color: #14532d !important; box-shadow: 0 0 0 3px rgba(20, 83, 45, 0.1); }
      `}</style>
      
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.5px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <FaTruck style={{ color: '#14532d' }} /> Kargo Ayarları
        </h1>
        <p style={{ color: '#64748b', fontSize: '14px', marginTop: '4px' }}>
          Müşterilerinize uygulayacağınız kargo ücretlerini ve ücretsiz kargo limitini belirleyin.
        </p>
      </div>

      {/* Info Card */}
      <div style={{ 
        backgroundColor: '#f0fdf4', 
        border: '1px solid #bbf7d0', 
        borderRadius: '16px', 
        padding: '20px 24px', 
        marginBottom: '24px',
        display: 'flex',
        gap: '16px',
        alignItems: 'flex-start'
      }}>
        <FaInfoCircle style={{ color: '#16a34a', fontSize: '20px', marginTop: '2px', flexShrink: 0 }} />
        <div>
          <p style={{ fontWeight: '600', color: '#15803d', marginBottom: '4px', fontSize: '14px' }}>Nasıl Çalışır?</p>
          <p style={{ color: '#166534', fontSize: '13px', lineHeight: '1.6', margin: 0 }}>
            Müşteriler sepetlerinde sizin mağazanızdan alışveriş yaptığında, belirlediğiniz kargo ücreti uygulanır.
            Sepet toplamı ücretsiz kargo limitinizi geçerse, kargo otomatik olarak ücretsiz olur.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Main Card */}
        <div style={{ 
          backgroundColor: 'white', 
          padding: '32px', 
          borderRadius: '24px', 
          border: '1px solid #f1f5f9', 
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.02)',
          marginBottom: '24px'
        }}>
          
          {/* Toggle Section */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            padding: '20px 24px',
            backgroundColor: form.is_shipping_enabled ? '#f0fdf4' : '#f8fafc',
            borderRadius: '16px',
            marginBottom: '32px',
            border: form.is_shipping_enabled ? '1px solid #bbf7d0' : '1px solid #e2e8f0',
            transition: 'all 0.3s'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                backgroundColor: form.is_shipping_enabled ? '#dcfce7' : '#f1f5f9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <FaShippingFast style={{ fontSize: '20px', color: form.is_shipping_enabled ? '#16a34a' : '#94a3b8' }} />
              </div>
              <div>
                <p style={{ fontWeight: '600', color: '#0f172a', marginBottom: '2px', fontSize: '15px' }}>
                  Kargo Ücreti Uygula
                </p>
                <p style={{ color: '#64748b', fontSize: '13px', margin: 0 }}>
                  {form.is_shipping_enabled 
                    ? 'Limit altı siparişlerde kargo ücreti alınıyor' 
                    : 'Tüm siparişlerde kargo ücretsiz'}
                </p>
              </div>
            </div>
            <button 
              type="button"
              onClick={toggleShipping}
              style={{ 
                background: 'none', 
                border: 'none', 
                cursor: 'pointer',
                fontSize: '44px',
                color: form.is_shipping_enabled ? '#16a34a' : '#cbd5e1',
                display: 'flex',
                alignItems: 'center',
                transition: 'color 0.2s'
              }}
            >
              {form.is_shipping_enabled ? <FaToggleOn /> : <FaToggleOff />}
            </button>
          </div>

          {/* Form Fields */}
          <div style={{ 
            opacity: form.is_shipping_enabled ? 1 : 0.5, 
            pointerEvents: form.is_shipping_enabled ? 'auto' : 'none',
            transition: 'opacity 0.3s'
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
              {/* Shipping Cost */}
              <div>
                <label style={labelStyle}>
                  <FaTruck style={{ marginRight: '8px', color: '#64748b' }} />
                  Kargo Ücreti
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="number"
                    name="shipping_cost"
                    value={form.shipping_cost}
                    onChange={handleInputChange}
                    style={inputStyle}
                    step="0.01"
                    min="0"
                    max="9999.99"
                    disabled={!form.is_shipping_enabled}
                  />
                  <span style={{ 
                    position: 'absolute', 
                    right: '16px', 
                    top: '50%', 
                    transform: 'translateY(-50%)',
                    color: '#64748b',
                    fontWeight: '600',
                    fontSize: '14px'
                  }}>₺</span>
                </div>
                <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '6px' }}>
                  Limit altı siparişlere uygulanacak ücret
                </p>
              </div>

              {/* Free Shipping Threshold */}
              <div>
                <label style={labelStyle}>
                  <FaGift style={{ marginRight: '8px', color: '#16a34a' }} />
                  Ücretsiz Kargo Limiti
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="number"
                    name="free_shipping_threshold"
                    value={form.free_shipping_threshold}
                    onChange={handleInputChange}
                    style={inputStyle}
                    step="0.01"
                    min="0"
                    max="99999.99"
                    disabled={!form.is_shipping_enabled}
                  />
                  <span style={{ 
                    position: 'absolute', 
                    right: '16px', 
                    top: '50%', 
                    transform: 'translateY(-50%)',
                    color: '#64748b',
                    fontWeight: '600',
                    fontSize: '14px'
                  }}>₺</span>
                </div>
                <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '6px' }}>
                  Bu tutarın üzerinde kargo ücretsiz
                </p>
              </div>
            </div>

            {/* Preview Section */}
            <div style={{ 
              backgroundColor: '#f8fafc', 
              borderRadius: '16px', 
              padding: '24px',
              border: '1px solid #e2e8f0'
            }}>
              <p style={{ 
                fontWeight: '600', 
                color: '#475569', 
                marginBottom: '16px', 
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <FaBox style={{ color: '#14532d' }} /> Önizleme - Müşterileriniz Şunu Görecek
              </p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {/* Preview Row 1 */}
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  padding: '12px 16px',
                  backgroundColor: 'white',
                  borderRadius: '10px',
                  border: '1px solid #e2e8f0'
                }}>
                  <span style={{ color: '#64748b', fontSize: '14px' }}>100₺'lik sipariş için kargo:</span>
                  {form.is_shipping_enabled && 100 < form.free_shipping_threshold ? (
                    <span style={{ fontWeight: '700', color: '#0f172a', fontSize: '15px' }}>
                      {form.shipping_cost.toFixed(2)} ₺
                    </span>
                  ) : (
                    <span style={{ fontWeight: '700', color: '#16a34a', fontSize: '15px' }}>
                      ✓ Ücretsiz
                    </span>
                  )}
                </div>

                {/* Preview Row 2 */}
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  padding: '12px 16px',
                  backgroundColor: '#f0fdf4',
                  borderRadius: '10px',
                  border: '1px solid #bbf7d0'
                }}>
                  <span style={{ color: '#64748b', fontSize: '14px' }}>
                    {form.free_shipping_threshold.toFixed(0)}₺ ve üzeri sipariş için kargo:
                  </span>
                  <span style={{ fontWeight: '700', color: '#16a34a', fontSize: '15px' }}>
                    ✓ Ücretsiz
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button
            type="button"
            onClick={resetToDefaults}
            style={{ 
              padding: '12px 20px', 
              backgroundColor: 'white', 
              border: '1px solid #e2e8f0', 
              borderRadius: '10px', 
              fontWeight: '600', 
              color: '#64748b', 
              cursor: 'pointer',
              fontSize: '14px',
              transition: 'all 0.2s'
            }}
          >
            Varsayılana Dön
          </button>
          
          <button
            type="submit"
            disabled={updateMutation.isPending}
            style={{ 
              padding: '12px 32px', 
              background: 'linear-gradient(135deg, #14532d 0%, #166534 100%)', 
              border: 'none', 
              borderRadius: '10px', 
              fontWeight: '600', 
              color: 'white', 
              cursor: updateMutation.isPending ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 12px rgba(20, 83, 45, 0.3)',
              transition: 'all 0.2s',
              opacity: updateMutation.isPending ? 0.7 : 1
            }}
          >
            {updateMutation.isPending ? (
              <>
                <FaSpinner className="spin" /> Kaydediliyor...
              </>
            ) : (
              <>
                <FaSave /> Kaydet
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default VendorShipping;
