import React, { useState, useEffect } from 'react';
import { FaTimes, FaMapMarkerAlt, FaSearch, FaCheck, FaChevronDown } from 'react-icons/fa';
import { cities, districts, getNeighborhoods } from '../data/turkeyData';
import { useToast } from './Toast';

const AddressModal = ({ isOpen, onClose, onSave, initialAddress }) => {
  const [step, setStep] = useState(1); // 1: İl/İlçe Seçimi, 2: Detaylar
  const [selectedCity, setSelectedCity] = useState(initialAddress?.city || '');
  const [selectedDistrict, setSelectedDistrict] = useState(initialAddress?.district || '');
  const [selectedNeighborhood, setSelectedNeighborhood] = useState(initialAddress?.neighborhood || '');
  const [openAddress, setOpenAddress] = useState(initialAddress?.openAddress || '');
  const [addressTitle, setAddressTitle] = useState(initialAddress?.title || 'Ev');
  
  const [searchTerm, setSearchTerm] = useState('');
  const [activeDropdown, setActiveDropdown] = useState(null); // 'city', 'district', 'neighborhood'

  const toast = useToast();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (!selectedCity || !selectedDistrict || !selectedNeighborhood || !openAddress) {
      toast.warning('Eksik Bilgi', 'Lütfen tüm alanları doldurunuz.');
      return;
    }
    
    const fullAddress = {
      city: selectedCity,
      district: selectedDistrict,
      neighborhood: selectedNeighborhood,
      openAddress,
      title: addressTitle
    };
    
    onSave(fullAddress);
    onClose();
  };

  const filteredCities = cities.filter(c => c.toLowerCase().includes(searchTerm.toLowerCase()));
  const currentDistricts = districts[selectedCity] || ["Merkez", "Diğer"]; // Fallback
  const filteredDistricts = currentDistricts.filter(d => d.toLowerCase().includes(searchTerm.toLowerCase()));
  const currentNeighborhoods = getNeighborhoods(selectedDistrict);
  const filteredNeighborhoods = currentNeighborhoods.filter(n => n.toLowerCase().includes(searchTerm.toLowerCase()));

  const styles = {
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.6)',
      backdropFilter: 'blur(8px)',
      zIndex: 2000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      animation: 'fadeIn 0.2s ease-out',
    },
    modal: {
      backgroundColor: 'white',
      width: '90%',
      maxWidth: '800px',
      height: 'auto',
      maxHeight: '90vh',
      borderRadius: '24px',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      position: 'relative',
    },
    header: {
      padding: '24px',
      borderBottom: '1px solid #e2e8f0',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: '#f8fafc',
    },
    title: {
      fontSize: '20px',
      fontWeight: '700',
      color: '#1e293b',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
    },
    closeBtn: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      color: '#64748b',
      fontSize: '20px',
      padding: '8px',
      borderRadius: '50%',
      transition: 'background 0.2s',
    },
    body: {
      padding: '32px',
      overflowY: 'auto',
      display: 'flex',
      gap: '32px',
    },
    leftCol: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
    },
    rightCol: {
      flex: 1,
      backgroundColor: '#f1f5f9',
      borderRadius: '16px',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      minHeight: '300px',
    },
    label: {
      fontSize: '13px',
      fontWeight: '600',
      color: '#475569',
      marginBottom: '8px',
      display: 'block',
    },
    inputGroup: {
      position: 'relative',
    },
    selectBtn: {
      width: '100%',
      padding: '14px 16px',
      backgroundColor: 'white',
      border: '1px solid #e2e8f0',
      borderRadius: '12px',
      textAlign: 'left',
      fontSize: '14px',
      color: '#1e293b',
      cursor: 'pointer',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      transition: 'all 0.2s',
    },
    dropdown: {
      position: 'absolute',
      top: '100%',
      left: 0,
      right: 0,
      backgroundColor: 'white',
      border: '1px solid #e2e8f0',
      borderRadius: '12px',
      marginTop: '8px',
      maxHeight: '240px',
      overflowY: 'auto',
      zIndex: 10,
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      padding: '8px',
    },
    searchInput: {
      width: '100%',
      padding: '10px',
      border: '1px solid #e2e8f0',
      borderRadius: '8px',
      marginBottom: '8px',
      fontSize: '13px',
      outline: 'none',
    },
    option: {
      padding: '10px 12px',
      cursor: 'pointer',
      borderRadius: '8px',
      fontSize: '14px',
      color: '#334155',
      transition: 'background 0.1s',
    },
    textArea: {
      width: '100%',
      padding: '16px',
      border: '1px solid #e2e8f0',
      borderRadius: '12px',
      fontSize: '14px',
      minHeight: '120px',
      resize: 'vertical',
      outline: 'none',
      fontFamily: 'inherit',
    },
    mapPlaceholder: {
      flex: 1,
      backgroundColor: '#e2e8f0',
      borderRadius: '12px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#64748b',
      fontSize: '14px',
      flexDirection: 'column',
      gap: '12px',
      backgroundImage: 'url("https://maps.googleapis.com/maps/api/staticmap?center=Turkey&zoom=5&size=400x300&sensor=false")', // Fake URL for visual
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      position: 'relative',
    },
    mapOverlay: {
      position: 'absolute',
      inset: 0,
      backgroundColor: 'rgba(255,255,255,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      gap: '8px',
    },
    footer: {
      padding: '24px',
      borderTop: '1px solid #e2e8f0',
      display: 'flex',
      justifyContent: 'flex-end',
      gap: '12px',
      backgroundColor: '#f8fafc',
    },
    btnSecondary: {
      padding: '12px 24px',
      borderRadius: '12px',
      border: '1px solid #cbd5e1',
      backgroundColor: 'white',
      color: '#475569',
      fontWeight: '600',
      cursor: 'pointer',
    },
    btnPrimary: {
      padding: '12px 32px',
      borderRadius: '12px',
      border: 'none',
      backgroundColor: '#059669',
      color: 'white',
      fontWeight: '600',
      cursor: 'pointer',
      boxShadow: '0 4px 6px -1px rgba(5, 150, 105, 0.2)',
    },
    tagContainer: {
      display: 'flex',
      gap: '8px',
      marginTop: '8px',
    },
    tag: {
      padding: '6px 12px',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: '600',
      cursor: 'pointer',
      border: '1px solid',
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <div style={styles.header}>
          <div style={styles.title}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#ecfdf5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#059669' }}>
              <FaMapMarkerAlt />
            </div>
            Teslimat Adresi Ekle
          </div>
          <button style={styles.closeBtn} onClick={onClose}><FaTimes /></button>
        </div>

        <div style={styles.body}>
          {/* Sol Kolon: Form */}
          <div style={styles.leftCol}>
            
            {/* İl Seçimi */}
            <div style={styles.inputGroup}>
              <label style={styles.label}>İl Seçiniz</label>
              <div 
                style={styles.selectBtn} 
                onClick={() => { setActiveDropdown(activeDropdown === 'city' ? null : 'city'); setSearchTerm(''); }}
              >
                {selectedCity || 'İl Seçiniz'}
                <FaChevronDown size={12} color="#94a3b8" />
              </div>
              
              {activeDropdown === 'city' && (
                <div style={styles.dropdown}>
                  <div style={{ padding: '0 8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0 8px', marginBottom: '8px' }}>
                      <FaSearch color="#cbd5e1" />
                      <input 
                        autoFocus
                        type="text" 
                        placeholder="İl ara..." 
                        style={{ ...styles.searchInput, border: 'none', marginBottom: 0 }}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                  {filteredCities.map(city => (
                    <div 
                      key={city} 
                      style={{ ...styles.option, backgroundColor: selectedCity === city ? '#f1f5f9' : 'transparent' }}
                      onClick={() => {
                        setSelectedCity(city);
                        setSelectedDistrict('');
                        setSelectedNeighborhood('');
                        setActiveDropdown(null);
                      }}
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#f8fafc'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = selectedCity === city ? '#f1f5f9' : 'transparent'}
                    >
                      {city}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* İlçe Seçimi */}
            <div style={styles.inputGroup}>
              <label style={styles.label}>İlçe Seçiniz</label>
              <div 
                style={{ ...styles.selectBtn, opacity: !selectedCity ? 0.5 : 1, cursor: !selectedCity ? 'not-allowed' : 'pointer' }}
                onClick={() => { if(selectedCity) { setActiveDropdown(activeDropdown === 'district' ? null : 'district'); setSearchTerm(''); } }}
              >
                {selectedDistrict || 'İlçe Seçiniz'}
                <FaChevronDown size={12} color="#94a3b8" />
              </div>

              {activeDropdown === 'district' && (
                <div style={styles.dropdown}>
                   <div style={{ padding: '0 8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0 8px', marginBottom: '8px' }}>
                      <FaSearch color="#cbd5e1" />
                      <input 
                        autoFocus
                        type="text" 
                        placeholder="İlçe ara..." 
                        style={{ ...styles.searchInput, border: 'none', marginBottom: 0 }}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                  {filteredDistricts.map(district => (
                    <div 
                      key={district} 
                      style={{ ...styles.option, backgroundColor: selectedDistrict === district ? '#f1f5f9' : 'transparent' }}
                      onClick={() => {
                        setSelectedDistrict(district);
                        setSelectedNeighborhood('');
                        setActiveDropdown(null);
                      }}
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#f8fafc'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = selectedDistrict === district ? '#f1f5f9' : 'transparent'}
                    >
                      {district}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Mahalle Seçimi */}
            <div style={styles.inputGroup}>
              <label style={styles.label}>Mahalle Seçiniz</label>
              <div 
                style={{ ...styles.selectBtn, opacity: !selectedDistrict ? 0.5 : 1, cursor: !selectedDistrict ? 'not-allowed' : 'pointer' }}
                onClick={() => { if(selectedDistrict) { setActiveDropdown(activeDropdown === 'neighborhood' ? null : 'neighborhood'); setSearchTerm(''); } }}
              >
                {selectedNeighborhood || 'Mahalle Seçiniz'}
                <FaChevronDown size={12} color="#94a3b8" />
              </div>

              {activeDropdown === 'neighborhood' && (
                <div style={styles.dropdown}>
                   <div style={{ padding: '0 8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0 8px', marginBottom: '8px' }}>
                      <FaSearch color="#cbd5e1" />
                      <input 
                        autoFocus
                        type="text" 
                        placeholder="Mahalle ara..." 
                        style={{ ...styles.searchInput, border: 'none', marginBottom: 0 }}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                  {filteredNeighborhoods.map(neighborhood => (
                    <div 
                      key={neighborhood} 
                      style={{ ...styles.option, backgroundColor: selectedNeighborhood === neighborhood ? '#f1f5f9' : 'transparent' }}
                      onClick={() => {
                        setSelectedNeighborhood(neighborhood);
                        setActiveDropdown(null);
                      }}
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#f8fafc'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = selectedNeighborhood === neighborhood ? '#f1f5f9' : 'transparent'}
                    >
                      {neighborhood}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Açık Adres */}
            <div style={styles.inputGroup}>
              <label style={styles.label}>Açık Adres (Cadde, Sokak, Kapı No vb.)</label>
              <textarea 
                style={styles.textArea} 
                placeholder="Örn: Atatürk Cad. Lale Sok. No:5 D:3"
                value={openAddress}
                onChange={(e) => setOpenAddress(e.target.value)}
              />
            </div>

            {/* Adres Başlığı */}
            <div style={styles.inputGroup}>
              <label style={styles.label}>Adres Başlığı</label>
              <div style={styles.tagContainer}>
                {['Ev', 'İş', 'Diğer'].map(tag => (
                  <div 
                    key={tag}
                    style={{ 
                      ...styles.tag, 
                      backgroundColor: addressTitle === tag ? '#ecfdf5' : 'white',
                      borderColor: addressTitle === tag ? '#059669' : '#e2e8f0',
                      color: addressTitle === tag ? '#059669' : '#64748b'
                    }}
                    onClick={() => setAddressTitle(tag)}
                  >
                    {tag}
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Sağ Kolon: Harita & Özet */}
          <div style={styles.rightCol}>
            <div style={styles.mapPlaceholder}>
              <div style={styles.mapOverlay}>
                <FaMapMarkerAlt size={32} color="#ef4444" />
                <span style={{ fontWeight: '600', color: '#1e293b' }}>Konum İşaretle</span>
                <span style={{ fontSize: '12px', textAlign: 'center', maxWidth: '200px' }}>
                  Tam konumu harita üzerinden seçerek kuryenin sizi daha kolay bulmasını sağlayın.
                </span>
              </div>
            </div>
            <div style={{ fontSize: '13px', color: '#64748b', lineHeight: '1.5' }}>
              <strong>Seçilen Konum:</strong><br/>
              {selectedCity ? `${selectedNeighborhood}, ${selectedDistrict}/${selectedCity}` : 'Henüz seçim yapılmadı'}
            </div>
          </div>
        </div>

        <div style={styles.footer}>
          <button style={styles.btnSecondary} onClick={onClose}>Vazgeç</button>
          <button style={styles.btnPrimary} onClick={handleSave}>Adresi Kaydet</button>
        </div>
      </div>
    </div>
  );
};

export default AddressModal;
