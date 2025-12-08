// src/pages/user/UserProfile/components/ProfileTab.jsx
import React from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { AvatarSection } from './AvatarSection';
import { ProfileForm } from './ProfileForm';

export const ProfileTab = ({ 
  avatarPreview, 
  onFileChange, 
  onDeleteAvatar, 
  form, 
  setForm, 
  onSubmit, 
  isSaving, 
  styles 
}) => {
  return (
    <>
      <h2 style={styles.sectionTitle}>
        <FaUserCircle color="#059669" />
        Profil Bilgileri
      </h2>

      <AvatarSection 
        avatarPreview={avatarPreview}
        onFileChange={onFileChange}
        onDelete={onDeleteAvatar}
        styles={styles}
      />

      <ProfileForm 
        form={form}
        setForm={setForm}
        onSubmit={onSubmit}
        isSaving={isSaving}
        styles={styles}
      />
    </>
  );
};
