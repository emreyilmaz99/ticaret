import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUserAddresses, createUserAddress, updateUserAddress, deleteUserAddress, setDefaultUserAddress } from '../../features/user/api/userAddressApi';
import { useToast } from '../../components/Toast';
import { FaMapMarkerAlt, FaPlus, FaEdit, FaTrash, FaSpinner, FaCheckCircle, FaUser, FaPhone, FaCity, FaHome, FaStar, FaTimes } from 'react-icons/fa';
import { cityPlateCodes } from '../../data/turkeyData';

// Türkiye şehirleri
const TURKEY_CITIES = [
  'Adana', 'Adıyaman', 'Afyonkarahisar', 'Ağrı', 'Aksaray', 'Amasya', 'Ankara', 'Antalya', 'Ardahan', 'Artvin',
  'Aydın', 'Balıkesir', 'Bartın', 'Batman', 'Bayburt', 'Bilecik', 'Bingöl', 'Bitlis', 'Bolu', 'Burdur',
  'Bursa', 'Çanakkale', 'Çankırı', 'Çorum', 'Denizli', 'Diyarbakır', 'Düzce', 'Edirne', 'Elazığ', 'Erzincan',
  'Erzurum', 'Eskişehir', 'Gaziantep', 'Giresun', 'Gümüşhane', 'Hakkari', 'Hatay', 'Iğdır', 'Isparta', 'İstanbul',
  'İzmir', 'Kahramanmaraş', 'Karabük', 'Karaman', 'Kars', 'Kastamonu', 'Kayseri', 'Kırıkkale', 'Kırklareli', 'Kırşehir',
  'Kilis', 'Kocaeli', 'Konya', 'Kütahya', 'Malatya', 'Manisa', 'Mardin', 'Mersin', 'Muğla', 'Muş',
  'Nevşehir', 'Niğde', 'Ordu', 'Osmaniye', 'Rize', 'Sakarya', 'Samsun', 'Siirt', 'Sinop', 'Sivas',
  'Şanlıurfa', 'Şırnak', 'Tekirdağ', 'Tokat', 'Trabzon', 'Tunceli', 'Uşak', 'Van', 'Yalova', 'Yozgat', 'Zonguldak'
];

const ADDRESS_LABELS = ['Ev', 'İş', 'Aile', 'Diğer'];

