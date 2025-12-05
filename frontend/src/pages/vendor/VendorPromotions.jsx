import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '../../components/Toast';
import { 
  FaTag, FaGift, FaPlus, FaEdit, FaTrash, FaToggleOn, FaToggleOff, 
  FaSpinner, FaInfoCircle, FaSave, FaTimes, FaPercent, FaCalendarAlt,
  FaBox, FaSearch, FaCheck
} from 'react-icons/fa';
import axios from '../../lib/axios';

const VendorPromotions = () => {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const toast = useToast();
  
  const [activeTab, setActiveTab] = useState('coupons'); // 'coupons' | 'campaigns'
  
  // Modal states
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [showCampaignModal, setShowCampaignModal] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [editingCampaign, setEditingCampaign] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('vendor_token');
    if (!token) {
      navigate('/vendor/login');
    }
  }, [navigate]);

  // ============ COUPONS ============
  const { data: couponsData, isLoading: couponsLoading } = useQuery({
    queryKey: ['vendor', 'coupons'],
    queryFn: async () => {
      const res = await axios.get('/v1/vendor/coupons');
      return res.data;
    }
  });

  const createCouponMutation = useMutation({
    mutationFn: async (data) => {
      const res = await axios.post('/v1/vendor/coupons', data);
      return res.data;
    },
    onSuccess: (data) => {
      toast.success('Başarılı', data.message || 'Kupon oluşturuldu');
      qc.invalidateQueries({ queryKey: ['vendor', 'coupons'] });
      setShowCouponModal(false);
    },
    onError: (err) => {
      toast.error('Hata', err.response?.data?.message || 'Kupon oluşturulamadı');
    }
  });

  const updateCouponMutation = useMutation({
    mutationFn: async ({ id, data }) => {
      const res = await axios.put(`/v1/vendor/coupons/${id}`, data);
      return res.data;
    },
    onSuccess: (data) => {
      toast.success('Başarılı', data.message || 'Kupon güncellendi');
      qc.invalidateQueries({ queryKey: ['vendor', 'coupons'] });
      setShowCouponModal(false);
      setEditingCoupon(null);
    },
    onError: (err) => {
      toast.error('Hata', err.response?.data?.message || 'Güncelleme başarısız');
    }
  });

  const deleteCouponMutation = useMutation({
    mutationFn: async (id) => {
      const res = await axios.delete(`/v1/vendor/coupons/${id}`);
      return res.data;
    },
    onSuccess: (data) => {
      toast.success('Başarılı', data.message || 'Kupon silindi');
      qc.invalidateQueries({ queryKey: ['vendor', 'coupons'] });
    },
    onError: (err) => {
      toast.error('Hata', err.response?.data?.message || 'Silme başarısız');
    }
  });

  const toggleCouponMutation = useMutation({
    mutationFn: async (id) => {
      const res = await axios.put(`/v1/vendor/coupons/${id}/toggle`);
      return res.data;
    },
    onSuccess: (data) => {
      toast.success('Başarılı', data.message);
      qc.invalidateQueries({ queryKey: ['vendor', 'coupons'] });
    },
    onError: (err) => {
      toast.error('Hata', err.response?.data?.message || 'İşlem başarısız');
    }
  });

  // ============ CAMPAIGNS ============
  const { data: campaignsData, isLoading: campaignsLoading } = useQuery({
    queryKey: ['vendor', 'campaigns'],
    queryFn: async () => {
      const res = await axios.get('/v1/vendor/campaigns');
      return res.data;
    }
  });

  const { data: productsData } = useQuery({
    queryKey: ['vendor', 'products-for-campaign'],
    queryFn: async () => {
      const res = await axios.get('/v1/vendor/products?per_page=1000');
      return res.data;
    }
  });

  const createCampaignMutation = useMutation({
    mutationFn: async (data) => {
      const res = await axios.post('/v1/vendor/campaigns', data);
      return res.data;
    },
    onSuccess: (data) => {
      toast.success('Başarılı', data.message || 'Kampanya oluşturuldu');
      qc.invalidateQueries({ queryKey: ['vendor', 'campaigns'] });
      setShowCampaignModal(false);
    },
    onError: (err) => {
      toast.error('Hata', err.response?.data?.message || 'Kampanya oluşturulamadı');
    }
  });

  const updateCampaignMutation = useMutation({
    mutationFn: async ({ id, data }) => {
      const res = await axios.put(`/v1/vendor/campaigns/${id}`, data);
      return res.data;
    },
    onSuccess: (data) => {
      toast.success('Başarılı', data.message || 'Kampanya güncellendi');
      qc.invalidateQueries({ queryKey: ['vendor', 'campaigns'] });
      setShowCampaignModal(false);
      setEditingCampaign(null);
    },
    onError: (err) => {
      toast.error('Hata', err.response?.data?.message || 'Güncelleme başarısız');
    }
  });

  const deleteCampaignMutation = useMutation({
    mutationFn: async (id) => {
      const res = await axios.delete(`/v1/vendor/campaigns/${id}`);
      return res.data;
    },
    onSuccess: (data) => {
      toast.success('Başarılı', data.message || 'Kampanya silindi');
      qc.invalidateQueries({ queryKey: ['vendor', 'campaigns'] });
    },
    onError: (err) => {
      toast.error('Hata', err.response?.data?.message || 'Silme başarısız');
    }
  });

  const toggleCampaignMutation = useMutation({
    mutationFn: async (id) => {
      const res = await axios.put(`/v1/vendor/campaigns/${id}/toggle`);
      return res.data;
    },
    onSuccess: (data) => {
      toast.success('Başarılı', data.message);
      qc.invalidateQueries({ queryKey: ['vendor', 'campaigns'] });
    },
    onError: (err) => {
      toast.error('Hata', err.response?.data?.message || 'İşlem başarısız');
    }
  });

  const coupons = couponsData?.data || [];
  const campaigns = campaignsData?.data || [];
  const products = productsData?.data?.products || productsData?.data || [];

  const tabStyle = (isActive) => ({
    padding: '12px 24px',
    backgroundColor: isActive ? '#14532d' : 'white',
    color: isActive ? 'white' : '#64748b',
    border: isActive ? 'none' : '1px solid #e2e8f0',
    borderRadius: '10px',
    fontWeight: '600',
    fontSize: '14px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'all 0.2s'
  });

  const cardStyle = {
    backgroundColor: 'white',
    borderRadius: '16px',
    border: '1px solid #f1f5f9',
    padding: '20px',
    marginBottom: '16px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
  };

  const buttonStyle = {
    padding: '10px 20px',
    backgroundColor: '#14532d',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    fontWeight: '600',
    fontSize: '14px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  };

  const isLoading = couponsLoading || campaignsLoading;

  if (isLoading) {
    return (
      <div style={{ padding: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 400 }}>
        <FaSpinner className="spin" style={{ fontSize: 32, color: '#64748b' }} />
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", color: '#1e293b', maxWidth: '1000px' }}>
      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .spin { animation: spin 1s linear infinite; }
        input:focus, select:focus, textarea:focus { border-color: #14532d !important; box-shadow: 0 0 0 3px rgba(20, 83, 45, 0.1); outline: none; }
      `}</style>
      
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.5px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <FaGift style={{ color: '#14532d' }} /> Promosyonlar
        </h1>
        <p style={{ color: '#64748b', fontSize: '14px', marginTop: '4px' }}>
          Kupon kodları ve kampanyalar oluşturarak müşterilerinize özel indirimler sunun.
        </p>
      </div>

      {/* Info Card */}
      <div style={{ 
        backgroundColor: '#f0fdf4', 
        border: '1px solid #bbf7d0', 
        borderRadius: '16px', 
        padding: '20px 24px', 
        marginBottom: '24px',
        display: 'flex',
        gap: '16px',
        alignItems: 'flex-start'
      }}>
        <FaInfoCircle style={{ color: '#16a34a', fontSize: '20px', marginTop: '2px', flexShrink: 0 }} />
        <div>
          <p style={{ fontWeight: '600', color: '#15803d', marginBottom: '4px', fontSize: '14px' }}>Nasıl Çalışır?</p>
          <p style={{ color: '#166534', fontSize: '13px', lineHeight: '1.6', margin: 0 }}>
            <strong>Kuponlar:</strong> Müşteriler sepette kupon kodunu girerek sabit tutar indirimi alır. Minimum sepet tutarı belirleyebilirsiniz.<br/>
            <strong>Kampanyalar:</strong> "3 al 2 öde" gibi kampanyalar için ürün seçerek otomatik indirim sağlayın.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
        <button style={tabStyle(activeTab === 'coupons')} onClick={() => setActiveTab('coupons')}>
          <FaTag /> Kuponlar ({coupons.length})
        </button>
        <button style={tabStyle(activeTab === 'campaigns')} onClick={() => setActiveTab('campaigns')}>
          <FaBox /> Kampanyalar ({campaigns.length})
        </button>
      </div>

      {/* Content */}
      {activeTab === 'coupons' && (
        <CouponsTab 
          coupons={coupons}
          onAdd={() => { setEditingCoupon(null); setShowCouponModal(true); }}
          onEdit={(coupon) => { setEditingCoupon(coupon); setShowCouponModal(true); }}
          onDelete={(id) => { if(confirm('Kuponu silmek istediğinize emin misiniz?')) deleteCouponMutation.mutate(id); }}
          onToggle={(id) => toggleCouponMutation.mutate(id)}
          cardStyle={cardStyle}
          buttonStyle={buttonStyle}
        />
      )}

      {activeTab === 'campaigns' && (
        <CampaignsTab 
          campaigns={campaigns}
          onAdd={() => { setEditingCampaign(null); setShowCampaignModal(true); }}
          onEdit={(campaign) => { setEditingCampaign(campaign); setShowCampaignModal(true); }}
          onDelete={(id) => { if(confirm('Kampanyayı silmek istediğinize emin misiniz?')) deleteCampaignMutation.mutate(id); }}
          onToggle={(id) => toggleCampaignMutation.mutate(id)}
          cardStyle={cardStyle}
          buttonStyle={buttonStyle}
        />
      )}

      {/* Coupon Modal */}
      {showCouponModal && (
        <CouponModal
          coupon={editingCoupon}
          onClose={() => { setShowCouponModal(false); setEditingCoupon(null); }}
          onSave={(data) => {
            if (editingCoupon) {
              updateCouponMutation.mutate({ id: editingCoupon.id, data });
            } else {
              createCouponMutation.mutate(data);
            }
          }}
          isLoading={createCouponMutation.isPending || updateCouponMutation.isPending}
        />
      )}

      {/* Campaign Modal */}
      {showCampaignModal && (
        <CampaignModal
          campaign={editingCampaign}
          products={products}
          onClose={() => { setShowCampaignModal(false); setEditingCampaign(null); }}
          onSave={(data) => {
            if (editingCampaign) {
              updateCampaignMutation.mutate({ id: editingCampaign.id, data });
            } else {
              createCampaignMutation.mutate(data);
            }
          }}
          isLoading={createCampaignMutation.isPending || updateCampaignMutation.isPending}
        />
      )}
    </div>
  );
};

// ============ COUPONS TAB ============
const CouponsTab = ({ coupons, onAdd, onEdit, onDelete, onToggle, cardStyle, buttonStyle }) => {
  const formatDate = (date) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('tr-TR');
  };

  const isExpired = (coupon) => {
    if (!coupon.expires_at) return false;
    return new Date(coupon.expires_at) < new Date();
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
        <button style={buttonStyle} onClick={onAdd}>
          <FaPlus /> Yeni Kupon
        </button>
      </div>

      {coupons.length === 0 ? (
        <div style={{ ...cardStyle, textAlign: 'center', padding: '60px 20px' }}>
          <FaTag style={{ fontSize: '48px', color: '#cbd5e1', marginBottom: '16px' }} />
          <p style={{ color: '#64748b', fontSize: '15px' }}>Henüz kupon oluşturmadınız.</p>
          <button style={{ ...buttonStyle, margin: '16px auto 0' }} onClick={onAdd}>
            <FaPlus /> İlk Kuponu Oluştur
          </button>
        </div>
      ) : (
        coupons.map((coupon) => (
          <div key={coupon.id} style={{ ...cardStyle, opacity: coupon.is_active ? 1 : 0.6 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                  <span style={{ 
                    backgroundColor: '#f0fdf4', 
                    color: '#16a34a', 
                    padding: '6px 12px', 
                    borderRadius: '8px', 
                    fontWeight: '700',
                    fontSize: '14px',
                    fontFamily: 'monospace'
                  }}>
                    {coupon.code}
                  </span>
                  <span style={{ fontWeight: '600', color: '#0f172a', fontSize: '15px' }}>{coupon.name}</span>
                  {!coupon.is_active && (
                    <span style={{ backgroundColor: '#fef2f2', color: '#dc2626', padding: '4px 8px', borderRadius: '6px', fontSize: '12px' }}>
                      Pasif
                    </span>
                  )}
                  {isExpired(coupon) && (
                    <span style={{ backgroundColor: '#fef2f2', color: '#dc2626', padding: '4px 8px', borderRadius: '6px', fontSize: '12px' }}>
                      Süresi Doldu
                    </span>
                  )}
                </div>
                
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', fontSize: '13px', color: '#64748b' }}>
                  <span><strong style={{ color: '#14532d' }}>{parseFloat(coupon.discount_amount).toFixed(0)}₺</strong> indirim</span>
                  <span>Min. sepet: <strong>{parseFloat(coupon.min_order_amount).toFixed(0)}₺</strong></span>
                  {coupon.usage_limit && <span>Limit: {coupon.usage_count}/{coupon.usage_limit}</span>}
                  <span>Tarih: {formatDate(coupon.starts_at)} - {formatDate(coupon.expires_at)}</span>
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <button 
                  onClick={() => onToggle(coupon.id)}
                  style={{ 
                    background: 'none', 
                    border: 'none', 
                    cursor: 'pointer', 
                    fontSize: '28px',
                    color: coupon.is_active ? '#16a34a' : '#cbd5e1'
                  }}
                >
                  {coupon.is_active ? <FaToggleOn /> : <FaToggleOff />}
                </button>
                <button 
                  onClick={() => onEdit(coupon)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', fontSize: '16px' }}
                >
                  <FaEdit />
                </button>
                <button 
                  onClick={() => onDelete(coupon.id)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#dc2626', fontSize: '16px' }}
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

// ============ CAMPAIGNS TAB ============
const CampaignsTab = ({ campaigns, onAdd, onEdit, onDelete, onToggle, cardStyle, buttonStyle }) => {
  const formatDate = (date) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('tr-TR');
  };

  const isExpired = (campaign) => {
    return new Date(campaign.ends_at) < new Date();
  };

  const isNotStarted = (campaign) => {
    return new Date(campaign.starts_at) > new Date();
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
        <button style={buttonStyle} onClick={onAdd}>
          <FaPlus /> Yeni Kampanya
        </button>
      </div>

      {campaigns.length === 0 ? (
        <div style={{ ...cardStyle, textAlign: 'center', padding: '60px 20px' }}>
          <FaBox style={{ fontSize: '48px', color: '#cbd5e1', marginBottom: '16px' }} />
          <p style={{ color: '#64748b', fontSize: '15px' }}>Henüz kampanya oluşturmadınız.</p>
          <button style={{ ...buttonStyle, margin: '16px auto 0' }} onClick={onAdd}>
            <FaPlus /> İlk Kampanyayı Oluştur
          </button>
        </div>
      ) : (
        campaigns.map((campaign) => (
          <div key={campaign.id} style={{ ...cardStyle, opacity: campaign.is_active ? 1 : 0.6 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                  <span style={{ 
                    backgroundColor: '#fef3c7', 
                    color: '#d97706', 
                    padding: '6px 12px', 
                    borderRadius: '8px', 
                    fontWeight: '700',
                    fontSize: '14px'
                  }}>
                    {campaign.buy_quantity} Al {campaign.pay_quantity} Öde
                  </span>
                  <span style={{ fontWeight: '600', color: '#0f172a', fontSize: '15px' }}>{campaign.name}</span>
                  {!campaign.is_active && (
                    <span style={{ backgroundColor: '#fef2f2', color: '#dc2626', padding: '4px 8px', borderRadius: '6px', fontSize: '12px' }}>
                      Pasif
                    </span>
                  )}
                  {isExpired(campaign) && (
                    <span style={{ backgroundColor: '#fef2f2', color: '#dc2626', padding: '4px 8px', borderRadius: '6px', fontSize: '12px' }}>
                      Sona Erdi
                    </span>
                  )}
                  {isNotStarted(campaign) && (
                    <span style={{ backgroundColor: '#eff6ff', color: '#2563eb', padding: '4px 8px', borderRadius: '6px', fontSize: '12px' }}>
                      Başlamadı
                    </span>
                  )}
                </div>
                
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', fontSize: '13px', color: '#64748b', marginBottom: '8px' }}>
                  <span>Tarih: {formatDate(campaign.starts_at)} - {formatDate(campaign.ends_at)}</span>
                </div>

                {campaign.products && campaign.products.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {campaign.products.slice(0, 5).map(product => (
                      <span key={product.id} style={{ 
                        backgroundColor: '#f1f5f9', 
                        color: '#475569', 
                        padding: '4px 10px', 
                        borderRadius: '6px', 
                        fontSize: '12px' 
                      }}>
                        {product.name}
                      </span>
                    ))}
                    {campaign.products.length > 5 && (
                      <span style={{ color: '#64748b', fontSize: '12px', padding: '4px' }}>
                        +{campaign.products.length - 5} ürün daha
                      </span>
                    )}
                  </div>
                )}
              </div>
              
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <button 
                  onClick={() => onToggle(campaign.id)}
                  style={{ 
                    background: 'none', 
                    border: 'none', 
                    cursor: 'pointer', 
                    fontSize: '28px',
                    color: campaign.is_active ? '#16a34a' : '#cbd5e1'
                  }}
                >
                  {campaign.is_active ? <FaToggleOn /> : <FaToggleOff />}
                </button>
                <button 
                  onClick={() => onEdit(campaign)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', fontSize: '16px' }}
                >
                  <FaEdit />
                </button>
                <button 
                  onClick={() => onDelete(campaign.id)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#dc2626', fontSize: '16px' }}
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

// ============ COUPON MODAL ============
const CouponModal = ({ coupon, onClose, onSave, isLoading }) => {
  const [form, setForm] = useState({
    code: coupon?.code || '',
    name: coupon?.name || '',
    description: coupon?.description || '',
    discount_amount: coupon?.discount_amount || 50,
    min_order_amount: coupon?.min_order_amount || 0,
    usage_limit: coupon?.usage_limit || '',
    usage_limit_per_user: coupon?.usage_limit_per_user || '',
    starts_at: coupon?.starts_at ? coupon.starts_at.split('T')[0] : '',
    expires_at: coupon?.expires_at ? coupon.expires_at.split('T')[0] : '',
    is_active: coupon?.is_active ?? true
  });

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'number' ? (value === '' ? '' : parseFloat(value)) : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = { ...form };
    if (data.usage_limit === '') data.usage_limit = null;
    if (data.usage_limit_per_user === '') data.usage_limit_per_user = null;
    if (data.starts_at === '') data.starts_at = null;
    if (data.expires_at === '') data.expires_at = null;
    onSave(data);
  };

  const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    borderRadius: '10px',
    border: '1px solid #e2e8f0',
    fontSize: '14px',
    boxSizing: 'border-box'
  };

  const labelStyle = {
    display: 'block',
    fontSize: '13px',
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: '6px'
  };

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
        borderRadius: '20px',
        padding: '32px',
        width: '100%',
        maxWidth: '500px',
        maxHeight: '90vh',
        overflow: 'auto'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#0f172a' }}>
            {coupon ? 'Kuponu Düzenle' : 'Yeni Kupon'}
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px', color: '#64748b' }}>
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gap: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={labelStyle}>Kupon Kodu *</label>
                <input
                  type="text"
                  name="code"
                  value={form.code}
                  onChange={handleChange}
                  style={{ ...inputStyle, textTransform: 'uppercase' }}
                  placeholder="YAZ50"
                  required
                  maxLength={50}
                />
              </div>
              <div>
                <label style={labelStyle}>İndirim Tutarı (₺) *</label>
                <input
                  type="number"
                  name="discount_amount"
                  value={form.discount_amount}
                  onChange={handleChange}
                  style={inputStyle}
                  min="1"
                  step="0.01"
                  required
                />
              </div>
            </div>

            <div>
              <label style={labelStyle}>Kupon Adı *</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                style={inputStyle}
                placeholder="Yaz İndirimi"
                required
              />
            </div>

            <div>
              <label style={labelStyle}>Açıklama</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                style={{ ...inputStyle, minHeight: '60px', resize: 'vertical' }}
                placeholder="Kupon açıklaması (opsiyonel)"
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={labelStyle}>Min. Sepet Tutarı (₺)</label>
                <input
                  type="number"
                  name="min_order_amount"
                  value={form.min_order_amount}
                  onChange={handleChange}
                  style={inputStyle}
                  min="0"
                  step="0.01"
                />
              </div>
              <div>
                <label style={labelStyle}>Toplam Kullanım Limiti</label>
                <input
                  type="number"
                  name="usage_limit"
                  value={form.usage_limit}
                  onChange={handleChange}
                  style={inputStyle}
                  min="1"
                  placeholder="Sınırsız"
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={labelStyle}>Başlangıç Tarihi</label>
                <input
                  type="date"
                  name="starts_at"
                  value={form.starts_at}
                  onChange={handleChange}
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Bitiş Tarihi</label>
                <input
                  type="date"
                  name="expires_at"
                  value={form.expires_at}
                  onChange={handleChange}
                  style={inputStyle}
                />
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '24px', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '12px 24px',
                backgroundColor: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: '10px',
                fontWeight: '600',
                color: '#64748b',
                cursor: 'pointer'
              }}
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={isLoading}
              style={{
                padding: '12px 24px',
                background: 'linear-gradient(135deg, #14532d 0%, #166534 100%)',
                border: 'none',
                borderRadius: '10px',
                fontWeight: '600',
                color: 'white',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                opacity: isLoading ? 0.7 : 1
              }}
            >
              {isLoading ? <><FaSpinner className="spin" /> Kaydediliyor...</> : <><FaSave /> Kaydet</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ============ CAMPAIGN MODAL ============
const CampaignModal = ({ campaign, products, onClose, onSave, isLoading }) => {
  const [form, setForm] = useState({
    name: campaign?.name || '',
    description: campaign?.description || '',
    buy_quantity: campaign?.buy_quantity || 3,
    pay_quantity: campaign?.pay_quantity || 2,
    starts_at: campaign?.starts_at ? campaign.starts_at.split('T')[0] : '',
    ends_at: campaign?.ends_at ? campaign.ends_at.split('T')[0] : '',
    is_active: campaign?.is_active ?? true,
    product_ids: campaign?.products?.map(p => p.id) || []
  });

  const [searchTerm, setSearchTerm] = useState('');

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) || 0 : value
    }));
  };

  const toggleProduct = (productId) => {
    setForm(prev => ({
      ...prev,
      product_ids: prev.product_ids.includes(productId)
        ? prev.product_ids.filter(id => id !== productId)
        : [...prev.product_ids, productId]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.product_ids.length === 0) {
      alert('En az bir ürün seçmelisiniz.');
      return;
    }
    if (form.pay_quantity >= form.buy_quantity) {
      alert('Ödenecek adet, alınacak adetten az olmalıdır.');
      return;
    }
    onSave(form);
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    borderRadius: '10px',
    border: '1px solid #e2e8f0',
    fontSize: '14px',
    boxSizing: 'border-box'
  };

  const labelStyle = {
    display: 'block',
    fontSize: '13px',
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: '6px'
  };

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
        borderRadius: '20px',
        padding: '32px',
        width: '100%',
        maxWidth: '600px',
        maxHeight: '90vh',
        overflow: 'auto'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#0f172a' }}>
            {campaign ? 'Kampanyayı Düzenle' : 'Yeni Kampanya'}
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px', color: '#64748b' }}>
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gap: '16px' }}>
            <div>
              <label style={labelStyle}>Kampanya Adı *</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                style={inputStyle}
                placeholder="3 Al 2 Öde Kampanyası"
                required
              />
            </div>

            <div>
              <label style={labelStyle}>Açıklama</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                style={{ ...inputStyle, minHeight: '60px', resize: 'vertical' }}
                placeholder="Kampanya açıklaması (opsiyonel)"
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={labelStyle}>Alınacak Adet *</label>
                <input
                  type="number"
                  name="buy_quantity"
                  value={form.buy_quantity}
                  onChange={handleChange}
                  style={inputStyle}
                  min="2"
                  required
                />
                <p style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>Müşterinin alması gereken adet</p>
              </div>
              <div>
                <label style={labelStyle}>Ödenecek Adet *</label>
                <input
                  type="number"
                  name="pay_quantity"
                  value={form.pay_quantity}
                  onChange={handleChange}
                  style={inputStyle}
                  min="1"
                  required
                />
                <p style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>Müşterinin ödeyeceği adet</p>
              </div>
            </div>

            {/* Preview */}
            <div style={{ 
              backgroundColor: '#fef3c7', 
              border: '1px solid #fcd34d', 
              borderRadius: '10px', 
              padding: '12px 16px',
              textAlign: 'center'
            }}>
              <span style={{ fontWeight: '700', color: '#92400e', fontSize: '16px' }}>
                {form.buy_quantity} Al {form.pay_quantity} Öde
              </span>
              <span style={{ color: '#a16207', fontSize: '13px', marginLeft: '8px' }}>
                ({form.buy_quantity - form.pay_quantity} ürün bedava!)
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={labelStyle}>Başlangıç Tarihi *</label>
                <input
                  type="date"
                  name="starts_at"
                  value={form.starts_at}
                  onChange={handleChange}
                  style={inputStyle}
                  required
                />
              </div>
              <div>
                <label style={labelStyle}>Bitiş Tarihi *</label>
                <input
                  type="date"
                  name="ends_at"
                  value={form.ends_at}
                  onChange={handleChange}
                  style={inputStyle}
                  required
                />
              </div>
            </div>

            {/* Product Selection */}
            <div>
              <label style={labelStyle}>Geçerli Ürünler * ({form.product_ids.length} seçili)</label>
              <div style={{ position: 'relative', marginBottom: '12px' }}>
                <FaSearch style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ ...inputStyle, paddingLeft: '40px' }}
                  placeholder="Ürün ara..."
                />
              </div>
              <div style={{ 
                border: '1px solid #e2e8f0', 
                borderRadius: '10px', 
                maxHeight: '200px', 
                overflow: 'auto'
              }}>
                {filteredProducts.length === 0 ? (
                  <div style={{ padding: '20px', textAlign: 'center', color: '#94a3b8' }}>
                    Ürün bulunamadı
                  </div>
                ) : (
                  filteredProducts.map(product => (
                    <div 
                      key={product.id}
                      onClick={() => toggleProduct(product.id)}
                      style={{ 
                        padding: '12px 16px',
                        borderBottom: '1px solid #f1f5f9',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        backgroundColor: form.product_ids.includes(product.id) ? '#f0fdf4' : 'white',
                        transition: 'background-color 0.15s'
                      }}
                    >
                      <div style={{ 
                        width: '22px', 
                        height: '22px', 
                        borderRadius: '6px',
                        border: form.product_ids.includes(product.id) ? 'none' : '2px solid #cbd5e1',
                        backgroundColor: form.product_ids.includes(product.id) ? '#16a34a' : 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        {form.product_ids.includes(product.id) && <FaCheck style={{ color: 'white', fontSize: '12px' }} />}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontWeight: '500', color: '#0f172a', fontSize: '14px', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {product.name}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '24px', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '12px 24px',
                backgroundColor: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: '10px',
                fontWeight: '600',
                color: '#64748b',
                cursor: 'pointer'
              }}
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={isLoading}
              style={{
                padding: '12px 24px',
                background: 'linear-gradient(135deg, #14532d 0%, #166534 100%)',
                border: 'none',
                borderRadius: '10px',
                fontWeight: '600',
                color: 'white',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                opacity: isLoading ? 0.7 : 1
              }}
            >
              {isLoading ? <><FaSpinner className="spin" /> Kaydediliyor...</> : <><FaSave /> Kaydet</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VendorPromotions;
