<?php

return [
    /*
    |--------------------------------------------------------------------------
    | iyzico API Credentials
    |--------------------------------------------------------------------------
    |
    | Sandbox için:
    | API Key: sandbox-xxx
    | Secret Key: sandbox-xxx
    | Base URL: https://sandbox-api.iyzipay.com
    |
    | Production için:
    | API Key: Gerçek API Key
    | Secret Key: Gerçek Secret Key
    | Base URL: https://api.iyzipay.com
    |
    */

    'api_key' => env('IYZIPAY_API_KEY'),
    'secret_key' => env('IYZIPAY_SECRET_KEY'),
    'base_url' => env('IYZIPAY_BASE_URL', 'https://sandbox-api.iyzipay.com'),

    /*
    |--------------------------------------------------------------------------
    | Callback URLs
    |--------------------------------------------------------------------------
    |
    | Ödeme sonrası yönlendirme URL'leri
    |
    */

    'callback_url' => env('IYZICO_CALLBACK_URL'),
    'success_url' => env('IYZICO_SUCCESS_URL'),
    'fail_url' => env('IYZICO_FAIL_URL'),

    /*
    |--------------------------------------------------------------------------
    | Marketplace Settings
    |--------------------------------------------------------------------------
    |
    | Marketplace (SubMerchant) özelliği etkin mi?
    | true: Satıcılar SubMerchant olarak kaydedilir
    | false: Tüm ödemeler ana hesaba gider
    |
    */

    'marketplace_enabled' => env('IYZICO_MARKETPLACE_ENABLED', true),
    'payout_enabled' => env('IYZIPAY_PAYOUT_API_ENABLED', true),

    /*
    |--------------------------------------------------------------------------
    | Default Currency
    |--------------------------------------------------------------------------
    */

    'currency' => env('IYZICO_CURRENCY', 'TRY'),

    /*
    |--------------------------------------------------------------------------
    | Locale
    |--------------------------------------------------------------------------
    */

    'locale' => env('IYZICO_LOCALE', 'tr'),

    /*
    |--------------------------------------------------------------------------
    | SubMerchant Types
    |--------------------------------------------------------------------------
    |
    | iyzico'daki SubMerchant türleri ile uygulama türleri eşleştirmesi
    |
    */

    'submerchant_types' => [
        'personal' => 'PERSONAL',
        'private_company' => 'PRIVATE_COMPANY',
        'limited_company' => 'LIMITED_OR_JOINT_STOCK_COMPANY',
    ],

    /*
    |--------------------------------------------------------------------------
    | Conversation ID Prefix
    |--------------------------------------------------------------------------
    |
    | iyzico API çağrıları için conversationId prefix'i
    | Bu, işlemleri takip etmek için kullanılır
    |
    */

    'conversation_prefix' => env('IYZICO_CONVERSATION_PREFIX', 'ticaret_'),
];
