import React from 'react';
import { 
  FaTimes, FaMapMarkerAlt, FaPhone, FaEnvelope, 
  FaCheck, FaTruck, FaBoxOpen, FaTimesCircle, FaFileInvoice 
} from 'react-icons/fa';

// YENİ IMPORT YOLU: (Aynı klasörden alıyor)
import { printInvoice } from './invoiceService'; 

const OrderDetailModal = ({ 
  order, 
  isOpen, 
  onClose, 
  onStatusUpdate, 
  onCancel, 
  styles 
}) => {
  
  if (!isOpen || !order) return null;

  // Durum Metinleri
  const getStatusText = (status) => {
    const map = {
      pending: 'Onay Bekliyor',
      processing: 'Hazırlanıyor',
      shipped: 'Kargoya Verildi',
      delivered: 'Teslim Edildi',
      cancelled: 'İptal Edildi'
    };
    return map[status] || status;
  };

  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        
        {/* --- BAŞLIK --- */}
        <div style={styles.modalHeader}>
          <div style={{display:'flex', alignItems:'center'}}>
            <div>
              <h2 style={styles.modalTitle}>Sipariş Detayı</h2>
              <span style={{fontSize: '13px', color: '#64748B'}}>{order.id} • {order.date}</span>
            </div>
            <span style={styles.modalStatusBadge(order.status)}>
              {getStatusText(order.status)}
            </span>
          </div>

          <button style={styles.closeBtn} onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        {/* --- İÇERİK --- */}
        <div style={styles.modalBody}>
          
          <div style={styles.infoGrid}>
            {/* Müşteri */}
            <div style={styles.infoCard}>
              <h4 style={styles.infoTitle}>Müşteri Bilgileri</h4>
              <div style={{display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px'}}>
                <img src={order.customer.avatar} alt="" style={{width: '48px', height: '48px', borderRadius: '50%'}} />
                <div>
                  <div style={{fontWeight: '700', color: '#111827'}}>{order.customer.name}</div>
                  <div style={{fontSize: '12px', color: '#6B7280'}}>Kayıtlı Müşteri</div>
                </div>
              </div>
              <div style={{display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', color: '#4B5563'}}>
                <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                  <FaEnvelope color="#9CA3AF" /> {order.customer.email}
                </div>
                <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                  <FaPhone color="#9CA3AF" /> {order.customer.phone || '-'}
                </div>
              </div>
            </div>

            {/* Adres */}
            <div style={styles.infoCard}>
              <h4 style={styles.infoTitle}>Teslimat Adresi</h4>
              <div style={{display: 'flex', gap: '10px', fontSize: '14px', color: '#374151', lineHeight: '1.6'}}>
                <FaMapMarkerAlt color="#059669" size={16} style={{marginTop: '4px', flexShrink: 0}} />
                <div>{order.shippingAddress || 'Adres bilgisi yok.'}</div>
              </div>
              <div style={{marginTop: '20px', paddingTop: '16px', borderTop: '1px dashed #E5E7EB'}}>
                <h4 style={styles.infoTitle}>Ödeme Yöntemi</h4>
                <div style={{fontSize: '14px', fontWeight: '600', color: '#111827'}}>
                  {order.paymentMethod}
                </div>
              </div>
            </div>
          </div>

          {/* Kupon Bilgisi */}
          {order.coupon_discount > 0 && (
            <div style={{
              marginTop: '24px',
              padding: '16px',
              backgroundColor: '#FEF3C7',
              border: '1px solid #FDE68A',
              borderRadius: '8px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <div style={{ fontSize: '14px', fontWeight: '600', color: '#92400E', marginBottom: '4px' }}>
                  🎟️ Kupon Uygulandı
                </div>
                <div style={{ fontSize: '13px', color: '#78350F' }}>
                  Kod: <strong>{order.coupon_code}</strong>
                  {order.coupon && order.coupon.min_order_amount > 0 && (
                    <span style={{ marginLeft: '12px', fontSize: '12px' }}>
                      (Min. Sipariş: ₺{order.coupon.min_order_amount})
                    </span>
                  )}
                </div>
              </div>
              <div style={{ fontSize: '18px', fontWeight: '700', color: '#059669' }}>
                -₺{parseFloat(order.coupon_discount).toFixed(2)}
              </div>
            </div>
          )}

          {/* Ürünler */}
          <h4 style={styles.infoTitle}>Ürünler ({order.products?.length || 0})</h4>
          <div style={styles.productList}>
            {order.products && order.products.map((product) => (
              <div key={product.id}>
                <div style={styles.productItem}>
                  <img 
                    src={product.image?.startsWith('http') ? product.image : `http://127.0.0.1:8000${product.image}`} 
                    alt={product.name} 
                    style={{
                      ...styles.productImg, 
                      cursor: product.slug ? 'pointer' : 'default'
                    }}
                    onClick={() => {
                      if (product.slug) {
                        window.open(`http://localhost:5173/product/${product.slug}`, '_blank');
                      }
                    }}
                  />
                  <div style={styles.productDetails}>
                    <span 
                      style={{
                        ...styles.productName, 
                        cursor: product.slug ? 'pointer' : 'default',
                        textDecoration: product.slug ? 'underline' : 'none'
                      }}
                      onClick={() => {
                        if (product.slug) {
                          window.open(`http://localhost:5173/product/${product.slug}`, '_blank');
                        }
                      }}
                    >
                      {product.name}
                    </span>
                    {product.variant && product.variant !== 'Default' && (
                      <span style={styles.productVariant}>{product.variant}</span>
                    )}
                  </div>
                  <div style={{textAlign: 'right'}}>
                    <div style={{fontSize: '13px', color: '#6B7280'}}>{product.qty} x {product.price} TL</div>
                    <div style={styles.productPrice}>
                      {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(product.price * product.qty)}
                    </div>
                  </div>
                </div>
                
                {/* Finansal Detaylar */}
                {product.financials && (
                  <div style={{
                    marginTop: '12px',
                    marginLeft: '72px',
                    padding: '16px',
                    backgroundColor: '#F9FAFB',
                    borderRadius: '8px',
                    fontSize: '13px'
                  }}>
                    <div style={{fontWeight: '600', color: '#111827', marginBottom: '12px'}}>💰 Fatura Detayları</div>
                    
                    <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
                      <div style={{display: 'flex', justifyContent: 'space-between', color: '#4B5563'}}>
                        <span>Ürün Fiyatı (KDV Hariç):</span>
                        <span style={{fontWeight: '500'}}>₺{product.financials.price_without_tax}</span>
                      </div>
                      <div style={{display: 'flex', justifyContent: 'space-between', color: '#059669'}}>
                        <span>KDV (%{product.financials.tax_rate}):</span>
                        <span style={{fontWeight: '500'}}>+₺{product.financials.tax_amount}</span>
                      </div>
                      <div style={{
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        paddingTop: '8px',
                        borderTop: '1px dashed #E5E7EB',
                        fontWeight: '600',
                        color: '#111827'
                      }}>
                        <span>Müşteri Ödemesi:</span>
                        <span>₺{product.financials.price_with_tax}</span>
                      </div>
                      
                      <div style={{height: '8px'}}></div>
                      
                      <div style={{display: 'flex', justifyContent: 'space-between', color: '#DC2626'}}>
                        <span>Platform Komisyonu (%{product.financials.commission_rate}):</span>
                        <span style={{fontWeight: '500'}}>-₺{product.financials.commission_amount}</span>
                      </div>
                      <div style={{
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        paddingTop: '8px',
                        borderTop: '1px dashed #E5E7EB',
                        fontWeight: '700',
                        fontSize: '14px',
                        color: '#059669'
                      }}>
                        <span>🏢 Satıcı Hak Ediş:</span>
                        <span>₺{product.financials.vendor_earning}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Toplam */}
          <div style={styles.totalSection}>
            <div>
              <div style={styles.totalRow}>
                <span>Ara Toplam</span>
                <span>{new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(order.subtotal || order.amount)}</span>
              </div>
              
              {order.coupon_discount > 0 && (
                <div style={{...styles.totalRow, color: '#059669'}}>
                  <span>İndirim ({order.coupon_code || 'Kupon'})</span>
                  <span>-{new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(order.coupon_discount)}</span>
                </div>
              )}
              
              <div style={styles.totalRow}>
                <span>Kargo</span>
                <span>0,00 ₺</span>
              </div>
              
              <div style={styles.grandTotal}>
                <span>Genel Toplam</span>
                <span>{new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(order.amount)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* --- FOOTER (Aksiyonlar) --- */}
        <div style={styles.modalFooter}>
          <div style={{display:'flex', gap:'12px'}}>
            
            {/* FATURA BUTONU */}
            <button 
              style={styles.btnInvoice}
              onClick={() => printInvoice(order)} 
              title="Faturayı Görüntüle ve Yazdır"
            >
              <FaFileInvoice size={14} /> Fatura Görüntüle
            </button>

            {(order.status === 'pending' || order.status === 'processing') && (
              <button 
                style={{...styles.modalBtn, ...styles.btnCancel, backgroundColor: '#FEF2F2', border: '1px solid #FECACA', fontSize:'13px', padding:'10px 16px'}}
                onClick={() => { onCancel(order.order_id); onClose(); }}
              >
                <FaTimesCircle /> İptal Et
              </button>
            )}
          </div>

          <div style={{display:'flex', gap:'12px'}}>
            {order.status === 'pending' && (
              <button style={{...styles.modalBtn, ...styles.btnApprove}} onClick={() => onStatusUpdate(order.order_id, 'processing')}>
                <FaCheck /> Onayla
              </button>
            )}
            {order.status === 'processing' && (
              <button style={{...styles.modalBtn, ...styles.btnShip}} onClick={() => onStatusUpdate(order.order_id, 'shipped')}>
                <FaTruck /> Kargoya Ver
              </button>
            )}
            {order.status === 'shipped' && (
              <button style={{...styles.modalBtn, ...styles.btnApprove}} onClick={() => onStatusUpdate(order.order_id, 'delivered')}>
                <FaBoxOpen /> Teslim Et
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default OrderDetailModal;