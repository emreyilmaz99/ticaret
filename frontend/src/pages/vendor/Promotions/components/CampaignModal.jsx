// src/pages/vendor/Promotions/components/CampaignModal.jsx
import React, { useState } from 'react';
import { FaTimes, FaSave, FaSpinner, FaSearch, FaCheck } from 'react-icons/fa';
import { styles } from '../styles';

const CampaignModal = ({ campaign, products, onClose, onSave, isLoading }) => {
  const [form, setForm] = useState({
    name: campaign?.name || '',
    description: campaign?.description || '',
    buy_quantity: campaign?.buy_quantity || 3,
    pay_quantity: campaign?.pay_quantity || 2,
    starts_at: campaign?.starts_at ? campaign.starts_at.split('T')[0] : '',
    ends_at: campaign?.ends_at ? campaign.ends_at.split('T')[0] : '',
    is_active: campaign?.is_active ?? true,
    product_ids: campaign?.products?.map(p => p.id) || []
  });

  const [searchTerm, setSearchTerm] = useState('');

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) || 0 : value
    }));
  };

  const toggleProduct = (productId) => {
    setForm(prev => ({
      ...prev,
      product_ids: prev.product_ids.includes(productId)
        ? prev.product_ids.filter(id => id !== productId)
        : [...prev.product_ids, productId]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.product_ids.length === 0) {
      alert('En az bir ürün seçmelisiniz.');
      return;
    }
    if (form.pay_quantity >= form.buy_quantity) {
      alert('Ödenecek adet, alınacak adetten az olmalıdır.');
      return;
    }
    onSave(form);
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div 
        style={{ ...styles.modal, ...styles.modalWide }} 
        onClick={(e) => e.stopPropagation()}
      >
        <div style={styles.modalHeader}>
          <h2 style={styles.modalTitle}>
            {campaign ? 'Kampanyayı Düzenle' : 'Yeni Kampanya'}
          </h2>
          <button onClick={onClose} style={styles.modalCloseBtn}>
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={styles.formGrid}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Kampanya Adı *</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                style={styles.input}
                placeholder="3 Al 2 Öde Kampanyası"
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
                placeholder="Kampanya açıklaması (opsiyonel)"
              />
            </div>

            <div style={styles.formRow}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Alınacak Adet *</label>
                <input
                  type="number"
                  name="buy_quantity"
                  value={form.buy_quantity}
                  onChange={handleChange}
                  style={styles.input}
                  min="2"
                  required
                />
                <p style={styles.helpText}>Müşterinin alması gereken adet</p>
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Ödenecek Adet *</label>
                <input
                  type="number"
                  name="pay_quantity"
                  value={form.pay_quantity}
                  onChange={handleChange}
                  style={styles.input}
                  min="1"
                  required
                />
                <p style={styles.helpText}>Müşterinin ödeyeceği adet</p>
              </div>
            </div>

            {/* Preview */}
            <div style={styles.previewBox}>
              <span style={styles.previewText}>
                {form.buy_quantity} Al {form.pay_quantity} Öde
              </span>
              <span style={styles.previewSub}>
                ({form.buy_quantity - form.pay_quantity} ürün bedava!)
              </span>
            </div>

            <div style={styles.formRow}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Başlangıç Tarihi *</label>
                <input
                  type="date"
                  name="starts_at"
                  value={form.starts_at}
                  onChange={handleChange}
                  style={styles.input}
                  required
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Bitiş Tarihi *</label>
                <input
                  type="date"
                  name="ends_at"
                  value={form.ends_at}
                  onChange={handleChange}
                  style={styles.input}
                  required
                />
              </div>
            </div>

            {/* Product Selection */}
            <div style={styles.formGroup}>
              <label style={styles.label}>
                Geçerli Ürünler * ({form.product_ids.length} seçili)
              </label>
              <div style={styles.searchContainer}>
                <FaSearch style={styles.searchIcon} />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={styles.searchInput}
                  placeholder="Ürün ara..."
                />
              </div>
              <div style={styles.productList}>
                {filteredProducts.length === 0 ? (
                  <div style={styles.emptyProducts}>
                    Ürün bulunamadı
                  </div>
                ) : (
                  filteredProducts.map(product => {
                    const isSelected = form.product_ids.includes(product.id);
                    return (
                      <div 
                        key={product.id}
                        onClick={() => toggleProduct(product.id)}
                        style={{ 
                          ...styles.productItem,
                          ...(isSelected ? styles.productItemSelected : {})
                        }}
                      >
                        <div style={{ 
                          ...styles.checkbox,
                          ...(isSelected ? styles.checkboxSelected : {})
                        }}>
                          {isSelected && <FaCheck style={styles.checkIcon} />}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={styles.productName}>{product.name}</p>
                        </div>
                      </div>
                    );
                  })
                )}
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

export default CampaignModal;
