<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class EnsureTokenAbility
{
    /**
     * Handle an incoming request.
     * Usage: ->middleware('ability:admin:*')
     */
    public function handle(Request $request, Closure $next, string $ability)
    {
        $user = $request->user();

        if (! $user) {
            return new JsonResponse(['success' => false, 'message' => 'Unauthenticated'], 401);
        }

        // if tokenCan is available, use it (Sanctum personal access tokens)
        if (method_exists($user, 'tokenCan')) {
            // support pipe-separated abilities or single ability
            $abilities = explode('|', $ability);
            foreach ($abilities as $a) {
                if ($user->tokenCan($a)) {
                    return $next($request);
                }
            }
        }

        return new JsonResponse(['success' => false, 'message' => 'Forbidden - insufficient token abilities'], 403);
    }
}
