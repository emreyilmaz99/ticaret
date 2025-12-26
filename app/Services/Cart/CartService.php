<?php

namespace App\Services\Cart;

use App\Core\ServiceResponse;
use App\Interfaces\Services\Cart\CartServiceInterface;
use App\Models\Cart;
use App\Services\BaseService;
use App\Models\User;
use App\Repositories\Interfaces\CartRepositoryInterface;
use App\Repositories\Interfaces\CartItemRepositoryInterface;
use App\Repositories\Interfaces\ProductRepositoryInterface;
use App\Repositories\Interfaces\ProductVariantRepositoryInterface;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class CartService extends BaseService implements CartServiceInterface
{
    protected CartRepositoryInterface $cartRepo;
    protected CartItemRepositoryInterface $cartItemRepo;
    protected ProductRepositoryInterface $productRepo;
    protected ProductVariantRepositoryInterface $variantRepo;
    protected CartResponseFormatter $formatter;
    protected CartCouponManager $couponManager;

    public function __construct(
        CartRepositoryInterface $cartRepo,
        CartItemRepositoryInterface $cartItemRepo,
        ProductRepositoryInterface $productRepo,
        ProductVariantRepositoryInterface $variantRepo,
        CartResponseFormatter $formatter,
        CartCouponManager $couponManager
    ) {
        $this->cartRepo = $cartRepo;
        $this->cartItemRepo = $cartItemRepo;
        $this->productRepo = $productRepo;
        $this->variantRepo = $variantRepo;
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
            $this->syncCartItemPrices($cart);
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
            $product = $this->productRepo->findActiveWithDeal($productId);

            if (!$product) {
                return $this->errorResponse('Ürün bulunamadı', 404);
            }

            // Check for active featured deal
            $featuredDeal = $product->activeFeaturedDeal;
            
            // Get variant - either specified or first available
            $variant = null;
            
            if ($variantId) {
                $variant = $this->variantRepo->findByIdAndProduct($variantId, $productId);

                if (!$variant) {
                    return $this->errorResponse('Varyant bulunamadı', 404);
                }
            } else {
                // No variant selected, use first variant
                $variant = $this->variantRepo->getFirstForProduct($productId);
                
                if (!$variant) {
                    return $this->errorResponse('Ürün varyantı bulunamadı', 404);
                }
                
                // Set variant_id for cart item
                $variantId = $variant->id;
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

            // Sepet değiştiği için kuponu sıfırla
            $this->cartRepo->updateCoupon($cart, null, 0);
            
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
                $variant = $this->variantRepo->findById($item->variant_id);
                if ($variant && $variant->stock < $quantity) {
                    return $this->errorResponse(
                        'Yetersiz stok. Mevcut stok: ' . $variant->stock,
                        400
                    );
                }
            }

            $this->cartItemRepo->updateQuantity($item, $quantity);
            
            // Sepet değiştiği için kuponu sıfırla
            $this->cartRepo->updateCoupon($cart, null, 0);
            
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
            
            // Sepet değiştiği için kuponu sıfırla
            $this->cartRepo->updateCoupon($cart, null, 0);
            
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
        try {
            $cart = $this->cartRepo->findByUserId($userId);
            if ($cart) {
                $this->cartRepo->clearItems($cart);
                $this->cartRepo->updateCoupon($cart, null, 0);
            }
        } catch (\Exception $e) {
            // Cart silme başarısız olsa bile siparişi etkilememeli
            Log::warning('Failed to clear cart after order', [
                'user_id' => $userId,
                'error' => $e->getMessage(),
            ]);
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
     * Sync cart item prices with current product/deal prices
     * This ensures cart always reflects the latest prices
     */
    protected function syncCartItemPrices(Cart $cart): void
    {
        $cart = $this->cartRepo->loadWithFullRelations($cart);

        foreach ($cart->items as $item) {
            $featuredDeal = $item->product?->activeFeaturedDeal;
            
            if ($featuredDeal) {
                $currentPrice = (float) $featuredDeal->deal_price;
            } else {
                $currentPrice = $item->variant 
                    ? (float) $item->variant->price 
                    : (float) ($item->product?->variants?->first()?->price ?? 0);
            }

            // Only update if price changed
            if ((float) $item->unit_price !== $currentPrice) {
                $this->cartItemRepo->updatePrice($item, $currentPrice);
            }
        }
    }
}
