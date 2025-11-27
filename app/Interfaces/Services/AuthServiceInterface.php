<?php

namespace App\Interfaces\Services;

use App\Core\ServiceResponse;

interface AuthServiceInterface
{
    public function adminLogin(array $data): ServiceResponse;
    public function vendorLogin(array $data): ServiceResponse;
    public function logout($user): ServiceResponse;
}
