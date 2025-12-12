import { FaHome, FaBox, FaShoppingBag, FaCog, FaWallet, FaTags, FaTruck, FaGift, FaStar } from 'react-icons/fa';

export const MENU_ITEMS = [
  {
    title: 'Genel Bakış',
    items: [
      { path: '/vendor/dashboard', label: 'Özet', icon: FaHome }
    ]
  },
  {
    title: 'Mağaza Yönetimi',
    items: [
      { path: '/vendor/products', label: 'Ürünlerim', icon: FaBox },
      { path: '/vendor/categories', label: 'Kategoriler', icon: FaTags },
      { path: '/vendor/orders', label: 'Siparişler', icon: FaShoppingBag },
      { path: '/vendor/reviews', label: 'Değerlendirmeler', icon: FaStar },
      { path: '/vendor/finance', label: 'Finans & Ödemeler', icon: FaWallet },
      { path: '/vendor/shipping', label: 'Kargo Ayarları', icon: FaTruck },
      { path: '/vendor/promotions', label: 'Promosyonlar', icon: FaGift },
      { path: '/vendor/settings', label: 'Mağaza Ayarları', icon: FaCog }
    ]
  }
];
