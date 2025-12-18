<?php

namespace App\Services\Tax;

use App\Interfaces\Services\Tax\TaxClassCrudServiceInterface;
use App\Core\ServiceResponse;
use App\Models\TaxClass;
use App\Services\BaseService;
use Illuminate\Support\Facades\DB;

class TaxClassCrudService extends BaseService implements TaxClassCrudServiceInterface
{
    /**
     * Tüm vergi sınıflarını listele
     */
    public function list(array $filters = []): ServiceResponse
    {
        try {
            $query = TaxClass::query()->ordered();

            // Aktif/pasif filtresi
            if (isset($filters['is_active'])) {
                $query->where('is_active', $filters['is_active']);
            }

            // Sadece aktif olanları getir (default behavior for public)
            if (isset($filters['active_only']) && $filters['active_only']) {
                $query->active();
            }

            $taxClasses = $query->get();

            // Her vergi sınıfı için ürün sayısını ekle
            $taxClasses->each(function ($taxClass) {
                $taxClass->products_count = $taxClass->products()->count();
            });

            return $this->successResponse([
                'tax_classes' => $taxClasses,
            ]);
        } catch (\Exception $e) {
            return $this->handleException($e, 'Vergi sınıfları listelenemedi');
        }
    }

    /**
     * Sadece aktif vergi sınıflarını getir
     */
    public function getActive(): ServiceResponse
    {
        return $this->list(['active_only' => true]);
    }

    /**
     * Varsayılan vergi sınıfını getir
     */
    public function getDefault(): ServiceResponse
    {
        try {
            $taxClass = TaxClass::where('is_default', true)->first();

            if (!$taxClass) {
                return $this->errorResponse('Varsayılan vergi sınıfı bulunamadı', 404);
            }

            return $this->successResponse(['tax_class' => $taxClass]);
        } catch (\Exception $e) {
            return $this->handleException($e, 'Varsayılan vergi sınıfı alınamadı');
        }
    }

    /**
     * ID'ye göre vergi sınıfı getir
     */
    public function find(int $id): ServiceResponse
    {
        try {
            $taxClass = TaxClass::find($id);

            if (!$taxClass) {
                return $this->errorResponse('Vergi sınıfı bulunamadı', 404);
            }

            $taxClass->products_count = $taxClass->products()->count();

            return $this->successResponse(['tax_class' => $taxClass]);
        } catch (\Exception $e) {
            return $this->handleException($e, 'Vergi sınıfı bilgisi alınamadı');
        }
    }

    /**
     * Yeni vergi sınıfı oluştur
     */
    public function create(array $data): ServiceResponse
    {
        try {
            DB::beginTransaction();

            // Eğer varsayılan olarak işaretlenmişse, diğerlerini kaldır
            if (isset($data['is_default']) && $data['is_default']) {
                TaxClass::where('is_default', true)->update(['is_default' => false]);
            }

            $taxClass = TaxClass::create($data);

            DB::commit();

            return $this->successResponse(
                ['tax_class' => $taxClass],
                'Vergi sınıfı başarıyla oluşturuldu',
                201
            );
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->handleException($e, 'Vergi sınıfı oluşturulamadı');
        }
    }

    /**
     * Vergi sınıfını güncelle
     */
    public function update(int $id, array $data): ServiceResponse
    {
        try {
            DB::beginTransaction();

            $taxClass = TaxClass::find($id);

            if (!$taxClass) {
                return $this->errorResponse('Vergi sınıfı bulunamadı', 404);
            }

            // Eğer varsayılan olarak işaretlenmişse, diğerlerini kaldır
            if (isset($data['is_default']) && $data['is_default']) {
                TaxClass::where('id', '!=', $id)
                    ->where('is_default', true)
                    ->update(['is_default' => false]);
            }

            $taxClass->update($data);

            DB::commit();

            return $this->successResponse(
                ['tax_class' => $taxClass->fresh()],
                'Vergi sınıfı başarıyla güncellendi'
            );
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->handleException($e, 'Vergi sınıfı güncellenemedi');
        }
    }

    /**
     * Vergi sınıfını sil
     */
    public function delete(int $id): ServiceResponse
    {
        try {
            $taxClass = TaxClass::find($id);

            if (!$taxClass) {
                return $this->errorResponse('Vergi sınıfı bulunamadı', 404);
            }

            // Ürün bağlıysa silinmesine izin verme
            if (!$taxClass->canBeDeleted()) {
                return $this->errorResponse(
                    'Bu vergi sınıfına bağlı ürünler var. Silme işlemi gerçekleştirilemez.',
                    422
                );
            }

            // Varsayılan vergi sınıfı silinmemeli
            if ($taxClass->is_default) {
                return $this->errorResponse(
                    'Varsayılan vergi sınıfı silinemez. Önce başka bir vergi sınıfını varsayılan yapın.',
                    422
                );
            }

            $taxClass->delete();

            return $this->successResponse(null, 'Vergi sınıfı başarıyla silindi');
        } catch (\Exception $e) {
            return $this->handleException($e, 'Vergi sınıfı silinemedi');
        }
    }
}
