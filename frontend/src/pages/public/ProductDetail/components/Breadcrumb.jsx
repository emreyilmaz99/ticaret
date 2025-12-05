// src/pages/public/ProductDetail/components/Breadcrumb.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FaChevronRight } from 'react-icons/fa';

/**
 * Breadcrumb navigation
 */
const Breadcrumb = ({ product, styles }) => {
  return (
    <nav style={styles.breadcrumb}>
      <Link to="/" style={styles.breadcrumbLink}>Ana Sayfa</Link>
      <FaChevronRight size={10} />
      <Link to="/products" style={styles.breadcrumbLink}>Ürünler</Link>
      {product.breadcrumb?.map((crumb, i) => (
        <React.Fragment key={i}>
          <FaChevronRight size={10} />
          <Link to={`/category/${crumb.slug}`} style={styles.breadcrumbLink}>
            {crumb.name}
          </Link>
        </React.Fragment>
      ))}
      <FaChevronRight size={10} />
      <span style={{ color: '#0f172a' }}>{product.name}</span>
    </nav>
  );
};

export default Breadcrumb;
