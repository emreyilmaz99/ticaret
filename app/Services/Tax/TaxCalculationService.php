<?php

namespace App\Services\Tax;

use App\Core\ServiceResponse;
use App\Models\TaxClass;
use App\Services\BaseService;

class TaxCalculationService extends BaseService
{
    /**
     * Fiyat için vergi hesapla
     */
    public function calculate(int $taxClassId, float $priceExcludingTax): ServiceResponse
    {
        try {
            $taxClass = TaxClass::find($taxClassId);

            if (!$taxClass) {
                return $this->errorResponse('Vergi sınıfı bulunamadı', 404);
            }

            $taxAmount = $taxClass->calculateTaxAmount($priceExcludingTax);
            $priceIncludingTax = $taxClass->calculatePriceIncludingTax($priceExcludingTax);

            return $this->successResponse([
                'price_excluding_tax' => round($priceExcludingTax, 2),
                'tax_rate' => $taxClass->rate,
                'tax_amount' => $taxAmount,
                'price_including_tax' => $priceIncludingTax,
            ]);
        } catch (\Exception $e) {
            return $this->handleException($e, 'Vergi hesaplaması yapılamadı');
        }
    }

    /**
     * Sipariş kalemi için vergi hesapla
     */
    public function calculateForOrderItem(int $taxClassId, float $price, int $quantity): ServiceResponse
    {
        try {
            $taxClass = TaxClass::find($taxClassId);

            if (!$taxClass) {
                return $this->errorResponse('Vergi sınıfı bulunamadı', 404);
            }

            $subtotal = $price * $quantity;
            $taxAmount = $taxClass->calculateTaxAmount($subtotal);
            $total = $subtotal + $taxAmount;

            return $this->successResponse([
                'price' => round($price, 2),
                'quantity' => $quantity,
                'subtotal' => round($subtotal, 2),
                'tax_rate' => $taxClass->rate,
                'tax_amount' => $taxAmount,
                'total' => round($total, 2),
            ]);
        } catch (\Exception $e) {
            return $this->handleException($e, 'Sipariş kalemi vergi hesaplaması yapılamadı');
        }
    }
}
