<?php

namespace App\Http\Controllers\Api\V1\User;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\User\StoreUserAddressRequest;
use App\Http\Requests\Api\V1\User\UpdateUserAddressRequest;
use App\Models\UserAddress;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UserAddressController extends Controller
{
    /**
     * Get all addresses for the authenticated user.
     */
    public function index(Request $request): JsonResponse
    {
        $addresses = $request->user()->addresses()->orderByDesc('is_default')->orderByDesc('created_at')->get();

        return response()->json([
            'success' => true,
            'data' => [
                'addresses' => $addresses,
            ],
        ]);
    }

    /**
     * Store a new address.
     */
    public function store(StoreUserAddressRequest $request): JsonResponse
    {
        $validated = $request->validated();
        $user = $request->user();

        // If this is the first address or marked as default, reset other defaults
        $isDefault = $validated['is_default'] ?? false;
        if ($isDefault || $user->addresses()->count() === 0) {
            $user->addresses()->update(['is_default' => false]);
            $validated['is_default'] = true;
        }

        $address = $user->addresses()->create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Adres başarıyla eklendi.',
            'data' => [
                'address' => $address,
            ],
        ], 201);
    }

    /**
     * Get a specific address.
     */
    public function show(Request $request, UserAddress $address): JsonResponse
    {
        // Ensure the address belongs to the authenticated user
        if ($address->user_id !== $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'Bu adrese erişim yetkiniz yok.',
            ], 403);
        }

        return response()->json([
            'success' => true,
            'data' => [
                'address' => $address,
            ],
        ]);
    }

    /**
     * Update an address.
     */
    public function update(UpdateUserAddressRequest $request, UserAddress $address): JsonResponse
    {
        $validated = $request->validated();

        // Handle default address logic
        if (isset($validated['is_default']) && $validated['is_default']) {
            $request->user()->addresses()->where('id', '!=', $address->id)->update(['is_default' => false]);
        }

        $address->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Adres başarıyla güncellendi.',
            'data' => [
                'address' => $address->fresh(),
            ],
        ]);
    }

    /**
     * Delete an address.
     */
    public function destroy(Request $request, UserAddress $address): JsonResponse
    {
        // Ensure the address belongs to the authenticated user
        if ($address->user_id !== $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'Bu adrese erişim yetkiniz yok.',
            ], 403);
        }

        $wasDefault = $address->is_default;
        $address->delete();

        // If deleted address was default, make another one default
        if ($wasDefault) {
            $newDefault = $request->user()->addresses()->first();
            if ($newDefault) {
                $newDefault->update(['is_default' => true]);
            }
        }

        return response()->json([
            'success' => true,
            'message' => 'Adres başarıyla silindi.',
        ]);
    }

    /**
     * Set an address as default.
     */
    public function setDefault(Request $request, UserAddress $address): JsonResponse
    {
        // Ensure the address belongs to the authenticated user
        if ($address->user_id !== $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'Bu adrese erişim yetkiniz yok.',
            ], 403);
        }

        // Reset all defaults
        $request->user()->addresses()->update(['is_default' => false]);
        
        // Set this one as default
        $address->update(['is_default' => true]);

        return response()->json([
            'success' => true,
            'message' => 'Varsayılan adres güncellendi.',
            'data' => [
                'address' => $address->fresh(),
            ],
        ]);
    }
}
