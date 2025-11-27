<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class EnsureAdmin
{
    public function handle(Request $request, Closure $next)
    {
        $user = $request->user();

        if (! $user) {
            return new JsonResponse(['success' => false, 'message' => 'Unauthenticated'], 401);
        }

        // If tokenable model is Admin or user is instance of Admin
        if ($user instanceof \App\Models\Admin) {
            return $next($request);
        }

        // Also allow users who have 'admin' role and the tokenable is User (optional)
        if (method_exists($user, 'hasRole') && $user->hasRole('admin')) {
            return $next($request);
        }

        return new JsonResponse(['success' => false, 'message' => 'Forbidden - admin only'], 403);
    }
}
