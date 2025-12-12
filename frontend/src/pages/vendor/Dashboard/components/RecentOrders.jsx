import React from 'react';
import { useNavigate } from 'react-router-dom';
import { styles, getStatusStyle } from '../styles';

/**
 * Recent orders table
 */
const RecentOrders = ({ orders }) => {
  const navigate = useNavigate();

  const handleViewAllOrders = () => {
    navigate('/vendor/orders');
  };

  return (
    <div style={styles.tableCard}>
      <div style={styles.tableHeader}>
        <h3 style={styles.cardTitle}>Son Siparişler</h3>
        <button 
          style={{ ...styles.tableViewAll, cursor: 'pointer' }}
          onClick={handleViewAllOrders}
        >
          Tümünü Gör
        </button>
      </div>
      
      <table style={styles.table}>
        <thead>
          <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
            <th style={styles.tableHeaderCell}>Sipariş No</th>
            <th style={styles.tableHeaderCell}>Müşteri</th>
            <th style={styles.tableHeaderCell}>Ürün</th>
            <th style={styles.tableHeaderCell}>Tarih</th>
            <th style={styles.tableHeaderCell}>Tutar</th>
            <th style={styles.tableHeaderCell}>Durum</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order, index) => (
            <tr 
              key={index} 
              style={{ 
                borderBottom: index !== orders.length - 1 ? '1px solid #f8fafc' : 'none' 
              }}
            >
              <td style={{ ...styles.tableCell, fontWeight: '600', color: '#0f172a' }}>
                {order.id}
              </td>
              <td style={{ ...styles.tableCell, color: '#475569' }}>
                {order.customer}
              </td>
              <td style={{ ...styles.tableCell, color: '#475569' }}>
                {order.product}
              </td>
              <td style={{ ...styles.tableCell, color: '#94a3b8', fontSize: '13px' }}>
                {order.date}
              </td>
              <td style={{ ...styles.tableCell, fontWeight: '600', color: '#0f172a' }}>
                {order.amount}
              </td>
              <td style={styles.tableCell}>
                <span style={{ 
                  ...styles.statusBadge,
                  ...getStatusStyle(order.status)
                }}>
                  {order.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RecentOrders;
