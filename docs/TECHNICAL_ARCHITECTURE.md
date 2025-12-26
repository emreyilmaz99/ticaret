# 🏗️ Proje Teknik Mimarisi - Detaylı Dokümantasyon

> Bu doküman, projenin teknik yapısını detaylı olarak açıklar. İş görüşmelerinde teknik derinlik sorularına hazırlık için kullanılabilir.

---

## 📐 Genel Mimari Diyagramı

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                              CLIENT LAYER                                    │
│                    (Mobile App, Web SPA, Third Party)                        │
└─────────────────────────────────────┬────────────────────────────────────────┘
                                      │ HTTP/REST
                                      ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│                              API GATEWAY                                     │
│                         (Laravel Routes + Middleware)                        │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │  Sanctum    │  │   Rate      │  │  CORS       │  │  DetectUserType     │  │
│  │  Auth       │  │   Limiting  │  │  Handler    │  │  Middleware         │  │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────────────┘  │
└─────────────────────────────────────┬────────────────────────────────────────┘
                                      │
                                      ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│                           CONTROLLER LAYER                                   │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐                  │
│  │  Admin         │  │  Vendor        │  │  User          │                  │
│  │  Controllers   │  │  Controllers   │  │  Controllers   │                  │
│  └────────────────┘  └────────────────┘  └────────────────┘                  │
│  ┌────────────────┐  ┌────────────────┐                                      │
│  │  Unified       │  │  Public        │                                      │
│  │  Controllers   │  │  Controllers   │                                      │
│  └────────────────┘  └────────────────┘                                      │
│                           │                                                  │
│  ┌────────────────────────┴───────────────────────────────────────────────┐  │
│  │                    Form Requests (Validation)                          │  │
│  └────────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────┬────────────────────────────────────────┘
                                      │
                                      ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│                            SERVICE LAYER                                     │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │  Order      │  │  Cart       │  │  Product    │  │  Vendor             │  │
│  │  Services   │  │  Services   │  │  Services   │  │  Services           │  │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────────────┘  │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                           │
│  │  Payment    │  │  Auth       │  │  Review     │                           │
│  │  Services   │  │  Services   │  │  Services   │                           │
│  └─────────────┘  └─────────────┘  └─────────────┘                           │
│                           │                                                  │
│  ┌────────────────────────┴───────────────────────────────────────────────┐  │
│  │                    BaseService (ServiceResponse)                       │  │
│  └────────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────┬────────────────────────────────────────┘
                                      │
                                      ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│                          REPOSITORY LAYER                                    │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │  Product    │  │  Cart       │  │  Vendor     │  │  User               │  │
│  │  Repository │  │  Repository │  │  Repository │  │  Repository         │  │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────────────┘  │
│                           │                                                  │
│  ┌────────────────────────┴───────────────────────────────────────────────┐  │
│  │                EloquentBaseRepository (CRUD Operations)                │  │
│  └────────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────┬────────────────────────────────────────┘
                                      │
                                      ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│                            MODEL LAYER                                       │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │  Product    │  │  Order      │  │  Vendor     │  │  User               │  │
│  ├─────────────┤  ├─────────────┤  ├─────────────┤  ├─────────────────────┤  │
│  │  Variant    │  │  OrderItem  │  │  VendorBank │  │  UserAddress        │  │
│  │  Photo      │  │  Status     │  │  VendorMedia│  │  Cart               │  │
│  │  Metadata   │  │  History    │  │  VendorEarn │  │  CartItem           │  │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────────────┘  │
└─────────────────────────────────────┬────────────────────────────────────────┘
                                      │
                                      ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│                          DATA LAYER                                          │
│  ┌────────────────────┐  ┌────────────────────┐  ┌────────────────────────┐  │
│  │     MySQL          │  │     Redis          │  │   Elasticsearch        │  │
│  │  (Primary Data)    │  │  (Cache/Queue)     │  │   (Search Index)       │  │
│  └────────────────────┘  └────────────────────┘  └────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## 📁 Dosya Yapısı Açıklaması

