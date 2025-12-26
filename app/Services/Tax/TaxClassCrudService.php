<?php

namespace App\Services\Tax;

use App\Interfaces\Services\Tax\TaxClassCrudServiceInterface;
use App\Core\ServiceResponse;
use App\Repositories\Interfaces\TaxClassRepositoryInterface;
use App\Services\BaseService;
use Illuminate\Support\Facades\DB;

class TaxClassCrudService extends BaseService implements TaxClassCrudServiceInterface
{
    public function __construct(
        protected TaxClassRepositoryInterface $taxClassRepo
    ) {}

    /**
     * Tüm vergi sınıflarını listele
     */
    public function list(array $filters = []): ServiceResponse
    {
        try {
            $taxClasses = $this->taxClassRepo->getAll($filters);

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
            $taxClass = $this->taxClassRepo->getDefault();

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
            $taxClass = $this->taxClassRepo->findWithProductCount($id);

            if (!$taxClass) {
                return $this->errorResponse('Vergi sınıfı bulunamadı', 404);
            }

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
                $this->taxClassRepo->clearDefaultExcept();
            }

            $taxClass = $this->taxClassRepo->create($data);

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

            $taxClass = $this->taxClassRepo->find($id);

            if (!$taxClass) {
                return $this->errorResponse('Vergi sınıfı bulunamadı', 404);
            }

            // Eğer varsayılan olarak işaretlenmişse, diğerlerini kaldır
            if (isset($data['is_default']) && $data['is_default']) {
                $this->taxClassRepo->clearDefaultExcept($id);
            }

            $taxClass = $this->taxClassRepo->update($id, $data);

            DB::commit();

            return $this->successResponse(
                ['tax_class' => $taxClass],
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
            $taxClass = $this->taxClassRepo->findWithProductCount($id);

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

            $this->taxClassRepo->delete($id);

            return $this->successResponse(null, 'Vergi sınıfı başarıyla silindi');
        } catch (\Exception $e) {
            return $this->handleException($e, 'Vergi sınıfı silinemedi');
        }
    }
}
