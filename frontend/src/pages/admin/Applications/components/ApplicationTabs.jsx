// src/pages/admin/Applications/components/ApplicationTabs.jsx
import React from 'react';
import { FaFileAlt, FaUserCheck } from 'react-icons/fa';

/**
 * Pre/Full Applications tab değiştirici
 */
const ApplicationTabs = ({ 
  activeTab, 
  onTabChange, 
  preCount = 0, 
  fullCount = 0 
}) => {
  const tabContainerStyle = {
    display: 'flex',
    gap: '8px',
    marginBottom: '24px',
    background: '#f3f4f6',
    padding: '6px',
    borderRadius: '16px',
    width: 'fit-content'
  };

  const getTabStyle = (isActive) => ({
    padding: '12px 24px',
    borderRadius: '12px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'all 0.2s ease',
    background: isActive ? 'white' : 'transparent',
    color: isActive ? '#059669' : '#6b7280',
    boxShadow: isActive ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
  });

  const getBadgeStyle = (isActive) => ({
    background: isActive ? '#d1fae5' : '#e5e7eb',
    color: isActive ? '#059669' : '#6b7280',
    padding: '2px 8px',
    borderRadius: '10px',
    fontSize: '12px',
    fontWeight: '700',
  });

  return (
    <div style={tabContainerStyle}>
      <button 
        style={getTabStyle(activeTab === 'pre')}
        onClick={() => onTabChange('pre')}
      >
        <FaFileAlt size={14} />
        Ön Başvurular
        <span style={getBadgeStyle(activeTab === 'pre')}>{preCount}</span>
      </button>
      <button 
        style={getTabStyle(activeTab === 'full')}
        onClick={() => onTabChange('full')}
      >
        <FaUserCheck size={14} />
        Aktivasyon Bekleyenler
        <span style={getBadgeStyle(activeTab === 'full')}>{fullCount}</span>
      </button>
    </div>
  );
};

export default ApplicationTabs;
