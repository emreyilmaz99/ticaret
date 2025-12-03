import React from 'react';
import { FaTimes, FaFolder, FaInfoCircle } from 'react-icons/fa';
import { useQuery } from '@tanstack/react-query';
import { getVendorCategories } from '../api/vendorCategoryApi';

const BACKEND_URL = 'http://127.0.0.1:8000';
const toFullUrl = (u) => {
  if (!u) return null;
  if (u.startsWith('http')) return u;
  return `${BACKEND_URL}${u.startsWith('/') ? '' : '/'}${u}`;
};

const VendorCategoryModal = ({ isOpen, onClose, vendor }) => {
  // Vendor'ın seçtiği kategorileri al
  const { data: vendorCategoriesResponse, isLoading } = useQuery({
    queryKey: ['vendor-categories', vendor?.id],
    queryFn: () => getVendorCategories(vendor.id),
    enabled: isOpen && !!vendor?.id,
  });

  const vendorCategories = vendorCategoriesResponse?.data?.categories || [];

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        width: '600px',
        maxWidth: '95vw',
        maxHeight: '85vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
      }}>
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--text-main)' }}>
              Satıcı Kategorileri
            </h2>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginTop: '4px' }}>
              {vendor?.storeName || vendor?.company_name || vendor?.name}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              padding: '8px',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              color: 'var(--text-muted)'
            }}
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Info Box */}
        <div style={{
          margin: '20px 24px',
          padding: '16px',
          backgroundColor: '#eff6ff',
          border: '1px solid #bfdbfe',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '12px'
        }}>
          <FaInfoCircle size={18} color="#2563eb" style={{ marginTop: '2px', flexShrink: 0 }} />
          <div>
            <p style={{ fontSize: '14px', color: '#1e40af', margin: 0 }}>
              Bu kategoriler satıcının kendisi tarafından seçilmiştir. 
              Satıcılar istedikleri kategorilerde serbestçe satış yapabilir.
            </p>
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflow: 'auto', padding: '0 24px 20px' }}>
          {isLoading ? (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
              Yükleniyor...
            </div>
          ) : vendorCategories.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '40px',
              color: 'var(--text-muted)',
              backgroundColor: '#f8fafc',
              borderRadius: '8px'
            }}>
              <FaFolder size={48} style={{ marginBottom: '12px', opacity: 0.5 }} />
              <p>Bu satıcı henüz kategori seçmemiş.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {vendorCategories.map(cat => (
                <div
                  key={cat.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '12px 16px',
                    backgroundColor: '#f0fdf4',
                    border: '1px solid #bbf7d0',
                    borderRadius: '8px'
                  }}
                >
                  {cat.image ? (
                    <img 
                      src={toFullUrl(cat.image)} 
                      alt={cat.name}
                      style={{ 
                        width: '24px', 
                        height: '24px', 
                        borderRadius: '4px', 
                        objectFit: 'cover',
                        marginRight: '12px'
                      }}
                      onError={(e) => { 
                        e.target.style.display = 'none'; 
                      }}
                    />
                  ) : (
                    <FaFolder style={{ color: '#22c55e', marginRight: '12px' }} />
                  )}
                  <div style={{ flex: 1 }}>
                    <span style={{ fontWeight: '500', color: 'var(--text-main)' }}>
                      {cat.name}
                    </span>
                    {cat.parent && (
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)', marginLeft: '8px' }}>
                        ({cat.parent.name})
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: '16px 24px',
          borderTop: '1px solid #e2e8f0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
            Toplam {vendorCategories.length} kategori seçilmiş
          </span>
          <button
            onClick={onClose}
            style={{
              padding: '10px 20px',
              backgroundColor: '#f1f5f9',
              color: 'var(--text-main)',
              border: 'none',
              borderRadius: '8px',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
};

export default VendorCategoryModal;
