<?php

namespace Database\Factories;

use App\Models\VendorBankAccount;
use App\Models\Vendor;
use Illuminate\Database\Eloquent\Factories\Factory;

class VendorBankAccountFactory extends Factory
{
    protected $model = VendorBankAccount::class;

    public function definition(): array
    {
        return [
            'vendor_id' => Vendor::factory(),
            'bank_name' => $this->faker->company() . ' Bank',
            'account_holder' => $this->faker->name(),
            'iban' => $this->faker->iban('TR'),
            'currency' => 'TRY',
            'is_primary' => $this->faker->boolean(20),
        ];
    }
}
