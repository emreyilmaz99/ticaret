<?php

namespace App\Services\Elasticsearch\Client;

use Elastic\Elasticsearch\Client;
use Elastic\Elasticsearch\ClientBuilder;

class ElasticsearchClientFactory
{
    private static ?Client $client = null;

    /**
     * Get Elasticsearch client instance (Singleton)
     */
    public static function create(): Client
    {
        if (self::$client === null) {
            $hosts = self::buildHosts();
            
            self::$client = ClientBuilder::create()
                ->setHosts($hosts)
                ->build();
        }

        return self::$client;
    }

    /**
     * Build hosts array from config
     */
    private static function buildHosts(): array
    {
        $host = config('services.elasticsearch.host', 'elasticsearch');
        $port = config('services.elasticsearch.port', 9200);
        $scheme = config('services.elasticsearch.scheme', 'http');
        $user = config('services.elasticsearch.user', '');
        $pass = config('services.elasticsearch.pass', '');

        $auth = '';
        if (!empty($user)) {
            $auth = rawurlencode($user) . ':' . rawurlencode($pass) . '@';
        }

        return [
            $scheme . '://' . $auth . $host . ':' . $port
        ];
    }

    /**
     * Reset client instance (for testing)
     */
    public static function reset(): void
    {
        self::$client = null;
    }
}
