import React from 'react';
import { FaChevronLeft, FaChevronRight, FaAngleDoubleLeft, FaAngleDoubleRight } from 'react-icons/fa';

/**
 * Reusable Pagination Component
 * 
 * @param {Object} props
 * @param {number} props.currentPage - Current active page (1-indexed)
 * @param {number} props.totalPages - Total number of pages
 * @param {number} props.totalItems - Total number of items (optional, for display)
 * @param {number} props.perPage - Items per page (optional, for display)
 * @param {function} props.onPageChange - Callback when page changes: (pageNumber) => void
 * @param {number} props.siblingCount - Number of siblings on each side of current page (default: 1)
 * @param {boolean} props.showInfo - Show "X / Y sayfa" info (default: true)
 * @param {boolean} props.showFirstLast - Show first/last page buttons (default: true)
 * @param {string} props.size - Size variant: 'sm' | 'md' | 'lg' (default: 'md')
 */
const Pagination = ({
  currentPage,
  totalPages,
  totalItems,
  perPage,
  onPageChange,
  siblingCount = 1,
  showInfo = true,
  showFirstLast = true,
  size = 'md'
}) => {
  // Generate page numbers to display
  const generatePageNumbers = () => {
    const pages = [];
    const totalNumbers = siblingCount * 2 + 3; // siblings + current + first + last
    const totalBlocks = totalNumbers + 2; // + 2 for dots

    if (totalPages <= totalBlocks) {
      // Show all pages
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
      const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

      const showLeftDots = leftSiblingIndex > 2;
      const showRightDots = rightSiblingIndex < totalPages - 1;

      if (!showLeftDots && showRightDots) {
        // Show more pages on the left
        const leftItemCount = 3 + 2 * siblingCount;
        for (let i = 1; i <= leftItemCount; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (showLeftDots && !showRightDots) {
        // Show more pages on the right
        pages.push(1);
        pages.push('...');
        const rightItemCount = 3 + 2 * siblingCount;
        for (let i = totalPages - rightItemCount + 1; i <= totalPages; i++) {
          pages.push(i);
        }
      } else if (showLeftDots && showRightDots) {
        // Show dots on both sides
        pages.push(1);
        pages.push('...');
        for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const pages = generatePageNumbers();

  // Size variants
  const sizeStyles = {
    sm: {
      button: { padding: '4px 8px', fontSize: '12px', minWidth: '28px' },
      info: { fontSize: '12px' }
    },
    md: {
      button: { padding: '6px 12px', fontSize: '14px', minWidth: '36px' },
      info: { fontSize: '13px' }
    },
    lg: {
      button: { padding: '8px 16px', fontSize: '16px', minWidth: '44px' },
      info: { fontSize: '14px' }
    }
  };

  const currentSize = sizeStyles[size] || sizeStyles.md;

  const styles = {
    container: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '16px',
      marginTop: '24px'
    },
    pagination: {
      display: 'flex',
      alignItems: 'center',
      gap: '4px'
    },
    button: {
      ...currentSize.button,
      border: '1px solid #e2e8f0',
      borderRadius: '6px',
      backgroundColor: 'white',
      color: '#475569',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: '500',
      transition: 'all 0.15s ease'
    },
    buttonActive: {
      backgroundColor: '#059669',
      borderColor: '#059669',
      color: 'white'
    },
    buttonDisabled: {
      opacity: 0.5,
      cursor: 'not-allowed',
      pointerEvents: 'none'
    },
    buttonHover: {
      backgroundColor: '#f1f5f9',
      borderColor: '#cbd5e1'
    },
    dots: {
      ...currentSize.button,
      border: 'none',
      backgroundColor: 'transparent',
      color: '#94a3b8',
      cursor: 'default'
    },
    info: {
      ...currentSize.info,
      color: '#64748b'
    }
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
    }
  };

  // Calculate range for info display
  const startItem = totalItems ? (currentPage - 1) * perPage + 1 : null;
  const endItem = totalItems ? Math.min(currentPage * perPage, totalItems) : null;

  return (
    <div style={styles.container}>
      {/* Info section */}
      {showInfo && (
        <div style={styles.info}>
          {totalItems && perPage ? (
            <span>
              <strong>{startItem}-{endItem}</strong> / {totalItems} kayıt
            </span>
          ) : (
            <span>
              Sayfa <strong>{currentPage}</strong> / {totalPages}
            </span>
          )}
        </div>
      )}

      {/* Pagination buttons */}
      <div style={styles.pagination}>
        {/* First page button */}
        {showFirstLast && (
          <button
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
            style={{
              ...styles.button,
              ...(currentPage === 1 ? styles.buttonDisabled : {})
            }}
            title="İlk sayfa"
          >
            <FaAngleDoubleLeft size={size === 'sm' ? 10 : size === 'lg' ? 14 : 12} />
          </button>
        )}

        {/* Previous page button */}
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          style={{
            ...styles.button,
            ...(currentPage === 1 ? styles.buttonDisabled : {})
          }}
          title="Önceki sayfa"
        >
          <FaChevronLeft size={size === 'sm' ? 10 : size === 'lg' ? 14 : 12} />
        </button>

        {/* Page numbers */}
        {pages.map((page, index) => (
          page === '...' ? (
            <span key={`dots-${index}`} style={styles.dots}>...</span>
          ) : (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              style={{
                ...styles.button,
                ...(page === currentPage ? styles.buttonActive : {})
              }}
            >
              {page}
            </button>
          )
        ))}

        {/* Next page button */}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          style={{
            ...styles.button,
            ...(currentPage === totalPages ? styles.buttonDisabled : {})
          }}
          title="Sonraki sayfa"
        >
          <FaChevronRight size={size === 'sm' ? 10 : size === 'lg' ? 14 : 12} />
        </button>

        {/* Last page button */}
        {showFirstLast && (
          <button
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages}
            style={{
              ...styles.button,
              ...(currentPage === totalPages ? styles.buttonDisabled : {})
            }}
            title="Son sayfa"
          >
            <FaAngleDoubleRight size={size === 'sm' ? 10 : size === 'lg' ? 14 : 12} />
          </button>
        )}
      </div>
    </div>
  );
};

export default Pagination;
