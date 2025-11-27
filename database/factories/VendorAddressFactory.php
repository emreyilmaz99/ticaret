<?php

namespace Database\Factories;

use App\Models\VendorAddress;
use App\Models\Vendor;
use Illuminate\Database\Eloquent\Factories\Factory;

class VendorAddressFactory extends Factory
{
    protected $model = VendorAddress::class;

    public function definition(): array
    {
        return [
            'vendor_id' => Vendor::factory(),
            'label' => $this->faker->word(),
            'country' => $this->faker->country(),
            'city' => $this->faker->city(),
            'address_line' => $this->faker->address(),
            'postal_code' => $this->faker->postcode(),
            'is_primary' => $this->faker->boolean(20), // 20% chance of being primary
        ];
    }
}
