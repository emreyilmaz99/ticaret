<?php

use Illuminate\Support\Facades\Route;
use App\Http\Middleware\EnsureAdmin;
use App\Http\Middleware\EnsureVendor;

// Admin controllers
use App\Http\Controllers\Api\V1\Admin\AdminAuthController;
use App\Http\Controllers\Api\V1\Admin\UserController;
use App\Http\Controllers\Api\V1\Admin\VendorController as AdminVendorController;
use App\Http\Controllers\Api\V1\Admin\AdminController;
use App\Http\Controllers\Api\V1\Admin\AdminPermissionsController;
use App\Http\Controllers\Api\V1\Admin\VendorPayoutController as AdminVendorPayoutController;
use App\Http\Controllers\Api\V1\Admin\CommissionPlanController;
use App\Http\Controllers\Api\V1\Admin\ProductController as AdminProductController;
use App\Http\Controllers\Api\V1\Admin\CategoryController as AdminCategoryController;
use App\Http\Controllers\Api\V1\Admin\TaxClassController as AdminTaxClassController;
use App\Http\Controllers\Api\V1\Admin\AdminFeaturedDealController;
use App\Http\Controllers\Api\V1\Admin\AdminReviewController;

// Vendor controllers
use App\Http\Controllers\Api\V1\Vendor\VendorAuthController;
use App\Http\Controllers\Api\V1\Vendor\RegistrationController as VendorRegistrationController;
use App\Http\Controllers\Api\V1\Vendor\ProfileController as VendorProfileController;
use App\Http\Controllers\Api\V1\Vendor\AddressController as VendorAddressController;
use App\Http\Controllers\Api\V1\Vendor\BankAccountController as VendorBankAccountController;
use App\Http\Controllers\Api\V1\Vendor\PayoutController as SelfVendorPayoutController;
use App\Http\Controllers\Api\V1\Vendor\VendorReviewController;

// User controllers
use App\Http\Controllers\Api\V1\User\UserAuthController;
use App\Http\Controllers\Api\V1\User\UserProfileController;
use App\Http\Controllers\Api\V1\User\UserAddressController;
use App\Http\Controllers\Api\V1\User\UserReviewController;

// Public controllers
use App\Http\Controllers\Api\V1\Public\VendorController as PublicVendorController;
use App\Http\Controllers\Api\V1\Public\VendorApplicationController as PublicVendorApplicationController;
use App\Http\Controllers\Api\V1\Admin\VendorApplicationController as AdminVendorApplicationController;
use App\Http\Controllers\Api\V1\Public\ProductController as PublicProductController;
use App\Http\Controllers\Api\V1\Public\TaxClassController as PublicTaxClassController;
use App\Http\Controllers\Api\V1\Public\FeaturedDealController;
use App\Http\Controllers\Api\V1\Public\ProductReviewController;

// Checkout controller
use App\Http\Controllers\Api\V1\User\CheckoutController;
use App\Http\Controllers\Api\V1\User\OrderController;

