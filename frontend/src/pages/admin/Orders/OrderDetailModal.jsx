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
                  <div style={{display:'flex', alignItems:'center', gap:'10px', marginTop:'10px'}}>
                    <div style={{width:'36px', height:'36px', borderRadius:'8px', backgroundColor:'#E2E8F0', display:'flex', alignItems:'center', justifyContent:'center'}}>
                      <FaStore color="#475569" />
                    </div>
                    <div>
                      <div style={{fontWeight:600}}>{order.vendor.name}</div>
                      <div style={{fontSize:'12px', color:'#64748B'}}>Puan: {order.vendor.rating}</div>
                    </div>
                  </div>
                </div>

                {/* Müşteri */}
                <div style={styles.infoCard}>
                  <h4 style={{fontSize:'12px', color:'#64748B', fontWeight:700, marginTop:0}}>MÜŞTERİ</h4>
                  <div style={{display:'flex', alignItems:'center', gap:'10px', marginTop:'10px'}}>
                    <img src={order.customer.avatar} alt="" style={{width:'36px', height:'36px', borderRadius:'50%'}} />
                    <div>
                      <div style={{fontWeight:600}}>{order.customer.name}</div>
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

              {/* Ürün Tablosu */}
              <table style={{width:'100%', borderCollapse:'collapse', marginTop:'20px'}}>
                <thead style={{backgroundColor:'#F8FAFC'}}>
                  <tr>
                    <th style={{textAlign:'left', padding:'10px', fontSize:'12px', color:'#64748B'}}>ÜRÜN</th>
                    <th style={{textAlign:'center', padding:'10px', fontSize:'12px', color:'#64748B'}}>ADET</th>
                    <th style={{textAlign:'right', padding:'10px', fontSize:'12px', color:'#64748B'}}>TUTAR</th>
                  </tr>
                </thead>
                <tbody>
                  {order.products.map((p, i) => (
                    <tr key={i} style={{borderBottom:'1px dashed #E2E8F0'}}>
                      <td style={{padding:'12px', display:'flex', alignItems:'center', gap:'10px'}}>
                        {p.image && <img src={p.image} style={{width:'40px', height:'40px', borderRadius:'4px', objectFit:'cover'}} alt="" />}
                        <span style={{fontSize:'14px', fontWeight:500}}>{p.name}</span>
                      </td>
                      <td style={{padding:'12px', textAlign:'center'}}>{p.qty}</td>
                      <td style={{padding:'12px', textAlign:'right', fontWeight:600}}>
                        {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(p.price)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* --- YENİLENMİŞ ÖZET ALANI --- */}
              <div style={{display:'flex', justifyContent:'flex-end', marginTop:'30px'}}>
                <div style={{
                  width:'900px', 
                  backgroundColor:'#fff', 
                  border:'1px solid #E2E8F0', // Çerçeve ekledik
                  borderRadius:'8px',
                  padding:'20px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' // Hafif gölge
                }}>
                  
                  {/* Ara Toplam */}
                  <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'12px', fontSize:'14px', color:'#64748B'}}>
                    <span>Ürün Toplamı</span>
                    <span style={{fontWeight:500, color:'#1E293B'}}>
                      {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(order.amount)}
                    </span>
                  </div>

                  {/* Komisyon */}
                  <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'16px', fontSize:'14px', color:'#64748B'}}>
                    <span>Platform Komisyonu (%10)</span>
                    <span style={{fontWeight:500, color:'#166534'}}>
                      + {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(order.commission)}
                    </span>
                  </div>

                  {/* Çizgi */}
                  <div style={{height:'1px', backgroundColor:'#E2E8F0', marginBottom:'16px'}}></div>

                  {/* Genel Toplam */}
                  <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                    <span style={{fontSize:'16px', fontWeight:700, color:'#0F172A'}}>GENEL TOPLAM</span>
                    <span style={{fontSize:'20px', fontWeight:800, color:'#0F172A'}}>
                      {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(order.amount)}
                    </span>
                  </div>
                  
                  <div style={{fontSize:'11px', color:'#94A3B8', marginTop:'8px', textAlign:'right'}}>
                    KDV Dahildir
                  </div>

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