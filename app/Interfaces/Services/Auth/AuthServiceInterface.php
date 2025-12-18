<?php

namespace App\Interfaces\Services\Auth;

use App\Core\ServiceResponse;
use App\Models\User;

interface AuthServiceInterface
{
    public function adminLogin(array $data): ServiceResponse;
    public function vendorLogin(array $data): ServiceResponse;
    public function userRegister(array $data): ServiceResponse;
    public function userLogin(array $data): ServiceResponse;
    public function getCurrentUser(User $user): ServiceResponse;
    public function logout($user): ServiceResponse;
}
