// src/pages/public/Home/components/CategoryCircles.jsx
import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Popular categories circular display
 */
const CategoryCircles = ({ categories, selectedCategory, setSelectedCategory, styles }) => {
  const displayCategories = categories.filter(c => c.id !== 'all').slice(0, 5);

  return (
    <div style={styles.popularCategories}>
      {displayCategories.map(cat => (
        <Link 
          to={`/?category=${cat.id}`} 
          key={cat.id} 
          style={styles.categoryCircle} 
          onClick={() => setSelectedCategory(cat.id)}
        >
          <div style={{ 
            ...styles.catImg, 
            backgroundColor: '#e2e8f0', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            fontSize: '32px',
            backgroundImage: cat.image ? `url(${cat.image})` : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}>
            {!cat.image && (cat.icon || '📦')}
          </div>
          <span>{cat.name}</span>
        </Link>
      ))}
    </div>
  );
};

export default CategoryCircles;
