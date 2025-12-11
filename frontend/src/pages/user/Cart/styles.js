// src/pages/user/Cart/styles.js

/**
 * Cart sayfası için merkezi stil tanımlamaları
 * Responsive (Mobil/Masaüstü) uyumlu Senior Mimarisi
 */
export const getStyles = (isMobile) => ({
  // --- ANA KAPSAYICI ---
  container: {
    width: '100%',
    maxWidth: '1200px', // Masaüstünde içeriği sınırlar
    margin: '0 auto',
    // Mobilde alt bar'ın (veya sticky butonun) altında içerik kalmasın diye extra padding
    padding: isMobile ? '20px 0 140px 0' : '40px 20px', 
    fontFamily: '"Plus Jakarta Sans", "Inter", sans-serif',
    minHeight: '100vh',
    boxSizing: 'border-box',
    backgroundColor: '#ffffff',
  },

  // --- HEADER ---
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: isMobile ? 'space-between' : 'flex-start',
    gap: '12px',
    // Mobilde kenarlardan boşluk veriyoruz
    padding: isMobile ? '0 16px' : '0', 
    marginBottom: isMobile ? '16px' : '32px',
  },
  headerTitle: {
    fontSize: isMobile ? '22px' : '32px',
    fontWeight: '800',
    color: 'var(--text-main)',
    margin: 0,
    letterSpacing: '-0.5px',
  },
  headerCount: {
    fontSize: isMobile ? '13px' : '18px',
    fontWeight: '600',
    color: 'var(--text-muted)',
    backgroundColor: isMobile ? '#f1f5f9' : 'transparent',
    padding: isMobile ? '4px 8px' : '0',
    borderRadius: '6px',
  },

  // --- LAYOUT (IZGARA SİSTEMİ) ---
  layout: {
    display: isMobile ? 'flex' : 'grid',
    // Masaüstünde: Sol (%65) - Sağ (%35) | Mobilde: Tek kolon
    gridTemplateColumns: isMobile ? '1fr' : '1fr 380px',
    flexDirection: 'column',
    gap: '24px',
    position: 'relative',
    padding: isMobile ? '0' : '0', 
  },
  
  // Sol Taraf (Ürünler)
  productList: {
    display: 'flex',
    flexDirection: 'column',
    gap: isMobile ? '16px' : '24px',
    width: '100%',
    minWidth: 0, // Flexbox taşma bug'ını önler
    padding: isMobile ? '0 16px' : '0', // Mobilde ürünler kenara yapışmasın
  },

  // Sağ Taraf Wrapper (Sticky Özelliği Burada)
  orderSummaryContainer: {
    // Masaüstünde sağda yapışık kalır
    position: isMobile ? 'relative' : 'sticky',
    top: isMobile ? 'auto' : '100px',
    height: 'fit-content',
    zIndex: 9,
    padding: isMobile ? '0 16px' : '0',
  },

  // --- BOŞ SEPET ---
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '60vh',
    textAlign: 'center',
    padding: '20px',
  },
  emptyIconBg: {
    backgroundColor: 'var(--primary-lighter)',
    padding: isMobile ? '24px' : '32px',
    borderRadius: '50%',
    marginBottom: '24px',
    color: 'var(--primary)',
  },
  emptyTitle: {
    fontSize: isMobile ? '20px' : '24px',
    fontWeight: '700',
    color: 'var(--text-main)',
    marginBottom: '8px',
  },
  emptyText: {
    color: 'var(--text-muted)',
    marginBottom: '32px',
    maxWidth: '400px',
    lineHeight: '1.6',
    fontSize: isMobile ? '14px' : '16px',
  },
  startShoppingBtn: {
    backgroundColor: 'var(--primary)',
    color: 'white',
    padding: isMobile ? '12px 24px' : '14px 32px',
    borderRadius: '12px',
    fontWeight: '600',
    textDecoration: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    boxShadow: 'var(--shadow-green)',
    transition: 'transform 0.2s',
    fontSize: '15px',
  },

  // --- KART YAPISI ---
  card: {
    backgroundColor: 'white',
    borderRadius: isMobile ? '16px' : '20px',
    // Mobilde kartların sınırlarını biraz daha belirginleştirelim
    border: '1px solid #e2e8f0', 
    overflow: 'hidden',
    boxShadow: isMobile ? 'none' : 'var(--shadow-sm)',
  },
  
  // Masaüstü Tablo Başlığı
  tableHeader: {
    display: isMobile ? 'none' : 'grid',
    gridTemplateColumns: '2fr 1fr 1fr 1fr',
    padding: '16px 24px',
    backgroundColor: '#f8fafc',
    borderBottom: '1px solid #e2e8f0',
    fontSize: '13px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    fontWeight: '600',
    color: 'var(--text-muted)',
  },

  // --- ÜRÜN SATIRI ---
  cartItem: {
    padding: isMobile ? '16px' : '24px',
    borderBottom: '1px solid #f1f5f9',
    display: isMobile ? 'flex' : 'grid',
    // Masaüstü Grid / Mobil Flex
    gridTemplateColumns: isMobile ? 'none' : '2fr 1fr 1fr 1fr',
    flexDirection: isMobile ? 'row' : 'row', // Mobilde yan yana (Görsel + Bilgi)
    alignItems: isMobile ? 'flex-start' : 'center',
    gap: '16px',
    position: 'relative', // Sil butonu için referans
  },
  
  productInfo: {
    display: 'flex',
    flex: isMobile ? 1 : 'unset',
    gap: '16px',
  },
  productImage: {
    width: isMobile ? '80px' : '90px',
    height: isMobile ? '80px' : '90px',
    borderRadius: '12px',
    objectFit: 'cover',
    border: '1px solid #f1f5f9',
    backgroundColor: '#f8fafc',
  },
  productDetails: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    gap: '4px',
  },
  productName: {
    fontSize: isMobile ? '15px' : '16px',
    fontWeight: '600',
    color: 'var(--text-main)',
    textDecoration: 'none',
    lineHeight: '1.4',
    // Mobilde uzun isimleri ... ile kesme
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
  variantText: {
    fontSize: '13px',
    color: 'var(--text-muted)',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },

  // --- MİKTAR KONTROLÜ ---
  quantityControl: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: '#f8fafc',
    padding: '4px',
    borderRadius: '10px',
    width: 'fit-content',
    // Mobilde miktar kontrolünü konumlandırma
    marginTop: isMobile ? '12px' : '0',
  },
  qtyBtn: {
    width: '32px',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    cursor: 'pointer',
    color: 'var(--text-main)',
    transition: 'all 0.2s',
  },
  qtyText: {
    fontSize: '15px',
    fontWeight: '600',
    color: 'var(--text-main)',
    minWidth: '24px',
    textAlign: 'center',
  },

  // --- FİYAT & SİLME ---
  priceArea: {
    // Mobilde fiyatı sağ alta veya isme yakın konumlandırma
    display: 'flex',
    flexDirection: 'column',
    alignItems: isMobile ? 'flex-end' : 'flex-start',
  },
  priceText: {
    fontSize: isMobile ? '15px' : '16px',
    color: 'var(--text-muted)',
    fontWeight: '500',
    textDecoration: 'line-through', // İndirim varsa diye hazırlık
    fontSize: '14px',
  },
  totalText: {
    fontSize: isMobile ? '16px' : '18px',
    fontWeight: '700',
    color: 'var(--primary)',
  },
  
  removeBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    color: 'var(--danger)',
    fontSize: '13px',
    fontWeight: '500',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '8px 0',
    // Mobilde sağ üst köşeye alabilirsin veya aşağıda bırakabilirsin
  },

  // --- FOOTER (Temizle / Devam Et) ---
  footer: {
    padding: '16px 24px',
    backgroundColor: '#f8fafc',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTop: '1px solid #e2e8f0',
  },
  clearBtn: {
    color: 'var(--danger)',
    background: 'none',
    border: 'none',
    fontWeight: '600',
    fontSize: '14px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },

  // --- ÖZET KARTI ---
  summaryCard: {
    backgroundColor: 'white',
    borderRadius: isMobile ? '20px' : '24px',
    border: '1px solid #e2e8f0',
    padding: '24px',
    boxShadow: 'var(--shadow-sm)',
  },
  summaryTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: 'var(--text-main)',
    marginBottom: '20px',
    paddingBottom: '16px',
    borderBottom: '1px solid #f1f5f9',
  },

  // --- KUPON ---
  couponSection: {
    marginBottom: '24px',
  },
  couponForm: {
    display: 'flex',
    gap: '8px',
    marginTop: '8px',
  },
  couponInput: {
    flex: 1,
    padding: '12px 16px',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
    fontSize: '14px',
    outline: 'none',
    backgroundColor: '#f8fafc',
    color: 'var(--text-main)',
  },
  couponBtn: {
    backgroundColor: 'var(--text-main)',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    padding: '0 20px',
    fontWeight: '600',
    fontSize: '14px',
    cursor: 'pointer',
  },

  // --- HESAPLAMA SATIRLARI ---
  row: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '16px',
    color: 'var(--text-muted)',
    fontSize: '15px',
  },
  totalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '24px',
    paddingTop: '20px',
    borderTop: '2px dashed #e2e8f0',
    fontSize: '20px',
    fontWeight: '800',
    color: 'var(--text-main)',
  },

  // --- CHECKOUT BUTONU (Sticky & Normal) ---
  checkoutBtn: {
    width: '100%',
    backgroundColor: 'var(--primary)',
    color: 'white',
    border: 'none',
    padding: '16px',
    borderRadius: '16px',
    fontSize: '16px',
    fontWeight: '700',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    boxShadow: 'var(--shadow-green)',
    transition: 'transform 0.1s',
    marginTop: '24px',
  },
});