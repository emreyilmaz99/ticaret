// src/components/common/CategoryMenu/index.jsx
import React, { useState, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { FaChevronRight } from 'react-icons/fa';
import { useQuery } from '@tanstack/react-query';
import { getCategoryTree } from '../../../api/publicApi';
import * as FaIcons from 'react-icons/fa';
import { categoryMenuStyles as styles } from './styles';

const CategoryMenu = () => {
  const [activeCategory, setActiveCategory] = useState(null);

  // Icon cache for performance
  const iconCache = useMemo(() => new Map(), []);

  const getIconComponent = useCallback((iconName) => {
    if (!iconName) return FaIcons.FaBox;
    
    if (iconCache.has(iconName)) {
      return iconCache.get(iconName);
    }
    
    const IconComponent = FaIcons[iconName] || FaIcons.FaBox;
    iconCache.set(iconName, IconComponent);
    return IconComponent;
  }, [iconCache]);

  // Fetch categories
  const { data: categoriesData, isLoading } = useQuery({
    queryKey: ['categoriesTree'],
    queryFn: getCategoryTree,
    staleTime: 1000 * 60 * 30,
  });

  const categories = useMemo(() => categoriesData?.data || [], [categoriesData]);

  const handleMouseLeave = useCallback(() => {
    setActiveCategory(null);
  }, []);

  const handleMouseEnter = useCallback((categoryId) => {
    setActiveCategory(categoryId);
  }, []);

  if (isLoading) {
    return (
      <nav style={styles.container}>
        <ul style={styles.menuList}>
          <li style={styles.menuItem}>
            <span style={styles.menuLink}>Yükleniyor...</span>
          </li>
        </ul>
      </nav>
    );
  }

  return (
    <nav style={styles.container} onMouseLeave={handleMouseLeave}>
      <ul style={styles.menuList}>
        {categories.map((category) => {
          const subcategories = category.active_children || [];
          const Icon = getIconComponent(category.icon);
          const isActive = activeCategory === category.id;
          
          return (
            <li 
              key={category.id} 
              style={styles.menuItem}
              onMouseEnter={() => handleMouseEnter(category.id)}
            >
              <Link 
                to={`/products?category=${category.slug}`}
                style={{
                  ...styles.menuLink,
                  ...(isActive ? styles.activeLink : {})
                }}
              >
                <Icon style={{ fontSize: '16px', color: isActive ? '#059669' : '#94a3b8' }} />
                {category.name}
              </Link>

              {/* Mega Menu Dropdown */}
              {subcategories.length > 0 && (
                <div style={{
                  ...styles.megaMenu,
                  ...(isActive ? styles.megaMenuActive : {})
                }}>
                  {subcategories.map((subCategory) => {
                    const subSubCategories = subCategory.active_children || [];
                    
                    return (
                      <div key={subCategory.id} style={styles.column}>
                        <Link 
                          to={`/products?category=${subCategory.slug}`}
                          style={styles.columnTitle}
                        >
                          {subCategory.name}
                        </Link>
                        {subSubCategories.length > 0 && (
                          <ul style={styles.subList}>
                            {subSubCategories.map((item) => (
                              <SubCategoryItem key={item.id} item={item} />
                            ))}
                          </ul>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

// Sub-component for sub-category items
const SubCategoryItem = React.memo(({ item }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <li>
      <Link 
        to={`/products?category=${item.slug}`}
        style={{
          ...styles.subItem,
          ...(isHovered ? styles.subItemHover : {})
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <FaChevronRight size={8} style={{ opacity: 0.5 }} />
        {item.name}
      </Link>
    </li>
  );
});

SubCategoryItem.displayName = 'SubCategoryItem';

export default React.memo(CategoryMenu);
