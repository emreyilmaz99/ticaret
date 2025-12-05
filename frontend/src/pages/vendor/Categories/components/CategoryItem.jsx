import React from 'react';
import { FaChevronRight, FaChevronDown } from 'react-icons/fa';
import { styles, getIconEmoji, toFullUrl } from '../styles';

/**
 * Recursive category item component
 * Handles expand/collapse and selection
 */
const CategoryItem = ({ 
  category, 
  level = 0, 
  expandedCategories, 
  selectedIds,
  onToggleExpand, 
  onToggleSelect 
}) => {
  const hasChildren = category.children?.length > 0;
  const isExpanded = expandedCategories.has(category.id);
  const isSelected = selectedIds.has(category.id);
  
  // Get icon - either emoji or image
  const iconEmoji = getIconEmoji(category.icon);
  const iconUrl = !iconEmoji && category.icon ? toFullUrl(category.icon) : null;

  return (
    <div style={styles.categoryWrapper}>
      <div 
        style={{
          ...styles.categoryItem,
          paddingLeft: `${level * 24 + 12}px`,
          backgroundColor: isSelected ? '#f0fdf4' : 'transparent'
        }}
      >
        {/* Expand/Collapse Button */}
        {hasChildren ? (
          <button
            onClick={() => onToggleExpand(category.id)}
            style={styles.expandButton}
          >
            {isExpanded ? (
              <FaChevronDown style={styles.chevronIcon} />
            ) : (
              <FaChevronRight style={styles.chevronIcon} />
            )}
          </button>
        ) : (
          <div style={styles.expandPlaceholder} />
        )}

        {/* Checkbox */}
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onToggleSelect(category.id)}
          style={styles.checkbox}
        />

        {/* Icon */}
        <div style={styles.categoryIcon}>
          {iconEmoji ? (
            <span style={styles.iconEmoji}>{iconEmoji}</span>
          ) : iconUrl ? (
            <img 
              src={iconUrl} 
              alt="" 
              style={styles.iconImage}
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          ) : (
            <span style={styles.iconEmoji}>📁</span>
          )}
        </div>

        {/* Name */}
        <span style={styles.categoryName}>{category.name}</span>

        {/* Children count badge */}
        {hasChildren && (
          <span style={styles.childCount}>
            {category.children.length}
          </span>
        )}
      </div>

      {/* Children */}
      {hasChildren && isExpanded && (
        <div style={styles.childrenContainer}>
          {category.children.map(child => (
            <CategoryItem
              key={child.id}
              category={child}
              level={level + 1}
              expandedCategories={expandedCategories}
              selectedIds={selectedIds}
              onToggleExpand={onToggleExpand}
              onToggleSelect={onToggleSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryItem;