```
app/
├── Console/
│   └── Commands/           # Artisan komutları
├── Core/
│   ├── ApiResponse.php     # Standart API response builder
│   └── ServiceResponse.php # Service layer response container
├── Exceptions/
│   ├── Handler.php         # Global exception handler
│   ├── BusinessLogicException.php
│   └── InsufficientStockException.php
├── Http/
│   ├── Controllers/
│   │   └── Api/V1/
│   │       ├── Admin/      # Admin panel endpoints
│   │       ├── Vendor/     # Satıcı panel endpoints
│   │       ├── User/       # Müşteri endpoints
│   │       ├── Public/     # Auth gerektirmeyen endpoints
│   │       └── Unified/    # Rol bazlı unified endpoints
│   ├── Middleware/
│   │   ├── EnsureAdmin.php
│   │   ├── EnsureVendor.php
│   │   ├── DetectUserType.php
│   │   └── CheckSanctumAbilities.php
│   ├── Requests/
│   │   └── Api/V1/         # Form request validation
│   └── Resources/
│       └── Api/V1/         # API resource transformers
├── Interfaces/
│   └── Services/           # Service interfaces (contracts)
├── Models/                  # Eloquent models (44 models)
├── Observers/              # Model event observers
├── Providers/              # Service providers
├── Repositories/
│   ├── Interfaces/         # Repository contracts
│   └── *Repository.php     # Eloquent implementations
├── Services/
│   ├── Admin/              # Admin iş mantığı
│   ├── Auth/               # Authentication servisleri
│   ├── Cart/               # Sepet yönetimi
│   ├── Elasticsearch/      # Arama servisleri
│   ├── Media/              # Dosya yükleme
│   ├── Order/              # Sipariş yönetimi
│   ├── Payment/            # Ödeme entegrasyonu
│   ├── Product/            # Ürün yönetimi
│   ├── Review/             # Yorum sistemi
│   ├── Tax/                # Vergi hesaplamaları
│   ├── User/               # Kullanıcı işlemleri
│   └── Vendor/             # Satıcı işlemleri
└── Traits/                 # Paylaşılan trait'ler
```

---

## 🔐 Authentication Mimarisi

### Multi-Guard Yapısı

```php
// config/auth.php
'guards' => [
    'web' => [...],
    'sanctum' => [
        'driver' => 'sanctum',
        'provider' => null,  // Multiple providers
    ],
],

'providers' => [
    'users' => [
        'driver' => 'eloquent',
        'model' => App\Models\User::class,
    ],
    'vendors' => [
        'driver' => 'eloquent',
        'model' => App\Models\Vendor::class,
    ],
    'admins' => [
        'driver' => 'eloquent',
        'model' => App\Models\Admin::class,
    ],
],
```

### Token Abilities (Yetkilendirme)

```php
// Login sırasında
$token = $user->createToken('auth-token', ['user:*'])->plainTextToken;
$token = $vendor->createToken('auth-token', ['vendor:*'])->plainTextToken;
$token = $admin->createToken('auth-token', ['admin:*'])->plainTextToken;

// Middleware kontrolü
Route::middleware(['auth:sanctum', 'CheckSanctumAbilities:vendor:*'])
    ->group(function () {
        // Sadece vendor token'ı ile erişilebilir
    });
```

### Admin Rol Sistemi (Spatie Permission)

```php
// Roller
- super-admin  (tüm yetkiler)
- admin        (standart yönetici)

// Kullanım
Route::middleware(['role:super-admin'])->group(function () {
    Route::delete('admins/{admin}', [AdminController::class, 'destroy']);
});
```

---

## 📦 Order (Sipariş) Modülü Detayı

### Sipariş Durumları

```
┌─────────┐    ┌───────────┐    ┌────────────┐    ┌─────────┐    ┌───────────┐
│ pending │───▶│ confirmed │───▶│ processing │───▶│ shipped │───▶│ delivered │
└─────────┘    └───────────┘    └────────────┘    └─────────┘    └───────────┘
     │                                                                  │
     │                                                                  ▼
     │                                                           ┌───────────┐
     ▼                                                           │ returned  │
┌───────────┐                                                    └───────────┘
│ cancelled │
└───────────┘
```

### Ödeme Durumları

