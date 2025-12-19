# 🚀 Unified Endpoints - Frontend Integration Guide

## 📋 İçindekiler
1. [Genel Bakış](#genel-bakış)
2. [Authentication](#authentication)
3. [Unified Endpoints](#unified-endpoints)
4. [Request Örnekleri](#request-örnekleri)
5. [Error Handling](#error-handling)
6. [Migration Guide](#migration-guide)

---

## 🎯 Genel Bakış

Yeni **Unified Endpoint** mimarisinde, Admin/Vendor/User için ayrı endpoint'ler yerine **tek bir endpoint** kullanılıyor. 

### ✅ Önceki Mimari (Deprecated)
```
GET /api/v1/admin/orders    → Admin siparişleri
GET /api/v1/vendor/orders   → Vendor siparişleri  
GET /api/v1/user/orders     → User siparişleri
```

### ✨ Yeni Mimari (Unified)
```
GET /api/v1/orders          → Token'daki user type'a göre otomatik yönlendirme
```

Backend **token'dan user type'ı otomatik tespit eder** ve doğru controller'a yönlendirir.

---

## 🔐 Authentication

### Token Kullanımı
Tüm authenticated endpoint'ler için **Sanctum token** gereklidir:

```javascript
// Axios örneği
axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

// Fetch örneği
fetch('/api/v1/orders', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})
```

### Login Endpoint'leri (Değişmedi)
```
POST /api/v1/admin/login    → Admin login
POST /api/v1/vendor/login   → Vendor login
POST /api/v1/user/login     → User login
```

**Not:** Login endpoint'leri ayrı kaldı çünkü henüz token yok!

---

## 🌐 Unified Endpoints

### 1. Profile Management

#### GET `/api/v1/me` - Profil Bilgisi
**Tüm user type'lar için çalışır**

**Request:**
```javascript
GET /api/v1/me
Headers: {
  Authorization: Bearer {token}
}
```

**Response (User):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+90 555 123 4567"
  }
}
```

**Response (Vendor):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "company_name": "ABC Store",
    "email": "vendor@abc.com",
    "phone": "+90 555 987 6543",
    "tax_id": "1234567890",
    "status": "active"
  }
}
```

#### PUT `/api/v1/profile` - Profil Güncelleme
**Tüm user type'lar için çalışır**

**Request (User):**
```javascript
PUT /api/v1/profile
{
  "name": "John Doe Updated",
  "email": "newemail@example.com",
  "phone": "+90 555 111 2222"
}
```

**Request (Vendor):**
```javascript
PUT /api/v1/profile
{
  "company_name": "ABC Store Updated",
  "email": "newvendor@abc.com",
  "description": "We sell quality products"
}
```

---

### 2. Orders Management

#### GET `/api/v1/orders` - Sipariş Listesi
**Davranış:**
- **User:** Kendi siparişlerini görür
- **Vendor:** Kendi ürünlerinin olduğu siparişleri görür
- **Admin:** Tüm siparişleri görür

**Request:**
```javascript
GET /api/v1/orders?page=1&status=pending
```

**Query Parameters:**
- `page` - Sayfa numarası
- `status` - pending, processing, shipped, delivered, cancelled
- `per_page` - Sayfa başına kayıt (default: 15)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "order_number": "ORD-2025-001",
      "status": "pending",
      "total": 299.99,
      "items_count": 3,
      "created_at": "2025-12-19T10:30:00Z"
    }
  ],
  "meta": {
    "current_page": 1,
    "last_page": 5,
    "per_page": 15,
    "total": 73
  }
}
```

#### GET `/api/v1/orders/stats` - Sipariş İstatistikleri
**Kullanıcılar:** Vendor, Admin (User için 403 döner)

**Response:**
```json
{
  "success": true,
  "data": {
    "total_orders": 156,
    "pending_orders": 23,
    "completed_orders": 120,
    "cancelled_orders": 13,
    "total_revenue": 45678.90
  }
}
```

#### GET `/api/v1/orders/{orderNumber}` - Sipariş Detayı
**Tüm user type'lar için**

**Request:**
```javascript
GET /api/v1/orders/ORD-2025-001
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "order_number": "ORD-2025-001",
    "status": "processing",
    "total": 299.99,
    "user": {
      "name": "John Doe",
      "email": "john@example.com"
    },
    "items": [
      {
        "product_name": "Product A",
        "quantity": 2,
        "price": 99.99
      }
    ],
    "shipping_address": {
      "city": "Istanbul",
      "district": "Kadıköy",
      "address": "Example St. No:123"
    }
  }
}
```

#### PUT `/api/v1/orders/{orderId}/status` - Sipariş Durumu Güncelleme
**Kullanıcılar:** Vendor, Admin (User için 403 döner)

**Request:**
```javascript
PUT /api/v1/orders/1/status
{
  "status": "shipped",
  "note": "Kargo şirketi: Aras Kargo, Takip No: 123456789"
}
```

#### POST `/api/v1/orders/{orderNumber}/cancel` - Sipariş İptali
**Tüm user type'lar için** (User sadece pending siparişleri iptal edebilir)

**Request:**
```javascript
POST /api/v1/orders/ORD-2025-001/cancel
{
  "reason": "Ürün artık ihtiyacım yok"
}
```

#### POST `/api/v1/orders/{orderId}/notes` - Sipariş Notu Ekleme
**Kullanıcılar:** Sadece Admin

**Request:**
```javascript
POST /api/v1/orders/1/notes
{
  "note": "Müşteri aradı, adres değişikliği istedi",
  "is_customer_notified": false
}
```

#### GET `/api/v1/orders/{orderId}/notes` - Sipariş Notları
**Kullanıcılar:** Sadece Admin

---

### 3. Address Management

#### GET `/api/v1/addresses` - Adres Listesi
**Kullanıcılar:** User, Vendor (Admin için 403 döner)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Ev Adresi",
      "first_name": "John",
      "last_name": "Doe",
      "phone": "+90 555 123 4567",
      "city": "Istanbul",
      "district": "Kadıköy",
      "address": "Example St. No:123",
      "postal_code": "34710",
      "is_default": true
    }
  ]
}
```

