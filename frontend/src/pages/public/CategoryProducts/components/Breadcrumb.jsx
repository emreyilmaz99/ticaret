// src/pages/public/CategoryProducts/components/Breadcrumb.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FaChevronRight } from 'react-icons/fa';

/**
 * Breadcrumb navigation component
 */
export const Breadcrumb = ({ items, styles }) => {
  return (
    <nav style={styles.breadcrumb}>
      {items.map((item, index) => (
        <React.Fragment key={item.name}>
          <Link
            to={item.path}
            style={{
              ...styles.breadcrumbLink,
              color: index === items.length - 1 ? '#064e3b' : '#666'
            }}
          >
            {item.name}
          </Link>
          {index < items.length - 1 && (
            <FaChevronRight style={{ fontSize: '10px', color: '#999', margin: '0 8px' }} />
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};
