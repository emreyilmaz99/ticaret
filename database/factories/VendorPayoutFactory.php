<?php

namespace Database\Factories;

use App\Models\VendorPayout;
use App\Models\Vendor;
use Illuminate\Database\Eloquent\Factories\Factory;

class VendorPayoutFactory extends Factory
{
    protected $model = VendorPayout::class;

    public function definition(): array
    {
        return [
            'vendor_id' => Vendor::factory(),
            'amount' => $this->faker->randomFloat(2, 100, 10000),
            'fee' => $this->faker->randomFloat(2, 0, 50),
            'method' => $this->faker->randomElement(['bank_transfer', 'credit_card']),
            'status' => $this->faker->randomElement(['pending', 'processed', 'failed']),
            'processed_at' => $this->faker->optional()->dateTimeBetween('-1 month', 'now'),
            'reference' => $this->faker->uuid(),
        ];
    }
}