#### POST `/api/v1/addresses` - Yeni Adres Ekleme
**Kullanıcılar:** User, Vendor

**Request:**
```javascript
POST /api/v1/addresses
{
  "title": "İş Adresi",
  "first_name": "John",
  "last_name": "Doe",
  "phone": "+90 555 123 4567",
  "city": "Istanbul",
  "district": "Beşiktaş",
  "address": "Business Center, Floor 5",
  "postal_code": "34353",
  "is_default": false
}
```

#### PUT `/api/v1/addresses/{id}` - Adres Güncelleme
**Kullanıcılar:** User, Vendor

**Request:**
```javascript
PUT /api/v1/addresses/1
{
  "phone": "+90 555 999 8888",
  "postal_code": "34710"
}
```

#### DELETE `/api/v1/addresses/{id}` - Adres Silme
**Kullanıcılar:** User, Vendor

#### PUT `/api/v1/addresses/{id}/default` - Varsayılan Adres Yapma
**Kullanıcılar:** Sadece User

**Request:**
```javascript
PUT /api/v1/addresses/1/default
```

---

### 4. Reviews Management

#### GET `/api/v1/reviews` - Yorum Listesi
**Davranış:**
- **User:** Kendi yorumlarını görür
- **Vendor:** Ürünlerine yapılan yorumları görür
- **Admin:** Tüm yorumları görür

**Request:**
```javascript
GET /api/v1/reviews?status=approved&page=1
```

**Query Parameters:**
- `status` - pending, approved, rejected
- `rating` - 1-5 arası
- `page` - Sayfa numarası

#### GET `/api/v1/reviews/stats` - Yorum İstatistikleri
**Kullanıcılar:** Vendor, Admin

**Response:**
```json
{
  "success": true,
  "data": {
    "total_reviews": 245,
    "approved_reviews": 198,
    "pending_reviews": 32,
    "rejected_reviews": 15,
    "average_rating": 4.2
  }
}
```

#### POST `/api/v1/orders/{orderId}/items/{orderItemId}/review` - Yorum Ekleme
**Kullanıcılar:** Sadece User

**Request:**
```javascript
POST /api/v1/orders/1/items/5/review
{
  "rating": 5,
  "title": "Harika ürün!",
  "comment": "Kalitesi çok iyi, herkese tavsiye ederim.",
  "images": [File, File] // Optional - Max 5 images
}
```