const UserAddresses = () => {
  const qc = useQueryClient();
  const toast = useToast();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    label: 'Ev',
    full_name: '',
    phone: '',
    country: 'Türkiye',
    city: '',
    district: '',
    neighborhood: '',
    address_line: '',
    postal_code: '',
    is_default: false
  });

  // Fetch addresses
  const { data: addressData, isLoading } = useQuery({
    queryKey: ['user', 'addresses'],
    queryFn: getUserAddresses
  });

  const addresses = addressData?.data?.addresses || [];

  // Create mutation
  const createMutation = useMutation({
    mutationFn: createUserAddress,
    onSuccess: () => {
      qc.invalidateQueries(['user', 'addresses']);
      toast.success('Başarılı', 'Adres eklendi.');
      resetForm();
    },
    onError: (err) => {
      toast.error('Hata', err.response?.data?.message || 'Adres eklenemedi.');
    }
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updateUserAddress(id, data),
    onSuccess: () => {
      qc.invalidateQueries(['user', 'addresses']);
      toast.success('Başarılı', 'Adres güncellendi.');
      resetForm();
    },
    onError: (err) => {
      toast.error('Hata', err.response?.data?.message || 'Adres güncellenemedi.');
    }
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: deleteUserAddress,
    onSuccess: () => {
      qc.invalidateQueries(['user', 'addresses']);
      toast.success('Başarılı', 'Adres silindi.');
    },
    onError: (err) => {
      toast.error('Hata', err.response?.data?.message || 'Adres silinemedi.');
    }
  });

  // Set default mutation
  const setDefaultMutation = useMutation({
    mutationFn: setDefaultUserAddress,
    onSuccess: () => {
      qc.invalidateQueries(['user', 'addresses']);
      toast.success('Başarılı', 'Varsayılan adres güncellendi.');
    },
    onError: (err) => {
      toast.error('Hata', err.response?.data?.message || 'İşlem başarısız.');
    }
  });

  const resetForm = () => {
    setForm({
      label: 'Ev',
      full_name: '',
      phone: '',
      country: 'Türkiye',
      city: '',
      district: '',
      neighborhood: '',
      address_line: '',
      postal_code: '',
      is_default: false
    });
    setEditingId(null);
    setShowForm(false);
  };

  const editAddress = (address) => {
    setForm({
      label: address.label || 'Ev',
      full_name: address.full_name || '',
      phone: address.phone || '',
      country: address.country || 'Türkiye',
      city: address.city || '',
      district: address.district || '',
      neighborhood: address.neighborhood || '',
      address_line: address.address_line || '',
      postal_code: address.postal_code || '',
      is_default: address.is_default || false
    });
    setEditingId(address.id);
    setShowForm(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      updateMutation.mutate({ id: editingId, data: form });
    } else {
      createMutation.mutate(form);
    }
  };

  const styles = {
    container: {
      fontFamily: '"Inter", sans-serif',
      color: '#1e293b',
    },
    header: {
      marginBottom: '32px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    title: {
      fontSize: '20px',
      fontWeight: '700',
      color: '#1e293b',
    },
    addButton: {
      backgroundColor: '#059669',
      color: 'white',
      border: 'none',
      padding: '10px 20px',
      borderRadius: '10px',
      fontWeight: '600',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      fontSize: '14px',
      transition: 'background 0.2s',
    },
    formCard: {
      backgroundColor: '#f8fafc',
      padding: '24px',
      borderRadius: '16px',
      border: '1px solid #e2e8f0',
      marginBottom: '24px',
    },
    formHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '24px',
    },
    formTitle: {
      fontSize: '16px',
      fontWeight: '700',
      margin: 0,
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      color: '#059669',
    },
    closeButton: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      color: '#64748b',
    },
    label: {
      display: 'block',
      fontSize: '13px',
      fontWeight: '600',
      color: '#475569',
      marginBottom: '6px',
    },
    input: {
      width: '100%',
      padding: '10px 12px 10px 36px',
      borderRadius: '10px',
      border: '1px solid #e2e8f0',
      outline: 'none',
      fontSize: '14px',
      transition: 'all 0.2s',
      backgroundColor: 'white',
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '16px',
      marginBottom: '16px',
    },
    addressCard: {
      backgroundColor: 'white',
      padding: '20px',
      borderRadius: '16px',
      border: '1px solid #e2e8f0',
      marginBottom: '16px',
      position: 'relative',
      transition: 'all 0.2s',
    },
    addressCardDefault: {
      border: '2px solid #059669',
      backgroundColor: '#f0fdf4',
    },
    defaultBadge: {
      position: 'absolute',
      top: '-10px',
      right: '16px',
      backgroundColor: '#059669',
      color: 'white',
      padding: '4px 12px',
      borderRadius: '12px',
      fontSize: '11px',
      fontWeight: '700',
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
    },
    labelBadge: {
      backgroundColor: '#ecfdf5',
      color: '#059669',
      padding: '4px 10px',
      borderRadius: '6px',
      fontSize: '12px',
      fontWeight: '600',
    },
    actionButton: {
      padding: '8px',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
  };

  if (isLoading) {
    return (
      <div style={{ padding: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 200 }}>
        <FaSpinner className="spin" style={{ fontSize: 24, color: '#059669' }} />
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>Teslimat adreslerinizi yönetin.</p>
        </div>
        {!showForm && (
          <button onClick={() => setShowForm(true)} style={styles.addButton}>
            <FaPlus /> Yeni Adres Ekle
          </button>
        )}
      </div>

      {/* Address Form */}
      {showForm && (
        <div style={styles.formCard}>
          <div style={styles.formHeader}>
            <h3 style={styles.formTitle}>
              <FaMapMarkerAlt />
              {editingId ? 'Adresi Düzenle' : 'Yeni Adres Ekle'}
            </h3>
            <button onClick={resetForm} style={styles.closeButton}>
              <FaTimes size={18} />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Adres Etiketi */}
            <div style={{ marginBottom: '16px' }}>
              <label style={styles.label}>Adres Etiketi</label>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                {ADDRESS_LABELS.map(label => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => setForm({...form, label})}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '20px',
                      border: form.label === label ? '2px solid #059669' : '1px solid #e2e8f0',
                      backgroundColor: form.label === label ? '#ecfdf5' : 'white',
                      color: form.label === label ? '#059669' : '#64748b',
                      fontWeight: '600',
                      cursor: 'pointer',
                      fontSize: '13px'
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Alıcı Bilgileri */}
            <div style={styles.grid}>
              <div>
                <label style={styles.label}>Alıcı Adı Soyadı</label>
                <div style={{ position: 'relative' }}>
                  <FaUser style={{ position: 'absolute', left: '12px', top: '10px', color: '#94a3b8' }} />
                  <input 
                    type="text" 
                    value={form.full_name} 
                    onChange={(e) => setForm({...form, full_name: e.target.value})} 
                    style={styles.input} 
                    placeholder="Teslimat alacak kişi"
                    required
                  />
                </div>
              </div>
              <div>
                <label style={styles.label}>Telefon</label>
                <div style={{ position: 'relative' }}>
                  <FaPhone style={{ position: 'absolute', left: '12px', top: '10px', color: '#94a3b8' }} />
                  <input 
                    type="text" 
                    value={form.phone} 
                    onChange={(e) => setForm({...form, phone: e.target.value.replace(/\D/g, '').slice(0, 10)})} 
                    maxLength={10}
                    style={styles.input} 
                    placeholder="5XX XXX XX XX"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Şehir ve İlçe */}
            <div style={styles.grid}>
              <div>
                <label style={styles.label}>İl</label>
                <div style={{ position: 'relative' }}>
                  <FaCity style={{ position: 'absolute', left: '12px', top: '10px', color: '#94a3b8' }} />
                  <select 
                    value={form.city} 
                    onChange={(e) => {
                      const city = e.target.value;
                      const postalCode = city && cityPlateCodes[city] ? cityPlateCodes[city] + '000' : '';
                      setForm({...form, city: city, postal_code: postalCode});
                    }} 
                    style={{ ...styles.input, cursor: 'pointer' }}
                    required
                  >
                    <option value="">İl Seçin</option>
                    {TURKEY_CITIES.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label style={styles.label}>İlçe</label>
                <div style={{ position: 'relative' }}>
                  <FaCity style={{ position: 'absolute', left: '12px', top: '10px', color: '#94a3b8' }} />
                  <input 
                    type="text" 
                    value={form.district} 
                    onChange={(e) => setForm({...form, district: e.target.value})} 
                    style={styles.input} 
                    placeholder="İlçe adı"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Mahalle */}
            <div style={{ marginBottom: '16px' }}>
              <label style={styles.label}>Mahalle</label>
              <div style={{ position: 'relative' }}>
                <FaHome style={{ position: 'absolute', left: '12px', top: '10px', color: '#94a3b8' }} />
                <input 
                  type="text" 
                  value={form.neighborhood} 
                  onChange={(e) => setForm({...form, neighborhood: e.target.value})} 
                  style={styles.input} 
                  placeholder="Mahalle adı"
                  required
                />
              </div>
            </div>

            {/* Açık Adres */}
            <div style={{ marginBottom: '16px' }}>
              <label style={styles.label}>Açık Adres</label>
              <textarea 
                value={form.address_line} 
                onChange={(e) => setForm({...form, address_line: e.target.value})} 
                style={{ ...styles.input, paddingLeft: '12px', minHeight: '80px', resize: 'vertical' }} 
                placeholder="Sokak, cadde, bina no, daire no..."
                required
              />
            </div>

            {/* Posta Kodu */}
            <div style={{ marginBottom: '24px' }}>
              <label style={styles.label}>Posta Kodu (Opsiyonel)</label>
              <input 
                type="text" 
                value={form.postal_code} 
                onChange={(e) => setForm({...form, postal_code: e.target.value})} 
                style={{ ...styles.input, paddingLeft: '12px', maxWidth: '150px' }} 
                placeholder="34000"
              />
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button 
                type="button" 
                onClick={resetForm}
                style={{ 
                  backgroundColor: 'white', color: '#64748b', border: '1px solid #e2e8f0', padding: '10px 24px', 
                  borderRadius: '10px', fontWeight: '600', cursor: 'pointer'
                }}
              >
                İptal
              </button>
              <button 
                type="submit"
                disabled={createMutation.isPending || updateMutation.isPending}
                style={{ 
                  backgroundColor: '#059669', color: 'white', border: 'none', padding: '10px 24px', 
                  borderRadius: '10px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
                  opacity: (createMutation.isPending || updateMutation.isPending) ? 0.7 : 1
                }}
              >
                {(createMutation.isPending || updateMutation.isPending) ? (
                  <><FaSpinner className="spin" /> Kaydediliyor...</>
                ) : (
                  <>{editingId ? 'Güncelle' : 'Adresi Ekle'}</>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Address List */}
      {addresses.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {addresses.map((address) => (
            <div 
              key={address.id} 
              style={{ 
                ...styles.addressCard,
                ...(address.is_default ? styles.addressCardDefault : {})
              }}
            >
              {address.is_default && (
                <div style={styles.defaultBadge}>
                  <FaStar size={10} /> Varsayılan
                </div>
              )}
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <span style={styles.labelBadge}>
                      {address.label}
                    </span>
                    <span style={{ fontWeight: '700', color: '#0f172a' }}>{address.full_name}</span>
                  </div>
                  
                  <p style={{ color: '#64748b', fontSize: '14px', lineHeight: '1.6', margin: '0 0 8px 0' }}>
                    {address.address_line}, {address.neighborhood}, {address.district}/{address.city}
                    {address.postal_code && ` - ${address.postal_code}`}
                  </p>
                  
                  <p style={{ color: '#94a3b8', fontSize: '13px', margin: 0 }}>
                    <FaPhone size={12} style={{ marginRight: '6px' }} />
                    {address.phone}
                  </p>
                </div>
                
                <div style={{ display: 'flex', gap: '8px' }}>
                  {!address.is_default && (
                    <button 
                      onClick={() => setDefaultMutation.mutate(address.id)}
                      title="Varsayılan Yap"
                      style={{ 
                        ...styles.actionButton,
                        backgroundColor: '#f0fdf4', 
                        color: '#16a34a', 
                        gap: '4px',
                        padding: '8px 12px',
                        fontSize: '12px',
                        fontWeight: '600'
                      }}
                    >
                      <FaCheckCircle size={12} /> Varsayılan Yap
                    </button>
                  )}
                  <button 
                    onClick={() => editAddress(address)}
                    title="Düzenle"
                    style={{ ...styles.actionButton, backgroundColor: '#ecfdf5', color: '#059669' }}
                  >
                    <FaEdit />
                  </button>
                  <button 
                    onClick={() => {
                      if (window.confirm('Bu adresi silmek istediğinize emin misiniz?')) {
                        deleteMutation.mutate(address.id);
                      }
                    }}
                    title="Sil"
                    style={{ ...styles.actionButton, backgroundColor: '#fef2f2', color: '#dc2626' }}
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        !showForm && (
          <div style={{ 
            backgroundColor: '#f8fafc', 
            padding: '48px', 
            borderRadius: '24px', 
            border: '2px dashed #e2e8f0', 
            textAlign: 'center' 
          }}>
            <FaMapMarkerAlt size={48} style={{ color: '#cbd5e1', marginBottom: '16px' }} />
            <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#0f172a', marginBottom: '8px' }}>
              Henüz Adres Eklenmemiş
            </h3>
            <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '24px' }}>
              Siparişleriniz için teslimat adresi ekleyin.
            </p>
            <button 
              onClick={() => setShowForm(true)}
              style={styles.addButton}
            >
              <FaPlus /> İlk Adresimi Ekle
            </button>
          </div>
        )
      )}
    </div>
  );
};

export default UserAddresses;
