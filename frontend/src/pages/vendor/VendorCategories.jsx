import React, { useState } from 'react';
import { FaPlus, FaTrash } from 'react-icons/fa';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getVendorCategories, createVendorCategory, deleteVendorCategory } from '../../features/vendor/api/categoryApi';

export default function VendorCategories() {
  const qc = useQueryClient();
  const { data, isLoading, isError } = useQuery({ queryKey: ['vendorCategories'], queryFn: getVendorCategories });
  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState('');

  const createMutation = useMutation({
    mutationFn: (payload) => createVendorCategory(payload),
    onSuccess: () => qc.invalidateQueries(['vendorCategories'])
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteVendorCategory(id),
    onSuccess: () => qc.invalidateQueries(['vendorCategories'])
  });

  const handleCreate = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    createMutation.mutate({ name }, {
      onSuccess: () => {
        setName('');
        setModalOpen(false);
      },
      onError: (err) => {
        console.error('Create category failed', err);
        // keep modal open so user can retry; show a browser alert for now
        alert(err?.response?.data?.message || err.message || 'Kategori oluşturulurken hata oluştu');
      }
    });
  };

  const handleDelete = (id) => {
    if (!confirm('Bu kategoriyi silmek istediğinize emin misiniz?')) return;
    deleteMutation.mutate(id);
  };

  const containerStyle = { padding: 24 };
  const headerStyle = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 };
  const titleStyle = { fontSize: 22, fontWeight: 700, color: 'var(--text-main)' };
  const subtitleStyle = { fontSize: 13, color: 'var(--text-muted)', marginTop: 6 };
  const gridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 };
  const cardStyle = { background: 'var(--bg-card)', padding: 16, borderRadius: 'var(--radius)', boxShadow: 'var(--shadow-sm)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: 110 };
  const buttonPrimary = { backgroundColor: '#14532d', color: 'white', padding: '8px 14px', borderRadius: 8, border: 'none', cursor: 'pointer' };
  const buttonSecondary = { padding: '6px 10px', borderRadius: 8, border: '1px solid #eee', background: 'white', cursor: 'pointer' };

  const items = data?.data?.data ?? data?.data ?? [];
  // helpful debug: console log raw response structure when available
  if (data && process.env.NODE_ENV !== 'production') console.debug('vendorCategories response', data);

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <div>
          <div style={titleStyle}>Kategorilerim</div>
          <div style={subtitleStyle}>Mağazanız için kategori ekleyin ve ürün eklerken seçin.</div>
        </div>
        <div>
          <button type="button" onClick={() => setModalOpen(true)} style={buttonPrimary}>
            <FaPlus style={{ marginRight: 8 }} /> Yeni Kategori
          </button>
        </div>
      </div>

      <div>
        {isLoading ? (
          <div style={gridStyle}>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} style={{ ...cardStyle, height: 110, opacity: 0.6 }} />
            ))}
          </div>
        ) : isError ? (
          <div style={{ padding: 16, background: '#fee2e2', color: '#991b1b', borderRadius: 8 }}>Kategoriler yüklenirken bir hata oluştu.</div>
        ) : (
          <div style={gridStyle}>
            {items?.length ? (
              items.map((c) => (
                <div key={c.id} style={cardStyle}>
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-main)' }}>{c.name}</div>
                    {c.slug && <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 6 }}>{c.slug}</div>}
                  </div>

                  <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{c.created_at ? new Date(c.created_at).toLocaleDateString() : ''}</div>
                    <div>
                      <button type="button" onClick={() => handleDelete(c.id)} style={{ ...buttonSecondary, borderColor: '#fee2e2', color: '#dc2626' }}>
                        <FaTrash style={{ marginRight: 6 }} /> Sil
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ gridColumn: '1 / -1', padding: 24, background: 'var(--bg-card)', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow-sm)', textAlign: 'center' }}>
                <div style={{ fontSize: 16, fontWeight: 600 }}>Henüz kategori yok</div>
                <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 8 }}>Yeni kategori ekleyerek ürünlerinizi düzenlemeye başlayabilirsiniz.</div>
                <div style={{ marginTop: 12 }}>
                  <button onClick={() => setModalOpen(true)} style={buttonPrimary}>Kategori Ekle</button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {modalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 60 }}>
          <div style={{ background: 'var(--bg-card)', borderRadius: 12, padding: 20, width: '100%', maxWidth: 480, boxShadow: 'var(--shadow-md)' }}>
            <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>Yeni Kategori Ekle</div>
            <form onSubmit={handleCreate}>
              <div style={{ marginBottom: 12 }}>
                <label style={{ display: 'block', fontSize: 13, color: 'var(--text-muted)', marginBottom: 6 }}>Kategori Adı</label>
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Örneğin: Elektronik" style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #e6edf3' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                <button type="button" onClick={() => setModalOpen(false)} style={buttonSecondary}>İptal</button>
                <button type="submit" style={buttonPrimary}>{createMutation.isLoading ? 'Oluşturuluyor...' : 'Oluştur'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
