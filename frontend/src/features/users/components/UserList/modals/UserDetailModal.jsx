// src/features/users/components/UserList/modals/UserDetailModal.jsx
import React from 'react';
import PropTypes from 'prop-types';
import {
  FaTimes,
  FaEdit,
  FaEnvelope,
  FaPhone,
  FaVenusMars,
  FaCalendarAlt,
  FaCheckCircle,
  FaMapMarkerAlt,
} from 'react-icons/fa';
import UserAvatar from '../UserAvatar';
import OrdersList from './OrdersList';
import { formatDate, formatDateTime, getGenderText } from '../../../utils/formatters';
import { MODAL_TABS } from '../../../shared/constants';
import { styles } from '../../../shared/styles';

const UserDetailModal = React.memo(({
  userDetail,
  isLoading,
  activeTab,
  onTabChange,
  onEdit,
  onClose,
  userOrders,
  loadingOrders,
}) => {
  if (isLoading) {
    return (
      <div style={styles.modalOverlay} onClick={onClose}>
        <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
          <div style={styles.modalHeader}>
            <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#0f172a', margin: 0 }}>
              Kullanıcı Detayı
            </h2>
            <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>
              <FaTimes size={20} />
            </button>
          </div>
          <div style={styles.modalBody}>
            <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>Yükleniyor...</div>
          </div>
        </div>
      </div>
    );
  }

  if (!userDetail) return null;

  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div style={styles.modalHeader}>
          <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#0f172a', margin: 0 }}>
            Kullanıcı Detayı
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>
            <FaTimes size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: '2px solid #f1f5f9', padding: '0 24px' }}>
          <button
            onClick={() => onTabChange(MODAL_TABS.DETAILS)}
            style={{
              padding: '12px 20px',
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: activeTab === MODAL_TABS.DETAILS ? '600' : '400',
              color: activeTab === MODAL_TABS.DETAILS ? '#3b82f6' : '#64748b',
              borderBottom: activeTab === MODAL_TABS.DETAILS ? '2px solid #3b82f6' : 'none',
              marginBottom: '-2px',
            }}
          >
            Detaylar
          </button>
          <button
            onClick={() => onTabChange(MODAL_TABS.ORDERS)}
            style={{
              padding: '12px 20px',
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: activeTab === MODAL_TABS.ORDERS ? '600' : '400',
              color: activeTab === MODAL_TABS.ORDERS ? '#3b82f6' : '#64748b',
              borderBottom: activeTab === MODAL_TABS.ORDERS ? '2px solid #3b82f6' : 'none',
              marginBottom: '-2px',
            }}
          >
            Siparişler {userOrders.length > 0 && `(${userOrders.length})`}
          </button>
        </div>

        <div style={styles.modalBody}>
          {activeTab === MODAL_TABS.DETAILS ? (
            <>
              {/* User Header */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  marginBottom: '24px',
                  paddingBottom: '24px',
                  borderBottom: '1px solid #e2e8f0',
                }}
              >
                <UserAvatar user={userDetail} size={64} />
                <div>
                  <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#0f172a', margin: 0 }}>
                    {userDetail.name}
                  </h3>
                  <p style={{ color: '#64748b', margin: '4px 0 0' }}>ID: #{userDetail.id}</p>
                </div>
                <div style={{ marginLeft: 'auto' }}>
                  <span style={styles.badge(userDetail.is_active ? 'green' : 'red')}>
                    {userDetail.is_active ? 'Aktif' : 'Pasif'}
                  </span>
                </div>
              </div>

              {/* Info Grid */}
              <div style={styles.infoGrid}>
                <div style={styles.infoItem}>
                  <span style={styles.infoLabel}>
                    <FaEnvelope size={12} /> Email
                  </span>
                  <span style={styles.infoValue}>{userDetail.email}</span>
                </div>
                <div style={styles.infoItem}>
                  <span style={styles.infoLabel}>
                    <FaPhone size={12} /> Telefon
                  </span>
                  <span style={styles.infoValue}>{userDetail.phone || '-'}</span>
                </div>
                <div style={styles.infoItem}>
                  <span style={styles.infoLabel}>
                    <FaVenusMars size={12} /> Cinsiyet
                  </span>
                  <span style={styles.infoValue}>{getGenderText(userDetail.gender)}</span>
                </div>
                <div style={styles.infoItem}>
                  <span style={styles.infoLabel}>
                    <FaCalendarAlt size={12} /> Doğum Tarihi
                  </span>
                  <span style={styles.infoValue}>{formatDate(userDetail.birth_date)}</span>
                </div>
                <div style={styles.infoItem}>
                  <span style={styles.infoLabel}>
                    <FaCheckCircle size={12} /> Email Doğrulama
                  </span>
                  <span style={styles.infoValue}>
                    {userDetail.email_verified_at ? (
                      <span style={{ color: '#059669' }}>
                        Doğrulanmış ({formatDateTime(userDetail.email_verified_at)})
                      </span>
                    ) : (
                      <span style={{ color: '#f59e0b' }}>Doğrulanmamış</span>
                    )}
                  </span>
                </div>
                <div style={styles.infoItem}>
                  <span style={styles.infoLabel}>
                    <FaCalendarAlt size={12} /> Son Giriş
                  </span>
                  <span style={styles.infoValue}>{formatDateTime(userDetail.last_login_at)}</span>
                </div>
                <div style={styles.infoItem}>
                  <span style={styles.infoLabel}>
                    <FaMapMarkerAlt size={12} /> Adres Sayısı
                  </span>
                  <span style={styles.infoValue}>
                    {userDetail.addresses_count ?? userDetail.addresses?.length ?? 0} adet
                  </span>
                </div>
                <div style={styles.infoItem}>
                  <span style={styles.infoLabel}>
                    <FaCalendarAlt size={12} /> Kayıt Tarihi
                  </span>
                  <span style={styles.infoValue}>{formatDateTime(userDetail.created_at)}</span>
                </div>
              </div>

              {/* Addresses */}
              {userDetail.addresses && userDetail.addresses.length > 0 && (
                <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid #e2e8f0' }}>
                  <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#0f172a', marginBottom: '12px' }}>
                    Kayıtlı Adresler
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {userDetail.addresses.map((addr, idx) => (
                      <div
                        key={idx}
                        style={{ padding: '12px', backgroundColor: '#f8fafc', borderRadius: '8px', fontSize: '14px' }}
                      >
                        <div style={{ fontWeight: '600', marginBottom: '4px' }}>
                          {addr.title || `Adres ${idx + 1}`}
                          {addr.is_default && (
                            <span style={{ marginLeft: '8px', fontSize: '11px', color: '#059669' }}>(Varsayılan)</span>
                          )}
                        </div>
                        <div style={{ color: '#64748b' }}>
                          {addr.address_line}, {addr.district}/{addr.city}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <OrdersList orders={userOrders} isLoading={loadingOrders} />
          )}
        </div>

        <div style={styles.modalFooter}>
          <button onClick={onClose} style={styles.btn}>
            Kapat
          </button>
          <button onClick={onEdit} style={{ ...styles.btn, ...styles.btnPrimary }}>
            <FaEdit /> Düzenle
          </button>
        </div>
      </div>
    </div>
  );
});

UserDetailModal.displayName = 'UserDetailModal';

UserDetailModal.propTypes = {
  userDetail: PropTypes.object,
  isLoading: PropTypes.bool,
  activeTab: PropTypes.string.isRequired,
  onTabChange: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  userOrders: PropTypes.array.isRequired,
  loadingOrders: PropTypes.bool,
};

export default UserDetailModal;
