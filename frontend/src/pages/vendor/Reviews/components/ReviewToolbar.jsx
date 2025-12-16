import React from 'react';
import PropTypes from 'prop-types';
import { FaSearch } from 'react-icons/fa';

const ReviewToolbar = ({ filters, handleFilterChange, styles }) => {
  return (
    <div style={styles.toolbar}>
      <div style={styles.toolbarLeft}>
        <div style={styles.searchWrapper}>
          <FaSearch style={styles.searchIcon} />
          <input
            type="text"
            placeholder="Yorumlarda ara..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            style={styles.searchInput}
          />
        </div>
        <select
          value={filters.rating}
          onChange={(e) => handleFilterChange('rating', e.target.value)}
          style={styles.filterSelect}
        >
          <option value="">Tüm Puanlar</option>
          <option value="5">5 Yıldız</option>
          <option value="4">4 Yıldız</option>
          <option value="3">3 Yıldız</option>
          <option value="2">2 Yıldız</option>
          <option value="1">1 Yıldız</option>
        </select>
        <select
          value={filters.sortBy}
          onChange={(e) => handleFilterChange('sortBy', e.target.value)}
          style={styles.filterSelect}
        >
          <option value="newest">En Yeni</option>
          <option value="oldest">En Eski</option>
          <option value="highest_rating">En Yüksek Puan</option>
          <option value="lowest_rating">En Düşük Puan</option>
        </select>
      </div>
      <div style={styles.filterBtns}>
        <button
          style={styles.filterBtn(filters.hasResponse === '')}
          onClick={() => handleFilterChange('hasResponse', '')}
        >
          Tümü
        </button>
        <button
          style={styles.filterBtn(filters.hasResponse === 'pending')}
          onClick={() => handleFilterChange('hasResponse', 'pending')}
        >
          Yanıt Bekleyen
        </button>
        <button
          style={styles.filterBtn(filters.hasResponse === 'responded')}
          onClick={() => handleFilterChange('hasResponse', 'responded')}
        >
          Yanıtlanan
        </button>
      </div>
    </div>
  );
};

ReviewToolbar.propTypes = {
  filters: PropTypes.shape({
    search: PropTypes.string,
    rating: PropTypes.string,
    sortBy: PropTypes.string,
    hasResponse: PropTypes.string,
  }).isRequired,
  handleFilterChange: PropTypes.func.isRequired,
  styles: PropTypes.object.isRequired,
};

export default ReviewToolbar;
