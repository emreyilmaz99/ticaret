// src/pages/admin/Products/ProductDetailModal.jsx
import React from 'react';
import { FaTimes, FaStore, FaImage, FaCheck, FaTimesCircle } from 'react-icons/fa';
import { StatusBadge } from '../../../features/admin/shared';
import { toFullUrl } from './styles';

/**
 * Ürün detay modal bileşeni
 */
const ProductDetailModal = ({
  product,
  selectedImage,
  onSelectImage,
  onOpenLightbox,
  onStatusChange,
  onClose,
  styles
}) => {
  if (!product) return null;

  const mainImage = selectedImage || toFullUrl(product.thumbnail) || (product.photos?.[0] && toFullUrl(product.photos[0].url));

  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div style={{ ...styles.modalContent, maxWidth: '1000px' }} onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div style={styles.modalHeader}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#0f172a' }}>Ürün Detayı</h2>
            <StatusBadge status={product.status} />
          </div>
          <button 
            onClick={onClose} 
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: '8px' }}
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Body */}
        <div style={styles.modalBody}>
          <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '32px' }}>
            
            {/* Sol - Görseller */}
            <div>
              {/* Ana Görsel */}
              <div 
                style={{ 
                  aspectRatio: '1/1', 
                  borderRadius: '12px', 
                  backgroundColor: '#f1f5f9', 
                  overflow: 'hidden', 
                  marginBottom: '12px', 
                  border: '1px solid #e2e8f0', 
                  cursor: 'pointer' 
                }}
                onClick={() => mainImage && onOpenLightbox(mainImage)}
              >
                {mainImage ? (
                  <img 
                    src={mainImage} 
                    alt={product.name} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '8px' }}>
                    <FaImage size={48} color="#cbd5e1" />
                    <span style={{ color: '#94a3b8', fontSize: '13px' }}>Görsel yok</span>
                  </div>
                )}
              </div>
              
              {/* Diğer Görseller */}
              {product.photos && product.photos.length > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                  {product.photos.map((photo, i) => {
                    const photoUrl = toFullUrl(photo.url);
                    const isSelected = selectedImage === photoUrl;
                    return (
                      <div 
                        key={i} 
                        style={{ 
                          aspectRatio: '1/1', 
                          borderRadius: '8px', 
                          overflow: 'hidden', 
                          backgroundColor: '#f1f5f9', 
                          border: isSelected ? '2px solid #4f46e5' : '1px solid #e2e8f0', 
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          opacity: isSelected ? 1 : 0.8
                        }}
                        onClick={() => onSelectImage(photoUrl)}
                      >
                        <img src={photoUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                    );
                  })}
                </div>
              )}
              
              {/* Satıcı Bilgisi */}
              <div style={{ marginTop: '24px', padding: '16px', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: '600', marginBottom: '12px' }}>Satıcı Bilgileri</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <FaStore size={18} color="white" />
                  </div>
                  <div>
                    <div style={{ fontWeight: '600', color: '#0f172a' }}>{product.vendor?.company_name || '-'}</div>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>{product.vendor?.full_name}</div>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>{product.vendor?.email}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sağ - Detaylar */}
            <div>
              <h3 style={{ fontSize: '24px', fontWeight: '700', color: '#0f172a', marginBottom: '8px', lineHeight: '1.3' }}>
                {product.name}
              </h3>
              
              {/* Temel Bilgiler */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '24px', marginTop: '16px' }}>
                <div style={styles.infoBox('#ecfdf5')}>
                  <div style={styles.infoLabel('#047857')}>FİYAT</div>
                  <div style={styles.infoValue('#047857')}>
                    {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(product.price || 0)}
                  </div>
                </div>
                <div style={styles.infoBox('#eff6ff')}>
                  <div style={styles.infoLabel('#2563eb')}>STOK</div>
                  <div style={styles.infoValue('#2563eb')}>{product.stock} adet</div>
                </div>
                <div style={styles.infoBox('#fef3c7')}>
                  <div style={styles.infoLabel('#b45309')}>TİP</div>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: '#b45309' }}>
                    {product.type === 'simple' ? 'Basit' : 'Varyantlı'}
                  </div>
                </div>
                <div style={styles.infoBox('#f1f5f9')}>
                  <div style={styles.infoLabel('#475569')}>KATEGORİ</div>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: '#475569' }}>
                    {product.category?.name || '-'}
                  </div>
                </div>
              </div>

              {/* Detay Bilgiler */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                <DetailItem label="SKU (Stok Kodu)" value={product.sku || '-'} />
                <DetailItem label="Slug (URL)" value={product.slug || '-'} />
                <DetailItem label="Oluşturulma Tarihi" value={new Date(product.created_at).toLocaleString('tr-TR')} />
                <DetailItem label="Güncellenme Tarihi" value={new Date(product.updated_at).toLocaleString('tr-TR')} />
                <DetailItem 
                  label="Öne Çıkan" 
                  value={product.is_featured ? '✓ Evet' : 'Hayır'} 
                  valueColor={product.is_featured ? '#059669' : '#64748b'} 
                />
                <DetailItem label="Ürün ID" value={product.id} isCode />
              </div>

              {/* Açıklamalar */}
              {product.short_description && (
                <DescriptionBox title="Kısa Açıklama" content={product.short_description} />
              )}
              
              {product.description && (
                <DescriptionBox title="Detaylı Açıklama" content={product.description} scrollable />
              )}

              {/* Etiketler */}
              {product.tags && product.tags.length > 0 && (
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '600', marginBottom: '8px', textTransform: 'uppercase' }}>Etiketler</div>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {product.tags.map((tag, i) => (
                      <span key={i} style={{ padding: '6px 14px', backgroundColor: '#059669', color: 'white', borderRadius: '20px', fontSize: '12px', fontWeight: '500' }}>
                        #{tag.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Red Sebebi */}
              {product.status === 'rejected' && product.rejection_reason && (
                <div style={{ marginBottom: '20px', padding: '16px', backgroundColor: '#fef2f2', borderRadius: '10px', border: '1px solid #fecaca' }}>
                  <div style={{ fontSize: '11px', color: '#dc2626', fontWeight: '600', marginBottom: '8px', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <FaTimesCircle /> Red Sebebi
                  </div>
                  <p style={{ color: '#991b1b', fontSize: '14px', lineHeight: '1.6', margin: 0 }}>{product.rejection_reason}</p>
                  {product.rejected_at && (
                    <p style={{ color: '#b91c1c', fontSize: '12px', marginTop: '8px', margin: '8px 0 0 0' }}>
                      Reddedilme tarihi: {new Date(product.rejected_at).toLocaleString('tr-TR')}
                    </p>
                  )}
                </div>
              )}

              {/* Varyantlar */}
              {product.variants && product.variants.length > 0 && (
                <VariantsTable variants={product.variants} />
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={styles.modalFooter}>
          <div style={{ fontSize: '13px', color: '#64748b' }}>
            ID: <span style={{ fontFamily: 'monospace', fontSize: '12px' }}>{product.id}</span>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            {product.status === 'pending' && (
              <>
                <button 
                  onClick={() => onStatusChange(product.id, 'rejected', product.name)}
                  style={{ ...styles.btn('danger'), padding: '10px 20px', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <FaTimes /> Reddet
                </button>
                <button 
                  onClick={() => { onStatusChange(product.id, 'active'); onClose(); }}
                  style={{ ...styles.btn('primary'), padding: '10px 20px', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <FaCheck /> Onayla ve Yayınla
                </button>
              </>
            )}
            {product.status === 'active' && (
              <button 
                onClick={() => { onStatusChange(product.id, 'inactive'); onClose(); }}
                style={{ ...styles.btn('danger'), padding: '10px 20px', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <FaTimes /> Pasife Al
              </button>
            )}
            {(product.status === 'rejected' || product.status === 'inactive' || product.status === 'draft') && (
              <button 
                onClick={() => { onStatusChange(product.id, 'active'); onClose(); }}
                style={{ ...styles.btn('primary'), padding: '10px 20px', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <FaCheck /> Yayına Al
              </button>
            )}
            <button 
              onClick={onClose}
              style={{ ...styles.btn(), padding: '10px 20px' }}
            >
              Kapat
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper Components
const DetailItem = ({ label, value, valueColor = '#0f172a', isCode = false }) => (
  <div>
    <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '600', marginBottom: '4px' }}>{label}</div>
    <div style={{ 
      fontSize: isCode ? '12px' : '14px', 
      color: isCode ? '#64748b' : valueColor, 
      fontWeight: '500',
      fontFamily: isCode ? 'monospace' : 'inherit'
    }}>
      {value}
    </div>
  </div>
);

const DescriptionBox = ({ title, content, scrollable = false }) => (
  <div style={{ marginBottom: '20px' }}>
    <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '600', marginBottom: '8px', textTransform: 'uppercase' }}>{title}</div>
    <div style={{ 
      color: '#334155', 
      fontSize: '14px', 
      lineHeight: '1.6', 
      padding: '12px', 
      backgroundColor: '#f8fafc', 
      borderRadius: '8px',
      whiteSpace: 'pre-wrap',
      ...(scrollable ? { maxHeight: '150px', overflowY: 'auto' } : {})
    }}>
      {content}
    </div>
  </div>
);

const VariantsTable = ({ variants }) => (
  <div style={{ marginBottom: '20px' }}>
    <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '600', marginBottom: '12px', textTransform: 'uppercase' }}>
      Varyantlar ({variants.length})
    </div>
    <div style={{ border: '1px solid #e2e8f0', borderRadius: '10px', overflow: 'hidden' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
        <thead>
          <tr style={{ backgroundColor: '#f8fafc' }}>
            <th style={{ padding: '10px 12px', textAlign: 'left', fontWeight: '600', color: '#64748b', borderBottom: '1px solid #e2e8f0' }}>Varyant</th>
            <th style={{ padding: '10px 12px', textAlign: 'left', fontWeight: '600', color: '#64748b', borderBottom: '1px solid #e2e8f0' }}>SKU</th>
            <th style={{ padding: '10px 12px', textAlign: 'right', fontWeight: '600', color: '#64748b', borderBottom: '1px solid #e2e8f0' }}>Fiyat</th>
            <th style={{ padding: '10px 12px', textAlign: 'right', fontWeight: '600', color: '#64748b', borderBottom: '1px solid #e2e8f0' }}>Stok</th>
          </tr>
        </thead>
        <tbody>
          {variants.map((variant, i) => (
            <tr key={i} style={{ borderBottom: i < variants.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
              <td style={{ padding: '10px 12px', color: '#0f172a', fontWeight: '500' }}>{variant.title || 'Varsayılan'}</td>
              <td style={{ padding: '10px 12px', color: '#64748b', fontFamily: 'monospace', fontSize: '12px' }}>{variant.sku || '-'}</td>
              <td style={{ padding: '10px 12px', textAlign: 'right', color: '#059669', fontWeight: '600' }}>
                {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(variant.price || 0)}
              </td>
              <td style={{ padding: '10px 12px', textAlign: 'right' }}>
                <span style={{ 
                  padding: '2px 8px', 
                  borderRadius: '12px', 
                  fontSize: '12px', 
                  fontWeight: '500',
                  backgroundColor: variant.stock > 10 ? '#d1fae5' : variant.stock > 0 ? '#fef3c7' : '#fee2e2',
                  color: variant.stock > 10 ? '#047857' : variant.stock > 0 ? '#b45309' : '#dc2626'
                }}>
                  {variant.stock}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default ProductDetailModal;
