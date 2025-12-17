<?php

namespace App\Http\Middleware;

use App\Core\ApiResponse;
use Closure;
use Illuminate\Http\Request;

class EnsureAdmin
{
    public function handle(Request $request, Closure $next)
    {
        $user = $request->user();

        if (! $user) {
            return ApiResponse::error('Unauthenticated', 401);
        }

        // If tokenable model is Admin or user is instance of Admin
        if ($user instanceof \App\Models\Admin) {
            return $next($request);
        }

        // Also allow users who have 'admin' role and the tokenable is User (optional)
        if (method_exists($user, 'hasRole') && $user->hasRole('admin')) {
            return $next($request);
        }

        return ApiResponse::error('Forbidden - admin only', 403);
    }
}
