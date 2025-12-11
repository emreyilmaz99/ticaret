<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\ProductPhoto;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $vendorId = 4;
        $unitId = 1; // Adet

        $products = [
            // iPhone 15 Pro Max
            [
                'category_id' => 409,
                'name' => 'iPhone 15 Pro Max 256GB',
                'short_description' => 'Apple iPhone 15 Pro Max, 256GB depolama, Titanium kasa',
                'description' => '<p>Apple iPhone 15 Pro Max, guclu A17 Pro cip ile donatilmis en gelismis iPhone modelidir.</p><ul><li>6.7 inc Super Retina XDR ekran</li><li>A17 Pro cip</li><li>48MP Pro kamera sistemi</li><li>USB-C baglanti</li><li>Titanium tasarim</li></ul>',
                'type' => 'simple',
                'status' => 'active',
                'is_featured' => true,
                'tax_class' => 'standard',
                'variants' => [
                    ['title' => 'Dogal Titanium', 'price' => 74999.00, 'stock' => 25, 'weight' => 0.221],
                    ['title' => 'Mavi Titanium', 'price' => 74999.00, 'stock' => 15, 'weight' => 0.221],
                    ['title' => 'Siyah Titanium', 'price' => 74999.00, 'stock' => 30, 'weight' => 0.221],
                ],
                'photos' => [
                    'https://picsum.photos/seed/iphone15pro1/800/800',
                    'https://picsum.photos/seed/iphone15pro2/800/800',
                ],
            ],
            // iPhone 14
            [
                'category_id' => 409,
                'name' => 'iPhone 14 128GB',
                'short_description' => 'Apple iPhone 14, 128GB depolama alani',
                'description' => '<p>iPhone 14, A15 Bionic cip ile guclendirilmis akilli telefon.</p>',
                'type' => 'simple',
                'status' => 'active',
                'is_featured' => false,
                'tax_class' => 'standard',
                'variants' => [
                    ['title' => 'Mavi', 'price' => 47999.00, 'stock' => 40, 'weight' => 0.172],
                    ['title' => 'Mor', 'price' => 47999.00, 'stock' => 35, 'weight' => 0.172],
                ],
                'photos' => [
                    'https://picsum.photos/seed/iphone141/800/800',
                ],
            ],
            // Samsung S24 Ultra
            [
                'category_id' => 410,
                'name' => 'Samsung Galaxy S24 Ultra 512GB',
                'short_description' => 'Samsung Galaxy S24 Ultra, 512GB, S Pen destekli',
                'description' => '<p>Samsung Galaxy S24 Ultra, yapay zeka destekli Galaxy AI ozellikleri.</p>',
                'type' => 'simple',
                'status' => 'active',
                'is_featured' => true,
                'tax_class' => 'standard',
                'variants' => [
                    ['title' => 'Titanium Siyah', 'price' => 69999.00, 'stock' => 20, 'weight' => 0.232],
                    ['title' => 'Titanium Gri', 'price' => 69999.00, 'stock' => 25, 'weight' => 0.232],
                ],
                'photos' => [
                    'https://picsum.photos/seed/s24ultra1/800/800',
                    'https://picsum.photos/seed/s24ultra2/800/800',
                ],
            ],
            // Samsung A55
            [
                'category_id' => 410,
                'name' => 'Samsung Galaxy A55 5G 256GB',
                'short_description' => 'Samsung Galaxy A55 5G, 256GB depolama',
                'description' => '<p>Galaxy A55 5G, orta segment fiyatiyla premium ozellikler sunar.</p>',
                'type' => 'simple',
                'status' => 'active',
                'is_featured' => false,
                'tax_class' => 'standard',
                'variants' => [
                    ['title' => 'Acik Mavi', 'price' => 18999.00, 'stock' => 60, 'weight' => 0.213],
                    ['title' => 'Lacivert', 'price' => 18999.00, 'stock' => 45, 'weight' => 0.213],
                ],
                'photos' => [
                    'https://picsum.photos/seed/a551/800/800',
                ],
            ],
            // Xiaomi 14 Ultra
            [
                'category_id' => 411,
                'name' => 'Xiaomi 14 Ultra 512GB',
                'short_description' => 'Xiaomi 14 Ultra, Leica kamera sistemi',
                'description' => '<p>Xiaomi 14 Ultra, Leica ile ortaklasa gelistirilen profesyonel kamera sistemi.</p>',
                'type' => 'simple',
                'status' => 'active',
                'is_featured' => true,
                'tax_class' => 'standard',
                'variants' => [
                    ['title' => 'Siyah', 'price' => 54999.00, 'stock' => 30, 'weight' => 0.220],
                    ['title' => 'Beyaz', 'price' => 54999.00, 'stock' => 25, 'weight' => 0.220],
                ],
                'photos' => [
                    'https://picsum.photos/seed/xiaomi14u1/800/800',
                ],
            ],
            // Redmi Note 13 Pro+
            [
                'category_id' => 411,
                'name' => 'Xiaomi Redmi Note 13 Pro+ 256GB',
                'short_description' => 'Redmi Note 13 Pro+, 200MP kamera',
                'description' => '<p>Redmi Note 13 Pro+, uygun fiyatiyla 200MP kamera sunar.</p>',
                'type' => 'simple',
                'status' => 'active',
                'is_featured' => false,
                'tax_class' => 'standard',
                'variants' => [
                    ['title' => 'Midnight Black', 'price' => 14999.00, 'stock' => 80, 'weight' => 0.204],
                    ['title' => 'Ice Blue', 'price' => 14999.00, 'stock' => 70, 'weight' => 0.204],
                ],
                'photos' => [
                    'https://picsum.photos/seed/redminote131/800/800',
                ],
            ],
            // MacBook Pro 14
            [
                'category_id' => 415,
                'name' => 'MacBook Pro 14 M3 Pro 512GB',
                'short_description' => 'Apple MacBook Pro 14 inc, M3 Pro cip',
                'description' => '<p>MacBook Pro 14 inc, M3 Pro cip ile profesyonel is akislari icin tasarlandi.</p>',
                'type' => 'simple',
                'status' => 'active',
                'is_featured' => true,
                'tax_class' => 'standard',
                'variants' => [
                    ['title' => 'Uzay Siyahi', 'price' => 89999.00, 'stock' => 12, 'weight' => 1.60],
                    ['title' => 'Gumus', 'price' => 89999.00, 'stock' => 15, 'weight' => 1.60],
                ],
                'photos' => [
                    'https://picsum.photos/seed/macbookpro141/800/800',
                    'https://picsum.photos/seed/macbookpro142/800/800',
                ],
            ],
            // ASUS ROG
            [
                'category_id' => 415,
                'name' => 'ASUS ROG Strix G16 Gaming Laptop',
                'short_description' => 'ASUS ROG Strix G16, RTX 4070, Intel i9',
                'description' => '<p>ASUS ROG Strix G16, guclu oyun performansi icin tasarlanmis gaming laptop.</p>',
                'type' => 'simple',
                'status' => 'active',
                'is_featured' => true,
                'tax_class' => 'standard',
                'variants' => [
                    ['title' => 'Eclipse Gray', 'price' => 74999.00, 'stock' => 8, 'weight' => 2.50],
                ],
                'photos' => [
                    'https://picsum.photos/seed/rogstrix1/800/800',
                ],
            ],
            // Samsung TV
            [
                'category_id' => 420,
                'name' => 'Samsung 65 Neo QLED 4K Smart TV',
                'short_description' => 'Samsung 65 inc Neo QLED 4K Akilli TV',
                'description' => '<p>Samsung Neo QLED 4K TV, Quantum Matrix teknolojisi ile ustun goruntu kalitesi.</p>',
                'type' => 'simple',
                'status' => 'active',
                'is_featured' => true,
                'tax_class' => 'standard',
                'variants' => [
                    ['title' => 'Titan Black', 'price' => 54999.00, 'stock' => 10, 'weight' => 23.5],
                ],
                'photos' => [
                    'https://picsum.photos/seed/samsungtv1/800/800',
                ],
            ],
            // LG OLED
            [
                'category_id' => 420,
                'name' => 'LG 55 OLED evo C4 4K Smart TV',
                'short_description' => 'LG 55 inc OLED evo 4K Akilli TV',
                'description' => '<p>LG OLED evo C4, sonsuz kontrast ve mukemmel siyahlar ile sinema deneyimi.</p>',
                'type' => 'simple',
                'status' => 'active',
                'is_featured' => false,
                'tax_class' => 'standard',
                'variants' => [
                    ['title' => 'Standart', 'price' => 42999.00, 'stock' => 15, 'weight' => 18.0],
                ],
                'photos' => [
                    'https://picsum.photos/seed/lgoled1/800/800',
                ],
            ],
            // PS5
            [
                'category_id' => 430,
                'name' => 'PlayStation 5 Slim Digital Edition',
                'short_description' => 'Sony PS5 Slim Digital Edition',
                'description' => '<p>PlayStation 5 Slim, daha kompakt tasarimiyla ayni guclu oyun deneyimi.</p>',
                'type' => 'simple',
                'status' => 'active',
                'is_featured' => true,
                'tax_class' => 'standard',
                'variants' => [
                    ['title' => 'Beyaz', 'price' => 17999.00, 'stock' => 25, 'weight' => 3.2],
                ],
                'photos' => [
                    'https://picsum.photos/seed/ps5slim1/800/800',
                ],
            ],
            // Xbox
            [
                'category_id' => 431,
                'name' => 'Xbox Series X 1TB',
                'short_description' => 'Microsoft Xbox Series X, 1TB SSD',
                'description' => '<p>Xbox Series X, en guclu Xbox konsolu olarak 4K oyunlari 120fps te oynatir.</p>',
                'type' => 'simple',
                'status' => 'active',
                'is_featured' => false,
                'tax_class' => 'standard',
                'variants' => [
                    ['title' => 'Siyah', 'price' => 17499.00, 'stock' => 20, 'weight' => 4.45],
                ],
                'photos' => [
                    'https://picsum.photos/seed/xboxsx1/800/800',
                ],
            ],
            // Sony A7 IV
            [
                'category_id' => 426,
                'name' => 'Sony Alpha A7 IV Full Frame Aynasiz',
                'short_description' => 'Sony A7 IV, 33MP Full Frame Aynasiz Fotograf Makinesi',
                'description' => '<p>Sony A7 IV, profesyonel fotografcilar icin gelistirilmis hibrit bir full frame aynasiz fotograf makinesi.</p>',
                'type' => 'simple',
                'status' => 'active',
                'is_featured' => true,
                'tax_class' => 'standard',
                'variants' => [
                    ['title' => 'Sadece Govde', 'price' => 69999.00, 'stock' => 8, 'weight' => 0.658],
                    ['title' => '28-70mm Kit', 'price' => 79999.00, 'stock' => 5, 'weight' => 0.950],
                ],
                'photos' => [
                    'https://picsum.photos/seed/sonya7iv1/800/800',
                ],
            ],
            // iPad Pro
            [
                'category_id' => 417,
                'name' => 'iPad Pro 12.9 M4 256GB WiFi',
                'short_description' => 'Apple iPad Pro 12.9 inc, M4 cip, WiFi',
                'description' => '<p>iPad Pro M4, en guclu iPad olup profesyoneller icin tasarlandi.</p>',
                'type' => 'simple',
                'status' => 'active',
                'is_featured' => true,
                'tax_class' => 'standard',
                'variants' => [
                    ['title' => 'Uzay Grisi', 'price' => 49999.00, 'stock' => 18, 'weight' => 0.682],
                    ['title' => 'Gumus', 'price' => 49999.00, 'stock' => 15, 'weight' => 0.682],
                ],
                'photos' => [
                    'https://picsum.photos/seed/ipadpro1/800/800',
                ],
            ],
            // Galaxy Tab S9
            [
                'category_id' => 417,
                'name' => 'Samsung Galaxy Tab S9 Ultra 512GB',
                'short_description' => 'Samsung Galaxy Tab S9 Ultra, 14.6 inc AMOLED',
                'description' => '<p>Galaxy Tab S9 Ultra, buyuk ekrani ve guclu ozellikleriyle uretkenlik odakli tablet.</p>',
                'type' => 'simple',
                'status' => 'active',
                'is_featured' => false,
                'tax_class' => 'standard',
                'variants' => [
                    ['title' => 'Grafit', 'price' => 44999.00, 'stock' => 12, 'weight' => 0.732],
                ],
                'photos' => [
                    'https://picsum.photos/seed/tabs9u1/800/800',
                ],
            ],
            // AirPods Pro
            [
                'category_id' => 422,
                'name' => 'Apple AirPods Pro 2. Nesil USB-C',
                'short_description' => 'Apple AirPods Pro (2. nesil) USB-C sarj kutusuyla',
                'description' => '<p>AirPods Pro 2, gelismis aktif gurultu engelleme ve kisisellestirilmis mekansal ses sunar.</p>',
                'type' => 'simple',
                'status' => 'active',
                'is_featured' => true,
                'tax_class' => 'standard',
                'variants' => [
                    ['title' => 'Beyaz', 'price' => 9499.00, 'stock' => 100, 'weight' => 0.051],
                ],
                'photos' => [
                    'https://picsum.photos/seed/airpodspro1/800/800',
                ],
            ],
            // Sony WH-1000XM5
            [
                'category_id' => 422,
                'name' => 'Sony WH-1000XM5 Kablosuz Kulaklik',
                'short_description' => 'Sony WH-1000XM5, Premium Kablosuz Kulaklik',
                'description' => '<p>Sony WH-1000XM5, sinifinin en iyi gurultu engelleme ozelligine sahip premium kulaklik.</p>',
                'type' => 'simple',
                'status' => 'active',
                'is_featured' => false,
                'tax_class' => 'standard',
                'variants' => [
                    ['title' => 'Siyah', 'price' => 12999.00, 'stock' => 45, 'weight' => 0.250],
                    ['title' => 'Gumus', 'price' => 12999.00, 'stock' => 35, 'weight' => 0.250],
                ],
                'photos' => [
                    'https://picsum.photos/seed/sonywh1/800/800',
                ],
            ],
            // Apple Watch Series 9
            [
                'category_id' => 458,
                'name' => 'Apple Watch Series 9 45mm GPS',
                'short_description' => 'Apple Watch Series 9, 45mm, GPS',
                'description' => '<p>Apple Watch Series 9, S9 SiP ile daha parlak ekran ve yeni cift dokunma ozelligi sunar.</p>',
                'type' => 'simple',
                'status' => 'active',
                'is_featured' => true,
                'tax_class' => 'standard',
                'variants' => [
                    ['title' => 'Gece Yarisi Aluminyum', 'price' => 17999.00, 'stock' => 30, 'weight' => 0.039],
                    ['title' => 'Yildiz Isigi Aluminyum', 'price' => 17999.00, 'stock' => 25, 'weight' => 0.039],
                ],
                'photos' => [
                    'https://picsum.photos/seed/applewatch91/800/800',
                ],
            ],
            // Galaxy Watch6
            [
                'category_id' => 458,
                'name' => 'Samsung Galaxy Watch6 Classic 47mm',
                'short_description' => 'Samsung Galaxy Watch6 Classic, 47mm, LTE',
                'description' => '<p>Galaxy Watch6 Classic, doner cercevesi ve premium tasarimiyla dikkat ceker.</p>',
                'type' => 'simple',
                'status' => 'active',
                'is_featured' => false,
                'tax_class' => 'standard',
                'variants' => [
                    ['title' => 'Siyah', 'price' => 14999.00, 'stock' => 22, 'weight' => 0.059],
                    ['title' => 'Gumus', 'price' => 14999.00, 'stock' => 18, 'weight' => 0.059],
                ],
                'photos' => [
                    'https://picsum.photos/seed/gwatch61/800/800',
                ],
            ],
        ];

        foreach ($products as $productData) {
            $sku = 'PRD-' . strtoupper(Str::random(8));
            
            $product = Product::create([
                'vendor_id' => $vendorId,
                'category_id' => $productData['category_id'],
                'sku' => $sku,
                'slug' => Str::slug($productData['name']) . '-' . Str::random(5),
                'name' => $productData['name'],
                'short_description' => $productData['short_description'],
                'description' => $productData['description'],
                'type' => $productData['type'],
                'status' => $productData['status'],
                'is_featured' => $productData['is_featured'],
            ]);

            // Create variants
            foreach ($productData['variants'] as $index => $variant) {
                ProductVariant::create([
                    'product_id' => $product->id,
                    'sku' => $sku . '-V' . ($index + 1),
                    'title' => $variant['title'],
                    'price' => $variant['price'],
                    'stock' => $variant['stock'],
                    'unit_id' => $unitId,
                    'weight' => $variant['weight'],
                ]);
            }

            // Create photos
            foreach ($productData['photos'] as $order => $photoUrl) {
                ProductPhoto::create([
                    'product_id' => $product->id,
                    'path' => 'products/' . Str::random(20) . '.jpg',
                    'url' => $photoUrl,
                    'alt' => $productData['name'],
                    'sort_order' => $order,
                ]);
            }
        }

        $this->command->info('20 urun ve varyantlari basariyla olusturuldu!');
    }
}