// Admin API
// Note: the application's routing already prefixes API routes with '/api',
// so use 'v1/admin' here to avoid double 'api/api' URIs.
Route::prefix('v1/admin')->group(function () {
    // public
    Route::post('login', [AdminAuthController::class, 'login']);

    // protected admin routes (require Sanctum token, token ability and admin check)
    Route::middleware(['auth:sanctum', 'ability:admin:*', EnsureAdmin::class])->group(function () {
        Route::post('logout', [AdminAuthController::class, 'logout']);
        Route::get('me', [AdminAuthController::class, 'me']);
        Route::get('users', [UserController::class, 'index']);
        Route::get('users/{user}', [UserController::class, 'show']);
        Route::put('users/{user}', [UserController::class, 'update']);
        Route::put('users/{user}/toggle-status', [UserController::class, 'toggleStatus']);
        Route::delete('users/{user}', [UserController::class, 'destroy']);
        Route::get('users/{user}/orders', [UserController::class, 'getUserOrders']);
        // vendors CRUD (admin)
        Route::get('vendors', [AdminVendorController::class, 'index']);
        Route::post('vendors', [AdminVendorController::class, 'store']);
        Route::get('vendors/{vendor}', [AdminVendorController::class, 'show']);
        Route::put('vendors/{vendor}', [AdminVendorController::class, 'update']);
        Route::delete('vendors/{vendor}', [AdminVendorController::class, 'destroy']);
        Route::put('vendors/{vendor}/status', [AdminVendorController::class, 'updateStatus']);
        // vendor categories (read-only for admin)
        Route::get('vendors/{vendor}/categories', [AdminVendorController::class, 'getVendorCategories']);
        // admin management
        Route::get('admins', [AdminController::class, 'index']);
        Route::post('admins', [AdminController::class, 'store']);
        Route::get('admins/{admin}', [AdminController::class, 'show']);
        Route::put('admins/{admin}', [AdminController::class, 'update']);
        Route::delete('admins/{admin}', [AdminController::class, 'destroy']);
        // admin permission management (only super-admin)
        Route::middleware(['role:super-admin'])->group(function () {
            Route::get('admins/{admin}/permissions', [AdminPermissionsController::class, 'index']);
            Route::put('admins/{admin}/permissions', [AdminPermissionsController::class, 'update']);
        });

        // admin vendor payouts management
        Route::get('vendors/payouts', [AdminVendorPayoutController::class, 'index']);
        Route::get('vendors/payouts/{payout}', [AdminVendorPayoutController::class, 'show']);
        Route::put('vendors/payouts/{payout}', [AdminVendorPayoutController::class, 'update']);

        // commission plans management
        Route::get('commission-plans', [CommissionPlanController::class, 'index']);
        Route::post('commission-plans', [CommissionPlanController::class, 'store']);
        Route::get('commission-plans/active', [CommissionPlanController::class, 'active']);
        Route::get('commission-plans/default', [CommissionPlanController::class, 'default']);
        Route::get('commission-plans/{id}', [CommissionPlanController::class, 'show']);
        Route::put('commission-plans/{id}', [CommissionPlanController::class, 'update']);
        Route::delete('commission-plans/{id}', [CommissionPlanController::class, 'destroy']);
        Route::post('commission-plans/{id}/set-default', [CommissionPlanController::class, 'setDefault']);
        Route::post('commission-plans/{id}/toggle-active', [CommissionPlanController::class, 'toggleActive']);
        Route::post('vendors/{vendorId}/assign-commission-plan', [CommissionPlanController::class, 'assignToVendor']);

        // vendor applications management
        Route::get('vendor-applications', [AdminVendorApplicationController::class, 'index']);
        Route::get('vendor-applications/pending-pre', [AdminVendorApplicationController::class, 'pendingPreApplications']);
        Route::get('vendor-applications/{id}', [AdminVendorApplicationController::class, 'show']);
        Route::post('vendor-applications/{id}/approve-pre', [AdminVendorApplicationController::class, 'approvePreApplication']);
        Route::post('vendor-applications/{id}/reject-pre', [AdminVendorApplicationController::class, 'rejectPreApplication']);
        Route::post('vendor-applications/{id}/approve-full', [AdminVendorApplicationController::class, 'approveFullApplication']);
        Route::post('vendor-applications/{id}/reject-full', [AdminVendorApplicationController::class, 'rejectFullApplication']);
        
        // Vendor-based approval routes (alternative to application-based)
        Route::post('vendors/{vendorId}/approve-full', [AdminVendorApplicationController::class, 'approveVendorFull']);
        Route::post('vendors/{vendorId}/reject-full', [AdminVendorApplicationController::class, 'rejectVendorFull']);

        // products management
        Route::get('products', [AdminProductController::class, 'index']);
        Route::get('products/statistics', [AdminProductController::class, 'statistics']);
        Route::get('products/{id}', [AdminProductController::class, 'show']);
        Route::put('products/{id}/status', [AdminProductController::class, 'updateStatus']);
        Route::post('products/bulk-status', [AdminProductController::class, 'bulkUpdateStatus']);
        Route::delete('products/{id}', [AdminProductController::class, 'destroy']);

        // categories management
        Route::get('categories', [AdminCategoryController::class, 'index']);
        Route::get('categories/tree', [AdminCategoryController::class, 'tree']);
        Route::get('categories/statistics', [AdminCategoryController::class, 'statistics']);
        Route::post('categories', [AdminCategoryController::class, 'store']);
        Route::get('categories/{category}', [AdminCategoryController::class, 'show']);
        Route::put('categories/{category}', [AdminCategoryController::class, 'update']);
        Route::delete('categories/{category}', [AdminCategoryController::class, 'destroy']);
        Route::post('categories/bulk-status', [AdminCategoryController::class, 'bulkUpdateStatus']);
        Route::post('categories/update-order', [AdminCategoryController::class, 'updateOrder']);

        // tax classes management
        Route::get('tax-classes', [AdminTaxClassController::class, 'index']);
        Route::post('tax-classes', [AdminTaxClassController::class, 'store']);
        Route::get('tax-classes/{id}', [AdminTaxClassController::class, 'show']);
        Route::put('tax-classes/{id}', [AdminTaxClassController::class, 'update']);
        Route::delete('tax-classes/{id}', [AdminTaxClassController::class, 'destroy']);

        // orders management
        Route::get('orders', [\App\Http\Controllers\Api\V1\Admin\OrderController::class, 'index']);
        Route::get('orders/stats', [\App\Http\Controllers\Api\V1\Admin\OrderController::class, 'stats']);
        Route::put('orders/{orderId}/status', [\App\Http\Controllers\Api\V1\Admin\OrderController::class, 'updateStatus']);
        Route::post('orders/{orderId}/cancel', [\App\Http\Controllers\Api\V1\Admin\OrderController::class, 'cancel']);
        Route::post('orders/{orderId}/notes', [\App\Http\Controllers\Api\V1\Admin\OrderController::class, 'addNote']);
        Route::get('orders/{orderId}/notes', [\App\Http\Controllers\Api\V1\Admin\OrderController::class, 'getNotes']);
        Route::get('orders/{orderId}/user-orders', [\App\Http\Controllers\Api\V1\Admin\OrderController::class, 'getUserOrders']);

        // featured deals management
        Route::get('featured-deals', [AdminFeaturedDealController::class, 'index']);
        Route::get('featured-deals/create', [AdminFeaturedDealController::class, 'create']);

        // review management
        Route::get('reviews', [AdminReviewController::class, 'index']);
        Route::get('reviews/stats', [AdminReviewController::class, 'stats']);
        Route::get('reviews/trashed', [AdminReviewController::class, 'trashed']);
        Route::post('reviews/bulk-approve', [AdminReviewController::class, 'bulkApprove']);
        Route::post('reviews/bulk-reject', [AdminReviewController::class, 'bulkReject']);
        Route::post('reviews/{id}/approve', [AdminReviewController::class, 'approve']);
        Route::post('reviews/{id}/reject', [AdminReviewController::class, 'reject']);
        Route::post('featured-deals', [AdminFeaturedDealController::class, 'store']);
        Route::get('featured-deals/{deal}', [AdminFeaturedDealController::class, 'show']);
        Route::put('featured-deals/{deal}', [AdminFeaturedDealController::class, 'update']);
        Route::delete('featured-deals/{deal}', [AdminFeaturedDealController::class, 'destroy']);
        Route::post('featured-deals/{deal}/toggle', [AdminFeaturedDealController::class, 'toggle']);
        Route::post('featured-deals/reorder', [AdminFeaturedDealController::class, 'reorder']);
    });
});