```
┌─────────┐    ┌────────────┐    ┌──────┐
│ pending │───▶│ processing │───▶│ paid │
└─────────┘    └────────────┘    └──────┘
     │                               │
     ▼                               ▼
┌────────┐                     ┌──────────┐
│ failed │                     │ refunded │
└────────┘                     └──────────┘
```

### Order Service Decomposition

```
OrderService (Facade - Deprecated)
    │
    ├── OrderValidationService
    │   └── validateCart()
    │   └── validateStock()
    │   └── validateCoupon()
    │
    ├── OrderCreationService
    │   └── createOrderFromCart()
    │   └── createOrderItems()
    │   └── applyDiscounts()
    │
    ├── OrderPaymentService
    │   └── processPaymentSuccess()
    │   └── processPaymentFailure()
    │
    └── OrderFinancialService
        └── createVendorEarnings()
        └── calculateCommission()
```

---

## 💳 Payment (Ödeme) Modülü

### iyzico Entegrasyon Akışı

```
┌──────────┐     ┌──────────────┐     ┌─────────┐     ┌──────────────┐
│ Frontend │────▶│ Initialize   │────▶│ iyzico  │────▶│ Payment Page │
│          │     │ Checkout     │     │ API     │     │ (Hosted)     │
└──────────┘     └──────────────┘     └─────────┘     └──────────────┘
                                                             │
                                                             ▼
┌──────────┐     ┌──────────────┐     ┌─────────┐     ┌──────────────┐
│ Success  │◀────│ Update Order │◀────│ Verify  │◀── │ Callback     │
│ Page     │     │ Status       │     │ Payment │     │ (POST)       │
└──────────┘     └──────────────┘     └─────────┘     └──────────────┘
```

### Payment Servisleri

```php
IyzicoService (Ana Servis)
├── IyzicoCheckoutService
│   ├── initializeCheckoutForm()
│   ├── retrieveCheckoutForm()
│   ├── buildBuyer()
│   ├── buildAddress()
│   └── buildBasketItems()
│
├── IyzicoSubMerchantService
│   ├── createSubMerchant()    # Satıcı kaydı
│   ├── updateSubMerchant()
│   └── getSubMerchant()
│
└── IyzicoUtilityService
    ├── formatPrice()
    ├── generateConversationId()
    └── validateIBAN()
```

---

## 🛒 Cart (Sepet) Modülü

### Sepet Yapısı

```
Cart
├── user_id (authenticated users only)
├── coupon_id
├── coupon_discount
└── CartItems[]
    ├── product_id
    ├── variant_id
    ├── quantity
    └── unit_price (snapshot at add time)
```

### Cart Service Components

```php
CartService
├── CartResponseFormatter
│   └── format()           # Sepeti JSON'a dönüştür
│   └── calculateTotals()  # Toplam hesapla
│
└── CartCouponManager
    └── applyCoupon()
    └── validateCoupon()
    └── removeCoupon()
```

### Kupon Tipleri

| Tip | Açıklama | Örnek |
|-----|----------|-------|
| `percentage` | Yüzde indirim | %10 indirim |
| `fixed` | Sabit tutar | 50 TL indirim |
| `free_shipping` | Ücretsiz kargo | - |

---

## 🔍 Elasticsearch Modülü

### Index Yapısı

```json
{
  "mappings": {
    "properties": {
      "id": { "type": "keyword" },
      "name": { 
        "type": "text",
        "analyzer": "turkish",
        "fields": {
          "keyword": { "type": "keyword" },
          "autocomplete": { "type": "text", "analyzer": "autocomplete" }
        }
      },
      "description": { "type": "text", "analyzer": "turkish" },
      "category_id": { "type": "integer" },
      "category_name": { "type": "keyword" },
      "vendor_id": { "type": "integer" },
      "vendor_name": { "type": "keyword" },
      "price": { "type": "float" },
      "status": { "type": "keyword" },
      "created_at": { "type": "date" }
    }
  }
}
```

### Search Service Architecture

```
ProductSearchService
├── Client/
│   └── ElasticsearchClientFactory
│
├── Index/
│   └── ProductIndexManager
│       ├── createIndex()
│       ├── deleteIndex()
│       └── reindex()
│
├── Query/
│   └── ProductQueryBuilder
│       ├── addFullTextSearch()
│       ├── addCategoryFilter()
│       ├── addPriceRange()
│       └── addSorting()
│
└── Mapping/
    └── ProductResultMapper
        └── map() # ES response → App format
```

