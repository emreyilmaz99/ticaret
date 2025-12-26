<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\Admin\BulkDestroyBannedWordsRequest;
use App\Http\Requests\Api\V1\Admin\BulkStoreBannedWordsRequest;
use App\Http\Requests\Api\V1\Admin\StoreBannedWordRequest;
use App\Http\Requests\Api\V1\Admin\TestBannedWordsRequest;
use App\Http\Requests\Api\V1\Admin\UpdateBannedWordRequest;
use App\Http\Resources\Api\V1\Admin\BannedWordResource;
use App\Interfaces\Services\Admin\AdminBannedWordServiceInterface;
use App\Traits\ResponseHttp;
use Illuminate\Http\Request;

class AdminBannedWordController extends Controller
{
    use ResponseHttp;

    public function __construct(
        protected AdminBannedWordServiceInterface $service
    ) {}

    public function index(Request $request)
    {
        $filters = [
            'search' => $request->input('search'),
            'is_regex' => $request->has('is_regex') ? $request->boolean('is_regex') : null,
            'all' => $request->boolean('all'),
            'per_page' => $request->integer('per_page', 50),
        ];

        $response = $this->service->list($filters);
        
        if (!$response->isSuccess()) {
            return $this->fromServiceResponse($response);
        }

        $data = $response->getData();
        
        // Check if paginated or collection
        if ($filters['all']) {
            return $this->success(BannedWordResource::collection($data), $response->getMessage());
        }

        return $this->fromServiceResponse($response);
    }

    public function store(StoreBannedWordRequest $request)
    {
        $response = $this->service->create($request->validated());
        
        if (!$response->isSuccess()) {
            return $this->fromServiceResponse($response);
        }
        
        return $this->success(new BannedWordResource($response->getData()), $response->getMessage(), 201);
    }

    public function update(UpdateBannedWordRequest $request, int $id)
    {
        $response = $this->service->update($id, $request->validated());
        
        if (!$response->isSuccess()) {
            return $this->fromServiceResponse($response);
        }
        
        return $this->success(new BannedWordResource($response->getData()), $response->getMessage());
    }

    public function destroy(int $id)
    {
        return $this->fromServiceResponse($this->service->delete($id));
    }

    public function bulkStore(BulkStoreBannedWordsRequest $request)
    {
        return $this->fromServiceResponse($this->service->bulkCreate($request->validated()['words']));
    }

    public function bulkDestroy(BulkDestroyBannedWordsRequest $request)
    {
        return $this->fromServiceResponse($this->service->bulkDelete($request->validated()['ids']));
    }

    public function stats()
    {
        return $this->fromServiceResponse($this->service->getStats());
    }

    public function test(TestBannedWordsRequest $request)
    {
        return $this->fromServiceResponse($this->service->testText($request->validated()['text']));
    }
}
