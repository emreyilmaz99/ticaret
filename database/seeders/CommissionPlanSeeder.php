<?php

namespace Database\Seeders;

use App\Models\CommissionPlan;
use Illuminate\Database\Seeder;

class CommissionPlanSeeder extends Seeder
{
    public function run(): void
    {
        $plans = [
            [
                'name' => 'Standart Plan',
                'rate' => 10.00,
                'description' => 'Tüm satıcılar için varsayılan komisyon oranı.',
                'is_active' => true,
                'is_default' => true,
            ],
            [
                'name' => 'Düşük Komisyonlu Plan',
                'rate' => 5.00,
                'description' => 'Yüksek hacimli satıcılar için özel oran.',
                'is_active' => true,
                'is_default' => false,
            ],
            [
                'name' => 'Yüksek Komisyonlu Plan',
                'rate' => 15.00,
                'description' => 'Yeni veya riskli satıcılar için.',
                'is_active' => true,
                'is_default' => false,
            ],
        ];

        foreach ($plans as $plan) {
            CommissionPlan::create($plan);
        }
    }
}
