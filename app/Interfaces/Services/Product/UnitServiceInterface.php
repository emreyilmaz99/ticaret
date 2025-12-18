<?php

namespace App\Interfaces\Services\Product;

use App\Core\ServiceResponse;

interface UnitServiceInterface
{
    public function list(): ServiceResponse;
}
