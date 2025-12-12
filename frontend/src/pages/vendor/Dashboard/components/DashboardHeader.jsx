import React, { useState } from 'react';
import { FaBell, FaCalendarAlt, FaPlus } from 'react-icons/fa';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { styles } from '../styles';

/**
 * Dashboard header with title and action buttons
 */
const DashboardHeader = () => {
  const { isMobile } = useOutletContext() || {};
  const navigate = useNavigate();
  const [showDateFilter, setShowDateFilter] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('Bu Hafta');

  const handleNewProduct = () => {
    navigate('/vendor/products');
    // Trigger modal açma event'i gönder (products sayfası yüklendiğinde yakalayabilir)
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('openProductModal'));
    }, 100);
  };

  const handleNotifications = () => {
    // Bildirimler modalı veya sayfası (şimdilik konsola log)
    console.log('Bildirimler açılıyor...');
    alert('Bildirimler özelliği yakında eklenecek!');
  };

  const handleDateFilterToggle = () => {
    setShowDateFilter(!showDateFilter);
  };

  const handlePeriodSelect = (period) => {
    setSelectedPeriod(period);
    setShowDateFilter(false);
    // Burada period'a göre dashboard verilerini filtreleme yapılabilir
    console.log('Seçilen dönem:', period);
  };

  // On mobile, the title is in the top navbar, so we can hide it or simplify it
  if (isMobile) {
    return (
      <div style={{ ...styles.header, marginBottom: '24px', flexDirection: 'column', alignItems: 'stretch', gap: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <p style={{ ...styles.subtitle, margin: 0 }}>
            Hoşgeldiniz, mağazanızın performans özeti.
          </p>
        </div>
        
        <div style={{ display: 'flex', gap: '12px' }}>
          <div 
            style={{ ...styles.dateFilter, flex: 1, justifyContent: 'center', cursor: 'pointer' }}
            onClick={handleDateFilterToggle}
          >
            <FaCalendarAlt /> {selectedPeriod}
          </div>
          <button 
            style={{ ...styles.addButton, flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            onClick={handleNewProduct}
          >
            <FaPlus /> Yeni Ürün
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.header}>
      <div>
        <h1 style={styles.title}>Özet</h1>
        <p style={styles.subtitle}>
          Hoşgeldiniz, mağazanızın performans özeti burada
        </p>
      </div>
      <div style={styles.headerActions}>
        {/* Date Filter */}
        <div style={{ position: 'relative' }}>
          <div 
            style={{ ...styles.dateFilter, cursor: 'pointer' }}
            onClick={handleDateFilterToggle}
          >
            <FaCalendarAlt /> {selectedPeriod}
          </div>
          
          {showDateFilter && (
            <div style={{
              position: 'absolute',
              top: '48px',
              right: 0,
              backgroundColor: '#fff',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              zIndex: 1000,
              minWidth: '160px',
              overflow: 'hidden'
            }}>
              {['Bugün', 'Bu Hafta', 'Bu Ay', 'Son 3 Ay', 'Bu Yıl'].map((period) => (
                <div
                  key={period}
                  onClick={() => handlePeriodSelect(period)}
                  style={{
                    padding: '12px 16px',
                    cursor: 'pointer',
                    backgroundColor: selectedPeriod === period ? '#f0fdf4' : '#fff',
                    color: selectedPeriod === period ? '#059669' : '#475569',
                    fontWeight: selectedPeriod === period ? '600' : '500',
                    fontSize: '14px',
                    transition: 'all 0.2s',
                    borderBottom: '1px solid #f1f5f9'
                  }}
                  onMouseEnter={(e) => {
                    if (selectedPeriod !== period) {
                      e.target.style.backgroundColor = '#f8fafc';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedPeriod !== period) {
                      e.target.style.backgroundColor = '#fff';
                    }
                  }}
                >
                  {period}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Notification Bell */}
        <div 
          style={{ ...styles.notificationButton, cursor: 'pointer' }}
          onClick={handleNotifications}
        >
          <FaBell />
          <div style={styles.notificationDot}></div>
        </div>

        <button 
          style={styles.addButton}
          onClick={handleNewProduct}
        >
          Yeni Ürün Ekle
        </button>
      </div>
    </div>
  );
};

export default DashboardHeader;