// Vendor API
Route::prefix('v1/vendor')->group(function () {
    // public
    Route::post('login', [VendorAuthController::class, 'login']);
    Route::post('register', [VendorRegistrationController::class, 'store']);

    // protected vendor routes
    Route::middleware(['auth:sanctum', 'ability:vendor:*', EnsureVendor::class])->group(function () {
        Route::post('logout', [VendorAuthController::class, 'logout']);
        Route::get('me', [VendorAuthController::class, 'me']);
        
        // Application status and submission (for vendors in pre_approved status)
        Route::get('application/status', [\App\Http\Controllers\Api\V1\Vendor\ApplicationController::class, 'status']);
        Route::post('application/submit-full', [\App\Http\Controllers\Api\V1\Vendor\ApplicationController::class, 'submitFullApplication']);
        
        // vendor products (self-service)
        Route::get('products', [\App\Http\Controllers\Api\V1\Vendor\ProductController::class, 'index']);
        Route::post('products', [\App\Http\Controllers\Api\V1\Vendor\ProductController::class, 'store']);
        Route::get('products/{product}', [\App\Http\Controllers\Api\V1\Vendor\ProductController::class, 'show']);
        Route::put('products/{product}', [\App\Http\Controllers\Api\V1\Vendor\ProductController::class, 'update']);
        Route::put('products/{product}/status', [\App\Http\Controllers\Api\V1\Vendor\ProductController::class, 'updateStatus']);
        Route::delete('products/{product}', [\App\Http\Controllers\Api\V1\Vendor\ProductController::class, 'destroy']);
        Route::delete('products/{product}/photos/{photo}', [\App\Http\Controllers\Api\V1\Vendor\ProductController::class, 'destroyPhoto']);
        // vendor profile endpoints (self-service)
        Route::put('profile', [VendorProfileController::class, 'update']);
        Route::delete('profile', [VendorProfileController::class, 'destroy']);
        Route::get('my-categories', [VendorProfileController::class, 'myCategories']);
        Route::get('my-categories/for-products', [VendorProfileController::class, 'myCategoriesForProducts']);
        Route::put('my-categories', [VendorProfileController::class, 'updateMyCategories']);

        // vendor orders
        Route::get('orders', [\App\Http\Controllers\Api\V1\Vendor\OrderController::class, 'index']);
        Route::get('orders/stats', [\App\Http\Controllers\Api\V1\Vendor\OrderController::class, 'stats']);
        Route::put('orders/{orderId}/status', [\App\Http\Controllers\Api\V1\Vendor\OrderController::class, 'updateStatus']);
        Route::post('orders/{orderId}/cancel', [\App\Http\Controllers\Api\V1\Vendor\OrderController::class, 'cancel']);

        // vendor addresses
        Route::get('addresses', [VendorAddressController::class, 'index']);
        Route::post('addresses', [VendorAddressController::class, 'store']);
        Route::put('addresses/{address}', [VendorAddressController::class, 'update']);
        Route::delete('addresses/{address}', [VendorAddressController::class, 'destroy']);

        // vendor bank accounts
        Route::get('bank-accounts', [VendorBankAccountController::class, 'index']);
        Route::post('bank-accounts', [VendorBankAccountController::class, 'store']);
        Route::put('bank-accounts/{account}', [VendorBankAccountController::class, 'update']);
        Route::delete('bank-accounts/{account}', [VendorBankAccountController::class, 'destroy']);

        // vendor payouts
        Route::get('payouts', [SelfVendorPayoutController::class, 'index']);
        Route::post('payouts', [SelfVendorPayoutController::class, 'store']);
        // onboarding completion (vendor marks their onboarding as finished)
        Route::post('onboarding/complete', [VendorProfileController::class, 'completeOnboarding']);
        
        // vendor shipping settings
        Route::get('shipping-settings', [\App\Http\Controllers\Api\V1\Vendor\ShippingSettingController::class, 'show']);
        Route::put('shipping-settings', [\App\Http\Controllers\Api\V1\Vendor\ShippingSettingController::class, 'update']);
        
        // vendor coupons
        Route::get('coupons', [\App\Http\Controllers\Api\V1\Vendor\CouponController::class, 'index']);
        Route::post('coupons', [\App\Http\Controllers\Api\V1\Vendor\CouponController::class, 'store']);
        Route::get('coupons/{coupon}', [\App\Http\Controllers\Api\V1\Vendor\CouponController::class, 'show']);
        Route::put('coupons/{coupon}', [\App\Http\Controllers\Api\V1\Vendor\CouponController::class, 'update']);
        Route::delete('coupons/{coupon}', [\App\Http\Controllers\Api\V1\Vendor\CouponController::class, 'destroy']);
        Route::put('coupons/{coupon}/toggle', [\App\Http\Controllers\Api\V1\Vendor\CouponController::class, 'toggle']);
        
        // vendor campaigns
        Route::get('campaigns', [\App\Http\Controllers\Api\V1\Vendor\CampaignController::class, 'index']);
        Route::post('campaigns', [\App\Http\Controllers\Api\V1\Vendor\CampaignController::class, 'store']);
        Route::get('campaigns/{campaign}', [\App\Http\Controllers\Api\V1\Vendor\CampaignController::class, 'show']);
        Route::put('campaigns/{campaign}', [\App\Http\Controllers\Api\V1\Vendor\CampaignController::class, 'update']);
        Route::delete('campaigns/{campaign}', [\App\Http\Controllers\Api\V1\Vendor\CampaignController::class, 'destroy']);
        Route::put('campaigns/{campaign}/toggle', [\App\Http\Controllers\Api\V1\Vendor\CampaignController::class, 'toggle']);

        // vendor review responses
        Route::get('products/{productId}/reviews', [VendorReviewController::class, 'index']);
        Route::post('reviews/{reviewId}/response', [VendorReviewController::class, 'storeResponse']);
        Route::delete('review-responses/{responseId}', [VendorReviewController::class, 'destroyResponse']);
        Route::get('review-stats', [VendorReviewController::class, 'stats']);
    });
});

