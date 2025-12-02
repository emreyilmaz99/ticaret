<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Unit;

class UnitSeeder extends Seeder
{
    public function run()
    {
        $units = [
            ['name' => 'Adet', 'code' => 'qty', 'symbol' => 'ad'],
            ['name' => 'Kilogram', 'code' => 'kg', 'symbol' => 'kg'],
            ['name' => 'Gram', 'code' => 'g', 'symbol' => 'g'],
            ['name' => 'Litre', 'code' => 'l', 'symbol' => 'L'],
            ['name' => 'Mililitre', 'code' => 'ml', 'symbol' => 'ml'],
            ['name' => 'Metre', 'code' => 'm', 'symbol' => 'm'],
            ['name' => 'Santimetre', 'code' => 'cm', 'symbol' => 'cm'],
            ['name' => 'Kutu', 'code' => 'box', 'symbol' => 'kutu'],
            ['name' => 'Paket', 'code' => 'pack', 'symbol' => 'pkt'],
            ['name' => 'Çift', 'code' => 'pair', 'symbol' => 'çift'],
        ];

        foreach ($units as $unit) {
            Unit::firstOrCreate(['code' => $unit['code']], $unit);
        }
    }
}
