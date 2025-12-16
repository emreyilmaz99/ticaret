// src/pages/admin/Applications/components/tables/ApplicationTable/ApplicationRow.jsx
import React from 'react';
import PropTypes from 'prop-types';
import { FaStore, FaUser, FaPhone, FaEye, FaCheck, FaTimes, FaCopy } from 'react-icons/fa';
import { ActionButton, StatusBadge } from '../../../shared/components';
import { formatDate, formatDateTime, getInitials } from '../../../shared/utils/formatters';
import { styles } from '../../../styles';

/**
 * Application Table Row Component
 */
const ApplicationRow = React.memo(({
  application,
  mode,
  isHovered,
  onMouseEnter,
  onMouseLeave,
  onView,
  onApprove,
  onReject,
  onCopyEmail,
}) => {
  const isFull = mode === 'full';
  const isPre = mode === 'pre';

  return (
    <tr
      style={styles.tableRow(isHovered)}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* Column 1: Company/Applicant */}
      <td style={styles.td}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div
            style={
              isFull
                ? styles.storeIcon
                : {
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: '700',
                    fontSize: '14px',
                  }
            }
          >
            {isFull ? (
              <FaStore size={18} />
            ) : (
              getInitials(application.full_name)
            )}
          </div>
          <div>
            <div style={{ fontWeight: '600', color: '#064e3b' }}>
              {isFull
                ? application.company_name || application.storeName
                : application.full_name}
            </div>
            <div style={{ fontSize: '12px', color: '#6b7280' }}>
              ID: {application.id}
            </div>
          </div>
        </div>
      </td>

      {/* Column 2: Contact/Owner */}
      <td style={styles.td}>
        {isFull ? (
          <>
            <div style={{ fontWeight: '600', color: '#064e3b' }}>
              {application.full_name || application.owner}
            </div>
            <div style={{ fontSize: '12px', color: '#6b7280' }}>
              {formatDate(application.created_at)}
            </div>
          </>
        ) : (
          <>
            <div style={{ color: '#059669', fontWeight: '500' }}>
              {application.email}
            </div>
            <div
              style={{
                fontSize: '12px',
                color: '#6b7280',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <FaPhone size={10} /> {application.phone || '-'}
            </div>
          </>
        )}
      </td>

      {/* Column 3: Email/Company */}
      <td style={styles.td}>
        {isFull ? (
          <>
            <div style={{ color: '#059669', fontWeight: '500' }}>
              {application.email}
            </div>
            <div
              style={{
                fontSize: '12px',
                color: '#6b7280',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <FaPhone size={10} /> {application.phone || '-'}
            </div>
          </>
        ) : (
          <>
            <div style={{ fontWeight: '500', color: '#374151' }}>
              {application.company_name || '-'}
            </div>
            <div style={{ fontSize: '12px', color: '#6b7280' }}>
              {application.merchant_type || '-'}
            </div>
          </>
        )}
      </td>

      {/* Column 4: Info/Date */}
      <td style={styles.td}>
        {isFull ? (
          <>
            {application.merchant_type && (
              <div style={{ fontSize: '13px' }}>
                <span style={{ color: '#6b7280' }}>Tür:</span>{' '}
                {application.merchant_type}
              </div>
            )}
            <div style={{ fontSize: '12px', color: '#6b7280' }}>
              IBAN: {application.iban ? '✓ Var' : '✗ Yok'}
            </div>
          </>
        ) : (
          <>
            <div style={{ fontSize: '13px', color: '#374151' }}>
              {formatDate(application.created_at)}
            </div>
            <div style={{ fontSize: '11px', color: '#9ca3af' }}>
              {new Date(application.created_at).toLocaleTimeString('tr-TR', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </div>
          </>
        )}
      </td>

      {/* Column 5: Status (only for pre) */}
      {isPre && (
        <td style={styles.td}>
          <StatusBadge status={application.status} />
        </td>
      )}

      {/* Column 6: Actions */}
      <td style={{ ...styles.td, textAlign: 'right' }}>
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
          <ActionButton
            icon={<FaEye />}
            onClick={() => onView(application)}
            title="Detay"
            variant="view"
          />
          
          {isPre && onCopyEmail && (
            <ActionButton
              icon={<FaCopy />}
              onClick={() => onCopyEmail(application.email)}
              title="E-posta Kopyala"
              variant="default"
            />
          )}
          
          {((isPre && application.status === 'pending') || isFull) && (
            <>
              <ActionButton
                icon={<FaCheck />}
                onClick={() => onApprove(application)}
                title="Onayla"
                variant="approve"
              />
              <ActionButton
                icon={<FaTimes />}
                onClick={() => onReject(application)}
                title="Reddet"
                variant="reject"
              />
            </>
          )}
        </div>
      </td>
    </tr>
  );
});

ApplicationRow.displayName = 'ApplicationRow';

ApplicationRow.propTypes = {
  application: PropTypes.object.isRequired,
  mode: PropTypes.oneOf(['full', 'pre']).isRequired,
  isHovered: PropTypes.bool,
  onMouseEnter: PropTypes.func.isRequired,
  onMouseLeave: PropTypes.func.isRequired,
  onView: PropTypes.func.isRequired,
  onApprove: PropTypes.func.isRequired,
  onReject: PropTypes.func.isRequired,
  onCopyEmail: PropTypes.func,
};

export default ApplicationRow;
