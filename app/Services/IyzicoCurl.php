<?php

namespace App\Services;

use Iyzipay\Curl;

/**
 * Custom Curl class that handles SSL certificate verification
 * This extends the default iyzico Curl class to add SSL configuration
 */
class IyzicoCurl extends Curl
{
    public function exec($url, $options)
    {
        $ch = curl_init($url);
        curl_setopt_array($ch, $options);
        
        // Set CA certificate bundle path
        $cacertPath = storage_path('cacert.pem');
        if (file_exists($cacertPath)) {
            curl_setopt($ch, CURLOPT_CAINFO, $cacertPath);
        }
        
        // For development only - if CA cert doesn't exist
        // WARNING: Never use this in production!
        if (!file_exists($cacertPath) && config('app.env') === 'local') {
            curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
            curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
        }
        
        // Set timeout
        curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 30);
        curl_setopt($ch, CURLOPT_TIMEOUT, 60);
        
        $result = curl_exec($ch);
        
        // Log any errors
        if (curl_errno($ch)) {
            \Log::error('iyzico cURL error', [
                'error' => curl_error($ch),
                'errno' => curl_errno($ch),
                'url' => $url,
            ]);
        }
        
        curl_close($ch);
        
        return $result;
    }
}