#### GET `/api/v1/reviewable-orders` - Yorum Yapılabilecek Siparişler
**Kullanıcılar:** Sadece User

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "order_id": 10,
      "order_number": "ORD-2025-010",
      "items": [
        {
          "order_item_id": 25,
          "product_name": "Product X",
          "can_review": true
        }
      ]
    }
  ]
}
```

#### DELETE `/api/v1/reviews/{id}` - Yorum Silme
**Kullanıcılar:** User (kendi yorumunu), Admin (herhangi bir yorumu)

#### POST `/api/v1/reviews/{id}/approve` - Yorum Onaylama
**Kullanıcılar:** Sadece Admin

**Request:**
```javascript
POST /api/v1/reviews/5/approve
```

#### POST `/api/v1/reviews/{id}/reject` - Yorum Reddetme
**Kullanıcılar:** Sadece Admin

**Request:**
```javascript
POST /api/v1/reviews/5/reject
{
  "reason": "Uygunsuz içerik"
}
```

#### POST `/api/v1/reviews/bulk-approve` - Toplu Onaylama
**Kullanıcılar:** Sadece Admin

**Request:**
```javascript
POST /api/v1/reviews/bulk-approve
{
  "review_ids": [1, 2, 3, 4, 5]
}
```

#### POST `/api/v1/reviews/bulk-reject` - Toplu Reddetme
**Kullanıcılar:** Sadece Admin

**Request:**
```javascript
POST /api/v1/reviews/bulk-reject
{
  "review_ids": [6, 7, 8],
  "reason": "Spam içerik"
}
```

#### POST `/api/v1/reviews/{reviewId}/response` - Vendor Yanıtı Ekleme
**Kullanıcılar:** Sadece Vendor

**Request:**
```javascript
POST /api/v1/reviews/10/response
{
  "response": "Geri bildiriminiz için teşekkür ederiz!"
}
```

#### DELETE `/api/v1/review-responses/{responseId}` - Vendor Yanıtı Silme
**Kullanıcılar:** Sadece Vendor

#### GET `/api/v1/reviews/trashed` - Silinen Yorumlar
**Kullanıcılar:** Sadece Admin

---

### 5. Products Management

#### GET `/api/v1/products` - Ürün Listesi
**Kullanıcılar:** Vendor (kendi ürünleri), Admin (tüm ürünler)

**Request:**
```javascript
GET /api/v1/products?status=active&page=1
```

**Query Parameters:**
- `status` - active, inactive, draft, pending, rejected
- `category_id` - Kategori ID
- `search` - Ürün adında arama
- `page` - Sayfa numarası

#### GET `/api/v1/products/statistics` - Ürün İstatistikleri
**Kullanıcılar:** Sadece Admin

**Response:**
```json
{
  "success": true,
  "data": {
    "total_products": 1250,
    "active_products": 980,
    "pending_products": 45,
    "out_of_stock": 23
  }
}
```

#### POST `/api/v1/products` - Yeni Ürün Ekleme
**Kullanıcılar:** Sadece Vendor

**Request:**
```javascript
POST /api/v1/products
{
  "name": "Yeni Ürün",
  "slug": "yeni-urun",
  "description": "Ürün açıklaması",
  "category_id": 5,
  "price": 199.99,
  "compare_price": 249.99,
  "sku": "SKU-12345",
  "stock_quantity": 100,
  "weight": 1.5,
  "tax_class_id": 1,
  "status": "draft",
  "images": [File, File], // Max 10 images
  "attributes": {
    "color": "Mavi",
    "size": "Large"
  }
}
```

#### GET `/api/v1/products/{id}` - Ürün Detayı
**Kullanıcılar:** Vendor, Admin

#### PUT `/api/v1/products/{id}` - Ürün Güncelleme
**Kullanıcılar:** Vendor (kendi ürünü)

**Request:**
```javascript
PUT /api/v1/products/5
{
  "price": 179.99,
  "stock_quantity": 85
}
```

#### PUT `/api/v1/products/{id}/status` - Ürün Durumu Güncelleme
**Kullanıcılar:** Vendor, Admin

**Request:**
```javascript
PUT /api/v1/products/5/status
{
  "status": "active"
}
```

**Request (Admin - Rejection):**
```javascript
PUT /api/v1/products/5/status
{
  "status": "rejected",
  "rejection_reason": "Ürün bilgileri eksik"
}
```

#### DELETE `/api/v1/products/{id}` - Ürün Silme
**Kullanıcılar:** Vendor, Admin

#### DELETE `/api/v1/products/{product}/photos/{photo}` - Ürün Fotoğrafı Silme
**Kullanıcılar:** Sadece Vendor

#### POST `/api/v1/products/bulk-status` - Toplu Durum Güncelleme
**Kullanıcılar:** Sadece Admin

**Request:**
```javascript
POST /api/v1/products/bulk-status
{
  "product_ids": [1, 2, 3, 4],
  "status": "active"
}
```

---

## ⚠️ Error Handling

### Error Response Format
```json
{
  "success": false,
  "message": "Error message",
  "errors": {
    "field_name": ["Validation error message"]
  }
}
```

### Common HTTP Status Codes

| Code | Açıklama | Örnek |
|------|----------|-------|
| 200 | Success | İşlem başarılı |
| 201 | Created | Yeni kayıt oluşturuldu |
| 400 | Bad Request | Geçersiz request |
| 401 | Unauthorized | Token geçersiz/eksik |
| 403 | Forbidden | Bu işlem için yetkiniz yok |
| 404 | Not Found | Kayıt bulunamadı |
| 422 | Validation Error | Form validation hatası |
| 500 | Server Error | Sunucu hatası |

### 403 Forbidden Örnekleri

```json
// User, order status güncellemeye çalışırsa:
{
  "success": false,
  "message": "Users cannot update order status"
}

// Admin, address endpoint'i kullanırsa:
{
  "success": false,
  "message": "Admins do not have addresses"
}

