<?php

namespace App\Http\Controllers\Api\V1\Vendor;

use App\Http\Controllers\Controller;
use App\Models\VendorCampaign;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CampaignController extends Controller
{
    /**
     * Satıcının kampanyalarını listele
     */
    public function index(): JsonResponse
    {
        $vendor = auth('vendor')->user();
        
        $campaigns = VendorCampaign::where('vendor_id', $vendor->id)
            ->with('products:id,name')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => $campaigns,
        ]);
    }

    /**
     * Yeni kampanya oluştur
     */
    public function store(Request $request): JsonResponse
    {
        $vendor = auth('vendor')->user();

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'buy_quantity' => 'required|integer|min:2|max:100',
            'pay_quantity' => 'required|integer|min:1|lt:buy_quantity',
            'starts_at' => 'required|date',
            'ends_at' => 'required|date|after:starts_at',
            'product_ids' => 'required|array|min:1',
            'product_ids.*' => 'required|string',
            'is_active' => 'boolean',
        ], [
            'name.required' => 'Kampanya adı gereklidir.',
            'buy_quantity.required' => 'Alınacak ürün adedi gereklidir.',
            'buy_quantity.min' => 'Alınacak ürün adedi en az 2 olmalıdır.',
            'pay_quantity.required' => 'Ödenecek ürün adedi gereklidir.',
            'pay_quantity.lt' => 'Ödenecek adet, alınacak adetten az olmalıdır.',
            'starts_at.required' => 'Başlangıç tarihi gereklidir.',
            'ends_at.required' => 'Bitiş tarihi gereklidir.',
            'ends_at.after' => 'Bitiş tarihi başlangıç tarihinden sonra olmalıdır.',
            'product_ids.required' => 'En az bir ürün seçmelisiniz.',
            'product_ids.min' => 'En az bir ürün seçmelisiniz.',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Doğrulama hatası',
                'errors' => $validator->errors(),
            ], 422);
        }

        // Ürünlerin satıcıya ait olduğunu kontrol et
        $productIds = $request->product_ids;
        $validProducts = Product::where('vendor_id', $vendor->id)
            ->whereIn('id', $productIds)
            ->pluck('id')
            ->toArray();

        if (count($validProducts) !== count($productIds)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Seçilen ürünlerden bazıları size ait değil.',
            ], 422);
        }

        // Ürünlerin başka bir kampanyada olup olmadığını kontrol et
        $productsInOtherCampaigns = VendorCampaign::where('vendor_id', $vendor->id)
            ->where('is_active', true)
            ->whereHas('products', function ($q) use ($productIds) {
                $q->whereIn('products.id', $productIds);
            })
            ->with(['products' => function ($q) use ($productIds) {
                $q->whereIn('products.id', $productIds);
            }])
            ->get();

        if ($productsInOtherCampaigns->count() > 0) {
            $conflictingProducts = $productsInOtherCampaigns->flatMap->products->pluck('name')->unique()->implode(', ');
            return response()->json([
                'status' => 'error',
                'message' => "Şu ürünler zaten başka bir kampanyada: {$conflictingProducts}",
            ], 422);
        }

        $campaign = VendorCampaign::create([
            'vendor_id' => $vendor->id,
            'name' => $request->name,
            'description' => $request->description,
            'buy_quantity' => $request->buy_quantity,
            'pay_quantity' => $request->pay_quantity,
            'starts_at' => $request->starts_at,
            'ends_at' => $request->ends_at,
            'is_active' => $request->is_active ?? true,
        ]);

        // Ürünleri kampanyaya ekle
        $campaign->products()->attach($validProducts);

        return response()->json([
            'status' => 'success',
            'message' => 'Kampanya başarıyla oluşturuldu.',
            'data' => $campaign->load('products:id,name'),
        ], 201);
    }

    /**
     * Kampanya detayını göster
     */
    public function show(VendorCampaign $campaign): JsonResponse
    {
        $vendor = auth('vendor')->user();

        if ($campaign->vendor_id !== $vendor->id) {
            return response()->json([
                'status' => 'error',
                'message' => 'Bu kampanyaya erişim yetkiniz yok.',
            ], 403);
        }

        return response()->json([
            'status' => 'success',
            'data' => $campaign->load('products:id,name'),
        ]);
    }

    /**
     * Kampanyayı güncelle
     */
    public function update(Request $request, VendorCampaign $campaign): JsonResponse
    {
        $vendor = auth('vendor')->user();

        if ($campaign->vendor_id !== $vendor->id) {
            return response()->json([
                'status' => 'error',
                'message' => 'Bu kampanyaya erişim yetkiniz yok.',
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'buy_quantity' => 'sometimes|required|integer|min:2|max:100',
            'pay_quantity' => 'sometimes|required|integer|min:1',
            'starts_at' => 'sometimes|required|date',
            'ends_at' => 'sometimes|required|date|after:starts_at',
            'product_ids' => 'sometimes|required|array|min:1',
            'product_ids.*' => 'required|string',
            'is_active' => 'boolean',
        ], [
            'pay_quantity.lt' => 'Ödenecek adet, alınacak adetten az olmalıdır.',
            'ends_at.after' => 'Bitiş tarihi başlangıç tarihinden sonra olmalıdır.',
            'product_ids.min' => 'En az bir ürün seçmelisiniz.',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Doğrulama hatası',
                'errors' => $validator->errors(),
            ], 422);
        }

        // pay_quantity < buy_quantity kontrolü
        $buyQty = $request->buy_quantity ?? $campaign->buy_quantity;
        $payQty = $request->pay_quantity ?? $campaign->pay_quantity;
        if ($payQty >= $buyQty) {
            return response()->json([
                'status' => 'error',
                'message' => 'Ödenecek adet, alınacak adetten az olmalıdır.',
            ], 422);
        }

        // Ürünleri güncelle
        if ($request->has('product_ids')) {
            $productIds = $request->product_ids;
            $validProducts = Product::where('vendor_id', $vendor->id)
                ->whereIn('id', $productIds)
                ->pluck('id')
                ->toArray();

            if (count($validProducts) !== count($productIds)) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Seçilen ürünlerden bazıları size ait değil.',
                ], 422);
            }

            // Ürünlerin başka bir kampanyada olup olmadığını kontrol et (mevcut kampanya hariç)
            $productsInOtherCampaigns = VendorCampaign::where('vendor_id', $vendor->id)
                ->where('id', '!=', $campaign->id)
                ->where('is_active', true)
                ->whereHas('products', function ($q) use ($productIds) {
                    $q->whereIn('products.id', $productIds);
                })
                ->with(['products' => function ($q) use ($productIds) {
                    $q->whereIn('products.id', $productIds);
                }])
                ->get();

            if ($productsInOtherCampaigns->count() > 0) {
                $conflictingProducts = $productsInOtherCampaigns->flatMap->products->pluck('name')->unique()->implode(', ');
                return response()->json([
                    'status' => 'error',
                    'message' => "Şu ürünler zaten başka bir kampanyada: {$conflictingProducts}",
                ], 422);
            }

            $campaign->products()->sync($validProducts);
        }

        $campaign->update($request->only([
            'name', 'description', 'buy_quantity', 'pay_quantity', 
            'starts_at', 'ends_at', 'is_active'
        ]));

        return response()->json([
            'status' => 'success',
            'message' => 'Kampanya başarıyla güncellendi.',
            'data' => $campaign->fresh()->load('products:id,name'),
        ]);
    }

    /**
     * Kampanyayı sil
     */
    public function destroy(VendorCampaign $campaign): JsonResponse
    {
        $vendor = auth('vendor')->user();

        if ($campaign->vendor_id !== $vendor->id) {
            return response()->json([
                'status' => 'error',
                'message' => 'Bu kampanyaya erişim yetkiniz yok.',
            ], 403);
        }

        $campaign->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Kampanya başarıyla silindi.',
        ]);
    }

    /**
     * Kampanya durumunu değiştir (aktif/pasif)
     */
    public function toggle(VendorCampaign $campaign): JsonResponse
    {
        $vendor = auth('vendor')->user();

        if ($campaign->vendor_id !== $vendor->id) {
            return response()->json([
                'status' => 'error',
                'message' => 'Bu kampanyaya erişim yetkiniz yok.',
            ], 403);
        }

        $campaign->update(['is_active' => !$campaign->is_active]);

        return response()->json([
            'status' => 'success',
            'message' => $campaign->is_active ? 'Kampanya aktifleştirildi.' : 'Kampanya devre dışı bırakıldı.',
            'data' => $campaign->fresh()->load('products:id,name'),
        ]);
    }
}
