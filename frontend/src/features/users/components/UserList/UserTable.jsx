// src/features/users/components/UserList/UserTable.jsx
import React from 'react';
import PropTypes from 'prop-types';
import { FaSortAmountDown, FaSortAmountUp } from 'react-icons/fa';
import UserRow from './UserRow';
import Pagination from '../../../../components/ui/Pagination';
import { styles } from '../../shared/styles';

const UserTable = React.memo(({
  users,
  isLoading,
  sortBy,
  sortOrder,
  onSort,
  onView,
  onToggleStatus,
  onDelete,
  meta,
  onPageChange,
  isToggling,
}) => {
  const SortIcon = sortOrder === 'asc' ? FaSortAmountUp : FaSortAmountDown;

  const renderSortHeader = (field, label) => (
    <th style={styles.th} onClick={() => onSort(field)}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        {label}
        {sortBy === field && <SortIcon size={12} />}
      </div>
    </th>
  );

  return (
    <div style={{ ...styles.card, overflow: 'hidden' }}>
      <div style={{ overflowX: 'auto' }}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Kullanıcı</th>
              {renderSortHeader('email', 'Email')}
              <th style={styles.th}>Telefon</th>
              <th style={styles.th}>Durum</th>
              <th style={styles.th}>Email Doğrulama</th>
              {renderSortHeader('last_login_at', 'Son Giriş')}
              {renderSortHeader('created_at', 'Kayıt Tarihi')}
              <th style={{ ...styles.th, textAlign: 'right' }}>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={8} style={{ padding: '48px', textAlign: 'center', color: '#64748b' }}>
                  Yükleniyor...
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ padding: '48px', textAlign: 'center', color: '#64748b' }}>
                  Kullanıcı bulunamadı.
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <UserRow
                  key={user.id}
                  user={user}
                  onView={onView}
                  onToggleStatus={onToggleStatus}
                  onDelete={onDelete}
                  isToggling={isToggling}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      {meta && meta.last_page > 1 && (
        <div style={{ padding: '16px 24px', borderTop: '1px solid #f1f5f9' }}>
          <Pagination
            currentPage={meta.current_page}
            totalPages={meta.last_page}
            totalItems={meta.total}
            perPage={meta.per_page}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </div>
  );
});

UserTable.displayName = 'UserTable';

UserTable.propTypes = {
  users: PropTypes.array.isRequired,
  isLoading: PropTypes.bool,
  sortBy: PropTypes.string.isRequired,
  sortOrder: PropTypes.string.isRequired,
  onSort: PropTypes.func.isRequired,
  onView: PropTypes.func.isRequired,
  onToggleStatus: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  meta: PropTypes.object,
  onPageChange: PropTypes.func.isRequired,
  isToggling: PropTypes.bool,
};

export default UserTable;
