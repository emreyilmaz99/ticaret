// src/pages/public/ProductDetail/components/ProductTabs.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FaTag } from 'react-icons/fa';
import ReviewsSection from './ReviewsSection';

/**
 * Product tabs for description, specs, and reviews
 */
const ProductTabs = ({ 
  product, 
  selectedVariant, 
  activeTab, 
  setActiveTab, 
  styles 
}) => {
  return (
    <div style={styles.tabsSection}>
      <div style={styles.tabs}>
        <button 
          style={styles.tab(activeTab === 'description')}
          onClick={() => setActiveTab('description')}
        >
          Açıklama
        </button>
        {Object.keys(product.specifications || {}).length > 0 && (
          <button 
            style={styles.tab(activeTab === 'specs')}
            onClick={() => setActiveTab('specs')}
          >
            Özellikler
          </button>
        )}
        <button 
          style={styles.tab(activeTab === 'reviews')}
          onClick={() => setActiveTab('reviews')}
        >
          Değerlendirmeler ({product.review_count || product.reviews_count || 0})
        </button>
      </div>

      <div style={styles.tabContent}>
        {/* Description Tab */}
        {activeTab === 'description' && (
          <div>
            {product.description ? (
              <div dangerouslySetInnerHTML={{ __html: product.description.replace(/\n/g, '<br/>') }} />
            ) : (
              <p>Bu ürün için detaylı açıklama henüz eklenmemiş.</p>
            )}
            
            {/* Tags */}
            {product.tags?.length > 0 && (
              <div style={styles.tagsSection}>
                <FaTag style={{ color: '#64748b' }} />
                {product.tags.map((tag) => (
                  <Link 
                    key={tag.id} 
                    to={`/products?tag=${tag.slug}`}
                    style={styles.tag}
                  >
                    {tag.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Specifications Tab */}
        {activeTab === 'specs' && (
          <div style={styles.specsGrid}>
            {Object.entries(product.specifications || {}).map(([key, value]) => (
              <div key={key} style={styles.specItem}>
                <span style={styles.specLabel}>{key}</span>
                <span style={styles.specValue}>{value}</span>
              </div>
            ))}
            {selectedVariant?.weight && (
              <div style={styles.specItem}>
                <span style={styles.specLabel}>Ağırlık</span>
                <span style={styles.specValue}>{selectedVariant.weight}g</span>
              </div>
            )}
            {selectedVariant?.dimensions && (
              <div style={styles.specItem}>
                <span style={styles.specLabel}>Boyutlar</span>
                <span style={styles.specValue}>
                  {selectedVariant.dimensions.length} x {selectedVariant.dimensions.width} x {selectedVariant.dimensions.height} cm
                </span>
              </div>
            )}
          </div>
        )}

        {/* Reviews Tab */}
        {activeTab === 'reviews' && (
          <ReviewsSection 
            productId={product.id} 
            productName={product.name}
            styles={styles}
          />
        )}
      </div>
    </div>
  );
};

export default ProductTabs;
