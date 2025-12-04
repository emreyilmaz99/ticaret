<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Favorite;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class FavoriteController extends Controller
{
    /**
     * Kullanıcının favorilerini listele
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        
        $favorites = Favorite::with(['product' => function ($query) {
            $query->with(['photos' => function ($q) {
                $q->orderBy('id')->limit(1);
            }, 'variants' => function ($q) {
                $q->orderBy('id')->limit(1);
            }, 'vendor:id,name,slug']);
        }])
        ->where('user_id', $user->id)
        ->latest()
        ->paginate(20);

        $items = $favorites->getCollection()->map(function ($favorite) {
            $product = $favorite->product;
            if (!$product) return null;
            
            $mainPhoto = $product->photos->first();
            $firstVariant = $product->variants->first();
            
            return [
                'id' => $favorite->id,
                'added_at' => $favorite->created_at->toISOString(),
                'product' => [
                    'id' => $product->id,
                    'name' => $product->name,
                    'slug' => $product->slug,
                    'image' => $mainPhoto ? ($mainPhoto->url ?: asset('storage/' . $mainPhoto->path)) : null,
                    'price' => $firstVariant?->price ?? 0,
                    'compare_price' => $firstVariant?->compare_price,
                    'stock' => $firstVariant?->stock ?? 0,
                    'in_stock' => ($firstVariant?->stock ?? 0) > 0,
                    'vendor' => $product->vendor ? [
                        'id' => $product->vendor->id,
                        'name' => $product->vendor->name,
                        'slug' => $product->vendor->slug,
                    ] : null,
                ],
            ];
        })->filter()->values();

        return response()->json([
            'success' => true,
            'data' => [
                'items' => $items,
                'pagination' => [
                    'current_page' => $favorites->currentPage(),
                    'last_page' => $favorites->lastPage(),
                    'per_page' => $favorites->perPage(),
                    'total' => $favorites->total(),
                ],
            ],
        ]);
    }

    /**
     * Ürünü favorilere ekle
     */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'product_id' => 'required|string|exists:products,id',
        ]);

        $user = $request->user();
        $productId = $request->product_id;

        // Zaten favorilerde mi kontrol et
        $exists = Favorite::where('user_id', $user->id)
            ->where('product_id', $productId)
            ->exists();

        if ($exists) {
            return response()->json([
                'success' => false,
                'message' => 'Bu ürün zaten favorilerinizde',
            ], 400);
        }

        // Ürünü kontrol et
        $product = Product::where('id', $productId)
            ->where('status', 'active')
            ->first();

        if (!$product) {
            return response()->json([
                'success' => false,
                'message' => 'Ürün bulunamadı',
            ], 404);
        }

        Favorite::create([
            'user_id' => $user->id,
            'product_id' => $productId,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Ürün favorilere eklendi',
            'data' => [
                'is_favorite' => true,
            ],
        ]);
    }

    /**
     * Ürünü favorilerden kaldır
     */
    public function destroy(Request $request, string $productId): JsonResponse
    {
        $user = $request->user();

        $deleted = Favorite::where('user_id', $user->id)
            ->where('product_id', $productId)
            ->delete();

        if (!$deleted) {
            return response()->json([
                'success' => false,
                'message' => 'Ürün favorilerde bulunamadı',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Ürün favorilerden kaldırıldı',
            'data' => [
                'is_favorite' => false,
            ],
        ]);
    }

    /**
     * Favori durumunu toggle et (ekle/kaldır)
     */
    public function toggle(Request $request): JsonResponse
    {
        $request->validate([
            'product_id' => 'required|string|exists:products,id',
        ]);

        $user = $request->user();
        $productId = $request->product_id;

        $favorite = Favorite::where('user_id', $user->id)
            ->where('product_id', $productId)
            ->first();

        if ($favorite) {
            $favorite->delete();
            return response()->json([
                'success' => true,
                'message' => 'Ürün favorilerden kaldırıldı',
                'data' => [
                    'is_favorite' => false,
                ],
            ]);
        }

        // Ürünü kontrol et
        $product = Product::where('id', $productId)
            ->where('status', 'active')
            ->first();

        if (!$product) {
            return response()->json([
                'success' => false,
                'message' => 'Ürün bulunamadı',
            ], 404);
        }

        Favorite::create([
            'user_id' => $user->id,
            'product_id' => $productId,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Ürün favorilere eklendi',
            'data' => [
                'is_favorite' => true,
            ],
        ]);
    }

    /**
     * Belirli ürünlerin favori durumlarını kontrol et
     */
    public function check(Request $request): JsonResponse
    {
        $request->validate([
            'product_ids' => 'required|array',
            'product_ids.*' => 'string',
        ]);

        $user = $request->user();
        $productIds = $request->product_ids;

        $favoriteIds = Favorite::where('user_id', $user->id)
            ->whereIn('product_id', $productIds)
            ->pluck('product_id')
            ->toArray();

        $result = [];
        foreach ($productIds as $id) {
            $result[$id] = in_array($id, $favoriteIds);
        }

        return response()->json([
            'success' => true,
            'data' => $result,
        ]);
    }

    /**
     * Tüm favorileri temizle
     */
    public function clear(Request $request): JsonResponse
    {
        $user = $request->user();
        
        Favorite::where('user_id', $user->id)->delete();

        return response()->json([
            'success' => true,
            'message' => 'Tüm favoriler temizlendi',
        ]);
    }

    /**
     * Favori sayısını getir
     */
    public function count(Request $request): JsonResponse
    {
        $user = $request->user();
        
        $count = Favorite::where('user_id', $user->id)->count();

        return response()->json([
            'success' => true,
            'data' => [
                'count' => $count,
            ],
        ]);
    }
}
