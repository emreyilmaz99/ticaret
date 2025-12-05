<?php

namespace App\Http\Controllers\Api\V1\Vendor;

use App\Http\Controllers\Controller;
use App\Models\VendorCoupon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class CouponController extends Controller
{
    /**
     * Satıcının kuponlarını listele
     */
    public function index(): JsonResponse
    {
        $vendor = auth('vendor')->user();
        
        $coupons = VendorCoupon::where('vendor_id', $vendor->id)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => $coupons,
        ]);
    }

    /**
     * Yeni kupon oluştur
     */
    public function store(Request $request): JsonResponse
    {
        $vendor = auth('vendor')->user();

        $validator = Validator::make($request->all(), [
            'code' => [
                'required',
                'string',
                'max:50',
                'alpha_num',
                Rule::unique('vendor_coupons')->where(function ($query) use ($vendor) {
                    return $query->where('vendor_id', $vendor->id);
                }),
            ],
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'discount_amount' => 'required|numeric|min:1|max:99999.99',
            'min_order_amount' => 'nullable|numeric|min:0|max:99999.99',
            'usage_limit' => 'nullable|integer|min:1',
            'usage_limit_per_user' => 'nullable|integer|min:1',
            'starts_at' => 'nullable|date',
            'expires_at' => 'nullable|date|after_or_equal:starts_at',
            'is_active' => 'boolean',
        ], [
            'code.required' => 'Kupon kodu gereklidir.',
            'code.unique' => 'Bu kupon kodu zaten kullanılıyor.',
            'code.alpha_num' => 'Kupon kodu sadece harf ve rakam içerebilir.',
            'name.required' => 'Kupon adı gereklidir.',
            'discount_amount.required' => 'İndirim tutarı gereklidir.',
            'discount_amount.min' => 'İndirim tutarı en az 1₺ olmalıdır.',
            'expires_at.after_or_equal' => 'Bitiş tarihi başlangıç tarihinden önce olamaz.',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Doğrulama hatası',
                'errors' => $validator->errors(),
            ], 422);
        }

        $coupon = VendorCoupon::create([
            'vendor_id' => $vendor->id,
            'code' => strtoupper($request->code),
            'name' => $request->name,
            'description' => $request->description,
            'discount_amount' => $request->discount_amount,
            'min_order_amount' => $request->min_order_amount ?? 0,
            'usage_limit' => $request->usage_limit,
            'usage_limit_per_user' => $request->usage_limit_per_user,
            'starts_at' => $request->starts_at,
            'expires_at' => $request->expires_at,
            'is_active' => $request->is_active ?? true,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Kupon başarıyla oluşturuldu.',
            'data' => $coupon,
        ], 201);
    }

    /**
     * Kupon detayını göster
     */
    public function show(VendorCoupon $coupon): JsonResponse
    {
        $vendor = auth('vendor')->user();

        if ($coupon->vendor_id !== $vendor->id) {
            return response()->json([
                'status' => 'error',
                'message' => 'Bu kupona erişim yetkiniz yok.',
            ], 403);
        }

        return response()->json([
            'status' => 'success',
            'data' => $coupon,
        ]);
    }

    /**
     * Kuponu güncelle
     */
    public function update(Request $request, VendorCoupon $coupon): JsonResponse
    {
        $vendor = auth('vendor')->user();

        if ($coupon->vendor_id !== $vendor->id) {
            return response()->json([
                'status' => 'error',
                'message' => 'Bu kupona erişim yetkiniz yok.',
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'code' => [
                'sometimes',
                'required',
                'string',
                'max:50',
                'alpha_num',
                Rule::unique('vendor_coupons')->where(function ($query) use ($vendor) {
                    return $query->where('vendor_id', $vendor->id);
                })->ignore($coupon->id),
            ],
            'name' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'discount_amount' => 'sometimes|required|numeric|min:1|max:99999.99',
            'min_order_amount' => 'nullable|numeric|min:0|max:99999.99',
            'usage_limit' => 'nullable|integer|min:1',
            'usage_limit_per_user' => 'nullable|integer|min:1',
            'starts_at' => 'nullable|date',
            'expires_at' => 'nullable|date|after_or_equal:starts_at',
            'is_active' => 'boolean',
        ], [
            'code.unique' => 'Bu kupon kodu zaten kullanılıyor.',
            'code.alpha_num' => 'Kupon kodu sadece harf ve rakam içerebilir.',
            'discount_amount.min' => 'İndirim tutarı en az 1₺ olmalıdır.',
            'expires_at.after_or_equal' => 'Bitiş tarihi başlangıç tarihinden önce olamaz.',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Doğrulama hatası',
                'errors' => $validator->errors(),
            ], 422);
        }

        $data = $validator->validated();
        if (isset($data['code'])) {
            $data['code'] = strtoupper($data['code']);
        }

        $coupon->update($data);

        return response()->json([
            'status' => 'success',
            'message' => 'Kupon başarıyla güncellendi.',
            'data' => $coupon->fresh(),
        ]);
    }

    /**
     * Kuponu sil
     */
    public function destroy(VendorCoupon $coupon): JsonResponse
    {
        $vendor = auth('vendor')->user();

        if ($coupon->vendor_id !== $vendor->id) {
            return response()->json([
                'status' => 'error',
                'message' => 'Bu kupona erişim yetkiniz yok.',
            ], 403);
        }

        $coupon->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Kupon başarıyla silindi.',
        ]);
    }

    /**
     * Kupon durumunu değiştir (aktif/pasif)
     */
    public function toggle(VendorCoupon $coupon): JsonResponse
    {
        $vendor = auth('vendor')->user();

        if ($coupon->vendor_id !== $vendor->id) {
            return response()->json([
                'status' => 'error',
                'message' => 'Bu kupona erişim yetkiniz yok.',
            ], 403);
        }

        $coupon->update(['is_active' => !$coupon->is_active]);

        return response()->json([
            'status' => 'success',
            'message' => $coupon->is_active ? 'Kupon aktifleştirildi.' : 'Kupon devre dışı bırakıldı.',
            'data' => $coupon->fresh(),
        ]);
    }
}
