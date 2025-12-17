<?php

namespace App\Http\Middleware;

use App\Core\ApiResponse;
use Closure;
use Illuminate\Http\Request;
use Laravel\Sanctum\Exceptions\MissingAbilityException;

class CheckSanctumAbilities
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next, ...$abilities)
    {
        if (! $request->user() || ! $request->user()->currentAccessToken()) {
            return ApiResponse::error('Unauthenticated', 401);
        }

        foreach ($abilities as $ability) {
            if (! $request->user()->tokenCan($ability)) {
                return ApiResponse::error('Forbidden - insufficient token abilities', 403);
            }
        }

        return $next($request);
    }
}
