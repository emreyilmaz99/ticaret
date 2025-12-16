// src/pages/admin/Applications/components/modals/VendorDetailModal/BankTab.jsx
import React from 'react';
import PropTypes from 'prop-types';
import { FaCreditCard, FaInfoCircle } from 'react-icons/fa';
import { DetailSection, EmptyState } from '../../../shared/components';
import { formatIBAN } from '../../../shared/utils/formatters';

/**
 * Bank Information Tab for Vendor Detail Modal
 */
const BankTab = React.memo(({ vendor }) => {
  const hasIBAN = vendor.iban;

  return (
    <div style={{ animation: 'fadeInContent 0.3s ease' }}>
      <DetailSection title="Banka Hesap Bilgileri" icon={<FaCreditCard />}>
        {hasIBAN ? (
          <div style={{ display: 'grid', gap: '20px' }}>
            {/* Bank Name */}
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '12px',
                  fontWeight: '600',
                  color: '#6b7280',
                  marginBottom: '8px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}
              >
                Banka Adı
              </label>
              <div
                style={{
                  fontSize: '16px',
                  color: '#111827',
                  fontWeight: '700',
                  padding: '14px 18px',
                  background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
                  borderRadius: '12px',
                  border: '2px solid #86efac',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                }}
              >
                <span
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '16px',
                  }}
                >
                  🏦
                </span>
                {vendor.bankName || '-'}
              </div>
            </div>

            {/* IBAN */}
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '12px',
                  fontWeight: '600',
                  color: '#6b7280',
                  marginBottom: '8px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}
              >
                IBAN Numarası
              </label>
              <div
                style={{
                  fontSize: '16px',
                  color: '#111827',
                  fontWeight: '700',
                  padding: '14px 18px',
                  background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
                  borderRadius: '12px',
                  border: '2px solid #86efac',
                  fontFamily: 'monospace',
                  letterSpacing: '1.5px',
                  wordBreak: 'break-all',
                }}
              >
                {formatIBAN(vendor.iban)}
              </div>
            </div>

            {/* Info Box */}
            <div
              style={{
                marginTop: '8px',
                padding: '16px',
                background: '#f0fdf4',
                border: '1px solid #86efac',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
              }}
            >
              <FaInfoCircle
                style={{
                  color: '#059669',
                  fontSize: '18px',
                  marginTop: '2px',
                  flexShrink: 0,
                }}
              />
              <div
                style={{
                  fontSize: '13px',
                  color: '#065f46',
                  lineHeight: '1.5',
                }}
              >
                <strong>Bilgi:</strong> Ödeme işlemleri bu IBAN üzerinden
                gerçekleştirilecektir. Banka bilgilerinin doğruluğunu kontrol ediniz.
              </div>
            </div>
          </div>
        ) : (
          <EmptyState
            icon="💳"
            title="Banka bilgisi girilmemiş"
            description="Satıcı henüz banka bilgilerini eklememiş"
          />
        )}
      </DetailSection>
    </div>
  );
});

BankTab.displayName = 'BankTab';

BankTab.propTypes = {
  vendor: PropTypes.object.isRequired,
};

export default BankTab;
