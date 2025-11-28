import React, { useState } from 'react';
import { FaPlus, FaSearch, FaFilter, FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getVendorProducts, createVendorProduct, deleteVendorProduct, updateVendorProduct } from '../../features/vendor/api/productApi';
import { getVendorCategories } from '../../features/vendor/api/categoryApi';
import { getUnits } from '../../features/public/api/unitsApi';

const VendorProducts = () => {
  const qc = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({ name: '', category_id: '', price: '', stock: 0, description: '', type: 'simple' });
  const [imageFile, setImageFile] = useState(null);
  const [imageFiles, setImageFiles] = useState([]);
  const [tagsText, setTagsText] = useState('');
  const [variants, setVariants] = useState([]);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [viewProduct, setViewProduct] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editProductId, setEditProductId] = useState(null);

  const { data: rawData, isLoading } = useQuery({
    queryKey: ['vendorProducts'],
    queryFn: async () => {
      const res = await getVendorProducts();
      return res.data ?? res;
    }
  });
  // normalize product list: API returns { success, data: <paginator|array>, meta }
  const products = rawData?.data?.data ?? rawData?.data ?? rawData ?? [];

  const { data: categoriesDataRaw } = useQuery({ queryKey: ['vendorCategories'], queryFn: getVendorCategories });
  const categories = categoriesDataRaw?.data?.data ?? categoriesDataRaw?.data ?? [];

  const { data: unitsRaw } = useQuery({ queryKey: ['units'], queryFn: getUnits });
  const units = unitsRaw?.data ?? unitsRaw ?? [];

  const createMutation = useMutation({
    mutationFn: (payload) => createVendorProduct(payload),
    onSuccess: () => {
      qc.invalidateQueries(['vendorProducts']);
      setIsModalOpen(false);
      setForm({ name: '', category_id: '', price: '', stock: 0, description: '', type: 'simple' });
      setImageFile(null);
      setImageFiles([]);
      setTagsText('');
      setVariants([]);
    },
    onError: (err) => {
      console.error('Create product failed', err);
      const message = err?.response?.data?.message;
      const errors = err?.response?.data?.errors;
      if (errors) {
        // concat validation messages
        const msgs = Object.values(errors).flat().join('\n');
        alert(msgs);
      } else {
        alert(message || 'Ürün oluşturulurken hata oluştu');
      }
    }
  });

  const deleteMutation = useMutation({ mutationFn: (id) => deleteVendorProduct(id), onSuccess: () => qc.invalidateQueries(['vendorProducts']) });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }) => updateVendorProduct(id, payload),
    onSuccess: () => {
      qc.invalidateQueries(['vendorProducts']);
      setIsEditOpen(false);
      setEditProductId(null);
      setForm({ name: '', category_id: '', price: '', stock: 0, description: '', type: 'simple' });
      setImageFiles([]);
      setTagsText('');
      setVariants([]);
    },
    onError: (err) => {
      console.error('Update product failed', err);
      const message = err?.response?.data?.message;
      const errors = err?.response?.data?.errors;
      if (errors) {
        const msgs = Object.values(errors).flat().join('\n');
        alert(msgs);
      } else {
        alert(message || 'Ürün güncellenirken hata oluştu');
      }
    }
  });

  const getStockStatus = (stock) => {
    if (stock === 0) return { label: 'Tükendi', color: '#ef4444', bg: '#fef2f2' };
    if (stock < 20) return { label: 'Kritik', color: '#f59e0b', bg: '#fffbeb' };
    return { label: 'Stokta', color: '#10b981', bg: '#ecfdf5' };
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append('name', form.name);
    fd.append('category_id', form.category_id);
    // backend requires `type` (simple|variable|bundle)
    fd.append('type', form.type || 'simple');
    fd.append('price', form.price);
    fd.append('stock', form.stock);
    fd.append('description', form.description);
    // append single image or multiple images
    if (imageFiles && imageFiles.length) {
      imageFiles.forEach((f, idx) => fd.append('images[]', f));
    } else if (imageFile) {
      fd.append('images[]', imageFile);
    }

    // tags (comma separated)
    if (tagsText) {
      const tagsArr = tagsText.split(',').map(t => t.trim()).filter(Boolean);
      tagsArr.forEach((t, i) => fd.append(`tags[${i}]`, t));
    }

    // variants (if any) - send as JSON string per index
    if (variants.length) {
      variants.forEach((v, i) => {
        Object.keys(v).forEach((key) => {
          fd.append(`variants[${i}][${key}]`, v[key]);
        });
      });
    }

    createMutation.mutate(fd);
  };

  const handleDelete = (id) => {
    if (!confirm('Bu ürünü silmek istediğinize emin misiniz?')) return;
    deleteMutation.mutate(id);
  };

  const handleView = (product) => {
    setViewProduct(product);
    setIsViewOpen(true);
  };

  const handleEdit = (product) => {
    // populate form with product data
    setForm({
      name: product.name || '',
      category_id: product.category_id || '',
      price: product.price || '',
      stock: product.stock ?? 0,
      description: product.description || '',
      type: product.type || 'simple',
    });
    // populate variants if present
    setVariants(product.variants ?? []);
    setTagsText((product.tags || []).map(t => t.name).join(', '));
    setEditProductId(product.id);
    setIsEditOpen(true);
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    if (!editProductId) return;
    const payload = {};
    payload.name = form.name;
    payload.category_id = form.category_id;
    payload.type = form.type || 'simple';
    payload.price = form.price;
    payload.stock = form.stock;
    payload.description = form.description;

    // tags
    const tagsArr = tagsText ? tagsText.split(',').map(t => t.trim()).filter(Boolean) : [];
    payload.tags = tagsArr;

    // variants
    payload.variants = variants;

    updateMutation.mutate({ id: editProductId, payload });
  };

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", color: '#1e293b' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.5px' }}>Ürün Yönetimi</h1>
          <p style={{ color: '#64748b', fontSize: '14px', marginTop: '4px' }}>Mağazanızdaki ürünleri buradan yönetebilirsiniz.</p>
        </div>
        <button type="button" onClick={() => setIsModalOpen(true)} style={{ 
          backgroundColor: '#14532d', 
          color: 'white', 
          border: 'none', 
          padding: '12px 24px', 
          borderRadius: '10px', 
          fontWeight: '600', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px',
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(20, 83, 45, 0.2)'
        }}>
          <FaPlus size={14} /> Yeni Ürün Ekle
        </button>
      </div>

      {/* Filters */}
      <div style={{ 
        backgroundColor: 'white', 
        padding: '16px', 
        borderRadius: '16px', 
        marginBottom: '24px', 
        display: 'flex', 
        gap: '16px',
        border: '1px solid #f1f5f9',
        boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
      }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <FaSearch style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input 
            type="text" 
            placeholder="Ürün adı, barkod veya kategori ara..." 
            style={{ 
              width: '100%', 
              padding: '12px 12px 12px 48px', 
              borderRadius: '10px', 
              border: '1px solid #e2e8f0', 
              outline: 'none',
              fontSize: '14px'
            }} 
          />
        </div>
        <button style={{ 
          padding: '0 20px', 
          backgroundColor: 'white', 
          border: '1px solid #e2e8f0', 
          borderRadius: '10px', 
          color: '#475569', 
          fontWeight: '600', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px',
          cursor: 'pointer'
        }}>
          <FaFilter /> Filtrele
        </button>
      </div>

      {/* Product List */}
      <div style={{ backgroundColor: 'white', borderRadius: '16px', border: '1px solid #f1f5f9', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.02)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
            <tr>
              <th style={{ padding: '16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase' }}>Ürün</th>
              <th style={{ padding: '16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase' }}>Kategori</th>
              <th style={{ padding: '16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase' }}>Fiyat</th>
              <th style={{ padding: '16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase' }}>Stok Durumu</th>
              <th style={{ padding: '16px', textAlign: 'right', fontSize: '12px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase' }}>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={5} style={{ padding: 24 }}>Yükleniyor...</td></tr>
            ) : (
              products.map((product, index) => {
                const stockStatus = getStockStatus(product.stock);
                return (
                  <tr key={product.id} style={{ borderBottom: index !== products.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                    <td style={{ padding: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <img src={product.image || product.thumbnail || 'https://placehold.co/50'} alt={product.name} style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover', backgroundColor: '#f1f5f9' }} />
                        <div>
                          <div style={{ fontWeight: '600', color: '#0f172a' }}>{product.name}</div>
                          <div style={{ fontSize: '12px', color: '#94a3b8' }}>ID: #{product.id}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '16px', color: '#475569' }}>{product.category}</td>
                    <td style={{ padding: '16px', fontWeight: '600', color: '#0f172a' }}>{product.price}</td>
                    <td style={{ padding: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ 
                          padding: '4px 10px', 
                          borderRadius: '20px', 
                          fontSize: '12px', 
                          fontWeight: '600', 
                          backgroundColor: stockStatus.bg, 
                          color: stockStatus.color 
                        }}>
                          {stockStatus.label}
                        </span>
                        <span style={{ fontSize: '12px', color: '#64748b' }}>({product.stock} adet)</span>
                      </div>
                      <div style={{ width: '100px', height: '4px', backgroundColor: '#f1f5f9', borderRadius: '2px', marginTop: '6px' }}>
                        <div style={{ width: `${Math.min(product.stock, 100)}%`, height: '100%', backgroundColor: stockStatus.color, borderRadius: '2px' }}></div>
                      </div>
                    </td>
                    <td style={{ padding: '16px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                        <button title="Gör" onClick={() => handleView(product)} style={{ padding: '8px', borderRadius: '8px', border: 'none', backgroundColor: '#f1f5f9', color: '#475569', cursor: 'pointer' }}><FaEye /></button>
                        <button title="Düzenle" onClick={() => handleEdit(product)} style={{ padding: '8px', borderRadius: '8px', border: 'none', backgroundColor: '#dbeafe', color: '#2563eb', cursor: 'pointer' }}><FaEdit /></button>
                        <button title="Sil" onClick={() => handleDelete(product.id)} style={{ padding: '8px', borderRadius: '8px', border: 'none', backgroundColor: '#fee2e2', color: '#dc2626', cursor: 'pointer' }}><FaTrash /></button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Add Product Modal (simple) */}
      {isModalOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1200 }}>
          <div style={{ background: 'white', width: 720, borderRadius: 12, padding: 20 }}>
            <h3>Yeni Ürün Ekle</h3>
            <form onSubmit={handleCreate}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <input placeholder="Ürün adı" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} style={{ padding: 8 }} />
                <select value={form.category_id} onChange={(e) => setForm({...form, category_id: e.target.value})} style={{ padding: 8 }}>
                  <option value="">Kategori seçin</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
                <input placeholder="Fiyat" value={form.price} onChange={(e) => setForm({...form, price: e.target.value})} style={{ padding: 8 }} />
                <input type="number" placeholder="Stok" value={form.stock} onChange={(e) => setForm({...form, stock: parseInt(e.target.value || 0)})} style={{ padding: 8 }} />
                <input type="file" accept="image/*" multiple onChange={(e) => setImageFiles(Array.from(e.target.files))} />
                <textarea placeholder="Açıklama" value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} style={{ gridColumn: '1 / -1', padding: 8 }} />
              </div>
              <div style={{ gridColumn: '1 / -1', marginTop: 8 }}>
                <label style={{ display: 'block', marginBottom: 6 }}>Etiketler (virgülle ayırın)</label>
                <input value={tagsText} onChange={(e) => setTagsText(e.target.value)} placeholder="örnek: elektronik, kampanya" style={{ width: '100%', padding: 8 }} />
              </div>

              <div style={{ gridColumn: '1 / -1', marginTop: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <strong>Varyantlar</strong>
                  <button type="button" onClick={() => setVariants([...variants, { title: '', sku: '', price: '', stock: 0, unit_id: '' }])} style={{ padding: '6px 10px' }}>Varyant Ekle</button>
                </div>
                {variants.map((v, idx) => (
                  <div key={idx} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 80px', gap: 8, marginBottom: 8 }}>
                    <input placeholder="Başlık" value={v.title} onChange={(e) => { const copy = [...variants]; copy[idx].title = e.target.value; setVariants(copy); }} style={{ padding: 8 }} />
                    <input placeholder="SKU" value={v.sku} onChange={(e) => { const copy = [...variants]; copy[idx].sku = e.target.value; setVariants(copy); }} style={{ padding: 8 }} />
                    <input placeholder="Fiyat" value={v.price} onChange={(e) => { const copy = [...variants]; copy[idx].price = e.target.value; setVariants(copy); }} style={{ padding: 8 }} />
                    <select value={v.unit_id || ''} onChange={(e) => { const copy = [...variants]; copy[idx].unit_id = e.target.value; setVariants(copy); }} style={{ padding: 8 }}>
                      <option value="">Birim</option>
                      {units.map(u => <option key={u.id} value={u.id}>{u.name} ({u.code})</option>)}
                    </select>
                    <input placeholder="Stok" type="number" value={v.stock} onChange={(e) => { const copy = [...variants]; copy[idx].stock = parseInt(e.target.value || 0); setVariants(copy); }} style={{ padding: 8 }} />
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 12 }}>
                <button type="button" onClick={() => setIsModalOpen(false)} style={{ padding: '8px 12px' }}>İptal</button>
                <button type="submit" style={{ padding: '8px 12px', background: '#14532d', color: 'white', border: 'none', borderRadius: 6 }}>{createMutation.isLoading ? 'Kaydediliyor...' : 'Kaydet'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Product Modal */}
      {isViewOpen && viewProduct && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1200 }}>
          <div style={{ background: 'white', width: 640, borderRadius: 12, padding: 20 }}>
            <h3 style={{ marginBottom: 8 }}>{viewProduct.name}</h3>
            <div style={{ color: '#475569', marginBottom: 12 }}>ID: {viewProduct.id} • Tür: {viewProduct.type}</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <strong>Fiyat</strong>
                <div style={{ marginTop: 4 }}>{viewProduct.price}</div>
              </div>
              <div>
                <strong>Stok</strong>
                <div style={{ marginTop: 4 }}>{viewProduct.stock}</div>
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <strong>Açıklama</strong>
                <div style={{ marginTop: 4, color: '#334155' }}>{viewProduct.description || '—'}</div>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 16 }}>
              <button onClick={() => { setIsViewOpen(false); setViewProduct(null); }} style={{ padding: '8px 12px' }}>Kapat</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {isEditOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1200 }}>
          <div style={{ background: 'white', width: 720, borderRadius: 12, padding: 20 }}>
            <h3>Ürün Düzenle</h3>
            <form onSubmit={handleUpdate}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <input placeholder="Ürün adı" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} style={{ padding: 8 }} />
                <select value={form.category_id} onChange={(e) => setForm({...form, category_id: e.target.value})} style={{ padding: 8 }}>
                  <option value="">Kategori seçin</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
                <input placeholder="Fiyat" value={form.price} onChange={(e) => setForm({...form, price: e.target.value})} style={{ padding: 8 }} />
                <input type="number" placeholder="Stok" value={form.stock} onChange={(e) => setForm({...form, stock: parseInt(e.target.value || 0)})} style={{ padding: 8 }} />
                <input type="file" accept="image/*" multiple onChange={(e) => setImageFiles(Array.from(e.target.files))} />
                <textarea placeholder="Açıklama" value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} style={{ gridColumn: '1 / -1', padding: 8 }} />
              </div>
              <div style={{ gridColumn: '1 / -1', marginTop: 8 }}>
                <label style={{ display: 'block', marginBottom: 6 }}>Etiketler (virgülle ayırın)</label>
                <input value={tagsText} onChange={(e) => setTagsText(e.target.value)} placeholder="örnek: elektronik, kampanya" style={{ width: '100%', padding: 8 }} />
              </div>

              <div style={{ gridColumn: '1 / -1', marginTop: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <strong>Varyantlar</strong>
                  <button type="button" onClick={() => setVariants([...variants, { title: '', sku: '', price: '', stock: 0, unit_id: '' }])} style={{ padding: '6px 10px' }}>Varyant Ekle</button>
                </div>
                {variants.map((v, idx) => (
                  <div key={idx} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 80px', gap: 8, marginBottom: 8 }}>
                    <input placeholder="Başlık" value={v.title} onChange={(e) => { const copy = [...variants]; copy[idx].title = e.target.value; setVariants(copy); }} style={{ padding: 8 }} />
                    <input placeholder="SKU" value={v.sku} onChange={(e) => { const copy = [...variants]; copy[idx].sku = e.target.value; setVariants(copy); }} style={{ padding: 8 }} />
                    <input placeholder="Fiyat" value={v.price} onChange={(e) => { const copy = [...variants]; copy[idx].price = e.target.value; setVariants(copy); }} style={{ padding: 8 }} />
                    <select value={v.unit_id || ''} onChange={(e) => { const copy = [...variants]; copy[idx].unit_id = e.target.value; setVariants(copy); }} style={{ padding: 8 }}>
                      <option value="">Birim</option>
                      {units.map(u => <option key={u.id} value={u.id}>{u.name} ({u.code})</option>)}
                    </select>
                    <input placeholder="Stok" type="number" value={v.stock} onChange={(e) => { const copy = [...variants]; copy[idx].stock = parseInt(e.target.value || 0); setVariants(copy); }} style={{ padding: 8 }} />
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 12 }}>
                <button type="button" onClick={() => { setIsEditOpen(false); setEditProductId(null); }} style={{ padding: '8px 12px' }}>İptal</button>
                <button type="submit" style={{ padding: '8px 12px', background: '#14532d', color: 'white', border: 'none', borderRadius: 6 }}>{updateMutation.isLoading ? 'Güncelleniyor...' : 'Güncelle'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorProducts;
