// src/pages/vendor/Products/components/modal/MediaTab.jsx
import React from 'react';
import { FaUpload, FaTimes, FaTrash, FaImage } from 'react-icons/fa';
import { styles } from '../../styles';

const MediaTab = ({ 
  formData, 
  handleImageChange, 
  removeImage, 
  selectedProduct,
  deletePhotoMutation,
  toFullUrl,
  onImageClick,
  openConfirmModal,
  readOnly = false 
}) => {
  const existingPhotos = selectedProduct?.photos || [];

  const handleDeletePhoto = (photo) => {
    openConfirmModal(
      'Fotoğrafı Sil',
      'Bu fotoğrafı silmek istediğinizden emin misiniz?',
      () => {
        deletePhotoMutation.mutate({ 
          productId: selectedProduct.id, 
          photoId: photo.id 
        });
      }
    );
  };

  return (
    <div style={styles.tabContent}>
      {/* Existing Photos */}
      {existingPhotos.length > 0 && (
        <div style={styles.formGroup}>
          <label style={styles.label}>Mevcut Görseller</label>
          <div style={styles.imageGrid}>
            {existingPhotos.map((photo, index) => {
              const imageUrl = toFullUrl(photo.url || photo.path);
              return (
                <div key={photo.id || index} style={styles.imageItem}>
                  <img 
                    src={imageUrl} 
                    alt={`Ürün görseli ${index + 1}`}
                    style={styles.imagePreview}
                    onClick={() => onImageClick(imageUrl)}
                  />
                  {!readOnly && (
                    <button
                      type="button"
                      style={styles.imageDeleteBtn}
                      onClick={() => handleDeletePhoto(photo)}
                      title="Fotoğrafı sil"
                    >
                      <FaTrash />
                    </button>
                  )}
                  {photo.is_main && (
                    <span style={styles.mainImageBadge}>Ana Görsel</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* New Images Upload */}
      {!readOnly && (
        <div style={styles.formGroup}>
          <label style={styles.label}>
            {existingPhotos.length > 0 ? 'Yeni Görsel Ekle' : 'Ürün Görselleri'}
          </label>
          
          <div style={styles.uploadArea}>
            <input
              type="file"
              id="product-images"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              style={styles.fileInput}
            />
            <label htmlFor="product-images" style={styles.uploadLabel}>
              <FaUpload style={styles.uploadIcon} />
              <span>Görsel yüklemek için tıklayın veya sürükleyin</span>
              <small style={styles.uploadHint}>PNG, JPG, JPEG (max. 5MB)</small>
            </label>
          </div>

          {/* Preview of new images */}
          {formData.images.length > 0 && (
            <div style={styles.newImagesPreview}>
              <p style={styles.newImagesTitle}>Yüklenecek görseller:</p>
              <div style={styles.imageGrid}>
                {formData.images.map((file, index) => (
                  <div key={index} style={styles.imageItem}>
                    <img 
                      src={URL.createObjectURL(file)}
                      alt={`Yeni görsel ${index + 1}`}
                      style={styles.imagePreview}
                    />
                    <button
                      type="button"
                      style={styles.imageDeleteBtn}
                      onClick={() => removeImage(index)}
                      title="Kaldır"
                    >
                      <FaTimes />
                    </button>
                    <span style={styles.imageName}>{file.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Empty state */}
      {existingPhotos.length === 0 && formData.images.length === 0 && (
        <div style={styles.emptyMedia}>
          <FaImage style={styles.emptyMediaIcon} />
          <p>Henüz görsel eklenmemiş</p>
        </div>
      )}
    </div>
  );
};

export default MediaTab;
