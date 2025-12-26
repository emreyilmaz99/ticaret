# Satıcı Hakedişleri API Dokümantasyonu

## Genel Bakış

Bu dokümantasyon, admin panelinde satıcı hakedişlerini yönetmek için kullanılan API endpoint'lerini açıklar. Tüm endpoint'ler admin yetkisi gerektirir.

## Base URL

```
http://localhost:8000/api/v1/admin
```

---

## Endpoint'ler

### 1. Hakediş Listesini Getir

Tüm satıcı hakedişlerini sayfalama ile listeler.

#### Request

```http
GET /vendors/payouts
```

#### Query Parameters

| Parametre | Tip | Zorunlu | Varsayılan | Açıklama |
|-----------|-----|---------|------------|----------|
| `per_page` | integer | Hayır | 15 | Sayfa başına hakediş sayısı |
| `page` | integer | Hayır | 1 | Sayfa numarası |

#### Headers

```
Authorization: Bearer {admin_token}
Accept: application/json
```

#### Response (200 OK)

```json
{
  "success": true,
  "message": "Payouts listed",
  "data": {
    "data": [
      {
        "id": 1,
        "vendor_id": 43,
        "amount": "5000.00",
        "fee": "250.00",
        "method": "bank_transfer",
        "status": "pending",
        "reference": null,
        "processed_at": null,
        "created_at": "2025-12-23T10:00:00.000000Z",
        "updated_at": "2025-12-23T10:00:00.000000Z",
        "vendor": {
          "id": 43,
          "name": "Emre Teknolojia",
          "email": "s@gmail.com"
        }
      },
      {
        "id": 2,
        "vendor_id": 45,
        "amount": "3200.00",
        "fee": "160.00",
        "method": "bank_transfer",
        "status": "approved",
        "reference": "PAY-2025-001",
        "processed_at": null,
        "created_at": "2025-12-22T14:30:00.000000Z",
        "updated_at": "2025-12-23T09:15:00.000000Z",
        "vendor": {
          "id": 45,
          "name": "Tech Store",
          "email": "info@techstore.com"
        }
      }
    ],
    "meta": {
      "current_page": 1,
      "last_page": 5,
      "per_page": 15,
      "total": 75
    }
  }
}
```

#### Örnek Kullanım

```javascript
// JavaScript/React örneği
const fetchPayouts = async (page = 1, perPage = 15) => {
  const response = await fetch(
    `http://localhost:8000/api/v1/admin/vendors/payouts?page=${page}&per_page=${perPage}`,
    {
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Accept': 'application/json'
      }
    }
  );
  
  const result = await response.json();
  return result.data;
};
```

---

### 2. Hakediş Detayını Getir

Belirli bir hakedişin detaylarını getirir.

#### Request

```http
GET /vendors/payouts/{payout_id}
```

#### Path Parameters

| Parametre | Tip | Açıklama |
|-----------|-----|----------|
| `payout_id` | integer | Hakediş ID'si |

#### Headers

```
Authorization: Bearer {admin_token}
Accept: application/json
```

#### Response (200 OK)

```json
{
  "success": true,
  "message": "Payout fetched",
  "data": {
    "id": 1,
    "vendor_id": 43,
    "amount": "5000.00",
    "fee": "250.00",
    "method": "bank_transfer",
    "status": "pending",
    "reference": null,
    "processed_at": null,
    "created_at": "2025-12-23T10:00:00.000000Z",
    "updated_at": "2025-12-23T10:00:00.000000Z",
    "vendor": {
      "id": 43,
      "name": "Emre Teknolojia",
      "email": "s@gmail.com",
      "phone": "+90 555 123 4567",
      "iban": "TR12 3456 7890 1234 5678 9012 34",
      "bank_name": "İş Bankası"
    }
  }
}
```

#### Response (404 Not Found)

```json
{
  "success": false,
  "message": "Payout not found",
  "data": null
}
```

#### Örnek Kullanım

```javascript
// JavaScript/React örneği
const fetchPayoutDetail = async (payoutId) => {
  const response = await fetch(
    `http://localhost:8000/api/v1/admin/vendors/payouts/${payoutId}`,
    {
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Accept': 'application/json'
      }
    }
  );
  
  const result = await response.json();
  return result.data;
};
```

---

### 3. Hakediş Durumunu Güncelle

Hakedişin durumunu değiştirir (onaylar, reddeder veya işlendi olarak işaretler).

#### Request

```http
PUT /vendors/payouts/{payout_id}
Content-Type: application/json
```

#### Path Parameters

| Parametre | Tip | Açıklama |
|-----------|-----|----------|
| `payout_id` | integer | Hakediş ID'si |

#### Headers

```
Authorization: Bearer {admin_token}
Accept: application/json
Content-Type: application/json
```

#### Request Body

```json
{
  "status": "approved"
}
```

#### Body Parameters

| Parametre | Tip | Zorunlu | Açıklama |
|-----------|-----|---------|----------|
| `status` | string | Evet | Yeni durum: `pending`, `approved`, `rejected`, `processed` |

#### Response (200 OK)

```json
{
  "success": true,
  "message": "Payout updated",
  "data": {
    "id": 1,
    "vendor_id": 43,
    "amount": "5000.00",
    "fee": "250.00",
    "method": "bank_transfer",
    "status": "approved",
    "reference": null,
    "processed_at": null,
    "created_at": "2025-12-23T10:00:00.000000Z",
    "updated_at": "2025-12-23T16:45:00.000000Z",
    "vendor": {
      "id": 43,
      "name": "Emre Teknolojia",
      "email": "s@gmail.com"
    }
  }
}
```

#### Response (422 Unprocessable Entity)

```json
{
  "success": false,
  "message": "Invalid status",
  "data": null
}
```

#### Response (404 Not Found)

```json
{
  "success": false,
  "message": "Payout not found",
  "data": null
}
```

#### Örnek Kullanım

```javascript
// JavaScript/React örneği
const updatePayoutStatus = async (payoutId, newStatus) => {
  const response = await fetch(
    `http://localhost:8000/api/v1/admin/vendors/payouts/${payoutId}`,
    {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ status: newStatus })
    }
  );
  
  const result = await response.json();
  return result.data;
};

