<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Models\Admin;
use App\Models\Vendor;
use App\Models\User;

/**
 * DetectUserType Middleware
 * 
 * Automatically detects user type from Sanctum token and adds it to request.
 * This enables unified endpoints that work for User, Vendor, and Admin.
 */
class DetectUserType
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next)
    {
        $user = $request->user();

        if (!$user) {
            return $next($request);
        }

        // Detect user type from authenticated model
        $userType = match (true) {
            $user instanceof Admin => 'admin',
            $user instanceof Vendor => 'vendor',
            $user instanceof User => 'user',
            default => null,
        };

        // Add user type to request for easy access in controllers
        $request->merge(['user_type' => $userType]);
        
        // Also add to request attributes for cleaner access
        $request->attributes->set('user_type', $userType);

        return $next($request);
    }

    /**
     * Get user type from request
     */
    public static function getUserType(Request $request): ?string
    {
        return $request->attributes->get('user_type') ?? $request->input('user_type');
    }
}