---

## 📊 Vendor Financial (Satıcı Finans) Modülü

### Kazanç Hesaplama Akışı

```
Order Delivered
      │
      ▼
┌─────────────────────────────────────────────────────────────────┐
│                 OrderFinancialService                           │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ foreach OrderItem:                                        │  │
│  │   1. Get vendor commission plan                           │  │
│  │   2. Calculate commission (% or fixed)                    │  │
│  │   3. Calculate withholding tax (stopaj)                   │  │
│  │   4. Calculate net amount                                 │  │
│  │   5. Create VendorEarning record                          │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
      │
      ▼
VendorEarning (status: pending)
      │
      ▼ (After holding period)
VendorEarning (status: available)
      │
      ▼ (Payout requested)
VendorPayout (status: pending)
      │
      ▼ (Admin approved)
VendorEarning (status: settled)
```

### Finansal Hesaplama Formülü

```
Gross Amount (Brüt)     = OrderItem.line_total
Commission Amount       = Gross × Commission Rate (veya Fixed Amount)
Withholding Tax        = Gross × 0.02 (Stopaj %2)
Net Amount (Net Kazanç) = Gross - Commission - Withholding Tax

Örnek:
- Ürün Fiyatı: 1000 TL
- Komisyon: %10 = 100 TL
- Stopaj: %2 = 20 TL
- Satıcı Net: 880 TL
```

---

## 🔄 Event/Observer Sistemi

### Kayıtlı Observer'lar

```php
// app/Providers/AppServiceProvider.php

Order::observe(OrderObserver::class);
Product::observe(ProductObserver::class);
Product::observe(ProductElasticsearchObserver::class);
ProductReview::observe(ProductReviewObserver::class);
Vendor::observe(VendorObserver::class);
Cart::observe(CartObserver::class);
BannedWord::observe(BannedWordObserver::class);
```

### Observer Örneği: OrderObserver

```php
class OrderObserver
{
    public function updated(Order $order): void
    {
        if ($order->isDirty('status')) {
            // Status history kaydı
            $this->recordStatusChange($order);
            
            // Delivered olunca satıcı kazancı oluştur
            if ($order->status === 'delivered') {
                $this->financialService->createVendorEarnings($order);
            }
        }
    }
    
    public function created(Order $order): void
    {
        // İlk status history kaydı
        OrderStatusHistory::create([
            'order_id' => $order->id,
            'old_status' => null,
            'new_status' => $order->status,
        ]);
    }
}
```

---

## 🧪 Test Stratejisi

### Test Yapısı

```
tests/
├── Feature/
│   └── Controllers/
│       ├── Admin/
│       ├── Vendor/
│       └── User/
└── Unit/
    ├── Services/
    └── Repositories/
```

### Test Örnekleri

```php
// Feature Test - API Endpoint
class OrderControllerTest extends TestCase
{
    public function test_user_can_view_own_orders()
    {
        $user = User::factory()->create();
        $order = Order::factory()->for($user)->create();
        
        $response = $this->actingAs($user)
            ->getJson('/api/v1/orders');
        
        $response->assertStatus(200)
            ->assertJsonPath('data.0.id', $order->id);
    }
    
    public function test_user_cannot_view_other_users_orders()
    {
        $user1 = User::factory()->create();
        $user2 = User::factory()->create();
        $order = Order::factory()->for($user2)->create();
        
        $response = $this->actingAs($user1)
            ->getJson("/api/v1/orders/{$order->order_number}");
        
        $response->assertStatus(404);
    }
}

// Unit Test - Service
class CartServiceTest extends TestCase
{
    public function test_add_item_increases_cart_total()
    {
        $cartService = app(CartServiceInterface::class);
        $user = User::factory()->create();
        $product = Product::factory()->create();
        
        $result = $cartService->addItem($user, null, [
            'product_id' => $product->id,
            'quantity' => 2
        ]);
        
        $this->assertTrue($result->isSuccess());
        $this->assertEquals(2, $result->getData()['items_count']);
    }
}
```

