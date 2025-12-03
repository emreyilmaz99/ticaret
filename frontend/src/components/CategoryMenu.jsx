import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { categories } from '../data/categories';
import { FaChevronRight } from 'react-icons/fa';

const CategoryMenu = () => {
  const [activeCategory, setActiveCategory] = useState(null);

  const styles = {
    container: {
      fontFamily: '"Inter", sans-serif',
    },
    menuList: {
      display: 'flex',
      gap: '32px',
      listStyle: 'none',
      margin: 0,
      padding: 0,
    },
    menuItem: {
      padding: '10px 0',
    },
    menuLink: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      textDecoration: 'none',
      color: '#334155',
      fontSize: '14px',
      fontWeight: '600',
      transition: 'color 0.2s',
      cursor: 'pointer',
    },
    activeLink: {
      color: '#059669',
    },
    megaMenu: {
      position: 'absolute',
      top: '100%',
      left: 0,
      width: '100%',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(12px)',
      border: '1px solid rgba(226, 232, 240, 0.8)',
      borderRadius: '0 0 12px 12px',
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.05)',
      padding: '32px',
      zIndex: 9999,
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: '32px',
      opacity: 0,
      visibility: 'hidden',
      transform: 'translateY(10px)',
      transition: 'all 0.2s ease',
    },
    megaMenuActive: {
      opacity: 1,
      visibility: 'visible',
      transform: 'translateY(0)',
    },
    column: {
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
    },
    columnTitle: {
      fontSize: '14px',
      fontWeight: '700',
      color: '#0f172a',
      borderBottom: '2px solid #e2e8f0',
      paddingBottom: '8px',
      marginBottom: '8px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    subList: {
      listStyle: 'none',
      padding: 0,
      margin: 0,
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
    },
    subItem: {
      fontSize: '13px',
      color: '#64748b',
      textDecoration: 'none',
      transition: 'all 0.2s',
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
    },
    subItemHover: {
      color: '#059669',
      transform: 'translateX(4px)',
    }
  };

  return (
    <nav style={styles.container} onMouseLeave={() => setActiveCategory(null)}>
      <ul style={styles.menuList}>
        {categories.map((category) => (
          <li 
            key={category.id} 
            style={styles.menuItem}
            onMouseEnter={() => setActiveCategory(category.id)}
          >
            <Link 
              to={`/?category=${category.id}`} 
              style={{
                ...styles.menuLink,
                ...(activeCategory === category.id ? styles.activeLink : {})
              }}
            >
              <span style={{ fontSize: '16px', color: activeCategory === category.id ? '#059669' : '#94a3b8' }}>
                {category.icon}
              </span>
              {category.title}
            </Link>

            {/* Mega Menu Dropdown */}
            <div style={{
              ...styles.megaMenu,
              ...(activeCategory === category.id ? styles.megaMenuActive : {})
            }}>
              {category.subcategories.map((sub, index) => (
                <div key={index} style={styles.column}>
                  <div style={styles.columnTitle}>
                    {sub.title}
                  </div>
                  <ul style={styles.subList}>
                    {sub.items.map((item, idx) => (
                      <li key={idx}>
                        <Link 
                          to={`/?category=${category.id}&sub=${encodeURIComponent(item)}`}
                          style={styles.subItem}
                          onMouseEnter={(e) => {
                            e.target.style.color = styles.subItemHover.color;
                            e.target.style.transform = styles.subItemHover.transform;
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.color = styles.subItem.color;
                            e.target.style.transform = 'none';
                          }}
                        >
                          <FaChevronRight size={8} style={{ opacity: 0.5 }} />
                          {item}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default CategoryMenu;
