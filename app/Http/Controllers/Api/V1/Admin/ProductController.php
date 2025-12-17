<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\Admin\BulkUpdateProductStatusRequest;
use App\Http\Requests\Api\V1\Admin\UpdateProductStatusRequest;
use App\Http\Resources\Api\V1\Shared\ProductResource;
use App\Models\Product;
use App\Traits\ResponseHttp;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ProductController extends Controller
{
    use ResponseHttp;

    /**
     * List all products with filters
     */
    public function index(Request $request)
    {
        $query = Product::with(['vendor', 'category', 'photos', 'variants', 'tags']);
        
        // Filter by status
        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }
        
        // Filter by vendor
        if ($request->has('vendor_id') && $request->vendor_id) {
            $query->where('vendor_id', $request->vendor_id);
        }
        
        // Search by name or SKU
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('sku', 'like', "%{$search}%");
            });
        }
        
        // Sorting
        $sortField = $request->get('sort_by', 'created_at');
        $sortDirection = $request->get('sort_direction', 'desc');
        $query->orderBy($sortField, $sortDirection);
        
        $perPage = (int) $request->query('per_page', 15);
        $products = $query->paginate($perPage);
        
        return $this->paginated(
            ProductResource::collection($products),
            'Products listed'
        );
    }

    /**
     * Get single product details
     */
    public function show($id)
    {
        $product = Product::with(['vendor', 'category', 'photos', 'variants', 'tags'])->find($id);
        
        if (!$product) {
            return $this->error('Product not found', 404);
        }
        
        return $this->success(new ProductResource($product));
    }

    /**
     * Update product status (approve/reject/publish/unpublish)
     */
    public function updateStatus(UpdateProductStatusRequest $request, $id)
    {
        $product = Product::find($id);
        
        if (!$product) {
            return $this->error('Product not found', 404);
        }
        
        $oldStatus = $product->status;
        $product->status = $request->status;
        
        // If rejecting, save rejection details
        if ($request->status === 'rejected') {
            $product->rejection_reason = $request->rejection_reason;
            $product->rejected_at = now();
            $product->rejected_by = Auth::id();
        }
        
        // If approving after rejection, clear rejection fields
        if ($request->status === 'active' && $oldStatus === 'rejected') {
            $product->rejection_reason = null;
            $product->rejected_at = null;
            $product->rejected_by = null;
        }
        
        $product->save();
        
        // Log the status change
        $statusMessages = [
            'pending' => 'Ürün onay bekliyor durumuna alındı',
            'active' => 'Ürün yayına alındı',
            'rejected' => 'Ürün reddedildi',
            'draft' => 'Ürün taslak durumuna alındı',
            'inactive' => 'Ürün pasife alındı',
            'banned' => 'Ürün yasaklandı'
        ];
        
        return $this->success(
            new ProductResource($product->fresh(['vendor', 'category', 'photos', 'variants', 'tags'])),
            $statusMessages[$request->status] ?? 'Status updated'
        );
    }

    /**
     * Bulk update status
     */
    public function bulkUpdateStatus(BulkUpdateProductStatusRequest $request)
    {
        $updateData = ['status' => $request->status];
        
        // If rejecting, add rejection details
        if ($request->status === 'rejected') {
            $updateData['rejection_reason'] = $request->rejection_reason;
            $updateData['rejected_at'] = now();
            $updateData['rejected_by'] = Auth::id();
        }
        
        // If approving, clear rejection fields
        if ($request->status === 'active') {
            $updateData['rejection_reason'] = null;
            $updateData['rejected_at'] = null;
            $updateData['rejected_by'] = null;
        }
        
        $count = Product::whereIn('id', $request->product_ids)
            ->update($updateData);
        
        return $this->success(
            ['updated_count' => $count],
            "{$count} ürün güncellendi"
        );
    }

    /**
     * Delete product (soft delete)
     */
    public function destroy($id)
    {
        $product = Product::find($id);
        
        if (!$product) {
            return $this->error('Product not found', 404);
        }
        
        $product->delete();
        
        return $this->success(null, 'Ürün silindi', 204);
    }

    /**
     * Get product statistics
     */
    public function statistics()
    {
        $stats = [
            'total' => Product::count(),
            'pending' => Product::where('status', 'pending')->count(),
            'active' => Product::where('status', 'active')->count(),
            'rejected' => Product::where('status', 'rejected')->count(),
            'draft' => Product::where('status', 'draft')->count(),
            'inactive' => Product::where('status', 'inactive')->count(),
            'banned' => Product::where('status', 'banned')->count(),
        ];
        
        return $this->success($stats, 'Product statistics');
    }
}
