<?php

use Illuminate\Support\Facades\Route;

// Admin API
Route::prefix('api/v1/admin')->group(function () {
    // public
    Route::post('login', [\App\Http\Controllers\Api\V1\Admin\AdminAuthController::class, 'login']);

    // protected admin routes (require Sanctum token and admin check)
    Route::middleware(['auth:sanctum', \App\Http\Middleware\EnsureAdmin::class])->group(function () {
        Route::get('users', [\App\Http\Controllers\Api\V1\Admin\UserController::class, 'index']);
        // future: vendors, orders, etc.
    });
});
