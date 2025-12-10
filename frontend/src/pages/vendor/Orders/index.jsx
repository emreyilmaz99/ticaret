// src/pages/vendor/VendorOrders/index.jsx
import React, { useState } from 'react';
import { 
  FaSearch, FaFilter, FaDownload, FaPrint, 
  FaShoppingBag, FaClock, FaUndo, FaWallet, 
  FaEye, FaCheck, FaTruck, FaTimes, FaBoxOpen, FaFileExcel 
} from 'react-icons/fa';

// Stiller ve Hook
import { getStyles } from './styles';
import { useVendorOrders } from './useVendorOrders';

// Modal ve Servisler
import OrderDetailModal from './OrderDetailModal';
import { printInvoice } from './invoiceService';

const VendorOrders = () => {
  const styles = getStyles();
  
  // Custom hook'tan veri ve fonksiyonlar
  const {
    orders,
    stats,
    isLoadingOrders,
    isLoadingStats,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    minAmount,
    setMinAmount,
    maxAmount,
    setMaxAmount,
    updateOrderStatus,
    cancelOrder
  } = useVendorOrders();
  
  // Gelişmiş Filtreler
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Modal
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // --- EXCEL İNDİRME ---
  const handleDownloadExcel = () => {
    const headers = ["Siparis No", "Musteri", "Tarih", "Tutar", "Odeme", "Durum"];
    const rows = orders.map(order => [
      order.id, order.customer.name, order.date, order.amount, order.paymentMethod, order.status
    ]);
    const csvContent = [headers.join(","), ...rows.map(row => row.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Siparisler_${new Date().toLocaleDateString()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // --- TOPLU YAZDIRMA ---
  const handleBulkPrint = () => {
    if (orders.length === 0) return alert("Yazdırılacak sipariş yok.");
    const printWindow = window.open('', '_blank', 'width=800,height=600');
    printWindow.document.write(`
      <html><head><title>Sipariş Listesi</title>
      <style>table{width:100%;border-collapse:collapse;} th,td{border:1px solid #ddd;padding:8px;text-align:left;}</style>
      </head><body><h2>Sipariş Listesi</h2><table><thead><tr><th>No</th><th>Müşteri</th><th>Tutar</th><th>Durum</th></tr></thead><tbody>
      ${orders.map(o => `<tr><td>${o.id}</td><td>${o.customer.name}</td><td>${o.amount} TL</td><td>${o.status}</td></tr>`).join('')}
      </tbody></table><script>window.onload=function(){window.print();}</script></body></html>
    `);
    printWindow.document.close();
  };

  // --- MODAL YÖNETİMİ ---
  const handleViewDetail = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  // --- HELPER ---
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
      
      {/* 1. BAŞLIK VE BUTONLAR */}
      <div style={styles.header}>
        <div style={styles.titleGroup}>
          <h1 style={styles.title}>Siparişler</h1>
          <p style={styles.subtitle}>Mağazanıza gelen siparişleri buradan yönetebilirsiniz.</p>
        </div>
        <div style={styles.headerActions}>
          <button style={styles.exportBtn} onClick={handleBulkPrint}>
            <FaPrint /> Toplu Etiket Yazdır
          </button>
          <button style={styles.exportBtn} onClick={handleDownloadExcel}>
            <FaFileExcel /> Excel İndir
          </button>
        </div>
      </div>

      {/* 2. KPI KARTLARI */}
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
              {stat.icon === 'FaBoxOpen' && <FaBoxOpen size={20} />}
              {stat.icon === 'FaUndo' && <FaUndo size={20} />}
            </div>
          </div>
        ))}
      </div>

      {/* 3. YENİLENMİŞ MODERN TOOLBAR (Filtreleme Alanı) */}
      <div style={styles.toolbar}>
        
        {/* Üst Satır: Arama - Select - Filtre Butonu */}
        <div style={styles.toolbarTop}>
          
          <div style={styles.searchWrapper}>
            <FaSearch style={styles.searchIcon} />
            <input 
              type="text" 
              placeholder="Sipariş no, müşteri adı..." 
              style={styles.searchInput}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              // Focus olunca stil değişimi styles.js içinde halledildi
            />
          </div>

          <div style={styles.controlsRight}>
            {/* Durum Seçimi */}
            <select 
              style={styles.statusSelect} 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Tüm Durumlar</option>
              <option value="pending">Onay Bekleyenler</option>
              <option value="processing">Hazırlananlar</option>
              <option value="shipped">Kargodakiler</option>
              <option value="delivered">Tamamlananlar</option>
              <option value="cancelled">İptal Edilenler</option>
            </select>
            
            {/* İşlevsel Filtre Butonu */}
            <button 
              style={styles.filterBtn(showAdvancedFilters)}
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            >
              <FaFilter /> {showAdvancedFilters ? 'Filtreleri Gizle' : 'Filtrele'}
            </button>
          </div>
        </div>

        {/* Alt Satır: Gelişmiş Filtreler (Tutar Aralığı) */}
        {showAdvancedFilters && (
          <div style={styles.advancedFilterPanel}>
            <div style={styles.advFilterGroup}>
              <label style={styles.advLabel}>Tutar Aralığı (TL)</label>
              <div style={styles.advInputRow}>
                <input 
                  type="number" 
                  placeholder="Min" 
                  style={styles.advInput} 
                  value={minAmount}
                  onChange={(e) => setMinAmount(e.target.value)}
                />
                <span style={{color: '#9CA3AF'}}>-</span>
                <input 
                  type="number" 
                  placeholder="Max" 
                  style={styles.advInput} 
                  value={maxAmount}
                  onChange={(e) => setMaxAmount(e.target.value)}
                />
              </div>
            </div>
            
            {/* Buraya Tarih Aralığı vb. de eklenebilir */}
          </div>
        )}

      </div>

      {/* 4. SİPARİŞ TABLOSU */}
      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Sipariş No</th>
              <th style={styles.th}>Müşteri</th>
              <th style={styles.th}>Tarih</th>
              <th style={styles.th}>Ödeme</th>
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
                    <span>Yüklüyor...</span>
                  </div>
                </td>
              </tr>
            ) : orders.length > 0 ? (
              orders.map((order) => (
                <tr 
                  key={order.id} 
                  style={styles.tr}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F9FAFB'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <td style={styles.td}>
                    <span style={styles.orderId}>{order.id}</span>
                    <div style={{fontSize:'12px', color:'#6B7280', marginTop:'4px'}}>{order.items} Ürün</div>
                  </td>
                  <td style={styles.td}>
                    <div style={styles.customerInfo}>
                      <span style={styles.customerName}>{order.customer.name}</span>
                      <span style={styles.customerEmail}>{order.customer.email}</span>
                    </div>
                  </td>
                  <td style={styles.td}>
                    <span style={styles.date}>{order.date}</span>
                  </td>
                  <td style={styles.td}>
                    <span style={{fontSize:'13px', color:'#374151'}}>{order.paymentMethod}</span>
                  </td>
                  <td style={styles.td}>
                    <span style={styles.price}>
                      {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(order.amount)}
                    </span>
                  </td>
                  <td style={styles.td}>
                    <span style={styles.statusBadge(order.status)}>
                      {getStatusText(order.status)}
                    </span>
                  </td>
                  
                  {/* --- İŞLEM BUTONLARI --- */}
                  <td style={styles.td}>
                    <div style={styles.actionGroup}>
                      
                      {order.status === 'pending' && (
                        <button style={{...styles.actionBtnSmall, ...styles.btnApprove}} onClick={() => updateOrderStatus(order.order_id, 'processing')}>
                          <FaCheck /> Onayla
                        </button>
                      )}

                      {order.status === 'processing' && (
                        <button style={{...styles.actionBtnSmall, ...styles.btnShip}} onClick={() => updateOrderStatus(order.order_id, 'shipped')}>
                          <FaTruck /> Kargola
                        </button>
                      )}

                      {order.status === 'shipped' && (
                        <button style={{...styles.actionBtnSmall, ...styles.btnApprove}} onClick={() => updateOrderStatus(order.order_id, 'delivered')}>
                          <FaBoxOpen /> Teslim Et
                        </button>
                      )}

                      {(order.status === 'pending' || order.status === 'processing') && (
                        <button style={{...styles.actionBtnSmall, ...styles.btnCancel}} onClick={() => cancelOrder(order.order_id)}>
                          <FaTimes /> İptal
                        </button>
                      )}

                      <button style={styles.btnDetail} title="Detayları Gör" onClick={() => handleViewDetail(order)}>
                        <FaEye />
                      </button>

                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" style={{padding:'60px', textAlign:'center', color:'#6B7280'}}>
                  <div style={{display:'flex', flexDirection:'column', alignItems:'center', gap:'10px'}}>
                    <FaSearch size={32} color="#E5E7EB" />
                    <span>Aradığınız kriterlere uygun sipariş bulunamadı.</span>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <OrderDetailModal 
        order={selectedOrder} 
        isOpen={isModalOpen} 
        onClose={handleCloseModal}
        onStatusUpdate={updateOrderStatus}
        onCancel={cancelOrder}
        styles={styles}
      />

    </div>
  );
};

export default VendorOrders;