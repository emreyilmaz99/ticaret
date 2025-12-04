<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class OptionalAuth
{
    /**
     * Handle an incoming request.
     * 
     * This middleware attempts to authenticate the user if a token is present,
     * but allows the request to continue even if authentication fails.
     * This is useful for routes that work for both guests and authenticated users.
     */
    public function handle(Request $request, Closure $next, string $guard = 'sanctum'): Response
    {
        // Try to authenticate, but don't fail if it doesn't work
        try {
            if ($request->bearerToken()) {
                Auth::guard($guard)->check();
            }
        } catch (\Exception $e) {
            // Silently continue - user will be treated as guest
        }

        return $next($request);
    }
}
