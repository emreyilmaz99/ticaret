<?php

namespace App\Http\Controllers\Api\V1\Public;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\PublicRequests\SearchProductsRequest;
use App\Interfaces\Services\Product\SearchServiceInterface;
use App\Traits\ResponseHttp;
use Illuminate\Http\JsonResponse;

class SearchController extends Controller
{
    use ResponseHttp;

    public function __construct(
        protected SearchServiceInterface $searchService
    ) {}

    /**
     * Ürün araması - autocomplete için
     */
    public function search(SearchProductsRequest $request): JsonResponse
    {
        return $this->fromServiceResponse(
            $this->searchService->searchProducts($request->input('q', ''))
        );
    }

    /**
     * Gelişmiş ürün araması - filtreleme ile
     */
    public function advancedSearch(SearchProductsRequest $request): JsonResponse
    {
        return $this->fromServiceResponse(
            $this->searchService->advancedSearch($request->toFilters())
        );
    }
}
