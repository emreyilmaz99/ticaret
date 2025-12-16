// src/pages/admin/Applications/components/tables/ApplicationTable/index.jsx
import React from 'react';
import PropTypes from 'prop-types';
import { FaStore, FaUser, FaEnvelope, FaIdCard, FaCalendarAlt } from 'react-icons/fa';
import ApplicationRow from './ApplicationRow';
import { EmptyState, LoadingSpinner } from '../../../shared/components';
import { styles } from '../../../styles';

/**
 * Generic Application Table Component
 * Supports both 'full' and 'pre' application modes
 */
const ApplicationTable = React.memo(({
  applications,
  isLoading,
  searchTerm,
  hoveredRow,
  setHoveredRow,
  onView,
  onApprove,
  onReject,
  onCopyEmail,
  mode = 'full', // 'full' or 'pre'
  emptyMessage,
  emptySearchMessage,
}) => {
  const isFull = mode === 'full';
  const isPre = mode === 'pre';

  // Default messages
  const defaultEmptyMessage = isFull
    ? 'Aktivasyon bekleyen satıcı yok'
    : 'Henüz ön başvuru yok';
  const defaultEmptySearchMessage = isFull
    ? 'Arama kriterlerine uygun satıcı bulunamadı'
    : 'Arama kriterlerine uygun başvuru bulunamadı';

  const finalEmptyMessage = emptyMessage || defaultEmptyMessage;
  const finalEmptySearchMessage = emptySearchMessage || defaultEmptySearchMessage;

  // Column count
  const colSpan = isPre ? 6 : 5;

  if (isLoading) {
    return (
      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr>
              {isFull ? (
                <>
                  <th style={styles.th}>
                    <FaStore style={{ marginRight: '6px' }} />
                    Şirket / Mağaza
                  </th>
                  <th style={styles.th}>
                    <FaUser style={{ marginRight: '6px' }} />
                    Yetkili
                  </th>
                  <th style={styles.th}>
                    <FaEnvelope style={{ marginRight: '6px' }} />
                    İletişim
                  </th>
                  <th style={styles.th}>
                    <FaIdCard style={{ marginRight: '6px' }} />
                    Bilgiler
                  </th>
                </>
              ) : (
                <>
                  <th style={styles.th}>
                    <FaUser style={{ marginRight: '6px' }} />
                    Başvuru Sahibi
                  </th>
                  <th style={styles.th}>
                    <FaEnvelope style={{ marginRight: '6px' }} />
                    İletişim
                  </th>
                  <th style={styles.th}>Şirket</th>
                  <th style={styles.th}>
                    <FaCalendarAlt style={{ marginRight: '6px' }} />
                    Tarih
                  </th>
                  <th style={styles.th}>Durum</th>
                </>
              )}
              <th style={{ ...styles.th, textAlign: 'right' }}>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={colSpan} style={styles.emptyState}>
                <LoadingSpinner />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div style={styles.tableContainer}>
      <table style={styles.table}>
        <thead>
          <tr>
            {isFull ? (
              <>
                <th style={styles.th}>
                  <FaStore style={{ marginRight: '6px' }} />
                  Şirket / Mağaza
                </th>
                <th style={styles.th}>
                  <FaUser style={{ marginRight: '6px' }} />
                  Yetkili
                </th>
                <th style={styles.th}>
                  <FaEnvelope style={{ marginRight: '6px' }} />
                  İletişim
                </th>
                <th style={styles.th}>
                  <FaIdCard style={{ marginRight: '6px' }} />
                  Bilgiler
                </th>
              </>
            ) : (
              <>
                <th style={styles.th}>
                  <FaUser style={{ marginRight: '6px' }} />
                  Başvuru Sahibi
                </th>
                <th style={styles.th}>
                  <FaEnvelope style={{ marginRight: '6px' }} />
                  İletişim
                </th>
                <th style={styles.th}>Şirket</th>
                <th style={styles.th}>
                  <FaCalendarAlt style={{ marginRight: '6px' }} />
                  Tarih
                </th>
                <th style={styles.th}>Durum</th>
              </>
            )}
            <th style={{ ...styles.th, textAlign: 'right' }}>İşlemler</th>
          </tr>
        </thead>
        <tbody>
          {applications.length === 0 ? (
            <tr>
              <td colSpan={colSpan} style={styles.emptyState}>
                <EmptyState
                  icon={isFull ? '✅' : '📋'}
                  title={searchTerm ? finalEmptySearchMessage : finalEmptyMessage}
                  description={
                    searchTerm
                      ? 'Farklı bir arama terimi deneyin'
                      : isFull
                      ? 'Tüm satıcılar işlenmiş durumda'
                      : 'Yeni başvurular burada görünecek'
                  }
                />
              </td>
            </tr>
          ) : (
            applications.map((app) => (
              <ApplicationRow
                key={app.id}
                application={app}
                mode={mode}
                isHovered={hoveredRow === app.id}
                onMouseEnter={() => setHoveredRow(app.id)}
                onMouseLeave={() => setHoveredRow(null)}
                onView={onView}
                onApprove={onApprove}
                onReject={onReject}
                onCopyEmail={onCopyEmail}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
});

ApplicationTable.displayName = 'ApplicationTable';

ApplicationTable.propTypes = {
  applications: PropTypes.array.isRequired,
  isLoading: PropTypes.bool,
  searchTerm: PropTypes.string,
  hoveredRow: PropTypes.number,
  setHoveredRow: PropTypes.func.isRequired,
  onView: PropTypes.func.isRequired,
  onApprove: PropTypes.func.isRequired,
  onReject: PropTypes.func.isRequired,
  onCopyEmail: PropTypes.func,
  mode: PropTypes.oneOf(['full', 'pre']),
  emptyMessage: PropTypes.string,
  emptySearchMessage: PropTypes.string,
};

export default ApplicationTable;
