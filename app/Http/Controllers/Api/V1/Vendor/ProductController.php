<?php

namespace App\Http\Controllers\Api\V1\Vendor;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\Vendor\StoreProductRequest;
use App\Http\Requests\Api\V1\Vendor\UpdateProductRequest;
use App\Http\Requests\Api\V1\Vendor\UpdateProductStatusRequest;
use App\Http\Resources\Api\V1\Shared\ProductResource;
use App\Models\Product;
use App\Services\Product\ProductService;
use App\Traits\ResponseHttp;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    use ResponseHttp;
    
    protected ProductService $service;

    public function __construct(ProductService $service)
    {
        $this->service = $service;
    }

    public function index(Request $request)
    {
        $vendor = $request->user();
        $perPage = (int) $request->query('per_page', 15);
        $list = $this->service->listForVendor($vendor, $perPage);
        
        return $this->paginated(
            ProductResource::collection($list),
            'Ürünler başarıyla getirildi.'
        );
    }

    public function store(StoreProductRequest $request)
    {
        $vendor = $request->user();
        $data = $request->validated();
        // include files and complex fields
        $data['images'] = $request->file('images');
        $data['tags'] = $request->input('tags');
        $data['variants'] = $request->input('variants');

        try {
            $product = $this->service->createForVendor($vendor, $data);
            
            return $this->success(
                ['product' => new ProductResource($product)],
                'Ürün başarıyla oluşturuldu.',
                201
            );
        } catch (\Exception $e) {
            return $this->error($e->getMessage(), 400);
        }
    }

    public function show(Request $request, int $id)
    {
        $vendor = $request->user();
        $product = $this->service->findForVendor($vendor, $id);
        
        if (!$product) {
            return $this->error('Ürün bulunamadı', 404);
        }
        
        return $this->success(
            ['product' => new ProductResource($product)],
            'Ürün başarıyla getirildi.'
        );
    }

    public function update(UpdateProductRequest $request, int $id)
    {
        $vendor = $request->user();
        $product = $this->service->findForVendor($vendor, $id);

        if (!$product) {
            return $this->error('Ürün bulunamadı', 404);
        }
        
        try {
            $data = $request->validated();
            
            // Include files and complex fields if present
            if ($request->hasFile('images')) {
                $data['images'] = $request->file('images');
            }
            if ($request->has('tags')) {
                $data['tags'] = $request->input('tags');
            }
            if ($request->has('variants')) {
                $data['variants'] = $request->input('variants');
            }

            $updated = $this->service->updateForVendor($vendor, $product, $data);
            
            return $this->success(
                ['product' => new ProductResource($updated)],
                'Ürün başarıyla güncellendi.'
            );
        } catch (\Exception $e) {
            return $this->error($e->getMessage(), 400);
        }
    }

    public function destroy(Request $request, int $id)
    {
        $vendor = $request->user();
        $product = $this->service->findForVendor($vendor, $id);

        if (!$product) {
            return $this->error('Ürün bulunamadı', 404);
        }
        
        try {
            $this->service->deleteForVendor($vendor, $product);
            return $this->success(null, 'Ürün başarıyla silindi.');
        } catch (\Exception $e) {
            return $this->error($e->getMessage(), 400);
        }
    }

    public function destroyPhoto(Request $request, int $id, int $photoId)
    {
        $vendor = $request->user();
        $product = $this->service->findForVendor($vendor, $id);

        if (!$product) {
            return $this->error('Ürün bulunamadı', 404);
        }
        
        try {
            $this->service->deletePhotoForVendor($vendor, $product, $photoId);
            return $this->success(null, 'Fotoğraf başarıyla silindi.');
        } catch (\Exception $e) {
            return $this->error($e->getMessage(), 400);
        }
    }

    /**
     * Update product status (vendor can only toggle between active/inactive)
     */
    public function updateStatus(UpdateProductStatusRequest $request, int $id)
    {
        $vendor = $request->user();
        $product = $this->service->findForVendor($vendor, $id);

        if (!$product) {
            return $this->error('Ürün bulunamadı', 404);
        }

        // Sadece active olan ürünler inactive yapılabilir ve tam tersi
        if (!in_array($product->status, ['active', 'inactive'])) {
            return $this->error('Bu ürünün durumu değiştirilemez. Sadece yayında veya pasif durumundaki ürünlerin durumu değiştirilebilir.', 403);
        }

        $product->status = $request->validated()['status'];
        $product->save();

        $message = $request->validated()['status'] === 'active' ? 'Ürün yayına alındı' : 'Ürün pasife alındı';

        return $this->success(
            ['product' => new ProductResource($product->fresh(['vendor', 'category', 'photos', 'variants', 'tags']))],
            $message
        );
    }
}
