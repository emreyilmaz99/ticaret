<?php

namespace App\Http\Controllers\Api\V1\Vendor;

use App\Http\Controllers\Controller;
use App\Models\VendorShippingSetting;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;

class ShippingSettingController extends Controller
{
    /**
     * Satıcının kargo ayarlarını getir
     * 
     * @return JsonResponse
     */
    public function show(): JsonResponse
    {
        $vendor = auth('vendor')->user();
        
        // Ayarları getir veya varsayılan değerlerle oluştur
        $settings = VendorShippingSetting::getOrCreateDefault($vendor->id);
        
        return response()->json([
            'status' => 'success',
            'data' => [
                'shipping_cost' => (float) $settings->shipping_cost,
                'free_shipping_threshold' => (float) $settings->free_shipping_threshold,
                'is_shipping_enabled' => $settings->is_shipping_enabled,
            ],
            'defaults' => [
                'shipping_cost' => VendorShippingSetting::DEFAULT_SHIPPING_COST,
                'free_shipping_threshold' => VendorShippingSetting::DEFAULT_FREE_SHIPPING_THRESHOLD,
            ],
        ]);
    }

    /**
     * Satıcının kargo ayarlarını güncelle
     * 
     * @param Request $request
     * @return JsonResponse
     */
    public function update(Request $request): JsonResponse
    {
        $vendor = auth('vendor')->user();
        
        $validator = Validator::make($request->all(), [
            'shipping_cost' => 'required|numeric|min:0|max:9999.99',
            'free_shipping_threshold' => 'required|numeric|min:0|max:99999.99',
            'is_shipping_enabled' => 'required|boolean',
        ], [
            'shipping_cost.required' => 'Kargo ücreti zorunludur.',
            'shipping_cost.numeric' => 'Kargo ücreti sayısal bir değer olmalıdır.',
            'shipping_cost.min' => 'Kargo ücreti 0 veya daha büyük olmalıdır.',
            'shipping_cost.max' => 'Kargo ücreti çok yüksek.',
            'free_shipping_threshold.required' => 'Ücretsiz kargo limiti zorunludur.',
            'free_shipping_threshold.numeric' => 'Ücretsiz kargo limiti sayısal bir değer olmalıdır.',
            'free_shipping_threshold.min' => 'Ücretsiz kargo limiti 0 veya daha büyük olmalıdır.',
            'free_shipping_threshold.max' => 'Ücretsiz kargo limiti çok yüksek.',
            'is_shipping_enabled.required' => 'Kargo durumu zorunludur.',
            'is_shipping_enabled.boolean' => 'Kargo durumu geçersiz.',
        ]);
        
        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Doğrulama hatası',
                'errors' => $validator->errors(),
            ], 422);
        }
        
        // Ayarları güncelle veya oluştur
        $settings = VendorShippingSetting::updateOrCreate(
            ['vendor_id' => $vendor->id],
            [
                'shipping_cost' => $request->shipping_cost,
                'free_shipping_threshold' => $request->free_shipping_threshold,
                'is_shipping_enabled' => $request->is_shipping_enabled,
            ]
        );
        
        return response()->json([
            'status' => 'success',
            'message' => 'Kargo ayarları başarıyla güncellendi.',
            'data' => [
                'shipping_cost' => (float) $settings->shipping_cost,
                'free_shipping_threshold' => (float) $settings->free_shipping_threshold,
                'is_shipping_enabled' => $settings->is_shipping_enabled,
            ],
        ]);
    }
}
