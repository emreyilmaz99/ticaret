<?php

namespace App\Exceptions;

use Exception;

class InsufficientStockException extends Exception
{
    protected $code = 422;

    public function __construct(string $productName, int $available, int $requested)
    {
        $message = "Yetersiz stok: {$productName}. Mevcut: {$available}, İstenen: {$requested}";
        parent::__construct($message, 422);
    }
}
