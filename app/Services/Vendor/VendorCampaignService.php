<?php

namespace App\Services\Vendor;

use App\Core\ServiceResponse;
use App\Interfaces\Services\Vendor\VendorCampaignServiceInterface;
use App\Models\Product;
use App\Models\VendorCampaign;
use App\Services\BaseService;

class VendorCampaignService extends BaseService implements VendorCampaignServiceInterface
{
    /**
     * Get vendor's campaigns
     */
    public function getVendorCampaigns(int $vendorId): ServiceResponse
    {
        try {
            $campaigns = VendorCampaign::where('vendor_id', $vendorId)
                ->with('products:id,name')
                ->orderBy('created_at', 'desc')
                ->get();

            return $this->successResponse($campaigns, 'Kampanyalar başarıyla getirildi');

        } catch (\Exception $e) {
            return $this->handleException($e, 'Kampanyalar getirilemedi');
        }
    }

    /**
     * Create new campaign
     */
    public function createCampaign(int $vendorId, array $data): ServiceResponse
    {
        try {
            // Validate products belong to vendor
            $productIds = $data['product_ids'];
            $validProducts = Product::where('vendor_id', $vendorId)
                ->whereIn('id', $productIds)
                ->pluck('id')
                ->toArray();

            if (count($validProducts) !== count($productIds)) {
                return $this->errorResponse('Seçilen ürünlerden bazıları size ait değil', 422);
            }

            // Check if products are in other active campaigns
            $conflict = $this->checkProductConflicts($vendorId, $productIds);
            if ($conflict) {
                return $this->errorResponse($conflict, 422);
            }

            $campaign = VendorCampaign::create([
                'vendor_id' => $vendorId,
                'name' => $data['name'],
                'description' => $data['description'] ?? null,
                'buy_quantity' => $data['buy_quantity'],
                'pay_quantity' => $data['pay_quantity'],
                'starts_at' => $data['starts_at'],
                'ends_at' => $data['ends_at'],
                'is_active' => $data['is_active'] ?? true,
            ]);

            // Attach products
            $campaign->products()->attach($validProducts);
            $campaign->load('products:id,name');

            return $this->successResponse($campaign, 'Kampanya başarıyla oluşturuldu', 201);

        } catch (\Exception $e) {
            return $this->handleException($e, 'Kampanya oluşturulamadı');
        }
    }

    /**
     * Get single campaign
     */
    public function getCampaign(int $vendorId, int $campaignId): ServiceResponse
    {
        try {
            $campaign = VendorCampaign::where('id', $campaignId)
                ->where('vendor_id', $vendorId)
                ->with('products:id,name')
                ->first();

            if (!$campaign) {
                return $this->errorResponse('Kampanya bulunamadı veya erişim yetkiniz yok', 404);
            }

            return $this->successResponse($campaign, 'Kampanya detayı getirildi');

        } catch (\Exception $e) {
            return $this->handleException($e, 'Kampanya getirilemedi');
        }
    }

    /**
     * Update campaign
     */
    public function updateCampaign(int $vendorId, int $campaignId, array $data): ServiceResponse
    {
        try {
            $campaign = VendorCampaign::where('id', $campaignId)
                ->where('vendor_id', $vendorId)
                ->first();

            if (!$campaign) {
                return $this->errorResponse('Kampanya bulunamadı veya erişim yetkiniz yok', 404);
            }

            // Validate pay_quantity < buy_quantity
            $buyQty = $data['buy_quantity'] ?? $campaign->buy_quantity;
            $payQty = $data['pay_quantity'] ?? $campaign->pay_quantity;
            if ($payQty >= $buyQty) {
                return $this->errorResponse('Ödenecek adet, alınacak adetten az olmalıdır', 422);
            }

            // Update products if provided
            if (isset($data['product_ids'])) {
                $productIds = $data['product_ids'];
                
                // Validate products belong to vendor
                $validProducts = Product::where('vendor_id', $vendorId)
                    ->whereIn('id', $productIds)
                    ->pluck('id')
                    ->toArray();

                if (count($validProducts) !== count($productIds)) {
                    return $this->errorResponse('Seçilen ürünlerden bazıları size ait değil', 422);
                }

                // Check conflicts (excluding current campaign)
                $conflict = $this->checkProductConflicts($vendorId, $productIds, $campaignId);
                if ($conflict) {
                    return $this->errorResponse($conflict, 422);
                }

                $campaign->products()->sync($validProducts);
                unset($data['product_ids']); // Don't try to update this field directly
            }

            // Update campaign fields
            $campaign->update(array_filter([
                'name' => $data['name'] ?? null,
                'description' => $data['description'] ?? null,
                'buy_quantity' => $data['buy_quantity'] ?? null,
                'pay_quantity' => $data['pay_quantity'] ?? null,
                'starts_at' => $data['starts_at'] ?? null,
                'ends_at' => $data['ends_at'] ?? null,
                'is_active' => $data['is_active'] ?? null,
            ], fn($value) => $value !== null));

            $campaign->fresh()->load('products:id,name');

            return $this->successResponse($campaign, 'Kampanya başarıyla güncellendi');

        } catch (\Exception $e) {
            return $this->handleException($e, 'Kampanya güncellenemedi');
        }
    }

    /**
     * Delete campaign
     */
    public function deleteCampaign(int $vendorId, int $campaignId): ServiceResponse
    {
        try {
            $campaign = VendorCampaign::where('id', $campaignId)
                ->where('vendor_id', $vendorId)
                ->first();

            if (!$campaign) {
                return $this->errorResponse('Kampanya bulunamadı veya erişim yetkiniz yok', 404);
            }

            $campaign->delete();

            return $this->successResponse(null, 'Kampanya başarıyla silindi');

        } catch (\Exception $e) {
            return $this->handleException($e, 'Kampanya silinemedi');
        }
    }

    /**
     * Toggle campaign active status
     */
    public function toggleCampaign(int $vendorId, int $campaignId): ServiceResponse
    {
        try {
            $campaign = VendorCampaign::where('id', $campaignId)
                ->where('vendor_id', $vendorId)
                ->first();

            if (!$campaign) {
                return $this->errorResponse('Kampanya bulunamadı veya erişim yetkiniz yok', 404);
            }

            $newStatus = !$campaign->is_active;
            $campaign->update(['is_active' => $newStatus]);
            $campaign->load('products:id,name');

            $message = $newStatus ? 'Kampanya aktifleştirildi' : 'Kampanya devre dışı bırakıldı';

            return $this->successResponse($campaign, $message);

        } catch (\Exception $e) {
            return $this->handleException($e, 'Kampanya durumu değiştirilemedi');
        }
    }

    /**
     * Check if products are in other active campaigns
     */
    protected function checkProductConflicts(int $vendorId, array $productIds, ?int $excludeCampaignId = null): ?string
    {
        $query = VendorCampaign::where('vendor_id', $vendorId)
            ->where('is_active', true)
            ->whereHas('products', function ($q) use ($productIds) {
                $q->whereIn('products.id', $productIds);
            })
            ->with(['products' => function ($q) use ($productIds) {
                $q->whereIn('products.id', $productIds);
            }]);

        if ($excludeCampaignId) {
            $query->where('id', '!=', $excludeCampaignId);
        }

        $conflictingCampaigns = $query->get();

        if ($conflictingCampaigns->count() > 0) {
            $conflictingProducts = $conflictingCampaigns
                ->flatMap->products
                ->pluck('name')
                ->unique()
                ->implode(', ');

            return "Şu ürünler zaten başka bir kampanyada: {$conflictingProducts}";
        }

        return null;
    }
}
