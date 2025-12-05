import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUserProfile, updateUserProfile, updateUserPassword, uploadUserAvatar, deleteUserAvatar } from '../../features/user/api/userAuthApi';
import { useToast } from '../../components/Toast';
import { useAuth } from '../../context/AuthContext';
import { 
  FaUser, FaSave, FaPhone, FaEnvelope, FaSpinner, FaCamera, FaTimes, 
  FaLock, FaBirthdayCake, FaVenusMars, FaUserCircle, FaCheckCircle,
  FaMapMarkerAlt, FaBoxOpen, FaSignOutAlt, FaShieldAlt, FaIdCard
} from 'react-icons/fa';
import UserAddresses from './UserAddresses';
import UserOrders from './UserOrders';

const UserProfile = () => {
  const qc = useQueryClient();
  const toast = useToast();
  const { refreshUser, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('profile'); // profile, addresses, security, orders
  const [isSaving, setIsSaving] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Form state
  const [form, setForm] = useState({
    name: '',
    phone: '',
    identity_number: '',
    birth_date: '',
    gender: ''
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);

  // Password form
  const [passwordForm, setPasswordForm] = useState({
    current_password: '',
    password: '',
    password_confirmation: ''
  });

  // Fetch user profile
  const { data: profileData, isLoading } = useQuery({
    queryKey: ['user', 'profile'],
    queryFn: getUserProfile
  });

  const user = profileData?.data?.user;

  // Populate form when user data is loaded
  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || '',
        phone: user.phone || '',
        identity_number: user.identity_number || '',
        birth_date: user.birth_date || '',
        gender: user.gender || ''
      });
      if (user.avatar) setAvatarPreview(user.avatar);
    }
  }, [user]);

  // Update profile mutation
  const updateMutation = useMutation({
    mutationFn: (data) => updateUserProfile(data),
    onSuccess: () => {
      qc.invalidateQueries(['user', 'profile']);
      refreshUser();
      toast.success('Başarılı', 'Profil bilgileriniz güncellendi.');
      setIsSaving(false);
    },
    onError: (err) => {
      toast.error('Hata', err.response?.data?.message || 'Güncelleme başarısız.');
      setIsSaving(false);
    }
  });

  // Update password mutation
  const updatePasswordMutation = useMutation({
    mutationFn: (data) => updateUserPassword(data),
    onSuccess: () => {
      toast.success('Başarılı', 'Şifreniz güncellendi.');
      setPasswordForm({ current_password: '', password: '', password_confirmation: '' });
      setIsSaving(false);
    },
    onError: (err) => {
      toast.error('Hata', err.response?.data?.message || 'Şifre güncellenemedi.');
      setIsSaving(false);
    }
  });

  // Avatar upload mutation
  const uploadAvatarMutation = useMutation({
    mutationFn: (file) => uploadUserAvatar(file),
    onSuccess: (res) => {
      qc.invalidateQueries(['user', 'profile']);
      refreshUser();
      setAvatarPreview(res.data?.avatar);
      setAvatarFile(null);
      toast.success('Başarılı', 'Profil fotoğrafı güncellendi.');
    },
    onError: (err) => {
      toast.error('Hata', err.response?.data?.message || 'Fotoğraf yüklenemedi.');
    }
  });

  // Delete avatar mutation
  const deleteAvatarMutation = useMutation({
    mutationFn: () => deleteUserAvatar(),
    onSuccess: () => {
      qc.invalidateQueries(['user', 'profile']);
      refreshUser();
      setAvatarPreview(null);
      toast.success('Başarılı', 'Profil fotoğrafı kaldırıldı.');
    },
    onError: (err) => {
      toast.error('Hata', err.response?.data?.message || 'Fotoğraf kaldırılamadı.');
    }
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      // Preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
      
      // Auto upload
      uploadAvatarMutation.mutate(file);
    }
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    setIsSaving(true);
    updateMutation.mutate(form);
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (passwordForm.password !== passwordForm.password_confirmation) {
      toast.warning('Hata', 'Yeni şifreler eşleşmiyor.');
      return;
    }
    setIsSaving(true);
    updatePasswordMutation.mutate(passwordForm);
  };

  const styles = {
    page: {
      backgroundColor: '#f8fafc',
      minHeight: '100vh',
      fontFamily: '"Inter", sans-serif',
    },
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: isMobile ? '20px 12px' : '40px 20px',
    },
    header: {
      marginBottom: isMobile ? '20px' : '32px',
    },
    title: {
      fontSize: isMobile ? '22px' : '28px',
      fontWeight: '800',
      color: '#1e293b',
      marginBottom: '8px',
    },
    subtitle: {
      color: '#64748b',
      fontSize: isMobile ? '13px' : '15px',
    },
    layout: {
      display: 'flex',
      gap: isMobile ? '16px' : '32px',
      flexDirection: isMobile ? 'column' : 'row',
    },
    sidebar: {
      width: isMobile ? '100%' : '280px',
      flexShrink: 0,
    },
    content: {
      flex: 1,
      backgroundColor: 'white',
      borderRadius: isMobile ? '16px' : '24px',
      padding: isMobile ? '20px' : '32px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
      minHeight: isMobile ? 'auto' : '600px',
    },
    menuItem: {
      display: 'flex',
      alignItems: 'center',
      gap: isMobile ? '10px' : '12px',
      padding: isMobile ? '12px 16px' : '16px 20px',
      borderRadius: isMobile ? '12px' : '16px',
      cursor: 'pointer',
      marginBottom: isMobile ? '4px' : '8px',
      transition: 'all 0.2s',
      fontSize: isMobile ? '13px' : '15px',
      fontWeight: '600',
      color: '#64748b',
    },
    activeMenuItem: {
      backgroundColor: '#ecfdf5',
      color: '#059669',
    },
    sectionTitle: {
      fontSize: isMobile ? '18px' : '20px',
      fontWeight: '700',
      color: '#1e293b',
      marginBottom: isMobile ? '16px' : '24px',
      paddingBottom: isMobile ? '12px' : '16px',
      borderBottom: '1px solid #e2e8f0',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
    },
    formGrid: {
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
      gap: isMobile ? '16px' : '24px',
    },
    inputGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: isMobile ? '6px' : '8px',
    },
    label: {
      fontSize: isMobile ? '12px' : '13px',
      fontWeight: '600',
      color: '#475569',
    },
    input: {
      padding: isMobile ? '10px 14px' : '12px 16px',
      borderRadius: isMobile ? '10px' : '12px',
      border: '1px solid #e2e8f0',
      fontSize: isMobile ? '13px' : '14px',
      color: '#1e293b',
      outline: 'none',
      transition: 'border-color 0.2s',
      backgroundColor: '#f8fafc',
    },
    button: {
      padding: isMobile ? '12px 24px' : '14px 32px',
      backgroundColor: '#059669',
      color: 'white',
      border: 'none',
      borderRadius: isMobile ? '10px' : '12px',
      fontWeight: '600',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      transition: 'background 0.2s',
      marginTop: isMobile ? '16px' : '24px',
      width: isMobile ? '100%' : 'fit-content',
      justifyContent: 'center',
      fontSize: isMobile ? '14px' : '15px',
    },
    avatarSection: {
      display: 'flex',
      flexDirection: isMobile ? 'column' : 'row',
      alignItems: 'center',
      gap: isMobile ? '16px' : '24px',
      marginBottom: isMobile ? '24px' : '32px',
      padding: isMobile ? '16px' : '24px',
      backgroundColor: '#f8fafc',
      borderRadius: '20px',
    },
    avatarWrapper: {
      position: 'relative',
      width: '100px',
      height: '100px',
    },
    avatar: {
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      objectFit: 'cover',
      border: '4px solid white',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    },
    uploadBtn: {
      position: 'absolute',
      bottom: '0',
      right: '0',
      width: '32px',
      height: '32px',
      borderRadius: '50%',
      backgroundColor: '#059669',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      border: '2px solid white',
    },
    userInfo: {
      display: 'flex',
      flexDirection: 'column',
      gap: '4px',
    },
    userName: {
      fontSize: '18px',
      fontWeight: '700',
      color: '#1e293b',
    },
    userEmail: {
      fontSize: '14px',
      color: '#64748b',
    },
  };

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <FaSpinner className="spin" size={40} color="#059669" />
      </div>
    );
  }

  return (
    <>
      <div style={styles.page}>
        <div style={styles.container}>
          <div style={styles.header}>
            <h1 style={styles.title}>Hesabım</h1>
            <p style={styles.subtitle}>Kişisel bilgilerinizi ve siparişlerinizi buradan yönetebilirsiniz.</p>
          </div>

          <div style={styles.layout}>
            {/* Sidebar */}
            <div style={styles.sidebar}>
              <div 
                style={{ ...styles.menuItem, ...(activeTab === 'profile' ? styles.activeMenuItem : {}) }}
                onClick={() => setActiveTab('profile')}
              >
                <FaUser /> Profil Bilgileri
              </div>
              <div 
                style={{ ...styles.menuItem, ...(activeTab === 'addresses' ? styles.activeMenuItem : {}) }}
                onClick={() => setActiveTab('addresses')}
              >
                <FaMapMarkerAlt /> Adreslerim
              </div>
              <div 
                style={{ ...styles.menuItem, ...(activeTab === 'security' ? styles.activeMenuItem : {}) }}
                onClick={() => setActiveTab('security')}
              >
                <FaShieldAlt /> Güvenlik & Şifre
              </div>
              <div 
                style={{ ...styles.menuItem, ...(activeTab === 'orders' ? styles.activeMenuItem : {}) }}
                onClick={() => setActiveTab('orders')}
              >
                <FaBoxOpen /> Siparişlerim
              </div>
              <div 
                style={{ ...styles.menuItem, color: '#ef4444', marginTop: '20px' }}
                onClick={logout}
              >
                <FaSignOutAlt /> Çıkış Yap
              </div>
            </div>

            {/* Content */}
            <div style={styles.content}>
              
              {/* PROFILE TAB */}
              {activeTab === 'profile' && (
                <div>
                  <div style={styles.sectionTitle}>
                    <FaUserCircle color="#059669" /> Profil Bilgileri
                  </div>

                  <div style={styles.avatarSection}>
                    <div style={styles.avatarWrapper}>
                      <img 
                        src={avatarPreview || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=059669&color=fff&size=150`}
                        alt="Avatar" 
                        style={styles.avatar} 
                        onError={(e) => {
                          e.target.onerror = null; 
                          e.target.src = 'https://placehold.co/150?text=User';
                        }}
                      />
                      <label style={styles.uploadBtn}>
                        <FaCamera size={14} />
                        <input type="file" hidden accept="image/*" onChange={handleFileChange} />
                      </label>
                    </div>
                    <div style={styles.userInfo}>
                      <div style={styles.userName}>{user?.name}</div>
                      <div style={styles.userEmail}>{user?.email}</div>
                      {user?.avatar && (
                        <button 
                          onClick={() => deleteAvatarMutation.mutate()}
                          style={{ 
                            background: 'none', border: 'none', color: '#ef4444', 
                            fontSize: '12px', cursor: 'pointer', marginTop: '8px', textAlign: 'left', padding: 0 
                          }}
                        >
                          Fotoğrafı Kaldır
                        </button>
                      )}
                    </div>
                  </div>

                  <form onSubmit={handleProfileSubmit}>
                    <div style={styles.formGrid}>
                      <div style={styles.inputGroup}>
                        <label style={styles.label}>Ad Soyad</label>
                        <div style={{ position: 'relative' }}>
                          <FaUser style={{ position: 'absolute', left: '16px', top: '14px', color: '#94a3b8' }} />
                          <input 
                            type="text" 
                            style={{ ...styles.input, paddingLeft: '44px' }}
                            value={form.name}
                            onChange={(e) => setForm({...form, name: e.target.value})}
                          />
                        </div>
                      </div>

                      <div style={styles.inputGroup}>
                        <label style={styles.label}>Telefon</label>
                        <div style={{ position: 'relative' }}>
                          <FaPhone style={{ position: 'absolute', left: '16px', top: '14px', color: '#94a3b8' }} />
                          <input 
                            type="text" 
                            style={{ ...styles.input, paddingLeft: '44px' }}
                            value={form.phone}
                            onChange={(e) => setForm({...form, phone: e.target.value.replace(/\D/g, '').slice(0, 10)})}
                            maxLength={10}
                            placeholder="5XX XXX XX XX"
                          />
                        </div>
                      </div>

                      <div style={styles.inputGroup}>
                        <label style={styles.label}>
                          TC Kimlik Numarası
                          <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '400', marginLeft: '8px' }}>
                            (Ödeme için zorunlu)
                          </span>
                        </label>
                        <div style={{ position: 'relative' }}>
                          <FaIdCard style={{ position: 'absolute', left: '16px', top: '14px', color: '#94a3b8' }} />
                          <input 
                            type="text" 
                            style={{ 
                              ...styles.input, 
                              paddingLeft: '44px',
                              borderColor: form.identity_number?.length === 11 ? '#059669' : undefined,
                              backgroundColor: form.identity_number?.length === 11 ? '#f0fdf4' : undefined
                            }}
                            value={form.identity_number}
                            onChange={(e) => setForm({...form, identity_number: e.target.value.replace(/\D/g, '').slice(0, 11)})}
                            maxLength={11}
                            placeholder="XXXXXXXXXXX"
                          />
                          {form.identity_number?.length === 11 && (
                            <FaCheckCircle style={{ position: 'absolute', right: '16px', top: '14px', color: '#059669' }} />
                          )}
                        </div>
                        {form.identity_number && form.identity_number.length > 0 && form.identity_number.length < 11 && (
                          <span style={{ fontSize: '11px', color: '#f59e0b', marginTop: '4px', display: 'block' }}>
                            {11 - form.identity_number.length} karakter daha giriniz
                          </span>
                        )}
                      </div>

                      <div style={styles.inputGroup}>
                        <label style={styles.label}>Doğum Tarihi</label>
                        <div style={{ position: 'relative' }}>
                          <FaBirthdayCake style={{ position: 'absolute', left: '16px', top: '14px', color: '#94a3b8' }} />
                          <input 
                            type="date" 
                            style={{ ...styles.input, paddingLeft: '44px' }}
                            value={form.birth_date}
                            onChange={(e) => setForm({...form, birth_date: e.target.value})}
                          />
                        </div>
                      </div>

                      <div style={styles.inputGroup}>
                        <label style={styles.label}>Cinsiyet</label>
                        <div style={{ position: 'relative' }}>
                          <FaVenusMars style={{ position: 'absolute', left: '16px', top: '14px', color: '#94a3b8' }} />
                          <select 
                            style={{ ...styles.input, paddingLeft: '44px', width: '100%' }}
                            value={form.gender}
                            onChange={(e) => setForm({...form, gender: e.target.value})}
                          >
                            <option value="">Seçiniz</option>
                            <option value="male">Erkek</option>
                            <option value="female">Kadın</option>
                            <option value="other">Diğer</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <button type="submit" style={styles.button} disabled={isSaving}>
                      {isSaving ? <FaSpinner className="spin" /> : <FaSave />}
                      Değişiklikleri Kaydet
                    </button>
                  </form>
                </div>
              )}

              {/* ADDRESSES TAB */}
              {activeTab === 'addresses' && (
                <div>
                  <div style={styles.sectionTitle}>
                    <FaMapMarkerAlt color="#059669" /> Adreslerim
                  </div>
                  <UserAddresses />
                </div>
              )}

              {/* SECURITY TAB */}
              {activeTab === 'security' && (
                <div>
                  <div style={styles.sectionTitle}>
                    <FaShieldAlt color="#059669" /> Güvenlik ve Şifre
                  </div>
                  
                  <form onSubmit={handlePasswordSubmit} style={{ maxWidth: '500px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                      <div style={styles.inputGroup}>
                        <label style={styles.label}>Mevcut Şifre</label>
                        <div style={{ position: 'relative' }}>
                          <FaLock style={{ position: 'absolute', left: '16px', top: '14px', color: '#94a3b8' }} />
                          <input 
                            type="password" 
                            style={{ ...styles.input, paddingLeft: '44px' }}
                            value={passwordForm.current_password}
                            onChange={(e) => setPasswordForm({...passwordForm, current_password: e.target.value})}
                          />
                        </div>
                      </div>

                      <div style={styles.inputGroup}>
                        <label style={styles.label}>Yeni Şifre</label>
                        <div style={{ position: 'relative' }}>
                          <FaLock style={{ position: 'absolute', left: '16px', top: '14px', color: '#94a3b8' }} />
                          <input 
                            type="password" 
                            style={{ ...styles.input, paddingLeft: '44px' }}
                            value={passwordForm.password}
                            onChange={(e) => setPasswordForm({...passwordForm, password: e.target.value})}
                          />
                        </div>
                      </div>

                      <div style={styles.inputGroup}>
                        <label style={styles.label}>Yeni Şifre (Tekrar)</label>
                        <div style={{ position: 'relative' }}>
                          <FaCheckCircle style={{ position: 'absolute', left: '16px', top: '14px', color: '#94a3b8' }} />
                          <input 
                            type="password" 
                            style={{ ...styles.input, paddingLeft: '44px' }}
                            value={passwordForm.password_confirmation}
                            onChange={(e) => setPasswordForm({...passwordForm, password_confirmation: e.target.value})}
                          />
                        </div>
                      </div>
                    </div>

                    <button type="submit" style={styles.button} disabled={isSaving}>
                      {isSaving ? <FaSpinner className="spin" /> : <FaSave />}
                      Şifreyi Güncelle
                    </button>
                  </form>
                </div>
              )}

              {/* ORDERS TAB */}
              {activeTab === 'orders' && (
                <div>
                  <UserOrders />
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserProfile;
