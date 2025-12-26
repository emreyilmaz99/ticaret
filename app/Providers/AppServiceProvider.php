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
        $this->app->bind(\App\Repositories\Interfaces\UserAddressRepositoryInterface::class, \App\Repositories\UserAddressRepository::class);
        $this->app->bind(\App\Repositories\Interfaces\ProductReviewRepositoryInterface::class, \App\Repositories\ProductReviewRepository::class);
        $this->app->bind(\App\Repositories\Interfaces\ReviewMediaRepositoryInterface::class, \App\Repositories\ReviewMediaRepository::class);
        $this->app->bind(\App\Repositories\Interfaces\ReviewResponseRepositoryInterface::class, \App\Repositories\ReviewResponseRepository::class);
        $this->app->bind(\App\Repositories\Interfaces\BannedWordRepositoryInterface::class, \App\Repositories\BannedWordRepository::class);
        $this->app->bind(\App\Repositories\Interfaces\OrderRepositoryInterface::class, \App\Repositories\OrderRepository::class);
        $this->app->bind(\App\Repositories\Interfaces\OrderItemRepositoryInterface::class, \App\Repositories\OrderItemRepository::class);
        $this->app->bind(\App\Repositories\Interfaces\TaxClassRepositoryInterface::class, \App\Repositories\TaxClassRepository::class);

        // Service bindings - Core Services (18)
        // Auth
        $this->app->bind(\App\Interfaces\Services\Auth\AuthServiceInterface::class, \App\Services\Auth\AuthService::class);
        
        // Product Services
        $this->app->bind(\App\Interfaces\Services\Product\ProductServiceInterface::class, \App\Services\Product\ProductService::class);
        $this->app->bind(\App\Interfaces\Services\Product\ProductCatalogServiceInterface::class, \App\Services\Product\ProductCatalogService::class);
        $this->app->bind(\App\Interfaces\Services\Product\CategoryServiceInterface::class, \App\Services\Product\CategoryService::class);
        $this->app->bind(\App\Interfaces\Services\Product\StockServiceInterface::class, \App\Services\Product\StockService::class);
        
        // Cart
        $this->app->bind(\App\Interfaces\Services\Cart\CartServiceInterface::class, \App\Services\Cart\CartService::class);
        
        // User
        $this->app->bind(\App\Interfaces\Services\User\UserServiceInterface::class, \App\Services\User\UserService::class);
        
        // Vendor Services
        $this->app->bind(\App\Interfaces\Services\Vendor\VendorServiceInterface::class, \App\Services\Vendor\VendorService::class);
        $this->app->bind(\App\Interfaces\Services\Vendor\VendorApplicationPreServiceInterface::class, \App\Services\Vendor\VendorApplicationPreService::class);
        $this->app->bind(\App\Interfaces\Services\Vendor\VendorApplicationFullServiceInterface::class, \App\Services\Vendor\VendorApplicationFullService::class);
        
        // Order Services
        $this->app->bind(\App\Interfaces\Services\Order\OrderCreationServiceInterface::class, \App\Services\Order\OrderCreationService::class);
        $this->app->bind(\App\Interfaces\Services\Order\OrderPaymentServiceInterface::class, \App\Services\Order\OrderPaymentService::class);
        $this->app->bind(\App\Interfaces\Services\Order\OrderValidationServiceInterface::class, \App\Services\Order\OrderValidationService::class);
        $this->app->bind(\App\Interfaces\Services\Order\CheckoutServiceInterface::class, \App\Services\Order\CheckoutService::class);
        
        // Payment Services
        $this->app->bind(\App\Interfaces\Services\Payment\PaymentGatewayServiceInterface::class, \App\Services\Payment\PaymentGatewayService::class);
        $this->app->bind(\App\Interfaces\Services\Payment\IyzicoServiceInterface::class, \App\Services\Payment\IyzicoService::class);
        
        // Review
        $this->app->bind(\App\Interfaces\Services\Review\ReviewServiceInterface::class, \App\Services\Review\ReviewService::class);
        
        // Service bindings - Feature Services (15)
        // User Services
        $this->app->bind(\App\Interfaces\Services\User\FavoriteServiceInterface::class, \App\Services\User\FavoriteService::class);
        $this->app->bind(\App\Interfaces\Services\User\UserAddressServiceInterface::class, \App\Services\User\UserAddressService::class);
        $this->app->bind(\App\Interfaces\Services\User\UserProfileServiceInterface::class, \App\Services\User\UserProfileService::class);
        
        // Vendor Feature Services
        $this->app->bind(\App\Interfaces\Services\Vendor\VendorPayoutServiceInterface::class, \App\Services\Vendor\VendorPayoutService::class);
        $this->app->bind(\App\Interfaces\Services\Vendor\VendorAddressServiceInterface::class, \App\Services\Vendor\VendorAddressService::class);
        $this->app->bind(\App\Interfaces\Services\Vendor\VendorBankAccountServiceInterface::class, \App\Services\Vendor\VendorBankAccountService::class);
        $this->app->bind(\App\Interfaces\Services\Vendor\VendorSettingsServiceInterface::class, \App\Services\Vendor\VendorSettingsService::class);
        $this->app->bind(\App\Interfaces\Services\Vendor\VendorShippingSettingServiceInterface::class, \App\Services\Vendor\VendorShippingSettingService::class);
        $this->app->bind(\App\Interfaces\Services\Vendor\VendorOrderServiceInterface::class, \App\Services\Vendor\VendorOrderService::class);
        
        // Order Feature Services
        $this->app->bind(\App\Interfaces\Services\Order\OrderServiceInterface::class, \App\Services\Order\OrderService::class);
        $this->app->bind(\App\Interfaces\Services\Order\CouponServiceInterface::class, \App\Services\Order\CouponService::class);
        $this->app->bind(\App\Interfaces\Services\Order\OrderFinancialCalculatorInterface::class, \App\Services\Order\OrderFinancialCalculator::class);
        
        // Admin Services
        $this->app->bind(\App\Interfaces\Services\Admin\CommissionPlanServiceInterface::class, \App\Services\Admin\CommissionPlanService::class);
        $this->app->bind(\App\Interfaces\Services\Admin\AdminOrderServiceInterface::class, \App\Services\Admin\AdminOrderService::class);
        $this->app->bind(\App\Interfaces\Services\Admin\AdminServiceInterface::class, \App\Services\Admin\AdminService::class);
        $this->app->bind(\App\Interfaces\Services\Admin\AdminBannedWordServiceInterface::class, \App\Services\Admin\AdminBannedWordService::class);
        $this->app->bind(\App\Interfaces\Services\Admin\AdminFeaturedDealServiceInterface::class, \App\Services\Admin\AdminFeaturedDealService::class);
        $this->app->bind(\App\Interfaces\Services\Admin\AdminReviewServiceInterface::class, \App\Services\Admin\AdminReviewService::class);
        $this->app->bind(\App\Interfaces\Services\Admin\AdminCategoryServiceInterface::class, \App\Services\Admin\AdminCategoryService::class);
        $this->app->bind(\App\Interfaces\Services\Admin\AdminProductManagementServiceInterface::class, \App\Services\Admin\AdminProductManagementService::class);
        
        // Tax Services
        $this->app->bind(\App\Interfaces\Services\Tax\TaxCalculationServiceInterface::class, \App\Services\Tax\TaxCalculationService::class);
        $this->app->bind(\App\Interfaces\Services\Tax\TaxClassCrudServiceInterface::class, \App\Services\Tax\TaxClassCrudService::class);
        
        // Vendor Additional Services
        $this->app->bind(\App\Interfaces\Services\Vendor\VendorCategoryServiceInterface::class, \App\Services\Vendor\VendorCategoryService::class);
        $this->app->bind(\App\Interfaces\Services\Vendor\VendorCouponServiceInterface::class, \App\Services\Vendor\VendorCouponService::class);
        $this->app->bind(\App\Interfaces\Services\Vendor\VendorCampaignServiceInterface::class, \App\Services\Vendor\VendorCampaignService::class);
        $this->app->bind(\App\Interfaces\Services\Vendor\VendorApplicationQueryServiceInterface::class, \App\Services\Vendor\VendorApplicationQueryService::class);
        $this->app->bind(\App\Interfaces\Services\Vendor\VendorApplicationServiceInterface::class, \App\Services\Vendor\VendorApplicationService::class);
        $this->app->bind(\App\Interfaces\Services\Vendor\VendorMediaServiceInterface::class, \App\Services\Vendor\VendorMediaService::class);
        $this->app->bind(\App\Interfaces\Services\Vendor\VendorMetadataServiceInterface::class, \App\Services\Vendor\VendorMetadataService::class);
        $this->app->bind(\App\Interfaces\Services\Vendor\VendorRatingServiceInterface::class, \App\Services\Vendor\VendorRatingService::class);
        
        // Product Additional Services
        $this->app->bind(\App\Interfaces\Services\Product\UnitServiceInterface::class, \App\Services\Product\UnitService::class);
        $this->app->bind(\App\Interfaces\Services\Product\PublicProductServiceInterface::class, \App\Services\Product\PublicProductService::class);
        $this->app->bind(\App\Interfaces\Services\Product\FeaturedDealServiceInterface::class, \App\Services\Product\FeaturedDealService::class);
        $this->app->bind(\App\Interfaces\Services\Product\SearchServiceInterface::class, \App\Services\Product\SearchService::class);
        $this->app->bind(\App\Interfaces\Services\Product\ProductVariantServiceInterface::class, \App\Services\Product\ProductVariantService::class);
        $this->app->bind(\App\Interfaces\Services\Product\ProductMetadataServiceInterface::class, \App\Services\Product\ProductMetadataService::class);
        $this->app->bind(\App\Interfaces\Services\Product\ProductMediaServiceInterface::class, \App\Services\Product\ProductMediaService::class);
        $this->app->bind(\App\Interfaces\Services\Product\ProductCrudServiceInterface::class, \App\Services\Product\ProductCrudService::class);
        
        // Review Services
        $this->app->bind(\App\Interfaces\Services\Review\VendorReviewResponseServiceInterface::class, \App\Services\Review\VendorReviewResponseService::class);
        $this->app->bind(\App\Interfaces\Services\Review\BannedWordServiceInterface::class, \App\Services\Review\BannedWordService::class);
        
        // Payment Services
        $this->app->bind(\App\Interfaces\Services\Payment\IyzicoUtilityServiceInterface::class, \App\Services\Payment\IyzicoUtilityService::class);
        $this->app->bind(\App\Interfaces\Services\Payment\IyzicoSubMerchantServiceInterface::class, \App\Services\Payment\IyzicoSubMerchantService::class);
        $this->app->bind(\App\Interfaces\Services\Payment\IyzicoCheckoutServiceInterface::class, \App\Services\Payment\IyzicoCheckoutService::class);
        
        // Cart Helpers
        $this->app->bind(\App\Interfaces\Services\Cart\CartResponseFormatterInterface::class, \App\Services\Cart\CartResponseFormatter::class);
        $this->app->bind(\App\Interfaces\Services\Cart\CartCouponManagerInterface::class, \App\Services\Cart\CartCouponManager::class);
        
        // Media Services
        $this->app->bind(\App\Interfaces\Services\Media\ImageServiceInterface::class, \App\Services\Media\ImageService::class);
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
        \App\Models\Product::observe(\App\Observers\ProductElasticsearchObserver::class);
        \App\Models\Vendor::observe(\App\Observers\VendorObserver::class);
        \App\Models\Cart::observe(\App\Observers\CartObserver::class);
        \App\Models\ProductReview::observe(\App\Observers\ProductReviewObserver::class);
        \App\Models\BannedWord::observe(\App\Observers\BannedWordObserver::class);
    }
}
