<?php

namespace App\Http\Controllers\Api\V1\User;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\User\UserLoginRequest;
use App\Http\Requests\Api\V1\User\UserRegisterRequest;
use App\Services\Auth\AuthService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UserAuthController extends Controller
{
    public function __construct(
        protected AuthService $authService
    ) {}

    /**
     * Register a new user.
     */
    public function register(UserRegisterRequest $request): JsonResponse
    {
        $result = $this->authService->userRegister($request->validated());

        return response()->json([
            'success' => $result->isSuccess(),
            'message' => $result->getMessage(),
            'data' => $result->getData(),
        ], $result->getStatusCode());
    }

    /**
     * Login user and create token.
     */
    public function login(UserLoginRequest $request): JsonResponse
    {
        $result = $this->authService->userLogin($request->validated());

        return response()->json([
            'success' => $result->isSuccess(),
            'message' => $result->getMessage(),
            'data' => $result->getData(),
        ], $result->getStatusCode());
    }

    /**
     * Logout user (revoke token).
     */
    public function logout(Request $request): JsonResponse
    {
        $result = $this->authService->logout($request->user());

        return response()->json([
            'success' => $result->isSuccess(),
            'message' => $result->getMessage(),
        ], $result->getStatusCode());
    }

    /**
     * Get authenticated user info.
     */
    public function me(Request $request): JsonResponse
    {
        $result = $this->authService->getCurrentUser($request->user());

        return response()->json([
            'success' => $result->isSuccess(),
            'data' => $result->getData(),
        ], $result->getStatusCode());
    }
}
