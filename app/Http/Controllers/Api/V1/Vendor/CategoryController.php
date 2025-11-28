<?php

namespace App\Http\Controllers\Api\V1\Vendor;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CategoryController extends Controller
{
    public function index(Request $request)
    {
        $vendor = $request->user();
        $perPage = (int) $request->query('per_page', 15);
        $list = Category::where('vendor_id', $vendor->id)->orderBy('sort_order', 'asc')->paginate($perPage);
        return response()->json(['success' => true, 'data' => $list], 200);
    }

    public function store(Request $request)
    {
        $vendor = $request->user();
        $data = $request->validate([
            'name' => 'required|string|max:191',
            'parent_id' => 'nullable|exists:categories,id',
            'description' => 'nullable|string',
        ]);

        $baseSlug = Str::slug($data['name']);
        $slug = $baseSlug;
        $i = 1;
        // Generate a unique slug BEFORE creating the record to avoid DB unique constraint errors
        while (Category::where('slug', $slug)->exists()) {
            $slug = $baseSlug . '-' . $i;
            $i++;
        }

        $category = Category::create([
            'vendor_id' => $vendor->id,
            'parent_id' => $data['parent_id'] ?? null,
            'name' => $data['name'],
            'slug' => $slug,
            'description' => $data['description'] ?? null,
        ]);

        return response()->json(['success' => true, 'data' => $category], 201);
    }

    public function destroy(Request $request, $id)
    {
        $vendor = $request->user();
        $category = Category::find($id);
        if (! $category) {
            return response()->json(['success' => false, 'message' => 'Not found'], 404);
        }
        if ($category->vendor_id !== $vendor->id) {
            return response()->json(['success' => false, 'message' => 'Forbidden'], 403);
        }
        $category->delete();
        return response()->json(['success' => true], 204);
    }
}
