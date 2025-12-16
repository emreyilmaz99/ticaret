<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        // Repository bindings (bind interfaces to implementations)
        // Bind interfaces to concrete repository classes so the container
        // can resolve constructor dependencies automatically.
        $this->app->bind(\App\Repositories\Interfaces\UserRepositoryInterface::class, \App\Repositories\UserRepository::class);
        $this->app->bind(\App\Repositories\Interfaces\VendorRepositoryInterface::class, \App\Repositories\VendorRepository::class);
        $this->app->bind(\App\Repositories\Interfaces\ProductRepositoryInterface::class, \App\Repositories\ProductRepository::class);
        $this->app->bind(\App\Repositories\Interfaces\CategoryRepositoryInterface::class, \App\Repositories\CategoryRepository::class);
        $this->app->bind(\App\Repositories\Interfaces\VendorAddressRepositoryInterface::class, \App\Repositories\VendorAddressRepository::class);
        $this->app->bind(\App\Repositories\Interfaces\VendorBankAccountRepositoryInterface::class, \App\Repositories\VendorBankAccountRepository::class);
        $this->app->bind(\App\Repositories\Interfaces\VendorPayoutRepositoryInterface::class, \App\Repositories\VendorPayoutRepository::class);
        $this->app->bind(\App\Repositories\Interfaces\ProductVariantRepositoryInterface::class, \App\Repositories\ProductVariantRepository::class);
        $this->app->bind(\App\Repositories\Interfaces\TagRepositoryInterface::class, \App\Repositories\TagRepository::class);
        $this->app->bind(\App\Repositories\Interfaces\ProductPhotoRepositoryInterface::class, \App\Repositories\ProductPhotoRepository::class);
        $this->app->bind(\App\Repositories\Interfaces\VendorMediaRepositoryInterface::class, \App\Repositories\VendorMediaRepository::class);
        $this->app->bind(\App\Repositories\Interfaces\VendorSettingRepositoryInterface::class, \App\Repositories\VendorSettingRepository::class);
        $this->app->bind(\App\Repositories\Interfaces\VendorMetadataRepositoryInterface::class, \App\Repositories\VendorMetadataRepository::class);
        $this->app->bind(\App\Repositories\Interfaces\VendorRatingRepositoryInterface::class, \App\Repositories\VendorRatingRepository::class);
        $this->app->bind(\App\Repositories\Interfaces\ProductSettingRepositoryInterface::class, \App\Repositories\ProductSettingRepository::class);
        $this->app->bind(\App\Repositories\Interfaces\ProductMetadataRepositoryInterface::class, \App\Repositories\ProductMetadataRepository::class);
        $this->app->bind(\App\Repositories\Interfaces\ProductVariantMetadataRepositoryInterface::class, \App\Repositories\ProductVariantMetadataRepository::class);
        $this->app->bind(\App\Repositories\Interfaces\CommissionPlanRepositoryInterface::class, \App\Repositories\CommissionPlanRepository::class);
        $this->app->bind(\App\Repositories\Interfaces\VendorApplicationRepositoryInterface::class, \App\Repositories\VendorApplicationRepository::class);
        $this->app->bind(\App\Repositories\Interfaces\CartRepositoryInterface::class, \App\Repositories\CartRepository::class);
        $this->app->bind(\App\Repositories\Interfaces\CartItemRepositoryInterface::class, \App\Repositories\CartItemRepository::class);
        $this->app->bind(\App\Repositories\Interfaces\FavoriteRepositoryInterface::class, \App\Repositories\FavoriteRepository::class);

        // Service bindings
        $this->app->bind(\App\Interfaces\Services\AuthServiceInterface::class, \App\Services\Auth\AuthService::class);
        
        // Elasticsearch HTTP Client ve Transport bindings
        $this->app->bind(\Psr\Http\Client\ClientInterface::class, function ($app) {
            return new \Http\Client\Curl\Client();
        });

        $this->app->singleton(\Elastic\Transport\NodePool\NodePoolInterface::class, function ($app) {
            $hosts = [];
            $esHost = config('scout.elasticsearch.hosts.0') ?? env('ES_HOST', '127.0.0.1') . ':' . env('ES_PORT', '9200');
            
            $scheme = 'http://';
            $esUser = config('scout.elasticsearch.user') ?? env('ES_USER');
            $esPass = config('scout.elasticsearch.pass') ?? env('ES_PASSWORD');
            
            $auth = '';
            if (!empty($esUser)) {
                $auth = rawurlencode($esUser) . ':' . rawurlencode($esPass) . '@';
            }
            $hosts[] = $scheme . $auth . $esHost;

            $builder = \Elastic\Transport\TransportBuilder::create();
            $nodePool = $builder->getNodePool();
            $nodePool = $nodePool->setHosts($hosts);

            return $nodePool;
        });

        $this->app->singleton(\Psr\Log\LoggerInterface::class, function () {
            return new \Psr\Log\NullLogger();
        });
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Register router middleware aliases (ability middleware)
        $router = $this->app->make(\Illuminate\Routing\Router::class);
        $router->aliasMiddleware('ability', \App\Http\Middleware\EnsureTokenAbility::class);
        // Register Spatie role/permission middleware aliases (used in routes)
        $router->aliasMiddleware('role', \Spatie\Permission\Middleware\RoleMiddleware::class);
        $router->aliasMiddleware('permission', \Spatie\Permission\Middleware\PermissionMiddleware::class);
        $router->aliasMiddleware('role_or_permission', \Spatie\Permission\Middleware\RoleOrPermissionMiddleware::class);

        // Register observers for automatic event handling
        \App\Models\Order::observe(\App\Observers\OrderObserver::class);
        \App\Models\Product::observe(\App\Observers\ProductObserver::class);
        \App\Models\Vendor::observe(\App\Observers\VendorObserver::class);
        \App\Models\Cart::observe(\App\Observers\CartObserver::class);
        \App\Models\ProductReview::observe(\App\Observers\ProductReviewObserver::class);
        \App\Models\BannedWord::observe(\App\Observers\BannedWordObserver::class);
    }
}
