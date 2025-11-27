import React from 'react';
import { FaUserPlus, FaStore, FaBoxOpen, FaCog, FaExclamationCircle } from 'react-icons/fa';

const MOCK_ACTIVITIES = [
  { id: 1, type: 'vendor_register', message: 'Yeni satıcı başvurusu: "TeknoStore"', time: '5 dk önce', icon: <FaStore />, color: '#3b82f6' },
  { id: 2, type: 'user_register', message: 'Yeni üye: Ayşe Yılmaz', time: '12 dk önce', icon: <FaUserPlus />, color: '#10b981' },
  { id: 3, type: 'product_added', message: '"Oyun Bilgisayarı" stoğa eklendi', time: '45 dk önce', icon: <FaBoxOpen />, color: '#8b5cf6' },
  { id: 4, type: 'system_alert', message: 'Sistem yedeklemesi tamamlandı', time: '2 saat önce', icon: <FaCog />, color: '#64748b' },
  { id: 5, type: 'report', message: 'Ürün şikayeti: #PRD-992', time: '3 saat önce', icon: <FaExclamationCircle />, color: '#ef4444' },
];

export const ActivityTimeline = () => {
  return (
    <div style={{ 
      backgroundColor: 'var(--bg-card)', 
      padding: '24px', 
      borderRadius: 'var(--radius)', 
      boxShadow: 'var(--shadow-sm)',
      border: '1px solid #e2e8f0',
      height: '100%'
    }}>
      <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-main)', marginBottom: '24px' }}>Son Aktiviteler</h3>
      
      <div style={{ position: 'relative', paddingLeft: '12px' }}>
        {/* Dikey Çizgi */}
        <div style={{ 
          position: 'absolute', 
          left: '23px', 
          top: '10px', 
          bottom: '10px', 
          width: '2px', 
          backgroundColor: '#f1f5f9',
          zIndex: 0
        }}></div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {MOCK_ACTIVITIES.map((activity) => (
            <div key={activity.id} style={{ display: 'flex', gap: '16px', position: 'relative', zIndex: 1 }}>
              {/* İkon */}
              <div style={{ 
                width: '24px', 
                height: '24px', 
                borderRadius: '50%', 
                backgroundColor: activity.color, 
                color: 'white',
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                fontSize: '10px',
                boxShadow: '0 0 0 4px white' // Çizgiyi kesmek için beyaz kenarlık
              }}>
                {activity.icon}
              </div>

              {/* İçerik */}
              <div>
                <p style={{ fontSize: '14px', color: 'var(--text-main)', fontWeight: '500', margin: 0 }}>{activity.message}</p>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{activity.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
