<?php

namespace App\Http\Controllers\Api\V1\Public;

use App\Http\Controllers\Controller;
use App\Models\Vendor;
use App\Models\Product;
use App\Models\Review;
use App\Http\Resources\Api\V1\Shared\VendorResource;
use Illuminate\Http\Request;

class VendorController extends Controller
{
    /**
     * Get vendor profile by slug
     */
    public function show($slug)
    {
        $vendor = Vendor::with(['addresses', 'bankAccounts', 'media'])
            ->where('slug', $slug)
            ->where('status', 'active')
            ->firstOrFail();
        
        // Ürün sayısı
        $productCount = Product::where('vendor_id', $vendor->id)
            ->where('status', 'active')
            ->count();
        
        // Üyelik yılı
        $memberSince = $vendor->created_at->year;
        
        // Takipçi sayısı (şimdilik sabit, ileride VendorFollower tablosu eklenebilir)
        $followerCount = 0;
        
        return response()->json([
            'status' => 200,
            'success' => true,
            'message' => 'Vendor fetched',
            'data' => [
                'vendor' => new VendorResource($vendor),
                'stats' => [
                    'product_count' => $productCount,
                    'member_since' => $memberSince,
                    'follower_count' => $followerCount,
                ]
            ],
        ], 200);
    }

    /**
     * Get vendor products with filters
     */
    public function products(Request $request, $slug)
    {
        $vendor = Vendor::where('slug', $slug)
            ->where('status', 'active')
            ->firstOrFail();
        
        $query = Product::with(['photos', 'category', 'vendor', 'variants'])
            ->where('vendor_id', $vendor->id)
            ->where('status', 'active');
        
        // Kategori filtresi
        if ($request->has('category_id') && $request->category_id) {
            $query->where('category_id', $request->category_id);
        }
        
        // Arama
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }
        
        // Fiyat aralığı - variant'lardan kontrol et
        if ($request->has('min_price') && $request->min_price) {
            $query->whereHas('variants', function($q) use ($request) {
                $q->where('price', '>=', $request->min_price);
            });
        }
        if ($request->has('max_price') && $request->max_price) {
            $query->whereHas('variants', function($q) use ($request) {
                $q->where('price', '<=', $request->max_price);
            });
        }
        
        // Filtreler
        if ($request->has('filter')) {
            switch ($request->filter) {
                case 'high_rated':
                    $query->where('rating_avg', '>=', 4);
                    break;
                case 'free_shipping':
                    // Kargo bedava filtresi - vendor shipping settings kontrolü
                    break;
                case 'fast_delivery':
                    // Hızlı teslimat filtresi
                    break;
                case 'discounted':
                    $query->whereColumn('compare_at_price', '>', 'price');
                    break;
            }
        }
        
        // Sıralama
        $sortBy = $request->get('sort_by', 'newest');
        switch ($sortBy) {
            case 'price_asc':
                $query->orderBy('price', 'asc');
                break;
            case 'price_desc':
                $query->orderBy('price', 'desc');
                break;
            case 'rating':
                $query->orderBy('rating_avg', 'desc');
                break;
            case 'best_seller':
                $query->orderBy('total_sold', 'desc');
                break;
            case 'newest':
            default:
                $query->orderBy('created_at', 'desc');
                break;
        }
        
        $perPage = $request->get('per_page', 20);
        $products = $query->paginate($perPage);
        
        // Ürünlere fiyat bilgilerini ekle (variant'lardan)
        $productsWithPrice = collect($products->items())->map(function($product) {
            $productArray = $product->toArray();
            
            // Varsayılan variant'tan fiyat al
            $defaultVariant = $product->variants->first();
            if ($defaultVariant) {
                $productArray['price'] = $defaultVariant->price;
                $productArray['compare_at_price'] = $defaultVariant->compare_at_price;
            } else {
                $productArray['price'] = 0;
                $productArray['compare_at_price'] = null;
            }
            
            return $productArray;
        });
        
        return response()->json([
            'status' => 200,
            'success' => true,
            'message' => 'Vendor products fetched',
            'data' => $productsWithPrice,
            'meta' => [
                'current_page' => $products->currentPage(),
                'last_page' => $products->lastPage(),
                'per_page' => $products->perPage(),
                'total' => $products->total(),
            ]
        ], 200);
    }

    /**
     * Get vendor categories (categories of their products)
     */
    public function categories($slug)
    {
        $vendor = Vendor::where('slug', $slug)
            ->where('status', 'active')
            ->firstOrFail();
        
        $categories = Product::where('vendor_id', $vendor->id)
            ->where('status', 'active')
            ->with('category')
            ->get()
            ->pluck('category')
            ->filter()
            ->unique('id')
            ->map(function($category) use ($vendor) {
                $productCount = Product::where('vendor_id', $vendor->id)
                    ->where('category_id', $category->id)
                    ->where('status', 'active')
                    ->count();
                return [
                    'id' => $category->id,
                    'name' => $category->name,
                    'slug' => $category->slug,
                    'product_count' => $productCount,
                ];
            })
            ->values();
        
        return response()->json([
            'status' => 200,
            'success' => true,
            'message' => 'Vendor categories fetched',
            'data' => $categories,
        ], 200);
    }

    /**
     * Get vendor reviews
     */
    public function reviews(Request $request, $slug)
    {
        $vendor = Vendor::where('slug', $slug)
            ->where('status', 'active')
            ->firstOrFail();
        
        // Satıcının tüm ürünlerinin değerlendirmelerini getir
        $productIds = Product::where('vendor_id', $vendor->id)->pluck('id');
        
        $query = Review::with(['user', 'product'])
            ->whereIn('product_id', $productIds)
            ->where('status', 'approved');
        
        // Puana göre filtrele
        if ($request->has('rating') && $request->rating) {
            $query->where('rating', $request->rating);
        }
        
        // Sıralama
        $sortBy = $request->get('sort_by', 'newest');
        switch ($sortBy) {
            case 'oldest':
                $query->orderBy('created_at', 'asc');
                break;
            case 'highest':
                $query->orderBy('rating', 'desc');
                break;
            case 'lowest':
                $query->orderBy('rating', 'asc');
                break;
            case 'newest':
            default:
                $query->orderBy('created_at', 'desc');
                break;
        }
        
        $perPage = $request->get('per_page', 10);
        $reviews = $query->paginate($perPage);
        
        // Puan dağılımı
        $ratingDistribution = Review::whereIn('product_id', $productIds)
            ->where('status', 'approved')
            ->selectRaw('rating, COUNT(*) as count')
            ->groupBy('rating')
            ->orderBy('rating', 'desc')
            ->get()
            ->keyBy('rating');
        
        $distribution = [];
        for ($i = 5; $i >= 1; $i--) {
            $distribution[$i] = $ratingDistribution->get($i)?->count ?? 0;
        }
        
        return response()->json([
            'status' => 200,
            'success' => true,
            'message' => 'Vendor reviews fetched',
            'data' => $reviews->items(),
            'meta' => [
                'current_page' => $reviews->currentPage(),
                'last_page' => $reviews->lastPage(),
                'per_page' => $reviews->perPage(),
                'total' => $reviews->total(),
            ],
            'summary' => [
                'average_rating' => round($vendor->rating_avg, 1),
                'total_reviews' => $vendor->rating_count,
                'distribution' => $distribution,
            ]
        ], 200);
    }
}
