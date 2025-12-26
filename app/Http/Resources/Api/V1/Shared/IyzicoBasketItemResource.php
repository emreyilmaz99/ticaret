<?php

namespace App\Http\Resources\Api\V1\Shared;

use Illuminate\Http\Resources\Json\JsonResource;

/**
 * IyzicoBasketItemResource
 * 
 * Transforms OrderItem to Iyzico payment gateway basket item format.
 * Used for both new orders and existing orders retry.
 * 
 * @property \App\Models\OrderItem $resource
 */
class IyzicoBasketItemResource extends JsonResource
{
    /**
     * Transform OrderItem to Iyzico basket item format
     * 
     * Required format by Iyzico API:
     * - id: Unique identifier for the item
     * - name: Item name (product + variant)
     * - category: Product category name
     * - price: Item total price
     * - submerchant_key: Vendor's iyzico submerchant key
     * - submerchant_price: Amount to be paid to vendor
     * 
     * @param \Illuminate\Http\Request $request
     * @return array
     */
    public function toArray($request): array
    {
        return [
            'id' => $this->iyzico_item_id ?? 'ITEM_' . $this->id,
            'name' => $this->buildItemName(),
            'category' => $this->product->category->name ?? 'Genel',
            'price' => (string) $this->line_total, // Iyzico requires string
            'submerchant_key' => $this->submerchant_key,
            'submerchant_price' => (string) $this->submerchant_price, // Iyzico requires string
        ];
    }

    /**
     * Build item name for payment gateway
     * Format: "Product Name - Variant Title" or just "Product Name"
     * 
     * @return string
     */
    protected function buildItemName(): string
    {
        $name = $this->product_name;
        
        if ($this->variant_title) {
            $name .= ' - ' . $this->variant_title;
        }
        
        return $name;
    }
}
