<?php

namespace App\Services\Admin;

use App\Core\ServiceResponse;
use App\Interfaces\Services\Admin\AdminFeaturedDealServiceInterface;
use App\Repositories\FeaturedDealRepository;
use App\Repositories\ProductRepository;
use App\Services\BaseService;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class AdminFeaturedDealService extends BaseService implements AdminFeaturedDealServiceInterface
{
    public function __construct(
        protected FeaturedDealRepository $featuredDealRepository,
        protected ProductRepository $productRepository
    ) {}

    public function list(array $filters): ServiceResponse
    {
        try {
            $deals = $this->featuredDealRepository->getFiltered($filters);
            $stats = $this->featuredDealRepository->getStatistics();

            return $this->successResponse([
                'deals' => $deals->items(),
                'stats' => $stats,
                'pagination' => [
                    'current_page' => $deals->currentPage(),
                    'last_page' => $deals->lastPage(),
                    'per_page' => $deals->perPage(),
                    'total' => $deals->total(),
                ],
            ], 'Öne çıkan ürünler başarıyla getirildi.');
        } catch (\Exception $e) {
            return $this->handleException($e, 'Listelenemedi');
        }
    }

    public function getProductsForCreate(): ServiceResponse
    {
        try {
            $products = $this->productRepository->getActiveProductsForSelection()
                ->map(function ($product) {
                    $defaultVariant = $product->variants->first();
                    return [
                        'id' => $product->id,
                        'name' => $product->name,
                        'sku' => $product->sku ?? '',
                        'price' => $defaultVariant ? $defaultVariant->price : 0,
                        'vendor' => $product->vendor ? ['business_name' => $product->vendor->company_name ?? $product->vendor->business_name ?? ''] : null,
                        'photos' => $product->photos->map(fn($photo) => ['url' => $photo->file_path]),
                        'variants' => $product->variants->map(fn($variant) => [
                            'id' => $variant->id,
                            'title' => $variant->title,
                            'sku' => $variant->sku,
                            'price' => $variant->price,
                            'stock' => $variant->stock,
                            'attribute_values' => $variant->attributeValues ?? [],
                        ]),
                    ];
                });

            return $this->successResponse($products, 'Ürünler başarıyla getirildi.');
        } catch (\Exception $e) {
            return $this->handleException($e, 'Ürünler getirilemedi');
        }
    }

    public function create(array $data): ServiceResponse
    {
        try {
            $deal = $this->featuredDealRepository->create($data);
            Log::info('Featured deal created', ['deal_id' => $deal->id]);

            return $this->successResponse(
                ['deal' => $this->featuredDealRepository->find($deal->id)],
                'Öne çıkan ürün başarıyla oluşturuldu.',
                201
            );
        } catch (\Exception $e) {
            Log::error('Featured deal creation failed', ['error' => $e->getMessage()]);
            return $this->handleException($e, 'Öne çıkan ürün oluşturulamadı');
        }
    }

    public function find(int $id): ServiceResponse
    {
        try {
            $deal = $this->featuredDealRepository->find($id);
            
            if (!$deal) {
                return $this->errorResponse('Ürün bulunamadı', 404);
            }
            
            return $this->successResponse(['deal' => $deal], 'Öne çıkan ürün detayı başarıyla getirildi.');
        } catch (\Exception $e) {
            return $this->handleException($e, 'Ürün bulunamadı');
        }
    }

    public function update(int $id, array $data): ServiceResponse
    {
        try {
            $deal = $this->featuredDealRepository->update($id, $data);
            Log::info('Featured deal updated', ['deal_id' => $deal->id]);

            return $this->successResponse(
                ['deal' => $this->featuredDealRepository->find($deal->id)],
                'Öne çıkan ürün başarıyla güncellendi.'
            );
        } catch (\Exception $e) {
            Log::error('Featured deal update failed', ['deal_id' => $id, 'error' => $e->getMessage()]);
            return $this->handleException($e, 'Öne çıkan ürün güncellenemedi');
        }
    }

    public function delete(int $id): ServiceResponse
    {
        try {
            $this->featuredDealRepository->delete($id);
            Log::info('Featured deal deleted', ['deal_id' => $id]);

            return $this->successResponse(null, 'Öne çıkan ürün başarıyla silindi.');
        } catch (\Exception $e) {
            Log::error('Featured deal deletion failed', ['deal_id' => $id, 'error' => $e->getMessage()]);
            return $this->handleException($e, 'Öne çıkan ürün silinemedi');
        }
    }

    public function toggle(int $id): ServiceResponse
    {
        try {
            $deal = $this->featuredDealRepository->toggleActive($id);

            return $this->successResponse(
                ['deal' => $deal],
                $deal->is_active ? 'Öne çıkan ürün aktifleştirildi.' : 'Öne çıkan ürün pasifleştirildi.'
            );
        } catch (\Exception $e) {
            return $this->handleException($e, 'Durum değiştirilemedi');
        }
    }

    public function reorder(array $deals): ServiceResponse
    {
        try {
            DB::transaction(function () use ($deals) {
                $this->featuredDealRepository->updateSortOrder($deals);
            });

            return $this->successResponse(null, 'Sıralama başarıyla güncellendi.');
        } catch (\Exception $e) {
            return $this->handleException($e, 'Sıralama güncellenemedi');
        }
    }
}
