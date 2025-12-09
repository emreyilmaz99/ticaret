<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TaxClassSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $taxClasses = [
            [
                'name' => 'KDV %0',
                'rate' => 0.00,
                'description' => 'KDV Muaf Ürünler (Temel Gıda, Kitap vb.)',
                'is_default' => false,
                'is_active' => true,
                'sort_order' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'KDV %1',
                'rate' => 1.00,
                'description' => 'İndirimli KDV Oranı',
                'is_default' => false,
                'is_active' => true,
                'sort_order' => 2,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'KDV %10',
                'rate' => 10.00,
                'description' => 'İndirimli KDV Oranı (Gıda, İlaç vb.)',
                'is_default' => false,
                'is_active' => true,
                'sort_order' => 3,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'KDV %18',
                'rate' => 18.00,
                'description' => 'Standart KDV Oranı (Genel Ürünler)',
                'is_default' => true,
                'is_active' => true,
                'sort_order' => 4,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'KDV %20',
                'rate' => 20.00,
                'description' => 'Lüks Tüketim Vergisi',
                'is_default' => false,
                'is_active' => true,
                'sort_order' => 5,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        DB::table('tax_classes')->insert($taxClasses);
    }
}
