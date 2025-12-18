<?php

namespace App\Interfaces\Services\Tax;

use App\Core\ServiceResponse;

interface TaxCalculationServiceInterface
{
    /**
     * Calculate tax
     */
    public function calculate(int $taxClassId, float $priceExcludingTax): ServiceResponse;

    /**
     * Calculate tax for order item
     */
    public function calculateForOrderItem(int $taxClassId, float $price, int $quantity): ServiceResponse;
}
