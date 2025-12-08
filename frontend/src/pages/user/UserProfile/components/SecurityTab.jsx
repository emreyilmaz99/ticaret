// src/pages/user/UserProfile/components/SecurityTab.jsx
import React from 'react';
import { FaShieldAlt } from 'react-icons/fa';
import { PasswordForm } from './PasswordForm';

export const SecurityTab = ({ form, setForm, onSubmit, isSaving, styles }) => {
  return (
    <>
      <h2 style={styles.sectionTitle}>
        <FaShieldAlt color="#059669" />
        Güvenlik & Şifre
      </h2>
      
      <PasswordForm 
        form={form}
        setForm={setForm}
        onSubmit={onSubmit}
        isSaving={isSaving}
        styles={styles}
      />
    </>
  );
};
