import React from 'react';
import { FaCheck, FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const MOCK_PENDING_VENDORS = [
  { id: 1, name: 'Moda Dünyası', owner: 'Selin Kara', date: '27 Kas 2025' },
  { id: 2, name: 'Organik Pazar', owner: 'Mehmet Öz', date: '26 Kas 2025' },
  { id: 3, name: 'Tech Store', owner: 'Ali Veli', date: '25 Kas 2025' },
];

export const PendingApprovals = () => {
  const navigate = useNavigate();

  const handleViewAll = () => {
    navigate('/admin/vendors');
  };

  return (
    <div style={{ 
      backgroundColor: 'var(--bg-card)', 
      padding: '24px', 
      borderRadius: 'var(--radius)', 
      boxShadow: 'var(--shadow-sm)',
      border: '1px solid #e2e8f0',
      height: '100%'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-main)' }}>Bekleyen Satıcı Onayları</h3>
        <span style={{ 
          backgroundColor: '#fee2e2', 
          color: '#991b1b', 
          fontSize: '12px', 
          fontWeight: '700', 
          padding: '2px 8px', 
          borderRadius: '12px' 
        }}>
          {MOCK_PENDING_VENDORS.length} Yeni
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {MOCK_PENDING_VENDORS.map((vendor) => (
          <div key={vendor.id} style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            padding: '16px',
            backgroundColor: '#f8fafc',
            borderRadius: '8px',
            border: '1px solid #f1f5f9'
          }}>
            <div>
              <div style={{ fontWeight: '600', color: 'var(--text-main)', fontSize: '14px' }}>{vendor.name}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{vendor.owner} • {vendor.date}</div>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button style={{ 
                width: '32px', 
                height: '32px', 
                borderRadius: '6px', 
                border: 'none', 
                backgroundColor: '#dcfce7', 
                color: '#166534', 
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }} title="Onayla">
                <FaCheck size={12} />
              </button>
              <button style={{ 
                width: '32px', 
                height: '32px', 
                borderRadius: '6px', 
                border: 'none', 
                backgroundColor: '#fee2e2', 
                color: '#991b1b', 
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }} title="Reddet">
                <FaTimes size={12} />
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <button 
        onClick={handleViewAll}
        style={{ 
          width: '100%', 
          marginTop: '16px', 
          padding: '12px', 
          backgroundColor: 'white', 
          border: '1px solid #e2e8f0', 
          borderRadius: '6px', 
          color: 'var(--text-muted)', 
          fontSize: '13px', 
          fontWeight: '600',
          cursor: 'pointer',
          transition: 'all 0.2s'
        }}
      >
        Tüm Başvuruları Gör
      </button>
    </div>
  );
};
