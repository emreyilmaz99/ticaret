<?php

namespace Database\Seeders;

use App\Models\VendorApplication;
use Illuminate\Database\Seeder;

class VendorApplicationSeeder extends Seeder
{
    public function run(): void
    {
        $applications = [
            [
                'type' => 'pre_application',
                'status' => 'pending',
                'email' => 'basvuru1@example.com',
                'full_name' => 'Mehmet Demir',
                'company_name' => 'Demir Ticaret',
                'phone' => '05551112233',
                'password' => bcrypt('password123'),
                'created_at' => now()->subDays(1),
            ],
            [
                'type' => 'pre_application',
                'status' => 'pending',
                'email' => 'basvuru2@example.com',
                'full_name' => 'Ayşe Yılmaz',
                'company_name' => 'Yılmaz Kozmetik',
                'phone' => '05554445566',
                'password' => bcrypt('password123'),
                'created_at' => now()->subHours(5),
            ],
            [
                'type' => 'pre_application',
                'status' => 'approved',
                'email' => 'onayli@example.com',
                'full_name' => 'Caner Erkin',
                'company_name' => 'Spor Malzemeleri A.Ş.',
                'phone' => '05321234567',
                'password' => bcrypt('password123'),
                'reviewed_at' => now(),
                'created_at' => now()->subDays(3),
            ],
            [
                'type' => 'pre_application',
                'status' => 'rejected',
                'email' => 'red@example.com',
                'full_name' => 'Hatalı Başvuru',
                'company_name' => 'Hayali Şirket',
                'phone' => '05000000000',
                'password' => bcrypt('password123'),
                'rejection_reason' => 'Şirket bilgileri doğrulanamadı.',
                'reviewed_at' => now(),
                'created_at' => now()->subDays(5),
            ],
        ];

        foreach ($applications as $app) {
            VendorApplication::create($app);
        }
    }
}