// Public vendor store routes (public)
Route::get('v1/vendors/{slug}', [PublicVendorController::class, 'show']);
Route::get('v1/vendors/{slug}/products', [PublicVendorController::class, 'products']);
Route::get('v1/vendors/{slug}/categories', [PublicVendorController::class, 'categories']);
Route::get('v1/vendors/{slug}/reviews', [PublicVendorController::class, 'reviews']);

// Public vendor application submission (only pre-application)
Route::post('v1/vendor-applications', [PublicVendorApplicationController::class, 'store']);
Route::get('v1/vendor-applications/{id}', [PublicVendorApplicationController::class, 'show']);

// units (public)
Route::get('v1/units', [\App\Http\Controllers\Api\V1\Public\UnitsController::class, 'index']);

// categories (public)
Route::get('v1/categories', [\App\Http\Controllers\Api\V1\Public\CategoryController::class, 'index']);
Route::get('v1/categories/tree', [\App\Http\Controllers\Api\V1\Public\CategoryController::class, 'tree']);
Route::get('v1/categories/{slug}', [\App\Http\Controllers\Api\V1\Public\CategoryController::class, 'show']);

// tax classes (public - for vendors and product display)
Route::get('v1/tax-classes', [PublicTaxClassController::class, 'index']);
Route::post('v1/tax-classes/calculate', [PublicTaxClassController::class, 'calculate']);