// User, product statistics isterse:
{
  "success": false,
  "message": "Only admins can view product statistics"
}
```

---

## 🔄 Migration Guide

### Frontend'de Yapılması Gerekenler

#### 1. API URL'lerini Güncelle

**Eski:**
```javascript
// User panel
const getOrders = () => axios.get('/api/v1/user/orders');
const getProfile = () => axios.get('/api/v1/user/profile');

// Vendor panel  
const getOrders = () => axios.get('/api/v1/vendor/orders');
const getProfile = () => axios.get('/api/v1/vendor/profile');

// Admin panel
const getOrders = () => axios.get('/api/v1/admin/orders');
const getProfile = () => axios.get('/api/v1/admin/profile');
```

**Yeni:**
```javascript
// Tüm paneller için aynı
const getOrders = () => axios.get('/api/v1/orders');
const getProfile = () => axios.get('/api/v1/me');
```

#### 2. API Service Dosyası Örneği

```javascript
// api/orders.js
import axios from 'axios';

export const ordersAPI = {
  // Tüm user type'lar için çalışır
  getOrders: (params) => 
    axios.get('/api/v1/orders', { params }),
  
  getOrderDetails: (orderNumber) => 
    axios.get(`/api/v1/orders/${orderNumber}`),
  
  cancelOrder: (orderNumber, reason) => 
    axios.post(`/api/v1/orders/${orderNumber}/cancel`, { reason }),
  
  // Sadece Vendor/Admin için
  getStats: () => 
    axios.get('/api/v1/orders/stats'),
  
  updateStatus: (orderId, status, note) => 
    axios.put(`/api/v1/orders/${orderId}/status`, { status, note }),
};
```

#### 3. Conditional Rendering Örneği

```jsx
// React örneği
const OrderManagement = () => {
  const { userType } = useAuth(); // 'user', 'vendor', 'admin'
  
  return (
    <div>
      <OrderList /> {/* Herkes görebilir */}
      
      {/* Sadece Vendor ve Admin görebilir */}
      {['vendor', 'admin'].includes(userType) && (
        <OrderStatistics />
      )}
      
      {/* Sadece Admin görebilir */}
      {userType === 'admin' && (
        <OrderNotes />
      )}
    </div>
  );
};
```

#### 4. Error Handling Örneği

```javascript
try {
  const response = await axios.post('/api/v1/orders/1/status', {
    status: 'shipped'
  });
  
  // Success
  showNotification('Sipariş durumu güncellendi', 'success');
  
} catch (error) {
  if (error.response?.status === 403) {
    // User yetkisi yok
    showNotification('Bu işlem için yetkiniz yok', 'error');
  } else if (error.response?.status === 422) {
    // Validation hatası
    const errors = error.response.data.errors;
    showValidationErrors(errors);
  } else {
    // Genel hata
    showNotification('Bir hata oluştu', 'error');
  }
}
```

---

## 📊 Endpoint Karşılaştırma Tablosu

| Feature | Eski Endpoint | Yeni Endpoint | User Type |
|---------|--------------|---------------|-----------|
| Profil Görüntüle | `/api/v1/{type}/profile` | `/api/v1/me` | All |
| Profil Güncelle | `/api/v1/{type}/profile` | `/api/v1/profile` | All |
| Sipariş Listesi | `/api/v1/{type}/orders` | `/api/v1/orders` | All |
| Sipariş Detay | `/api/v1/{type}/orders/{id}` | `/api/v1/orders/{id}` | All |
| Sipariş İstatistik | `/api/v1/{type}/orders/stats` | `/api/v1/orders/stats` | Vendor, Admin |
| Adres Listesi | `/api/v1/{type}/addresses` | `/api/v1/addresses` | User, Vendor |
| Yorum Listesi | `/api/v1/{type}/reviews` | `/api/v1/reviews` | All |
| Ürün Listesi | `/api/v1/{type}/products` | `/api/v1/products` | Vendor, Admin |

---

## 🎯 Özet

### ✅ Avantajlar
- **Tek endpoint** - URL'leri ezberlemesi kolay
- **Otomatik yönlendirme** - Backend token'dan user type'ı algılıyor
- **Daha az kod** - Frontend'de kod tekrarı azaldı
- **Type-safe** - Backend validation garantiliyor

### ⚡ Hızlı Başlangıç
1. Token'ı Authorization header'a ekle
2. `/api/v1/me` ile profil bilgisini al
3. Unified endpoint'leri kullanmaya başla
4. 403 hatalarını handle et (yetkisiz işlemler için)

### 📞 Yardım
Herhangi bir sorun olursa backend ekibi ile iletişime geçin!

---

**Son Güncelleme:** 19 Aralık 2025
**API Version:** v1
**Endpoint Sayısı:** 196 → Unified: 36
