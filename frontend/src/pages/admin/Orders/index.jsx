// src/pages/vendor/VendorOrders/index.jsx
import React, { useState, useEffect } from 'react';
import { 
  FaSearch, FaFilter, FaDownload, FaPrint, 
  FaShoppingBag, FaClock, FaUndo, FaWallet, 
  FaEye, FaCheck, FaTruck, FaTimes, FaBoxOpen, FaFileExcel,
  FaStore, FaUsers // EKLENDİ: Eksik ikonlar buraya eklendi
} from 'react-icons/fa';

import { getStyles } from './styles';
import { MOCK_ORDERS, KPI_STATS } from './data';
import OrderDetailModal from './OrderDetailModal';

const VendorOrders = () => {
  const styles = getStyles();
  
  // --- STATE ---
  const [orders, setOrders] = useState(MOCK_ORDERS);
  const [filteredOrders, setFilteredOrders] = useState(MOCK_ORDERS);
  
  // Temel Filtreler
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Gelişmiş Filtreler
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [minAmount, setMinAmount] = useState('');
  const [maxAmount, setMaxAmount] = useState('');

  // Modal
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // --- FİLTRELEME MANTIĞI ---
  useEffect(() => {
    let result = orders;

    if (searchTerm) {
      const lowerTerm = searchTerm.toLowerCase();
      result = result.filter(order => 
        order.id.toLowerCase().includes(lowerTerm) ||
        order.customer.name.toLowerCase().includes(lowerTerm)
      );
    }

    if (statusFilter !== 'all') {
      result = result.filter(order => order.status === statusFilter);
    }

    if (minAmount) {
      result = result.filter(order => order.amount >= parseFloat(minAmount));
    }
    if (maxAmount) {
      result = result.filter(order => order.amount <= parseFloat(maxAmount));
    }

    setFilteredOrders(result);
  }, [searchTerm, statusFilter, minAmount, maxAmount, orders]);

  // --- AKSİYONLAR ---

  // Excel İndirme
  const handleDownloadExcel = () => {
    if (filteredOrders.length === 0) {
      alert("İndirilecek veri bulunamadı.");
      return;
    }
    const headers = ["Siparis No", "Musteri", "Tarih", "Odeme Yontemi", "Tutar", "Durum"];
    const rows = filteredOrders.map(order => [
      order.id, `"${order.customer.name}"`, order.date, order.paymentMethod, order.amount, order.status
    ]);
    const csvContent = [headers.join(","), ...rows.map(row => row.join(","))].join("\n");
    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Siparisler_${new Date().toLocaleDateString('tr-TR')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Toplu Yazdırma
  const handleBulkPrint = () => {
    if (filteredOrders.length === 0) {
      alert("Yazdırılacak sipariş yok.");
      return;
    }
    const printWindow = window.open('', '_blank', 'width=900,height=600');
    const printContent = `
      <html><head><title>Sipariş Listesi</title>
      <style>body{font-family:sans-serif;padding:20px;} table{width:100%;border-collapse:collapse;margin-top:20px;} th,td{border:1px solid #ddd;padding:10px;text-align:left;font-size:12px;} th{background-color:#f4f4f4;}</style>
      </head><body><h2>Sipariş Listesi</h2><table><thead><tr><th>No</th><th>Müşteri</th><th>Tutar</th><th>Durum</th></tr></thead>
      <tbody>${filteredOrders.map(o => `<tr><td>${o.id}</td><td>${o.customer.name}</td><td>${new Intl.NumberFormat('tr-TR',{style:'currency',currency:'TRY'}).format(o.amount)}</td><td>${o.status}</td></tr>`).join('')}</tbody></table>
      <script>window.onload=function(){window.print();}</script></body></html>
    `;
    printWindow.document.write(printContent);
    printWindow.document.close();
  };

  const updateOrderStatus = (id, newStatus, e = null) => {
    if(e) e.stopPropagation();
    const updatedList = orders.map(order => 
      order.id === id ? { ...order, status: newStatus } : order
    );
    setOrders(updatedList);
    if (selectedOrder && selectedOrder.id === id) {
      setSelectedOrder({ ...selectedOrder, status: newStatus });
    }
  };

  const handleCancel = (id, e = null) => {
    if(e) e.stopPropagation();
    if (window.confirm('Bu siparişi iptal etmek istediğinize emin misiniz?')) {
      updateOrderStatus(id, 'cancelled');
    }
  };

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
          <button style={styles.exportBtn} onClick={handleBulkPrint}>
            <FaPrint /> Toplu Etiket Yazdır
          </button>
          <button style={styles.exportBtn} onClick={handleDownloadExcel}>
            <FaFileExcel /> Excel İndir
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div style={styles.statsGrid}>
        {KPI_STATS.map((stat, index) => (
          <div key={index} style={styles.statCard}>
            <div style={styles.statInfo}>
              <span style={styles.statLabel}>{stat.label}</span>
              <span style={styles.statValue}>{stat.value}</span>
            </div>
            {/* DÜZELTME BURADA: Eksik olan ikon kontrolleri eklendi */}
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
              <th style={styles.th}>Tarih</th>
              <th style={styles.th}>Ödeme</th>
              <th style={styles.th}>Tutar</th>
              <th style={styles.th}>Durum</th>
              <th style={styles.th}>İşlem</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
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
                    <div style={styles.customerInfo}>
                      <span style={styles.customerName}>{order.customer.name}</span>
                      <span style={styles.customerEmail}>{order.customer.email}</span>
                    </div>
                  </td>
                  <td style={styles.td}><span style={styles.date}>{order.date}</span></td>
                  <td style={styles.td}><span style={{fontSize:'13px', color:'#374151'}}>{order.paymentMethod}</span></td>
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
        onStatusUpdate={updateOrderStatus} onCancel={handleCancel} styles={styles}
      />
    </div>
  );
};

export default VendorOrders;