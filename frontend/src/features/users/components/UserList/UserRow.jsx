// src/features/users/components/UserList/UserRow.jsx
import React from 'react';
import PropTypes from 'prop-types';
import { FaEye, FaTrash, FaToggleOn, FaToggleOff, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import UserAvatar from './UserAvatar';
import { formatDate, formatDateTime } from '../../utils/formatters';
import { styles } from '../../shared/styles';

const UserRow = React.memo(({
  user,
  onView,
  onToggleStatus,
  onDelete,
  isToggling,
}) => {
  return (
    <tr style={{ transition: 'background-color 0.2s' }}>
      <td style={styles.td}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <UserAvatar user={user} />
          <div>
            <div style={{ fontWeight: '600', color: '#0f172a' }}>{user.name}</div>
            <div style={{ fontSize: '12px', color: '#94a3b8' }}>ID: #{user.id}</div>
          </div>
        </div>
      </td>
      <td style={styles.td}>{user.email}</td>
      <td style={styles.td}>{user.phone || '-'}</td>
      <td style={styles.td}>
        <span style={styles.badge(user.is_active ? 'green' : 'red')}>
          {user.is_active ? <FaCheckCircle size={10} /> : <FaTimesCircle size={10} />}
          {user.is_active ? 'Aktif' : 'Pasif'}
        </span>
      </td>
      <td style={styles.td}>
        <span style={styles.badge(user.email_verified_at ? 'green' : 'yellow')}>
          {user.email_verified_at ? 'Doğrulanmış' : 'Bekliyor'}
        </span>
      </td>
      <td style={styles.td}>{formatDateTime(user.last_login_at)}</td>
      <td style={styles.td}>{formatDate(user.created_at)}</td>
      <td style={{ ...styles.td, textAlign: 'right' }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
          <button
            onClick={() => onView(user)}
            style={styles.actionBtn('blue')}
            title="Detay"
          >
            <FaEye />
          </button>
          <button
            onClick={() => onToggleStatus(user.id)}
            style={styles.actionBtn(user.is_active ? 'gray' : 'green')}
            title={user.is_active ? 'Pasife Al' : 'Aktif Et'}
            disabled={isToggling}
          >
            {user.is_active ? <FaToggleOff /> : <FaToggleOn />}
          </button>
          <button
            onClick={() => onDelete(user)}
            style={styles.actionBtn('red')}
            title="Sil"
          >
            <FaTrash />
          </button>
        </div>
      </td>
    </tr>
  );
});

UserRow.displayName = 'UserRow';

UserRow.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    phone: PropTypes.string,
    is_active: PropTypes.bool,
    email_verified_at: PropTypes.string,
    last_login_at: PropTypes.string,
    created_at: PropTypes.string,
    avatar: PropTypes.string,
  }).isRequired,
  onView: PropTypes.func.isRequired,
  onToggleStatus: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  isToggling: PropTypes.bool,
};

export default UserRow;
