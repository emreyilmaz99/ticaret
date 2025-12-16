// src/components/modals/QuickViewModal/components/ProductInfo.jsx
import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import SpecificationRow from './SpecificationRow';
import { specificationIcons } from '../config';
import { styles } from '../styles';

const ProductInfo = React.memo(({ product }) => {
  const discountPercent = useMemo(() => {
    if (!product?.original_price || product.original_price <= product.price) {
      return null;
    }
    return Math.round(((product.original_price - product.price) / product.original_price) * 100);
  }, [product]);

  return (
    <>
      <div>
        <h2 style={styles.title}>{product?.name}</h2>
        <div style={styles.priceSection}>
          <span style={styles.price}>
            {product?.price?.toLocaleString('tr-TR', {
              style: 'currency',
              currency: 'TRY',
            })}
          </span>
          {product?.original_price && product.original_price > product.price && (
            <>
              <span style={styles.oldPrice}>
                {product.original_price.toLocaleString('tr-TR', {
                  style: 'currency',
                  currency: 'TRY',
                })}
              </span>
              {discountPercent && (
                <span style={styles.discount}>%{discountPercent} İndirim</span>
              )}
            </>
          )}
        </div>
      </div>

      {product?.description && (
        <p style={styles.description}>{product.description}</p>
      )}

      <div style={styles.specs}>
        <SpecificationRow
          icon={specificationIcons.brand}
          label="Marka"
          value={product?.brand}
        />
        <SpecificationRow
          icon={specificationIcons.category}
          label="Kategori"
          value={product?.category}
        />
        <SpecificationRow
          icon={specificationIcons.stock}
          label="Stok"
          value={product?.stock > 0 ? `${product.stock} adet` : 'Stokta yok'}
        />
        <SpecificationRow
          icon={specificationIcons.rating}
          label="Puan"
          value={product?.rating ? `${product.rating}/5` : null}
        />
        <SpecificationRow
          icon={specificationIcons.reviews}
          label="Değerlendirme"
          value={product?.reviews_count ? `${product.reviews_count} yorum` : null}
        />
        <SpecificationRow
          icon={specificationIcons.sku}
          label="Ürün Kodu"
          value={product?.sku}
        />
      </div>
    </>
  );
});

ProductInfo.displayName = 'ProductInfo';

ProductInfo.propTypes = {
  product: PropTypes.shape({
    name: PropTypes.string,
    price: PropTypes.number,
    original_price: PropTypes.number,
    description: PropTypes.string,
    brand: PropTypes.string,
    category: PropTypes.string,
    stock: PropTypes.number,
    rating: PropTypes.number,
    reviews_count: PropTypes.number,
    sku: PropTypes.string,
  }).isRequired,
};

export default ProductInfo;
