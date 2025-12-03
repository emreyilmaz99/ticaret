import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUserProfile, updateUserProfile, updateUserPassword, uploadUserAvatar, deleteUserAvatar } from '../../features/user/api/userAuthApi';
import { useToast } from '../../components/Toast';
import { useAuth } from '../../context/AuthContext';
import { FaUser, FaSave, FaPhone, FaEnvelope, FaSpinner, FaCamera, FaTimes, FaLock, FaBirthdayCake, FaVenusMars, FaUserCircle, FaCheckCircle } from 'react-icons/fa';

const UserProfile = () => {
  const qc = useQueryClient();
  const toast = useToast();
  const { refreshUser } = useAuth();
  const [activeTab, setActiveTab] = useState('general');
  const [isSaving, setIsSaving] = useState(false);
  
  // Form state
  const [form, setForm] = useState({
    name: '',
    phone: '',
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
      toast.success('Başarılı', 'Profil fotoğrafı silindi.');
    },
    onError: (err) => {
      toast.error('Hata', err.response?.data?.message || 'Fotoğraf silinemedi.');
    }
  });

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error('Hata', 'Dosya boyutu 2MB\'dan küçük olmalı.');
        return;
      }
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setAvatarPreview(reader.result);
      reader.readAsDataURL(file);
      // Auto upload
      uploadAvatarMutation.mutate(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSaving(true);
    updateMutation.mutate(form);
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (passwordForm.password !== passwordForm.password_confirmation) {
      toast.error('Hata', 'Yeni şifreler eşleşmiyor.');
      return;
    }
    if (passwordForm.password.length < 8) {
      toast.error('Hata', 'Şifre en az 8 karakter olmalı.');
      return;
    }
    setIsSaving(true);
    updatePasswordMutation.mutate(passwordForm);
  };

  if (isLoading) {
    return (
      <div style={{ padding: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 400 }}>
        <FaSpinner className="spin" style={{ fontSize: 32, color: '#64748b' }} />
        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } } .spin { animation: spin 1s linear infinite; }`}</style>
      </div>
    );
  }

  const tabStyle = (isActive) => ({
    padding: '0 0 16px 0',
    border: 'none',
    background: 'none',
    borderBottom: isActive ? '2px solid #1e40af' : '2px solid transparent',
    color: isActive ? '#1e40af' : '#64748b',
    fontWeight: isActive ? '600' : '500',
    cursor: 'pointer',
    fontSize: '14px'
  });

  const inputStyle = {
    width: '100%',
    padding: '12px 12px 12px 40px',
    borderRadius: '10px',
    border: '1px solid #e2e8f0',
    outline: 'none',
    fontSize: '14px',
    transition: 'all 0.2s'
  };

  const labelStyle = {
    display: 'block',
    fontSize: '14px',
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: '8px'
  };

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", color: '#1e293b', maxWidth: '900px' }}>
      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .spin { animation: spin 1s linear infinite; }
      `}</style>
      
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.5px' }}>Profil Bilgilerim</h1>
        <p style={{ color: '#64748b', fontSize: '14px', marginTop: '4px' }}>Hesap bilgilerinizi görüntüleyin ve güncelleyin.</p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '24px', borderBottom: '1px solid #e2e8f0', marginBottom: '32px' }}>
        <button onClick={() => setActiveTab('general')} style={tabStyle(activeTab === 'general')}>Genel Bilgiler</button>
        <button onClick={() => setActiveTab('password')} style={tabStyle(activeTab === 'password')}>Şifre Değiştir</button>
      </div>

      {/* General Tab */}
      {activeTab === 'general' && (
        <form onSubmit={handleSubmit}>
          <div style={{ backgroundColor: 'white', padding: '32px', borderRadius: '24px', border: '1px solid #f1f5f9', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.02)' }}>
            
            {/* Avatar Upload */}
            <div style={{ marginBottom: '32px' }}>
              <label style={labelStyle}>Profil Fotoğrafı</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                <div style={{ 
                  width: '96px', height: '96px', borderRadius: '50%', backgroundColor: '#f1f5f9', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', 
                  border: '2px dashed #cbd5e1', overflow: 'hidden', position: 'relative'
                }}>
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <FaUserCircle size={48} />
                  )}
                </div>
                <div>
                  <label style={{ padding: '8px 16px', backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '8px', fontWeight: '600', color: '#475569', cursor: 'pointer', marginRight: '12px', display: 'inline-block' }}>
                    <FaCamera style={{ marginRight: 6 }} /> Fotoğraf Yükle
                    <input type="file" accept="image/*" onChange={handleAvatarChange} style={{ display: 'none' }} />
                  </label>
                  {avatarPreview && (
                    <button type="button" onClick={() => deleteAvatarMutation.mutate()} style={{ padding: '8px 16px', backgroundColor: 'transparent', border: 'none', color: '#ef4444', fontWeight: '600', cursor: 'pointer' }}>
                      <FaTimes /> Kaldır
                    </button>
                  )}
                  <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '8px' }}>JPG, PNG veya WEBP. Max: 2MB</p>
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
              <div>
                <label style={labelStyle}>Ad Soyad</label>
                <div style={{ position: 'relative' }}>
                  <FaUser style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                  <input 
                    type="text" 
                    value={form.name} 
                    onChange={(e) => setForm({...form, name: e.target.value})} 
                    style={inputStyle} 
                    placeholder="Ad Soyad" 
                    required
                  />
                </div>
              </div>
              <div>
                <label style={labelStyle}>Telefon</label>
                <div style={{ position: 'relative' }}>
                  <FaPhone style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                  <input 
                    type="text" 
                    value={form.phone} 
                    onChange={(e) => setForm({...form, phone: e.target.value})} 
                    style={inputStyle} 
                    placeholder="05xx xxx xx xx" 
                  />
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
              <div>
                <label style={labelStyle}>Doğum Tarihi</label>
                <div style={{ position: 'relative' }}>
                  <FaBirthdayCake style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                  <input 
                    type="date" 
                    value={form.birth_date} 
                    onChange={(e) => setForm({...form, birth_date: e.target.value})} 
                    style={inputStyle} 
                  />
                </div>
              </div>
              <div>
                <label style={labelStyle}>Cinsiyet</label>
                <div style={{ position: 'relative' }}>
                  <FaVenusMars style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                  <select 
                    value={form.gender} 
                    onChange={(e) => setForm({...form, gender: e.target.value})} 
                    style={{ ...inputStyle, cursor: 'pointer' }}
                  >
                    <option value="">Belirtmek İstemiyorum</option>
                    <option value="male">Erkek</option>
                    <option value="female">Kadın</option>
                    <option value="other">Diğer</option>
                  </select>
                </div>
              </div>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={labelStyle}>E-posta Adresi</label>
              <div style={{ position: 'relative' }}>
                <FaEnvelope style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input 
                  type="email" 
                  value={user?.email || ''} 
                  disabled 
                  style={{ ...inputStyle, backgroundColor: '#f8fafc', color: '#94a3b8' }} 
                />
              </div>
              <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>E-posta adresi değiştirilemez.</p>
            </div>

            {user?.email_verified_at && (
              <div style={{ marginBottom: '24px', padding: '12px 16px', backgroundColor: '#f0fdf4', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <FaCheckCircle style={{ color: '#22c55e' }} />
                <span style={{ color: '#166534', fontSize: '14px' }}>E-posta adresiniz doğrulanmış.</span>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button type="submit" disabled={isSaving} style={{ 
                backgroundColor: '#1e40af', color: 'white', border: 'none', padding: '12px 32px', borderRadius: '10px', fontWeight: '600', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 12px rgba(30, 64, 175, 0.2)', opacity: isSaving ? 0.7 : 1
              }}>
                {isSaving ? <FaSpinner className="spin" /> : <FaSave />} {isSaving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Password Tab */}
      {activeTab === 'password' && (
        <form onSubmit={handlePasswordSubmit}>
          <div style={{ backgroundColor: 'white', padding: '32px', borderRadius: '24px', border: '1px solid #f1f5f9', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.02)' }}>
            
            <div style={{ marginBottom: '24px' }}>
              <label style={labelStyle}>Mevcut Şifre</label>
              <div style={{ position: 'relative' }}>
                <FaLock style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input 
                  type="password" 
                  value={passwordForm.current_password} 
                  onChange={(e) => setPasswordForm({...passwordForm, current_password: e.target.value})} 
                  style={inputStyle} 
                  placeholder="Mevcut şifrenizi girin"
                  required
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
              <div>
                <label style={labelStyle}>Yeni Şifre</label>
                <div style={{ position: 'relative' }}>
                  <FaLock style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                  <input 
                    type="password" 
                    value={passwordForm.password} 
                    onChange={(e) => setPasswordForm({...passwordForm, password: e.target.value})} 
                    style={inputStyle} 
                    placeholder="En az 8 karakter"
                    required
                  />
                </div>
              </div>
              <div>
                <label style={labelStyle}>Yeni Şifre (Tekrar)</label>
                <div style={{ position: 'relative' }}>
                  <FaLock style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                  <input 
                    type="password" 
                    value={passwordForm.password_confirmation} 
                    onChange={(e) => setPasswordForm({...passwordForm, password_confirmation: e.target.value})} 
                    style={inputStyle} 
                    placeholder="Şifreyi tekrar girin"
                    required
                  />
                </div>
              </div>
            </div>

            <div style={{ marginBottom: '24px', padding: '16px', backgroundColor: '#fffbeb', borderRadius: '10px', border: '1px solid #fef3c7' }}>
              <p style={{ fontSize: '13px', color: '#92400e', margin: 0 }}>
                <strong>Güvenlik İpucu:</strong> Güçlü bir şifre için büyük/küçük harf, rakam ve özel karakter kullanın.
              </p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button type="submit" disabled={isSaving} style={{ 
                backgroundColor: '#1e40af', color: 'white', border: 'none', padding: '12px 32px', borderRadius: '10px', fontWeight: '600', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 12px rgba(30, 64, 175, 0.2)', opacity: isSaving ? 0.7 : 1
              }}>
                {isSaving ? <FaSpinner className="spin" /> : <FaLock />} {isSaving ? 'Kaydediliyor...' : 'Şifreyi Güncelle'}
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default UserProfile;
