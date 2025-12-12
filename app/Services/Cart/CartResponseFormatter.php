<?php

namespace App\Services\Cart;

use App\Models\Cart;
use App\Models\VendorShippingSetting;

class CartResponseFormatter
{
    /**
     * Format cart response with vendor grouping
     */
    public function format(?Cart $cart): array
    {
        if (!$cart) {
            return $this->emptyCartResponse();
        }

        $cart->load(['items.product.photos', 'items.product.vendor', 'items.variant', 'items.product.activeFeaturedDeal']);

        $vendorGroups = [];
        $allItems = [];

        foreach ($cart->items as $item) {
            $vendorId = $item->product?->vendor_id;
            $vendor = $item->product?->vendor;
            
            if (!$vendorId || !$vendor) continue;

            if (!isset($vendorGroups[$vendorId])) {
                $vendorGroups[$vendorId] = $this->initializeVendorGroup($vendorId, $vendor);
            }

            $formattedItem = $this->formatItem($item);
            $vendorGroups[$vendorId]['items'][] = $formattedItem;
            $vendorGroups[$vendorId]['subtotal'] += (float) $item->line_total;
            
            $allItems[] = $formattedItem;
        }

        $this->calculateShippingForVendors($vendorGroups);
        $totals = $this->calculateTotals($vendorGroups, $cart, $allItems);

        return [
            'items' => $allItems,
            'vendor_groups' => array_values($vendorGroups),
            'totals' => $totals,
            'coupon' => $this->formatCoupon($cart),
            'session_id' => $cart->session_id,
        ];
    }

    /**
     * Format individual cart item
     */
    public function formatItem($item): array
    {
        $imageUrl = $this->getItemImageUrl($item);
        $priceInfo = $this->getPriceInfo($item);

        // Update cart item price if needed
        if ($priceInfo['needs_update']) {
            $item->update([
                'unit_price' => $priceInfo['current_price'],
                'line_total' => $priceInfo['current_price'] * $item->quantity,
            ]);
        }

        return [
            'id' => $item->id,
            'product_id' => $item->product_id,
            'variant_id' => $item->variant_id,
            'quantity' => $item->quantity,
            'unit_price' => $priceInfo['current_price'],
            'original_price' => $priceInfo['original_price'],
            'discount_percentage' => $priceInfo['discount_percentage'],
            'has_deal' => $priceInfo['has_deal'],
            'deal_badge' => $priceInfo['deal_badge'],
            'line_total' => $priceInfo['current_price'] * $item->quantity,
            'vendor_id' => $item->product?->vendor_id,
            'product' => [
                'id' => $item->product?->id,
                'name' => $item->product?->name,
                'slug' => $item->product?->slug,
                'image' => $imageUrl,
            ],
            'variant' => $this->formatVariant($item->variant),
        ];
    }

    protected function emptyCartResponse(): array
    {
        return [
            'items' => [],
            'vendor_groups' => [],
            'totals' => [
                'subtotal' => 0,
                'discount' => 0,
                'shipping' => 0,
                'total' => 0,
                'item_count' => 0,
            ],
            'coupon' => null,
            'session_id' => null,
        ];
    }

    protected function initializeVendorGroup($vendorId, $vendor): array
    {
        return [
            'vendor_id' => $vendorId,
            'vendor_name' => $vendor->company_name ?? $vendor->name,
            'vendor_slug' => $vendor->slug,
            'items' => [],
            'subtotal' => 0,
            'shipping' => [
                'cost' => 0,
                'is_free' => false,
                'free_threshold' => 0,
                'remaining_for_free' => null,
            ],
            'estimated_delivery' => $this->calculateEstimatedDelivery(),
        ];
    }

    protected function calculateShippingForVendors(array &$vendorGroups): void
    {
        foreach ($vendorGroups as $vendorId => &$group) {
            $shippingSettings = VendorShippingSetting::getSettingsForVendor($vendorId);
            
            $shippingCost = $shippingSettings->calculateShippingCost($group['subtotal']);
            $remainingForFree = $shippingSettings->getRemainingForFreeShipping($group['subtotal']);
            
            $group['shipping'] = [
                'cost' => $shippingCost,
                'is_free' => $shippingCost == 0,
                'free_threshold' => (float) $shippingSettings->free_shipping_threshold,
                'remaining_for_free' => $remainingForFree,
            ];
        }
    }