// products (public)
Route::get('v1/products', [PublicProductController::class, 'index']);
Route::get('v1/products/categories', [PublicProductController::class, 'categories']);
Route::get('v1/products/featured', [PublicProductController::class, 'featured']);
Route::get('v1/products/{slug}', [PublicProductController::class, 'show']);
Route::get('v1/products/{slug}/related', [PublicProductController::class, 'related']);

// product reviews (public)
Route::get('v1/products/{productId}/reviews', [ProductReviewController::class, 'index']);
Route::get('v1/products/{productId}/review-summary', [ProductReviewController::class, 'summary']);

// featured deals (public)
Route::get('v1/featured-deals', [FeaturedDealController::class, 'index']);
Route::post('v1/featured-deals/{deal}/click', [FeaturedDealController::class, 'click']);
Route::post('v1/featured-deals/{deal}/conversion', [FeaturedDealController::class, 'conversion']);

// Cart API (supports both guest and authenticated users)
// Uses optional auth - will authenticate if token present, otherwise continue as guest
Route::prefix('v1/cart')->middleware(['auth.optional:sanctum'])->group(function () {
    Route::get('/', [\App\Http\Controllers\Api\V1\Public\CartController::class, 'index']);
    Route::post('/items', [\App\Http\Controllers\Api\V1\Public\CartController::class, 'addItem']);
    Route::put('/items/{itemId}', [\App\Http\Controllers\Api\V1\Public\CartController::class, 'updateItem']);
    Route::delete('/items/{itemId}', [\App\Http\Controllers\Api\V1\Public\CartController::class, 'removeItem']);
    Route::delete('/clear', [\App\Http\Controllers\Api\V1\Public\CartController::class, 'clear']);
    Route::post('/coupon', [\App\Http\Controllers\Api\V1\Public\CartController::class, 'applyCoupon']);
    Route::delete('/coupon', [\App\Http\Controllers\Api\V1\Public\CartController::class, 'removeCoupon']);
    Route::post('/merge', [\App\Http\Controllers\Api\V1\Public\CartController::class, 'merge']);
});

