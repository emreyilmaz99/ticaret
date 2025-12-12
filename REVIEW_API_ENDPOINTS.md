# Review System API Endpoints

## Public Endpoints (No Authentication Required)

### Get Product Reviews
```
GET /api/v1/products/{productId}/reviews
```
**Query Parameters:**
- `rating` (optional): Filter by rating (1-5)
- `sort_by` (optional): `recent` or `rating` (default: recent)
- `per_page` (optional): Items per page (default: 20)

**Response:**
```json
{
  "success": true,
  "data": {
    "current_page": 1,
    "data": [
      {
        "id": "...",
        "user": {...},
        "product": {...},
        "rating": 5,
        "title": "Harika ürün",
        "comment": "Çok memnun kaldım...",
        "is_anonymous": false,
        "reviewer_name": "Ahmet Y.",
        "media": [...],
        "response": {...},
        "created_at": "..."
      }
    ],
    "total": 150
  }
}
```

### Get Product Review Summary
```
GET /api/v1/products/{productId}/review-summary
```

**Response:**
```json
{
  "success": true,
  "data": {
    "total_reviews": 150,
    "average_rating": 4.5,
    "rating_breakdown": {
      "1": 5,
      "2": 10,
      "3": 20,
      "4": 35,
      "5": 80
    }
  }
}
```

---

## User Endpoints (Requires User Authentication)

