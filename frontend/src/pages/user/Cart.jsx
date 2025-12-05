import React, { useState, useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import { Link } from 'react-router-dom';
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag, FiArrowRight, FiTag, FiX, FiLoader, FiTruck, FiGift } from 'react-icons/fi';

const Cart = () => {
  const { 
    cartItems, 
    removeFromCart, 
    updateQuantity, 
    clearCart, 
    applyCoupon, 
    removeCoupon, 
    coupon, 
    totals,
    loading,
    initialized,
    clearNewItemsBadge
  } = useCart();

  const [couponInput, setCouponInput] = useState('');
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Sayfa açıldığında bildirimi temizle
  useEffect(() => {
    clearNewItemsBadge();
  }, []);

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    applyCoupon(couponInput);
    setCouponInput('');
  };

  const styles = {
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: isMobile ? '20px 12px' : '40px 20px',
      fontFamily: '"Inter", sans-serif',
      minHeight: '80vh',
    },
    emptyState: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '60vh',
      textAlign: 'center',
      padding: isMobile ? '20px' : '0',
    },
    emptyIconBg: {
      backgroundColor: '#f8fafc',
      padding: isMobile ? '24px' : '32px',
      borderRadius: '50%',
      marginBottom: '24px',
    },
    emptyTitle: {
      fontSize: isMobile ? '20px' : '24px',
      fontWeight: '700',
      color: '#1e293b',
      marginBottom: '8px',
    },
    emptyText: {
      color: '#64748b',
      marginBottom: '32px',
      maxWidth: '400px',
      lineHeight: '1.5',
      fontSize: isMobile ? '14px' : '16px',
    },
    startShoppingBtn: {
      backgroundColor: '#059669',
      color: 'white',
      padding: isMobile ? '10px 24px' : '12px 32px',
      borderRadius: '12px',
      fontWeight: '600',
      textDecoration: 'none',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      boxShadow: '0 4px 12px rgba(5, 150, 105, 0.2)',
      transition: 'transform 0.2s',
      fontSize: isMobile ? '14px' : '16px',
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      marginBottom: isMobile ? '20px' : '32px',
    },
    headerTitle: {
      fontSize: isMobile ? '24px' : '32px',
      fontWeight: '800',
      color: '#1e293b',
      margin: 0,
    },
    headerCount: {
      fontSize: isMobile ? '14px' : '18px',
      fontWeight: '500',
      color: '#64748b',
    },
    layout: {
      display: 'flex',
      flexDirection: isMobile ? 'column' : 'row',
      gap: isMobile ? '24px' : '32px',
    },
    productList: {
      flex: '1',
      minWidth: 0,
    },
    summary: {
      width: isMobile ? '100%' : '380px',
      flexShrink: 0,
    },
    card: {
      backgroundColor: 'white',
      borderRadius: isMobile ? '16px' : '24px',
      border: '1px solid #e2e8f0',
      overflow: 'hidden',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
    },
    tableHeader: {
      display: isMobile ? 'none' : 'grid',
      gridTemplateColumns: '2fr 1fr 1fr 1fr',
      padding: '16px 24px',
      backgroundColor: '#f8fafc',
      borderBottom: '1px solid #e2e8f0',
      fontSize: '14px',
      fontWeight: '600',
      color: '#64748b',
    },
    cartItem: {
      padding: isMobile ? '16px' : '24px',
      borderBottom: '1px solid #f1f5f9',
      display: isMobile ? 'flex' : 'grid',
      flexDirection: isMobile ? 'column' : 'row',
      gridTemplateColumns: '2fr 1fr 1fr 1fr',
      alignItems: isMobile ? 'flex-start' : 'center',
      gap: '16px',
    },
    productInfo: {
      display: 'flex',
      gap: isMobile ? '12px' : '16px',
    },
    productImage: {
      width: isMobile ? '70px' : '80px',
      height: isMobile ? '70px' : '80px',
      borderRadius: '12px',
      objectFit: 'cover',
      border: '1px solid #e2e8f0',
    },
    productDetails: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
    },
    productName: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#1e293b',
      marginBottom: '4px',
    },
    variantText: {
      fontSize: '13px',
      color: '#64748b',
    },
    removeBtn: {
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
      color: '#ef4444',
      fontSize: '13px',
      fontWeight: '500',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      marginTop: '8px',
      padding: 0,
    },
    quantityControl: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      backgroundColor: '#f8fafc',
      padding: '4px',
      borderRadius: '8px',
      width: 'fit-content',
    },
    qtyBtn: {
      width: '28px',
      height: '28px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'white',
      border: '1px solid #e2e8f0',
      borderRadius: '6px',
      cursor: 'pointer',
      color: '#475569',
    },
    qtyText: {
      fontSize: '14px',
      fontWeight: '600',
      color: '#1e293b',
      minWidth: '20px',
      textAlign: 'center',
    },
    priceText: {
      fontSize: '16px',
      color: '#475569',
      fontWeight: '500',
    },
    totalText: {
      fontSize: '18px',
      fontWeight: '700',
      color: '#059669',
      textAlign: 'right',
    },
    footer: {
      padding: '20px 24px',
      backgroundColor: '#f8fafc',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    continueLink: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      color: '#475569',
      textDecoration: 'none',
      fontWeight: '500',
      fontSize: '14px',
    },
    clearBtn: {
      color: '#ef4444',
      background: 'none',
      border: 'none',
      fontWeight: '500',
      fontSize: '14px',
      cursor: 'pointer',
    },
    summaryCard: {
      backgroundColor: 'white',
      borderRadius: '24px',
      border: '1px solid #e2e8f0',
      padding: '24px',
      position: 'sticky',
      top: '100px',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)',
    },
    summaryTitle: {
      fontSize: '20px',
      fontWeight: '700',
      color: '#1e293b',
      marginBottom: '24px',
    },
    couponSection: {
      marginBottom: '24px',
    },
    couponLabel: {
      display: 'block',
      fontSize: '14px',
      fontWeight: '500',
      color: '#475569',
      marginBottom: '8px',
    },
    couponForm: {
      display: 'flex',
      gap: '8px',
    },
    couponInput: {
      flex: 1,
      padding: '10px 16px',
      borderRadius: '12px',
      border: '1px solid #e2e8f0',
      fontSize: '14px',
      outline: 'none',
    },
    couponBtn: {
      backgroundColor: '#1e293b',
      color: 'white',
      border: 'none',
      borderRadius: '12px',
      padding: '0 16px',
      fontWeight: '600',
      fontSize: '14px',
      cursor: 'pointer',
    },
    activeCoupon: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: '#f0fdf4',
      border: '1px solid #bbf7d0',
      padding: '12px',
      borderRadius: '12px',
      color: '#15803d',
    },
    row: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '12px',
      color: '#64748b',
      fontSize: '15px',
    },
    totalRow: {
      display: 'flex',
      justifyContent: 'space-between',
      marginTop: '24px',
      paddingTop: '24px',
      borderTop: '1px solid #e2e8f0',
      fontSize: '20px',
      fontWeight: '800',
      color: '#1e293b',
    },
    checkoutBtn: {
      width: '100%',
      backgroundColor: '#059669',
      color: 'white',
      border: 'none',
      padding: '16px',
      borderRadius: '16px',
      fontSize: '16px',
      fontWeight: '700',
      cursor: 'pointer',
      marginTop: '24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      boxShadow: '0 4px 12px rgba(5, 150, 105, 0.3)',
      transition: 'background-color 0.2s',
    },
  };

  // Yüklenirken göster
  if (!initialized) {
    return (
      <div style={styles.container}>
        <div style={styles.emptyState}>
          <FiLoader size={48} color="#059669" style={{ animation: 'spin 1s linear infinite' }} />
          <p style={{ marginTop: '16px', color: '#64748b' }}>Sepet yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div style={styles.container}>
        <div style={styles.emptyState}>
          <div style={styles.emptyIconBg}>
            <FiShoppingBag size={64} color="#cbd5e1" />
          </div>
          <h2 style={styles.emptyTitle}>Sepetiniz Henüz Boş</h2>
          <p style={styles.emptyText}>
            Aradığınız ürünleri bulmak için hemen alışverişe başlayın. 
            Binlerce ürün sizi bekliyor!
          </p>
          <Link to="/" style={styles.startShoppingBtn}>
            Alışverişe Başla <FiArrowRight />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.headerTitle}>Sepetim</h1>
        <span style={styles.headerCount}>({cartItems.length} Ürün)</span>
      </div>

      <div style={styles.layout}>
        {/* SOL TARAF: ÜRÜN LİSTESİ */}
        <div style={styles.productList}>
          <div style={styles.card}>
            {/* Başlık Satırı */}
            <div style={{...styles.tableHeader, display: window.innerWidth < 768 ? 'none' : 'grid'}}>
              <div>Ürün</div>
              <div style={{textAlign: 'center'}}>Birim Fiyat</div>
              <div style={{textAlign: 'center'}}>Adet</div>
              <div style={{textAlign: 'right'}}>Toplam</div>
            </div>

            {/* Ürünler */}
            <div>
              {cartItems.map((item) => (
                <div key={item.id} style={{
                  ...styles.cartItem,
                  gridTemplateColumns: window.innerWidth < 768 ? '1fr' : '2fr 1fr 1fr 1fr',
                  gap: window.innerWidth < 768 ? '16px' : '16px'
                }}>
                  
                  {/* Ürün Bilgisi */}
                  <div style={styles.productInfo}>
                    {item.product?.image ? (
                      <img 
                        src={item.product.image} 
                        alt={item.product?.name} 
                        style={styles.productImage}
                      />
                    ) : (
                      <div style={{...styles.productImage, backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                        <FiShoppingBag size={24} color="#cbd5e1" />
                      </div>
                    )}
                    <div style={styles.productDetails}>
                      <Link to={`/product/${item.product?.slug}`} style={{...styles.productName, textDecoration: 'none'}}>
                        {item.product?.name}
                      </Link>
                      {item.variant && (
                        <p style={styles.variantText}>
                          {item.variant.title || item.variant.sku}
                        </p>
                      )}
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        style={styles.removeBtn}
                        disabled={loading}
                      >
                        <FiTrash2 /> Sil
                      </button>
                    </div>
                  </div>

                  {/* Mobil Fiyat ve Adet Kontrolü */}
                  {window.innerWidth < 768 && (
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%'}}>
                      <span style={{fontWeight: '700', color: '#059669'}}>{item.unit_price?.toLocaleString('tr-TR')} TL</span>
                      <div style={styles.quantityControl}>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          style={{...styles.qtyBtn, opacity: item.quantity <= 1 || loading ? 0.5 : 1}}
                          disabled={item.quantity <= 1 || loading}
                        >
                          <FiMinus size={12} />
                        </button>
                        <span style={styles.qtyText}>{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          style={{...styles.qtyBtn, opacity: loading ? 0.5 : 1}}
                          disabled={loading}
                        >
                          <FiPlus size={12} />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Desktop Kolonlar */}
                  <div style={{textAlign: 'center', display: window.innerWidth < 768 ? 'none' : 'block', ...styles.priceText}}>
                    {item.unit_price?.toLocaleString('tr-TR')} TL
                  </div>

                  <div style={{display: window.innerWidth < 768 ? 'none' : 'flex', justifyContent: 'center'}}>
                    <div style={styles.quantityControl}>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        style={{...styles.qtyBtn, opacity: item.quantity <= 1 || loading ? 0.5 : 1}}
                        disabled={item.quantity <= 1 || loading}
                      >
                        <FiMinus size={12} />
                      </button>
                      <span style={styles.qtyText}>{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        style={{...styles.qtyBtn, opacity: loading ? 0.5 : 1}}
                        disabled={loading}
                      >
                        <FiPlus size={12} />
                      </button>
                    </div>
                  </div>

                  <div style={{...styles.totalText, display: window.innerWidth < 768 ? 'none' : 'block'}}>
                    {item.line_total?.toLocaleString('tr-TR')} TL
                  </div>

                </div>
              ))}
            </div>
            
            {/* Alt Aksiyonlar */}
            <div style={styles.footer}>
              <Link to="/" style={styles.continueLink}>
                <FiArrowRight style={{transform: 'rotate(180deg)'}} /> Alışverişe Devam Et
              </Link>
              <button 
                onClick={clearCart}
                style={styles.clearBtn}
              >
                Sepeti Temizle
              </button>
            </div>
          </div>
        </div>

        {/* SAĞ TARAF: ÖZET VE ÖDEME */}
        <div style={styles.summary}>
          <div style={styles.summaryCard}>
            <h2 style={styles.summaryTitle}>Sipariş Özeti</h2>

            {/* Kupon Alanı */}
            <div style={styles.couponSection}>
              <label style={styles.couponLabel}>İndirim Kuponu</label>
              {coupon ? (
                <div style={styles.activeCoupon}>
                  <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                    <FiTag />
                    <span style={{fontWeight: '600'}}>{coupon.code}</span>
                  </div>
                  <button onClick={removeCoupon} style={{background: 'none', border: 'none', color: 'inherit', cursor: 'pointer'}}>
                    <FiX />
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} style={styles.couponForm}>
                  <input 
                    type="text" 
                    placeholder="Kupon Kodu" 
                    style={styles.couponInput}
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                  />
                  <button type="submit" style={styles.couponBtn}>
                    Uygula
                  </button>
                </form>
              )}
              <p style={{fontSize: '12px', color: '#94a3b8', marginTop: '8px'}}>Örnek: YAZ20, HOSGELDIN</p>
            </div>

            {/* Hesaplamalar */}
            <div style={{borderTop: '1px solid #f1f5f9', paddingTop: '24px'}}>
              <div style={styles.row}>
                <span>Ara Toplam</span>
                <span>{(totals?.subtotal || 0).toLocaleString('tr-TR')} TL</span>
              </div>
              
              {(totals?.discount || 0) > 0 && (
                <div style={{...styles.row, color: '#16a34a'}}>
                  <span>İndirim ({coupon?.code})</span>
                  <span>-{(totals?.discount || 0).toLocaleString('tr-TR')} TL</span>
                </div>
              )}

              {/* Satıcı Bazlı Kargo Bilgisi */}
              {totals?.shipping_breakdown && totals.shipping_breakdown.length > 0 ? (
                <div style={{marginBottom: '16px'}}>
                  <div style={{...styles.row, marginBottom: '8px', fontWeight: '600', color: '#475569'}}>
                    <span style={{display: 'flex', alignItems: 'center', gap: '6px'}}>
                      <FiTruck size={14} /> Kargo Ücretleri
                    </span>
                  </div>
                  {totals.shipping_breakdown.map((vendor, idx) => (
                    <div key={idx} style={{
                      padding: '10px 12px',
                      backgroundColor: vendor.is_free ? '#f0fdf4' : '#f8fafc',
                      borderRadius: '8px',
                      marginBottom: '8px',
                      border: vendor.is_free ? '1px solid #bbf7d0' : '1px solid #e2e8f0'
                    }}>
                      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                        <span style={{fontSize: '13px', color: '#475569', fontWeight: '500'}}>
                          {vendor.vendor_name}
                        </span>
                        {vendor.is_free ? (
                          <span style={{
                            color: '#16a34a', 
                            fontWeight: '600', 
                            fontSize: '13px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}>
                            <FiGift size={12} /> Ücretsiz
                          </span>
                        ) : (
                          <span style={{fontWeight: '600', fontSize: '13px', color: '#1e293b'}}>
                            {vendor.shipping_cost.toLocaleString('tr-TR')} TL
                          </span>
                        )}
                      </div>
                      {!vendor.is_free && vendor.remaining_for_free && (
                        <p style={{
                          fontSize: '11px', 
                          color: '#64748b', 
                          marginTop: '4px',
                          margin: '4px 0 0 0'
                        }}>
                          💡 {vendor.remaining_for_free.toLocaleString('tr-TR')} TL daha alışveriş yapın, kargo bedava!
                        </p>
                      )}
                    </div>
                  ))}
                  <div style={{...styles.row, marginTop: '12px', paddingTop: '8px', borderTop: '1px dashed #e2e8f0'}}>
                    <span style={{fontWeight: '500'}}>Toplam Kargo</span>
                    {(totals?.shipping || 0) === 0 ? (
                      <span style={{color: '#16a34a', fontWeight: '600'}}>Bedava</span>
                    ) : (
                      <span style={{fontWeight: '600'}}>{(totals?.shipping || 0).toLocaleString('tr-TR')} TL</span>
                    )}
                  </div>
                </div>
              ) : (
                <div style={styles.row}>
                  <span>Kargo</span>
                  {(totals?.shipping || 0) === 0 ? (
                    <span style={{color: '#16a34a', fontWeight: '600'}}>Bedava</span>
                  ) : (
                    <span>{(totals?.shipping || 0).toLocaleString('tr-TR')} TL</span>
                  )}
                </div>
              )}
            </div>

            {/* Toplam */}
            <div style={styles.totalRow}>
              <span>Genel Toplam</span>
              <span style={{color: '#059669'}}>{(totals?.total || 0).toLocaleString('tr-TR')} TL</span>
            </div>

            {/* Buton */}
            <button style={styles.checkoutBtn}>
              Sepeti Onayla <FiArrowRight />
            </button>

            <div style={{marginTop: '24px', display: 'flex', justifyContent: 'center', gap: '12px', opacity: 0.5}}>
               <div style={{height: '24px', width: '40px', backgroundColor: '#e2e8f0', borderRadius: '4px'}}></div>
               <div style={{height: '24px', width: '40px', backgroundColor: '#e2e8f0', borderRadius: '4px'}}></div>
               <div style={{height: '24px', width: '40px', backgroundColor: '#e2e8f0', borderRadius: '4px'}}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
