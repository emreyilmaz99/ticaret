// src/pages/vendor/Promotions/components/CouponModal.jsx
import React, { useState } from 'react';
import { FaTimes, FaSave, FaSpinner } from 'react-icons/fa';
import { styles } from '../styles';

const CouponModal = ({ coupon, onClose, onSave, isLoading }) => {
  const [form, setForm] = useState({
    code: coupon?.code || '',
    name: coupon?.name || '',
    description: coupon?.description || '',
    discount_amount: coupon?.discount_amount || 50,
    min_order_amount: coupon?.min_order_amount || 0,
    usage_limit: coupon?.usage_limit || '',
    usage_limit_per_user: coupon?.usage_limit_per_user || '',
    starts_at: coupon?.starts_at ? coupon.starts_at.split('T')[0] : '',
    expires_at: coupon?.expires_at ? coupon.expires_at.split('T')[0] : '',
    is_active: coupon?.is_active ?? true
  });

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'number' ? (value === '' ? '' : parseFloat(value)) : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = { ...form };
    if (data.usage_limit === '') data.usage_limit = null;
    if (data.usage_limit_per_user === '') data.usage_limit_per_user = null;
    if (data.starts_at === '') data.starts_at = null;
    if (data.expires_at === '') data.expires_at = null;
    onSave(data);
  };

  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.modalHeader}>
          <h2 style={styles.modalTitle}>
            {coupon ? 'Kuponu Düzenle' : 'Yeni Kupon'}
          </h2>
          <button onClick={onClose} style={styles.modalCloseBtn}>
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={styles.formGrid}>
            <div style={styles.formRow}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Kupon Kodu *</label>
                <input
                  type="text"
                  name="code"
                  value={form.code}
                  onChange={handleChange}
                  style={{ ...styles.input, textTransform: 'uppercase' }}
                  placeholder="YAZ50"
                  required
                  maxLength={50}
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>İndirim Tutarı (₺) *</label>
                <input
                  type="number"
                  name="discount_amount"
                  value={form.discount_amount}
                  onChange={handleChange}
                  style={styles.input}
                  min="1"
                  step="0.01"
                  required
                />
              </div>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Kupon Adı *</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                style={styles.input}
                placeholder="Yaz İndirimi"
                required
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Açıklama</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                style={styles.textarea}
                placeholder="Kupon açıklaması (opsiyonel)"
              />
            </div>

            <div style={styles.formRow}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Min. Sepet Tutarı (₺)</label>
                <input
                  type="number"
                  name="min_order_amount"
                  value={form.min_order_amount}
                  onChange={handleChange}
                  style={styles.input}
                  min="0"
                  step="0.01"
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Toplam Kullanım Limiti</label>
                <input
                  type="number"
                  name="usage_limit"
                  value={form.usage_limit}
                  onChange={handleChange}
                  style={styles.input}
                  min="1"
                  placeholder="Sınırsız"
                />
              </div>
            </div>

            <div style={styles.formRow}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Başlangıç Tarihi</label>
                <input
                  type="date"
                  name="starts_at"
                  value={form.starts_at}
                  onChange={handleChange}
                  style={styles.input}
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Bitiş Tarihi</label>
                <input
                  type="date"
                  name="expires_at"
                  value={form.expires_at}
                  onChange={handleChange}
                  style={styles.input}
                />
              </div>
            </div>
          </div>

          <div style={styles.modalFooter}>
            <button type="button" onClick={onClose} style={styles.cancelBtn}>
              İptal
            </button>
            <button
              type="submit"
              disabled={isLoading}
              style={{
                ...styles.submitBtn,
                ...(isLoading ? styles.submitBtnDisabled : {})
              }}
            >
              {isLoading ? (
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
    </div>
  );
};

export default CouponModal;
