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
        Route::get('me', [\App\Http\Controllers\Api\V1\Admin\AdminAuthController::class, 'me']);
        Route::get('users', [\App\Http\Controllers\Api\V1\Admin\UserController::class, 'index']);
        // future: vendors, orders, etc.
    });
});
