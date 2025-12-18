<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

// Configure SSL CA certificates for cURL (especially for iyzico)
$cacertPath = dirname(__DIR__) . '/storage/cacert.pem';
if (file_exists($cacertPath)) {
    if (ini_get('curl.cainfo') === '') {
        ini_set('curl.cainfo', $cacertPath);
    }
    if (ini_get('openssl.cafile') === '') {
        ini_set('openssl.cafile', $cacertPath);
    }
}

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        // Enable CORS for API routes
        $middleware->api(prepend: [
            \Illuminate\Http\Middleware\HandleCors::class,
        ]);
        
        $middleware->alias([
            'auth.optional' => \App\Http\Middleware\OptionalAuth::class,
            'ability' => \App\Http\Middleware\CheckSanctumAbilities::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        // Handle unauthenticated responses for API
        $exceptions->renderable(function (\Illuminate\Auth\AuthenticationException $e, $request) {
            if ($request->is('api/*') || $request->expectsJson()) {
                return \App\Core\ApiResponse::error('Unauthenticated.', 401);
            }
        });
    })->create();
