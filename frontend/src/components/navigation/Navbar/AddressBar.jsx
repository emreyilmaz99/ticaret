// src/components/Navbar/AddressBar.jsx
import React from 'react';
import PropTypes from 'prop-types';
import { FaMapMarkerAlt, FaChevronDown } from 'react-icons/fa';
import CategoryMenu from '../../common/CategoryMenu';
import { styles } from './styles';

/**
 * Alt bar bileşeni - Adres seçici ve kategori menüsü
 * @param {Object} user - Giriş yapmış kullanıcı bilgisi
 * @param {Object} currentAddress - Seçili teslimat adresi
 * @param {function} handleAddressClick - Adres butonuna tıklandığında çağrılacak fonksiyon
 * @param {function} handleDealsClick - Günün Fırsatları'na tıklandığında çağrılacak fonksiyon
 */
const AddressBar = ({ user, currentAddress, handleAddressClick, handleDealsClick }) => {
  return (
    <div style={styles.bottomBar}>
      <div style={{ ...styles.container, justifyContent: 'space-between', position: 'relative' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          {user && (
            <>
              <button style={styles.addressBtn} onClick={handleAddressClick}>
                <FaMapMarkerAlt color="#059669" />
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', lineHeight: '1.2' }}>
                  <span style={{ fontSize: '10px', color: '#64748b' }}>Teslimat Adresi</span>
                  <span style={{ fontWeight: '600', color: '#1e293b' }}>
                    {currentAddress ? (
                      <>
                        {currentAddress.label || currentAddress.title || 'Adres'}
                        {(currentAddress.district || currentAddress.city) 
                          ? ` - ${currentAddress.district || ''}${currentAddress.district && currentAddress.city ? '/' : ''}${currentAddress.city || ''}`
                          : (currentAddress.address_line ? ` - ${currentAddress.address_line.substring(0, 20)}${currentAddress.address_line.length > 20 ? '...' : ''}` : '')}
                      </>
                    ) : 'Adres Seçin'}
                  </span>
                </div>
                <FaChevronDown size={10} style={{ marginLeft: '4px' }} />
              </button>
              <div style={{ width: '1px', height: '20px', backgroundColor: '#cbd5e1' }}></div>
            </>
          )}
          <CategoryMenu />
        </div>
        <div 
          style={{ fontSize: '13px', color: '#059669', fontWeight: '600', cursor: 'pointer' }}
          onClick={handleDealsClick}
        >
          Günün Fırsatları
        </div>
      </div>
    </div>
  );
};

AddressBar.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    name: PropTypes.string,
    email: PropTypes.string,
  }),
  currentAddress: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    label: PropTypes.string,
    title: PropTypes.string,
    district: PropTypes.string,
    city: PropTypes.string,
    address_line: PropTypes.string,
  }),
  handleAddressClick: PropTypes.func.isRequired,
  handleDealsClick: PropTypes.func.isRequired,
};

AddressBar.defaultProps = {
  user: null,
  currentAddress: null,
};

export default AddressBar;