import React from 'react';
import { FaShoppingBag, FaUser, FaClock } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const MOCK_ORDERS = [
  { id: '#SIP-1024', customer: 'Ahmet Yılmaz', amount: '₺1,250.00', status: 'completed', date: '2 dk önce' },
  { id: '#SIP-1023', customer: 'Ayşe Demir', amount: '₺450.50', status: 'processing', date: '15 dk önce' },
  { id: '#SIP-1022', customer: 'Mehmet Kaya', amount: '₺2,100.00', status: 'pending', date: '1 saat önce' },
  { id: '#SIP-1021', customer: 'Zeynep Çelik', amount: '₺85.00', status: 'cancelled', date: '3 saat önce' },
  { id: '#SIP-1020', customer: 'Can Vural', amount: '₺340.00', status: 'completed', date: '5 saat önce' },
];

export const RecentOrders = () => {
  const navigate = useNavigate();

  const handleViewAll = () => {
    navigate('/admin/orders');
  };

  const getStatusStyle = (status) => {
    const styles = {
      completed: { bg: '#dcfce7', color: '#166534', label: 'Tamamlandı' },
      processing: { bg: '#dbeafe', color: '#1e40af', label: 'Hazırlanıyor' },
      pending: { bg: '#fef9c3', color: '#854d0e', label: 'Bekliyor' },
      cancelled: { bg: '#fee2e2', color: '#991b1b', label: 'İptal' },
    };
    return styles[status] || styles.pending;
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
        <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-main)' }}>Son Siparişler</h3>
        <button 
          onClick={handleViewAll}
          style={{ 
            background: 'none', 
            border: 'none', 
            color: 'var(--primary)', 
            fontWeight: '600', 
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          Tümünü Gör
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {MOCK_ORDERS.map((order) => {
          const statusStyle = getStatusStyle(order.status);
          return (
            <div key={order.id} style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              paddingBottom: '16px',
              borderBottom: '1px solid #f1f5f9'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ 
                  width: '40px', 
                  height: '40px', 
                  borderRadius: '8px', 
                  backgroundColor: '#f1f5f9', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  color: 'var(--text-muted)'
                }}>
                  <FaShoppingBag />
                </div>
                <div>
                  <div style={{ fontWeight: '600', color: 'var(--text-main)', fontSize: '14px' }}>{order.customer}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{order.id}</div>
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: '700', color: 'var(--text-main)', fontSize: '14px' }}>{order.amount}</div>
                <span style={{ 
                  fontSize: '11px', 
                  padding: '2px 8px', 
                  borderRadius: '12px', 
                  backgroundColor: statusStyle.bg, 
                  color: statusStyle.color,
                  fontWeight: '600'
                }}>
                  {statusStyle.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
