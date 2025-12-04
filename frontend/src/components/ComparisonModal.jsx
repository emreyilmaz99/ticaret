import React from 'react';
import { FaTimes, FaCheck, FaShoppingCart } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { useToast } from './Toast';

const ComparisonModal = ({ products, onClose }) => {
  const { addToCart } = useCart();
  const { showToast } = useToast();

  if (!products || products.length === 0) return null;

  const handleAddToCart = (product) => {
    addToCart(product);
    showToast(`${product.name} sepete eklendi!`, 'success');
  };

  const styles = {
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2000,
      backdropFilter: 'blur(4px)',
    },
    modal: {
      backgroundColor: 'white',
      width: '95%',
      maxWidth: '1200px',
      height: '90vh',
      borderRadius: '24px',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      position: 'relative',
    },
    header: {
      padding: '24px',
      borderBottom: '1px solid #e2e8f0',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    title: {
      fontSize: '24px',
      fontWeight: '700',
      color: '#1e293b',
    },
    closeBtn: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      color: '#64748b',
      padding: '8px',
    },
    content: {
      flex: 1,
      overflow: 'auto',
      padding: '24px',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      tableLayout: 'fixed',
    },
    th: {
      padding: '16px',
      textAlign: 'left',
      color: '#64748b',
      fontWeight: '600',
      borderBottom: '1px solid #e2e8f0',
      width: '200px',
      backgroundColor: '#f8fafc',
    },
    td: {
      padding: '16px',
      borderBottom: '1px solid #e2e8f0',
      verticalAlign: 'top',
    },
    productImg: {
      width: '120px',
      height: '120px',
      objectFit: 'contain',
      marginBottom: '12px',
    },
    productName: {
      fontWeight: '600',
      color: '#1e293b',
      marginBottom: '8px',
      height: '40px',
      overflow: 'hidden',
    },
    price: {
      fontSize: '18px',
      fontWeight: '700',
      color: '#059669',
      marginBottom: '12px',
    },
    addToCartBtn: {
      width: '100%',
      padding: '10px',
      backgroundColor: '#059669',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontWeight: '600',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
    },
    specRow: {
      backgroundColor: 'white',
    },
    specRowAlt: {
      backgroundColor: '#f8fafc',
    }
  };

  // Mock specifications for demo purposes
  // In a real app, these would come from product.attributes or product.specifications
  const specifications = [
    { label: 'Marka', key: 'brand', getValue: p => p.brand || 'Belirtilmemiş' },
    { label: 'Kategori', key: 'category', getValue: p => typeof p.category === 'object' ? p.category.name : p.category },
    { label: 'Puan', key: 'rating', getValue: p => `${p.rating || 0} / 5` },
    { label: 'Stok Durumu', key: 'stock', getValue: p => p.stock > 0 ? 'Stokta Var' : 'Tükendi' },
    { label: 'Garanti', key: 'warranty', getValue: p => '2 Yıl' }, // Mock
    { label: 'Kargo', key: 'shipping', getValue: p => 'Ücretsiz' }, // Mock
  ];

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={e => e.stopPropagation()}>
        <div style={styles.header}>
          <h2 style={styles.title}>Ürün Karşılaştırma</h2>
          <button style={styles.closeBtn} onClick={onClose}>
            <FaTimes size={24} />
          </button>
        </div>
        
        <div style={styles.content}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Özellikler</th>
                {products.map(product => (
                  <th key={product.id} style={{ ...styles.td, minWidth: '250px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                      <img src={product.image} alt={product.name} style={styles.productImg} />
                      <div style={styles.productName}>{product.name}</div>
                      <div style={styles.price}>
                        {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(product.price)}
                      </div>
                      <button 
                        style={styles.addToCartBtn}
                        onClick={() => handleAddToCart(product)}
                      >
                        <FaShoppingCart /> Sepete Ekle
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {specifications.map((spec, index) => (
                <tr key={spec.key} style={index % 2 === 0 ? styles.specRow : styles.specRowAlt}>
                  <td style={styles.th}>{spec.label}</td>
                  {products.map(product => (
                    <td key={product.id} style={{ ...styles.td, textAlign: 'center' }}>
                      {spec.getValue(product)}
                    </td>
                  ))}
                </tr>
              ))}
              {/* Description Row */}
              <tr>
                <td style={styles.th}>Açıklama</td>
                {products.map(product => (
                  <td key={product.id} style={{ ...styles.td, fontSize: '13px', color: '#64748b' }}>
                    {product.description ? product.description.substring(0, 150) + '...' : 'Açıklama yok'}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ComparisonModal;
