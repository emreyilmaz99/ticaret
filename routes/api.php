<?php

use Illuminate\Support\Facades\Route;
use App\Http\Middleware\EnsureAdmin;
use App\Http\Middleware\EnsureVendor;

// Unified controllers
use App\Http\Controllers\Api\V1\Unified\UnifiedProfileController;
use App\Http\Controllers\Api\V1\Unified\UnifiedOrdersController;
use App\Http\Controllers\Api\V1\Unified\UnifiedAddressesController;
use App\Http\Controllers\Api\V1\Unified\UnifiedReviewsController;
use App\Http\Controllers\Api\V1\Unified\UnifiedProductsController;
use App\Http\Controllers\Api\V1\Unified\UnifiedVendorsController;
use App\Http\Controllers\Api\V1\Unified\UnifiedCategoriesController;
use App\Http\Controllers\Api\V1\Unified\UnifiedUsersController;
use App\Http\Controllers\Api\V1\Unified\UnifiedAdminsController;

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
use App\Http\Controllers\Api\V1\Public\PublicVendorController;
use App\Http\Controllers\Api\V1\Public\VendorApplicationController as PublicVendorApplicationController;
use App\Http\Controllers\Api\V1\Admin\VendorApplicationController as AdminVendorApplicationController;
use App\Http\Controllers\Api\V1\Public\ProductController as PublicProductController;
use App\Http\Controllers\Api\V1\Public\TaxClassController as PublicTaxClassController;
use App\Http\Controllers\Api\V1\Public\FeaturedDealController;
use App\Http\Controllers\Api\V1\Public\ProductReviewController;
use App\Http\Controllers\Api\V1\Public\SearchController;

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
    Route::middleware(['auth:sanctum', \App\Http\Middleware\CheckSanctumAbilities::class . ':admin:*', EnsureAdmin::class])->group(function () {
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

        Route::get('orders/{orderId}/user-orders', [\App\Http\Controllers\Api\V1\Admin\OrderController::class, 'getUserOrders']);

        // featured deals management
        Route::get('featured-deals', [AdminFeaturedDealController::class, 'index']);
        Route::get('featured-deals/create', [AdminFeaturedDealController::class, 'create']);

        // banned words management
        Route::get('banned-words', [\App\Http\Controllers\Api\V1\Admin\AdminBannedWordController::class, 'index']);
        Route::get('banned-words/stats', [\App\Http\Controllers\Api\V1\Admin\AdminBannedWordController::class, 'stats']);
        Route::post('banned-words', [\App\Http\Controllers\Api\V1\Admin\AdminBannedWordController::class, 'store']);
        Route::post('banned-words/bulk', [\App\Http\Controllers\Api\V1\Admin\AdminBannedWordController::class, 'bulkStore']);
        Route::post('banned-words/test', [\App\Http\Controllers\Api\V1\Admin\AdminBannedWordController::class, 'test']);
        Route::post('banned-words/bulk-delete', [\App\Http\Controllers\Api\V1\Admin\AdminBannedWordController::class, 'bulkDestroy']);
        Route::put('banned-words/{id}', [\App\Http\Controllers\Api\V1\Admin\AdminBannedWordController::class, 'update']);
        Route::delete('banned-words/{id}', [\App\Http\Controllers\Api\V1\Admin\AdminBannedWordController::class, 'destroy']);
        Route::delete('banned-words/bulk', [\App\Http\Controllers\Api\V1\Admin\AdminBannedWordController::class, 'bulkDestroy']);

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
    Route::middleware(['auth:sanctum', \App\Http\Middleware\CheckSanctumAbilities::class . ':vendor:*', EnsureVendor::class])->group(function () {
        Route::post('logout', [VendorAuthController::class, 'logout']);
        Route::get('me', [VendorAuthController::class, 'me']);
        
        // Application status and submission (for vendors in pre_approved status)
        Route::get('application/status', [\App\Http\Controllers\Api\V1\Vendor\ApplicationController::class, 'status']);
        Route::post('application/submit-full', [\App\Http\Controllers\Api\V1\Vendor\ApplicationController::class, 'submitFullApplication']);
        
        // vendor profile endpoints (self-service)
        Route::delete('profile', [VendorProfileController::class, 'destroy']);
        Route::get('my-categories', [VendorProfileController::class, 'myCategories']);
        Route::get('my-categories/for-products', [VendorProfileController::class, 'myCategoriesForProducts']);
        Route::put('my-categories', [VendorProfileController::class, 'updateMyCategories']);

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

        // vendor products
        Route::get('products', [\App\Http\Controllers\Api\V1\Vendor\ProductController::class, 'index']);
        Route::post('products', [\App\Http\Controllers\Api\V1\Vendor\ProductController::class, 'store']);
        Route::get('products/{id}', [\App\Http\Controllers\Api\V1\Vendor\ProductController::class, 'show'])->where('id', '[A-Z0-9]+');
        Route::put('products/{id}', [\App\Http\Controllers\Api\V1\Vendor\ProductController::class, 'update'])->where('id', '[A-Z0-9]+');
        Route::put('products/{id}/status', [\App\Http\Controllers\Api\V1\Vendor\ProductController::class, 'updateStatus'])->where('id', '[A-Z0-9]+');
        Route::delete('products/{id}', [\App\Http\Controllers\Api\V1\Vendor\ProductController::class, 'destroy'])->where('id', '[A-Z0-9]+');
        Route::delete('products/{id}/photos/{photoId}', [\App\Http\Controllers\Api\V1\Vendor\ProductController::class, 'destroyPhoto'])->where(['id' => '[A-Z0-9]+', 'photoId' => '[0-9]+']);

        // vendor review responses
        Route::get('products/{productId}/reviews', [VendorReviewController::class, 'index'])->where('productId', '[A-Z0-9]+');
    });
});

