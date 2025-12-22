<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Withholding Tax (Stopaj) Settings
    |--------------------------------------------------------------------------
    |
    | Türk vergi mevzuatına göre elektronik ticaret pazaryerlerinde
    | alt satıcılara yapılan ödemeler üzerinden stopaj kesilmesi
    | gerekmektedir. 01.01.2025 tarihinden itibaren yürürlüktedir.
    |
    */

    'withholding_tax' => [
        'enabled' => env('WITHHOLDING_TAX_ENABLED', true),
        'rate' => env('WITHHOLDING_TAX_RATE', 1.0), // Yüzde 1
        'effective_date' => '2025-01-01',
        'description' => 'Gelir Vergisi Stopajı (%1)',
    ],

    /*
    |--------------------------------------------------------------------------
    | Settlement Settings
    |--------------------------------------------------------------------------
    |
    | Satıcı hakedişlerinin ne zaman çekilebilir hale geleceği
    | ile ilgili ayarlar.
    |
    */

    'settlement' => [
        // Sipariş delivered olduktan kaç gün sonra çekilebilir
        'auto_available_after_days' => env('SETTLEMENT_DAYS', 7),
        
        // Minimum çekim tutarı
        'min_payout_amount' => env('MIN_PAYOUT_AMOUNT', 100),
        
        // Maximum çekim tutarı
        'max_payout_amount' => env('MAX_PAYOUT_AMOUNT', 50000),
    ],

    /*
    |--------------------------------------------------------------------------
    | Payout Settings
    |--------------------------------------------------------------------------
    |
    | Satıcı ödemelerine ilişkin ayarlar.
    |
    */

    'payout' => [
        // Ödeme işlem ücreti
        'processing_fee' => env('PAYOUT_PROCESSING_FEE', 5),
        
        // Minimum çekim tutarı (TRY)
        'min_amount' => env('MIN_PAYOUT_AMOUNT', 100),
        
        // Maximum çekim tutarı (TRY)
        'max_amount' => env('MAX_PAYOUT_AMOUNT', 50000),
        
        // Aylık maximum çekim sayısı (0 = sınırsız)
        'max_monthly_payouts' => env('MAX_MONTHLY_PAYOUTS', 0),
    ],

    /*
    |--------------------------------------------------------------------------
    | İyzico Marketplace Fee Settings
    |--------------------------------------------------------------------------
    |
    | İyzico pazaryeri ücreti. Bu ücret platform komisyonundan
    | ayrı olarak iyzico tarafından alınır.
    |
    */

    'iyzico' => [
        // İyzico marketplace fee oranı (tahminî)
        'marketplace_fee_rate' => env('IYZICO_MARKETPLACE_FEE_RATE', 1.5),
        
        // İyzico stopaj parametresini gönder
        'send_withholding_tax' => env('IYZICO_SEND_WITHHOLDING_TAX', true),
    ],

    /*
    |--------------------------------------------------------------------------
    | Reporting Settings
    |--------------------------------------------------------------------------
    |
    | Finansal raporlama ayarları.
    |
    */

    'reporting' => [
        // Raporların varsayılan para birimi
        'currency' => 'TRY',
        
        // Raporlarda gösterilecek ondalık basamak sayısı
        'decimal_places' => 2,
        
        // Vergi raporlaması için dönem (quarterly veya monthly)
        'tax_reporting_period' => env('TAX_REPORTING_PERIOD', 'quarterly'),
    ],

    /*
    |--------------------------------------------------------------------------
    | Balance Cache Settings
    |--------------------------------------------------------------------------
    |
    | Satıcı bakiye hesaplamalarının cache'lenmesi.
    |
    */

    'cache' => [
        // Balance cache süresi (saniye)
        'balance_ttl' => env('BALANCE_CACHE_TTL', 300), // 5 dakika
        
        // Cache kullanılsın mı
        'enabled' => env('FINANCE_CACHE_ENABLED', true),
    ],

];
