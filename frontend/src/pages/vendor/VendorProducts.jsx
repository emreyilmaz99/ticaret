import React, { useState } from 'react';
import { FaPlus, FaSearch, FaFilter, FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getVendorProducts, createVendorProduct, deleteVendorProduct, updateVendorProduct } from '../../features/vendor/api/productApi';
import { getVendorCategories } from '../../features/vendor/api/categoryApi';
import { getUnits } from '../../features/public/api/unitsApi';
import axios from '../../lib/axios';

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

  // collect existing SKUs from loaded products and variants for dropdown
  const skuSet = new Set();
  products.forEach(p => {
    if (p.sku) skuSet.add(p.sku);
    if (p.variants && Array.isArray(p.variants)) {
      p.variants.forEach(v => { if (v.sku) skuSet.add(v.sku); });
    }
  });
  const skuOptions = Array.from(skuSet);

  const backendOrigin = (axios.defaults.baseURL || '').replace(/\/api\/?$/i, '');
  const toFullUrl = (u) => {
    if (!u) return u;
    if (u.startsWith('http://') || u.startsWith('https://')) return u;
    if (u.startsWith('/')) return `${backendOrigin}${u}`;
    return `${backendOrigin}/${u}`;
  };

  const getCategoryName = (id) => {
    if (!id) return '';
    const found = categories.find(c => String(c.id) === String(id));
    return found ? found.name : '';
  };

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
    if (form.category_id) fd.append('category_id', form.category_id);
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

    // variants (if any)
    if (variants.length) {
      const sanitized = variants.map(v => ({
        title: v.title || null,
        sku: v.isCustom ? (v.sku_custom || null) : (v.sku || null),
        price: v.price || null,
        stock: typeof v.stock !== 'undefined' ? v.stock : 0,
        unit_id: v.unit_id || null,
      }));
      sanitized.forEach((v, i) => {
        Object.keys(v).forEach((key) => {
          if (v[key] !== null && typeof v[key] !== 'undefined') {
            fd.append(`variants[${i}][${key}]`, v[key]);
          }
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
    // populate variants if present — normalize to include isCustom / sku_custom
    const normalized = (product.variants ?? []).map(v => ({
      title: v.title ?? '',
      sku: v.sku ?? '',
      sku_custom: '',
      isCustom: false,
      price: v.price ?? '',
      stock: v.stock ?? 0,
      unit_id: v.unit_id ?? null,
    }));
    setVariants(normalized);
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

    // variants — sanitize to send only expected fields
    payload.variants = variants.map(v => ({
      title: v.title || null,
      sku: v.isCustom ? (v.sku_custom || null) : (v.sku || null),
      price: v.price || null,
      stock: typeof v.stock !== 'undefined' ? v.stock : 0,
      unit_id: v.unit_id || null,
    }));

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
                        <img src={toFullUrl(product.thumbnail || (product.photos && product.photos[0] && product.photos[0].url) || product.image) || 'https://placehold.co/50'} alt={product.name} style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover', backgroundColor: '#f1f5f9' }} />
                        <div>
                          <div style={{ fontWeight: '600', color: '#0f172a' }}>{product.name}</div>
                          <div style={{ fontSize: '12px', color: '#94a3b8' }}>ID: #{product.id}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '16px', color: '#475569' }}>{getCategoryName(product.category_id)}</td>
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
                  <button type="button" onClick={() => setVariants([...variants, { title: '', sku: '', sku_custom: '', isCustom: false, price: '', stock: 0, unit_id: '' }])} style={{ padding: '6px 10px' }}>Varyant Ekle</button>
                </div>
                {variants.map((v, idx) => (
                  <div key={idx} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 80px', gap: 8, marginBottom: 8 }}>
                    <input placeholder="Başlık" value={v.title} onChange={(e) => { const copy = [...variants]; copy[idx].title = e.target.value; setVariants(copy); }} style={{ padding: 8 }} />
                    {v.isCustom ? (
                      <input placeholder="SKU" value={v.sku_custom} onChange={(e) => { const copy = [...variants]; copy[idx].sku_custom = e.target.value; setVariants(copy); }} style={{ padding: 8 }} />
                    ) : (
                      <select value={v.sku || ''} onChange={(e) => { const copy = [...variants]; const val = e.target.value; if (val === '__custom__') { copy[idx].isCustom = true; copy[idx].sku_custom = ''; copy[idx].sku = ''; } else { copy[idx].sku = val; copy[idx].isCustom = false; } setVariants(copy); }} style={{ padding: 8 }}>
                        <option value="">SKU seçin</option>
                        {skuOptions.map(s => <option key={s} value={s}>{s}</option>)}
                        <option value="__custom__">Yeni SKU...</option>
                      </select>
                    )}
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
                <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                  <div style={{ minWidth: 220 }}>
                    {viewProduct.photos && viewProduct.photos.length ? (
                      <img src={toFullUrl(viewProduct.thumbnail || viewProduct.photos[0].url)} alt={viewProduct.name} style={{ width: '100%', height: 220, objectFit: 'cover', borderRadius: 8 }} />
                    ) : (
                      <div style={{ width: '100%', height: 220, background: '#f1f5f9', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>No image</div>
                    )}
                    {viewProduct.photos && viewProduct.photos.length > 1 && (
                      <div style={{ display: 'flex', gap: 8, marginTop: 8, overflowX: 'auto' }}>
                        {viewProduct.photos.map((p, i) => (
                          <img key={p.id || i} src={toFullUrl(p.url)} alt={p.alt || `photo-${i}`} style={{ width: 64, height: 64, objectFit: 'cover', borderRadius: 6, cursor: 'pointer', border: '1px solid #e6edf3' }} />
                        ))}
                      </div>
                    )}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ marginBottom: 8 }}>{viewProduct.name}</h3>
                    <div style={{ color: '#475569', marginBottom: 12 }}>ID: {viewProduct.id} • Tür: {viewProduct.type}</div>
                    <div style={{ color: '#475569', marginBottom: 8 }}>Kategori: {getCategoryName(viewProduct.category_id)}</div>
                  </div>
                </div>
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
                  <button type="button" onClick={() => setVariants([...variants, { title: '', sku: '', sku_custom: '', isCustom: false, price: '', stock: 0, unit_id: '' }])} style={{ padding: '6px 10px' }}>Varyant Ekle</button>
                </div>
                {variants.map((v, idx) => (
                  <div key={idx} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 80px', gap: 8, marginBottom: 8 }}>
                    <input placeholder="Başlık" value={v.title} onChange={(e) => { const copy = [...variants]; copy[idx].title = e.target.value; setVariants(copy); }} style={{ padding: 8 }} />
                    {v.isCustom ? (
                      <input placeholder="SKU" value={v.sku_custom} onChange={(e) => { const copy = [...variants]; copy[idx].sku_custom = e.target.value; setVariants(copy); }} style={{ padding: 8 }} />
                    ) : (
                      <select value={v.sku || ''} onChange={(e) => { const copy = [...variants]; const val = e.target.value; if (val === '__custom__') { copy[idx].isCustom = true; copy[idx].sku_custom = ''; copy[idx].sku = ''; } else { copy[idx].sku = val; copy[idx].isCustom = false; } setVariants(copy); }} style={{ padding: 8 }}>
                        <option value="">SKU seçin</option>
                        {skuOptions.map(s => <option key={s} value={s}>{s}</option>)}
                        <option value="__custom__">Yeni SKU...</option>
                      </select>
                    )}
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
