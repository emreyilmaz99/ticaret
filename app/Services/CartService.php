<?php

namespace App\Services;

use App\Core\ServiceResponse;
use App\Models\Cart;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\User;
use App\Repositories\Interfaces\CartRepositoryInterface;
use App\Repositories\Interfaces\CartItemRepositoryInterface;
use App\Repositories\Interfaces\ProductRepositoryInterface;
use Illuminate\Support\Str;

class CartService extends BaseService
{
    protected CartRepositoryInterface $cartRepo;
    protected CartItemRepositoryInterface $cartItemRepo;

    public function __construct(
        CartRepositoryInterface $cartRepo,
        CartItemRepositoryInterface $cartItemRepo
    ) {
        $this->cartRepo = $cartRepo;
        $this->cartItemRepo = $cartItemRepo;
    }

    /**
     * Get cart for user or guest
     */
    public function getCart(?User $user, ?string $sessionId): ServiceResponse
    {
        try {
            $cart = $this->resolveCart($user, $sessionId);
            $formattedCart = $this->formatCartResponse($cart);
            
            return $this->successResponse($formattedCart);
        } catch (\Exception $e) {
            return $this->handleException($e, 'Sepet alınamadı');
        }
    }

    /**
     * Add item to cart
     */
    public function addItem(?User $user, ?string $sessionId, array $data): ServiceResponse
    {
        try {
            $cart = $this->resolveCart($user, $sessionId);
            $productId = $data['product_id'];
            $variantId = $data['variant_id'] ?? null;
            $quantity = $data['quantity'] ?? 1;

            // Validate product
            $product = Product::where('id', $productId)
                ->where('status', 'active')
                ->first();

            if (!$product) {
                return $this->errorResponse('Ürün bulunamadı', 404);
            }

            // Get price from variant
            $price = $product->variants()->first()?->price ?? 0;
            $variant = null;

            if ($variantId) {
                $variant = ProductVariant::where('id', $variantId)
                    ->where('product_id', $productId)
                    ->first();

                if (!$variant) {
                    return $this->errorResponse('Varyant bulunamadı', 404);
                }

                // Stock check
                if ($variant->stock < $quantity) {
                    return $this->errorResponse(
                        'Yetersiz stok. Mevcut stok: ' . $variant->stock,
                        400
                    );
                }

                $price = $variant->price;
            }

            // Check if item already exists in cart
            $existingItem = $this->cartItemRepo->findByCartProductVariant(
                $cart->id,
                $productId,
                $variantId
            );

            if ($existingItem) {
                // Stock check for existing + new quantity
                if ($variant && $variant->stock < ($existingItem->quantity + $quantity)) {
                    return $this->errorResponse(
                        'Yetersiz stok. Mevcut stok: ' . $variant->stock,
                        400
                    );
                }

                $this->cartItemRepo->incrementQuantity($existingItem, $quantity);
                $existingItem->update(['unit_price' => $price]);
            } else {
                $this->cartItemRepo->addItem($cart, [
                    'product_id' => $productId,
                    'variant_id' => $variantId,
                    'quantity' => $quantity,
                    'unit_price' => $price,
                ]);
            }

            $cart = $this->cartRepo->getWithItems($cart);
            
            return $this->successResponse(
                $this->formatCartResponse($cart),
                'Ürün sepete eklendi'
            );
        } catch (\Exception $e) {
            return $this->handleException($e, 'Ürün sepete eklenemedi');
        }
    }

    /**
     * Update item quantity
     */
    public function updateItem(?User $user, ?string $sessionId, int $itemId, int $quantity): ServiceResponse
    {
        try {
            $cart = $this->resolveCart($user, $sessionId);
            $item = $cart->items()->find($itemId);

            if (!$item) {
                return $this->errorResponse('Sepet öğesi bulunamadı', 404);
            }

            // Stock check
            if ($item->variant_id) {
                $variant = ProductVariant::find($item->variant_id);
                if ($variant && $variant->stock < $quantity) {
                    return $this->errorResponse(
                        'Yetersiz stok. Mevcut stok: ' . $variant->stock,
                        400
                    );
                }
            }

            $this->cartItemRepo->updateQuantity($item, $quantity);
            $cart = $this->cartRepo->getWithItems($cart);

            return $this->successResponse(
                $this->formatCartResponse($cart),
                'Miktar güncellendi'
            );
        } catch (\Exception $e) {
            return $this->handleException($e, 'Miktar güncellenemedi');
        }
    }

    /**
     * Remove item from cart
     */
    public function removeItem(?User $user, ?string $sessionId, int $itemId): ServiceResponse
    {
        try {
            $cart = $this->resolveCart($user, $sessionId);
            $item = $cart->items()->find($itemId);

            if (!$item) {
                return $this->errorResponse('Sepet öğesi bulunamadı', 404);
            }

            $this->cartItemRepo->removeItem($item);
            $cart = $this->cartRepo->getWithItems($cart);

            return $this->successResponse(
                $this->formatCartResponse($cart),
                'Ürün sepetten kaldırıldı'
            );
        } catch (\Exception $e) {
            return $this->handleException($e, 'Ürün kaldırılamadı');
        }
    }

