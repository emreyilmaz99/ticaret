import React from 'react';
import { 
  FaMobileAlt, FaLaptop, FaTv, FaCamera, FaHeadphones, 
  FaTshirt, FaUserTie, FaChild, FaShoePrints, 
  FaCouch, FaBed, FaLightbulb, FaBlender,
  FaAppleAlt, FaCoffee, FaBroom,
  FaSprayCan, FaMagic, FaPumpSoap,
  FaRunning, FaMountain, FaBicycle, FaFutbol
} from 'react-icons/fa';

export const categories = [
  {
    id: 'elektronik',
    title: 'Elektronik',
    icon: <FaMobileAlt />,
    subcategories: [
      {
        title: 'Telefon & Aksesuarlar',
        items: [
          'Cep Telefonları',
          'Apple',
          'Samsung',
          'Xiaomi',
          'Huawei',
          'Telefon Kılıfları',
          'Şarj Aletleri',
          'Powerbank'
        ]
      },
      {
        title: 'Bilgisayar & Tablet',
        items: [
          'Dizüstü Bilgisayar',
          'Masaüstü Bilgisayar',
          'Tabletler',
          'Oyuncu Bilgisayarları',
          'Monitörler',
          'Klavye & Mouse',
          'Yazıcılar'
        ]
      },
      {
        title: 'TV & Görüntü',
        items: [
          'Televizyonlar',
          'Samsung TV',
          'LG TV',
          'Sony TV',
          'Projeksiyon Sistemleri',
          'Uydu Alıcıları',
          'Medya Oynatıcılar'
        ]
      },
      {
        title: 'Foto & Kamera',
        items: [
          'Dijital Fotoğraf Makineleri',
          'Aksiyon Kameraları',
          'Drone',
          'Güvenlik Kameraları',
          'Tripodlar',
          'Lensler'
        ]
      }
    ]
  },
  {
    id: 'moda',
    title: 'Moda',
    icon: <FaTshirt />,
    subcategories: [
      {
        title: 'Kadın Giyim',
        items: [
          'Elbise',
          'Tişört & Bluz',
          'Pantolon & Jean',
          'Ceket & Mont',
          'Etek',
          'İç Giyim',
          'Plaj Giyim'
        ]
      },
      {
        title: 'Erkek Giyim',
        items: [
          'Tişört',
          'Gömlek',
          'Pantolon & Jean',
          'Takım Elbise',
          'Ceket & Mont',
          'Sweatshirt',
          'İç Giyim'
        ]
      },
      {
        title: 'Ayakkabı & Çanta',
        items: [
          'Kadın Ayakkabı',
          'Erkek Ayakkabı',
          'Spor Ayakkabı',
          'Bot & Çizme',
          'Omuz Çantası',
          'Sırt Çantası',
          'Cüzdan'
        ]
      },
      {
        title: 'Saat & Aksesuar',
        items: [
          'Kol Saatleri',
          'Güneş Gözlükleri',
          'Takı & Mücevher',
          'Şapka & Bere',
          'Kemer',
          'Atkı & Eldiven'
        ]
      }
    ]
  },
  {
    id: 'ev',
    title: 'Ev & Yaşam',
    icon: <FaCouch />,
    subcategories: [
      {
        title: 'Mobilya',
        items: [
          'Oturma Grupları',
          'Yatak Odası',
          'Yemek Odası',
          'Çalışma Odası',
          'Genç Odası',
          'Bahçe Mobilyası',
          'TV Ünitesi'
        ]
      },
      {
        title: 'Ev Tekstili',
        items: [
          'Nevresim Takımları',
          'Yatak Örtüsü',
          'Yorgan & Yastık',
          'Halı & Kilim',
          'Perde',
          'Havlu & Bornoz'
        ]
      },
      {
        title: 'Mutfak Gereçleri',
        items: [
          'Tencere & Tava Setleri',
          'Yemek Takımları',
          'Çatal Kaşık Bıçak',
          'Bardak & Kadeh',
          'Saklama Kapları',
          'Mutfak Gereçleri'
        ]
      },
      {
        title: 'Aydınlatma & Dekor',
        items: [
          'Avize & Sarkıt',
          'Lambader',
          'Masa Lambası',
          'Tablo & Çerçeve',
          'Ayna',
          'Vazo & Saksı',
          'Mum & Mumluk'
        ]
      }
    ]
  },
  {
    id: 'supermarket',
    title: 'Süpermarket',
    icon: <FaAppleAlt />,
    subcategories: [
      {
        title: 'Gıda Ürünleri',
        items: [
          'Bakliyat & Makarna',
          'Sıvı Yağlar',
          'Kahvaltılık',
          'Atıştırmalık',
          'Konserve & Sos',
          'Baharat',
          'Unlu Mamüller'
        ]
      },
      {
        title: 'İçecekler',
        items: [
          'Çay & Kahve',
          'Su & Soda',
          'Meyve Suyu',
          'Gazlı İçecekler',
          'Enerji İçecekleri',
          'Bitki Çayları'
        ]
      },
      {
        title: 'Temizlik',
        items: [
          'Çamaşır Yıkama',
          'Bulaşık Yıkama',
          'Ev Temizliği',
          'Kağıt Ürünleri',
          'Oda Kokusu',
          'Böcek İlaçları'
        ]
      },
      {
        title: 'Bebek Bakım',
        items: [
          'Bebek Bezi',
          'Islak Mendil',
          'Bebek Maması',
          'Bebek Şampuanı',
          'Biberon & Emzik'
        ]
      }
    ]
  },
  {
    id: 'kozmetik',
    title: 'Kozmetik',
    icon: <FaSprayCan />,
    subcategories: [
      {
        title: 'Parfüm & Deodorant',
        items: [
          'Kadın Parfüm',
          'Erkek Parfüm',
          'Deodorant & Roll-on',
          'Vücut Spreyi',
          'Parfüm Setleri'
        ]
      },
      {
        title: 'Cilt Bakımı',
        items: [
          'Yüz Bakımı',
          'Vücut Bakımı',
          'Güneş Ürünleri',
          'Maskeler',
          'Serumlar',
          'Nemlendiriciler'
        ]
      },
      {
        title: 'Makyaj',
        items: [
          'Yüz Makyajı',
          'Göz Makyajı',
          'Dudak Makyajı',
          'Makyaj Setleri',
          'Makyaj Fırçaları',
          'Oje & Aseton'
        ]
      },
      {
        title: 'Saç Bakımı',
        items: [
          'Şampuan',
          'Saç Kremi',
          'Saç Maskesi',
          'Saç Boyası',
          'Saç Şekillendirici',
          'Tarak & Fırça'
        ]
      }
    ]
  },
  {
    id: 'spor',
    title: 'Spor & Outdoor',
    icon: <FaRunning />,
    subcategories: [
      {
        title: 'Spor Giyim',
        items: [
          'Eşofman Takımı',
          'Spor Tişört',
          'Tayt',
          'Şort',
          'Spor Sütyeni',
          'Forma'
        ]
      },
      {
        title: 'Spor Ayakkabı',
        items: [
          'Koşu Ayakkabısı',
          'Yürüyüş Ayakkabısı',
          'Futbol Ayakkabısı',
          'Basketbol Ayakkabısı',
          'Outdoor Ayakkabı'
        ]
      },
      {
        title: 'Kamp & Outdoor',
        items: [
          'Çadır',
          'Uyku Tulumu',
          'Kamp Sandalyesi',
          'Kamp Mutfağı',
          'Fener & Aydınlatma',
          'Termos'
        ]
      },
      {
        title: 'Spor Ekipmanları',
        items: [
          'Fitness Aletleri',
          'Pilates & Yoga',
          'Ağırlık & Dambıl',
          'Bisiklet',
          'Paten & Kaykay',
          'Raket Sporları'
        ]
      }
    ]
  }
];
