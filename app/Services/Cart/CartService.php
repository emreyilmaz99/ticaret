<?php

namespace App\Services\Cart;

use App\Core\ServiceResponse;
use App\Models\Cart;
use App\Services\BaseService;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\User;
use App\Repositories\Interfaces\CartRepositoryInterface;
use App\Repositories\Interfaces\CartItemRepositoryInterface;
use Illuminate\Support\Str;

class CartService extends BaseService
{
    protected CartRepositoryInterface $cartRepo;
    protected CartItemRepositoryInterface $cartItemRepo;
    protected CartResponseFormatter $formatter;
    protected CartCouponManager $couponManager;

    public function __construct(
        CartRepositoryInterface $cartRepo,
        CartItemRepositoryInterface $cartItemRepo,
        CartResponseFormatter $formatter,
        CartCouponManager $couponManager
    ) {
        $this->cartRepo = $cartRepo;
        $this->cartItemRepo = $cartItemRepo;
        $this->formatter = $formatter;
        $this->couponManager = $couponManager;
    }

    /**
     * Get cart for user or guest
     */
    public function getCart(?User $user, ?string $sessionId): ServiceResponse
    {
        try {
            $cart = $this->resolveCart($user, $sessionId);
            return $this->successResponse($this->formatter->format($cart));
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
            $product = Product::with('activeFeaturedDeal')
                ->where('id', $productId)
                ->where('status', 'active')
                ->first();

            if (!$product) {
                return $this->errorResponse('Ürün bulunamadı', 404);
            }

            // Check for active featured deal
            $featuredDeal = $product->activeFeaturedDeal;
            
            // Get price from variant or deal price
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

                // Use deal price if available, otherwise variant price
                $price = $featuredDeal ? $featuredDeal->deal_price : $variant->price;
            } else {
                // No variant selected, use deal price if available
                $price = $featuredDeal ? $featuredDeal->deal_price : $price;
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
                $this->formatter->format($cart),
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
                $this->formatter->format($cart),
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
                $this->formatter->format($cart),
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
                $this->formatter->format($cart),
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
            return $this->couponManager->applyCoupon($cart, $code, $user);
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
                $this->formatter->format($cart),
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
                    $this->formatter->format($cart),
                    'Aktarılacak sepet yok'
                );
            }

            $cart = $this->cartRepo->mergeGuestCartToUser($sessionId, $user->id);
            $cart = $cart ? $this->cartRepo->getWithItems($cart) : null;

            return $this->successResponse(
                $this->formatter->format($cart),
                'Sepet aktarıldı'
            );
        } catch (\Exception $e) {
            return $this->handleException($e, 'Sepet aktarılamadı');
        }
    }

    /**
     * Clear cart by user ID (checkout sonrası kullanılır)
     */
    public function clearCartByUserId(int $userId): void
    {
        $cart = $this->cartRepo->findByUserId($userId);
        if ($cart) {
            $this->cartRepo->clearItems($cart);
            $this->cartRepo->updateCoupon($cart, null, 0);
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
}
