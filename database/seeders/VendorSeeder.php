<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Vendor;
use App\Models\VendorAddress;
use App\Models\VendorBankAccount;
use App\Models\VendorPayout;

class VendorSeeder extends Seeder
{
    public function run(): void
    {
        // Create 10 vendors
        Vendor::factory(10)->create()->each(function ($vendor) {
            
            // Create 1-3 addresses for each vendor
            VendorAddress::factory(rand(1, 3))->create([
                'vendor_id' => $vendor->id,
            ]);

            // Create 1-2 bank accounts for each vendor
            VendorBankAccount::factory(rand(1, 2))->create([
                'vendor_id' => $vendor->id,
            ]);

            // Create 0-5 payouts for each vendor
            VendorPayout::factory(rand(0, 5))->create([
                'vendor_id' => $vendor->id,
            ]);
        });
    }
}
