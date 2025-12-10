// src/pages/admin/Orders/OrderDetailModal.jsx
import React, { useState, useEffect } from 'react';
import { 
  FaTimes, FaStore, FaUser, FaMapMarkerAlt, FaFileInvoice, 
  FaBan, FaCheckCircle, FaHistory, FaStickyNote, FaUserShield, FaCog 
} from 'react-icons/fa';
import axios from 'axios';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://127.0.0.1:8000';

// YENİ SERVİSİ IMPORT EDİYORUZ (Aynı klasörde invoiceService.js olmalı)
import { printInvoice } from './invoiceService';

const OrderDetailModal = ({ order, isOpen, onClose, styles, onCancel }) => {
  if (!isOpen || !order) return null;

  // --- STATE YÖNETİMİ ---
  const [activeTab, setActiveTab] = useState('details'); // 'details' | 'history' | 'notes'
  const [adminNote, setAdminNote] = useState('');
  const [visibleToVendor, setVisibleToVendor] = useState(true);
  const [visibleToCustomer, setVisibleToCustomer] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [orderNotes, setOrderNotes] = useState([]);
  const [loadingNotes, setLoadingNotes] = useState(false);
  const [userOrders, setUserOrders] = useState([]);
  const [loadingUserOrders, setLoadingUserOrders] = useState(false);

  // --- İŞLEVLER ---

  // Notları yükle
  const loadNotes = async () => {
    setLoadingNotes(true);
    try {
      const token = localStorage.getItem('admin_token');
      const response = await axios.get(
        `${BACKEND_URL}/api/v1/admin/orders/${order.order_id}/notes`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        setOrderNotes(response.data.data.notes || []);
      }
    } catch (error) {
      console.error('Notlar yüklenirken hata:', error);
    } finally {
      setLoadingNotes(false);
    }
  };

  // --- NOTLARI YÜK ---
  useEffect(() => {
    if (isOpen && order?.order_id) {
      loadNotes();
      loadUserOrders();
    }
  }, [isOpen, order?.order_id]);

  // Kullanıcının diğer siparişlerini yükle
  const loadUserOrders = async () => {
    setLoadingUserOrders(true);
    try {
      const token = localStorage.getItem('admin_token');
      const response = await axios.get(
        `${BACKEND_URL}/api/v1/admin/orders/${order.order_id}/user-orders`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        setUserOrders(response.data.data.orders || []);
      }
    } catch (error) {
      console.error('Kullanıcı siparişleri yüklenirken hata:', error);
    } finally {
      setLoadingUserOrders(false);
    }
  };

  // 1. Zorla İptal Et (Admin Yetkisi)
  const handleForceCancel = () => {
    if (!cancelReason.trim()) {
      alert('Lütfen iptal sebebini girin');
      return;
    }
    
    if (onCancel) {
      onCancel({ orderId: order.order_id, reason: cancelReason });
    }
    
    setShowCancelModal(false);
    setCancelReason('');
    onClose();
  };

  // 2. Fatura/Ekstre Yazdır
  const handlePrintInvoice = () => {
    // invoiceService.js dosyasındaki fonksiyonu çağırır
    printInvoice(order);
  };

  // 3. Not Kaydet
  const handleSaveNote = async () => {
    if(!adminNote.trim()) {
      alert('Lütfen bir not girin');
      return;
    }

    try {
      const token = localStorage.getItem('admin_token');
      const response = await axios.post(
        `${BACKEND_URL}/api/v1/admin/orders/${order.order_id}/notes`,
        {
          note: adminNote,
          is_visible_to_vendor: visibleToVendor,
          is_visible_to_customer: visibleToCustomer
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        alert('Not başarıyla kaydedildi');
        setAdminNote('');
        setVisibleToVendor(true);
        setVisibleToCustomer(false);
        // Notları yeniden yükle
        loadNotes();
        // Notlar sekmesine geç
        setActiveTab('notes');
      }
    } catch (error) {
      alert('Not kaydedilirken hata: ' + (error.response?.data?.message || error.message));
    }
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
          <button 
            style={styles.tabBtn(activeTab === 'notes')} 
            onClick={() => setActiveTab('notes')}
          >
            Sipariş Notları {orderNotes.length > 0 && `(${orderNotes.length})`}
          </button>
          <button 
            style={styles.tabBtn(activeTab === 'user-orders')} 
            onClick={() => setActiveTab('user-orders')}
          >
            Kullanıcı Siparişleri {userOrders.length > 0 && `(${userOrders.length})`}
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
                  <div style={{position:'relative', paddingLeft:'24px'}}>
                    {/* Dikey çizgi */}
                    <div style={{
                      position:'absolute',
                      left:'8px',
                      top:'8px',
                      bottom:'8px',
                      width:'2px',
                      backgroundColor:'#E5E7EB'
                    }}></div>

                    {order.status_history && order.status_history.length > 0 ? (
                      order.status_history.map((history, idx) => {
                        const getColor = () => {
                          if (history.new_status === 'cancelled') return '#DC2626';
                          if (history.new_status === 'delivered') return '#059669';
                          if (history.new_status === 'confirmed') return '#3B82F6';
                          if (history.new_status === 'shipped') return '#F59E0B';
                          if (history.new_status === 'processing') return '#8B5CF6';
                          return '#64748B';
                        };

                        return (
                          <div key={idx} style={{position:'relative', paddingBottom:'24px'}}>
                            {/* Renkli nokta */}
                            <div style={{
                              position:'absolute',
                              left:'-20px',
                              top:'4px',
                              width:'16px',
                              height:'16px',
                              borderRadius:'50%',
                              backgroundColor: getColor(),
                              border:'3px solid white',
                              boxShadow:'0 0 0 1px #E5E7EB'
                            }}></div>

                            <div>
                              <div style={{fontSize:'14px', fontWeight:600, color:'#111827', marginBottom:'4px'}}>
                                {history.new_status === 'pending' && 'Sipariş Oluşturuldu'}
                                {history.new_status === 'confirmed' && 'Ödeme Onaylandı'}
                                {history.new_status === 'processing' && 'Hazırlanıyor'}
                                {history.new_status === 'shipped' && 'Kargoya Verildi'}
                                {history.new_status === 'delivered' && 'Teslim Edildi'}
                                {history.new_status === 'cancelled' && 'İptal Edildi'}
                                {!['pending','confirmed','processing','shipped','delivered','cancelled'].includes(history.new_status) && history.new_status}
                              </div>
                              {history.note && (
                                <div style={{fontSize:'13px', color:'#6B7280', marginBottom:'4px', fontStyle:'italic'}}>
                                  "{history.note}"
                                </div>
                              )}
                              <div style={{fontSize:'12px', color:'#9CA3AF'}}>
                                {history.changed_by_name} • {history.created_at}
                              </div>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div style={{padding:'20px', textAlign:'center', color:'#9CA3AF', fontSize:'14px'}}>
                        Henüz geçmiş kaydı yok
                      </div>
                    )}
                  </div>
                </div>

                {/* Sağ: Admin Notu */}
                <div>
                  <h4 style={{fontSize:'14px', fontWeight:700, marginBottom:'16px', display:'flex', alignItems:'center', gap:'8px'}}>
                    <FaStickyNote color="#64748B" /> Yönetici Notu Ekle
                  </h4>
                  <textarea 
                    style={styles.noteArea} 
                    placeholder="Siparişle ilgili özel bir not ekleyin..."
                    value={adminNote}
                    onChange={(e) => setAdminNote(e.target.value)}
                  ></textarea>
                  
                  {/* Görünürlük Ayarları */}
                  <div style={{marginTop:'12px', marginBottom:'16px'}}>
                    <div style={{fontSize:'13px', fontWeight:600, color:'#374151', marginBottom:'8px'}}>
                      Bu notu kimler görebilir?
                    </div>
                    <label style={{display:'flex', alignItems:'center', gap:'8px', fontSize:'13px', color:'#6B7280', marginBottom:'6px', cursor:'pointer'}}>
                      <input 
                        type="checkbox" 
                        checked={visibleToVendor}
                        onChange={(e) => setVisibleToVendor(e.target.checked)}
                        style={{width:'16px', height:'16px'}}
                      />
                      <span>Satıcı görebilir</span>
                    </label>
                    <label style={{display:'flex', alignItems:'center', gap:'8px', fontSize:'13px', color:'#6B7280', cursor:'pointer'}}>
                      <input 
                        type="checkbox" 
                        checked={visibleToCustomer}
                        onChange={(e) => setVisibleToCustomer(e.target.checked)}
                        style={{width:'16px', height:'16px'}}
                      />
                      <span>Müşteri görebilir</span>
                    </label>
                  </div>

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

          {/* TAB 3: SİPARİŞ NOTLARI */}
          {activeTab === 'notes' && (
            <div>
              <h3 style={{fontSize:'16px', fontWeight:700, marginBottom:'20px', display:'flex', alignItems:'center', gap:'8px'}}>
                <FaStickyNote color="#059669" /> Sipariş Notları ({orderNotes.length})
              </h3>

              {loadingNotes ? (
                <div style={{padding:'40px', textAlign:'center', color:'#9CA3AF'}}>
                  Notlar yükleniyor...
                </div>
              ) : orderNotes.length === 0 ? (
                <div style={{
                  padding:'40px',
                  textAlign:'center',
                  backgroundColor:'#F9FAFB',
                  borderRadius:'12px',
                  border:'2px dashed #E5E7EB'
                }}>
                  <FaStickyNote size={48} color="#D1D5DB" style={{marginBottom:'16px'}} />
                  <p style={{color:'#6B7280', fontSize:'14px', margin:0}}>
                    Henüz not eklenmemiş
                  </p>
                  <p style={{color:'#9CA3AF', fontSize:'13px', marginTop:'8px'}}>
                    "Geçmiş & İşlemler" sekmesinden not ekleyebilirsiniz
                  </p>
                </div>
              ) : (
                <div style={{
                  display:'flex',
                  flexDirection:'column',
                  gap:'16px'
                }}>
                  {orderNotes.map((note, idx) => (
                    <div key={note.id} style={{
                      padding:'16px',
                      backgroundColor:'#FFFBEB',
                      border:'1px solid #FDE68A',
                      borderRadius:'12px',
                      position:'relative'
                    }}>
                      {/* Not Header */}
                      <div style={{
                        display:'flex',
                        alignItems:'center',
                        justifyContent:'space-between',
                        marginBottom:'12px',
                        paddingBottom:'12px',
                        borderBottom:'1px dashed #FDE68A'
                      }}>
                        <div style={{display:'flex', alignItems:'center', gap:'8px'}}>
                          <div style={{
                            width:'32px',
                            height:'32px',
                            borderRadius:'50%',
                            backgroundColor:'#FBBF24',
                            color:'white',
                            display:'flex',
                            alignItems:'center',
                            justifyContent:'center',
                            fontSize:'14px',
                            fontWeight:'700'
                          }}>
                            {note.admin_name?.charAt(0) || 'A'}
                          </div>
                          <div>
                            <div style={{fontSize:'13px', fontWeight:600, color:'#92400E'}}>
                              {note.admin_name}
                            </div>
                            <div style={{fontSize:'11px', color:'#B45309'}}>
                              {note.created_at}
                            </div>
                          </div>
                        </div>

                        {/* Görünürlük Badge'leri */}
                        <div style={{display:'flex', gap:'6px'}}>
                          {note.is_visible_to_vendor && (
                            <span style={{
                              fontSize:'10px',
                              padding:'4px 8px',
                              backgroundColor:'#DBEAFE',
                              color:'#1E40AF',
                              borderRadius:'4px',
                              fontWeight:600
                            }}>
                              <FaStore size={10} style={{marginRight:'4px'}} />
                              Satıcı
                            </span>
                          )}
                          {note.is_visible_to_customer && (
                            <span style={{
                              fontSize:'10px',
                              padding:'4px 8px',
                              backgroundColor:'#D1FAE5',
                              color:'#065F46',
                              borderRadius:'4px',
                              fontWeight:600
                            }}>
                              <FaUser size={10} style={{marginRight:'4px'}} />
                              Müşteri
                            </span>
                          )}
                          {!note.is_visible_to_vendor && !note.is_visible_to_customer && (
                            <span style={{
                              fontSize:'10px',
                              padding:'4px 8px',
                              backgroundColor:'#FEE2E2',
                              color:'#991B1B',
                              borderRadius:'4px',
                              fontWeight:600
                            }}>
                              🔒 Gizli
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Not İçeriği */}
                      <div style={{
                        fontSize:'14px',
                        color:'#78350F',
                        lineHeight:'1.6',
                        whiteSpace:'pre-wrap'
                      }}>
                        {note.note}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: KULLANICI SİPARİŞLERİ */}
          {activeTab === 'user-orders' && (
            <div>
              <h3 style={{fontSize:'16px', fontWeight:700, marginBottom:'20px', display:'flex', alignItems:'center', gap:'8px'}}>
                <FaUser color="#3B82F6" /> {order.customer?.name || 'Kullanıcı'}'nın Diğer Siparişleri ({userOrders.length})
              </h3>

              {loadingUserOrders ? (
                <div style={{padding:'40px', textAlign:'center', color:'#9CA3AF'}}>
                  Siparişler yükleniyor...
                </div>
              ) : userOrders.length === 0 ? (
                <div style={{
                  padding:'40px',
                  textAlign:'center',
                  backgroundColor:'#F9FAFB',
                  borderRadius:'12px',
                  border:'2px dashed #E5E7EB'
                }}>
                  <FaUser size={48} color="#D1D5DB" style={{marginBottom:'16px'}} />
                  <p style={{color:'#6B7280', fontSize:'14px', margin:0}}>
                    Başka sipariş bulunamadı
                  </p>
                </div>
              ) : (
                <div style={{
                  display:'flex',
                  flexDirection:'column',
                  gap:'12px'
                }}>
                  {userOrders.map((userOrder) => {
                    const getStatusColor = (status) => {
                      switch(status) {
                        case 'delivered': return '#059669';
                        case 'cancelled': return '#DC2626';
                        case 'pending': return '#F59E0B';
                        case 'processing': return '#3B82F6';
                        default: return '#64748B';
                      }
                    };

                    const getStatusText = (status) => {
                      switch(status) {
                        case 'pending': return 'Beklemede';
                        case 'confirmed': return 'Onaylandı';
                        case 'processing': return 'Hazırlanıyor';
                        case 'shipped': return 'Kargoda';
                        case 'delivered': return 'Teslim Edildi';
                        case 'cancelled': return 'İptal';
                        default: return status;
                      }
                    };

                    return (
                      <div key={userOrder.id} style={{
                        padding:'16px',
                        backgroundColor:'white',
                        border:'1px solid #E5E7EB',
                        borderRadius:'12px',
                        display:'flex',
                        justifyContent:'space-between',
                        alignItems:'center',
                        transition:'all 0.2s',
                        cursor:'pointer'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = '#3B82F6';
                        e.currentTarget.style.boxShadow = '0 4px 6px rgba(59, 130, 246, 0.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = '#E5E7EB';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                      >
                        <div style={{flex:1}}>
                          <div style={{display:'flex', alignItems:'center', gap:'12px', marginBottom:'8px'}}>
                            <span style={{
                              fontSize:'14px',
                              fontWeight:700,
                              color:'#0F172A',
                              fontFamily:'monospace'
                            }}>
                              #{userOrder.order_number}
                            </span>
                            <span style={{
                              fontSize:'11px',
                              padding:'4px 8px',
                              backgroundColor: getStatusColor(userOrder.status) + '20',
                              color: getStatusColor(userOrder.status),
                              borderRadius:'6px',
                              fontWeight:600
                            }}>
                              {getStatusText(userOrder.status)}
                            </span>
                          </div>
                          <div style={{fontSize:'12px', color:'#64748B'}}>
                            ID: {userOrder.id} • {userOrder.created_at}
                          </div>
                        </div>
                        <div style={{textAlign:'right'}}>
                          <div style={{fontSize:'18px', fontWeight:700, color:'#0F172A'}}>
                            {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(userOrder.total)}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

        </div>

        {/* FOOTER ACTIONS - İŞLEVSEL HALE GELDİ */}
        <div style={styles.modalFooter}>
          
          {/* İptal butonu sadece teslim edilmemiş siparişlerde göster */}
          {order.status !== 'delivered' && (
            <button 
              style={{...styles.btnSecondary, color:'#DC2626', borderColor:'#FECACA'}}
              onClick={() => setShowCancelModal(true)}
            >
              <FaBan style={{marginRight:'6px'}} /> İptal Et (Zorla)
            </button>
          )}

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

        {/* İptal Modal */}
        {showCancelModal && (
          <div style={{
            position:'fixed',
            top:0,
            left:0,
            right:0,
            bottom:0,
            backgroundColor:'rgba(0,0,0,0.5)',
            display:'flex',
            alignItems:'center',
            justifyContent:'center',
            zIndex:10000
          }} onClick={() => setShowCancelModal(false)}>
            <div style={{
              backgroundColor:'white',
              padding:'24px',
              borderRadius:'12px',
              maxWidth:'500px',
              width:'90%'
            }} onClick={(e) => e.stopPropagation()}>
              <h3 style={{margin:'0 0 16px 0', fontSize:'18px', fontWeight:700}}>Siparişi İptal Et</h3>
              <p style={{margin:'0 0 16px 0', fontSize:'14px', color:'#6B7280'}}>
                Bu işlem geri alınamaz. İptal sebebini açıklayın:
              </p>
              <textarea 
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="İptal sebebini girin (müşteri ve satıcı görecek)"
                style={{
                  width:'100%',
                  minHeight:'100px',
                  padding:'12px',
                  border:'1px solid #E2E8F0',
                  borderRadius:'8px',
                  fontSize:'14px',
                  fontFamily:'inherit',
                  resize:'vertical'
                }}
              />
              <div style={{display:'flex', gap:'12px', marginTop:'16px', justifyContent:'flex-end'}}>
                <button 
                  onClick={() => setShowCancelModal(false)}
                  style={{
                    padding:'8px 16px',
                    border:'1px solid #E2E8F0',
                    borderRadius:'8px',
                    backgroundColor:'white',
                    cursor:'pointer',
                    fontSize:'14px'
                  }}
                >
                  Vazgeç
                </button>
                <button 
                  onClick={handleForceCancel}
                  style={{
                    padding:'8px 16px',
                    border:'none',
                    borderRadius:'8px',
                    backgroundColor:'#DC2626',
                    color:'white',
                    cursor:'pointer',
                    fontSize:'14px',
                    fontWeight:600
                  }}
                >
                  Siparişi İptal Et
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default OrderDetailModal;