// Public vendor application submission (only pre-application)
Route::post('v1/vendor-applications', [PublicVendorApplicationController::class, 'store']);
Route::get('v1/vendor-applications/{id}', [PublicVendorApplicationController::class, 'show']);

// units (public)
Route::get('v1/units', [\App\Http\Controllers\Api\V1\Public\UnitsController::class, 'index']);

// categories (public) - index and tree only, slug routes moved to end of file
Route::get('v1/categories', [\App\Http\Controllers\Api\V1\Public\CategoryController::class, 'index']);
Route::get('v1/categories/tree', [\App\Http\Controllers\Api\V1\Public\CategoryController::class, 'tree']);

// tax classes (public - for vendors and product display)
Route::get('v1/tax-classes', [PublicTaxClassController::class, 'index']);
Route::post('v1/tax-classes/calculate', [PublicTaxClassController::class, 'calculate']);

// search (public)
Route::get('v1/search', [SearchController::class, 'search']);

// products (public) - index, categories, featured only. Slug routes moved to end of file
Route::get('v1/products', [PublicProductController::class, 'index']);
Route::get('v1/products/categories', [PublicProductController::class, 'categories']);
Route::get('v1/products/featured', [PublicProductController::class, 'featured']);

// product reviews (public) - only numeric product IDs
Route::get('v1/products/{productId}/reviews', [ProductReviewController::class, 'index'])->where('productId', '[0-9]+');
Route::get('v1/products/{productId}/review-summary', [ProductReviewController::class, 'summary'])->where('productId', '[0-9]+');
Route::post('v1/reviews/{reviewId}/helpful', [ProductReviewController::class, 'voteHelpful']);

// featured deals (public)
Route::get('v1/featured-deals', [FeaturedDealController::class, 'index']);
Route::post('v1/featured-deals/{deal}/click', [FeaturedDealController::class, 'click']);
Route::post('v1/featured-deals/{deal}/conversion', [FeaturedDealController::class, 'conversion']);

// Cart API (requires authentication - no guest cart)
Route::prefix('v1/cart')->middleware(['auth:sanctum', \App\Http\Middleware\CheckSanctumAbilities::class . ':user:*'])->group(function () {
    Route::get('/', [\App\Http\Controllers\Api\V1\Public\CartController::class, 'index']);
    Route::post('/items', [\App\Http\Controllers\Api\V1\Public\CartController::class, 'addItem']);
    Route::put('/items/{itemId}', [\App\Http\Controllers\Api\V1\Public\CartController::class, 'updateItem']);
    Route::delete('/items/{itemId}', [\App\Http\Controllers\Api\V1\Public\CartController::class, 'removeItem']);
    Route::delete('/clear', [\App\Http\Controllers\Api\V1\Public\CartController::class, 'clear']);
    Route::post('/coupon', [\App\Http\Controllers\Api\V1\Public\CartController::class, 'applyCoupon']);
    Route::delete('/coupon', [\App\Http\Controllers\Api\V1\Public\CartController::class, 'removeCoupon']);
});

// User API
Route::prefix('v1/user')->group(function () {
    // Public routes
    Route::post('register', [UserAuthController::class, 'register']);
    Route::post('login', [UserAuthController::class, 'login']);

    // Protected user routes
    Route::middleware(['auth:sanctum', \App\Http\Middleware\CheckSanctumAbilities::class . ':user:*'])->group(function () {
        Route::post('logout', [UserAuthController::class, 'logout']);
        Route::get('me', [UserAuthController::class, 'me']);

        // Profile
        Route::put('password', [UserProfileController::class, 'updatePassword']);
        Route::post('avatar', [UserProfileController::class, 'updateAvatar']);
        Route::delete('avatar', [UserProfileController::class, 'deleteAvatar']);

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
    });
});

