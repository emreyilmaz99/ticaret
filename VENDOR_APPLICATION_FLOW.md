# Satıcı Başvuru Akışı (Vendor Application Flow)

## Backend Mimarisi

### 1️⃣ ÖN BAŞVURU (Pre-Application)
**Endpoint:** `POST /api/v1/vendor-applications`

**Kullanıcı Adımları:**
- `/vendor/register` sayfasına gider
- Ad, soyad, email, telefon, şirket adı bilgilerini girer
- Form gönderilir

**Backend İşlemi:**
- `VendorApplication` tablosuna yeni kayıt:
  - `type: 'pre_application'`
  - `status: 'pending'`
  - Email, ad-soyad, şirket bilgileri kaydedilir
- Response'da `application.id` döner

**Frontend Sonrası:**
- Kullanıcıya application ID gösterilir
- Ana sayfaya yönlendirilir
- Alert: "Ön başvurunuz alındı! Başvuru ID: X"

---

### 2️⃣ ADMIN ÖN BAŞVURU ONAYI
**Endpoint:** `POST /api/v1/admin/vendor-applications/{id}/approve-pre`

**Admin Adımları:**
- Admin panelinde "Ön Başvurular" sayfasına gider (`/admin/vendor-applications`)
- Bekleyen ön başvuruları görür (sadece `status: pending` ve `type: pre_application`)
- Başvuruyu inceler ve "Onayla" butonuna tıklar

**Backend İşlemi:**
- İlgili `VendorApplication` kaydının `status`'ü `'approved'` olur
- `reviewed_by` ve `reviewed_at` güncellenir

**Frontend Sonrası:**
- Admin'e tam başvuru linki gösterilir:
  ```
  http://localhost:5173/vendor/full-application/{id}
  ```
- Bu link email ile başvuru sahibine gönderilmelidir (şu an alert ile gösteriliyor)

---

### 3️⃣ TAM BAŞVURU (Full Application)
**Endpoint:** `POST /api/v1/vendor-applications/{preApplicationId}/submit-full`

**Kullanıcı Adımları:**
- Email'den gelen linke tıklar: `/vendor/full-application/{id}`
- Şirket bilgileri, vergi numarası, şifre girer
- Form gönderilir

**Backend İşlemi:**
1. Ön başvurunun `approved` durumda olup olmadığı kontrol edilir
2. **YENİ** bir `VendorApplication` kaydı oluşturulur:
   - `type: 'full_application'`
   - `status: 'pending'`
   - Şirket bilgileri, telefon, email (ön başvurudan)
3. **YENİ** bir `Vendor` kaydı oluşturulur:
   - `status: 'inactive'` (henüz aktif değil!)
   - `onboarding_completed: false`
   - Şirket adı, slug, email, şifre kaydedilir
4. Full application'a `vendor_id` atanır

**Frontend Sonrası:**
- Kullanıcıya "Tam başvurunuz alındı! Admin onayı bekleniyor." mesajı gösterilir
- Login sayfasına yönlendirilir

---

### 4️⃣ ADMIN TAM BAŞVURU ONAYI (Vendor Aktivasyonu)
**Endpoint:** `POST /api/v1/admin/vendor-applications/{id}/approve-full`

**Admin Adımları:**
- Admin panelinde "Satıcı Başvuruları" sayfasına gider (`/admin/vendors`)
- Bekleyen tam başvuruları görür (sadece `status: pending` ve `type: full_application`)
- Başvuruyu inceler ve "Onayla" butonuna tıklar

**Backend İşlemi:**
1. Full application'ın `status`'ü `'approved'` olur
2. İlişkili `Vendor` kaydının `status`'ü `'active'` olur
3. `activated_at` timestamp eklenir

**Frontend Sonrası:**
- Satıcı artık login yapabilir!
- "Satıcılar" sayfasında (`/admin/active-vendors`) görünür

---

## Sayfa Hiyerarşisi

### Public Sayfalar
- `/vendor/register` → Ön başvuru formu
- `/vendor/full-application/{id}` → Tam başvuru formu (ön başvuru onaylanınca erişilir)

### Admin Sayfaları
- `/admin/vendor-applications` → **Ön Başvurular** (pending pre-applications)
- `/admin/vendors` → **Satıcı Başvuruları** (pending full applications)
- `/admin/active-vendors` → **Satıcılar** (active vendors)

---

## Veri Akışı Özeti

```
[Kullanıcı] 
    ↓ (register)
[Pre-Application: pending] 
    ↓ (admin approve-pre)
[Pre-Application: approved] 
    ↓ (kullanıcı tam başvuru yapar)
[Full-Application: pending] + [Vendor: inactive]
    ↓ (admin approve-full)
[Full-Application: approved] + [Vendor: active]
    ↓
[Satıcı artık sisteme giriş yapabilir]
```

---

## Frontend Eksiğiydi, Düzeltildi ✅

1. ✅ `VendorRegister.jsx` - Backend'den dönen `application.id`'yi yakalıyor
2. ✅ `App.jsx` - Route düzeltmesi: `/vendor/full-application/:id`
3. ✅ `VendorApplications.jsx` - Ön başvuru onayı sonrası admin'e tam başvuru linki gösteriliyor
4. ✅ `FullApplicationsPage.jsx` - Sadece pending full applications gösteriliyor
5. ✅ Sayfa başlıkları netleştirildi
6. ✅ Gereksiz filtreler kaldırıldı (strict filtering zaten backend'de)

---

## Notlar

- **Email sistemi yok:** Gerçek sistemde ön başvuru onayı sonrası email otomatik gönderilmeli
- **Vendor login:** Vendor sadece `status: 'active'` ise login yapabilmeli
- **Onboarding:** Vendor login yaptıktan sonra onboarding adımlarını tamamlamalı
