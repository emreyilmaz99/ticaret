// src/pages/admin/Orders/index.jsx
import React, { useState } from 'react';
import { 
  FaSearch, FaFilter, FaDownload, FaPrint, 
  FaShoppingBag, FaClock, FaUndo, FaWallet, 
  FaEye, FaCheck, FaTruck, FaTimes, FaBoxOpen, FaFileExcel,
  FaStore, FaUsers
} from 'react-icons/fa';

import { getStyles } from './styles';
import { useAdminOrders } from './useAdminOrders';
import OrderDetailModal from './OrderDetailModal';

const AdminOrders = () => {
  const styles = getStyles();
  
  // Custom hook'tan veri ve fonksiyonlar
  const {
    orders,
    stats,
    isLoadingOrders,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    minAmount,
    setMinAmount,
    maxAmount,
    setMaxAmount,
    updateOrderStatus,
    cancelOrder,
    handleExportExcel,
    handlePrint
  } = useAdminOrders();

  // Gelişmiş Filtreler
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Modal
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewDetail = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  const getStatusText = (status) => {
    const map = {
      pending: 'Onay Bekliyor',
      processing: 'Hazırlanıyor',
      shipped: 'Kargoya Verildi',
      delivered: 'Teslim Edildi',
      cancelled: 'İptal Edildi'
    };
    return map[status] || status;
  };

  return (
    <div style={styles.container}>
      
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.titleGroup}>
          <h1 style={styles.title}>Siparişler</h1>
          <p style={styles.subtitle}>Mağazanıza gelen siparişleri buradan yönetebilirsiniz.</p>
        </div>
        <div style={styles.headerActions}>
          <button style={styles.exportBtn} onClick={handlePrint}>
            <FaPrint /> Yazdır
          </button>
          <button style={styles.exportBtn} onClick={handleExportExcel}>
            <FaFileExcel /> Excel İndir
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div style={styles.statsGrid}>
        {stats.map((stat, index) => (
          <div key={index} style={styles.statCard}>
            <div style={styles.statInfo}>
              <span style={styles.statLabel}>{stat.label}</span>
              <span style={styles.statValue}>{stat.value}</span>
            </div>
            <div style={styles.statIconBox(stat.color)}>
              {stat.icon === 'FaShoppingBag' && <FaShoppingBag size={20} />}
              {stat.icon === 'FaClock' && <FaClock size={20} />}
              {stat.icon === 'FaWallet' && <FaWallet size={20} />}
              {stat.icon === 'FaUndo' && <FaUndo size={20} />}
              {stat.icon === 'FaStore' && <FaStore size={20} />}
              {stat.icon === 'FaUsers' && <FaUsers size={20} />}
            </div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div style={styles.toolbar}>
        <div style={styles.toolbarTop}>
          <div style={styles.searchWrapper}>
            <FaSearch style={styles.searchIcon} />
            <input 
              type="text" 
              placeholder="Sipariş no veya müşteri ara..." 
              style={styles.searchInput}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div style={styles.controlsRight}>
            <select style={styles.statusSelect} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="all">Tüm Siparişler</option>
              <option value="pending">Onay Bekleyenler</option>
              <option value="processing">Hazırlananlar</option>
              <option value="shipped">Kargodakiler</option>
              <option value="delivered">Tamamlananlar</option>
              <option value="cancelled">İptaller</option>
            </select>
            <button 
              style={styles.filterBtn(showAdvancedFilters)}
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            >
              <FaFilter /> {showAdvancedFilters ? 'Kapat' : 'Filtrele'}
            </button>
          </div>
        </div>

        {/* Gelişmiş Filtreler */}
        {showAdvancedFilters && (
          <div style={styles.advancedFilterPanel}>
            <div style={styles.advFilterGroup}>
              <label style={styles.advLabel}>Tutar Aralığı (TL)</label>
              <div style={styles.advInputRow}>
                <input type="number" placeholder="Min" style={styles.advInput} value={minAmount} onChange={(e) => setMinAmount(e.target.value)} />
                <span style={{color: '#9CA3AF'}}>-</span>
                <input type="number" placeholder="Max" style={styles.advInput} value={maxAmount} onChange={(e) => setMaxAmount(e.target.value)} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* TABLE */}
      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Sipariş No</th>
              <th style={styles.th}>Müşteri</th>
              <th style={styles.th}>Satıcı</th>
              <th style={styles.th}>Tarih</th>
              <th style={styles.th}>Tutar</th>
              <th style={styles.th}>Durum</th>
              <th style={styles.th}>İşlem</th>
            </tr>
          </thead>
          <tbody>
            {isLoadingOrders ? (
              <tr>
                <td colSpan="7" style={{padding:'60px', textAlign:'center', color:'#6B7280'}}>
                  <div style={{display:'flex', flexDirection:'column', alignItems:'center', gap:'10px'}}>
                    <span>Yükleniyor...</span>
                  </div>
                </td>
              </tr>
            ) : orders.length > 0 ? (
              orders.map((order) => (
                <tr 
                  key={order.id} style={styles.tr}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F9FAFB'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  onClick={() => handleViewDetail(order)}
                >
                  <td style={styles.td}>
                    <span style={styles.orderId}>{order.id}</span>
                    <div style={{fontSize:'12px', color:'#6B7280', marginTop:'4px'}}>{order.items} Ürün</div>
                  </td>
                  <td style={styles.td}>
                    <div 
                      style={styles.customerInfo}
                      title={`Email: ${order.customer.email}\nTelefon: ${order.customer.phone || 'Belirtilmemiş'}`}
                    >
                      <span style={styles.customerName}>{order.customer.name}</span>
                      <span style={styles.customerEmail}>{order.customer.email}</span>
                    </div>
                  </td>
                  <td style={styles.td}>
                    {order.vendors && order.vendors.length > 0 ? (
                      <div 
                        style={{...styles.customerInfo, cursor: 'pointer'}}
                        title={order.vendors.map(v => 
                          `${v.name}\nEmail: ${v.email}\nTelefon: ${v.phone || 'Belirtilmemiş'}\nVergi No: ${v.tax_id || 'Belirtilmemiş'}`
                        ).join('\n\n')}
                      >
                        <span style={styles.customerName}>{order.vendors[0].name}</span>
                        {order.vendors.length > 1 && (
                          <span style={{fontSize:'12px', color:'#6B7280'}}>+{order.vendors.length - 1} satıcı</span>
                        )}
                      </div>
                    ) : (
                      <span style={{fontSize:'13px', color:'#9CA3AF'}}>-</span>
                    )}
                  </td>
                  <td style={styles.td}><span style={styles.date}>{order.date}</span></td>
                  <td style={styles.td}>
                    <span style={styles.price}>
                      {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(order.amount)}
                    </span>
                  </td>
                  <td style={styles.td}>
                    <span style={styles.statusBadge(order.status)}>{getStatusText(order.status)}</span>
                  </td>
                  
                  {/* --- SADECE GÖZAT BUTONU KALDI --- */}
                  <td style={styles.td}>
                    <div style={styles.actionGroup}>
                      <button 
                        style={{...styles.btnDetail, border: 'none', backgroundColor: 'transparent'}} 
                        onClick={(e) => {e.stopPropagation(); handleViewDetail(order);}}
                        title="Detay"
                      >
                        <FaEye size={16} color="#64748B" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="7" style={{padding:'60px', textAlign:'center', color:'#6B7280'}}>Sipariş bulunamadı.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <OrderDetailModal 
        order={selectedOrder} isOpen={isModalOpen} onClose={handleCloseModal}
        onStatusUpdate={updateOrderStatus} onCancel={cancelOrder} styles={styles}
      />
    </div>
  );
};

export default AdminOrders;