// iyzico callback (public - no auth required)
// Bu route iyzico tarafından çağrılır, kullanıcı auth'u yoktur
Route::post('v1/checkout/callback', [CheckoutController::class, 'callback']);

// Categories tree (public - no auth required for this specific endpoint)
Route::get('v1/categories/tree', [\App\Http\Controllers\Api\V1\Public\CategoryController::class, 'tree']);

// ============================================================================
// UNIFIED ENDPOINTS (Works for User, Vendor, Admin based on token)
// ============================================================================
Route::prefix('v1')->middleware(['auth:sanctum', 'detect.user.type'])->group(function () {
    // Profile endpoints - automatically detects user type from token
    Route::get('me', [UnifiedProfileController::class, 'show']);
    Route::get('profile', [UnifiedProfileController::class, 'show']); // Alias for /me
    Route::put('profile', [UnifiedProfileController::class, 'update']);

    // Orders - User: their orders, Vendor: orders with their products, Admin: all orders
    Route::get('orders', [UnifiedOrdersController::class, 'index']);
    Route::get('orders/stats', [UnifiedOrdersController::class, 'stats']);
    Route::get('orders/{orderNumber}', [UnifiedOrdersController::class, 'show']);
    Route::put('orders/{orderId}/status', [UnifiedOrdersController::class, 'updateStatus']);
    Route::post('orders/{orderNumberOrId}/cancel', [UnifiedOrdersController::class, 'cancel']);
    Route::post('orders/{orderId}/notes', [UnifiedOrdersController::class, 'addNote']); // Admin only
    Route::get('orders/{orderId}/notes', [UnifiedOrdersController::class, 'getNotes']); // Admin only

    // Addresses - User & Vendor only
    Route::get('addresses', [UnifiedAddressesController::class, 'index']);
    Route::post('addresses', [UnifiedAddressesController::class, 'store']);
    Route::get('addresses/{address}', [UnifiedAddressesController::class, 'show']);
    Route::put('addresses/{address}', [UnifiedAddressesController::class, 'update']);
    Route::delete('addresses/{address}', [UnifiedAddressesController::class, 'destroy']);
    Route::put('addresses/{address}/default', [UnifiedAddressesController::class, 'setDefault']); // User only

    // Reviews - User: their reviews, Vendor: product reviews, Admin: all reviews
    Route::get('reviews', [UnifiedReviewsController::class, 'index']);
    Route::get('reviews/stats', [UnifiedReviewsController::class, 'stats']); // Vendor & Admin
    Route::get('reviews/trashed', [UnifiedReviewsController::class, 'trashed']); // Admin only
    Route::get('reviewable-orders', [UnifiedReviewsController::class, 'reviewableOrders']); // User only
    Route::post('orders/{orderId}/items/{orderItemId}/review', [UnifiedReviewsController::class, 'store'])->middleware('throttle:10,1'); // User only
    Route::delete('reviews/{reviewId}', [UnifiedReviewsController::class, 'destroy']); // User & Admin
    Route::post('reviews/{id}/approve', [UnifiedReviewsController::class, 'approve']); // Admin only
    Route::post('reviews/{id}/reject', [UnifiedReviewsController::class, 'reject']); // Admin only
    Route::post('reviews/bulk-approve', [UnifiedReviewsController::class, 'bulkApprove']); // Admin only
    Route::post('reviews/bulk-reject', [UnifiedReviewsController::class, 'bulkReject']); // Admin only
    Route::post('reviews/{reviewId}/response', [UnifiedReviewsController::class, 'storeResponse']); // Vendor only
    Route::delete('review-responses/{responseId}', [UnifiedReviewsController::class, 'destroyResponse']); // Vendor only

    // Products - Vendor: their products, Admin: all products
    // Note: GET /products for authenticated users is handled separately to avoid conflict with public route
    Route::get('products/my-products', [UnifiedProductsController::class, 'index']); // Vendor & Admin - use this for authenticated product list
    Route::get('products/statistics', [UnifiedProductsController::class, 'statistics']); // Admin only
    Route::post('products/bulk-status', [UnifiedProductsController::class, 'bulkUpdateStatus']); // Admin only
    Route::post('products', [UnifiedProductsController::class, 'store']); // Vendor only
    Route::get('products/{id}', [UnifiedProductsController::class, 'show'])->where('id', '[A-Z0-9]+'); // Vendor & Admin
    Route::put('products/{id}', [UnifiedProductsController::class, 'update'])->where('id', '[A-Z0-9]+'); // Vendor & Admin
    Route::put('products/{id}/status', [UnifiedProductsController::class, 'updateStatus'])->where('id', '[A-Z0-9]+'); // Vendor & Admin
    Route::delete('products/{id}', [UnifiedProductsController::class, 'destroy'])->where('id', '[A-Z0-9]+'); // Vendor & Admin
    Route::delete('products/{id}/photos/{photoId}', [UnifiedProductsController::class, 'destroyPhoto'])->where(['id' => '[A-Z0-9]+', 'photoId' => '[0-9]+']); // Vendor only

    // Vendors - Admin only (numeric IDs only)
    Route::get('vendors', [UnifiedVendorsController::class, 'index']); // Admin only
    Route::get('vendors/{vendor}', [UnifiedVendorsController::class, 'show'])->where('vendor', '[0-9]+'); // Admin only
    Route::put('vendors/{vendor}', [UnifiedVendorsController::class, 'update'])->where('vendor', '[0-9]+'); // Admin only
    Route::delete('vendors/{vendor}', [UnifiedVendorsController::class, 'destroy'])->where('vendor', '[0-9]+'); // Admin only
    Route::get('vendors/{vendor}/categories', [UnifiedVendorsController::class, 'getVendorCategories'])->where('vendor', '[0-9]+'); // Admin only
    Route::put('vendors/{vendor}/status', [UnifiedVendorsController::class, 'updateStatus'])->where('vendor', '[0-9]+'); // Admin only

    // Categories - All users can read, Admin can manage
    Route::get('categories', [UnifiedCategoriesController::class, 'index']); // All users
    Route::get('categories/statistics', [UnifiedCategoriesController::class, 'statistics']); // Admin only
    // Route::get('categories/tree', [UnifiedCategoriesController::class, 'tree']); // Moved to public routes above
    Route::get('categories/{category}', [UnifiedCategoriesController::class, 'show']); // All users

    // Users - Admin only
    Route::get('users', [UnifiedUsersController::class, 'index']); // Admin only
    Route::get('users/{user}', [UnifiedUsersController::class, 'show']); // Admin only
    Route::put('users/{user}', [UnifiedUsersController::class, 'update']); // Admin only
    Route::delete('users/{user}', [UnifiedUsersController::class, 'destroy']); // Admin only
    Route::put('users/{user}/toggle-status', [UnifiedUsersController::class, 'toggleStatus']); // Admin only
    Route::get('users/{user}/orders', [UnifiedUsersController::class, 'getUserOrders']); // Admin only

    // Admins - Admin only (super-admin for create/delete)
    Route::get('admins', [UnifiedAdminsController::class, 'index']); // Admin only
    Route::post('admins', [UnifiedAdminsController::class, 'store']); // Super-admin only
    Route::get('admins/{admin}', [UnifiedAdminsController::class, 'show']); // Admin only
    Route::put('admins/{admin}', [UnifiedAdminsController::class, 'update']); // Admin only
    Route::delete('admins/{admin}', [UnifiedAdminsController::class, 'destroy']); // Super-admin only
});

