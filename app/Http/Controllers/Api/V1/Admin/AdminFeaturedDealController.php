<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\FeaturedDeal;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class AdminFeaturedDealController extends Controller
{
    /**
     * Display a listing of featured deals
     */
    public function index(Request $request): JsonResponse
    {
        $query = FeaturedDeal::with(['product.photos', 'product.vendor', 'variant'])
            ->ordered();

        // Filter by status
        if ($request->has('status')) {
            if ($request->status === 'active') {
                $query->current();
            } elseif ($request->status === 'expired') {
                $query->expired();
            } elseif ($request->status === 'upcoming') {
                $query->upcoming();
            } elseif ($request->status === 'inactive') {
                $query->where('is_active', false);
            }
        }

        $deals = $query->paginate($request->per_page ?? 15);

        return response()->json([
            'success' => true,
            'data' => [
                'deals' => $deals->items(),
                'pagination' => [
                    'current_page' => $deals->currentPage(),
                    'last_page' => $deals->lastPage(),
                    'per_page' => $deals->perPage(),
                    'total' => $deals->total(),
                ],
            ],
        ]);
    }

    /**
     * Get data for create form
     */
    public function create(): JsonResponse
    {
        // Get active products with their variants
        $products = Product::where('status', 'active')
            ->with(['variants', 'photos', 'vendor'])
            ->orderBy('name')
            ->get()
            ->map(function ($product) {
                // Get price from first variant or 0
                $defaultVariant = $product->variants->first();
                $price = $defaultVariant ? $defaultVariant->price : 0;
                
                return [
                    'id' => $product->id,
                    'name' => $product->name,
                    'sku' => $product->sku ?? '',
                    'price' => $price,
                    'vendor' => $product->vendor ? [
                        'business_name' => $product->vendor->company_name ?? $product->vendor->business_name ?? '',
                    ] : null,
                    'photos' => $product->photos->map(function ($photo) {
                        return [
                            'url' => $photo->file_path, // file_path already returns full URL
                        ];
                    }),
                    'variants' => $product->variants->map(function ($variant) {
                        return [
                            'id' => $variant->id,
                            'title' => $variant->title,
                            'sku' => $variant->sku,
                            'price' => $variant->price,
                            'stock' => $variant->stock,
                            'attribute_values' => $variant->attributeValues ?? [],
                        ];
                    }),
                ];
            });

        return response()->json([
            'success' => true,
            'data' => $products,
        ]);
    }

    /**
     * Store a new featured deal
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'variant_id' => 'nullable|exists:product_variants,id',
            'deal_price' => 'required|numeric|min:0',
            'original_price' => 'required|numeric|min:0|gt:deal_price',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'background_color' => 'nullable|string|max:20',
            'badge_text' => 'nullable|string|max:50',
            'badge_color' => 'nullable|string|max:20',
            'starts_at' => 'nullable|date',
            'ends_at' => 'nullable|date|after:starts_at',
            'is_active' => 'boolean',
            'sort_order' => 'nullable|integer|min:0',
        ]);

        try {
            $deal = FeaturedDeal::create($validated);

            Log::info('Featured deal created', [
                'deal_id' => $deal->id,
                'product_id' => $deal->product_id,
                'admin_id' => $request->user()->id,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Öne çıkan ürün başarıyla oluşturuldu.',
                'data' => [
                    'deal' => $deal->load(['product.photos', 'product.vendor', 'variant']),
                ],
            ], 201);
        } catch (\Exception $e) {
            Log::error('Featured deal creation failed', [
                'error' => $e->getMessage(),
                'admin_id' => $request->user()->id,
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Öne çıkan ürün oluşturulamadı: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Display the specified deal
     */
    public function show(FeaturedDeal $deal): JsonResponse
    {
        $deal->load(['product.photos', 'product.vendor', 'variant']);

        return response()->json([
            'success' => true,
            'data' => [
                'deal' => $deal,
            ],
        ]);
    }

    /**
     * Update the specified deal
     */
    public function update(Request $request, FeaturedDeal $deal): JsonResponse
    {
        $validated = $request->validate([
            'product_id' => 'sometimes|exists:products,id',
            'variant_id' => 'nullable|exists:product_variants,id',
            'deal_price' => 'sometimes|numeric|min:0',
            'original_price' => 'sometimes|numeric|min:0',
            'title' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'background_color' => 'nullable|string|max:20',
            'badge_text' => 'nullable|string|max:50',
            'badge_color' => 'nullable|string|max:20',
            'starts_at' => 'nullable|date',
            'ends_at' => 'nullable|date',
            'is_active' => 'boolean',
            'sort_order' => 'nullable|integer|min:0',
        ]);

        try {
            $deal->update($validated);

            Log::info('Featured deal updated', [
                'deal_id' => $deal->id,
                'admin_id' => $request->user()->id,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Öne çıkan ürün başarıyla güncellendi.',
                'data' => [
                    'deal' => $deal->fresh(['product.photos', 'product.vendor', 'variant']),
                ],
            ]);
        } catch (\Exception $e) {
            Log::error('Featured deal update failed', [
                'deal_id' => $deal->id,
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Öne çıkan ürün güncellenemedi: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Remove the specified deal (soft delete)
     */
    public function destroy(FeaturedDeal $deal): JsonResponse
    {
        try {
            $deal->delete();

            Log::info('Featured deal deleted', [
                'deal_id' => $deal->id,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Öne çıkan ürün başarıyla silindi.',
            ]);
        } catch (\Exception $e) {
            Log::error('Featured deal deletion failed', [
                'deal_id' => $deal->id,
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Öne çıkan ürün silinemedi: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Toggle deal active status
     */
    public function toggle(FeaturedDeal $deal): JsonResponse
    {
        try {
            $deal->update([
                'is_active' => !$deal->is_active,
            ]);

            return response()->json([
                'success' => true,
                'message' => $deal->is_active ? 'Öne çıkan ürün aktifleştirildi.' : 'Öne çıkan ürün pasifleştirildi.',
                'data' => [
                    'deal' => $deal,
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Durum değiştirilemedi: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Reorder deals
     */
    public function reorder(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'deals' => 'required|array',
            'deals.*.id' => 'required|exists:featured_deals,id',
            'deals.*.sort_order' => 'required|integer|min:0',
        ]);

        try {
            DB::transaction(function () use ($validated) {
                foreach ($validated['deals'] as $dealData) {
                    FeaturedDeal::where('id', $dealData['id'])
                        ->update(['sort_order' => $dealData['sort_order']]);
                }
            });

            return response()->json([
                'success' => true,
                'message' => 'Sıralama başarıyla güncellendi.',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Sıralama güncellenemedi: ' . $e->getMessage(),
            ], 500);
        }
    }
}
