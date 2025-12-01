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
        $this->app->bind(\App\Repositories\Interfaces\VendorAddressRepositoryInterface::class, \App\Repositories\VendorAddressRepository::class);
        $this->app->bind(\App\Repositories\Interfaces\VendorBankAccountRepositoryInterface::class, \App\Repositories\VendorBankAccountRepository::class);
        $this->app->bind(\App\Repositories\Interfaces\VendorPayoutRepositoryInterface::class, \App\Repositories\VendorPayoutRepository::class);
        $this->app->bind(\App\Repositories\Interfaces\ProductVariantRepositoryInterface::class, \App\Repositories\ProductVariantRepository::class);
        $this->app->bind(\App\Repositories\Interfaces\TagRepositoryInterface::class, \App\Repositories\TagRepository::class);
        $this->app->bind(\App\Repositories\Interfaces\ProductPhotoRepositoryInterface::class, \App\Repositories\ProductPhotoRepository::class);

        // Service bindings
        $this->app->bind(\App\Interfaces\Services\AuthServiceInterface::class, \App\Services\AuthService::class);
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
    }
}