// Kullanım örnekleri
updatePayoutStatus(1, 'approved');  // Hakedişi onayla
updatePayoutStatus(2, 'rejected');  // Hakedişi reddet
updatePayoutStatus(3, 'processed'); // Hakedişi işlendi olarak işaretle
```

---

## Durum Değerleri

Hakediş durumları ve açıklamaları:

| Durum | Açıklama | Renk Önerisi |
|-------|----------|--------------|
| `pending` | Beklemede - Yeni oluşturulmuş, admin onayı bekliyor | Sarı/Turuncu |
| `approved` | Onaylandı - Admin tarafından onaylandı, ödeme yapılacak | Mavi |
| `rejected` | Reddedildi - Admin tarafından reddedildi | Kırmızı |
| `processed` | İşlendi - Ödeme yapıldı ve tamamlandı | Yeşil |

### Durum Geçişleri

```
pending → approved → processed
pending → rejected
```

**Not:** `status` `processed` olarak ayarlandığında, `processed_at` alanı otomatik olarak şu anki zaman ile doldurulur.

---

## Veri Modeli

### VendorPayout Object

```typescript
interface VendorPayout {
  id: number;
  vendor_id: number;
  amount: string;          // Decimal, satıcıya ödenecek net tutar
  fee: string;             // Decimal, komisyon ücreti
  method: string;          // Ödeme yöntemi (bank_transfer, vb.)
  status: 'pending' | 'approved' | 'rejected' | 'processed';
  reference: string | null; // Ödeme referans numarası
  processed_at: string | null; // ISO 8601 tarih
  created_at: string;      // ISO 8601 tarih
  updated_at: string;      // ISO 8601 tarih
  vendor: Vendor;          // İlişkili satıcı
}

