<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\Admin\ReorderFeaturedDealsRequest;
use App\Http\Requests\Api\V1\Admin\StoreFeaturedDealRequest;
use App\Http\Requests\Api\V1\Admin\UpdateFeaturedDealRequest;
use App\Models\FeaturedDeal;
use App\Models\Product;
use App\Traits\ResponseHttp;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class AdminFeaturedDealController extends Controller
{
    use ResponseHttp;
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
                $query->where('is_active', true);
            } elseif ($request->status === 'current') {
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

        // Calculate stats
        $stats = [
            'total' => FeaturedDeal::count(),
            'active' => FeaturedDeal::where('is_active', true)->count(),
            'current' => FeaturedDeal::current()->count(),
            'upcoming' => FeaturedDeal::upcoming()->count(),
            'expired' => FeaturedDeal::expired()->count(),
            'inactive' => FeaturedDeal::where('is_active', false)->count(),
        ];

        return $this->success(
            [
                'deals' => $deals->items(),
                'stats' => $stats,
                'pagination' => [
                    'current_page' => $deals->currentPage(),
                    'last_page' => $deals->lastPage(),
                    'per_page' => $deals->perPage(),
                    'total' => $deals->total(),
                ],
            ],
            'Öne çıkan ürünler başarıyla getirildi.'
        );
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

        return $this->success(
            $products,
            'Ürünler başarıyla getirildi.'
        );
    }

    /**
     * Store a new featured deal
     */
    public function store(StoreFeaturedDealRequest $request): JsonResponse
    {
        $validated = $request->validated();

        try {
            $deal = FeaturedDeal::create($validated);

            Log::info('Featured deal created', [
                'deal_id' => $deal->id,
                'product_id' => $deal->product_id,
                'admin_id' => $request->user()->id,
            ]);

            return $this->success(
                ['deal' => $deal->load(['product.photos', 'product.vendor', 'variant'])],
                'Öne çıkan ürün başarıyla oluşturuldu.',
                201
            );
        } catch (\Exception $e) {
            Log::error('Featured deal creation failed', [
                'error' => $e->getMessage(),
                'admin_id' => $request->user()->id,
            ]);

            return $this->error(
                'Öne çıkan ürün oluşturulamadı: ' . $e->getMessage(),
                500
            );
        }
    }

    /**
     * Display the specified deal
     */
    public function show(FeaturedDeal $deal): JsonResponse
    {
        $deal->load(['product.photos', 'product.vendor', 'variant']);

        return $this->success(
            ['deal' => $deal],
            'Öne çıkan ürün detayı başarıyla getirildi.'
        );
    }

    /**
     * Update the specified deal
     */
    public function update(UpdateFeaturedDealRequest $request, FeaturedDeal $deal): JsonResponse
    {
        $validated = $request->validated();

        try {
            $deal->update($validated);

            Log::info('Featured deal updated', [
                'deal_id' => $deal->id,
                'admin_id' => $request->user()->id,
            ]);

            return $this->success(
                ['deal' => $deal->fresh(['product.photos', 'product.vendor', 'variant'])],
                'Öne çıkan ürün başarıyla güncellendi.'
            );
        } catch (\Exception $e) {
            Log::error('Featured deal update failed', [
                'deal_id' => $deal->id,
                'error' => $e->getMessage(),
            ]);

            return $this->error(
                'Öne çıkan ürün güncellenemedi: ' . $e->getMessage(),
                500
            );
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

            return $this->success(
                null,
                'Öne çıkan ürün başarıyla silindi.'
            );
        } catch (\Exception $e) {
            Log::error('Featured deal deletion failed', [
                'deal_id' => $deal->id,
                'error' => $e->getMessage(),
            ]);

            return $this->error(
                'Öne çıkan ürün silinemedi: ' . $e->getMessage(),
                500
            );
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

            return $this->success(
                ['deal' => $deal],
                $deal->is_active ? 'Öne çıkan ürün aktifleştirildi.' : 'Öne çıkan ürün pasifleştirildi.'
            );
        } catch (\Exception $e) {
            return $this->error(
                'Durum değiştirilemedi: ' . $e->getMessage(),
                500
            );
        }
    }

    /**
     * Reorder deals
     */
    public function reorder(ReorderFeaturedDealsRequest $request): JsonResponse
    {
        $validated = $request->validated();

        try {
            DB::transaction(function () use ($validated) {
                foreach ($validated['deals'] as $dealData) {
                    FeaturedDeal::where('id', $dealData['id'])
                        ->update(['sort_order' => $dealData['sort_order']]);
                }
            });

            return $this->success(
                null,
                'Sıralama başarıyla güncellendi.'
            );
        } catch (\Exception $e) {
            return $this->error(
                'Sıralama güncellenemedi: ' . $e->getMessage(),
                500
            );
        }
    }
}