    /**
     * Clear cart
     */
    public function clearCart(?User $user, ?string $sessionId): ServiceResponse
    {
        try {
            $cart = $this->resolveCart($user, $sessionId);
            $this->cartRepo->clearItems($cart);
            $this->cartRepo->updateCoupon($cart, null, 0);

            return $this->successResponse(
                $this->formatCartResponse($cart),
                'Sepet temizlendi'
            );
        } catch (\Exception $e) {
            return $this->handleException($e, 'Sepet temizlenemedi');
        }
    }

    /**
     * Apply coupon to cart
     */
    public function applyCoupon(?User $user, ?string $sessionId, string $code): ServiceResponse
    {
        try {
            $cart = $this->resolveCart($user, $sessionId);
            $cart->load('items');

            $code = strtoupper($code);
            $subtotal = $cart->items->sum(fn($item) => $item->unit_price * $item->quantity);

            // Validate coupon (mock coupons - should be from database in production)
            $coupon = $this->validateCoupon($code, $subtotal);
            
            if (!$coupon['valid']) {
                return $this->errorResponse($coupon['message'], 400);
            }

            // Calculate discount
            $discount = $this->calculateDiscount($coupon['data'], $subtotal);
            
            $this->cartRepo->updateCoupon($cart, $code, min($discount, $subtotal));
            $cart = $this->cartRepo->getWithItems($cart);

            return $this->successResponse(
                $this->formatCartResponse($cart),
                "{$code} kuponu uygulandı!"
            );
        } catch (\Exception $e) {
            return $this->handleException($e, 'Kupon uygulanamadı');
        }
    }

    /**
     * Remove coupon from cart
     */
    public function removeCoupon(?User $user, ?string $sessionId): ServiceResponse
    {
        try {
            $cart = $this->resolveCart($user, $sessionId);
            $this->cartRepo->updateCoupon($cart, null, 0);
            $cart = $this->cartRepo->getWithItems($cart);

            return $this->successResponse(
                $this->formatCartResponse($cart),
                'Kupon kaldırıldı'
            );
        } catch (\Exception $e) {
            return $this->handleException($e, 'Kupon kaldırılamadı');
        }
    }

    /**
     * Merge guest cart to user cart
     */
    public function mergeCart(User $user, ?string $sessionId): ServiceResponse
    {
        try {
            if (!$sessionId) {
                $cart = $this->cartRepo->getOrCreateForUser($user->id);
                return $this->successResponse(
                    $this->formatCartResponse($cart),
                    'Aktarılacak sepet yok'
                );
            }

            $cart = $this->cartRepo->mergeGuestCartToUser($sessionId, $user->id);
            $cart = $cart ? $this->cartRepo->getWithItems($cart) : null;

            return $this->successResponse(
                $this->formatCartResponse($cart),
                'Sepet aktarıldı'
            );
        } catch (\Exception $e) {
            return $this->handleException($e, 'Sepet aktarılamadı');
        }
    }

    /**
     * Resolve cart based on user or session
     */
    protected function resolveCart(?User $user, ?string $sessionId): Cart
    {
        if ($user) {
            return $this->cartRepo->getOrCreateForUser($user->id);
        }

        if (!$sessionId) {
            $sessionId = Str::uuid()->toString();
        }

        return $this->cartRepo->getOrCreateForSession($sessionId);
    }

    /**
     * Validate coupon code
     */
    protected function validateCoupon(string $code, float $subtotal): array
    {
        // Mock coupons - In production, this should query the database
        $coupons = [
            'YAZ20' => ['type' => 'percent', 'value' => 20, 'min_spend' => 500],
            'HOSGELDIN' => ['type' => 'fixed', 'value' => 100, 'min_spend' => 250],
            'KARGO' => ['type' => 'shipping', 'value' => 0, 'min_spend' => 0],
        ];

        if (!isset($coupons[$code])) {
            return ['valid' => false, 'message' => 'Geçersiz kupon kodu'];
        }

        $coupon = $coupons[$code];

        if ($subtotal < $coupon['min_spend']) {
            return [
                'valid' => false,
                'message' => "Bu kupon için minimum sepet tutarı {$coupon['min_spend']} TL olmalıdır."
            ];
        }

        return ['valid' => true, 'data' => $coupon];
    }

    /**
     * Calculate discount amount
     */
    protected function calculateDiscount(array $coupon, float $subtotal): float
    {
        return match($coupon['type']) {
            'percent' => ($subtotal * $coupon['value']) / 100,
            'fixed' => $coupon['value'],
            default => 0,
        };
    }

    /**
     * Format cart response
     */
    protected function formatCartResponse(?Cart $cart): array
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
