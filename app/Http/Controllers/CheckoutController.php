<?php

namespace App\Http\Controllers;

use App\Http\Requests\Api\V1\InitializeCheckoutRequest;
use App\Models\Order;
use App\Models\UserAddress;
use App\Services\CheckoutService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class CheckoutController extends Controller
{
    protected CheckoutService $checkoutService;

    public function __construct(CheckoutService $checkoutService)
    {
        $this->checkoutService = $checkoutService;
    }

    /**
     * Checkout başlat - iyzico Checkout Form oluştur
     * POST /api/checkout/initialize
     */
    public function initialize(InitializeCheckoutRequest $request): JsonResponse
    {
        $user = $request->user();

        // Kimlik numarası kontrolü
        if (empty($user->identity_number)) {
            return response()->json([
                'success' => false,
                'message' => 'Ödeme yapabilmek için kimlik numaranızı profilinize eklemeniz gerekiyor',
            ], 422);
        }

        // Kullanıcının sepetini al
        $cart = $user->cart;
        if (!$cart || $cart->items->isEmpty()) {
            return response()->json([
                'success' => false,
                'message' => 'Sepetiniz boş',
            ], 400);
        }

        // Adresleri al
        $shippingAddress = UserAddress::where('user_id', $user->id)
            ->where('id', $request->shipping_address_id)
            ->first();
        
        if (!$shippingAddress) {
            return response()->json([
                'success' => false,
                'message' => 'Teslimat adresi bulunamadı',
            ], 404);
        }

        $billingAddress = null;
        if ($request->billing_address_id) {
            $billingAddress = UserAddress::where('user_id', $user->id)
                ->where('id', $request->billing_address_id)
                ->first();
        }

        // Sepetten sipariş oluştur
        $orderResult = $this->checkoutService->createOrderFromCart(
            $user,
            $cart,
            $shippingAddress,
            $billingAddress
        );

        if (!$orderResult->isSuccess()) {
            return response()->json([
                'success' => false,
                'message' => $orderResult->getMessage(),
                'data' => $orderResult->getData(),
            ], $orderResult->getStatusCode());
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
            // Sipariş oluşturuldu ama ödeme başlatılamadı
            $order->updatePaymentStatus(Order::PAYMENT_FAILED);
            return response()->json([
                'success' => false,
                'message' => $paymentResult->getMessage(),
            ], $paymentResult->getStatusCode());
        }

        $paymentData = $paymentResult->getData();

        return response()->json([
            'success' => true,
            'message' => 'Ödeme formu hazır',
            'data' => [
                'order_id' => $order->id,
                'order_number' => $order->order_number,
                'checkout_form_content' => $paymentData['checkoutFormContent'],
                'payment_page_url' => $paymentData['paymentPageUrl'],
            ],
        ]);
    }

    /**
     * iyzico callback handler
     * POST /api/checkout/callback
     */
    public function callback(Request $request)
    {
        Log::info('iyzico callback received', $request->all());

        $token = $request->input('token');
        
        if (empty($token)) {
            return response()->json([
                'success' => false,
                'message' => 'Token bulunamadı',
            ], 400);
        }

        $result = $this->checkoutService->handlePaymentCallback($token);

        if (!$result->isSuccess()) {
            Log::error('Payment callback failed', [
                'token' => $token,
                'error' => $result->getMessage(),
            ]);

            // Başarısız ödeme sayfasına yönlendir (frontend URL)
            return redirect()->away(config('app.frontend_url') . '/odeme/basarisiz?error=' . urlencode($result->getMessage()));
        }

        $data = $result->getData();
        $order = $data['order'];

        Log::info('Payment callback successful', [
            'order_id' => $order->id,
            'order_number' => $order->order_number,
        ]);

        // Başarılı ödeme sayfasına yönlendir (frontend URL)
        return redirect()->away(config('app.frontend_url') . '/odeme/basarili?order=' . $order->order_number);
    }

    /**
     * Sipariş durumunu kontrol et (AJAX polling için)
     * GET /api/checkout/status/{orderNumber}
     */
    public function status(Request $request, string $orderNumber): JsonResponse
    {
        $user = $request->user();
        
        $order = Order::where('order_number', $orderNumber)
            ->where('user_id', $user->id)
            ->first();

        if (!$order) {
            return response()->json([
                'success' => false,
                'message' => 'Sipariş bulunamadı',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => [
                'order_number' => $order->order_number,
                'status' => $order->status,
                'payment_status' => $order->payment_status,
                'status_label' => $order->status_label,
                'payment_status_label' => $order->payment_status_label,
                'paid_at' => $order->paid_at,
            ],
        ]);
    }

    /**
     * Sipariş detayı
     * GET /api/orders/{orderNumber}
     */
    public function show(Request $request, string $orderNumber): JsonResponse
    {
        $user = $request->user();
        
        $order = Order::with(['items.vendor', 'statusHistory'])
            ->where('order_number', $orderNumber)
            ->where('user_id', $user->id)
            ->first();

        if (!$order) {
            return response()->json([
                'success' => false,
                'message' => 'Sipariş bulunamadı',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => [
                'order' => $order,
            ],
        ]);
    }

    /**
     * Kullanıcının siparişleri
     * GET /api/orders
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        
        $orders = Order::where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->paginate($request->input('per_page', 10));

        return response()->json([
            'success' => true,
            'data' => [
                'orders' => $orders,
            ],
        ]);
    }

    /**
     * Siparişi iptal et (sadece pending durumda)
     * POST /api/orders/{orderNumber}/cancel
     */
    public function cancel(Request $request, string $orderNumber): JsonResponse
    {
        $user = $request->user();
        
        $order = Order::where('order_number', $orderNumber)
            ->where('user_id', $user->id)
            ->first();

        if (!$order) {
            return response()->json([
                'success' => false,
                'message' => 'Sipariş bulunamadı',
            ], 404);
        }

        if (!$order->isCancellable()) {
            return response()->json([
                'success' => false,
                'message' => 'Bu sipariş iptal edilemez',
            ], 400);
        }

        $order->updateStatus(Order::STATUS_CANCELLED, 'Kullanıcı tarafından iptal edildi', $user);

        return response()->json([
            'success' => true,
            'message' => 'Sipariş iptal edildi',
            'data' => [
                'order' => $order->fresh(),
            ],
        ]);
    }
}
