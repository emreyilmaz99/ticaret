// src/pages/user/UserProfile/components/AvatarSection.jsx
import React from 'react';
import { FaCamera, FaTimes, FaUser } from 'react-icons/fa';

export const AvatarSection = ({ avatarPreview, onFileChange, onDelete, styles }) => {
  return (
    <div style={styles.avatarSection}>
      <div style={styles.avatarWrapper}>
        {avatarPreview ? (
          <img src={avatarPreview} alt="Avatar" style={styles.avatar} />
        ) : (
          <div style={{...styles.avatar, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#e2e8f0', color: '#94a3b8'}}>
            <FaUser size={40} />
          </div>
        )}
        <label style={styles.uploadBtn}>
          <FaCamera size={14} />
          <input 
            type="file" 
            accept="image/*" 
            onChange={onFileChange}
            style={{ display: 'none' }} 
          />
        </label>
      </div>
      
      <div style={styles.avatarInfo}>
        <h3 style={styles.avatarTitle}>Profil Fotoğrafı</h3>
        <p style={styles.avatarDesc}>
          Profil fotoğrafınızı buradan güncelleyebilirsiniz. 
          JPG, PNG veya GIF formatında yükleme yapabilirsiniz.
        </p>
        {avatarPreview && (
          <button 
            type="button" 
            onClick={onDelete}
            style={styles.deleteAvatarBtn}
          >
            <FaTimes /> Fotoğrafı Kaldır
          </button>
        )}
      </div>
    </div>
  );
};
