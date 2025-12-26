# 🎯 Laravel E-Ticaret Backend Projesi - İş Görüşmesi Hazırlık Dokümanı

> Bu doküman, proje hakkında iş görüşmesinde sorulabilecek teknik ve davranışsal sorulara hazırlık amacıyla oluşturulmuştur.

---

## 📋 İçindekiler

1. [Proje Özeti](#-proje-özeti)
2. [Teknik Mimari Kararları](#-teknik-mimari-kararları)
3. [Muhtemel İK Soruları ve Cevapları](#-muhtemel-i̇k-soruları-ve-cevapları)
4. [Teknik Mülakat Soruları](#-teknik-mülakat-soruları)
5. [Kullanılan Teknolojiler ve Neden](#-kullanılan-teknolojiler-ve-neden)
6. [Projenin Öne Çıkan Özellikleri](#-projenin-öne-çıkan-özellikleri)
7. [Karşılaşılan Zorluklar ve Çözümler](#-karşılaşılan-zorluklar-ve-çözümler)

---

## 🚀 Proje Özeti

### Proje Nedir?
Bu proje, **çoklu satıcı (multi-vendor) destekli modern bir e-ticaret platformunun backend API'sidir**. Trendyol, Hepsiburada gibi pazaryeri modelinde çalışan, satıcıların kendi ürünlerini satabildiği, kullanıcıların alışveriş yapabildiği kapsamlı bir sistemdir.

### Temel Aktörler
| Aktör | Açıklama |
|-------|----------|
| **User (Müşteri)** | Alışveriş yapan son kullanıcı |
| **Vendor (Satıcı)** | Ürün satan işletme/birey |
| **Admin** | Platform yöneticisi (super-admin, admin rolleri) |

### Temel Modüller
- 🛒 **Sepet Yönetimi** - Kupon, kampanya desteği
- 📦 **Sipariş Yönetimi** - Tam sipariş yaşam döngüsü
- 💳 **Ödeme Entegrasyonu** - iyzico (Checkout Form)
- 🏪 **Satıcı Yönetimi** - Başvuru, onay, komisyon sistemi
- 📊 **Finansal Yönetim** - Kazanç takibi, ödeme çıkışları
- 🔍 **Elasticsearch** - Gelişmiş ürün arama
- 📝 **Yorum/Değerlendirme Sistemi**

---

## 🏗 Teknik Mimari Kararları

### 1. Katmanlı Mimari (Layered Architecture)

```
┌─────────────────────────────────────────────────────────┐
│                    Controllers                          │
│    (Request handling, validation, response formatting)  │
├─────────────────────────────────────────────────────────┤
│                      Services                           │
│         (Business logic, orchestration)                 │
├─────────────────────────────────────────────────────────┤
│                    Repositories                         │
│            (Data access abstraction)                    │
├─────────────────────────────────────────────────────────┤
│                      Models                             │
│           (Eloquent ORM, relationships)                 │
└─────────────────────────────────────────────────────────┘
```

**Neden bu yapı?**
- **Separation of Concerns**: Her katman tek bir sorumluluğa sahip
- **Testability**: Servisler ve repository'ler kolayca mock'lanabilir
- **Maintainability**: Değişiklikler izole edilmiş

### 2. Service Response Pattern

```php
// app/Core/ServiceResponse.php
class ServiceResponse {
    protected bool $success;
    protected int $statusCode;
    protected string $message;
    protected $data;
    protected $errors;
}
```

**Avantajları:**
- Controller'lar servis sonuçlarını tutarlı şekilde işler
- Hata ve başarı durumları standart formatta
- HTTP status code'ları servis katmanında belirlenir

### 3. Unified API Endpoints

```php
// Tek endpoint, token'a göre davranış değişir
Route::get('orders', [UnifiedOrdersController::class, 'index']);
// User → kendi siparişleri
// Vendor → satıcının siparişleri  
// Admin → tüm siparişler
```

**Neden?**
- Frontend için basitleştirilmiş API
- Token-based role detection
- DRY (Don't Repeat Yourself) prensibi

### 4. API Versiyonlama

```
/api/v1/products
/api/v1/orders
```

**Neden?**
- Geriye dönük uyumluluk
- Yeni versiyonlar mevcut client'ları bozmaz
- Professional API tasarımı

---

## 💬 Muhtemel İK Soruları ve Cevapları

### 🎯 "Kendinizi tanıtır mısınız?"

> "Ben bir Laravel Backend Developer'ım. Bu projede çoklu satıcı destekli bir e-ticaret platformunun tüm backend altyapısını geliştirdim. Ödeme entegrasyonundan, karmaşık komisyon hesaplamalarına, Elasticsearch ile arama sistemine kadar birçok kritik modülü tasarlayıp uyguladım."

---

### 🎯 "Bu projeyi neden geliştirdiniz?"

> "Modern pazaryeri modelinde çalışan (Trendyol, Amazon gibi) bir platform ihtiyacı gördüm. Satıcıların kolayca sisteme dahil olabildiği, müşterilerin güvenli alışveriş yapabildiği, ve platform sahiplerinin finansal takip yapabildiği kapsamlı bir çözüm oluşturmak istedim."

---

### 🎯 "Projede en zorlandığınız kısım neresi oldu?"

> "Satıcı komisyon ve vergi hesaplamaları en karmaşık kısımdı. Her sipariş kalemi için:
> - Komisyon planına göre komisyon hesaplama
> - Stopaj vergisi hesaplama
> - Satıcı net kazancını belirleme
> - Birden fazla satıcılı siparişlerde dağılım
> 
> Bunu çözmek için `OrderFinancialCalculator` ve `OrderFinancialService` sınıfları oluşturdum. Single Responsibility prensibine uygun şekilde hesaplama mantığını izole ettim."

---

### 🎯 "Takım çalışması hakkında ne düşünüyorsunuz?"

> "Kod yazarken her zaman başkalarının da okuyacağını düşünerek yazıyorum. Bu projede:
> - PHPDoc yorumları ekledim
> - Tutarlı isimlendirme kullandım
> - API dokümantasyonu hazırladım
> - Git branch stratejisi uyguladım
> 
> Ayrıca Interface'ler kullanarak modüller arası bağımlılıkları azalttım, bu sayede farklı geliştiriciler paralel çalışabilir."

---

### 🎯 "5 yıl sonra kendinizi nerede görüyorsunuz?"

> "Teknik liderlik rolünde, mimari kararlar veren ve junior geliştiricilere mentorluk yapan bir pozisyonda olmak istiyorum. Bu projede edindiğim deneyimleri - ölçeklenebilir sistem tasarımı, entegrasyon yönetimi, performans optimizasyonu - daha büyük ölçekli projelerde uygulamak istiyorum."

---

### 🎯 "Neden Laravel tercih ettiniz?"

> "Laravel'i tercih etmemin birkaç nedeni var:
> 1. **Eloquent ORM** - Veritabanı işlemlerini çok kolaylaştırıyor
> 2. **Ekosistem** - Sanctum, Scout, Queue gibi hazır çözümler
> 3. **Convention over Configuration** - Hızlı geliştirme
> 4. **Community** - Geniş topluluk ve dokümantasyon
> 
> Bu projede özellikle Sanctum (multi-auth), Scout (Elasticsearch), ve Queue (async işlemler) hayat kurtardı."

---

### 🎯 "Projedeki bir hata nasıl debug ettiniz?"

> "iyzico ödeme callback'lerinde bir sorun yaşadık. Callback geliyordu ama sipariş güncelleniyordu. Debug sürecim:
> 
> 1. **Logging** - Tüm callback verilerini logladım
> 2. **Postman** - Manuel olarak callback simüle ettim
> 3. **Step Debugging** - Xdebug ile adım adım takip ettim
> 4. **Root Cause** - Token validation sırasının hatalı olduğunu buldum
> 5. **Fix** - Token kontrolünü düzeltip test yazdım
> 
> Bu deneyim bana 'defensive programming' önemini öğretti."

---

### 🎯 "Eleştiriye nasıl tepki verirsiniz?"

> "Eleştiriyi gelişim fırsatı olarak görüyorum. Bu projede örneğin ilk başta tüm iş mantığını controller'lara koymuştum. Code review'da bunun bakımı zorlaştıracağı söylendi. Bunu dikkate alarak Service katmanı oluşturdum ve kodun kalitesi önemli ölçüde arttı. Şimdi bu pattern'i her projede kullanıyorum."

---

## 🔧 Teknik Mülakat Soruları

### Laravel & PHP Temelleri

#### S: "Eloquent'te N+1 problemi nedir ve nasıl çözersiniz?"

> **Cevap:** N+1 problemi, bir listeyi çekerken her eleman için ayrı sorgu atılmasıdır.
> 
> ```php
> // ❌ N+1 Problemi
> $orders = Order::all();
> foreach ($orders as $order) {
>     echo $order->user->name; // Her order için ayrı sorgu!
> }
> 
> // ✅ Eager Loading ile Çözüm
> $orders = Order::with('user')->get();
> // veya
> $orders = Order::with(['user', 'items.product'])->get();
> ```
> 
> Bu projede tüm ilişkili verileri `with()` ile yüklüyorum. Örneğin sipariş detayında:
> ```php
> Order::with([
>     'user:id,name,email,phone',
>     'items.product.photos',
>     'items.product.vendor:id,company_name',
>     'statusHistory'
> ])->find($id);
> ```

---

#### S: "Dependency Injection nedir ve neden önemlidir?"

> **Cevap:** Bağımlılıkların dışarıdan enjekte edilmesidir. Bu projede:
> 
> ```php
> class CartService extends BaseService
> {
>     public function __construct(
>         CartRepositoryInterface $cartRepo,  // Interface üzerinden
>         CartItemRepositoryInterface $cartItemRepo,
>         CartResponseFormatter $formatter,
>         CartCouponManager $couponManager
>     ) {
>         $this->cartRepo = $cartRepo;
>         // ...
>     }
> }
> ```
> 
> **Avantajları:**
> - **Test edilebilirlik** - Mock'lama kolaylaşır
> - **Gevşek bağlantı** - Implementasyon değişebilir
> - **Kod kalitesi** - SOLID prensiplerine uyum

---

#### S: "Laravel'de Middleware ne işe yarar?"

> **Cevap:** Request/Response pipeline'ında filtreleme yapar. Bu projede özel middleware'ler:
> 
> ```php
> // EnsureAdmin - Sadece admin erişimi
> Route::middleware(['auth:sanctum', EnsureAdmin::class])->group(...)
> 
> // DetectUserType - Token'dan user tipini algılar
> class DetectUserType {
>     public function handle(Request $request, Closure $next) {
>         $userType = match (true) {
>             $user instanceof Admin => 'admin',
>             $user instanceof Vendor => 'vendor',
>             $user instanceof User => 'user',
>             default => null,
>         };
>         $request->attributes->set('user_type', $userType);
>         return $next($request);
>     }
> }
> 
> // CheckSanctumAbilities - Token yetkilerini kontrol eder
> Route::middleware('CheckSanctumAbilities:vendor:*')
> ```

---

#### S: "Repository Pattern neden kullandınız?"

> **Cevap:** Data access logic'i soyutlamak için:
> 
> ```php
> // Interface
> interface CartRepositoryInterface {
>     public function findByUser(int $userId): ?Cart;
>     public function updateCoupon(Cart $cart, ?int $couponId, float $discount): void;
> }
> 
> // Implementation
> class CartRepository extends EloquentBaseRepository implements CartRepositoryInterface {
>     public function findByUser(int $userId): ?Cart {
>         return Cart::where('user_id', $userId)->first();
>     }
> }
> ```
> 
> **Faydaları:**
> - Veritabanı değişirse sadece repository güncellenir
> - Unit testlerde mock'lanabilir
> - Query mantığı tek yerde toplanır

---

#### S: "Observer Pattern'i nasıl kullandınız?"

> **Cevap:** Model event'lerini dinlemek için:
> 
> ```php
> class OrderObserver
> {
>     public function updated(Order $order): void
>     {
>         // Status değişikliği takibi
>         if ($order->isDirty('status')) {
>             $this->recordStatusChange($order);
>             
>             // Delivered olunca satıcı kazancı oluştur
>             if ($order->status === 'delivered') {
>                 $this->financialService->createVendorEarnings($order);
>             }
>         }
>     }
> }
> ```
> 
> Neden? Sipariş güncelleme mantığını controller'dan ayırmak ve tek noktada yönetmek için.

---

### API & Güvenlik

#### S: "API Authentication nasıl yaptınız?"

> **Cevap:** Laravel Sanctum ile token-based authentication:
> 
> ```php
> // Token oluşturma (login)
> $token = $user->createToken('auth-token', ['user:*'])->plainTextToken;
> 
> // Vendor için farklı ability
> $token = $vendor->createToken('vendor-token', ['vendor:*'])->plainTextToken;
> 
> // Route koruma
> Route::middleware(['auth:sanctum', 'CheckSanctumAbilities:user:*'])
> ```
> 
> **Özellikler:**
> - Multi-guard: User, Vendor, Admin ayrı modeller
> - Token abilities ile yetki kontrolü
> - SPA ve Mobile uyumlu

---

#### S: "Validation nasıl yapıyorsunuz?"

> **Cevap:** Form Request sınıfları ile:
> 
> ```php
> class StoreProductRequest extends FormRequest
> {
>     public function authorize(): bool
>     {
>         return true; // Middleware'de kontrol ediliyor
>     }
> 
>     public function rules(): array
>     {
>         return [
>             'name' => 'required|string|max:255',
>             'category_id' => 'required|exists:categories,id',
>             'variants' => 'required|array|min:1',
>             'variants.*.price' => 'required|numeric|min:0',
>             'variants.*.stock' => 'required|integer|min:0',
>         ];
>     }
> 
>     public function messages(): array
>     {
>         return [
>             'name.required' => 'Ürün adı zorunludur',
>             // Türkçe hata mesajları
>         ];
>     }
> }
> ```

---

### Veritabanı

#### S: "Migration stratejiniz nedir?"

> **Cevap:** Her değişiklik için ayrı migration, geri alınabilir yapı:
> 
> ```php
> // 2025_12_22_150000_create_vendor_earnings_table.php
> public function up(): void
> {
>     Schema::create('vendor_earnings', function (Blueprint $table) {
>         $table->id();
>         $table->foreignId('vendor_id')->constrained()->onDelete('cascade');
>         $table->foreignId('order_id')->constrained()->onDelete('cascade');
>         $table->decimal('gross_amount', 10, 2);
>         $table->decimal('commission_amount', 10, 2);
>         $table->decimal('net_amount', 10, 2);
>         $table->enum('earning_status', ['pending', 'available', 'settled']);
>         $table->timestamps();
>     });
> }
> 
> public function down(): void
> {
>     Schema::dropIfExists('vendor_earnings');
> }
> ```
> 
> **Prensip:** Production'da veri kaybına yol açacak down() yazmaktan kaçınıyorum.

---

#### S: "Soft Delete neden kullandınız?"

> **Cevap:** Veri bütünlüğü ve audit trail için:
> 
> ```php
> class Vendor extends Authenticatable
> {
>     use SoftDeletes;
> }
> 
> // Silinen vendor'ın siparişleri hala görüntülenebilir
> // İstatistikler bozulmaz
> // Yanlışlıkla silmelerde geri getirilebilir
> ```

---

### Performans

#### S: "Elasticsearch neden kullandınız?"

> **Cevap:** Gelişmiş arama özellikleri için:
> 
> ```php
> class ProductSearchService
> {
>     public function search(array $filters = []): array
>     {
>         // Full-text search
>         // Faceted filtering (kategori, fiyat aralığı)
>         // Fuzzy matching (yazım hataları)
>         // Autocomplete
>         // Performanslı pagination
>     }
> }
> ```
> 
> MySQL LIKE sorguları binlerce ürünle yavaş kalır. Elasticsearch milisaniyeler içinde sonuç döndürür.

---

#### S: "Caching stratejiniz nedir?"

> **Cevap:** Redis ile çok katmanlı cache:
> 
> ```php
> // Kategori ağacı - sık değişmez
> Cache::remember('categories.tree', 3600, fn() => Category::tree());
> 
> // Ürün detay - invalidation ile
> Cache::tags(['products', "product:{$id}"])->remember(...);
> 
> // Session storage
> // Queue jobs
> // Rate limiting
> ```

---

## 💡 Kullanılan Teknolojiler ve Neden

| Teknoloji | Kullanım Amacı | Alternatifler Arasından Neden Seçildi |
|-----------|----------------|---------------------------------------|
| **Laravel 12** | Ana framework | Modern PHP, geniş ekosistem, hızlı geliştirme |
| **Laravel Sanctum** | API Authentication | Basit, SPA uyumlu, multi-guard desteği |
| **Spatie Permission** | Rol/İzin yönetimi | Production-ready, iyi dokümante |
| **Elasticsearch** | Arama motoru | Full-text search, faceting, ölçeklenebilirlik |
| **Redis** | Cache/Queue/Session | Hızlı, çok amaçlı, Laravel entegrasyonu |
| **iyzico** | Ödeme gateway | Türkiye'de yaygın, marketplace desteği |
| **Docker** | Containerization | Tutarlı geliştirme ortamı |
| **PHPUnit** | Testing | Laravel'in varsayılan test framework'ü |

---

## ⭐ Projenin Öne Çıkan Özellikleri

### 1. Multi-Tenant Mimari
- 3 farklı kullanıcı tipi (User, Vendor, Admin)
- Her biri ayrı Eloquent model ve guard
- Token-based tip algılama

### 2. Kapsamlı Sipariş Yaşam Döngüsü
```
pending → confirmed → processing → shipped → delivered
                                           ↓
                                        returned
                 ↓
              cancelled
```
- Her durum değişikliği loglanır
- Observer pattern ile yan etkiler yönetilir

### 3. Finansal Şeffaflık
- Komisyon planları (yüzde veya sabit)
- Stopaj vergisi hesaplama
- Satıcı kazanç takibi
- Ödeme çıkış talepleri

### 4. Esnek Ürün Yapısı
- Varyantlı ürünler (renk, beden)
- Dinamik özellikler (metadata)
- Kategori hiyerarşisi
- Kampanya/indirim sistemi

### 5. Güvenlik
- Rate limiting
- Input validation
- XSS/CSRF koruması
- Yasaklı kelime filtreleme (yorumlarda)

---

## 🔥 Karşılaşılan Zorluklar ve Çözümler

### Zorluk 1: Çoklu Satıcılı Siparişlerde Finansal Dağılım

**Problem:** Bir siparişte 3 farklı satıcının ürünü olabilir. Her satıcının komisyonu farklı.

**Çözüm:**
```php
class OrderFinancialCalculator
{
    public function calculateItemFinancials(OrderItem $item): array
    {
        $vendor = $item->product->vendor;
        $plan = $vendor->commissionPlan;
        
        // Komisyon hesapla
        $commission = $plan->type === 'percentage' 
            ? $item->line_total * ($plan->rate / 100)
            : $plan->fixed_amount;
        
        // Stopaj hesapla
        $withholdingTax = $item->line_total * 0.02; // %2
        
        // Net kazanç
        $netAmount = $item->line_total - $commission - $withholdingTax;
        
        return compact('commission', 'withholdingTax', 'netAmount');
    }
}
```

### Zorluk 2: Unified Endpoints ile Rol Bazlı Davranış

**Problem:** Aynı `/orders` endpoint'i user, vendor, admin için farklı davranmalı.

**Çözüm:**
```php
class UnifiedOrdersController
{
    public function index(Request $request)
    {
        $userType = $request->attributes->get('user_type');
        
        return match($userType) {
            'user' => $this->userOrders($request->user()),
            'vendor' => $this->vendorOrders($request->user()),
            'admin' => $this->allOrders(),
            default => ApiResponse::error('Unauthorized', 403),
        };
    }
}
```

### Zorluk 3: iyzico Callback Güvenliği

**Problem:** Callback'in gerçekten iyzico'dan geldiğinden emin olmak.

**Çözüm:**
```php
public function callback(Request $request)
{
    // Token ile ödeme sonucunu doğrula
    $result = CheckoutForm::retrieve($retrieveRequest, $this->options);

    if ($result->getStatus() !== 'success') {
        Log::warning('Invalid iyzico callback', $request->all());
        return redirect('/payment-failed');
    }
    
    // Sipariş numarası kontrolü
    $order = Order::where('iyzico_token', $result->getToken())->first();
    // ...
}
```

---

## 📝 Görüşme İçin Son Notlar

### Öz Değerlendirme Soruları İçin Hazırlık

1. **Güçlü yönlerim:**
   - Mimari tasarım ve pattern uygulama
   - Karmaşık iş mantığını çözümleme
   - API tasarımı ve dokümantasyon

2. **Geliştirilecek yönlerim:**
   - Frontend teknolojileri (React/Vue)
   - DevOps ve CI/CD pipeline'ları
   - Performance profiling araçları

3. **Bu projeden öğrendiklerim:**
   - Gerçek dünya e-ticaret sistemlerinin karmaşıklığı
   - Ödeme entegrasyonlarının incelikleri
   - Ölçeklenebilir mimari tasarım prensipleri

---

## 🎤 Kapanış Cümlesi Önerisi

> "Bu proje, teorik bilgilerimi pratik bir ürüne dönüştürme fırsatı verdi. Ödeme entegrasyonundan, çoklu satıcı yönetimine, Elasticsearch'e kadar birçok enterprise-level teknoloji ile çalıştım. Karşılaştığım her zorluk, beni daha iyi bir mühendis yaptı. Şimdi bu deneyimleri sizin projelerinize taşımaya hazırım."

---

*Bu doküman 25 Aralık 2025 tarihinde oluşturulmuştur.*