// ============================================================================
// PUBLIC SLUG ROUTES - Must be LAST so authenticated/unified routes match first
// ============================================================================

// Public vendor store routes (slug only, NOT numeric IDs)
Route::get('v1/vendors/{slug}', [PublicVendorController::class, 'show'])->where('slug', '(?![0-9]+$)[a-zA-Z0-9\-_]+');
Route::get('v1/vendors/{slug}/products', [PublicVendorController::class, 'products'])->where('slug', '(?![0-9]+$)[a-zA-Z0-9\-_]+');
Route::get('v1/vendors/{slug}/categories', [PublicVendorController::class, 'categories'])->where('slug', '(?![0-9]+$)[a-zA-Z0-9\-_]+');
Route::get('v1/vendors/{slug}/reviews', [PublicVendorController::class, 'reviews'])->where('slug', '(?![0-9]+$)[a-zA-Z0-9\-_]+');

// Public product slug routes (slugs with hyphens/underscores, excludes pure uppercase ULIDs)
// Matches: tekno-mobile-telefon, iphone-15, product_name
// Excludes: 01KCJZVBNGYNMVQBE98738ND7H (pure uppercase ULID)
Route::get('v1/products/{slug}', [PublicProductController::class, 'show'])->where('slug', '(?!^[A-Z0-9]+$)[a-zA-Z0-9\-_]+');
Route::get('v1/products/{slug}/related', [PublicProductController::class, 'related'])->where('slug', '(?!^[A-Z0-9]+$)[a-zA-Z0-9\-_]+');

// Public category slug routes
Route::get('v1/categories/{slug}', [\App\Http\Controllers\Api\V1\Public\CategoryController::class, 'show']);
