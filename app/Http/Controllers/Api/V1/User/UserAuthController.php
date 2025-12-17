<?php

namespace App\Http\Controllers\Api\V1\User;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\User\UserLoginRequest;
use App\Http\Requests\Api\V1\User\UserRegisterRequest;
use App\Services\Auth\AuthService;
use App\Traits\ResponseHttp;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UserAuthController extends Controller
{
    use ResponseHttp;

    public function __construct(
        protected AuthService $authService
    ) {}

    /**
     * Register a new user.
     */
    public function register(UserRegisterRequest $request): JsonResponse
    {
        return $this->fromServiceResponse(
            $this->authService->userRegister($request->validated())
        );
    }

    /**
     * Login user and create token.
     */
    public function login(UserLoginRequest $request): JsonResponse
    {
        return $this->fromServiceResponse(
            $this->authService->userLogin($request->validated())
        );
    }

    /**
     * Logout user (revoke token).
     */
    public function logout(Request $request): JsonResponse
    {
        return $this->fromServiceResponse(
            $this->authService->logout($request->user())
        );
    }

    /**
     * Get authenticated user info.
     */
    public function me(Request $request): JsonResponse
    {
        return $this->fromServiceResponse(
            $this->authService->getCurrentUser($request->user())
        );
    }
}
