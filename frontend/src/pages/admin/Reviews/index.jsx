// src/pages/admin/Reviews/index.jsx
import React, { useState } from 'react';
import { 
  FaSearch, FaFilter, FaFileExcel, FaPrint,
  FaComments, FaClock, FaCheck, FaTimes, FaTrash,
  FaStar, FaEye, FaStore, FaUser, FaBox, FaBan,
  FaCheckCircle, FaTimesCircle, FaExclamationTriangle
} from 'react-icons/fa';

import { useReviewsPage } from './useReviewsPage';
import ReviewDetailModal from './ReviewDetailModal';
import RejectReviewModal from './RejectReviewModal';
import BannedWordsTab from './BannedWordsTab';
import { getStyles } from './styles';
import { useToast } from '../../../components/common/Toast';

const ReviewsPage = () => {
  const styles = getStyles();
  const toast = useToast();
  const [activeTab, setActiveTab] = useState('reviews'); // 'reviews' or 'banned-words'

  const {
    // Data
    reviews,
    stats,
    isLoading,
    isLoadingStats,
    
    // Filters
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    ratingFilter,
    setRatingFilter,
    
    // Selection
    selectedReviews,
    toggleSelectAll,
    toggleSelect,
    
    // Actions
    handleApprove,
    handleReject,
    handleBulkApprove,
    handleBulkReject,
    
    // Modals
    viewReview,
    setViewReview,
    rejectModal,
    setRejectModal,
    rejectionReason,
    setRejectionReason,
    handleRejectSubmit,
    
    // Mutations
    isApproving,
    isRejecting,
  } = useReviewsPage();

  // Excel indirme
  const handleDownloadExcel = () => {
    if (reviews.length === 0) {
      toast.error('İndirilecek veri bulunamadı');
      return;
    }
    const headers = ["ID", "Kullanici", "Urun", "Satici", "Puan", "Yorum", "Durum", "Tarih"];
    const rows = reviews.map(review => [
      review.id,
      `"${review.user?.name || 'Anonim'}"`,
      `"${review.product?.name || '-'}"`,
      `"${review.product?.vendor?.name || '-'}"`,
      review.rating,
      `"${(review.comment || '').replace(/"/g, '""').substring(0, 100)}"`,
      review.status,
      new Date(review.created_at).toLocaleDateString('tr-TR')
    ]);
    const csvContent = [headers.join(","), ...rows.map(row => row.join(","))].join("\n");
    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Yorumlar_${new Date().toLocaleDateString('tr-TR')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`${reviews.length} yorum Excel dosyası olarak indirildi`);
  };

  // Yazdırma
  const handlePrint = () => {
    if (reviews.length === 0) {
      toast.error('Yazdırılacak veri yok');
      return;
    }
    const printWindow = window.open('', '_blank', 'width=900,height=600');
    const printContent = `
      <html><head><title>Yorum Listesi</title>
      <style>body{font-family:sans-serif;padding:20px;} table{width:100%;border-collapse:collapse;margin-top:20px;} th,td{border:1px solid #ddd;padding:10px;text-align:left;font-size:12px;} th{background-color:#f4f4f4;}</style>
      </head><body><h2>Yorum Listesi</h2><table><thead><tr><th>Kullanıcı</th><th>Ürün</th><th>Puan</th><th>Durum</th><th>Tarih</th></tr></thead>
      <tbody>${reviews.map(r => `<tr><td>${r.user?.name || 'Anonim'}</td><td>${r.product?.name || '-'}</td><td>${r.rating}/5</td><td>${r.status}</td><td>${new Date(r.created_at).toLocaleDateString('tr-TR')}</td></tr>`).join('')}</tbody></table>
      <script>window.onload=function(){window.print();}</script></body></html>
    `;
    printWindow.document.write(printContent);
    printWindow.document.close();
    toast.success('Yazdırma penceresi açıldı');
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { text: 'Beklemede', color: '#f59e0b', bg: '#fef3c7', icon: <FaClock size={12} /> },
      approved: { text: 'Onaylandı', color: '#10b981', bg: '#d1fae5', icon: <FaCheck size={12} /> },
      rejected: { text: 'Reddedildi', color: '#ef4444', bg: '#fee2e2', icon: <FaTimes size={12} /> },
    };
    const config = statusConfig[status] || statusConfig.pending;
    return (
      <span style={{ ...styles.statusBadge, backgroundColor: config.bg, color: config.color }}>
        {config.icon}
        <span>{config.text}</span>
      </span>
    );
  };

  const renderStars = (rating) => {
    return (
      <div style={styles.starsRow}>
        {[1, 2, 3, 4, 5].map((star) => (
          <FaStar
            key={star}
            size={14}
            color={star <= rating ? '#f59e0b' : '#e5e7eb'}
          />
        ))}
        <span style={styles.ratingText}>{rating}/5</span>
      </div>
    );
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.titleGroup}>
          <h1 style={styles.title}>Değerlendirme & Yorum Yönetimi</h1>
          <p style={styles.subtitle}>Kullanıcı yorumlarını inceleyin, onaylayın veya reddedin. Yasaklı kelimeleri yönetin.</p>
        </div>
        <div style={styles.headerActions}>
          <button style={styles.exportBtn} onClick={handlePrint}>
            <FaPrint /> Yazdır
          </button>
          <button style={styles.exportBtn} onClick={handleDownloadExcel}>
            <FaFileExcel /> Excel İndir
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={styles.tabsContainer}>
        <button
          style={activeTab === 'reviews' ? styles.tabActive : styles.tab}
          onClick={() => setActiveTab('reviews')}
        >
          <FaComments /> Yorumlar
        </button>
        <button
          style={activeTab === 'banned-words' ? styles.tabActive : styles.tab}
          onClick={() => setActiveTab('banned-words')}
        >
          <FaBan /> Yasaklı Kelimeler
        </button>
      </div>

      {activeTab === 'reviews' ? (
        <>
          {/* Stats Cards */}
          <div style={styles.statsGrid}>
            <div 
              style={{ ...styles.statCard, cursor: 'pointer', border: statusFilter === '' ? '2px solid #059669' : '1px solid #e5e7eb' }}
              onClick={() => setStatusFilter('')}
            >
              <div style={styles.statInfo}>
                <span style={styles.statLabel}>Toplam Yorum</span>
                <span style={styles.statValue}>{stats.total || 0}</span>
              </div>
              <div style={{ ...styles.statIconBox, backgroundColor: '#e0e7ff', color: '#4f46e5' }}>
                <FaComments size={20} />
              </div>
            </div>
            <div 
              style={{ ...styles.statCard, cursor: 'pointer', border: statusFilter === 'pending' ? '2px solid #f59e0b' : '1px solid #e5e7eb' }}
              onClick={() => setStatusFilter('pending')}
            >
              <div style={styles.statInfo}>
                <span style={styles.statLabel}>Bekleyen</span>
                <span style={styles.statValue}>{stats.pending || 0}</span>
              </div>
              <div style={{ ...styles.statIconBox, backgroundColor: '#fef3c7', color: '#f59e0b' }}>
                <FaClock size={20} />
              </div>
            </div>
            <div 
              style={{ ...styles.statCard, cursor: 'pointer', border: statusFilter === 'approved' ? '2px solid #10b981' : '1px solid #e5e7eb' }}
              onClick={() => setStatusFilter('approved')}
            >
              <div style={styles.statInfo}>
                <span style={styles.statLabel}>Onaylanan</span>
                <span style={styles.statValue}>{stats.approved || 0}</span>
              </div>
              <div style={{ ...styles.statIconBox, backgroundColor: '#d1fae5', color: '#10b981' }}>
                <FaCheckCircle size={20} />
              </div>
            </div>
            <div 
              style={{ ...styles.statCard, cursor: 'pointer', border: statusFilter === 'rejected' ? '2px solid #ef4444' : '1px solid #e5e7eb' }}
              onClick={() => setStatusFilter('rejected')}
            >
              <div style={styles.statInfo}>
                <span style={styles.statLabel}>Reddedilen</span>
                <span style={styles.statValue}>{stats.rejected || 0}</span>
              </div>
              <div style={{ ...styles.statIconBox, backgroundColor: '#fee2e2', color: '#ef4444' }}>
                <FaTimesCircle size={20} />
              </div>
            </div>
          </div>

          {/* Toolbar */}
          <div style={styles.toolbar}>
            <div style={styles.toolbarLeft}>
              <div style={styles.searchWrapper}>
                <FaSearch style={styles.searchIcon} />
                <input
                  type="text"
                  placeholder="Yorum, kullanıcı veya ürün ara..."
                  style={styles.searchInput}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <select
                style={styles.filterSelect}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">Tüm Durumlar</option>
                <option value="pending">Beklemede</option>
                <option value="approved">Onaylandı</option>
                <option value="rejected">Reddedildi</option>
              </select>
              <select
                style={styles.filterSelect}
                value={ratingFilter}
                onChange={(e) => setRatingFilter(e.target.value)}
              >
                <option value="">Tüm Puanlar</option>
                <option value="5">5 Yıldız</option>
                <option value="4">4 Yıldız</option>
                <option value="3">3 Yıldız</option>
                <option value="2">2 Yıldız</option>
                <option value="1">1 Yıldız</option>
              </select>
            </div>
            
            {selectedReviews.length > 0 && (
              <div style={styles.bulkActions}>
                <span style={styles.selectedCount}>{selectedReviews.length} seçili</span>
                <button
                  style={styles.bulkApproveBtn}
                  onClick={handleBulkApprove}
                  disabled={isApproving}
                >
                  <FaCheck /> Toplu Onayla
                </button>
                <button
                  style={styles.bulkRejectBtn}
                  onClick={() => setRejectModal({ isOpen: true, isBulk: true })}
                  disabled={isRejecting}
                >
                  <FaTimes /> Toplu Reddet
                </button>
              </div>
            )}
          </div>

          {/* Table */}
          <div style={styles.tableContainer}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>
                    <input
                      type="checkbox"
                      checked={selectedReviews.length === reviews.length && reviews.length > 0}
                      onChange={toggleSelectAll}
                      style={styles.checkbox}
                    />
                  </th>
                  <th style={styles.th}>Kullanıcı</th>
                  <th style={styles.th}>Ürün</th>
                  <th style={styles.th}>Satıcı</th>
                  <th style={styles.th}>Puan</th>
                  <th style={styles.th}>Yorum</th>
                  <th style={styles.th}>Durum</th>
                  <th style={styles.th}>Tarih</th>
                  <th style={styles.th}>İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan="9" style={styles.loadingCell}>
                      <div style={styles.loader}></div>
                      Yorumlar yükleniyor...
                    </td>
                  </tr>
                ) : reviews.length === 0 ? (
                  <tr>
                    <td colSpan="9" style={styles.emptyCell}>
                      <FaComments size={48} style={{ color: '#d1d5db', marginBottom: '16px' }} />
                      <p>Henüz yorum bulunmuyor.</p>
                    </td>
                  </tr>
                ) : (
                  reviews.map((review) => (
                    <tr key={review.id} style={styles.tr}>
                      <td style={styles.td}>
                        <input
                          type="checkbox"
                          checked={selectedReviews.includes(review.id)}
                          onChange={() => toggleSelect(review.id)}
                          style={styles.checkbox}
                        />
                      </td>
                      <td style={styles.td}>
                        <div style={styles.userCell}>
                          <div style={styles.userAvatar}>
                            <FaUser size={14} />
                          </div>
                          <div>
                            <div style={styles.userName}>
                              {review.is_anonymous ? 'Anonim Kullanıcı' : review.user?.name || 'Bilinmiyor'}
                            </div>
                            <div style={styles.userEmail}>{review.user?.email || '-'}</div>
                          </div>
                        </div>
                      </td>
                      <td style={styles.td}>
                        <div style={styles.productCell}>
                          <FaBox size={12} style={{ color: '#6b7280', marginRight: '8px' }} />
                          <span style={styles.productName}>
                            {review.product?.name?.substring(0, 30) || '-'}
                            {review.product?.name?.length > 30 ? '...' : ''}
                          </span>
                        </div>
                      </td>
                      <td style={styles.td}>
                        <div style={styles.vendorCell}>
                          <FaStore size={12} style={{ color: '#059669', marginRight: '8px' }} />
                          <span>{review.product?.vendor?.name || review.product?.vendor?.company_name || '-'}</span>
                        </div>
                      </td>
                      <td style={styles.td}>
                        {renderStars(review.rating)}
                      </td>
                      <td style={styles.td}>
                        <div style={styles.commentCell}>
                          <div style={styles.commentTitle}>{review.title || 'Başlıksız'}</div>
                          <div style={styles.commentText}>
                            {review.comment?.substring(0, 80) || '-'}
                            {review.comment?.length > 80 ? '...' : ''}
                          </div>
                          {review.media?.length > 0 && (
                            <div style={styles.mediaIndicator}>
                              📷 {review.media.length} görsel
                            </div>
                          )}
                        </div>
                      </td>
                      <td style={styles.td}>
                        {getStatusBadge(review.status)}
                        {review.status === 'rejected' && review.rejection_reason && (
                          <div style={styles.rejectionReason} title={review.rejection_reason}>
                            <FaExclamationTriangle size={10} /> {review.rejection_reason.substring(0, 20)}...
                          </div>
                        )}
                      </td>
                      <td style={styles.td}>
                        <div style={styles.dateCell}>
                          {new Date(review.created_at).toLocaleDateString('tr-TR')}
                        </div>
                        <div style={styles.timeCell}>
                          {new Date(review.created_at).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </td>
                      <td style={styles.td}>
                        <div style={styles.actionButtons}>
                          <button
                            style={styles.viewBtn}
                            onClick={() => setViewReview(review)}
                            title="Detay Görüntüle"
                          >
                            <FaEye />
                          </button>
                          {review.status !== 'approved' && (
                            <button
                              style={styles.approveBtn}
                              onClick={() => handleApprove(review.id)}
                              disabled={isApproving}
                              title="Onayla"
                            >
                              <FaCheck />
                            </button>
                          )}
                          {review.status !== 'rejected' && (
                            <button
                              style={styles.rejectBtn}
                              onClick={() => setRejectModal({ isOpen: true, reviewId: review.id, isBulk: false })}
                              disabled={isRejecting}
                              title="Reddet"
                            >
                              <FaTimes />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <BannedWordsTab styles={styles} />
      )}

      {/* Review Detail Modal */}
      {viewReview && (
        <ReviewDetailModal
          review={viewReview}
          onClose={() => setViewReview(null)}
          onApprove={() => {
            handleApprove(viewReview.id);
            setViewReview(null);
          }}
          onReject={() => {
            setRejectModal({ isOpen: true, reviewId: viewReview.id, isBulk: false });
            setViewReview(null);
          }}
          styles={styles}
        />
      )}

      {/* Reject Modal */}
      {rejectModal.isOpen && (
        <RejectReviewModal
          isBulk={rejectModal.isBulk}
          count={rejectModal.isBulk ? selectedReviews.length : 1}
          rejectionReason={rejectionReason}
          setRejectionReason={setRejectionReason}
          onSubmit={handleRejectSubmit}
          onClose={() => {
            setRejectModal({ isOpen: false, reviewId: null, isBulk: false });
            setRejectionReason('');
          }}
          isLoading={isRejecting}
          styles={styles}
        />
      )}
    </div>
  );
};

export default ReviewsPage;
