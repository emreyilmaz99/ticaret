// src/pages/admin/Applications/components/ApproveModal.jsx
import React from 'react';
import { FaTimes, FaCheck, FaStore, FaPercent, FaStar } from 'react-icons/fa';
import { styles } from '../styles';

/**
 * Komisyon planı seçim modalı
 */
const ApproveModal = ({
  isOpen,
  vendor,
  commissionPlans = [],
  selectedPlan,
  onSelectPlan,
  onClose,
  onSubmit,
  isSubmitting
}) => {
  if (!isOpen || !vendor) return null;

  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div 
        style={{...styles.modalContent, maxWidth: '700px'}} 
        onClick={e => e.stopPropagation()}
      >
        <div style={styles.modalHeader}>
          <h2 style={{margin: 0, fontSize: '20px', fontWeight: '700', color: '#064e3b'}}>
            ✅ Satıcıyı Aktifleştir
          </h2>
          <button 
            onClick={onClose} 
            style={{
              background: 'white', 
              border: 'none', 
              cursor: 'pointer', 
              padding: '8px', 
              borderRadius: '8px',
              color: '#6b7280'
            }}
          >
            <FaTimes size={18} />
          </button>
        </div>
        
        <div style={styles.modalBody}>
          {/* Satıcı Özeti */}
          <div style={{ 
            background: '#f0fdf4', 
            padding: '16px', 
            borderRadius: '12px', 
            marginBottom: '24px',
            border: '1px solid #d1fae5'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={styles.storeIcon}>
                <FaStore size={20} />
              </div>
              <div>
                <div style={{ fontWeight: '700', fontSize: '16px', color: '#064e3b' }}>
                  {vendor.company_name || vendor.storeName}
                </div>
                <div style={{ fontSize: '13px', color: '#6b7280' }}>
                  {vendor.full_name || vendor.owner} • {vendor.email}
                </div>
              </div>
            </div>
          </div>

          {/* Komisyon Planı Seçimi */}
          <div>
            <h3 style={{ 
              fontSize: '16px', 
              fontWeight: '700', 
              color: '#064e3b', 
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <FaPercent size={14} /> Komisyon Planı Seçin
            </h3>
            
            {commissionPlans.length === 0 ? (
              <div style={{ 
                padding: '24px', 
                textAlign: 'center', 
                background: '#fef3c7', 
                borderRadius: '12px',
                color: '#92400e'
              }}>
                Aktif komisyon planı bulunamadı. Lütfen önce bir komisyon planı oluşturun.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {commissionPlans.map(plan => (
                  <div 
                    key={plan.id}
                    onClick={() => onSelectPlan(plan.id)}
                    style={{
                      padding: '16px 20px',
                      borderRadius: '12px',
                      border: selectedPlan === plan.id 
                        ? '2px solid #059669' 
                        : '2px solid #e5e7eb',
                      background: selectedPlan === plan.id 
                        ? 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)' 
                        : 'white',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        border: selectedPlan === plan.id 
                          ? '6px solid #059669' 
                          : '2px solid #d1d5db',
                        background: 'white',
                        transition: 'all 0.2s ease'
                      }} />
                      <div>
                        <div style={{ 
                          fontWeight: '600', 
                          color: '#064e3b',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px'
                        }}>
                          {plan.name}
                          {plan.is_default && (
                            <span style={{
                              background: '#fef3c7',
                              color: '#92400e',
                              padding: '2px 8px',
                              borderRadius: '12px',
                              fontSize: '11px',
                              fontWeight: '600',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}>
                              <FaStar size={10} /> Varsayılan
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: '13px', color: '#6b7280', marginTop: '2px' }}>
                          {plan.description || 'Açıklama yok'}
                        </div>
                      </div>
                    </div>
                    <div style={{
                      background: selectedPlan === plan.id ? '#059669' : '#f3f4f6',
                      color: selectedPlan === plan.id ? 'white' : '#064e3b',
                      padding: '8px 16px',
                      borderRadius: '20px',
                      fontWeight: '700',
                      fontSize: '15px',
                      minWidth: '80px',
                      textAlign: 'center'
                    }}>
                      %{parseFloat(plan.rate).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <div style={styles.modalFooter}>
          <button 
            onClick={onClose} 
            style={{
              padding: '12px 24px', 
              borderRadius: '10px', 
              border: '2px solid #e5e7eb', 
              background: 'white', 
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '14px',
              color: '#6b7280'
            }}
          >
            İptal
          </button>
          <button 
            onClick={onSubmit}
            disabled={!selectedPlan || isSubmitting}
            style={{
              padding: '12px 24px', 
              borderRadius: '10px', 
              border: 'none', 
              background: !selectedPlan 
                ? '#a7f3d0' 
                : 'linear-gradient(135deg, #10b981 0%, #059669 100%)', 
              color: 'white', 
              cursor: !selectedPlan ? 'not-allowed' : 'pointer',
              fontWeight: '600',
              fontSize: '14px',
              boxShadow: selectedPlan ? '0 4px 12px rgba(16, 185, 129, 0.3)' : 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <FaCheck /> {isSubmitting ? 'Onaylanıyor...' : 'Onayla ve Aktifleştir'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApproveModal;
