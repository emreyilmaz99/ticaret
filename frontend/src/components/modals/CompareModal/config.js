// src/components/modals/CompareModal/config.js
export const compareAttributes = [
  { 
    key: 'price', 
    label: 'Fiyat', 
    icon: '💰', 
    format: (val) => new Intl.NumberFormat('tr-TR', { 
      style: 'currency', 
      currency: 'TRY' 
    }).format(val || 0) 
  },
  { 
    key: 'discount_percentage', 
    label: 'İndirim', 
    icon: '🏷️', 
    format: (val) => val ? `%${val}` : 'Yok' 
  },
  { 
    key: 'rating', 
    label: 'Puan', 
    icon: '⭐', 
    format: (val) => val ? `${val}/5` : '-' 
  },
  { 
    key: 'reviews_count', 
    label: 'Değerlendirme', 
    icon: '💬', 
    format: (val) => `${val || 0} yorum` 
  },
  { 
    key: 'stock_quantity', 
    label: 'Stok', 
    icon: '📦', 
    format: (val) => val > 0 ? `${val} adet` : 'Tükendi' 
  },
  { 
    key: 'vendor_name', 
    label: 'Satıcı', 
    icon: '🏪', 
    format: (val) => val || 'Mağaza' 
  },
];
