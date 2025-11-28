<?php

namespace App\Http\Controllers\Api\V1\Vendor;

use App\Http\Controllers\Controller;
use App\Http\Requests\Vendor\StoreProductRequest;
use App\Http\Requests\Vendor\UpdateProductRequest;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use App\Services\ProductService;
use Illuminate\Http\Request;

class ProductController extends Controller
{
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
        return response()->json([ 'success' => true, 'data' => ProductResource::collection($list), 'meta' => [ 'pagination' => [ 'total' => $list->total(), 'per_page' => $list->perPage() ] ] ], 200);
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
        return response()->json(['success' => true, 'data' => new ProductResource($product)], 201);
    }

    public function show(Request $request, $id)
    {
        $vendor = $request->user();
        $product = $this->service->listForVendor($vendor)->where('id', $id)->first();
        if (! $product) {
            return response()->json(['success' => false, 'message' => 'Not found'], 404);
        }
        return response()->json(['success' => true, 'data' => new ProductResource($product)], 200);
    }

    public function update(UpdateProductRequest $request, Product $product)
    {
        $vendor = $request->user();
        if ($product->vendor_id !== $vendor->id) {
            return response()->json(['success' => false, 'message' => 'Forbidden'], 403);
        }
        $updated = $this->service->updateForVendor($vendor, $product, $request->validated());
        return response()->json(['success' => true, 'data' => new ProductResource($updated)], 200);
    }

    public function destroy(Request $request, Product $product)
    {
        $vendor = $request->user();
        if ($product->vendor_id !== $vendor->id) {
            return response()->json(['success' => false, 'message' => 'Forbidden'], 403);
        }
        $this->service->deleteForVendor($vendor, $product);
        return response()->json(['success' => true], 204);
    }
}
