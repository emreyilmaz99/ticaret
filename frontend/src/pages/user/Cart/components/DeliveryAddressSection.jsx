// src/pages/user/Cart/DeliveryAddressSection.jsx
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FiMapPin, FiChevronDown, FiPlus, FiHome, FiCheck, FiX, FiTrash2 } from 'react-icons/fi';

/**
 * Teslimat Adresi Bölümü - Kompakt Tasarım
 */
const DeliveryAddressSection = ({
  selectedAddress,
  savedAddresses = [],
  onSelectAddress,
  onAddNewAddress,
  onDeleteAddress,
  isLoading = false,
  isDeleting = false,
  isMobile = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // Adres seç ve kapat
  const selectAddress = (address) => {
    if (onSelectAddress) {
      onSelectAddress(address);
    }
    setIsOpen(false);
  };

  // Yeni adres ekle
  const addNewAddress = () => {
    setIsOpen(false);
    if (onAddNewAddress) {
      onAddNewAddress();
    }
  };

  // Adres sil
  const deleteAddress = (e, addressId) => {
    e.stopPropagation();
    if (onDeleteAddress) {
      onDeleteAddress(addressId);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div style={styles.container}>
        <div style={styles.compact}>
          <div style={styles.icon}>
            <FiMapPin size={18} />
          </div>
          <div style={styles.info}>
            <div style={styles.label}>Teslimat Adresi</div>
            <div style={styles.text}>Yükleniyor...</div>
          </div>
        </div>
      </div>
    );
  }

  const addressText = selectedAddress
    ? [selectedAddress.address_line, selectedAddress.district, selectedAddress.city].filter(Boolean).join(', ')
    : 'Adres seçin';

  return (
    <div style={styles.container}>
      {/* Kompakt Görünüm */}
      <div style={styles.compact}>
        <div style={styles.icon}>
          <FiMapPin size={18} />
        </div>
        <div style={styles.info}>
          <div style={styles.label}>
            {selectedAddress?.label || 'Teslimat Adresi'}
          </div>
          <div style={styles.text}>{addressText}</div>
        </div>
        <button
          type="button"
          style={styles.changeBtn}
          onClick={() => {
            console.log('Değiştir tıklandı');
            setIsOpen(true);
          }}
        >
          Değiştir <FiChevronDown size={14} />
        </button>
      </div>

      {/* Modal */}
      {isOpen && (
        <div
          style={styles.overlay}
          onClick={() => setIsOpen(false)}
        >
          <div
            style={{
              ...styles.modal,
              width: isMobile ? '95%' : '480px',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div style={styles.header}>
              <div style={styles.title}>
                <FiMapPin size={20} color="#059669" />
                Teslimat Adresi Seçin
              </div>
              <button
                type="button"
                style={styles.closeBtn}
                onClick={() => setIsOpen(false)}
              >
                <FiX size={18} />
              </button>
            </div>

            {/* Content */}
            <div style={styles.content}>
              {savedAddresses.length === 0 ? (
                <div style={styles.empty}>
                  <FiHome size={32} color="#94a3b8" />
                  <div style={styles.emptyTitle}>Kayıtlı Adres Yok</div>
                  <div style={styles.emptyText}>Yeni bir adres ekleyin</div>
                </div>
              ) : (
                savedAddresses.map((address) => {
                  const isSelected = selectedAddress?.id === address.id;
                  const fullAddr = [
                    address.address_line,
                    address.neighborhood,
                    address.district,
                    address.city
                  ].filter(Boolean).join(', ');

                  return (
                    <div
                      key={address.id}
                      style={{
                        ...styles.card,
                        border: isSelected ? '2px solid #059669' : '2px solid #e2e8f0',
                        backgroundColor: 'white',
                      }}
                      onClick={() => selectAddress(address)}
                    >
                      {isSelected && (
                        <div style={styles.checkmark}>
                          <FiCheck size={12} />
                        </div>
                      )}
                      {/* Silme Butonu */}
                      <button
                        type="button"
                        style={styles.deleteBtn}
                        onClick={(e) => deleteAddress(e, address.id)}
                        disabled={isDeleting}
                        title="Adresi Sil"
                      >
                        <FiTrash2 size={14} />
                      </button>
                      <div
                        style={{
                          ...styles.cardLabel,
                          backgroundColor: isSelected ? '#059669' : '#e2e8f0',
                          color: isSelected ? 'white' : '#475569',
                        }}
                      >
                        <FiHome size={10} />
                        {address.label || 'Adres'}
                      </div>
                      <div style={styles.cardName}>{address.full_name}</div>
                      <div style={styles.cardPhone}>{address.phone}</div>
                      <div style={styles.cardAddress}>{fullAddr}</div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer */}
            <div style={styles.footer}>
              <button
                type="button"
                style={styles.addBtn}
                onClick={addNewAddress}
              >
                <FiPlus size={16} />
                Yeni Adres Ekle
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Styles
const styles = {
  container: {
    backgroundColor: 'white',
    borderRadius: '16px',
    border: '1px solid #e2e8f0',
    marginBottom: '16px',
    overflow: 'visible',
  },
  compact: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '14px 20px',
  },
  icon: {
    width: '36px',
    height: '36px',
    borderRadius: '10px',
    backgroundColor: '#f8fafc',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#059669',
  },
  info: {
    flex: 1,
    minWidth: 0,
  },
  label: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: '2px',
  },
  text: {
    fontSize: '13px',
    color: '#64748b',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  changeBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    backgroundColor: 'transparent',
    border: '1px solid #e2e8f0',
    color: '#475569',
    padding: '8px 12px',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '500',
    cursor: 'pointer',
  },
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 9999,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modal: {
    backgroundColor: 'white',
    borderRadius: '20px',
    maxHeight: '80vh',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 24px',
    borderBottom: '1px solid #e2e8f0',
    backgroundColor: '#f8fafc',
    borderRadius: '20px 20px 0 0',
  },
  title: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#1e293b',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  closeBtn: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    border: 'none',
    backgroundColor: '#f1f5f9',
    color: '#64748b',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: '16px',
    overflowY: 'auto',
    flex: 1,
  },
  card: {
    padding: '14px 16px',
    borderRadius: '12px',
    border: '2px solid #e2e8f0',
    cursor: 'pointer',
    marginBottom: '10px',
    position: 'relative',
    transition: 'all 0.2s',
    paddingRight: '80px', // Silme ve seçim butonları için alan
  },
  checkmark: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    width: '22px',
    height: '22px',
    borderRadius: '50%',
    backgroundColor: '#059669',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteBtn: {
    position: 'absolute',
    top: '10px',
    right: '40px',
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    border: 'none',
    backgroundColor: '#fee2e2',
    color: '#dc2626',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s',
  },
  cardLabel: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    padding: '3px 8px',
    borderRadius: '12px',
    fontSize: '11px',
    fontWeight: '600',
    marginBottom: '8px',
  },
  cardName: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: '4px',
  },
  cardPhone: {
    fontSize: '12px',
    color: '#64748b',
    marginBottom: '6px',
  },
  cardAddress: {
    fontSize: '13px',
    color: '#475569',
    lineHeight: '1.4',
  },
  footer: {
    padding: '16px 24px',
    borderTop: '1px solid #e2e8f0',
    backgroundColor: '#f8fafc',
    borderRadius: '0 0 20px 20px',
  },
  addBtn: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    backgroundColor: '#059669',
    border: 'none',
    color: 'white',
    padding: '12px 20px',
    borderRadius: '12px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  empty: {
    textAlign: 'center',
    padding: '32px 16px',
  },
  emptyTitle: {
    fontSize: '15px',
    fontWeight: '600',
    color: '#1e293b',
    marginTop: '12px',
    marginBottom: '6px',
  },
  emptyText: {
    fontSize: '13px',
    color: '#64748b',
  },
};

DeliveryAddressSection.propTypes = {
  selectedAddress: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    full_name: PropTypes.string,
    phone: PropTypes.string,
    label: PropTypes.string,
    address_line: PropTypes.string,
    neighborhood: PropTypes.string,
    district: PropTypes.string,
    city: PropTypes.string,
  }),
  savedAddresses: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      full_name: PropTypes.string,
      phone: PropTypes.string,
      label: PropTypes.string,
      address_line: PropTypes.string,
      neighborhood: PropTypes.string,
      district: PropTypes.string,
      city: PropTypes.string,
    })
  ),
  onSelectAddress: PropTypes.func,
  onAddNewAddress: PropTypes.func,
  onDeleteAddress: PropTypes.func,
  isLoading: PropTypes.bool,
  isDeleting: PropTypes.bool,
  isMobile: PropTypes.bool,
};

export default DeliveryAddressSection;
