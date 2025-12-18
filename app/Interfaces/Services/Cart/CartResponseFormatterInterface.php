<?php

namespace App\Interfaces\Services\Cart;

use App\Models\Cart;

interface CartResponseFormatterInterface
{
    public function format(?Cart $cart): array;
    public function formatItem($item): array;
}
