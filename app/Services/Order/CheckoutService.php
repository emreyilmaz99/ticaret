<?php

namespace App\Services\Order;

use App\Enums\PaymentStatus;
use App\Interfaces\Services\Order\CheckoutServiceInterface;
use App\Services\BaseService;
use App\Models\Cart;
use App\Models\Order;
use App\Models\User;
use App\Models\UserAddress;
use App\Repositories\CartRepository;
use App\Repositories\OrderRepository;
use Illuminate\Support\Facades\Log;
use App\Services\Order\OrderService;
use App\Services\Payment\PaymentGatewayService;

class CheckoutService extends BaseService implements CheckoutServiceInterface
{
    public function __construct(
        protected OrderService $orderService,
        protected PaymentGatewayService $paymentGateway,
        protected OrderRepository $orderRepository,
        protected CartRepository $cartRepository
    ) {}

    /**
     * Sepeti doğrula (stok, fiyat, vendor durumu)
     */
    public function validateCart(Cart $cart)
    {
        $cart = $this->cartRepository->loadForValidation($cart);
        
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
            $this->orderRepository->update($order->id, [
                'iyzico_token' => $result->getData()['token'],
                'payment_status' => PaymentStatus::PROCESSING->value,
            ]);
        }

        return $result;
    }

    /**
     * iyzico callback işle
     */
    public function handlePaymentCallback(string $token)
    {
        $order = $this->orderRepository->findByIyzicoToken($token);

        if (!$order) {
            Log::error('Order not found for token', ['token' => $token]);
            return $this->errorResponse('Sipariş bulunamadı', 404);
        }

        $result = $this->paymentGateway->retrieveCheckoutForm($token);

        if (!$result->isSuccess()) {
            $this->orderRepository->update($order->id, [
                'payment_status' => PaymentStatus::FAILED->value,
            ]);
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
