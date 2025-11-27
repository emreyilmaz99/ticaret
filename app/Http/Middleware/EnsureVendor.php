<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class EnsureVendor
{
    public function handle(Request $request, Closure $next)
    {
        $user = $request->user();

        if (! $user) {
            return new JsonResponse(['success' => false, 'message' => 'Unauthenticated'], 401);
        }

        if ($user instanceof \App\Models\Vendor) {
            return $next($request);
        }

        if (method_exists($user, 'hasRole') && $user->hasRole('vendor')) {
            return $next($request);
        }

        return new JsonResponse(['success' => false, 'message' => 'Forbidden - vendor only'], 403);
    }
}
