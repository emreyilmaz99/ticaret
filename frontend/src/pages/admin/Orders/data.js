// src/pages/admin/Orders/data.js

// Admin panelinde sipariş listesi (Satıcı bilgileri içerir)
export const MOCK_ORDERS = [
  {
    id: '#SIP-9482',
    vendor: { name: 'TeknoStore', rating: 4.8 }, // Admin için kritik veri
    customer: { 
      name: 'Ahmet Yılmaz', 
      email: 'ahmet@example.com', 
      phone: '+90 555 111 22 33',
      avatar: 'https://i.pravatar.cc/150?u=1' 
    },
    shippingAddress: 'Cumhuriyet Mah. Atatürk Cad. No:123 D:5, Çankaya / Ankara',
    date: '10 Ara 2024, 14:30',
    amount: 1250.00,
    commission: 125.00, // Platform kazancı
    paymentMethod: 'Kredi Kartı',
    status: 'pending',
    items: 3,
    products: [
      { name: 'Sony WH-1000XM5 Kulaklık', variant: 'Siyah', price: 950.00, qty: 1, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100' },
      { name: 'Type-C Hızlı Şarj Kablosu', variant: '2 Metre', price: 150.00, qty: 1, image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=100' },
      { name: 'Telefon Standı', variant: 'Alüminyum', price: 150.00, qty: 1, image: 'https://images.unsplash.com/photo-1586775490184-b7913be163a9?w=100' },
    ]
  },
  {
    id: '#SIP-9481',
    vendor: { name: 'Moda Dünyası', rating: 4.2 },
    customer: { 
      name: 'Ayşe Demir', 
      email: 'ayse@example.com', 
      phone: '+90 532 222 33 44',
      avatar: 'https://i.pravatar.cc/150?u=2' 
    },
    shippingAddress: 'Güzelyalı Mah. Sahil Yolu Sk. No:4, Karşıyaka / İzmir',
    date: '10 Ara 2024, 11:15',
    amount: 3450.50,
    commission: 345.05,
    paymentMethod: 'Havale',
    status: 'processing',
    items: 1,
    products: [
      { name: 'Apple Watch Series 7', variant: 'Gece Yarısı', price: 3450.50, qty: 1, image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=100' },
    ]
  },
  {
    id: '#SIP-9480',
    vendor: { name: 'Evim Şahane', rating: 4.9 },
    customer: { 
      name: 'Mehmet Kaya', 
      email: 'mehmet@example.com', 
      phone: '+90 544 333 44 55',
      avatar: 'https://i.pravatar.cc/150?u=3' 
    },
    shippingAddress: 'Levent Mah. İş Kuleleri, Beşiktaş / İstanbul',
    date: '09 Ara 2024, 18:45',
    amount: 890.00,
    commission: 89.00,
    paymentMethod: 'Kredi Kartı',
    status: 'shipped',
    items: 2,
    products: [
      { name: 'Logitech MX Master 3', variant: 'Gri', price: 700.00, qty: 1, image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=100' },
      { name: 'Mouse Pad XL', variant: 'Siyah', price: 190.00, qty: 1, image: 'https://images.unsplash.com/photo-1615663245857-acda5b2b1588?w=100' },
    ]
  },
  {
    id: '#SIP-9479',
    vendor: { name: 'TeknoStore', rating: 4.8 },
    customer: { 
      name: 'Zeynep Çelik', 
      email: 'zeynep@example.com', 
      phone: '+90 555 444 55 66',
      avatar: 'https://i.pravatar.cc/150?u=4' 
    },
    shippingAddress: 'Yıldız Mah. 15. Cadde No:8, Çankaya / Ankara',
    date: '09 Ara 2024, 09:20',
    amount: 150.00,
    commission: 15.00,
    paymentMethod: 'Kapıda Ödeme',
    status: 'delivered',
    items: 1,
    products: [
      { name: 'Termos Bardak', variant: 'Çelik', price: 150.00, qty: 1, image: 'https://images.unsplash.com/photo-1517292987719-0369a794ec0f?w=100' },
    ]
  },
  {
    id: '#SIP-9478',
    vendor: { name: 'Sporcu Pazarı', rating: 4.5 },
    customer: { 
      name: 'Caner Erkin', 
      email: 'caner@example.com', 
      phone: '+90 533 555 66 77',
      avatar: 'https://i.pravatar.cc/150?u=5' 
    },
    shippingAddress: 'Bağdat Caddesi No:400, Kadıköy / İstanbul',
    date: '08 Ara 2024, 16:00',
    amount: 4500.00,
    commission: 0.00,
    paymentMethod: 'Kredi Kartı',
    status: 'cancelled',
    items: 4,
    products: [
      { name: 'Ofis Koltuğu', variant: 'Ergonomik', price: 4500.00, qty: 1, image: 'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?w=100' },
    ]
  },
];

// Admin Panel İstatistikleri (Hatanın sebebi bu ismin eksik olmasıydı)
export const KPI_STATS = [
  { label: 'Toplam Sipariş', value: '5,420', change: '+18%', icon: 'FaShoppingBag', color: 'blue' },
  { label: 'Platform Kazancı', value: '₺124,500', change: '+12%', icon: 'FaWallet', color: 'green' }, // Admin özel
  { label: 'Aktif Satıcılar', value: '342', change: '+5%', icon: 'FaStore', color: 'indigo' },
  { label: 'İade/İptal Oranı', value: '%2.4', change: '-0.5%', icon: 'FaUndo', color: 'red' },
];