<?php

use Illuminate\Support\Facades\Route;

// Admin API
// Note: the application's routing already prefixes API routes with '/api',
// so use 'v1/admin' here to avoid double 'api/api' URIs.
Route::prefix('v1/admin')->group(function () {
    // public
    Route::post('login', [\App\Http\Controllers\Api\V1\Admin\AdminAuthController::class, 'login']);

    // protected admin routes (require Sanctum token, token ability and admin check)
    Route::middleware(['auth:sanctum', 'ability:admin:*', \App\Http\Middleware\EnsureAdmin::class])->group(function () {
        Route::post('logout', [\App\Http\Controllers\Api\V1\Admin\AdminAuthController::class, 'logout']);
        Route::get('me', [\App\Http\Controllers\Api\V1\Admin\AdminAuthController::class, 'me']);
        Route::get('users', [\App\Http\Controllers\Api\V1\Admin\UserController::class, 'index']);
        Route::get('users/{user}', [\App\Http\Controllers\Api\V1\Admin\UserController::class, 'show']);
        Route::put('users/{user}', [\App\Http\Controllers\Api\V1\Admin\UserController::class, 'update']);
        Route::delete('users/{user}', [\App\Http\Controllers\Api\V1\Admin\UserController::class, 'destroy']);
        // vendors CRUD (admin)
        Route::get('vendors', [\App\Http\Controllers\Api\V1\Admin\VendorController::class, 'index']);
        Route::post('vendors', [\App\Http\Controllers\Api\V1\Admin\VendorController::class, 'store']);
        Route::get('vendors/{vendor}', [\App\Http\Controllers\Api\V1\Admin\VendorController::class, 'show']);
        Route::put('vendors/{vendor}', [\App\Http\Controllers\Api\V1\Admin\VendorController::class, 'update']);
        Route::delete('vendors/{vendor}', [\App\Http\Controllers\Api\V1\Admin\VendorController::class, 'destroy']);
        // admin management
        Route::get('admins', [\App\Http\Controllers\Api\V1\Admin\AdminController::class, 'index']);
        Route::post('admins', [\App\Http\Controllers\Api\V1\Admin\AdminController::class, 'store']);
        Route::get('admins/{admin}', [\App\Http\Controllers\Api\V1\Admin\AdminController::class, 'show']);
        Route::put('admins/{admin}', [\App\Http\Controllers\Api\V1\Admin\AdminController::class, 'update']);
        Route::delete('admins/{admin}', [\App\Http\Controllers\Api\V1\Admin\AdminController::class, 'destroy']);
        // admin permission management (only super-admin)
        Route::middleware(['role:super-admin'])->group(function () {
            Route::get('admins/{admin}/permissions', [\App\Http\Controllers\Api\V1\Admin\AdminPermissionsController::class, 'index']);
            Route::put('admins/{admin}/permissions', [\App\Http\Controllers\Api\V1\Admin\AdminPermissionsController::class, 'update']);
        });
    });
});

// Vendor API
Route::prefix('v1/vendor')->group(function () {
    // public
    Route::post('login', [\App\Http\Controllers\Api\V1\Vendor\VendorAuthController::class, 'login']);

    // protected vendor routes
    Route::middleware(['auth:sanctum', 'ability:vendor:*', \App\Http\Middleware\EnsureVendor::class])->group(function () {
        Route::post('logout', [\App\Http\Controllers\Api\V1\Vendor\VendorAuthController::class, 'logout']);
        Route::get('me', [\App\Http\Controllers\Api\V1\Vendor\VendorAuthController::class, 'me']);
        // vendor profile endpoints (self-service)
        Route::put('profile', [\App\Http\Controllers\Api\V1\Vendor\ProfileController::class, 'update']);
        Route::delete('profile', [\App\Http\Controllers\Api\V1\Vendor\ProfileController::class, 'destroy']);
    });
});