// User API
Route::prefix('v1/user')->group(function () {
    // Public routes
    Route::post('register', [UserAuthController::class, 'register']);
    Route::post('login', [UserAuthController::class, 'login']);

    // Protected user routes
    Route::middleware(['auth:sanctum', 'ability:user:*'])->group(function () {
        Route::post('logout', [UserAuthController::class, 'logout']);
        Route::get('me', [UserAuthController::class, 'me']);

        // Profile
        Route::get('profile', [UserProfileController::class, 'show']);
        Route::put('profile', [UserProfileController::class, 'update']);
        Route::put('password', [UserProfileController::class, 'updatePassword']);
        Route::post('avatar', [UserProfileController::class, 'updateAvatar']);
        Route::delete('avatar', [UserProfileController::class, 'deleteAvatar']);

        // Addresses
        Route::get('addresses', [UserAddressController::class, 'index']);
        Route::post('addresses', [UserAddressController::class, 'store']);
        Route::get('addresses/{address}', [UserAddressController::class, 'show']);
        Route::put('addresses/{address}', [UserAddressController::class, 'update']);
        Route::delete('addresses/{address}', [UserAddressController::class, 'destroy']);
        Route::put('addresses/{address}/default', [UserAddressController::class, 'setDefault']);
        Route::post('addresses/{id}/restore', [UserAddressController::class, 'restore']);

        // Favorites
        Route::get('favorites', [\App\Http\Controllers\Api\V1\User\FavoriteController::class, 'index']);
        Route::post('favorites', [\App\Http\Controllers\Api\V1\User\FavoriteController::class, 'store']);
        Route::post('favorites/toggle', [\App\Http\Controllers\Api\V1\User\FavoriteController::class, 'toggle']);
        Route::post('favorites/check', [\App\Http\Controllers\Api\V1\User\FavoriteController::class, 'check']);
        Route::delete('favorites/clear', [\App\Http\Controllers\Api\V1\User\FavoriteController::class, 'clear']);
        Route::get('favorites/count', [\App\Http\Controllers\Api\V1\User\FavoriteController::class, 'count']);
        Route::delete('favorites/{productId}', [\App\Http\Controllers\Api\V1\User\FavoriteController::class, 'destroy']);

        // Checkout - iyzico payment
        Route::post('checkout/initialize', [CheckoutController::class, 'initialize']);
        Route::get('checkout/status/{orderNumber}', [CheckoutController::class, 'status']);

        // Orders
        Route::get('orders', [OrderController::class, 'index']);
        Route::get('orders/{orderNumber}', [OrderController::class, 'show']);
        Route::post('orders/{orderNumber}/cancel', [OrderController::class, 'cancel']);

        // Reviews - user can create, view, and delete their reviews
        Route::get('reviewable-orders', [UserReviewController::class, 'reviewableOrders']);
        Route::post('orders/{orderId}/items/{orderItemId}/review', [UserReviewController::class, 'store'])
            ->middleware('throttle:10,1'); // Rate limit: 10 reviews per minute
        Route::get('reviews', [UserReviewController::class, 'index']);
        Route::delete('reviews/{reviewId}', [UserReviewController::class, 'destroy']);
    });
});

// iyzico callback (public - no auth required)
// Bu route iyzico tarafından çağrılır, kullanıcı auth'u yoktur
Route::post('v1/checkout/callback', [CheckoutController::class, 'callback']);
