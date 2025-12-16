<?php

namespace App\Http\Resources\Api\V1\Admin;

use Illuminate\Http\Resources\Json\JsonResource;

class VendorResource extends JsonResource
{
    public function toArray($request): array
    {
        $primaryAddress = $this->addresses->first();
        $primaryBank = $this->bankAccounts->first();

        return [
            'id' => $this->id,
            'storeName' => $this->company_name ?? $this->name,
            'company_name' => $this->company_name ?? $this->name,
            'owner' => $this->name,
            'full_name' => $this->contact_name && $this->contact_surname 
                ? $this->contact_name . ' ' . $this->contact_surname 
                : $this->name,
            'slug' => $this->slug,
            'email' => $this->email,
            'phone' => $this->phone ?? null,
            'status' => $this->status ?? 'active',
            'merchant_type' => $this->merchant_type,
            'identity_number' => $this->identity_number,
            'tax_id' => $this->tax_id,
            'revenue' => $this->payouts_sum_amount ? '₺' . number_format($this->payouts_sum_amount, 2) : '₺0.00',
            'rating' => $this->rating_avg ?? 0,
            'products' => 0,
            'joinDate' => $this->created_at?->format('d M Y'),
            'address' => $primaryAddress ? $primaryAddress->address_line . ', ' . $primaryAddress->city : '',
            'bankName' => $primaryBank ? $primaryBank->bank_name : '',
            'iban' => $primaryBank ? $primaryBank->iban : '',
            'commissionRate' => $this->commissionPlan?->rate ?? 0,
            'commission_rate' => $this->commissionPlan?->rate ?? 0,
            'commission_plan_id' => $this->commission_plan_id,
            'commission_plan' => $this->whenLoaded('commissionPlan', fn() => [
                'id' => $this->commissionPlan->id,
                'name' => $this->commissionPlan->name,
                'rate' => $this->commissionPlan->rate,
            ]),
            'adminNotes' => $this->metadata['admin_notes'] ?? '',
            'roles' => $this->whenLoaded('roles', fn() => $this->roles->pluck('name')),
            'addresses' => $this->whenLoaded('addresses'),
            'bank_accounts' => $this->whenLoaded('bankAccounts'),
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}
