import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUserAddresses, deleteUserAddress } from '../features/user/api/userAddressApi';
import { updateUserProfile } from '../features/user/api/userAuthApi';
import { FaTimes, FaMapMarkerAlt, FaCheck, FaChevronDown, FaUser, FaPhone, FaTrash, FaIdCard } from 'react-icons/fa';
import { cities, districts, getNeighborhoods, cityPlateCodes } from '../data/turkeyData';
import { useToast } from './Toast';
import { useAuth } from '../context/AuthContext';
import LocationMap from './LocationMap';

const AddressModal = ({ isOpen, onClose, onSave, initialAddress, onDeleteAddress }) => {
  const { user, refreshUser } = useAuth();
  const [fullName, setFullName] = useState(initialAddress?.full_name || user?.name || '');
  const [phone, setPhone] = useState(initialAddress?.phone || user?.phone || '');
  const [identityNumber, setIdentityNumber] = useState(user?.identity_number || '');
  const [selectedCity, setSelectedCity] = useState(initialAddress?.city || '');
  const [selectedDistrict, setSelectedDistrict] = useState(initialAddress?.district || '');
  const [selectedNeighborhood, setSelectedNeighborhood] = useState(initialAddress?.neighborhood || '');
  const [postalCode, setPostalCode] = useState(initialAddress?.postal_code || '');
  const [addressLine, setAddressLine] = useState(initialAddress?.address_line || '');
  const [addressLabel, setAddressLabel] = useState(initialAddress?.label || 'Ev');
  const [selectedId, setSelectedId] = useState(null);
  const [savingIdentity, setSavingIdentity] = useState(false);
  
  const toast = useToast();
  const queryClient = useQueryClient();

  const { data: addressData } = useQuery({
    queryKey: ['user', 'addresses'],
    queryFn: getUserAddresses,
    enabled: !!user && isOpen,
  });

  // Adres silme mutation
  const deleteAddressMutation = useMutation({
    mutationFn: deleteUserAddress,
    onSuccess: () => {
      queryClient.invalidateQueries(['user', 'addresses']);
      toast.success('Adres Silindi', 'Adres başarıyla silindi.');
      // Formu temizle
      setSelectedId(null);
      setFullName(user?.name || '');
      setPhone(user?.phone || '');
      setSelectedCity('');
      setSelectedDistrict('');
      setSelectedNeighborhood('');
      setPostalCode('');
      setAddressLine('');
      setAddressLabel('Ev');
    },
    onError: (error) => {
      console.error('Adres silme hatası:', error);
      toast.error('Hata', 'Adres silinirken bir sorun oluştu.');
    }
  });

  const handleDeleteAddress = (e, addressId) => {
    e.stopPropagation();
    // Dışarıdaki ConfirmModal'ı tetikle
    if (onDeleteAddress) {
      onDeleteAddress(addressId);
    }
  };

  const savedAddresses = addressData?.data?.addresses || [];

  const handleSelectAddress = (addr) => {
    setSelectedId(addr.id);
    setFullName(addr.full_name);
    setPhone(addr.phone);
    setSelectedCity(addr.city);
    setSelectedDistrict(addr.district);
    setSelectedNeighborhood(addr.neighborhood);
    setPostalCode(addr.postal_code || '');
    setAddressLine(addr.address_line);
    setAddressLabel(addr.label);
    toast.success('Adres Seçildi', 'Kayıtlı adres bilgileri forma dolduruldu.');
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      if (!initialAddress && user) {
        setFullName(user.name || '');
        setPhone(user.phone || '');
        setIdentityNumber(user.identity_number || '');
      }
      if (initialAddress?.postal_code) {
        setPostalCode(initialAddress.postal_code);
      }
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, user, initialAddress]);

  if (!isOpen) return null;

  const handleSave = async () => {
    if (!fullName || !phone || !selectedCity || !selectedDistrict || !selectedNeighborhood || !addressLine) {
      toast.warning('Eksik Bilgi', 'Lütfen tüm alanları doldurunuz.');
      return;
    }

    // TC Kimlik numarası kontrolü (ödeme için gerekli)
    if (!identityNumber || identityNumber.length !== 11) {
      toast.warning('TC Kimlik Numarası', 'Ödeme yapabilmek için geçerli bir TC Kimlik numarası girmeniz gerekmektedir.');
      return;
    }

    // TC Kimlik numarasını kullanıcı profiline kaydet
    if (identityNumber !== user?.identity_number) {
      try {
        setSavingIdentity(true);
        await updateUserProfile({ identity_number: identityNumber });
        if (refreshUser) {
          await refreshUser();
        }
        toast.success('TC Kimlik Kaydedildi', 'TC Kimlik numaranız başarıyla güncellendi.');
      } catch (error) {
        console.error('TC Kimlik kaydetme hatası:', error);
        toast.error('Hata', 'TC Kimlik numarası kaydedilirken bir sorun oluştu.');
        setSavingIdentity(false);
        return;
      }
      setSavingIdentity(false);
    }
    
    const fullAddress = {
      id: selectedId,
      full_name: fullName,
      phone: phone,
      city: selectedCity,
      district: selectedDistrict,
      neighborhood: selectedNeighborhood,
      address_line: addressLine,
      label: addressLabel,
      country: 'Türkiye',
      postal_code: postalCode,
      is_default: initialAddress?.is_default || false
    };
    
    onSave(fullAddress);
    onClose();
  };

  const handleCityChange = (e) => {
    setSelectedId(null);
    const city = e.target.value;
    setSelectedCity(city);
    setSelectedDistrict('');
    setSelectedNeighborhood('');
    
    if (city && cityPlateCodes[city]) {
      setPostalCode(cityPlateCodes[city] + '000');
    } else {
      setPostalCode('');
    }
  };

  const handleDistrictChange = (e) => {
    setSelectedId(null);
    setSelectedDistrict(e.target.value);
    setSelectedNeighborhood('');
  };

  const styles = {
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2000,
      backdropFilter: 'blur(4px)',
    },
    modal: {
      backgroundColor: 'white',
      width: '95%',
      maxWidth: '1100px',
      height: 'auto',
      maxHeight: '90vh',
      borderRadius: '24px',
      boxShadow: 'rgba(0, 0, 0, 0.25) 0px 25px 50px -12px',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      position: 'relative',
    },
    header: {
      padding: '24px',
      borderBottom: '1px solid rgb(226, 232, 240)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: 'rgb(248, 250, 252)',
    },
    title: {
      fontSize: '20px',
      fontWeight: '700',
      color: 'rgb(30, 41, 59)',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
    },
    iconWrapper: {
      width: '32px',
      height: '32px',
      borderRadius: '8px',
      backgroundColor: 'rgb(236, 253, 245)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'rgb(5, 150, 105)',
    },
    closeButton: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      color: 'rgb(100, 116, 139)',
      fontSize: '20px',
      padding: '8px',
      borderRadius: '50%',
      transition: 'background 0.2s',
    },
    content: {
      padding: '32px',
      overflowY: 'auto',
      display: 'flex',
      gap: '32px',
      flexDirection: 'row',
    },
    formColumn: {
      flex: '1',
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
      minWidth: '350px',
    },
    mapColumn: {
      flex: '1',
      backgroundColor: 'rgb(241, 245, 249)',
      borderRadius: '16px',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      minHeight: '400px',
      minWidth: '350px',
    },
    inputGroup: {
      position: 'relative',
    },
    label: {
      fontSize: '13px',
      fontWeight: '600',
      color: 'rgb(71, 85, 105)',
      marginBottom: '8px',
      display: 'block',
    },
    input: {
      width: '100%',
      padding: '14px 16px',
      backgroundColor: 'white',
      border: '1px solid rgb(226, 232, 240)',
      borderRadius: '12px',
      fontSize: '14px',
      color: 'rgb(30, 41, 59)',
      outline: 'none',
      transition: '0.2s',
    },
    select: {
      width: '100%',
      padding: '14px 16px',
      backgroundColor: 'white',
      border: '1px solid rgb(226, 232, 240)',
      borderRadius: '12px',
      fontSize: '14px',
      color: 'rgb(30, 41, 59)',
      outline: 'none',
      cursor: 'pointer',
      appearance: 'none',
    },
    textarea: {
      width: '100%',
      padding: '16px',
      border: '1px solid rgb(226, 232, 240)',
      borderRadius: '12px',
      fontSize: '14px',
      minHeight: '100px',
      resize: 'vertical',
      outline: 'none',
      fontFamily: 'inherit',
    },
    labelOptions: {
      display: 'flex',
      gap: '8px',
      marginTop: '8px',
    },
    labelOption: (isActive) => ({
      padding: '6px 12px',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: '600',
      cursor: 'pointer',
      border: isActive ? '1px solid rgb(5, 150, 105)' : '1px solid rgb(226, 232, 240)',
      backgroundColor: isActive ? 'rgb(236, 253, 245)' : 'white',
      color: isActive ? 'rgb(5, 150, 105)' : 'rgb(100, 116, 139)',
      transition: 'all 0.2s',
    }),
    footer: {
      padding: '24px',
      borderTop: '1px solid rgb(226, 232, 240)',
      display: 'flex',
      justifyContent: 'flex-end',
      gap: '12px',
      backgroundColor: 'rgb(248, 250, 252)',
    },
    cancelButton: {
      padding: '12px 24px',
      borderRadius: '12px',
      border: '1px solid rgb(203, 213, 225)',
      backgroundColor: 'white',
      color: 'rgb(71, 85, 105)',
      fontWeight: '600',
      cursor: 'pointer',
    },
    saveButton: {
      padding: '12px 32px',
      borderRadius: '12px',
      border: 'none',
      backgroundColor: 'rgb(5, 150, 105)',
      color: 'white',
      fontWeight: '600',
      cursor: 'pointer',
      boxShadow: 'rgba(5, 150, 105, 0.2) 0px 4px 6px -1px',
    },
    mapPlaceholder: {
      flex: '1 1 0%',
      backgroundColor: 'rgb(226, 232, 240)',
      borderRadius: '12px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'rgb(100, 116, 139)',
      fontSize: '14px',
      flexDirection: 'column',
      gap: '12px',
      backgroundImage: 'url("https://maps.googleapis.com/maps/api/staticmap?center=Turkey&zoom=5&size=400x300&sensor=false")',
      backgroundSize: 'cover',
      backgroundPosition: 'center center',
      position: 'relative',
    },
    mapOverlay: {
      position: 'absolute',
      inset: 0,
      backgroundColor: 'rgba(255, 255, 255, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      gap: '8px',
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.title}>
            <div style={styles.iconWrapper}>
              <FaMapMarkerAlt />
            </div>
            {initialAddress ? 'Adresi Düzenle' : 'Teslimat Adresi Ekle'}
          </div>
          <button style={styles.closeButton} onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        {/* Content */}
        <div style={styles.content}>
          {/* Form Column */}
          <div style={styles.formColumn}>
            
            {/* Saved Addresses Section */}
            {user && savedAddresses && savedAddresses.length > 0 && (
              <div style={{ marginBottom: '8px' }}>
                <label style={styles.label}>Kayıtlı Adreslerimden Seç</label>
                <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '8px', scrollbarWidth: 'thin' }}>
                  {savedAddresses.map((addr) => (
                    <div 
                      key={addr.id}
                      onClick={() => handleSelectAddress(addr)}
                      style={{
                        minWidth: '180px',
                        padding: '12px',
                        border: '1px solid #e2e8f0',
                        borderRadius: '12px',
                        cursor: 'pointer',
                        backgroundColor: '#f8fafc',
                        fontSize: '12px',
                        transition: 'all 0.2s',
                        flexShrink: 0,
                        position: 'relative'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = '#059669';
                        e.currentTarget.style.backgroundColor = '#ecfdf5';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = '#e2e8f0';
                        e.currentTarget.style.backgroundColor = '#f8fafc';
                      }}
                    >
                      {/* Silme Butonu */}
                      <button
                        onClick={(e) => handleDeleteAddress(e, addr.id)}
                        disabled={deleteAddressMutation.isPending}
                        style={{
                          position: 'absolute',
                          top: '6px',
                          right: '6px',
                          width: '22px',
                          height: '22px',
                          borderRadius: '50%',
                          border: 'none',
                          backgroundColor: '#fee2e2',
                          color: '#dc2626',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '10px',
                          opacity: deleteAddressMutation.isPending ? 0.5 : 1,
                        }}
                        title="Adresi Sil"
                      >
                        <FaTrash />
                      </button>
                      <div style={{ fontWeight: '700', marginBottom: '4px', color: '#334155', paddingRight: '20px' }}>{addr.label}</div>
                      <div style={{ color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {addr.city} / {addr.district}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Name & Phone Row */}
            <div style={{ display: 'flex', gap: '16px' }}>
              <div style={{ ...styles.inputGroup, flex: 1 }}>
                <label style={styles.label}>Ad Soyad</label>
                <div style={{ position: 'relative' }}>
                  <FaUser style={{ position: 'absolute', left: '12px', top: '14px', color: '#94a3b8', fontSize: '12px' }} />
                  <input 
                    type="text" 
                    style={{ ...styles.input, paddingLeft: '32px' }}
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Ad Soyad"
                  />
                </div>
              </div>
              <div style={{ ...styles.inputGroup, flex: 1 }}>
                <label style={styles.label}>Telefon</label>
                <div style={{ position: 'relative' }}>
                  <FaPhone style={{ position: 'absolute', left: '12px', top: '14px', color: '#94a3b8', fontSize: '12px' }} />
                  <input 
                    type="text" 
                    style={{ ...styles.input, paddingLeft: '32px' }}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    maxLength={10}
                    placeholder="5XX XXX XX XX"
                  />
                </div>
              </div>
            </div>

            {/* TC Kimlik Numarası */}
            <div style={styles.inputGroup}>
              <label style={styles.label}>
                TC Kimlik Numarası 
                <span style={{ color: '#dc2626', marginLeft: '4px' }}>*</span>
                <span style={{ fontWeight: '400', color: '#94a3b8', marginLeft: '8px', fontSize: '11px' }}>
                  (Ödeme için zorunlu)
                </span>
              </label>
              <div style={{ position: 'relative' }}>
                <FaIdCard style={{ position: 'absolute', left: '12px', top: '14px', color: '#94a3b8', fontSize: '14px' }} />
                <input 
                  type="text" 
                  style={{ 
                    ...styles.input, 
                    paddingLeft: '36px',
                    borderColor: identityNumber && identityNumber.length === 11 ? '#059669' : undefined,
                    backgroundColor: identityNumber && identityNumber.length === 11 ? '#f0fdf4' : undefined
                  }}
                  value={identityNumber}
                  onChange={(e) => setIdentityNumber(e.target.value.replace(/\D/g, '').slice(0, 11))}
                  maxLength={11}
                  placeholder="XXXXXXXXXXX"
                />
                {identityNumber && identityNumber.length === 11 && (
                  <FaCheck style={{ position: 'absolute', right: '12px', top: '14px', color: '#059669', fontSize: '14px' }} />
                )}
              </div>
              {identityNumber && identityNumber.length > 0 && identityNumber.length < 11 && (
                <span style={{ fontSize: '11px', color: '#f59e0b', marginTop: '4px', display: 'block' }}>
                  {11 - identityNumber.length} karakter daha giriniz
                </span>
              )}
            </div>

            {/* City */}
            <div style={styles.inputGroup}>
              <label style={styles.label}>İl Seçiniz</label>
              <div style={{ position: 'relative' }}>
                <select 
                  style={styles.select} 
                  value={selectedCity} 
                  onChange={handleCityChange}
                >
                  <option value="">Seçiniz</option>
                  {cities.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
                <FaChevronDown style={{ position: 'absolute', right: '16px', top: '16px', color: '#94a3b8', pointerEvents: 'none' }} size={12} />
              </div>
            </div>

            {/* District */}
            <div style={styles.inputGroup}>
              <label style={styles.label}>İlçe Seçiniz</label>
              <div style={{ position: 'relative' }}>
                <select 
                  style={{ ...styles.select, opacity: selectedCity ? 1 : 0.6 }} 
                  value={selectedDistrict} 
                  onChange={handleDistrictChange}
                  disabled={!selectedCity}
                >
                  <option value="">Seçiniz</option>
                  {selectedCity && districts[selectedCity]?.map(dist => (
                    <option key={dist} value={dist}>{dist}</option>
                  ))}
                </select>
                <FaChevronDown style={{ position: 'absolute', right: '16px', top: '16px', color: '#94a3b8', pointerEvents: 'none' }} size={12} />
              </div>
            </div>

            {/* Neighborhood */}
            <div style={styles.inputGroup}>
              <label style={styles.label}>Mahalle Seçiniz</label>
              <div style={{ position: 'relative' }}>
                <select 
                  style={{ ...styles.select, opacity: selectedDistrict ? 1 : 0.6 }} 
                  value={selectedNeighborhood} 
                  onChange={(e) => setSelectedNeighborhood(e.target.value)}
                  disabled={!selectedDistrict}
                >
                  <option value="">Seçiniz</option>
                  {selectedDistrict && getNeighborhoods(selectedDistrict).map(n => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
                <FaChevronDown style={{ position: 'absolute', right: '16px', top: '16px', color: '#94a3b8', pointerEvents: 'none' }} size={12} />
              </div>
            </div>

            {/* Postal Code */}
            <div style={styles.inputGroup}>
              <label style={styles.label}>Posta Kodu</label>
              <input 
                type="text" 
                style={styles.input}
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                placeholder="34000"
              />
            </div>

            {/* Address Line */}
            <div style={styles.inputGroup}>
              <label style={styles.label}>Açık Adres (Cadde, Sokak, Kapı No vb.)</label>
              <textarea 
                style={styles.textarea}
                value={addressLine}
                onChange={(e) => setAddressLine(e.target.value)}
                placeholder="Örn: Atatürk Cad. Lale Sok. No:5 D:3"
              />
            </div>

            {/* Label */}
            <div style={styles.inputGroup}>
              <label style={styles.label}>Adres Başlığı</label>
              <div style={styles.labelOptions}>
                {['Ev', 'İş', 'Diğer'].map(label => (
                  <div 
                    key={label}
                    style={styles.labelOption(addressLabel === label)}
                    onClick={() => setAddressLabel(label)}
                  >
                    {label}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Map Column */}
          <div style={styles.mapColumn}>
            <div style={{ flex: 1, borderRadius: '12px', overflow: 'hidden', minHeight: '300px', position: 'relative', zIndex: 0 }}>
              <LocationMap 
                city={selectedCity} 
                district={selectedDistrict} 
                neighborhood={selectedNeighborhood}
                onLocationSelect={(latlng) => {
                  // Optional: You can store coordinates if backend supports it
                  console.log('Selected location:', latlng);
                }}
              />
            </div>
            <div style={{ fontSize: '13px', color: 'rgb(100, 116, 139)', lineHeight: '1.5' }}>
              <strong>Seçilen Konum:</strong><br />
              {selectedNeighborhood ? `${selectedNeighborhood}, ` : ''}
              {selectedDistrict ? `${selectedDistrict}/` : ''}
              {selectedCity || '-'}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={styles.footer}>
          <button style={styles.cancelButton} onClick={onClose} disabled={savingIdentity}>Vazgeç</button>
          <button 
            style={{ 
              ...styles.saveButton, 
              opacity: savingIdentity ? 0.7 : 1,
              cursor: savingIdentity ? 'not-allowed' : 'pointer'
            }} 
            onClick={handleSave}
            disabled={savingIdentity}
          >
            {savingIdentity ? 'Kaydediliyor...' : 'Adresi Kaydet'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddressModal;
