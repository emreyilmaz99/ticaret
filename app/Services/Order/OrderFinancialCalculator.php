<?php

namespace App\Services\Order;

use App\Interfaces\Services\Order\OrderFinancialCalculatorInterface;
use App\Models\OrderItem;
use App\Services\BaseService;

class OrderFinancialCalculator extends BaseService implements OrderFinancialCalculatorInterface
{
    /**
     * Calculate financial breakdown for an order item with coupon discount
     * 
     * Formula:
     * - Original price = order_item.line_total
     * - Coupon discount proportion = (item_price / total_price) * total_coupon_discount
     * - Price after coupon = original_price - coupon_proportion
     * - Price without tax = price_after_coupon / (1 + tax_rate/100)
     * - Tax amount = price_after_coupon - price_without_tax
     * - Commission = price_without_tax * (commission_rate/100)
     * - Vendor earning = price_without_tax - commission
     */
    public function calculate(
        OrderItem $orderItem, 
        float $totalBeforeDiscount = 0, 
        float $totalCouponDiscount = 0
    ): array {
        $originalPrice = (float) $orderItem->line_total; // Original price including tax
        $taxRate = (float) ($orderItem->product?->taxClass?->rate ?? 0);
        $commissionRate = (float) ($orderItem->product?->vendor?->commissionPlan?->rate ?? 0);
        
        // Calculate this item's share of the coupon discount
        $itemCouponDiscount = $this->calculateItemCouponDiscount(
            $originalPrice, 
            $totalBeforeDiscount, 
            $totalCouponDiscount
        );
        
        // Price after coupon discount
        $priceAfterCoupon = $originalPrice - $itemCouponDiscount;
        
        // Calculate price without tax
        $priceWithoutTax = $this->calculatePriceWithoutTax($priceAfterCoupon, $taxRate);
        
        // Calculate tax amount
        $taxAmount = $priceAfterCoupon - $priceWithoutTax;
        
        // Calculate commission (based on price without tax)
        $commissionAmount = $priceWithoutTax * ($commissionRate / 100);
        
        // Calculate vendor earning
        $vendorEarning = $priceWithoutTax - $commissionAmount;
        
        return [
            'price_with_tax' => round($priceAfterCoupon, 2),
            'price_without_tax' => round($priceWithoutTax, 2),
            'tax_rate' => $taxRate,
            'tax_amount' => round($taxAmount, 2),
            'commission_rate' => $commissionRate,
            'commission_amount' => round($commissionAmount, 2),
            'vendor_earning' => round($vendorEarning, 2),
        ];
    }

    /**
     * Calculate this item's proportional share of the coupon discount
     */
    protected function calculateItemCouponDiscount(
        float $itemPrice,
        float $totalBeforeDiscount,
        float $totalCouponDiscount
    ): float {
        if ($totalBeforeDiscount <= 0 || $totalCouponDiscount <= 0) {
            return 0;
        }
        
        return ($itemPrice / $totalBeforeDiscount) * $totalCouponDiscount;
    }

    /**
     * Calculate price without tax from price with tax
     */
    protected function calculatePriceWithoutTax(float $priceWithTax, float $taxRate): float
    {
        if ($taxRate <= 0) {
            return $priceWithTax;
        }
        
        return $priceWithTax / (1 + ($taxRate / 100));
    }

    /**
     * Calculate total financials for multiple order items
     */
    public function calculateBulk(
        $orderItems,
        float $totalBeforeDiscount = 0,
        float $totalCouponDiscount = 0
    ): array {
        $totals = [
            'price_with_tax' => 0,
            'price_without_tax' => 0,
            'tax_amount' => 0,
            'commission_amount' => 0,
            'vendor_earning' => 0,
        ];

        foreach ($orderItems as $item) {
            $financials = $this->calculate($item, $totalBeforeDiscount, $totalCouponDiscount);
            
            $totals['price_with_tax'] += $financials['price_with_tax'];
            $totals['price_without_tax'] += $financials['price_without_tax'];
            $totals['tax_amount'] += $financials['tax_amount'];
            $totals['commission_amount'] += $financials['commission_amount'];
            $totals['vendor_earning'] += $financials['vendor_earning'];
        }

        return [
            'price_with_tax' => round($totals['price_with_tax'], 2),
            'price_without_tax' => round($totals['price_without_tax'], 2),
            'tax_amount' => round($totals['tax_amount'], 2),
            'commission_amount' => round($totals['commission_amount'], 2),
            'vendor_earning' => round($totals['vendor_earning'], 2),
        ];
    }
}
