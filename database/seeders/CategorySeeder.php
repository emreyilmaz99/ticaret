<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;
use Illuminate\Support\Str;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Elektronik',
                'icon' => 'FaMobileAlt',
                'description' => 'Elektronik ürünler, telefonlar, bilgisayarlar ve aksesuarlar',
                'children' => [
                    ['name' => 'Cep Telefonları', 'icon' => 'FaMobile', 'children' => [
                        ['name' => 'Apple', 'icon' => 'FaApple'],
                        ['name' => 'Samsung', 'icon' => 'FaMobileAlt'],
                        ['name' => 'Xiaomi', 'icon' => 'FaMobileAlt'],
                        ['name' => 'Huawei', 'icon' => 'FaMobileAlt'],
                        ['name' => 'Diğer Markalar', 'icon' => 'FaMobileAlt'],
                    ]],
                    ['name' => 'Bilgisayar', 'icon' => 'FaLaptop', 'children' => [
                        ['name' => 'Laptop', 'icon' => 'FaLaptop'],
                        ['name' => 'Masaüstü Bilgisayar', 'icon' => 'FaDesktop'],
                        ['name' => 'Tablet', 'icon' => 'FaTabletAlt'],
                        ['name' => 'Bilgisayar Parçaları', 'icon' => 'FaMicrochip'],
                    ]],
                    ['name' => 'TV & Ses Sistemleri', 'icon' => 'FaTv', 'children' => [
                        ['name' => 'Televizyon', 'icon' => 'FaTv'],
                        ['name' => 'Ses Sistemleri', 'icon' => 'FaVolumeUp'],
                        ['name' => 'Kulaklık', 'icon' => 'FaHeadphones'],
                        ['name' => 'Hoparlör', 'icon' => 'FaVolumeUp'],
                    ]],
                    ['name' => 'Kamera & Fotoğraf', 'icon' => 'FaCamera', 'children' => [
                        ['name' => 'DSLR Kameralar', 'icon' => 'FaCamera'],
                        ['name' => 'Aynasız Kameralar', 'icon' => 'FaCameraRetro'],
                        ['name' => 'Aksiyon Kameralar', 'icon' => 'FaVideo'],
                        ['name' => 'Kamera Aksesuarları', 'icon' => 'FaCameraRetro'],
                    ]],
                    ['name' => 'Oyun & Konsol', 'icon' => 'FaGamepad', 'children' => [
                        ['name' => 'PlayStation', 'icon' => 'FaPlaystation'],
                        ['name' => 'Xbox', 'icon' => 'FaXbox'],
                        ['name' => 'Nintendo', 'icon' => 'FaGamepad'],
                        ['name' => 'Oyun Aksesuarları', 'icon' => 'FaGamepad'],
                    ]],
                ],
            ],
            [
                'name' => 'Moda',
                'icon' => 'FaTshirt',
                'description' => 'Giyim, ayakkabı ve aksesuar ürünleri',
                'children' => [
                    ['name' => 'Kadın Giyim', 'icon' => 'FaFemale', 'children' => [
                        ['name' => 'Elbise', 'icon' => 'FaFemale'],
                        ['name' => 'Bluz & Gömlek', 'icon' => 'FaTshirt'],
                        ['name' => 'Pantolon', 'icon' => 'FaSocks'],
                        ['name' => 'Etek', 'icon' => 'FaFemale'],
                        ['name' => 'Ceket & Mont', 'icon' => 'FaTshirt'],
                    ]],
                    ['name' => 'Erkek Giyim', 'icon' => 'FaMale', 'children' => [
                        ['name' => 'T-Shirt', 'icon' => 'FaTshirt'],
                        ['name' => 'Gömlek', 'icon' => 'FaTshirt'],
                        ['name' => 'Pantolon', 'icon' => 'FaSocks'],
                        ['name' => 'Takım Elbise', 'icon' => 'FaMale'],
                        ['name' => 'Ceket & Mont', 'icon' => 'FaTshirt'],
                    ]],
                    ['name' => 'Çocuk Giyim', 'icon' => 'FaChild', 'children' => [
                        ['name' => 'Kız Çocuk', 'icon' => 'FaFemale'],
                        ['name' => 'Erkek Çocuk', 'icon' => 'FaMale'],
                        ['name' => 'Bebek', 'icon' => 'FaBaby'],
                    ]],
                    ['name' => 'Ayakkabı', 'icon' => 'FaShoePrints', 'children' => [
                        ['name' => 'Kadın Ayakkabı', 'icon' => 'FaShoePrints'],
                        ['name' => 'Erkek Ayakkabı', 'icon' => 'FaShoePrints'],
                        ['name' => 'Çocuk Ayakkabı', 'icon' => 'FaShoePrints'],
                        ['name' => 'Spor Ayakkabı', 'icon' => 'FaRunning'],
                    ]],
                    ['name' => 'Aksesuar', 'icon' => 'FaGem', 'children' => [
                        ['name' => 'Çanta', 'icon' => 'FaShoppingBag'],
                        ['name' => 'Saat', 'icon' => 'FaClock'],
                        ['name' => 'Takı', 'icon' => 'FaGem'],
                        ['name' => 'Gözlük', 'icon' => 'FaGlasses'],
                    ]],
                ],
            ],
            [
                'name' => 'Ev & Yaşam',
                'icon' => 'FaHome',
                'description' => 'Ev dekorasyonu, mobilya ve yaşam ürünleri',
                'children' => [
                    ['name' => 'Mobilya', 'icon' => 'FaCouch', 'children' => [
                        ['name' => 'Oturma Grubu', 'icon' => 'FaCouch'],
                        ['name' => 'Yatak Odası', 'icon' => 'FaBed'],
                        ['name' => 'Yemek Odası', 'icon' => 'FaChair'],
                        ['name' => 'Çalışma Masası', 'icon' => 'FaChair'],
                        ['name' => 'Dolap & Gardırop', 'icon' => 'FaArchive'],
                    ]],
                    ['name' => 'Dekorasyon', 'icon' => 'FaPalette', 'children' => [
                        ['name' => 'Ev Tekstili', 'icon' => 'FaBed'],
                        ['name' => 'Aydınlatma', 'icon' => 'FaLightbulb'],
                        ['name' => 'Duvar Dekorasyonu', 'icon' => 'FaImage'],
                        ['name' => 'Halı & Kilim', 'icon' => 'FaSquare'],
                    ]],
                    ['name' => 'Mutfak', 'icon' => 'FaUtensils', 'children' => [
                        ['name' => 'Tencere & Tava', 'icon' => 'FaUtensils'],
                        ['name' => 'Sofra Takımı', 'icon' => 'FaGlassMartini'],
                        ['name' => 'Mutfak Aletleri', 'icon' => 'FaBlender'],
                        ['name' => 'Saklama Kabı', 'icon' => 'FaBox'],
                    ]],
                    ['name' => 'Banyo', 'icon' => 'FaBath', 'children' => [
                        ['name' => 'Havlu & Bornoz', 'icon' => 'FaBath'],
                        ['name' => 'Banyo Aksesuarları', 'icon' => 'FaSoap'],
                        ['name' => 'Duş Kabini', 'icon' => 'FaShower'],
                    ]],
                    ['name' => 'Bahçe', 'icon' => 'FaLeaf', 'children' => [
                        ['name' => 'Bahçe Mobilyası', 'icon' => 'FaChair'],
                        ['name' => 'Bahçe Aletleri', 'icon' => 'FaSeedling'],
                        ['name' => 'Bitki & Çiçek', 'icon' => 'FaLeaf'],
                    ]],
                ],
            ],
            [
                'name' => 'Spor & Outdoor',
                'icon' => 'FaDumbbell',
                'description' => 'Spor ekipmanları ve outdoor ürünleri',
                'children' => [
                    ['name' => 'Fitness', 'icon' => 'FaDumbbell', 'children' => [
                        ['name' => 'Spor Aletleri', 'icon' => 'FaDumbbell'],
                        ['name' => 'Yoga & Pilates', 'icon' => 'FaSpa'],
                        ['name' => 'Koşu Bandı', 'icon' => 'FaRunning'],
                        ['name' => 'Bisiklet', 'icon' => 'FaBicycle'],
                    ]],
                    ['name' => 'Takım Sporları', 'icon' => 'FaFutbol', 'children' => [
                        ['name' => 'Futbol', 'icon' => 'FaFutbol'],
                        ['name' => 'Basketbol', 'icon' => 'FaBasketballBall'],
                        ['name' => 'Voleybol', 'icon' => 'FaVolleyballBall'],
                        ['name' => 'Tenis', 'icon' => 'FaTableTennis'],
                    ]],
                    ['name' => 'Kamp & Outdoor', 'icon' => 'FaCampground', 'children' => [
                        ['name' => 'Çadır', 'icon' => 'FaCampground'],
                        ['name' => 'Uyku Tulumu', 'icon' => 'FaBed'],
                        ['name' => 'Kamp Malzemeleri', 'icon' => 'FaFire'],
                        ['name' => 'Tırmanış', 'icon' => 'FaMountain'],
                    ]],
                    ['name' => 'Su Sporları', 'icon' => 'FaSwimmer', 'children' => [
                        ['name' => 'Yüzme', 'icon' => 'FaSwimmer'],
                        ['name' => 'Dalış', 'icon' => 'FaWater'],
                        ['name' => 'Sörf', 'icon' => 'FaWater'],
                    ]],
                ],
            ],
            [
                'name' => 'Kozmetik & Kişisel Bakım',
                'icon' => 'FaSpa',
                'description' => 'Güzellik ve kişisel bakım ürünleri',
                'children' => [
                    ['name' => 'Makyaj', 'icon' => 'FaPaintBrush', 'children' => [
                        ['name' => 'Yüz Makyajı', 'icon' => 'FaPaintBrush'],
                        ['name' => 'Göz Makyajı', 'icon' => 'FaEye'],
                        ['name' => 'Dudak Makyajı', 'icon' => 'FaKissWinkHeart'],
                        ['name' => 'Tırnak Bakımı', 'icon' => 'FaHandSparkles'],
                    ]],
                    ['name' => 'Cilt Bakımı', 'icon' => 'FaSpa', 'children' => [
                        ['name' => 'Temizleyici', 'icon' => 'FaSoap'],
                        ['name' => 'Nemlendirici', 'icon' => 'FaTint'],
                        ['name' => 'Güneş Koruma', 'icon' => 'FaSun'],
                        ['name' => 'Anti-Aging', 'icon' => 'FaSpa'],
                    ]],
                    ['name' => 'Saç Bakımı', 'icon' => 'FaCut', 'children' => [
                        ['name' => 'Şampuan', 'icon' => 'FaTint'],
                        ['name' => 'Saç Kremi', 'icon' => 'FaPumpSoap'],
                        ['name' => 'Saç Şekillendirici', 'icon' => 'FaCut'],
                        ['name' => 'Saç Boyası', 'icon' => 'FaPalette'],
                    ]],
                    ['name' => 'Parfüm', 'icon' => 'FaSprayCan', 'children' => [
                        ['name' => 'Kadın Parfüm', 'icon' => 'FaSprayCan'],
                        ['name' => 'Erkek Parfüm', 'icon' => 'FaSprayCan'],
                        ['name' => 'Unisex Parfüm', 'icon' => 'FaSprayCan'],
                    ]],
                ],
            ],
            [
                'name' => 'Anne & Bebek',
                'icon' => 'FaBaby',
                'description' => 'Anne ve bebek ürünleri',
                'children' => [
                    ['name' => 'Bebek Bakım', 'icon' => 'FaBaby', 'children' => [
                        ['name' => 'Bebek Bezi', 'icon' => 'FaBaby'],
                        ['name' => 'Bebek Bakım Ürünleri', 'icon' => 'FaPumpSoap'],
                        ['name' => 'Biberon & Emzik', 'icon' => 'FaBaby'],
                    ]],
                    ['name' => 'Bebek Giyim', 'icon' => 'FaTshirt', 'children' => [
                        ['name' => 'Body & Tulum', 'icon' => 'FaTshirt'],
                        ['name' => 'Bebek Ayakkabı', 'icon' => 'FaShoePrints'],
                        ['name' => 'Bebek Şapka & Eldiven', 'icon' => 'FaHatWizard'],
                    ]],
                    ['name' => 'Bebek Odası', 'icon' => 'FaBed', 'children' => [
                        ['name' => 'Bebek Yatağı', 'icon' => 'FaBed'],
                        ['name' => 'Bebek Arabası', 'icon' => 'FaBaby'],
                        ['name' => 'Mama Sandalyesi', 'icon' => 'FaChair'],
                        ['name' => 'Oto Koltuğu', 'icon' => 'FaCar'],
                    ]],
                    ['name' => 'Oyuncak', 'icon' => 'FaPuzzlePiece', 'children' => [
                        ['name' => 'Bebek Oyuncakları', 'icon' => 'FaBaby'],
                        ['name' => 'Eğitici Oyuncaklar', 'icon' => 'FaPuzzlePiece'],
                        ['name' => 'Peluş Oyuncaklar', 'icon' => 'FaDog'],
                    ]],
                ],
            ],
            [
                'name' => 'Kitap & Hobi',
                'icon' => 'FaBook',
                'description' => 'Kitaplar, müzik ve hobi malzemeleri',
                'children' => [
                    ['name' => 'Kitap', 'icon' => 'FaBook', 'children' => [
                        ['name' => 'Edebiyat', 'icon' => 'FaBook'],
                        ['name' => 'Kişisel Gelişim', 'icon' => 'FaBrain'],
                        ['name' => 'Çocuk Kitapları', 'icon' => 'FaBookOpen'],
                        ['name' => 'Akademik', 'icon' => 'FaGraduationCap'],
                    ]],
                    ['name' => 'Müzik', 'icon' => 'FaMusic', 'children' => [
                        ['name' => 'Gitar', 'icon' => 'FaGuitar'],
                        ['name' => 'Piyano & Klavye', 'icon' => 'FaMusic'],
                        ['name' => 'Davul & Perküsyon', 'icon' => 'FaDrum'],
                        ['name' => 'Üflemeli Çalgılar', 'icon' => 'FaMusic'],
                    ]],
                    ['name' => 'Kırtasiye', 'icon' => 'FaPen', 'children' => [
                        ['name' => 'Yazı Gereçleri', 'icon' => 'FaPen'],
                        ['name' => 'Defter & Not', 'icon' => 'FaBook'],
                        ['name' => 'Ofis Malzemeleri', 'icon' => 'FaPaperclip'],
                    ]],
                    ['name' => 'El Sanatları', 'icon' => 'FaPalette', 'children' => [
                        ['name' => 'Resim Malzemeleri', 'icon' => 'FaPaintBrush'],
                        ['name' => 'Örgü & Dikiş', 'icon' => 'FaCut'],
                        ['name' => 'Maket & Model', 'icon' => 'FaCubes'],
                    ]],
                ],
            ],
            [
                'name' => 'Otomotiv',
                'icon' => 'FaCar',
                'description' => 'Araç aksesuarları ve yedek parçalar',
                'children' => [
                    ['name' => 'Araç Aksesuarları', 'icon' => 'FaCar', 'children' => [
                        ['name' => 'İç Aksesuar', 'icon' => 'FaCar'],
                        ['name' => 'Dış Aksesuar', 'icon' => 'FaCar'],
                        ['name' => 'Araç Elektroniği', 'icon' => 'FaMicrochip'],
                        ['name' => 'Araç Bakım', 'icon' => 'FaOilCan'],
                    ]],
                    ['name' => 'Yedek Parça', 'icon' => 'FaCogs', 'children' => [
                        ['name' => 'Motor Parçaları', 'icon' => 'FaCogs'],
                        ['name' => 'Fren Sistemi', 'icon' => 'FaCogs'],
                        ['name' => 'Süspansiyon', 'icon' => 'FaCogs'],
                        ['name' => 'Aydınlatma', 'icon' => 'FaLightbulb'],
                    ]],
                    ['name' => 'Lastik & Jant', 'icon' => 'FaCircle', 'children' => [
                        ['name' => 'Yaz Lastiği', 'icon' => 'FaCircle'],
                        ['name' => 'Kış Lastiği', 'icon' => 'FaSnowflake'],
                        ['name' => 'Jant', 'icon' => 'FaCircleNotch'],
                    ]],
                    ['name' => 'Motosiklet', 'icon' => 'FaMotorcycle', 'children' => [
                        ['name' => 'Motosiklet Aksesuarları', 'icon' => 'FaMotorcycle'],
                        ['name' => 'Koruyucu Ekipman', 'icon' => 'FaHardHat'],
                    ]],
                ],
            ],
            [
                'name' => 'Pet Shop',
                'icon' => 'FaPaw',
                'description' => 'Evcil hayvan ürünleri',
                'children' => [
                    ['name' => 'Köpek', 'icon' => 'FaDog', 'children' => [
                        ['name' => 'Köpek Maması', 'icon' => 'FaBone'],
                        ['name' => 'Köpek Aksesuarları', 'icon' => 'FaDog'],
                        ['name' => 'Köpek Sağlık', 'icon' => 'FaFirstAid'],
                    ]],
                    ['name' => 'Kedi', 'icon' => 'FaCat', 'children' => [
                        ['name' => 'Kedi Maması', 'icon' => 'FaFish'],
                        ['name' => 'Kedi Aksesuarları', 'icon' => 'FaCat'],
                        ['name' => 'Kedi Kumu', 'icon' => 'FaBox'],
                    ]],
                    ['name' => 'Kuş', 'icon' => 'FaDove', 'children' => [
                        ['name' => 'Kuş Yemi', 'icon' => 'FaSeedling'],
                        ['name' => 'Kuş Kafesi', 'icon' => 'FaDove'],
                    ]],
                    ['name' => 'Akvaryum', 'icon' => 'FaFish', 'children' => [
                        ['name' => 'Balık Yemi', 'icon' => 'FaFish'],
                        ['name' => 'Akvaryum Ekipmanları', 'icon' => 'FaWater'],
                    ]],
                ],
            ],
            [
                'name' => 'Süpermarket',
                'icon' => 'FaShoppingCart',
                'description' => 'Gıda ve günlük tüketim ürünleri',
                'children' => [
                    ['name' => 'Gıda', 'icon' => 'FaUtensils', 'children' => [
                        ['name' => 'Temel Gıda', 'icon' => 'FaBreadSlice'],
                        ['name' => 'Atıştırmalık', 'icon' => 'FaCookie'],
                        ['name' => 'İçecekler', 'icon' => 'FaCoffee'],
                        ['name' => 'Organik Ürünler', 'icon' => 'FaLeaf'],
                    ]],
                    ['name' => 'Temizlik', 'icon' => 'FaBroom', 'children' => [
                        ['name' => 'Ev Temizliği', 'icon' => 'FaBroom'],
                        ['name' => 'Çamaşır', 'icon' => 'FaTshirt'],
                        ['name' => 'Bulaşık', 'icon' => 'FaUtensils'],
                    ]],
                    ['name' => 'Kağıt Ürünler', 'icon' => 'FaToiletPaper', 'children' => [
                        ['name' => 'Tuvalet Kağıdı', 'icon' => 'FaToiletPaper'],
                        ['name' => 'Kağıt Havlu', 'icon' => 'FaScroll'],
                        ['name' => 'Peçete', 'icon' => 'FaScroll'],
                    ]],
                ],
            ],
        ];

        $sortOrder = 0;
        foreach ($categories as $categoryData) {
            $this->createCategory($categoryData, null, $sortOrder++);
        }
    }

    private function createCategory(array $data, ?int $parentId, int $sortOrder): void
    {
        $children = $data['children'] ?? [];
        unset($data['children']);

        $slug = Str::slug($data['name']);
        $originalSlug = $slug;
        $counter = 1;
        
        while (Category::where('slug', $slug)->exists()) {
            $slug = $originalSlug . '-' . $counter;
            $counter++;
        }

        $category = Category::create([
            'parent_id' => $parentId,
            'name' => $data['name'],
            'slug' => $slug,
            'icon' => $data['icon'] ?? null,
            'description' => $data['description'] ?? null,
            'sort_order' => $sortOrder,
            'is_active' => true,
        ]);

        $childSortOrder = 0;
        foreach ($children as $childData) {
            $this->createCategory($childData, $category->id, $childSortOrder++);
        }
    }
}
