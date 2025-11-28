<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class UnitsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $now = now();
        $units = [
            ['code' => 'pcs', 'name' => 'Adet', 'symbol' => 'adet', 'created_at' => $now, 'updated_at' => $now],
            ['code' => 'g', 'name' => 'Gram', 'symbol' => 'g', 'created_at' => $now, 'updated_at' => $now],
            ['code' => 'kg', 'name' => 'Kilogram', 'symbol' => 'kg', 'created_at' => $now, 'updated_at' => $now],
            ['code' => 'cm', 'name' => 'Santimetre', 'symbol' => 'cm', 'created_at' => $now, 'updated_at' => $now],
            ['code' => 'm', 'name' => 'Metre', 'symbol' => 'm', 'created_at' => $now, 'updated_at' => $now],
            ['code' => 'l', 'name' => 'Litre', 'symbol' => 'L', 'created_at' => $now, 'updated_at' => $now],
        ];

        DB::table('units')->insertOrIgnore($units);
    }
}
