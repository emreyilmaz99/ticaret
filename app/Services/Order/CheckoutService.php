<?php

namespace App\Services\Order;

use App\Services\BaseService;
use App\Models\Cart;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\User;
use App\Models\UserAddress;
use App\Models\VendorCoupon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Services\Order\OrderService;
use App\Services\Payment\PaymentGatewayService;

class CheckoutService extends BaseService
{
    protected OrderService $orderService;
    protected PaymentGatewayService $paymentGateway;

    public function __construct(OrderService $orderService, PaymentGatewayService $paymentGateway)
    {
        $this->orderService = $orderService;
        $this->paymentGateway = $paymentGateway;
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
        return $this->orderService->createOrderFromCart($user, $cart, $shippingAddress, $billingAddress);
    }

    /**
     * iyzico Checkout Form başlat
     */
    public function initializePayment(Order $order, User $user, UserAddress $shippingAddress, array $basketItems)
    {
        // convert simple basket items to gateway-specific basket items
        $gatewayItems = array_map(function($item) {
            return $this->paymentGateway->buildBasketItem($item);
        }, $basketItems);

        $result = $this->paymentGateway->initializeCheckoutForm($order, $user, $shippingAddress, $gatewayItems);

        if ($result->isSuccess()) {
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
        $order = Order::where('iyzico_token', $token)->first();

        if (!$order) {
            Log::error('Order not found for token', ['token' => $token]);
            return $this->errorResponse('Sipariş bulunamadı', 404);
        }

        $result = $this->paymentGateway->retrieveCheckoutForm($token);

        if (!$result->isSuccess()) {
            $order->updatePaymentStatus(Order::PAYMENT_FAILED);
            return $result;
        }

        $data = $result->getData();

        return $this->orderService->processPaymentSuccess($order, $data);
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
