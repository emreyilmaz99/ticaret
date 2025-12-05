// src/pages/vendor/Settings/components/AddressTab.jsx
import React from 'react';
import { FaMapMarkerAlt, FaPlus, FaEdit, FaTrash, FaSpinner, FaCheckCircle } from 'react-icons/fa';
import { styles } from '../styles';
import { TURKEY_CITIES, ADDRESS_LABELS } from '../useVendorSettings';
import { cityPlateCodes } from '../../../../data/turkeyData';

const AddressTab = ({
  vendor,
  addressForm,
  setAddressForm,
  editingAddressId,
  onSubmit,
  onEdit,
  onDelete,
  onCancel,
  isSaving
}) => {
  const addresses = vendor?.addresses || [];

  const handleCityChange = (e) => {
    const city = e.target.value;
    const postalCode = city && cityPlateCodes[city] ? cityPlateCodes[city] + '000' : '';
    setAddressForm({ ...addressForm, city, postal_code: postalCode });
  };

  return (
    <div style={styles.card}>
      <h3 style={styles.sectionHeader}>
        <FaMapMarkerAlt style={styles.sectionIcon} />
        {editingAddressId ? 'Adresi Düzenle' : 'Yeni Adres Ekle'}
      </h3>

      <form onSubmit={onSubmit}>
        <div style={styles.formRow}>
          <div>
            <label style={styles.label}>Adres Etiketi *</label>
            <select
              value={addressForm.label}
              onChange={(e) => setAddressForm({ ...addressForm, label: e.target.value })}
              style={styles.select}
              required
            >
              {ADDRESS_LABELS.map(label => (
                <option key={label} value={label}>{label}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={styles.label}>Ülke</label>
            <select
              value={addressForm.country}
              onChange={(e) => setAddressForm({ ...addressForm, country: e.target.value })}
              style={styles.select}
            >
              <option value="Türkiye">🇹🇷 Türkiye</option>
            </select>
          </div>
        </div>

        <div style={styles.formRow}>
          <div>
            <label style={styles.label}>Şehir *</label>
            <select
              value={addressForm.city}
              onChange={handleCityChange}
              style={styles.select}
              required
            >
              <option value="">Şehir Seçiniz</option>
              {TURKEY_CITIES.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={styles.label}>Posta Kodu</label>
            <input
              type="text"
              value={addressForm.postal_code}
              onChange={(e) => setAddressForm({ ...addressForm, postal_code: e.target.value.replace(/\D/g, '').slice(0, 5) })}
              style={styles.inputPlain}
              placeholder="34000"
              maxLength={5}
            />
          </div>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={styles.label}>Açık Adres *</label>
          <textarea
            value={addressForm.address_line}
            onChange={(e) => setAddressForm({ ...addressForm, address_line: e.target.value })}
            style={styles.textarea}
            placeholder="Mahalle, cadde, sokak, bina no, daire no..."
            required
          />
          <p style={styles.helpText}>Detaylı adres bilgisi giriniz (min. 10 karakter)</p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            type="submit"
            disabled={isSaving}
            style={{
              ...styles.addBtn,
              opacity: isSaving ? 0.7 : 1
            }}
          >
            {isSaving ? <FaSpinner className="spin" /> : <FaPlus />}
            {editingAddressId ? 'Güncelle' : 'Adres Ekle'}
          </button>
          {editingAddressId && (
            <button type="button" onClick={onCancel} style={styles.cancelBtn}>
              İptal
            </button>
          )}
        </div>
      </form>

      {/* Address List */}
      {addresses.length > 0 && (
        <div style={styles.listContainer}>
          <h4 style={styles.listTitle}>Kayıtlı Adresler ({addresses.length})</h4>
          <div style={styles.listItems}>
            {addresses.map((addr) => (
              <div key={addr.id} style={styles.listItem}>
                <div style={styles.itemInfo}>
                  <div style={styles.itemTitle}>
                    <FaMapMarkerAlt style={{ color: '#059669' }} />
                    {addr.label}
                    {addr.is_primary && (
                      <span style={styles.primaryBadge}>
                        <FaCheckCircle size={10} /> Birincil
                      </span>
                    )}
                  </div>
                  <div style={styles.itemSubtitle}>{addr.address_line}</div>
                  <div style={styles.itemMeta}>
                    {addr.postal_code && `${addr.postal_code} - `}{addr.city}, {addr.country}
                  </div>
                </div>
                <div style={styles.itemActions}>
                  <button onClick={() => onEdit(addr)} style={styles.editBtn} title="Düzenle">
                    <FaEdit />
                  </button>
                  <button onClick={() => onDelete(addr.id)} style={styles.deleteBtn} title="Sil">
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {addresses.length === 0 && (
        <div style={styles.emptyState}>
          <FaMapMarkerAlt size={32} style={styles.emptyIcon} />
          <p style={styles.emptyText}>Henüz adres eklenmemiş</p>
          <p style={styles.emptySubtext}>Yukarıdaki formu kullanarak ilk adresinizi ekleyin.</p>
        </div>
      )}
    </div>
  );
};

export default AddressTab;
