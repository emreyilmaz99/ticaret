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
    protected ProductService $service;

    public function __construct(ProductService $service)
    {
        $this->service = $service;
    }
    
    use ResponseHttp;

    public function index(Request $request)
    {
        $vendor = $request->user();
        $perPage = (int) $request->query('per_page', 15);
        $list = $this->service->listForVendor($vendor, $perPage);
        $data = [
            'data' => ProductResource::collection($list),
            'meta' => [ 'pagination' => [ 'total' => $list->total(), 'per_page' => $list->perPage() ] ],
        ];
        $sr = new \App\Core\ServiceResponse();
        $sr->setSuccess(true)->setStatusCode(200)->setMessage('OK')->setData($data);
        return $this->fromServiceResponse($sr);
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
        $sr = new \App\Core\ServiceResponse();
        $sr->setSuccess(true)->setStatusCode(201)->setMessage('Created')->setData(new ProductResource($product));
        return $this->fromServiceResponse($sr);
    }

    public function show(Request $request, $id)
    {
        $vendor = $request->user();
        $product = $this->service->findForVendor($vendor, $id);
        if (! $product) {
            $sr = new \App\Core\ServiceResponse();
            $sr->setSuccess(false)->setStatusCode(404)->setMessage('Not found');
            return $this->fromServiceResponse($sr);
        }
        $sr = new \App\Core\ServiceResponse();
        $sr->setSuccess(true)->setStatusCode(200)->setMessage('OK')->setData(new ProductResource($product));
        return $this->fromServiceResponse($sr);
    }

    public function update(UpdateProductRequest $request, Product $product)
    {
        $vendor = $request->user();
        
        try {
            $updated = $this->service->updateForVendor($vendor, $product, $request->validated());
            $sr = new \App\Core\ServiceResponse();
            $sr->setSuccess(true)->setStatusCode(200)->setMessage('Updated')->setData(new ProductResource($updated));
            return $this->fromServiceResponse($sr);
        } catch (\Exception $e) {
            $sr = new \App\Core\ServiceResponse();
            $sr->setSuccess(false)->setStatusCode(403)->setMessage($e->getMessage());
            return $this->fromServiceResponse($sr);
        }
    }

    public function destroy(Request $request, Product $product)
    {
        $vendor = $request->user();
        
        try {
            $this->service->deleteForVendor($vendor, $product);
            $sr = new \App\Core\ServiceResponse();
            $sr->setSuccess(true)->setStatusCode(204)->setMessage('Deleted')->setData(null);
            return $this->fromServiceResponse($sr);
        } catch (\Exception $e) {
            $sr = new \App\Core\ServiceResponse();
            $sr->setSuccess(false)->setStatusCode(403)->setMessage($e->getMessage());
            return $this->fromServiceResponse($sr);
        }
    }
}
