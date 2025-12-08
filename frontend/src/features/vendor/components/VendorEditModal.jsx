import React, { useState, useEffect, useRef } from 'react';
import { FaTimes } from 'react-icons/fa';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateVendor } from '../api/vendorApi';
import { useToast } from '../../../components/common/Toast';

const VendorEditModal = ({ vendor, isOpen = true, onClose }) => {
  const queryClient = useQueryClient();
  const toast = useToast();
  const overlayRef = useRef(null);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', commission_rate: 0, status: 'active', password: '', password_confirmation: '', addresses: [], bank_accounts: [] });

  useEffect(() => {
    if (vendor) {
      setFormData({
        name: vendor.storeName || vendor.name || '',
        email: vendor.email || '',
        phone: vendor.phone || '',
        commission_rate: vendor.commission_rate ?? vendor.commissionRate ?? 0,
        status: vendor.status || 'active',
        password: '',
        password_confirmation: '',
        addresses: vendor.addresses || vendor.addresses_list || vendor.addresses || [],
        bank_accounts: vendor.bank_accounts || vendor.bankAccounts || [],
      });
    }
  }, [vendor]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose && onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const updateMutation = useMutation({
    mutationFn: (data) => updateVendor(vendor?.id, data),
    onSuccess: () => { 
      queryClient.invalidateQueries(['vendors']); 
      toast.success('Satıcı Güncellendi', 'Satıcı bilgileri başarıyla güncellendi.', 3000);
      onClose && onClose(); 
    },
    onError: (err) => { toast.error('Güncelleme Hatası', err.response?.data?.message || err.message, 4000); }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const dataToSend = { ...formData };
    if (!dataToSend.password) { delete dataToSend.password; delete dataToSend.password_confirmation; }
    updateMutation.mutate(dataToSend);
  };

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) onClose && onClose();
  };

  const updateField = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));

  if (!isOpen || !vendor) return null;

  return (
    <div ref={overlayRef} onClick={handleOverlayClick} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' }}>
      <div style={{ backgroundColor: 'white', width: '900px', maxHeight: '90vh', borderRadius: '16px', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f8fafc' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#0f172a', margin: 0 }}>Satıcı Düzenle: <span style={{ color: '#3b82f6' }}>{vendor.storeName}</span></h2>
          <button type="button" aria-label="Kapat" onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}><FaTimes size={20} /></button>
        </div>

        <div style={{ padding: '24px', overflowY: 'auto', flex: 1 }}>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>Mağaza Adı</label>
                <input value={formData.name} onChange={(e) => updateField('name', e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>E-posta</label>
                <input value={formData.email} onChange={(e) => updateField('email', e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>Telefon</label>
                <input value={formData.phone} onChange={(e) => updateField('phone', e.target.value.replace(/\D/g, '').slice(0, 10))} maxLength={10} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>Komisyon (%)</label>
                <input type="number" value={formData.commission_rate} onChange={(e) => updateField('commission_rate', parseFloat(e.target.value || 0))} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0' }} />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>Durum</label>
                <select value={formData.status} onChange={(e) => updateField('status', e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <option value="pre_pending">Ön Başvuru - Beklemede</option>
                  <option value="pre_approved">Ön Başvuru - Onaylandı</option>
                  <option value="pre_rejected">Ön Başvuru - Reddedildi</option>
                  <option value="pending">Onay Bekliyor</option>
                  <option value="active">Aktif</option>
                  <option value="inactive">Pasif</option>
                  <option value="banned">Yasaklı</option>
                </select>
              </div>
            </div>

            {/* Addresses Preview */}
            <div style={{ marginTop: '18px' }}>
              <h4 style={{ margin: '8px 0', fontSize: '14px' }}>Adresler</h4>
              {formData.addresses && formData.addresses.length > 0 ? (
                formData.addresses.map((a, idx) => (
                  <div key={idx} style={{ padding: '10px', border: '1px solid #e6eef8', borderRadius: '8px', marginBottom: '8px' }}>
                    <div style={{ fontWeight: '600' }}>{a.label || `Adres ${idx + 1}`}{a.is_primary ? ' (Varsayılan)' : ''}</div>
                    <div style={{ fontSize: '13px', color: '#475569' }}>{a.address_line || ''} {a.city || ''} {a.district || ''}</div>
                  </div>
                ))
              ) : (
                <div style={{ color: '#64748b' }}>Adres bulunmuyor</div>
              )}
            </div>

            {/* Bank accounts Preview */}
            <div style={{ marginTop: '12px' }}>
              <h4 style={{ margin: '8px 0', fontSize: '14px' }}>Banka Hesapları</h4>
              {formData.bank_accounts && formData.bank_accounts.length > 0 ? (
                formData.bank_accounts.map((b, idx) => (
                  <div key={idx} style={{ padding: '10px', border: '1px solid #e6eef8', borderRadius: '8px', marginBottom: '8px' }}>
                    <div style={{ fontWeight: '600' }}>{b.bank_name || 'Banka' } {b.is_primary ? ' (Varsayılan)' : ''}</div>
                    <div style={{ fontSize: '13px', color: '#475569' }}>{b.iban || b.account_number || ''}</div>
                  </div>
                ))
              ) : (
                <div style={{ color: '#64748b' }}>Banka hesabı bulunmuyor</div>
              )}
            </div>

            <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button type="button" onClick={onClose} style={{ padding: '12px 24px', borderRadius: '8px', border: '1px solid #e2e8f0', backgroundColor: 'white', color: '#64748b', fontWeight: '600', cursor: 'pointer' }}>İptal</button>
              <button type="submit" style={{ padding: '12px 32px', borderRadius: '8px', border: 'none', backgroundColor: '#3b82f6', color: 'white', fontWeight: '600', cursor: 'pointer' }}>{updateMutation.isLoading ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VendorEditModal;
