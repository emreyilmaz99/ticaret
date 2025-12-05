// src/pages/vendor/Settings/components/BankTab.jsx
import React from 'react';
import { FaUniversity, FaPlus, FaEdit, FaTrash, FaSpinner } from 'react-icons/fa';
import { styles } from '../styles';
import { TURKEY_BANKS } from '../useVendorSettings';

const BankTab = ({
  vendor,
  bankForm,
  setBankForm,
  editingBankId,
  onSubmit,
  onEdit,
  onDelete,
  onCancel,
  isSaving
}) => {
  const bankAccounts = vendor?.bank_accounts || [];

  const handleIbanChange = (e) => {
    const value = e.target.value.replace(/[^0-9\s]/g, '');
    setBankForm({ ...bankForm, iban: 'TR' + value.toUpperCase() });
  };

  return (
    <div style={styles.card}>
      <h3 style={styles.sectionHeader}>
        <FaUniversity style={styles.sectionIcon} />
        {editingBankId ? 'Banka Hesabını Düzenle' : 'Yeni Banka Hesabı Ekle'}
      </h3>

      <form onSubmit={onSubmit}>
        <div style={styles.formRow}>
          <div>
            <label style={styles.label}>Banka Adı *</label>
            <select
              value={bankForm.bank_name}
              onChange={(e) => setBankForm({ ...bankForm, bank_name: e.target.value })}
              style={styles.select}
              required
            >
              <option value="">-- Banka Seçin --</option>
              {TURKEY_BANKS.map(bank => (
                <option key={bank} value={bank}>{bank}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={styles.label}>Hesap Sahibi *</label>
            <input
              type="text"
              value={bankForm.account_holder}
              onChange={(e) => setBankForm({ ...bankForm, account_holder: e.target.value })}
              style={styles.inputPlain}
              placeholder="Ad Soyad"
              required
            />
          </div>
        </div>

        <div style={styles.formRowWide}>
          <div>
            <label style={styles.label}>IBAN *</label>
            <div style={{ position: 'relative' }}>
              <span style={styles.ibanPrefix}>TR</span>
              <input
                type="text"
                value={bankForm.iban.startsWith('TR') ? bankForm.iban.slice(2) : bankForm.iban}
                onChange={handleIbanChange}
                style={{ ...styles.input, paddingLeft: '36px' }}
                placeholder="00 0000 0000 0000 0000 0000 00"
                maxLength={30}
                required
              />
            </div>
            <small style={styles.helpText}>Türk IBAN'ı TR ile başlar ve 26 karakter içerir</small>
          </div>
          <div>
            <label style={styles.label}>Para Birimi</label>
            <select
              value={bankForm.currency}
              onChange={(e) => setBankForm({ ...bankForm, currency: e.target.value })}
              style={styles.select}
            >
              <option value="TRY">🇹🇷 TRY - Türk Lirası (₺)</option>
              <option value="USD">🇺🇸 USD - Amerikan Doları ($)</option>
              <option value="EUR">🇪🇺 EUR - Euro (€)</option>
              <option value="GBP">🇬🇧 GBP - İngiliz Sterlini (£)</option>
            </select>
          </div>
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
            {editingBankId ? 'Güncelle' : 'Hesap Ekle'}
          </button>
          {editingBankId && (
            <button type="button" onClick={onCancel} style={styles.cancelBtn}>
              İptal
            </button>
          )}
        </div>
      </form>

      {/* Bank List */}
      {bankAccounts.length > 0 && (
        <div style={styles.listContainer}>
          <h4 style={styles.listTitle}>Kayıtlı Banka Hesapları</h4>
          <div style={styles.listItems}>
            {bankAccounts.map((bank) => (
              <div key={bank.id} style={styles.listItem}>
                <div style={styles.itemInfo}>
                  <div style={styles.itemTitle}>
                    {bank.bank_name}
                    {bank.is_primary && (
                      <span style={styles.primaryBadge}>Birincil</span>
                    )}
                  </div>
                  <div style={styles.itemSubtitle}>
                    {bank.account_holder} • {bank.iban}
                  </div>
                </div>
                <div style={styles.itemActions}>
                  <button onClick={() => onEdit(bank)} style={styles.editBtn} title="Düzenle">
                    <FaEdit />
                  </button>
                  <button onClick={() => onDelete(bank.id)} style={styles.deleteBtn} title="Sil">
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {bankAccounts.length === 0 && (
        <div style={styles.emptyState}>
          <FaUniversity size={32} style={styles.emptyIcon} />
          <p style={styles.emptyText}>Henüz banka hesabı eklenmemiş</p>
          <p style={styles.emptySubtext}>Yukarıdaki formu kullanarak ilk hesabınızı ekleyin.</p>
        </div>
      )}
    </div>
  );
};

export default BankTab;