### Get Reviewable Orders
```
GET /api/v1/user/reviewable-orders
```
Returns delivered orders with items that haven't been reviewed yet.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "order_id": "...",
      "order_number": "ORD-123456",
      "delivered_at": "2025-12-01",
      "items": [
        {
          "order_item_id": "...",
          "product_id": "...",
          "product_name": "Ürün Adı",
          "variant": "M / Kırmızı",
          "can_review": true
        }
      ]
    }
  ]
}
```

### Create Review
```
POST /api/v1/user/orders/{orderId}/items/{orderItemId}/review
```
**Rate Limit:** 10 requests per minute

**Request (multipart/form-data):**
```
rating: 5
title: "Harika ürün"
comment: "Çok memnun kaldım, herkese tavsiye ederim..."
is_anonymous: false
photos[0]: file
photos[1]: file
```

**Validation:**
- `rating`: required, integer, 1-5
- `title`: required, 3-100 characters
- `comment`: required, 10-1000 characters
- `is_anonymous`: optional, boolean
- `photos`: optional, max 5 images, each max 5MB, jpeg/png/jpg

**Response (201):**
```json
{
  "success": true,
  "message": "Yorumunuz başarıyla kaydedildi ve onay bekliyor.",
  "data": {
    "id": "...",
    "rating": 5,
    "title": "...",
    "status": "pending",
    ...
  }
}
```

**Auto-Rejection (Banned Words):**
```json
{
  "success": false,
  "message": "Yorumunuz yasaklı kelimeler içerdiği için otomatik olarak reddedildi: kelime1, kelime2"
}
```

### List User's Reviews
```
GET /api/v1/user/reviews
```
Returns user's own reviews including soft-deleted ones.

**Query Parameters:**
- `per_page` (optional): Items per page (default: 20)

**Response:**
```json
{
  "success": true,
  "data": {
    "current_page": 1,
    "data": [
      {
        "id": "...",
        "product": {...},
        "rating": 5,
        "status": "approved",
        "deleted_at": null,
        "media": [...],
        "response": {...}
      }
    ]
  }
}
```

### Delete Review
```
DELETE /api/v1/user/reviews/{reviewId}
```
Soft deletes the review. User can only delete their own reviews.

**Response (200):**
```json
{
  "success": true,
  "message": "Yorum başarıyla silindi."
}
```

---

## Vendor Endpoints (Requires Vendor Authentication)

### List Product Reviews
```
GET /api/v1/vendor/products/{productId}/reviews
```
Lists all approved reviews for vendor's product.

**Query Parameters:**
- `per_page` (optional): Items per page (default: 20)

**Response:**
```json
{
  "success": true,
  "data": {
    "current_page": 1,
    "data": [...]
  }
}
```

### Create Review Response
```
POST /api/v1/vendor/reviews/{reviewId}/response
```

**Request (JSON):**
```json
{
  "response_text": "Geri bildiriminiz için teşekkür ederiz..."
}
```

**Validation:**
- `response_text`: required, 10-500 characters

**Response (201):**
```json
{
  "success": true,
  "message": "Yanıtınız başarıyla kaydedildi.",
  "data": {
    "id": "...",
    "review_id": "...",
    "response_text": "...",
    "created_at": "..."
  }
}
```

**Error Cases:**
- Product doesn't belong to vendor
- Review not approved
- Response already exists
- Banned words detected (auto-rejected)

### Delete Review Response
```
DELETE /api/v1/vendor/review-responses/{responseId}
```
Soft deletes vendor's response.

**Response (200):**
```json
{
  "success": true,
  "message": "Yanıt başarıyla silindi."
}
```

### Get Review Statistics
```
GET /api/v1/vendor/review-stats
```
Returns vendor's product review statistics.

**Response:**
```json
{
  "success": true,
  "data": {
    "total_reviews": 450,
    "average_rating": 4.6,
    "pending_responses": 12,
    "responded": 438
  }
}
```

---

## Admin Endpoints (Requires Admin Authentication)

### List All Reviews
```
GET /api/v1/admin/reviews
```

**Query Parameters:**
- `status` (optional): pending, approved, rejected
- `search` (optional): Search in title, comment, user name
- `with_trashed` (optional): Include soft-deleted reviews (boolean)
- `per_page` (optional): Items per page (default: 50)

**Response:**
```json
{
  "success": true,
  "data": {
    "current_page": 1,
    "data": [
      {
        "id": "...",
        "user": {...},
        "product": {...},
        "rating": 5,
        "status": "pending",
        "media": [...],
        "response": {...},
        "created_at": "..."
      }
    ]
  }
}
```

### Get Review Statistics
```
GET /api/v1/admin/reviews/stats
```

**Response:**
```json
{
  "success": true,
  "data": {
    "pending": 25,
    "approved": 1250,
    "rejected": 45,
    "trashed": 30,
    "total": 1350
  }
}
```

### List Trashed Reviews
```
GET /api/v1/admin/reviews/trashed
```

**Query Parameters:**
- `per_page` (optional): Items per page (default: 50)

### Bulk Approve Reviews
```
POST /api/v1/admin/reviews/bulk-approve
```

**Request (JSON):**
```json
{
  "review_ids": ["id1", "id2", "id3"]
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Seçilen yorumlar onaylandı."
}
```

### Bulk Reject Reviews
```
POST /api/v1/admin/reviews/bulk-reject
```

**Request (JSON):**
```json
{
  "review_ids": ["id1", "id2"],
  "rejection_reason": "İçerik politikalarına aykırı"
}
```

**Validation:**
- `review_ids`: required, array, min 1
- `rejection_reason`: required, max 500 characters

**Response (200):**
```json
{
  "success": true,
  "message": "Seçilen yorumlar reddedildi."
}
```

### Approve Single Review
```
POST /api/v1/admin/reviews/{id}/approve
```

**Response (200):**
```json
{
  "success": true,
  "message": "Yorum onaylandı.",
  "data": {...}
}
```

### Reject Single Review
```
POST /api/v1/admin/reviews/{id}/reject
```

**Request (JSON):**
```json
{
  "rejection_reason": "Yasaklı kelimeler içeriyor"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Yorum reddedildi.",
  "data": {...}
}
```

---

## Review Status Flow

1. **User creates review** → Status: `pending` (if no banned words)
2. **Banned words detected** → Status: `rejected` (automatic)
3. **Admin approves** → Status: `approved` (visible to public)
4. **Admin rejects** → Status: `rejected` (not visible)
5. **User deletes** → Soft deleted (can be restored)

## Features Summary

✅ Order-based reviews (one review per order item)
✅ Banned words auto-rejection
✅ Photo uploads (max 5, resized to 1200px, 85% quality JPEG)
✅ Vendor responses (one per review)
✅ Anonymous review option
✅ Soft delete for reviews and responses
✅ Rate limiting (10 reviews per minute)
✅ Admin bulk actions
✅ Review statistics and breakdown
✅ Cache optimization (10 min for stats)
✅ Turkish validation messages
