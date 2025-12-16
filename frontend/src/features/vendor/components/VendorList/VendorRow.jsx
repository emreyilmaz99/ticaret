// src/features/vendor/components/VendorList/VendorRow.jsx
import React from 'react';
import PropTypes from 'prop-types';
import { FaStore, FaStar, FaEdit, FaBan, FaCheck, FaTimes, FaFolder } from 'react-icons/fa';
import { VENDOR_STATUS } from '../../shared/constants';
import { styles } from '../../shared/styles';

const VendorRow = React.memo(({
  vendor,
  onEdit,
  onApprove,
  onReject,
  onBan,
  onCategory,
  showCategoryButton = false,
}) => {
  const canApprove = vendor.status === VENDOR_STATUS.PENDING || vendor.status === VENDOR_STATUS.PRE_PENDING;
  const canReject = vendor.status === VENDOR_STATUS.PENDING || vendor.status === VENDOR_STATUS.PRE_PENDING;
  const canBan = vendor.status !== VENDOR_STATUS.PENDING && vendor.status !== VENDOR_STATUS.PRE_PENDING;

  return (
    <tr style={styles.tr}>
      <td style={styles.td}>
        <div style={styles.vendorCell}>
          <div style={styles.vendorAvatar}>
            <FaStore />
          </div>
          <div>
            <p style={styles.vendorName}>{vendor.storeName}</p>
            <p style={styles.vendorProducts}>{vendor.products} Ürün</p>
          </div>
        </div>
      </td>
      <td style={styles.td}>
        <p style={styles.ownerName}>{vendor.owner}</p>
        <p style={styles.ownerEmail}>{vendor.email}</p>
      </td>
      <td style={styles.td}>
        <span style={styles.revenue}>{vendor.revenue}</span>
      </td>
      <td style={styles.td}>
        <div style={styles.ratingContainer}>
          <FaStar />
          <span style={styles.ratingValue}>{vendor.rating}</span>
        </div>
      </td>
      <td style={styles.actionsCell}>
        <div style={styles.actionGroup}>
          {showCategoryButton && (
            <button
              onClick={() => onCategory(vendor)}
              title="Kategoriler"
              style={styles.actionButton('category')}
            >
              <FaFolder />
            </button>
          )}
          <button
            onClick={() => onEdit(vendor)}
            title="Düzenle"
            style={styles.actionButton('default')}
          >
            <FaEdit />
          </button>
          {canApprove && (
            <button
              title="Onayla"
              onClick={() => {
                if (!confirm('Bu satıcıyı onaylamak istiyor musunuz?')) return;
                onApprove(vendor);
              }}
              style={styles.actionButton('approve')}
            >
              <FaCheck />
            </button>
          )}
          {canReject && (
            <button
              title="Reddet"
              onClick={() => {
                if (!confirm('Bu satıcı başvurusunu reddetmek istiyor musunuz?')) return;
                onReject(vendor);
              }}
              style={styles.actionButton('reject')}
            >
              <FaTimes />
            </button>
          )}
          {canBan && (
            <button
              title="Yasakla"
              onClick={() => {
                if (!confirm('Bu satıcıyı yasaklamak istiyor musunuz?')) return;
                onBan(vendor);
              }}
              style={styles.actionButton('reject')}
            >
              <FaBan />
            </button>
          )}
        </div>
      </td>
    </tr>
  );
});

VendorRow.displayName = 'VendorRow';

VendorRow.propTypes = {
  vendor: PropTypes.shape({
    id: PropTypes.number.isRequired,
    storeName: PropTypes.string.isRequired,
    products: PropTypes.number,
    owner: PropTypes.string,
    email: PropTypes.string,
    revenue: PropTypes.string,
    rating: PropTypes.number,
    status: PropTypes.string,
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
  onApprove: PropTypes.func.isRequired,
  onReject: PropTypes.func.isRequired,
  onBan: PropTypes.func.isRequired,
  onCategory: PropTypes.func,
  showCategoryButton: PropTypes.bool,
};

export default VendorRow;
