// src/pages/vendor/Products/components/Pagination.jsx
import React from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { styles } from '../styles';

const Pagination = ({ meta, currentPage, onPageChange }) => {
  if (!meta || meta.last_page <= 1) return null;

  const { last_page, from, to, total } = meta;

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(last_page, start + maxVisible - 1);
    
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  return (
    <div style={styles.pagination}>
      <span style={styles.paginationInfo}>
        {from}-{to} / {total} ürün
      </span>
      
      <div style={styles.paginationButtons}>
        <button
          style={{
            ...styles.paginationBtn,
            ...(currentPage === 1 ? styles.paginationBtnDisabled : {})
          }}
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <FaChevronLeft />
        </button>
        
        {getPageNumbers().map(page => (
          <button
            key={page}
            style={{
              ...styles.paginationBtn,
              ...(page === currentPage ? styles.paginationBtnActive : {})
            }}
            onClick={() => onPageChange(page)}
          >
            {page}
          </button>
        ))}
        
        <button
          style={{
            ...styles.paginationBtn,
            ...(currentPage === last_page ? styles.paginationBtnDisabled : {})
          }}
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === last_page}
        >
          <FaChevronRight />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