interface Vendor {
  id: number;
  name: string;
  email: string;
  phone?: string;
  iban?: string;
  bank_name?: string;
}
```

---

## Hata Kodları

| HTTP Kodu | Açıklama |
|-----------|----------|
| 200 | Başarılı |
| 401 | Unauthorized - Geçersiz veya eksik token |
| 403 | Forbidden - Admin yetkisi yok |
| 404 | Not Found - Hakediş bulunamadı |
| 422 | Unprocessable Entity - Geçersiz durum değeri |
| 500 | Internal Server Error - Sunucu hatası |

---

## Güvenlik

- Tüm endpoint'ler **admin authentication** gerektirir
- Admin token `Authorization: Bearer {token}` header'ında gönderilmelidir
- Admin'in gerekli yetkisi olmalıdır (role: admin)

---

## Örnek React Komponenti

```jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const VendorPayoutsPage = () => {
  const [payouts, setPayouts] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(false);

  const API_BASE = 'http://localhost:8000/api/v1/admin';
  const token = localStorage.getItem('adminToken');

  const fetchPayouts = async (page = 1) => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE}/vendors/payouts`, {
        params: { page, per_page: 15 },
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setPayouts(response.data.data.data);
      setPagination(response.data.data.meta);
    } catch (error) {
      console.error('Error fetching payouts:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (payoutId, newStatus) => {
    try {
      await axios.put(
        `${API_BASE}/vendors/payouts/${payoutId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Listeyi yenile
      fetchPayouts(pagination.current_page);
      alert('Hakediş durumu güncellendi');
    } catch (error) {
      console.error('Error updating payout:', error);
      alert('Hata: ' + error.response?.data?.message);
    }
  };

  useEffect(() => {
    fetchPayouts();
  }, []);

  const getStatusBadge = (status) => {
    const badges = {
      pending: { text: 'Beklemede', color: 'bg-yellow-500' },
      approved: { text: 'Onaylandı', color: 'bg-blue-500' },
      rejected: { text: 'Reddedildi', color: 'bg-red-500' },
      processed: { text: 'İşlendi', color: 'bg-green-500' }
    };
    return badges[status] || { text: status, color: 'bg-gray-500' };
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Satıcı Hakedişleri</h1>
      
      {loading ? (
        <p>Yükleniyor...</p>
      ) : (
        <>
          <table className="min-w-full bg-white border">
            <thead>
              <tr>
                <th className="px-4 py-2 border">ID</th>
                <th className="px-4 py-2 border">Satıcı</th>
                <th className="px-4 py-2 border">Tutar</th>
                <th className="px-4 py-2 border">Komisyon</th>
                <th className="px-4 py-2 border">Durum</th>
                <th className="px-4 py-2 border">Tarih</th>
                <th className="px-4 py-2 border">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {payouts.map((payout) => {
                const badge = getStatusBadge(payout.status);
                return (
                  <tr key={payout.id}>
                    <td className="px-4 py-2 border">{payout.id}</td>
                    <td className="px-4 py-2 border">
                      {payout.vendor.name}
                      <br />
                      <small className="text-gray-500">{payout.vendor.email}</small>
                    </td>
                    <td className="px-4 py-2 border">₺{payout.amount}</td>
                    <td className="px-4 py-2 border">₺{payout.fee}</td>
                    <td className="px-4 py-2 border">
                      <span className={`px-2 py-1 rounded text-white ${badge.color}`}>
                        {badge.text}
                      </span>
                    </td>
                    <td className="px-4 py-2 border">
                      {new Date(payout.created_at).toLocaleDateString('tr-TR')}
                    </td>
                    <td className="px-4 py-2 border">
                      {payout.status === 'pending' && (
                        <>
                          <button
                            onClick={() => updateStatus(payout.id, 'approved')}
                            className="bg-blue-500 text-white px-3 py-1 rounded mr-2"
                          >
                            Onayla
                          </button>
                          <button
                            onClick={() => updateStatus(payout.id, 'rejected')}
                            className="bg-red-500 text-white px-3 py-1 rounded"
                          >
                            Reddet
                          </button>
                        </>
                      )}
                      {payout.status === 'approved' && (
                        <button
                          onClick={() => updateStatus(payout.id, 'processed')}
                          className="bg-green-500 text-white px-3 py-1 rounded"
                        >
                          İşlendi Olarak İşaretle
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          
          {/* Pagination */}
          <div className="mt-4 flex justify-center space-x-2">
            {Array.from({ length: pagination.last_page }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => fetchPayouts(page)}
                className={`px-3 py-1 rounded ${
                  pagination.current_page === page
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200'
                }`}
              >
                {page}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default VendorPayoutsPage;
```

---

## Test Senaryoları

### 1. Hakediş Listesini Getirme

```bash
curl -X GET "http://localhost:8000/api/v1/admin/vendors/payouts?page=1&per_page=15" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Accept: application/json"
```

### 2. Hakediş Detayı

```bash
curl -X GET "http://localhost:8000/api/v1/admin/vendors/payouts/1" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Accept: application/json"
```

### 3. Hakedişi Onaylama

```bash
curl -X PUT "http://localhost:8000/api/v1/admin/vendors/payouts/1" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Accept: application/json" \
  -H "Content-Type: application/json" \
  -d '{"status": "approved"}'
```

### 4. Hakedişi Reddetme

```bash
curl -X PUT "http://localhost:8000/api/v1/admin/vendors/payouts/1" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Accept: application/json" \
  -H "Content-Type: application/json" \
  -d '{"status": "rejected"}'
```

### 5. Hakedişi İşlendi Olarak İşaretleme

```bash
curl -X PUT "http://localhost:8000/api/v1/admin/vendors/payouts/1" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Accept: application/json" \
  -H "Content-Type: application/json" \
  -d '{"status": "processed"}'
```

---

## Notlar

1. **Admin Log:** Her durum değişikliği `storage/logs/laravel.log` dosyasına kaydedilir
2. **Transaction:** Durum güncellemeleri database transaction içinde yapılır
3. **Lock:** Güncelleme sırasında kayıt kilitlenir (`lockForUpdate`)
4. **Processed At:** Status `processed` olunca otomatik `processed_at` tarihi atanır
5. **Vendor Relation:** Tüm sorgularda vendor ilişkisi eager loading ile yüklenir

---

## Sık Sorulan Sorular

**S: Aynı anda birden fazla hakedişi güncelleyebilir miyim?**
Hayır, şu anda API tek tek güncelleme destekliyor. Toplu işlem için yeni endpoint eklenebilir.

**S: Processed durumundaki bir hakedişi tekrar pending yapabilir miyim?**
Evet, API buna izin verir ama iş mantığı açısından önerilmez. Frontend'de bunu engelleyebilirsiniz.

**S: Filtreleme ve arama desteği var mı?**
Şu anda yok. İhtiyaç durumunda backend'e query parametreleri eklenebilir.

---

## Changelog

- **v1.0.0** (2025-12-23): İlk sürüm
  - Hakediş listeleme
  - Hakediş detay görüntüleme
  - Durum güncelleme

---

## İletişim

Sorularınız için: Laravel Backend Team
