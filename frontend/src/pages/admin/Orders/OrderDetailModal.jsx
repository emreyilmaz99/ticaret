// src/pages/admin/Orders/OrderDetailModal.jsx
import React, { useState } from 'react';
import { 
  FaTimes, FaStore, FaUser, FaMapMarkerAlt, FaFileInvoice, 
  FaBan, FaCheckCircle, FaHistory, FaStickyNote 
} from 'react-icons/fa';

// YENİ SERVİSİ IMPORT EDİYORUZ (Aynı klasörde invoiceService.js olmalı)
import { printInvoice } from './invoiceService';

const OrderDetailModal = ({ order, isOpen, onClose, styles }) => {
  if (!isOpen || !order) return null;

  // --- STATE YÖNETİMİ ---
  const [activeTab, setActiveTab] = useState('details'); // 'details' | 'history'
  const [adminNote, setAdminNote] = useState('');

  // --- İŞLEVLER ---

  // 1. Zorla İptal Et (Admin Yetkisi)
  const handleForceCancel = () => {
    const reason = prompt("Lütfen iptal sebebini girin (Satıcıya iletilecek):");
    if (reason) {
      // API İptal İsteği Simülasyonu
      alert(`Sipariş #${order.id} başarıyla iptal edildi.\nSebep: ${reason}`);
      onClose();
    }
  };

  // 2. Fatura/Ekstre Yazdır
  const handlePrintInvoice = () => {
    // invoiceService.js dosyasındaki fonksiyonu çağırır
    printInvoice(order);
  };

  // 3. Not Kaydet
  const handleSaveNote = () => {
    if(!adminNote.trim()) return;
    alert(`Not sisteme kaydedildi: "${adminNote}"`);
    setAdminNote('');
  };

  // Güvenlik Kontrolü: Eğer styles.modalStatusBadge bir fonksiyon değilse hata vermesin
  const renderStatusBadge = () => {
  
    const statusTranslations = {
      'pending': 'Beklemede',
      'processing': 'İşleniyor',
      'completed': 'Tamamlandı',
      'cancelled': 'İptal Edildi',
      'shipped': 'Kargolandı',
      'refunded': 'İade Edildi',
      'failed': 'Başarısız'
    };

    // Gelen veriyi (örn: "Pending") küçük harfe çevirip eşleştiriyoruz.
    // Eğer listede yoksa orjinal halini (order.status) gösterir.
    const displayStatus = statusTranslations[order.status?.toLowerCase()] || order.status;

    if (typeof styles.modalStatusBadge === 'function') {
      // DİKKAT: Stil fonksiyonuna hala orjinal İngilizce 'order.status' gönderiyoruz ki renkler bozulmasın.
      // Ama ekrana 'displayStatus' (Türkçe) basıyoruz.
      return <span style={styles.modalStatusBadge(order.status)}>{displayStatus}</span>;
    }
    
    // Yedek (Fallback) Stil
    return <span style={{padding:'4px 8px', backgroundColor:'#eee', borderRadius:'4px', fontSize:'12px'}}>
      {displayStatus}
    </span>;
  };

  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
        
        {/* Header */}
        <div style={styles.modalHeader}>
          <div style={{display:'flex', alignItems:'center', gap:'12px'}}>
            <h2 style={{margin:0, fontSize:'20px'}}>Sipariş #{order.id}</h2>
            {/* Durum Rozeti */}
            {renderStatusBadge()}
          </div>
          <button onClick={onClose} style={{background:'none', border:'none', cursor:'pointer', fontSize:'20px', color:'#64748B'}}>
            <FaTimes />
          </button>
        </div>

        {/* --- TABS (SEKMELER) --- */}
        <div style={styles.tabHeader}>
          <button 
            style={styles.tabBtn(activeTab === 'details')} 
            onClick={() => setActiveTab('details')}
          >
            Sipariş Detayları
          </button>
          <button 
            style={styles.tabBtn(activeTab === 'history')} 
            onClick={() => setActiveTab('history')}
          >
            Geçmiş & İşlemler
          </button>
        </div>

        {/* --- BODY --- */}
        <div style={styles.modalBody}>
          
          {/* TAB 1: DETAYLAR */}
          {activeTab === 'details' && (
            <>
              <div style={styles.infoGrid}>
                {/* Satıcı */}
                <div style={styles.infoCard}>
                  <h4 style={{fontSize:'12px', color:'#64748B', fontWeight:700, marginTop:0}}>SATICI</h4>
                  {order.vendors && order.vendors.length > 0 ? (
                    <div style={{display:'flex', flexDirection:'column', gap:'8px', marginTop:'10px'}}>
                      {order.vendors.map((vendor, idx) => (
                        <div key={idx} style={{display:'flex', alignItems:'center', gap:'10px'}}>
                          <div style={{width:'36px', height:'36px', borderRadius:'8px', backgroundColor:'#E2E8F0', display:'flex', alignItems:'center', justifyContent:'center'}}>
                            <FaStore color="#475569" />
                          </div>
                          <div>
                            <div style={{fontWeight:600}}>
                              {vendor.name}
                              {vendor.id && <span style={{fontSize:'11px', color:'#9CA3AF', marginLeft:'4px'}}>#{vendor.id}</span>}
                            </div>
                            <div style={{fontSize:'12px', color:'#64748B'}}>{vendor.email}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{fontSize:'13px', color:'#9CA3AF', marginTop:'10px'}}>Satıcı bilgisi yok</div>
                  )}
                </div>

                {/* Müşteri */}
                <div style={styles.infoCard}>
                  <h4 style={{fontSize:'12px', color:'#64748B', fontWeight:700, marginTop:0}}>MÜŞTERİ</h4>
                  <div style={{display:'flex', alignItems:'center', gap:'10px', marginTop:'10px'}}>
                    <img src={order.customer.avatar} alt="" style={{width:'36px', height:'36px', borderRadius:'50%'}} />
                    <div>
                      <div style={{fontWeight:600}}>
                        {order.customer.name}
                        {order.customer.id && <span style={{fontSize:'11px', color:'#9CA3AF', marginLeft:'4px'}}>#{order.customer.id}</span>}
                      </div>
                      <div style={{fontSize:'12px', color:'#64748B'}}>{order.customer.phone}</div>
                    </div>
                  </div>
                </div>

                {/* Teslimat */}
                <div style={styles.infoCard}>
                  <h4 style={{fontSize:'12px', color:'#64748B', fontWeight:700, marginTop:0}}>ADRES</h4>
                  <div style={{marginTop:'10px', fontSize:'14px', display:'flex', gap:'6px'}}>
                    <FaMapMarkerAlt color="#0F172A" style={{marginTop:'3px'}} />
                    {order.shippingAddress}
                  </div>
                </div>
              </div>

              {/* Ürün Listesi */}
              <h4 style={{fontSize:'14px', fontWeight:700, marginTop:'30px', marginBottom:'16px'}}>
                Ürünler ({order.products?.length || 0})
              </h4>
              <div style={{display:'flex', flexDirection:'column', gap:'16px'}}>
                {order.products && order.products.map((product, idx) => (
                  <div key={idx}>
                    <div style={{
                      display:'flex', 
                      alignItems:'center', 
                      gap:'12px', 
                      padding:'16px',
                      backgroundColor:'#fff',
                      border:'1px solid #E2E8F0',
                      borderRadius:'8px'
                    }}>
                      {product.image && (
                        <a 
                          href={`/product/${product.slug || product.id}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          style={{flexShrink: 0}}
                        >
                          <img 
                            src={product.image.startsWith('http') ? product.image : `http://127.0.0.1:8000${product.image}`}
                            style={{width:'60px', height:'60px', borderRadius:'8px', objectFit:'cover', cursor:'pointer'}} 
                            alt={product.name}
                          />
                        </a>
                      )}
                      <div style={{flex:1}}>
                        <a 
                          href={`/product/${product.slug || product.id}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          style={{textDecoration:'none', color:'inherit'}}
                        >
                          <div style={{fontSize:'14px', fontWeight:600, color:'#111827', cursor:'pointer', ':hover':{color:'#059669'}}}>
                            {product.name}
                          </div>
                        </a>
                        {product.variant && (
                          <div style={{fontSize:'12px', color:'#6B7280', marginTop:'4px'}}>{product.variant}</div>
                        )}
                      </div>
                      <div style={{textAlign:'right'}}>
                        <div style={{fontSize:'13px', color:'#6B7280'}}>{product.qty} x ₺{product.price}</div>
                        <div style={{fontSize:'15px', fontWeight:600, color:'#111827', marginTop:'4px'}}>
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

              {/* Toplam Özeti */}
              <div style={{marginTop:'30px', padding:'20px', backgroundColor:'#F8FAFC', borderRadius:'8px'}}>
                <div style={{display:'flex', justifyContent:'space-between', marginBottom:'10px', fontSize:'14px', color:'#64748B'}}>
                  <span>Ara Toplam</span>
                  <span style={{fontWeight:500, color:'#1E293B'}}>
                    {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(order.amount)}
                  </span>
                </div>
                <div style={{display:'flex', justifyContent:'space-between', marginBottom:'16px', fontSize:'14px', color:'#64748B'}}>
                  <span>Kargo</span>
                  <span style={{fontWeight:500, color:'#1E293B'}}>₺0,00</span>
                </div>
                <div style={{height:'1px', backgroundColor:'#E2E8F0', marginBottom:'16px'}}></div>
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                  <span style={{fontSize:'16px', fontWeight:700, color:'#0F172A'}}>Genel Toplam</span>
                  <span style={{fontSize:'20px', fontWeight:800, color:'#0F172A'}}>
                    {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(order.amount)}
                  </span>
                </div>
              </div>

            </>
          )}

          {/* TAB 2: GEÇMİŞ & İŞLEMLER */}
          {activeTab === 'history' && (
            <div style={{padding:'0 10px'}}>
              
              <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'32px'}}>
                
                {/* Sol: Timeline */}
                <div>
                  <h4 style={{fontSize:'14px', fontWeight:700, marginBottom:'16px', display:'flex', alignItems:'center', gap:'8px'}}>
                    <FaHistory color="#64748B" /> Sipariş Geçmişi
                  </h4>
                  <div style={styles.timelineContainer}>
                    <div style={styles.timelineItem}>
                      {/* Fonksiyon çağrısı güvenliği */}
                      <div style={typeof styles.timelineDot === 'function' ? styles.timelineDot('#10B981') : {}}></div>
                      <div style={styles.timelineDate}>Bugün, 14:30</div>
                      <div style={styles.timelineText}>Sipariş oluşturuldu.</div>
                    </div>
                    <div style={styles.timelineItem}>
                      <div style={typeof styles.timelineDot === 'function' ? styles.timelineDot('#3B82F6') : {}}></div>
                      <div style={styles.timelineDate}>Bugün, 14:35</div>
                      <div style={styles.timelineText}>Ödeme onaylandı (Kredi Kartı).</div>
                    </div>
                    <div style={styles.timelineItem}>
                      <div style={typeof styles.timelineDot === 'function' ? styles.timelineDot('#E2E8F0') : {}}></div>
                      <div style={styles.timelineDate}>-</div>
                      <div style={styles.timelineText} styles={{color:'#94A3B8'}}>Satıcı onayı bekleniyor...</div>
                    </div>
                  </div>
                </div>

                {/* Sağ: Admin Notu */}
                <div>
                  <h4 style={{fontSize:'14px', fontWeight:700, marginBottom:'16px', display:'flex', alignItems:'center', gap:'8px'}}>
                    <FaStickyNote color="#64748B" /> Yönetici Notu Ekle
                  </h4>
                  <textarea 
                    style={styles.noteArea} 
                    placeholder="Siparişle ilgili özel bir not düşün (Sadece adminler görür)..."
                    value={adminNote}
                    onChange={(e) => setAdminNote(e.target.value)}
                  ></textarea>
                  <button 
                    style={{...styles.btnPrimary, width:'100%', padding:'8px'}}
                    onClick={handleSaveNote}
                  >
                    Notu Kaydet
                  </button>
                </div>

              </div>
            </div>
          )}

        </div>

        {/* FOOTER ACTIONS - İŞLEVSEL HALE GELDİ */}
        <div style={styles.modalFooter}>
          
          <button 
            style={{...styles.btnSecondary, color:'#DC2626', borderColor:'#FECACA'}}
            onClick={handleForceCancel}
          >
            <FaBan style={{marginRight:'6px'}} /> İptal Et (Zorla)
          </button>

          <div style={{marginLeft:'auto', display:'flex', gap:'12px'}}>
            <button 
              style={styles.btnSecondary}
              onClick={handlePrintInvoice}
            >
              <FaFileInvoice style={{marginRight:'6px'}} /> Fatura / Ekstre
            </button>
            
            <button style={styles.btnPrimary} onClick={() => setActiveTab('history')}>
              <FaCheckCircle style={{marginRight:'6px'}} /> Detaylı İncele / Not Al
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};

export default OrderDetailModal;