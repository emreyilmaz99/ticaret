<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use App\Models\ProductVariant;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CartController extends Controller
{
    /**
     * Sepeti getir
     */
    public function index(Request $request): JsonResponse
    {
        $cart = $this->getCart($request);
        
        return response()->json([
            'success' => true,
            'data' => $this->formatCartResponse($cart),
        ]);
    }

    /**
     * Sepete ürün ekle
     */
    public function addItem(Request $request): JsonResponse
    {
        $request->validate([
            'product_id' => 'required|string|exists:products,id',
            'variant_id' => 'nullable|integer|exists:product_variants,id',
            'quantity' => 'integer|min:1|max:99',
        ]);

        $cart = $this->getCart($request);
        $productId = $request->product_id;
        $variantId = $request->variant_id;
        $quantity = $request->quantity ?? 1;

        // Ürün ve varyant bilgilerini al
        $product = Product::where('id', $productId)
            ->where('status', 'active')
            ->firstOrFail();

        $price = $product->variants()->first()?->price ?? 0;
        
        if ($variantId) {
            $variant = ProductVariant::where('id', $variantId)
                ->where('product_id', $productId)
                ->firstOrFail();
            
            // Stok kontrolü
            if ($variant->stock < $quantity) {
                return response()->json([
                    'success' => false,
                    'message' => 'Yetersiz stok. Mevcut stok: ' . $variant->stock,
                ], 400);
            }
            
            $price = $variant->price;
        }

        // Sepette aynı ürün+varyant var mı?
        $existingItem = $cart->items()
            ->where('product_id', $productId)
            ->where('variant_id', $variantId)
            ->first();

        if ($existingItem) {
            // Stok kontrolü (mevcut + yeni miktar)
            if ($variantId) {
                $variant = ProductVariant::find($variantId);
                if ($variant && $variant->stock < ($existingItem->quantity + $quantity)) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Yetersiz stok. Mevcut stok: ' . $variant->stock,
                    ], 400);
                }
            }
            
            $existingItem->increment('quantity', $quantity);
            $existingItem->update(['unit_price' => $price]); // Fiyatı güncelle
        } else {
            $cart->items()->create([
                'product_id' => $productId,
                'variant_id' => $variantId,
                'quantity' => $quantity,
                'unit_price' => $price,
            ]);
        }

        $cart->load('items.product', 'items.variant');

        return response()->json([
            'success' => true,
            'message' => 'Ürün sepete eklendi',
            'data' => $this->formatCartResponse($cart),
        ]);
    }

    /**
     * Sepet öğesi miktarını güncelle
     */
    public function updateItem(Request $request, int $itemId): JsonResponse
    {
        $request->validate([
            'quantity' => 'required|integer|min:1|max:99',
        ]);

        $cart = $this->getCart($request);
        $item = $cart->items()->findOrFail($itemId);

        // Stok kontrolü
        if ($item->variant_id) {
            $variant = ProductVariant::find($item->variant_id);
            if ($variant && $variant->stock < $request->quantity) {
                return response()->json([
                    'success' => false,
                    'message' => 'Yetersiz stok. Mevcut stok: ' . $variant->stock,
                ], 400);
            }
        }

        $item->update(['quantity' => $request->quantity]);
        $cart->load('items.product', 'items.variant');

        return response()->json([
            'success' => true,
            'message' => 'Miktar güncellendi',
            'data' => $this->formatCartResponse($cart),
        ]);
    }

    /**
     * Sepetten ürün kaldır
     */
    public function removeItem(Request $request, int $itemId): JsonResponse
    {
        $cart = $this->getCart($request);
        $item = $cart->items()->findOrFail($itemId);
        $item->delete();

        $cart->load('items.product', 'items.variant');

        return response()->json([
            'success' => true,
            'message' => 'Ürün sepetten kaldırıldı',
            'data' => $this->formatCartResponse($cart),
        ]);
    }

    /**
     * Sepeti temizle
     */
    public function clear(Request $request): JsonResponse
    {
        $cart = $this->getCart($request);
        $cart->items()->delete();
        $cart->update(['coupon_code' => null, 'discount_amount' => 0]);

        return response()->json([
            'success' => true,
            'message' => 'Sepet temizlendi',
            'data' => $this->formatCartResponse($cart),
        ]);
    }

    /**
     * Kupon uygula
     */
    public function applyCoupon(Request $request): JsonResponse
    {
        $request->validate([
            'code' => 'required|string|max:50',
        ]);

        $cart = $this->getCart($request);
        $cart->load('items');
        
        $code = strtoupper($request->code);
        $subtotal = $cart->items->sum(fn($item) => $item->unit_price * $item->quantity);

        // Mock kuponlar (gerçek uygulamada Coupon modeli olur)
        $coupons = [
            'YAZ20' => ['type' => 'percent', 'value' => 20, 'min_spend' => 500],
            'HOSGELDIN' => ['type' => 'fixed', 'value' => 100, 'min_spend' => 250],
            'KARGO' => ['type' => 'shipping', 'value' => 0, 'min_spend' => 0],
        ];

        if (!isset($coupons[$code])) {
            return response()->json([
                'success' => false,
                'message' => 'Geçersiz kupon kodu',
            ], 400);
        }

        $coupon = $coupons[$code];

        if ($subtotal < $coupon['min_spend']) {
            return response()->json([
                'success' => false,
                'message' => "Bu kupon için minimum sepet tutarı {$coupon['min_spend']} TL olmalıdır.",
            ], 400);
        }

        // İndirim hesapla
        $discount = 0;
        if ($coupon['type'] === 'percent') {
            $discount = ($subtotal * $coupon['value']) / 100;
        } elseif ($coupon['type'] === 'fixed') {
            $discount = $coupon['value'];
        }

        $cart->update([
            'coupon_code' => $code,
            'discount_amount' => min($discount, $subtotal), // Sepet tutarından fazla olamaz
        ]);

        $cart->load('items.product', 'items.variant');

        return response()->json([
            'success' => true,
            'message' => "{$code} kuponu uygulandı!",
            'data' => $this->formatCartResponse($cart),
        ]);
    }

    /**
     * Kuponu kaldır
     */
    public function removeCoupon(Request $request): JsonResponse
    {
        $cart = $this->getCart($request);
        $cart->update(['coupon_code' => null, 'discount_amount' => 0]);
        $cart->load('items.product', 'items.variant');

        return response()->json([
            'success' => true,
            'message' => 'Kupon kaldırıldı',
            'data' => $this->formatCartResponse($cart),
        ]);
    }

    /**
     * Misafir sepetini kullanıcıya aktar (giriş yaptıktan sonra)
     */
    public function merge(Request $request): JsonResponse
    {
        $user = null;
        if ($request->bearerToken()) {
            $user = auth('sanctum')->user();
        }
        
        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Giriş yapmanız gerekiyor',
            ], 401);
        }

        $sessionId = $request->header('X-Cart-Session') ?? $request->session_id;
        if (!$sessionId) {
            return response()->json([
                'success' => true,
                'message' => 'Aktarılacak sepet yok',
                'data' => $this->formatCartResponse($this->getCart($request)),
            ]);
        }

        $guestCart = Cart::where('session_id', $sessionId)->first();
        if ($guestCart && $guestCart->items()->count() > 0) {
            $guestCart->mergeWithUserCart($user->id);
        }

        $userCart = Cart::where('user_id', $user->id)->first();
        $userCart?->load('items.product', 'items.variant');

        return response()->json([
            'success' => true,
            'message' => 'Sepet aktarıldı',
            'data' => $this->formatCartResponse($userCart),
        ]);
    }

    /**
     * Mevcut kullanıcının veya misafirin sepetini getir
     */
    private function getCart(Request $request): Cart
    {
        // Token varsa user'ı kontrol et
        $user = null;
        if ($request->bearerToken()) {
            $user = auth('sanctum')->user();
        }
        
        if ($user) {
            return Cart::firstOrCreate(['user_id' => $user->id]);
        }

        // Misafir için session ID kullan
        $sessionId = $request->header('X-Cart-Session');
        if (!$sessionId) {
            $sessionId = Str::uuid()->toString();
        }

        return Cart::firstOrCreate(['session_id' => $sessionId]);
    }

    /**
     * Sepet response formatı
     */
    private function formatCartResponse(?Cart $cart): array
    {
        if (!$cart) {
            return [
                'items' => [],
                'totals' => [
                    'subtotal' => 0,
                    'discount' => 0,
                    'shipping' => 29.90,
                    'total' => 29.90,
                    'item_count' => 0,
                ],
                'coupon' => null,
                'session_id' => null,
            ];
        }

        $cart->load(['items.product.photos', 'items.variant']);

        $items = $cart->items->map(function ($item) {
            $mainPhoto = $item->product?->photos?->sortBy('sort_order')->first();
            
            return [
                'id' => $item->id,
                'product_id' => $item->product_id,
                'variant_id' => $item->variant_id,
                'quantity' => $item->quantity,
                'unit_price' => (float) $item->unit_price,
                'line_total' => (float) $item->line_total,
                'product' => [
                    'id' => $item->product?->id,
                    'name' => $item->product?->name,
                    'slug' => $item->product?->slug,
                    'image' => $mainPhoto ? ($mainPhoto->url ?: asset('storage/' . $mainPhoto->path)) : null,
                ],
                'variant' => $item->variant ? [
                    'id' => $item->variant->id,
                    'title' => $item->variant->title,
                    'sku' => $item->variant->sku,
                    'stock' => $item->variant->stock,
                ] : null,
            ];
        });

        return [
            'items' => $items,
            'totals' => $cart->totals,
            'coupon' => $cart->coupon_code ? [
                'code' => $cart->coupon_code,
                'discount' => (float) $cart->discount_amount,
            ] : null,
            'session_id' => $cart->session_id,
        ];
    }
}
