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
use App\Http\Controllers\Admin\CommissionPlanController;

// Vendor controllers
use App\Http\Controllers\Api\V1\Vendor\VendorAuthController;
use App\Http\Controllers\Api\V1\Vendor\RegistrationController as VendorRegistrationController;
use App\Http\Controllers\Api\V1\Vendor\ProfileController as VendorProfileController;
use App\Http\Controllers\Api\V1\Vendor\AddressController as VendorAddressController;
use App\Http\Controllers\Api\V1\Vendor\BankAccountController as VendorBankAccountController;
use App\Http\Controllers\Api\V1\Vendor\PayoutController as SelfVendorPayoutController;

// Public controllers
use App\Http\Controllers\Api\V1\Public\VendorController as PublicVendorController;
use App\Http\Controllers\Api\V1\Public\VendorApplicationController as PublicVendorApplicationController;
use App\Http\Controllers\Api\V1\Admin\VendorApplicationController as AdminVendorApplicationController;

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
        Route::delete('users/{user}', [UserController::class, 'destroy']);
        // vendors CRUD (admin)
        Route::get('vendors', [AdminVendorController::class, 'index']);
        Route::post('vendors', [AdminVendorController::class, 'store']);
        Route::get('vendors/{vendor}', [AdminVendorController::class, 'show']);
        Route::put('vendors/{vendor}', [AdminVendorController::class, 'update']);
        Route::delete('vendors/{vendor}', [AdminVendorController::class, 'destroy']);
        Route::put('vendors/{vendor}/status', [AdminVendorController::class, 'updateStatus']);
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
        Route::post('vendor-applications/{id}/approve-full', [AdminVendorApplicationController::class, 'approveFullApplication']);
        Route::post('vendor-applications/{id}/reject', [AdminVendorApplicationController::class, 'reject']);
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
        // vendor products (self-service)
        Route::get('products', [\App\Http\Controllers\Api\V1\Vendor\ProductController::class, 'index']);
        Route::post('products', [\App\Http\Controllers\Api\V1\Vendor\ProductController::class, 'store']);
        Route::get('products/{product}', [\App\Http\Controllers\Api\V1\Vendor\ProductController::class, 'show']);
        Route::put('products/{product}', [\App\Http\Controllers\Api\V1\Vendor\ProductController::class, 'update']);
        Route::delete('products/{product}', [\App\Http\Controllers\Api\V1\Vendor\ProductController::class, 'destroy']);
        // vendor profile endpoints (self-service)
        Route::put('profile', [VendorProfileController::class, 'update']);
        Route::delete('profile', [VendorProfileController::class, 'destroy']);

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
        // vendor categories (self-service)
        Route::get('categories', [\App\Http\Controllers\Api\V1\Vendor\CategoryController::class, 'index']);
        Route::post('categories', [\App\Http\Controllers\Api\V1\Vendor\CategoryController::class, 'store']);
        Route::delete('categories/{id}', [\App\Http\Controllers\Api\V1\Vendor\CategoryController::class, 'destroy']);
        // onboarding completion (vendor marks their onboarding as finished)
        Route::post('onboarding/complete', [VendorProfileController::class, 'completeOnboarding']);
    });
});

// Public vendor profile by slug (public)
Route::get('v1/vendors/{slug}', [PublicVendorController::class, 'show']);

// Public vendor application submission
Route::post('v1/vendor-applications', [PublicVendorApplicationController::class, 'store']);

// units (public)
Route::get('v1/units', [\App\Http\Controllers\Api\V1\Public\UnitsController::class, 'index']);
