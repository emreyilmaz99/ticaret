// src/pages/user/UserProfile/index.jsx
import React from 'react';
import { FaSpinner } from 'react-icons/fa';
import { getStyles } from './styles';
import { useUserProfile } from './useUserProfile';
import { Sidebar, ProfileTab, SecurityTab } from './components';
import UserAddresses from '../UserAddresses';
import UserOrders from '../UserOrders';
import UserReviews from '../UserReviews';

const UserProfile = () => {
  const {
    user,
    isLoading,
    activeTab,
    setActiveTab,
    isSaving,
    isMobile,
    form,
    setForm,
    passwordForm,
    setPasswordForm,
    avatarPreview,
    handleFileChange,
    handleProfileSubmit,
    handlePasswordSubmit,
    deleteAvatarMutation,
    logout
  } = useUserProfile();

  const styles = getStyles(isMobile);

  if (isLoading) {
    return (
      <div style={styles.loadingContainer}>
        <FaSpinner style={styles.spinner} />
        <p>Profil bilgileri yükleniyor...</p>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <ProfileTab 
            avatarPreview={avatarPreview}
            onFileChange={handleFileChange}
            onDeleteAvatar={() => deleteAvatarMutation.mutate()}
            form={form}
            setForm={setForm}
            onSubmit={handleProfileSubmit}
            isSaving={isSaving}
            styles={styles}
          />
        );
      case 'addresses':
        return <UserAddresses />;
      case 'security':
        return (
          <SecurityTab 
            form={passwordForm}
            setForm={setPasswordForm}
            onSubmit={handlePasswordSubmit}
            isSaving={isSaving}
            styles={styles}
          />
        );
      case 'orders':
        return <UserOrders />;
      case 'reviews':
        return <UserReviews />;
      default:
        return null;
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>Hesabım</h1>
          <p style={styles.subtitle}>
            Hoş geldiniz, {user?.name}. Hesap bilgilerinizi buradan yönetebilirsiniz.
          </p>
        </div>

        <div style={styles.layout}>
          <Sidebar 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
            onLogout={logout}
            styles={styles}
          />

          <div style={styles.content}>
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
