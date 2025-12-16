// src/pages/admin/Applications/components/modals/VendorDetailModal/GeneralTab.jsx
import React from 'react';
import PropTypes from 'prop-types';
import { 
  FaBuilding, FaUser, FaEnvelope, FaPhone, FaCalendarAlt, FaClock, FaCheckCircle 
} from 'react-icons/fa';
import { DetailField, DetailSection } from '../../../shared/components';
import { formatDateTime } from '../../../shared/utils/formatters';

/**
 * General Information Tab for Vendor Detail Modal
 */
const GeneralTab = React.memo(({ vendor }) => {
  return (
    <div style={{ animation: 'fadeInContent 0.3s ease' }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '20px',
          marginBottom: '24px',
        }}
      >
        {/* Company Information Card */}
        <DetailSection title="Şirket Bilgileri" icon={<FaBuilding />}>
          <DetailField
            label="Şirket Adı"
            value={vendor.company_name || vendor.storeName}
          />
          <DetailField
            label="Vergi Numarası"
            value={vendor.tax_id}
            style={{ fontFamily: 'monospace' }}
          />
          <DetailField
            label="Satıcı Tipi"
            value={vendor.merchant_type || 'Bireysel'}
          />
        </DetailSection>

        {/* Contact Information Card */}
        <DetailSection title="İletişim Bilgileri" icon={<FaUser />}>
          <DetailField
            label="Yetkili Kişi"
            value={vendor.full_name || vendor.owner}
          />
          <DetailField
            label="E-posta Adresi"
            value={vendor.email}
            icon={<FaEnvelope />}
          />
          <DetailField
            label="Telefon Numarası"
            value={vendor.phone}
            icon={<FaPhone />}
          />
        </DetailSection>
      </div>

      {/* Application Information */}
      <DetailSection title="Başvuru Bilgileri" icon={<FaClock />}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '16px',
          }}
        >
          <DetailField
            label="Başvuru Tarihi"
            value={formatDateTime(vendor.created_at)}
            icon={<FaCalendarAlt />}
          />
          <div>
            <label
              style={{
                display: 'block',
                fontSize: '12px',
                fontWeight: '600',
                color: '#6b7280',
                marginBottom: '6px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              Durum
            </label>
            <div
              style={{
                fontSize: '15px',
                fontWeight: '700',
                padding: '10px 14px',
                background: vendor.status === 'approved' ? '#dcfce7' : '#f0fdf4',
                color: vendor.status === 'approved' ? '#059669' : '#065f46',
                borderRadius: '10px',
                border: '1px solid',
                borderColor: vendor.status === 'approved' ? '#86efac' : '#86efac',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              {vendor.status === 'approved' ? <FaCheckCircle /> : <FaClock />}
              {vendor.status === 'approved' ? 'Onaylandı' : 'Onay Bekliyor'}
            </div>
          </div>
        </div>
      </DetailSection>
    </div>
  );
});

GeneralTab.displayName = 'GeneralTab';

GeneralTab.propTypes = {
  vendor: PropTypes.object.isRequired,
};

export default GeneralTab;
