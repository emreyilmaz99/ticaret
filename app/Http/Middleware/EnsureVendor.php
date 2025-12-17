<?php

namespace App\Http\Middleware;

use App\Core\ApiResponse;
use Closure;
use Illuminate\Http\Request;

class EnsureVendor
{
    public function handle(Request $request, Closure $next)
    {
        $user = $request->user();

        if (! $user) {
            return ApiResponse::error('Unauthenticated', 401);
        }

        if ($user instanceof \App\Models\Vendor) {
            return $next($request);
        }

        if (method_exists($user, 'hasRole') && $user->hasRole('vendor')) {
            return $next($request);
        }

        return ApiResponse::error('Forbidden - vendor only', 403);
    }
}
