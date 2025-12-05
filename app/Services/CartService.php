<?php

namespace App\Services;

use App\Core\ServiceResponse;
use App\Models\Cart;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\User;
use App\Models\VendorCoupon;
use App\Models\VendorShippingSetting;
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
            $cart->load('items.product');

            $code = strtoupper($code);
            
            // Kupon ara
            $coupon = VendorCoupon::where('code', $code)
                ->where('is_active', true)
                ->first();

            if (!$coupon) {
                return $this->errorResponse('Geçersiz kupon kodu', 400);
            }

            // Kuponun satıcısının ürünlerini sepette bul ve satıcı alt toplamı hesapla
            $vendorItems = $cart->items->filter(fn($item) => $item->product->vendor_id === $coupon->vendor_id);
            
            if ($vendorItems->isEmpty()) {
                return $this->errorResponse('Bu kupon sepetinizdeki ürünler için geçerli değil', 400);
            }

            $vendorSubtotal = $vendorItems->sum(fn($item) => $item->unit_price * $item->quantity);

            // Kupon geçerlilik kontrolü (vendor subtotal ile)
            $userId = $user ? $user->id : null;
            $validation = $coupon->isValidForUser($userId, $vendorSubtotal);
            
            if (!$validation['valid']) {
                return $this->errorResponse($validation['message'], 400);
            }

            // Calculate discount (sadece satıcının alt toplamını geçemez)
            $discount = $coupon->calculateDiscount($vendorSubtotal);
            
            $this->cartRepo->updateCoupon($cart, $code, $discount);
            $cart = $this->cartRepo->getWithItems($cart);

            return $this->successResponse(
                $this->formatCartResponse($cart),
                "{$code} kuponu uygulandı! {$discount} TL indirim kazandınız."
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
     * Format cart response with vendor grouping
     */
    protected function formatCartResponse(?Cart $cart): array
    {
        if (!$cart) {
            return [
                'items' => [],
                'vendor_groups' => [],
                'totals' => [
                    'subtotal' => 0,
                    'discount' => 0,
                    'shipping' => 0,
                    'total' => 0,
                    'item_count' => 0,
                ],
                'coupon' => null,
                'session_id' => null,
            ];
        }

        $cart->load(['items.product.photos', 'items.product.vendor', 'items.variant']);

        // Ürünleri vendor'a göre grupla
        $vendorGroups = [];
        $allItems = [];

        foreach ($cart->items as $item) {
            $vendorId = $item->product?->vendor_id;
            $vendor = $item->product?->vendor;
            
            if (!$vendorId || !$vendor) continue;

            // Vendor grup oluştur
            if (!isset($vendorGroups[$vendorId])) {
                $vendorGroups[$vendorId] = [
                    'vendor_id' => $vendorId,
                    'vendor_name' => $vendor->company_name ?? $vendor->name,
                    'vendor_slug' => $vendor->slug,
                    'items' => [],
                    'subtotal' => 0,
                    'shipping' => [
                        'cost' => 0,
                        'is_free' => false,
                        'free_threshold' => 0,
                        'remaining_for_free' => null,
                    ],
                    'estimated_delivery' => $this->calculateEstimatedDelivery(),
                ];
            }

            // Item formatla
            $formattedItem = $this->formatCartItem($item);
            $vendorGroups[$vendorId]['items'][] = $formattedItem;
            $vendorGroups[$vendorId]['subtotal'] += (float) $item->line_total;
            
            $allItems[] = $formattedItem;
        }

        // Her vendor için kargo hesapla
        $totalShipping = 0;
        $shippingBreakdown = [];
        
        foreach ($vendorGroups as $vendorId => &$group) {
            $shippingSettings = VendorShippingSetting::getSettingsForVendor($vendorId);
            
            $shippingCost = $shippingSettings->calculateShippingCost($group['subtotal']);
            $remainingForFree = $shippingSettings->getRemainingForFreeShipping($group['subtotal']);
            
            $group['shipping'] = [
                'cost' => $shippingCost,
                'is_free' => $shippingCost == 0,
                'free_threshold' => (float) $shippingSettings->free_shipping_threshold,
                'remaining_for_free' => $remainingForFree,
            ];
            
            // Shipping breakdown için ekle
            $shippingBreakdown[] = [
                'vendor_id' => $vendorId,
                'vendor_name' => $group['vendor_name'],
                'shipping_cost' => $shippingCost,
                'is_free' => $shippingCost == 0,
                'remaining_for_free' => $remainingForFree,
            ];
            
            $totalShipping += $shippingCost;
        }
        unset($group);

        // Toplam hesapla
        $subtotal = array_sum(array_column($vendorGroups, 'subtotal'));
        $discount = (float) ($cart->discount_amount ?? 0);
        $total = $subtotal - $discount + $totalShipping;

        return [
            'items' => $allItems,
            'vendor_groups' => array_values($vendorGroups),
            'totals' => [
                'subtotal' => round($subtotal, 2),
                'discount' => round($discount, 2),
                'shipping' => round($totalShipping, 2),
                'shipping_breakdown' => $shippingBreakdown,
                'total' => round(max(0, $total), 2),
                'item_count' => count($allItems),
            ],
            'coupon' => $cart->coupon_code ? [
                'code' => $cart->coupon_code,
                'discount' => $discount,
            ] : null,
            'session_id' => $cart->session_id,
        ];
    }

    /**
     * Format individual cart item
     */
    protected function formatCartItem($item): array
    {
        $mainPhoto = $item->product?->photos?->sortBy('sort_order')->first();
        
        // Resim URL'sini düzgün şekilde oluştur
        $imageUrl = null;
        if ($mainPhoto) {
            if ($mainPhoto->path) {
                $imageUrl = url('storage/' . $mainPhoto->path);
            } elseif ($mainPhoto->url) {
                if (filter_var($mainPhoto->url, FILTER_VALIDATE_URL)) {
                    $imageUrl = $mainPhoto->url;
                } else {
                    $imageUrl = url(ltrim($mainPhoto->url, '/'));
                }
            }
        }

        return [
            'id' => $item->id,
            'product_id' => $item->product_id,
            'variant_id' => $item->variant_id,
            'quantity' => $item->quantity,
            'unit_price' => (float) $item->unit_price,
            'line_total' => (float) $item->line_total,
            'vendor_id' => $item->product?->vendor_id,
            'product' => [
                'id' => $item->product?->id,
                'name' => $item->product?->name,
                'slug' => $item->product?->slug,
                'image' => $imageUrl,
            ],
            'variant' => $item->variant ? [
                'id' => $item->variant->id,
                'title' => $item->variant->title,
                'sku' => $item->variant->sku,
                'stock' => $item->variant->stock,
            ] : null,
        ];
    }

    /**
     * Tahmini teslimat tarihini hesapla
     */
    protected function calculateEstimatedDelivery(): string
    {
        // Basit hesaplama: 3-5 iş günü
        $now = now();
        $deliveryDate = $now->copy();
        
        // Hafta sonu kontrolü ve 3-5 iş günü ekle
        $businessDays = rand(3, 5);
        while ($businessDays > 0) {
            $deliveryDate->addDay();
            // Hafta içi mi kontrol et (1=Pazartesi, 7=Pazar)
            if ($deliveryDate->dayOfWeekIso <= 5) {
                $businessDays--;
            }
        }
        
        // Türkçe tarih formatı
        $days = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'];
        $months = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
        
        $dayName = $days[$deliveryDate->dayOfWeekIso - 1];
        $monthName = $months[$deliveryDate->month - 1];
        
        return "Tahmini {$deliveryDate->day} {$monthName} {$dayName} kapında";
    }
}
