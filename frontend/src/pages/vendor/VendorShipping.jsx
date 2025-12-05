import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '../../components/Toast';
import { FaTruck, FaSave, FaSpinner, FaInfoCircle, FaToggleOn, FaToggleOff, FaMoneyBillWave, FaGift } from 'react-icons/fa';
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
      toast.success(data.message || 'Kargo ayarları kaydedildi');
      qc.invalidateQueries({ queryKey: ['vendor', 'shipping-settings'] });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Kaydetme başarısız');
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    updateMutation.mutate(form);
  };

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
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
  };

  const styles = {
    container: {
      padding: '24px',
      maxWidth: '800px',
      margin: '0 auto'
    },
    header: {
      marginBottom: '32px'
    },
    title: {
      fontSize: '28px',
      fontWeight: '700',
      color: '#1e293b',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      marginBottom: '8px'
    },
    subtitle: {
      color: '#64748b',
      fontSize: '15px'
    },
    card: {
      backgroundColor: 'white',
      borderRadius: '16px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
      padding: '32px',
      marginBottom: '24px'
    },
    cardTitle: {
      fontSize: '18px',
      fontWeight: '600',
      color: '#1e293b',
      marginBottom: '24px',
      display: 'flex',
      alignItems: 'center',
      gap: '10px'
    },
    formGroup: {
      marginBottom: '24px'
    },
    label: {
      display: 'block',
      fontWeight: '500',
      color: '#374151',
      marginBottom: '8px',
      fontSize: '14px'
    },
    input: {
      width: '100%',
      padding: '12px 16px',
      border: '2px solid #e5e7eb',
      borderRadius: '10px',
      fontSize: '16px',
      transition: 'border-color 0.2s',
      outline: 'none',
      boxSizing: 'border-box'
    },
    inputFocused: {
      borderColor: '#3b82f6'
    },
    inputGroup: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center'
    },
    inputSuffix: {
      position: 'absolute',
      right: '16px',
      color: '#64748b',
      fontWeight: '500'
    },
    helpText: {
      fontSize: '13px',
      color: '#64748b',
      marginTop: '6px',
      display: 'flex',
      alignItems: 'center',
      gap: '6px'
    },
    toggleContainer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '20px',
      backgroundColor: '#f8fafc',
      borderRadius: '12px',
      marginBottom: '24px'
    },
    toggleLabel: {
      display: 'flex',
      flexDirection: 'column',
      gap: '4px'
    },
    toggleTitle: {
      fontWeight: '600',
      color: '#1e293b',
      fontSize: '15px'
    },
    toggleSubtitle: {
      fontSize: '13px',
      color: '#64748b'
    },
    toggleButton: {
      cursor: 'pointer',
      fontSize: '40px',
      color: '#3b82f6',
      transition: 'transform 0.2s'
    },
    toggleButtonOff: {
      color: '#cbd5e1'
    },
    infoBox: {
      backgroundColor: '#eff6ff',
      border: '1px solid #bfdbfe',
      borderRadius: '12px',
      padding: '16px',
      marginBottom: '24px'
    },
    infoTitle: {
      fontWeight: '600',
      color: '#1e40af',
      marginBottom: '8px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    infoText: {
      fontSize: '14px',
      color: '#3b82f6',
      lineHeight: '1.6'
    },
    previewBox: {
      backgroundColor: '#f1f5f9',
      borderRadius: '12px',
      padding: '20px',
      marginTop: '24px'
    },
    previewTitle: {
      fontWeight: '600',
      color: '#475569',
      marginBottom: '16px',
      fontSize: '14px'
    },
    previewItem: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '12px 0',
      borderBottom: '1px solid #e2e8f0'
    },
    previewLabel: {
      color: '#64748b',
      fontSize: '14px'
    },
    previewValue: {
      fontWeight: '600',
      color: '#1e293b',
      fontSize: '15px'
    },
    previewFree: {
      color: '#10b981',
      fontWeight: '600'
    },
    buttonRow: {
      display: 'flex',
      gap: '12px',
      justifyContent: 'flex-end',
      marginTop: '24px'
    },
    button: {
      padding: '12px 24px',
      borderRadius: '10px',
      fontWeight: '600',
      fontSize: '15px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      transition: 'all 0.2s',
      border: 'none'
    },
    primaryButton: {
      background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
      color: 'white'
    },
    secondaryButton: {
      backgroundColor: '#f1f5f9',
      color: '#475569'
    },
    disabledOverlay: {
      opacity: 0.5,
      pointerEvents: 'none'
    },
    loadingContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '300px'
    }
  };

  if (isLoading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingContainer}>
          <FaSpinner size={32} className="spin" style={{ color: '#3b82f6' }} />
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>
          <FaTruck /> Kargo Ayarları
        </h1>
        <p style={styles.subtitle}>
          Müşterilerinize uygulayacağınız kargo ücretlerini ve ücretsiz kargo limitini belirleyin
        </p>
      </div>

      {/* Info Box */}
      <div style={styles.infoBox}>
        <div style={styles.infoTitle}>
          <FaInfoCircle /> Nasıl Çalışır?
        </div>
        <div style={styles.infoText}>
          Müşteriler sepetlerinde sizin mağazanızdan alışveriş yaptığında, belirlediğiniz kargo ücreti uygulanır.
          Eğer sepet toplamı ücretsiz kargo limitinizi geçerse, kargo ücretsiz olur.
          Örneğin: 300₺ limit belirlerseniz, 300₺ ve üzeri alışverişlerde kargo ücretsiz!
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Main Settings Card */}
        <div style={styles.card}>
          <div style={styles.cardTitle}>
            <FaMoneyBillWave style={{ color: '#3b82f6' }} />
            Kargo Ücreti Ayarları
          </div>

          {/* Toggle Shipping */}
          <div style={styles.toggleContainer}>
            <div style={styles.toggleLabel}>
              <span style={styles.toggleTitle}>Kargo Ücreti Uygula</span>
              <span style={styles.toggleSubtitle}>
                {form.is_shipping_enabled 
                  ? 'Müşterilerinize kargo ücreti uygulanıyor' 
                  : 'Tüm siparişlerde kargo ücretsiz'}
              </span>
            </div>
            <div 
              style={{...styles.toggleButton, ...(form.is_shipping_enabled ? {} : styles.toggleButtonOff)}}
              onClick={toggleShipping}
            >
              {form.is_shipping_enabled ? <FaToggleOn /> : <FaToggleOff />}
            </div>
          </div>

          <div style={form.is_shipping_enabled ? {} : styles.disabledOverlay}>
            {/* Shipping Cost */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Kargo Ücreti</label>
              <div style={styles.inputGroup}>
                <input
                  type="number"
                  name="shipping_cost"
                  value={form.shipping_cost}
                  onChange={handleInputChange}
                  style={{...styles.input, paddingRight: '50px'}}
                  step="0.01"
                  min="0"
                  max="9999.99"
                  disabled={!form.is_shipping_enabled}
                />
                <span style={styles.inputSuffix}>₺</span>
              </div>
              <p style={styles.helpText}>
                <FaInfoCircle size={12} />
                Ücretsiz kargo limitinin altındaki siparişlere uygulanacak kargo ücreti
              </p>
            </div>

            {/* Free Shipping Threshold */}
            <div style={styles.formGroup}>
              <label style={styles.label}>
                <FaGift style={{ marginRight: '6px', color: '#10b981' }} />
                Ücretsiz Kargo Limiti
              </label>
              <div style={styles.inputGroup}>
                <input
                  type="number"
                  name="free_shipping_threshold"
                  value={form.free_shipping_threshold}
                  onChange={handleInputChange}
                  style={{...styles.input, paddingRight: '50px'}}
                  step="0.01"
                  min="0"
                  max="99999.99"
                  disabled={!form.is_shipping_enabled}
                />
                <span style={styles.inputSuffix}>₺</span>
              </div>
              <p style={styles.helpText}>
                <FaInfoCircle size={12} />
                Bu tutarın üzerindeki siparişlerde kargo ücretsiz olur
              </p>
            </div>
          </div>

          {/* Preview */}
          <div style={styles.previewBox}>
            <div style={styles.previewTitle}>📦 Önizleme - Müşterileriniz şunu görecek:</div>
            
            <div style={styles.previewItem}>
              <span style={styles.previewLabel}>100₺'lik sipariş için kargo:</span>
              <span style={form.is_shipping_enabled && 100 < form.free_shipping_threshold 
                ? styles.previewValue 
                : styles.previewFree}>
                {form.is_shipping_enabled && 100 < form.free_shipping_threshold 
                  ? `${form.shipping_cost.toFixed(2)} ₺` 
                  : 'Ücretsiz'}
              </span>
            </div>
            
            <div style={styles.previewItem}>
              <span style={styles.previewLabel}>{form.free_shipping_threshold.toFixed(0)}₺'lik sipariş için kargo:</span>
              <span style={styles.previewFree}>Ücretsiz</span>
            </div>
            
            <div style={{...styles.previewItem, borderBottom: 'none'}}>
              <span style={styles.previewLabel}>500₺'lik sipariş için kargo:</span>
              <span style={styles.previewFree}>Ücretsiz</span>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div style={styles.buttonRow}>
          <button
            type="button"
            style={{...styles.button, ...styles.secondaryButton}}
            onClick={resetToDefaults}
          >
            Varsayılana Dön
          </button>
          <button
            type="submit"
            style={{...styles.button, ...styles.primaryButton}}
            disabled={updateMutation.isPending}
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