---

## 📈 Performans Optimizasyonları

### 1. Query Optimization

```php
// ❌ N+1 Problem
$orders = Order::all();
foreach ($orders as $order) {
    echo $order->user->name;
}

// ✅ Eager Loading
$orders = Order::with(['user', 'items.product'])->get();
```

### 2. Caching Strategy

```php
// Kategori ağacı (sık değişmez)
Cache::remember('categories.tree', 3600, function () {
    return Category::tree();
});

// Ürün sayısı (invalidation ile)
Cache::tags(['products'])->remember('products.count', 600, function () {
    return Product::active()->count();
});
```

### 3. Database Indexing

```php
// Migration'larda index tanımları
$table->index('vendor_id');
$table->index('status');
$table->index(['vendor_id', 'status']);
$table->index('created_at');
```

### 4. Pagination

```php
// Büyük veri setleri için cursor pagination
$products = Product::cursorPaginate(20);

// Normal pagination
$orders = Order::paginate(15);
```

---

## 🐳 Docker Yapılandırması

### docker-compose.yml Servisleri

```yaml
services:
  app:           # Laravel PHP-FPM
  nginx:         # Web server
  mysql:         # Primary database
  redis:         # Cache, Queue, Session
  elasticsearch: # Search engine
```

### Environment Variables

```env
# Database
DB_CONNECTION=mysql
DB_HOST=mysql
DB_DATABASE=ticaret

# Redis
REDIS_HOST=redis
CACHE_DRIVER=redis
QUEUE_CONNECTION=redis
SESSION_DRIVER=redis

# Elasticsearch
ELASTICSEARCH_HOST=elasticsearch:9200

# iyzico
IYZICO_API_KEY=xxx
IYZICO_SECRET_KEY=xxx
IYZICO_BASE_URL=https://sandbox-api.iyzipay.com
```

---

## 📝 API Endpoint Özeti

### Public Endpoints (Auth gerektirmez)

| Method | Endpoint | Açıklama |
|--------|----------|----------|
| GET | `/api/v1/products` | Ürün listesi |
| GET | `/api/v1/products/{slug}` | Ürün detayı |
| GET | `/api/v1/categories` | Kategori listesi |
| GET | `/api/v1/categories/tree` | Kategori ağacı |
| GET | `/api/v1/search` | Ürün arama |
| GET | `/api/v1/vendors/{slug}` | Satıcı profili |

### User Endpoints

| Method | Endpoint | Açıklama |
|--------|----------|----------|
| POST | `/api/v1/user/register` | Kayıt |
| POST | `/api/v1/user/login` | Giriş |
| GET | `/api/v1/cart` | Sepet görüntüle |
| POST | `/api/v1/cart/items` | Sepete ekle |
| POST | `/api/v1/user/checkout/initialize` | Ödeme başlat |

### Vendor Endpoints

| Method | Endpoint | Açıklama |
|--------|----------|----------|
| POST | `/api/v1/vendor/login` | Satıcı girişi |
| GET | `/api/v1/vendor/products` | Ürünlerim |
| POST | `/api/v1/vendor/products` | Ürün ekle |
| GET | `/api/v1/vendor/finance/dashboard` | Finansal özet |

### Admin Endpoints

| Method | Endpoint | Açıklama |
|--------|----------|----------|
| GET | `/api/v1/admin/users` | Kullanıcı listesi |
| GET | `/api/v1/admin/vendors` | Satıcı listesi |
| GET | `/api/v1/admin/orders` | Sipariş listesi |
| GET | `/api/v1/admin/finance/dashboard` | Platform finansı |

### Unified Endpoints (Rol bazlı)

| Method | Endpoint | User | Vendor | Admin |
|--------|----------|------|--------|-------|
| GET | `/api/v1/orders` | Kendi siparişleri | Satıcı siparişleri | Tüm siparişler |
| GET | `/api/v1/reviews` | Kendi yorumları | Ürün yorumları | Tüm yorumlar |
| GET | `/api/v1/profile` | Profil | Profil | Profil |

---

*Bu doküman, projenin teknik yapısını kapsamlı şekilde açıklamaktadır.*
