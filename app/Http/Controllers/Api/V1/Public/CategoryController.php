<?php

namespace App\Http\Controllers\Api\V1\Public;

use App\Http\Controllers\Controller;
use App\Services\Product\CategoryService;
use App\Traits\ResponseHttp;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    use ResponseHttp;

    public function __construct(
        protected CategoryService $categoryService
    ) {}

    /**
     * Tüm aktif kategorileri listele (public)
     */
    public function index(Request $request): JsonResponse
    {
        $filters = [
            'root_only' => $request->input('root_only'),
            'parent_id' => $request->input('parent_id'),
        ];

        return $this->fromServiceResponse($this->categoryService->listPublic($filters));
    }

    /**
     * Hiyerarşik ağaç yapısında aktif kategorileri getir (public)
     */
    public function tree(): JsonResponse
    {
        return $this->fromServiceResponse($this->categoryService->getTree());
    }

    /**
     * Kategori detayı (public)
     */
    public function show(string $slug): JsonResponse
    {
        return $this->fromServiceResponse($this->categoryService->findBySlug($slug));
    }
}
