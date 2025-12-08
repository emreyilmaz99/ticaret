<?php

namespace App\Services;

use App\Models\Cart;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\User;
use App\Models\UserAddress;
use App\Models\Vendor;
use App\Models\VendorCoupon;
use App\Models\CouponUsage;
use App\Repositories\CartRepository;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class CheckoutService extends BaseService
{
    protected IyzicoService $iyzicoService;
    protected CartRepository $cartRepo;

    public function __construct(IyzicoService $iyzicoService, CartRepository $cartRepo)
    {
        $this->iyzicoService = $iyzicoService;
        $this->cartRepo = $cartRepo;
    }

    /**
     * Sepeti doğrula (stok, fiyat, vendor durumu)
     */
    public function validateCart(Cart $cart)
    {
        $cart->load(['items.product.vendor', 'items.variant']);
        
        $errors = [];
        
        foreach ($cart->items as $item) {
            // Ürün kontrolü
            if (!$item->product) {
                $errors[] = "Ürün bulunamadı (ID: {$item->product_id})";
                continue;
            }

            // Ürün aktif mi?
            if ($item->product->status !== 'active') {
                $errors[] = "{$item->product->name} artık satışta değil";
                continue;
            }

            // Vendor kontrolü
            $vendor = $item->product->vendor;
            if (!$vendor || !$vendor->canReceivePayments()) {
                $errors[] = "{$item->product->name} satıcısı şu anda ödeme alamıyor";
                continue;
            }

            // Varyant ve stok kontrolü
            if ($item->variant) {
                if (!$item->variant->hasStock($item->quantity)) {
                    $errors[] = "{$item->product->name} ({$item->variant->title}) için yeterli stok yok. Mevcut: {$item->variant->stock}";
                }
            }
        }

        if (!empty($errors)) {
            return $this->errorResponse(implode(', ', $errors), 400, ['errors' => $errors]);
        }

        return $this->successResponse(null, 'Sepet doğrulandı');
    }

    /**
     * Sepetten sipariş oluştur
     */
    public function createOrderFromCart(User $user, Cart $cart, UserAddress $shippingAddress, ?UserAddress $billingAddress = null)
    {
        // Önce sepeti doğrula
        $validation = $this->validateCart($cart);
        if (!$validation->isSuccess()) {
            return $validation;
        }

        try {
            return DB::transaction(function () use ($user, $cart, $shippingAddress, $billingAddress) {
                $cart->load(['items.product.vendor', 'items.variant']);
                $totals = $cart->totals;

                // Sipariş oluştur
                $order = Order::create([
                    'user_id' => $user->id,
                    'status' => Order::STATUS_PENDING,
                    'payment_status' => Order::PAYMENT_PENDING,
                    'shipping_address' => $this->snapshotAddress($shippingAddress),
                    'billing_address' => $billingAddress ? $this->snapshotAddress($billingAddress) : null,
                    'subtotal' => $totals['subtotal'],
                    'shipping_total' => $totals['shipping'],
                    'discount_total' => $totals['discount'] ?? 0,
                    'campaign_discount' => $totals['campaign_discount'] ?? 0,
                    'coupon_discount' => $totals['coupon_discount'] ?? 0,
                    'total' => $totals['total'],
                    'currency' => 'TRY',
                    'coupon_code' => $cart->coupon_code,
                    'iyzico_conversation_id' => $this->generateConversationId(),
                ]);

                // Kupon ID'sini bul ve kaydet
                if ($cart->coupon_code) {
                    $coupon = VendorCoupon::where('code', $cart->coupon_code)->first();
                    if ($coupon) {
                        $order->coupon_id = $coupon->id;
                        $order->save();
                    }
                }

                // Sipariş kalemlerini oluştur
                $basketItems = [];
                
                foreach ($cart->items as $item) {
                    $vendor = $item->product->vendor;
                    $commissionRate = $vendor->commission_rate ?? config('app.default_commission_rate', 10);
                    
                    // Platform komisyonu hesapla
                    $commissionAmount = ($item->line_total * $commissionRate) / 100;
                    
                    // SubMerchant alacağı tutar (komisyon düşülmüş)
                    $submerchantPrice = $item->line_total - $commissionAmount;

                    // Sipariş kalemi oluştur
                    $orderItem = OrderItem::create([
                        'order_id' => $order->id,
                        'vendor_id' => $vendor->id,
                        'product_id' => $item->product_id,
                        'variant_id' => $item->variant_id,
                        'product_name' => $item->product->name,
                        'variant_title' => $item->variant?->title,
                        'sku' => $item->variant?->sku ?? $item->product->sku ?? null,
                        'quantity' => $item->quantity,
                        'unit_price' => $item->unit_price,
                        'line_total' => $item->line_total,
                        'submerchant_key' => $vendor->iyzico_submerchant_key,
                        'submerchant_price' => $submerchantPrice,
                        'commission_rate' => $commissionRate,
                        'commission_amount' => $commissionAmount,
                        'iyzico_item_id' => 'ITEM_' . $order->id . '_' . $item->id,
                        'status' => OrderItem::STATUS_PENDING,
                    ]);

                    // iyzico basket item oluştur
                    $basketItems[] = $this->iyzicoService->buildBasketItem([
                        'id' => $orderItem->iyzico_item_id,
                        'name' => $orderItem->product_name . ($orderItem->variant_title ? ' - ' . $orderItem->variant_title : ''),
                        'category' => $item->product->category?->name ?? 'Genel',
                        'price' => $orderItem->line_total,
                        'submerchant_key' => $orderItem->submerchant_key,
                        'submerchant_price' => $orderItem->submerchant_price,
                    ]);
                }

                // Sipariş geçmişine kaydet
                $order->statusHistory()->create([
                    'old_status' => null,
                    'new_status' => Order::STATUS_PENDING,
                    'note' => 'Sipariş oluşturuldu',
                    'changed_by_type' => 'system',
                    'changed_by_id' => null,
                ]);

                Log::info('Order created from cart', [
                    'order_id' => $order->id,
                    'order_number' => $order->order_number,
                    'user_id' => $user->id,
                    'total' => $order->total,
                    'item_count' => count($basketItems),
                ]);

                return $this->successResponse([
                    'order' => $order,
                    'basket_items' => $basketItems,
                ], 'Sipariş oluşturuldu');
            });

        } catch (\Exception $e) {
            Log::error('Order creation failed', [
                'user_id' => $user->id,
                'error' => $e->getMessage(),
            ]);
            return $this->errorResponse('Sipariş oluşturulamadı: ' . $e->getMessage());
        }
    }

    /**
     * iyzico Checkout Form başlat
     */
    public function initializePayment(Order $order, User $user, UserAddress $shippingAddress, array $basketItems)
    {
        $result = $this->iyzicoService->initializeCheckoutForm($order, $user, $shippingAddress, $basketItems);

        if ($result->isSuccess()) {
            // Token'ı siparişe kaydet
            $order->update([
                'iyzico_token' => $result->getData()['token'],
                'payment_status' => Order::PAYMENT_PROCESSING,
            ]);
        }

        return $result;
    }

    /**
     * iyzico callback işle
     */
    public function handlePaymentCallback(string $token)
    {
        // Siparişi token ile bul
        $order = Order::where('iyzico_token', $token)->first();

        if (!$order) {
            Log::error('Order not found for token', ['token' => $token]);
            return $this->errorResponse('Sipariş bulunamadı', 404);
        }

        // iyzico'dan sonucu sorgula
        $result = $this->iyzicoService->retrieveCheckoutForm($token);

        if (!$result->isSuccess()) {
            $order->updatePaymentStatus(Order::PAYMENT_FAILED);
            return $result;
        }

        $data = $result->getData();

        try {
            return DB::transaction(function () use ($order, $data) {
                // Siparişi güncelle
                $order->update([
                    'iyzico_payment_id' => $data['payment_id'],
                    'iyzico_fraud_status' => $data['fraud_status'],
                    'iyzico_raw_response' => $data['raw_result'] ?? null,
                    'card_type' => $data['card_type'],
                    'card_association' => $data['card_association'],
                    'card_family' => $data['card_family'],
                    'card_bin' => $data['bin_number'],
                    'card_last_four' => $data['last_four_digits'],
                    'installment_count' => $data['installment'] ?? 1,
                    'payment_status' => Order::PAYMENT_PAID,
                    'status' => Order::STATUS_PAID,
                    'paid_at' => now(),
                ]);

                // Sipariş kalemlerini güncelle (payment_items varsa)
                if (!empty($data['payment_items'])) {
                    foreach ($data['payment_items'] as $paymentItem) {
                        $orderItem = $order->items()
                            ->where('iyzico_item_id', $paymentItem->getItemId())
                            ->first();

                        if ($orderItem) {
                            $orderItem->update([
                                'iyzico_payment_transaction_id' => $paymentItem->getPaymentTransactionId(),
                                'iyzico_transaction_status' => $paymentItem->getTransactionStatus(),
                            ]);
                        }
                    }
                }

                // Stokları düşür - artık exception fırlatabilir
                try {
                    $this->decrementStocks($order);
                } catch (\App\Exceptions\InsufficientStockException $e) {
                    // Stok yetersizse ödemeyi geri al
                    Log::error('Insufficient stock after payment', [
                        'order_id' => $order->id,
                        'error' => $e->getMessage(),
                    ]);

                    // TODO: İleride iyzico refund API eklenebilir
                    // $this->iyzicoService->refund($order);

                    // Sipariş durumunu güncelle
                    $order->update([
                        'status' => Order::STATUS_CANCELLED,
                        'payment_status' => Order::PAYMENT_FAILED,
                    ]);

                    $order->statusHistory()->create([
                        'old_status' => Order::STATUS_PAID,
                        'new_status' => Order::STATUS_CANCELLED,
                        'note' => 'Stok yetersiz - Otomatik iptal: ' . $e->getMessage(),
                        'changed_by_type' => 'system',
                        'changed_by_id' => null,
                    ]);

                    throw new \App\Exceptions\BusinessLogicException(
                        'Ödeme alındı ancak stok yetersiz. Siparişiniz iptal edildi, ücret iadesi yapılacaktır.',
                        422
                    );
                }

                // Kupon kullanımını kaydet
                $this->recordCouponUsage($order);

                // Sepeti temizle
                $this->clearUserCart($order->user_id);

                // Sipariş geçmişine kaydet
                $order->statusHistory()->create([
                    'old_status' => Order::STATUS_PENDING,
                    'new_status' => Order::STATUS_PAID,
                    'note' => 'Ödeme başarılı - Payment ID: ' . $data['payment_id'],
                    'changed_by_type' => 'system',
                    'changed_by_id' => null,
                ]);

                Log::info('Payment successful', [
                    'order_id' => $order->id,
                    'payment_id' => $data['payment_id'],
                    'total' => $order->total,
                ]);

                return $this->successResponse([
                    'order' => $order->fresh(['items']),
                    'payment_id' => $data['payment_id'],
                ], 'Ödeme başarılı');
            });

        } catch (\Exception $e) {
            // handleException artık doğru status code döndürecek
            Log::error('Payment callback processing failed', [
                'order_id' => $order->id,
                'error' => $e->getMessage(),
            ]);
            return $this->handleException($e, 'Ödeme işlenirken hata oluştu');
        }
    }

    /**
     * Stokları düşür
     * @throws \App\Exceptions\InsufficientStockException
     */
    protected function decrementStocks(Order $order): void
    {
        $order->load('items.variant');

        foreach ($order->items as $item) {
            if ($item->variant) {
                // Stok azaltmayı dene
                $success = $item->variant->decrementStock($item->quantity);

                // Başarısızsa exception fırlat
                if (!$success) {
                    // Fresh data ile tekrar kontrol et (race condition için)
                    $item->variant->refresh();

                    throw new \App\Exceptions\InsufficientStockException(
                        $item->product_name . ($item->variant_title ? " - {$item->variant_title}" : ''),
                        $item->variant->stock,
                        $item->quantity
                    );
                }
            }
        }
    }

    /**
     * Kupon kullanımını kaydet
     */
    protected function recordCouponUsage(Order $order): void
    {
        if (!$order->coupon_id) {
            return;
        }

        $coupon = VendorCoupon::find($order->coupon_id);
        if (!$coupon) {
            return;
        }

        // Kullanım kaydı oluştur
        CouponUsage::create([
            'coupon_id' => $coupon->id,
            'user_id' => $order->user_id,
            'order_id' => $order->id,
            'discount_applied' => $order->coupon_discount,
        ]);

        // Kupon kullanım sayısını artır
        $coupon->increment('usage_count');
    }

    /**
     * Kullanıcının sepetini temizle
     */
    protected function clearUserCart(int $userId): void
    {
        $cart = $this->cartRepo->findByUserId($userId);
        if ($cart) {
            $cart->items()->delete();
            $cart->update([
                'coupon_code' => null,
                'discount_amount' => 0,
            ]);
        }
    }

    /**
     * Adres snapshot'ı oluştur
     */
    protected function snapshotAddress(UserAddress $address): array
    {
        return [
            'id' => $address->id,
            'label' => $address->label,
            'full_name' => $address->full_name,
            'phone' => $address->phone,
            'country' => $address->country,
            'city' => $address->city,
            'district' => $address->district,
            'neighborhood' => $address->neighborhood,
            'address_line' => $address->address_line,
            'postal_code' => $address->postal_code,
        ];
    }

    /**
     * Generate conversation ID
     */
    protected function generateConversationId(): string
    {
        return config('iyzico.conversation_prefix', 'ticaret_') . uniqid() . '_' . time();
    }
}
