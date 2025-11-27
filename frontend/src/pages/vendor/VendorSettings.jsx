import React from 'react';
import { FaStore, FaImage, FaMapMarkerAlt, FaSave } from 'react-icons/fa';

const VendorSettings = () => {
  return (
    <div style={{ fontFamily: "'Inter', sans-serif", color: '#1e293b', maxWidth: '800px' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.5px' }}>Mağaza Ayarları</h1>
        <p style={{ color: '#64748b', fontSize: '14px', marginTop: '4px' }}>Mağaza profilinizi ve görünümünüzü özelleştirin.</p>
      </div>

      {/* Tabs (Visual Only) */}
      <div style={{ display: 'flex', gap: '24px', borderBottom: '1px solid #e2e8f0', marginBottom: '32px' }}>
        <button style={{ padding: '0 0 16px 0', border: 'none', background: 'none', borderBottom: '2px solid #14532d', color: '#14532d', fontWeight: '600', cursor: 'pointer' }}>Genel Bilgiler</button>
        <button style={{ padding: '0 0 16px 0', border: 'none', background: 'none', color: '#64748b', fontWeight: '500', cursor: 'pointer' }}>Görünüm</button>
        <button style={{ padding: '0 0 16px 0', border: 'none', background: 'none', color: '#64748b', fontWeight: '500', cursor: 'pointer' }}>Adres & İletişim</button>
      </div>

      {/* Form Section */}
      <div style={{ backgroundColor: 'white', padding: '32px', borderRadius: '24px', border: '1px solid #f1f5f9', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.02)' }}>
        
        {/* Logo & Banner Upload */}
        <div style={{ marginBottom: '32px' }}>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#0f172a', marginBottom: '12px' }}>Mağaza Logosu</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', border: '2px dashed #cbd5e1' }}>
              <FaImage size={24} />
            </div>
            <div>
              <button style={{ padding: '8px 16px', backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '8px', fontWeight: '600', color: '#475569', cursor: 'pointer', marginRight: '12px' }}>Yükle</button>
              <button style={{ padding: '8px 16px', backgroundColor: 'transparent', border: 'none', color: '#ef4444', fontWeight: '600', cursor: 'pointer' }}>Kaldır</button>
              <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '8px' }}>Önerilen boyut: 400x400px. Max: 2MB</p>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#0f172a', marginBottom: '8px' }}>Mağaza Adı</label>
            <div style={{ position: 'relative' }}>
              <FaStore style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input type="text" defaultValue="TeknoStore" style={{ width: '100%', padding: '12px 12px 12px 40px', borderRadius: '10px', border: '1px solid #e2e8f0', outline: 'none' }} />
            </div>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#0f172a', marginBottom: '8px' }}>E-posta Adresi</label>
            <input type="email" defaultValue="info@teknostore.com" disabled style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #f1f5f9', backgroundColor: '#f8fafc', color: '#94a3b8' }} />
          </div>
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#0f172a', marginBottom: '8px' }}>Mağaza Açıklaması</label>
          <textarea rows="4" defaultValue="En yeni teknolojik ürünleri en uygun fiyatlarla sunuyoruz." style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0', outline: 'none', resize: 'vertical', fontFamily: 'inherit' }}></textarea>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button style={{ 
            backgroundColor: '#14532d', 
            color: 'white', 
            border: 'none', 
            padding: '12px 32px', 
            borderRadius: '10px', 
            fontWeight: '600', 
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 4px 12px rgba(20, 83, 45, 0.2)'
          }}>
            <FaSave /> Değişiklikleri Kaydet
          </button>
        </div>

      </div>
    </div>
  );
};

export default VendorSettings;
