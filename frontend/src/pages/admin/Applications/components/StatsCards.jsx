// src/pages/admin/Applications/components/StatsCards.jsx
import React from 'react';

/**
 * İstatistik kartları
 */
const StatsCards = ({ stats, activeFilter, onFilterChange }) => {
  const statCard = (color, isActive) => ({
    background: isActive ? color : 'white',
    padding: '20px',
    borderRadius: '16px',
    border: `1px solid ${isActive ? 'transparent' : '#e5e7eb'}`,
    cursor: 'pointer',
    transition: 'all 0.25s ease',
    boxShadow: isActive ? `0 8px 24px ${color}40` : '0 1px 3px rgba(0,0,0,0.05)',
  });

  const statValue = (isActive) => ({
    fontSize: '32px',
    fontWeight: '800',
    color: isActive ? 'white' : '#064e3b',
    marginBottom: '4px',
  });

  const statLabel = (isActive) => ({
    fontSize: '13px',
    fontWeight: '600',
    color: isActive ? 'rgba(255,255,255,0.85)' : '#6b7280',
  });

  const cardConfigs = [
    { key: 'all', label: 'Toplam', value: stats.total, color: '#10b981' },
    { key: 'pending', label: 'Beklemede', value: stats.pending, color: '#059669' },
    { key: 'approved', label: 'Onaylanan', value: stats.approved, color: '#047857' },
    { key: 'rejected', label: 'Reddedilen', value: stats.rejected, color: '#065f46' },
  ];

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: '16px',
      marginBottom: '24px',
    }}>
      {cardConfigs.map(({ key, label, value, color }) => (
        <div
          key={key}
          style={statCard(color, activeFilter === key)}
          onClick={() => onFilterChange(key)}
        >
          <div style={statValue(activeFilter === key)}>{value}</div>
          <div style={statLabel(activeFilter === key)}>{label}</div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;
