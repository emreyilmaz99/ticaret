<?php

namespace App\Http\Controllers\Api\V1\User;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\User\InitializeCheckoutRequest;
use App\Services\Order\CheckoutService;
use App\Services\User\UserAddressService;
use App\Traits\ResponseHttp;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CheckoutController extends Controller
{
    use ResponseHttp;

    public function __construct(
        protected CheckoutService $checkoutService,
        protected UserAddressService $addressService
    ) {}

    /**
     * Checkout başlat - iyzico Checkout Form oluştur
     * POST /api/checkout/initialize
     */
    public function initialize(InitializeCheckoutRequest $request): JsonResponse
    {
        $user = $request->user();

        // Kimlik numarası kontrolü
        if (empty($user->identity_number)) {
            return $this->error('Ödeme yapabilmek için kimlik numaranızı profilinize eklemeniz gerekiyor', 422);
        }

        // Kullanıcının sepetini al
        $cart = $user->cart;
        if (!$cart || $cart->items->isEmpty()) {
            return $this->error('Sepetiniz boş', 400);
        }

        // Adresleri kontrol et
        $shippingAddressResult = $this->addressService->getAddress($user->id, $request->shipping_address_id);
        if (!$shippingAddressResult->isSuccess()) {
            return $this->fromServiceResponse($shippingAddressResult);
        }
        $shippingAddress = $shippingAddressResult->getData()['address'];

        $billingAddress = null;
        if ($request->billing_address_id) {
            $billingAddressResult = $this->addressService->getAddress($user->id, $request->billing_address_id);
            if (!$billingAddressResult->isSuccess()) {
                return $this->fromServiceResponse($billingAddressResult);
            }
            $billingAddress = $billingAddressResult->getData()['address'];
        }

        // Sepetten sipariş oluştur
        $orderResult = $this->checkoutService->createOrderFromCart(
            $user,
            $cart,
            $shippingAddress,
            $billingAddress
        );

        if (!$orderResult->isSuccess()) {
            return $this->fromServiceResponse($orderResult);
        }

        $orderData = $orderResult->getData();
        $order = $orderData['order'];
        $basketItems = $orderData['basket_items'];

        // iyzico Checkout Form başlat
        $paymentResult = $this->checkoutService->initializePayment(
            $order,
            $user,
            $shippingAddress,
            $basketItems
        );

        if (!$paymentResult->isSuccess()) {
            return $this->fromServiceResponse($paymentResult);
        }

        $paymentData = $paymentResult->getData();

        return $this->success([
            'order_id' => $order->id,
            'order_number' => $order->order_number,
            'checkout_form_content' => $paymentData['checkoutFormContent'],
            'payment_page_url' => $paymentData['paymentPageUrl'],
        ], 'Ödeme formu hazır');
    }

    /**
     * iyzico callback handler
     * POST /api/checkout/callback
     */
    public function callback(Request $request)
    {
        $token = $request->input('token');
        
        if (empty($token)) {
            return $this->error('Token bulunamadı', 400);
        }

        $result = $this->checkoutService->handlePaymentCallback($token);

        if (!$result->isSuccess()) {
            return redirect()->away(config('app.frontend_url') . '/odeme/basarisiz?error=' . urlencode($result->getMessage()));
        }

        $data = $result->getData();
        $order = $data['order'];

        return redirect()->away(config('app.frontend_url') . '/odeme/basarili?order=' . $order->order_number);
    }

    /**
     * Sipariş durumunu kontrol et (AJAX polling için)
     * GET /api/checkout/status/{orderNumber}
     */
    public function status(Request $request, string $orderNumber): JsonResponse
    {
        $user = $request->user();
        
        $order = \App\Models\Order::where('order_number', $orderNumber)
            ->where('user_id', $user->id)
            ->first();

        if (!$order) {
            return $this->error('Sipariş bulunamadı', 404);
        }

        return $this->success([
            'order_number' => $order->order_number,
            'status' => $order->status,
            'payment_status' => $order->payment_status,
            'status_label' => $order->status_label,
            'payment_status_label' => $order->payment_status_label,
            'paid_at' => $order->paid_at,
        ]);
    }
}
