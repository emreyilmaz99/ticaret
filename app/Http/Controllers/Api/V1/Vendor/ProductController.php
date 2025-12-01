<?php

namespace App\Http\Controllers\Api\V1\Vendor;

use App\Http\Controllers\Controller;
use App\Http\Requests\Vendor\StoreProductRequest;
use App\Http\Requests\Vendor\UpdateProductRequest;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use App\Services\ProductService;
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
            'Products listed'
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

        $product = $this->service->createForVendor($vendor, $data);
        
        return $this->success(
            new ProductResource($product),
            'Product created',
            201
        );
    }

    public function show(Request $request, $id)
    {
        $vendor = $request->user();
        $product = $this->service->findForVendor($vendor, $id);
        
        if (!$product) {
            return $this->error('Product not found', 404);
        }
        
        return $this->success(new ProductResource($product));
    }

    public function update(UpdateProductRequest $request, Product $product)
    {
        $vendor = $request->user();
        
        try {
            $updated = $this->service->updateForVendor($vendor, $product, $request->validated());
            return $this->success(
                new ProductResource($updated),
                'Product updated'
            );
        } catch (\Exception $e) {
            return $this->error($e->getMessage(), 403);
        }
    }

    public function destroy(Request $request, Product $product)
    {
        $vendor = $request->user();
        
        try {
            $this->service->deleteForVendor($vendor, $product);
            return $this->success(null, 'Product deleted', 204);
        } catch (\Exception $e) {
            return $this->error($e->getMessage(), 403);
        }
    }
}
