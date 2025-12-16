// src/features/users/components/UserList/UserFilters.jsx
import React from 'react';
import PropTypes from 'prop-types';
import { FaSearch, FaFilter, FaTimes } from 'react-icons/fa';
import { styles } from '../../shared/styles';

const UserFilters = React.memo(({
  searchTerm,
  onSearchChange,
  showFilters,
  onToggleFilters,
  filters,
  onFilterChange,
  onResetFilters,
  totalUsers,
}) => {
  return (
    <div style={styles.card}>
      <div style={styles.headerCard}>
        <div style={styles.searchWrapper}>
          <FaSearch style={styles.searchIcon} />
          <input
            type="text"
            placeholder="İsim, email veya telefon ile ara..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            style={styles.searchInput}
          />
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div style={styles.stats}>
            <span>Toplam: <strong>{totalUsers || 0}</strong></span>
          </div>
          <button
            onClick={onToggleFilters}
            style={{
              ...styles.btn,
              ...(showFilters ? { backgroundColor: '#f1f5f9' } : {}),
            }}
          >
            <FaFilter /> Filtreler
          </button>
        </div>
      </div>

      {showFilters && (
        <div style={styles.filterPanel}>
          <div style={styles.filterGroup}>
            <label style={styles.filterLabel}>Durum</label>
            <select
              value={filters.is_active === null ? '' : filters.is_active.toString()}
              onChange={(e) => {
                const val = e.target.value;
                onFilterChange('is_active', val === '' ? null : val === 'true');
              }}
              style={styles.filterSelect}
            >
              <option value="">Tümü</option>
              <option value="true">Aktif</option>
              <option value="false">Pasif</option>
            </select>
          </div>

          <div style={styles.filterGroup}>
            <label style={styles.filterLabel}>Cinsiyet</label>
            <select
              value={filters.gender}
              onChange={(e) => onFilterChange('gender', e.target.value)}
              style={styles.filterSelect}
            >
              <option value="">Tümü</option>
              <option value="male">Erkek</option>
              <option value="female">Kadın</option>
              <option value="other">Diğer</option>
            </select>
          </div>

          <div style={styles.filterGroup}>
            <label style={styles.filterLabel}>Email Doğrulama</label>
            <select
              value={filters.email_verified === null ? '' : filters.email_verified.toString()}
              onChange={(e) => {
                const val = e.target.value;
                onFilterChange('email_verified', val === '' ? null : val === 'true');
              }}
              style={styles.filterSelect}
            >
              <option value="">Tümü</option>
              <option value="true">Doğrulanmış</option>
              <option value="false">Doğrulanmamış</option>
            </select>
          </div>

          <div style={styles.filterGroup}>
            <label style={styles.filterLabel}>&nbsp;</label>
            <button onClick={onResetFilters} style={{ ...styles.btn, padding: '8px 12px' }}>
              <FaTimes size={12} /> Temizle
            </button>
          </div>
        </div>
      )}
    </div>
  );
});

UserFilters.displayName = 'UserFilters';

UserFilters.propTypes = {
  searchTerm: PropTypes.string.isRequired,
  onSearchChange: PropTypes.func.isRequired,
  showFilters: PropTypes.bool.isRequired,
  onToggleFilters: PropTypes.func.isRequired,
  filters: PropTypes.object.isRequired,
  onFilterChange: PropTypes.func.isRequired,
  onResetFilters: PropTypes.func.isRequired,
  totalUsers: PropTypes.number,
};

export default UserFilters;