    protected function calculateTotals(array $vendorGroups, Cart $cart, array $allItems): array
    {
        $subtotal = array_sum(array_column($vendorGroups, 'subtotal'));
        $discount = (float) ($cart->discount_amount ?? 0);
        $totalShipping = array_sum(array_column(array_column($vendorGroups, 'shipping'), 'cost'));
        $total = $subtotal - $discount + $totalShipping;

        // Featured deal indirimlerini hesapla
        $dealDiscount = 0;
        foreach ($allItems as $item) {
            if ($item['has_deal'] && isset($item['original_price'])) {
                $dealDiscount += ($item['original_price'] - $item['unit_price']) * $item['quantity'];
            }
        }

        $shippingBreakdown = array_map(function($vendorId, $group) {
            return [
                'vendor_id' => $vendorId,
                'vendor_name' => $group['vendor_name'],
                'shipping_cost' => $group['shipping']['cost'],
                'is_free' => $group['shipping']['is_free'],
                'remaining_for_free' => $group['shipping']['remaining_for_free'],
            ];
        }, array_keys($vendorGroups), $vendorGroups);

        return [
            'subtotal' => round($subtotal, 2),
            'discount' => round($discount, 2),
            'deal_discount' => round($dealDiscount, 2),
            'shipping' => round($totalShipping, 2),
            'shipping_breakdown' => array_values($shippingBreakdown),
            'total' => round(max(0, $total), 2),
            'item_count' => count($allItems),
        ];
    }

    protected function getItemImageUrl($item): ?string
    {
        $mainPhoto = $item->product?->photos?->sortBy('sort_order')->first();
        
        if (!$mainPhoto) {
            return null;
        }

        if ($mainPhoto->path) {
            return url('storage/' . $mainPhoto->path);
        }
        
        if ($mainPhoto->url) {
            return filter_var($mainPhoto->url, FILTER_VALIDATE_URL) 
                ? $mainPhoto->url 
                : url(ltrim($mainPhoto->url, '/'));
        }

        return null;
    }

    protected function getPriceInfo($item): array
    {
        $featuredDeal = $item->product?->activeFeaturedDeal;
        
        if ($featuredDeal) {
            return [
                'current_price' => (float) $featuredDeal->deal_price,
                'original_price' => (float) $featuredDeal->original_price,
                'discount_percentage' => $featuredDeal->discount_percentage,
                'has_deal' => true,
                'deal_badge' => [
                    'text' => $featuredDeal->badge_text,
                    'color' => $featuredDeal->badge_color,
                ],
                'needs_update' => (float) $item->unit_price !== (float) $featuredDeal->deal_price,
            ];
        }

        $currentPrice = $item->variant 
            ? (float) $item->variant->price 
            : (float) ($item->product->variants()->first()?->price ?? 0);

        return [
            'current_price' => $currentPrice,
            'original_price' => null,
            'discount_percentage' => null,
            'has_deal' => false,
            'deal_badge' => null,
            'needs_update' => (float) $item->unit_price !== $currentPrice,
        ];
    }

    protected function formatVariant($variant): ?array
    {
        return $variant ? [
            'id' => $variant->id,
            'title' => $variant->title,
            'sku' => $variant->sku,
            'stock' => $variant->stock,
        ] : null;
    }

    protected function formatCoupon(Cart $cart): ?array
    {
        return $cart->coupon_code ? [
            'code' => $cart->coupon_code,
            'discount' => (float) ($cart->discount_amount ?? 0),
        ] : null;
    }

    protected function calculateEstimatedDelivery(): string
    {
        $deliveryDate = now();
        $businessDays = rand(3, 5);
        
        while ($businessDays > 0) {
            $deliveryDate->addDay();
            if ($deliveryDate->dayOfWeekIso <= 5) {
                $businessDays--;
            }
        }
        
        $days = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'];
        $months = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
        
        $dayName = $days[$deliveryDate->dayOfWeekIso - 1];
        $monthName = $months[$deliveryDate->month - 1];
        
        return "Tahmini {$deliveryDate->day} {$monthName} {$dayName} kapında";
    }
}
